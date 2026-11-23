import { PrismaClient, type ProductType, type OperationalStatus } from "@prisma/client";
import { calculateHealth } from "../src/lib/health";

const prisma = new PrismaClient();

interface SeedMerchant {
  cif: string;
  merchantName: string;
  productType: ProductType;
  mid: string;
  tid: string | null;
  status: OperationalStatus;
  salesVolumeCurrent: number;
  salesVolumePrevious: number;
  txCountCurrent: number;
  txCountPrevious: number;
  businessAddress: string;
  latitude: number;
  longitude: number;
  contactPhone: string;
}

/** Synthetic merchants around Bank Mandiri KCP Wisma Danantara Indonesia (Jl. Jend. Gatot Subroto Kav. 36-38). Never use real merchant data. */
const MERCHANTS: SeedMerchant[] = [
  { cif: "10982341", merchantName: "Kopi Kenangan Menara Mulia", productType: "EDC", mid: "MID8891001", tid: "TID445501", status: "ACTIVE", salesVolumeCurrent: 1_250_000, salesVolumePrevious: 8_900_000, txCountCurrent: 18, txCountPrevious: 124, businessAddress: "Menara Mulia GF, Jl. Jend. Gatot Subroto Kav. 9-11, Jakarta Selatan", latitude: -6.2258, longitude: 106.8172, contactPhone: "081234567890" },
  { cif: "10982342", merchantName: "Warung Kopi Sejahtera Tendean", productType: "LIVIN_MERCHANT", mid: "LVM99201", tid: null, status: "ACTIVE", salesVolumeCurrent: 450_000, salesVolumePrevious: 1_200_000, txCountCurrent: 12, txCountPrevious: 35, businessAddress: "Jl. Kapten Tendean No. 12, Mampang, Jakarta Selatan", latitude: -6.2345, longitude: 106.8210, contactPhone: "081298765432" },
  { cif: "10982343", merchantName: "Bakmi GM Semanggi", productType: "EDC", mid: "MID8891003", tid: "TID445503", status: "ACTIVE", salesVolumeCurrent: 15_400_000, salesVolumePrevious: 16_200_000, txCountCurrent: 310, txCountPrevious: 325, businessAddress: "Plaza Semanggi Lt. 3A, Jl. Jend. Sudirman Kav. 50, Jakarta Selatan", latitude: -6.2198, longitude: 106.8152, contactPhone: "081311223344" },
  { cif: "10982344", merchantName: "Cafe Batavia SCBD", productType: "BOTH", mid: "MID8891004", tid: "TID445504", status: "ACTIVE", salesVolumeCurrent: 0, salesVolumePrevious: 4_500_000, txCountCurrent: 0, txCountPrevious: 62, businessAddress: "Fairgrounds SCBD Lot 14, Jl. Jend. Sudirman, Jakarta Selatan", latitude: -6.2268, longitude: 106.8085, contactPhone: "081122334455" },
  { cif: "10982345", merchantName: "Apotek Century Menara Jamsostek", productType: "EDC", mid: "MID8891005", tid: "TID445505", status: "INACTIVE", salesVolumeCurrent: 0, salesVolumePrevious: 0, txCountCurrent: 0, txCountPrevious: 0, businessAddress: "Menara Jamsostek GF, Jl. Jend. Gatot Subroto Kav. 38, Jakarta Selatan", latitude: -6.2285, longitude: 106.8198, contactPhone: "081566778899" },
  { cif: "10982346", merchantName: "Starbucks Wisma Danantara", productType: "EDC", mid: "MID8891006", tid: "TID445506", status: "ACTIVE", salesVolumeCurrent: 18_500_000, salesVolumePrevious: 17_900_000, txCountCurrent: 340, txCountPrevious: 330, businessAddress: "Wisma Danantara GF, Jl. Jend. Gatot Subroto Kav. 36-38, Jakarta Selatan", latitude: -6.2249, longitude: 106.8146, contactPhone: "081300000001" },
  { cif: "10982347", merchantName: "Nasi Goreng Kebon Sirih Gatot Subroto", productType: "LIVIN_MERCHANT", mid: "LVM99202", tid: null, status: "ACTIVE", salesVolumeCurrent: 2_100_000, salesVolumePrevious: 5_400_000, txCountCurrent: 40, txCountPrevious: 90, businessAddress: "Kantin Pujasera Menara Jamsostek, Jl. Gatot Subroto, Jakarta Selatan", latitude: -6.2282, longitude: 106.8195, contactPhone: "081300000002" },
  { cif: "10982348", merchantName: "Toko Buku Periplus Pacific Place", productType: "BOTH", mid: "MID8891008", tid: "TID445508", status: "ACTIVE", salesVolumeCurrent: 8_500_000, salesVolumePrevious: 8_200_000, txCountCurrent: 95, txCountPrevious: 88, businessAddress: "Pacific Place Mall Lt. 3, SCBD, Jakarta Selatan", latitude: -6.2244, longitude: 106.8096, contactPhone: "081300000003" },
  { cif: "10982349", merchantName: "Laundry 5asec Senopati", productType: "EDC", mid: "MID8891009", tid: "TID445509", status: "ACTIVE", salesVolumeCurrent: 900_000, salesVolumePrevious: 3_200_000, txCountCurrent: 8, txCountPrevious: 40, businessAddress: "Jl. Suryo No. 22, Senopati, Jakarta Selatan", latitude: -6.2340, longitude: 106.8110, contactPhone: "081300000004" },
  { cif: "10982350", merchantName: "Kedai Es Teh Manis Danantara", productType: "LIVIN_MERCHANT", mid: "LVM99203", tid: null, status: "ACTIVE", salesVolumeCurrent: 4_800_000, salesVolumePrevious: 4_600_000, txCountCurrent: 220, txCountPrevious: 210, businessAddress: "Pujasera Belakang Wisma Danantara, Jl. Gatot Subroto, Jakarta Selatan", latitude: -6.2253, longitude: 106.8142, contactPhone: "081300000005" },
  { cif: "10982351", merchantName: "Bengkel Auto2000 Gatot Subroto", productType: "EDC", mid: "MID8891011", tid: "TID445511", status: "ACTIVE", salesVolumeCurrent: 28_000_000, salesVolumePrevious: 26_500_000, txCountCurrent: 60, txCountPrevious: 55, businessAddress: "Jl. Jend. Gatot Subroto Kav. 55, Jakarta Selatan", latitude: -6.2310, longitude: 106.8260, contactPhone: "081300000006" },
  { cif: "10982352", merchantName: "Salon Johnny Andrean Semanggi", productType: "BOTH", mid: "MID8891012", tid: "TID445512", status: "ACTIVE", salesVolumeCurrent: 3_400_000, salesVolumePrevious: 7_100_000, txCountCurrent: 25, txCountPrevious: 70, businessAddress: "Plaza Semanggi Lt. 2, Jl. Jend. Sudirman Kav. 50, Jakarta Selatan", latitude: -6.2195, longitude: 106.8150, contactPhone: "081300000007" },
  { cif: "10982353", merchantName: "Minimarket Bright Danantara", productType: "EDC", mid: "MID8891013", tid: "TID445513", status: "ACTIVE", salesVolumeCurrent: 22_000_000, salesVolumePrevious: 21_000_000, txCountCurrent: 480, txCountPrevious: 460, businessAddress: "Wisma Danantara B1, Jl. Jend. Gatot Subroto Kav. 36-38, Jakarta Selatan", latitude: -6.2251, longitude: 106.8144, contactPhone: "081300000008" },
  { cif: "10982354", merchantName: "Toko Elektronik Mega Tendean", productType: "EDC", mid: "MID8891014", tid: "TID445514", status: "INACTIVE", salesVolumeCurrent: 0, salesVolumePrevious: 2_000_000, txCountCurrent: 0, txCountPrevious: 10, businessAddress: "Jl. Kapten Tendean No. 8, Mampang, Jakarta Selatan", latitude: -6.2360, longitude: 106.8215, contactPhone: "081300000009" },
  { cif: "10982355", merchantName: "Restoran Garuda Gatot Subroto", productType: "LIVIN_MERCHANT", mid: "LVM99204", tid: null, status: "ACTIVE", salesVolumeCurrent: 14_200_000, salesVolumePrevious: 13_800_000, txCountCurrent: 180, txCountPrevious: 170, businessAddress: "Jl. Jend. Gatot Subroto Kav. 32, Jakarta Selatan", latitude: -6.2262, longitude: 106.8205, contactPhone: "081300000010" },
  { cif: "10982356", merchantName: "Tanamera Coffee Pacific Place", productType: "BOTH", mid: "MID8891016", tid: "TID445516", status: "ACTIVE", salesVolumeCurrent: 6_200_000, salesVolumePrevious: 9_500_000, txCountCurrent: 65, txCountPrevious: 110, businessAddress: "Pacific Place Mall LG, SCBD, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan", latitude: -6.2245, longitude: 106.8098, contactPhone: "081300000011" },
  { cif: "10982357", merchantName: "Djournal Coffee Pacific Place", productType: "EDC", mid: "MID8891017", tid: "TID445517", status: "ACTIVE", salesVolumeCurrent: 12_400_000, salesVolumePrevious: 12_100_000, txCountCurrent: 160, txCountPrevious: 155, businessAddress: "Pacific Place Mall Level 1, SCBD, Jakarta Selatan", latitude: -6.2243, longitude: 106.8095, contactPhone: "081300000012" },
  { cif: "10982358", merchantName: "Klinik Kimia Farma Gatot Subroto", productType: "EDC", mid: "MID8891018", tid: "TID445518", status: "ACTIVE", salesVolumeCurrent: 9_800_000, salesVolumePrevious: 10_200_000, txCountCurrent: 200, txCountPrevious: 210, businessAddress: "Jl. Jend. Gatot Subroto No. 70, Jakarta Selatan", latitude: -6.2270, longitude: 106.8210, contactPhone: "081300000013" },
  { cif: "10982359", merchantName: "Studio Foto Danantara Corner", productType: "LIVIN_MERCHANT", mid: "LVM99205", tid: null, status: "ACTIVE", salesVolumeCurrent: 600_000, salesVolumePrevious: 2_800_000, txCountCurrent: 5, txCountPrevious: 30, businessAddress: "Wisma Danantara Lt. 2, Jl. Jend. Gatot Subroto Kav. 36-38, Jakarta Selatan", latitude: -6.2250, longitude: 106.8145, contactPhone: "081300000014" },
  { cif: "10982360", merchantName: "Paul Bakery Pacific Place", productType: "BOTH", mid: "MID8891020", tid: "TID445520", status: "ACTIVE", salesVolumeCurrent: 18_500_000, salesVolumePrevious: 17_800_000, txCountCurrent: 260, txCountPrevious: 250, businessAddress: "Pacific Place Mall GF, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan", latitude: -6.2241, longitude: 106.8092, contactPhone: "081300000015" },
  { cif: "10982361", merchantName: "Anomali Coffee Senopati", productType: "EDC", mid: "MID8891021", tid: "TID445521", status: "ACTIVE", salesVolumeCurrent: 8_100_000, salesVolumePrevious: 8_400_000, txCountCurrent: 110, txCountPrevious: 115, businessAddress: "Jl. Senopati No. 19, Kebayoran Baru, Jakarta Selatan", latitude: -6.2285, longitude: 106.8078, contactPhone: "081300000016" },
  { cif: "10982362", merchantName: "Warung Nasi Ampera Tendean", productType: "LIVIN_MERCHANT", mid: "LVM99206", tid: null, status: "ACTIVE", salesVolumeCurrent: 2_400_000, salesVolumePrevious: 2_200_000, txCountCurrent: 90, txCountPrevious: 85, businessAddress: "Jl. Kapten Tendean No. 18, Mampang Prapatan, Jakarta Selatan", latitude: -6.2365, longitude: 106.8220, contactPhone: "081300000017" },
];

export async function seedDatabase() {
  await prisma.visitLog.deleteMany();
  await prisma.merchant.deleteMany();

  const branch = await prisma.branchConfig.upsert({
    where: { id: "default-branch" },
    update: {
      branchName: "Bank Mandiri KCP Wisma Danantara Indonesia",
      branchCode: "07000",
      latitude: -6.22495,
      longitude: 106.81452,
    },
    create: {
      id: "default-branch",
      branchName: "Bank Mandiri KCP Wisma Danantara Indonesia",
      branchCode: "07000",
      latitude: -6.22495,
      longitude: 106.81452,
    },
  });

  const thresholds = { redVolumeThreshold: branch.redVolumeThreshold, yellowDropPctThreshold: branch.yellowDropPctThreshold };

  for (const m of MERCHANTS) {
    const healthStatus = calculateHealth(m, thresholds);
    await prisma.merchant.create({ data: { ...m, healthStatus } });
  }

  return MERCHANTS.length;
}

async function main() {
  const count = await seedDatabase();
  console.log(`Seeded ${count} synthetic merchants.`);
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
