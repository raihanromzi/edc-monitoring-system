import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma, getBranchConfig } from "@/lib/db";
import { calculateHealth } from "@/lib/health";

export const dynamic = "force-dynamic";

const ConfigSchema = z.object({
  branchName: z.string().min(1).optional(),
  branchCode: z.string().min(1).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  redVolumeThreshold: z.coerce.number().min(0).optional(),
  yellowDropPctThreshold: z.coerce.number().min(0).max(1).optional(),
  redInactivityDays: z.coerce.number().int().min(0).optional(),
});

export async function GET() {
  return NextResponse.json(await getBranchConfig());
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = ConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid branch configuration", details: parsed.error.flatten() }, { status: 400 });
  }

  const config = await prisma.branchConfig.upsert({
    where: { id: "default-branch" },
    update: parsed.data,
    create: { id: "default-branch", ...parsed.data },
  });

  // Recalculate all merchant health against new thresholds.
  const merchants = await prisma.merchant.findMany({ select: { id: true, status: true, salesVolumeCurrent: true, salesVolumePrevious: true, txCountCurrent: true } });
  const thresholds = { redVolumeThreshold: config.redVolumeThreshold, yellowDropPctThreshold: config.yellowDropPctThreshold };
  await Promise.all(
    merchants.map((m) => {
      const healthStatus = calculateHealth(m, thresholds);
      return prisma.merchant.update({ where: { id: m.id }, data: { healthStatus } });
    }),
  );

  return NextResponse.json(config);
}
