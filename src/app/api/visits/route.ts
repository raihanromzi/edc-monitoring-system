import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { CreateVisitSchema } from "@/lib/validations/visit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = CreateVisitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid visit payload", details: parsed.error.flatten() }, { status: 400 });
  }

  const merchant = await prisma.merchant.findUnique({ where: { id: parsed.data.merchantId }, select: { id: true } });
  if (!merchant) {
    return NextResponse.json({ error: `Merchant ${parsed.data.merchantId} not found` }, { status: 404 });
  }

  const visit = await prisma.visitLog.create({
    data: {
      merchantId: parsed.data.merchantId,
      visitorName: parsed.data.visitorName,
      rootCause: parsed.data.rootCause,
      actionTaken: parsed.data.actionTaken,
      notes: parsed.data.notes,
      status: "DONE",
    },
  });

  return NextResponse.json(visit, { status: 201 });
}

export async function GET(req: NextRequest) {
  const merchantId = req.nextUrl.searchParams.get("merchantId");
  if (!merchantId) {
    return NextResponse.json({ error: "merchantId query parameter is required" }, { status: 400 });
  }

  const visits = await prisma.visitLog.findMany({
    where: { merchantId },
    orderBy: { visitDate: "desc" },
  });

  return NextResponse.json(visits);
}
