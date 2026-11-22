import { NextRequest, NextResponse } from "next/server";
import { prisma, getBranchConfig } from "@/lib/db";
import { haversineMeters } from "@/lib/geo";
import type { MerchantDto, MerchantListResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_HEALTH = new Set(["ALL", "RED", "YELLOW", "GREEN"]);
const VALID_PRODUCT = new Set(["ALL", "EDC", "LIVIN_MERCHANT", "BOTH"]);

function toDto(
  m: {
    id: string; cif: string; merchantName: string; productType: string; mid: string; tid: string | null;
    status: string; salesVolumeCurrent: number; salesVolumePrevious: number; txCountCurrent: number;
    txCountPrevious: number; healthStatus: string; businessAddress: string; latitude: number;
    longitude: number; contactPhone: string | null;
    _count: { visits: number };
    visits: { visitDate: Date }[];
  },
  refLat: number,
  refLng: number,
): MerchantDto {
  const drop =
    m.salesVolumePrevious > 0
      ? ((m.salesVolumePrevious - m.salesVolumeCurrent) / m.salesVolumePrevious) * 100
      : 0;
  return {
    id: m.id,
    cif: m.cif,
    merchantName: m.merchantName,
    productType: m.productType as MerchantDto["productType"],
    mid: m.mid,
    tid: m.tid,
    status: m.status as MerchantDto["status"],
    salesVolumeCurrent: m.salesVolumeCurrent,
    salesVolumePrevious: m.salesVolumePrevious,
    dropPercentage: Math.round(drop * 100) / 100,
    txCountCurrent: m.txCountCurrent,
    txCountPrevious: m.txCountPrevious,
    healthStatus: m.healthStatus as MerchantDto["healthStatus"],
    businessAddress: m.businessAddress,
    latitude: m.latitude,
    longitude: m.longitude,
    contactPhone: m.contactPhone,
    distanceMeters: haversineMeters(refLat, refLng, m.latitude, m.longitude),
    visitCount: m._count.visits,
    lastVisitedAt: m.visits[0]?.visitDate?.toISOString() ?? null,
  };
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const statusFilter = (sp.get("status") ?? "ALL").toUpperCase();
  const productFilter = (sp.get("product") ?? "ALL").toUpperCase();

  if (!VALID_HEALTH.has(statusFilter)) {
    return NextResponse.json({ error: `Invalid status filter: ${statusFilter}` }, { status: 400 });
  }
  if (!VALID_PRODUCT.has(productFilter)) {
    return NextResponse.json({ error: `Invalid product filter: ${productFilter}` }, { status: 400 });
  }

  const search = sp.get("search")?.trim() ?? "";
  const branch = await getBranchConfig();
  const refLat = Number(sp.get("lat")) || branch.latitude;
  const refLng = Number(sp.get("lng")) || branch.longitude;

  const merchants = await prisma.merchant.findMany({
    where: {
      ...(statusFilter !== "ALL" ? { healthStatus: statusFilter as "RED" | "YELLOW" | "GREEN" } : {}),
      ...(productFilter !== "ALL" ? { productType: productFilter as "EDC" | "LIVIN_MERCHANT" | "BOTH" } : {}),
      ...(search
        ? {
            OR: [
              { merchantName: { contains: search, mode: "insensitive" } },
              { cif: { contains: search } },
              { mid: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { _count: { select: { visits: true } }, visits: { orderBy: { visitDate: "desc" }, take: 1, select: { visitDate: true } } },
  });

  const dtos = merchants.map((m) => toDto(m, refLat, refLng)).sort((a, b) => (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity));

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const completedVisitsThisMonth = await prisma.visitLog.count({ where: { visitDate: { gte: startOfMonth } } });

  const response: MerchantListResponse = {
    summary: {
      total: dtos.length,
      redCount: dtos.filter((m) => m.healthStatus === "RED").length,
      yellowCount: dtos.filter((m) => m.healthStatus === "YELLOW").length,
      greenCount: dtos.filter((m) => m.healthStatus === "GREEN").length,
      completedVisitsThisMonth,
    },
    merchants: dtos,
  };

  return NextResponse.json(response);
}
