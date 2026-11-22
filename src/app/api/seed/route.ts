import { NextResponse } from "next/server";
import { seedDatabase } from "../../../../prisma/seed";

export const dynamic = "force-dynamic";

export async function POST() {
  const seededMerchants = await seedDatabase();
  return NextResponse.json({ success: true, seededMerchants, message: "Sample South Jakarta merchants loaded successfully." });
}
