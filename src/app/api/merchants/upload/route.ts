import { NextRequest, NextResponse } from "next/server";
import { prisma, getBranchConfig } from "@/lib/db";
import { parseMerchantCsv, type CsvRow } from "@/lib/csv";
import { calculateHealth } from "@/lib/health";

export const dynamic = "force-dynamic";

async function ingest(rows: CsvRow[]) {
  const branch = await getBranchConfig();
  const thresholds = { redVolumeThreshold: branch.redVolumeThreshold, yellowDropPctThreshold: branch.yellowDropPctThreshold };

  let inserted = 0;
  let updated = 0;
  const counts = { RED: 0, YELLOW: 0, GREEN: 0 };

  await prisma.$transaction(async (tx) => {
    for (const row of rows) {
      const healthStatus = calculateHealth(
        { status: row.status, salesVolumeCurrent: row.sales_volume_current, salesVolumePrevious: row.sales_volume_previous, txCountCurrent: row.tx_count_current },
        thresholds,
      );
      counts[healthStatus]++;

      const data = {
        cif: row.cif,
        merchantName: row.merchant_name,
        productType: row.product_type,
        tid: row.tid || null,
        status: row.status,
        salesVolumeCurrent: row.sales_volume_current,
        salesVolumePrevious: row.sales_volume_previous,
        txCountCurrent: row.tx_count_current,
        txCountPrevious: row.tx_count_previous,
        businessAddress: row.business_address,
        latitude: row.latitude,
        longitude: row.longitude,
        contactPhone: row.contact_phone || null,
        healthStatus,
        lastUploadedAt: new Date(),
      };

      const existing = await tx.merchant.findUnique({ where: { mid: row.mid }, select: { id: true } });
      if (existing) {
        await tx.merchant.update({ where: { mid: row.mid }, data });
        updated++;
      } else {
        await tx.merchant.create({ data: { ...data, mid: row.mid } });
        inserted++;
      }
    }
  });

  return { success: true, totalProcessed: rows.length, inserted, updated, redCount: counts.RED, yellowCount: counts.YELLOW, greenCount: counts.GREEN };
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  let text = "";
  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing 'file' field in multipart body" }, { status: 400 });
    }
    text = await file.text();
  } else {
    const body = await req.json().catch(() => null);
    if (typeof body?.csv === "string") text = body.csv;
    else if (Array.isArray(body?.rows)) {
      // Pre-parsed rows path: re-serialize to CSV header form is unnecessary — validate directly.
      const { rows: parsed, errors } = parseMerchantCsv(
        "cif,merchant_name,product_type,mid,tid,status,sales_volume_current,sales_volume_previous,tx_count_current,tx_count_previous,business_address,latitude,longitude,contact_phone\n" +
          body.rows.map((r: Record<string, unknown>) => Object.values(r).join(",")).join("\n"),
      );
      if (errors.length > 0) return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
      return NextResponse.json(await ingest(parsed));
    }
  }

  if (!text) return NextResponse.json({ error: "No CSV content provided" }, { status: 400 });

  const { rows, errors } = parseMerchantCsv(text);
  if (errors.length > 0) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 422 });
  }
  if (rows.length === 0) return NextResponse.json({ error: "CSV contains no data rows" }, { status: 400 });

  return NextResponse.json(await ingest(rows));
}
