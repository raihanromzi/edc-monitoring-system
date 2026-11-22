import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const CoordinateSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = CoordinateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid coordinates", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const updated = await prisma.merchant.update({
      where: { id },
      data: { latitude: parsed.data.latitude, longitude: parsed.data.longitude },
      select: { id: true, latitude: true, longitude: true, updatedAt: true },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: `Merchant ${id} not found` }, { status: 404 });
  }
}
