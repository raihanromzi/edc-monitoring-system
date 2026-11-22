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

/** Synthetic South Jakarta merchants around KC Senopati. Never use real merchant data. */
const MERCHANTS: SeedMerchant[] = [
  { cif: "10982341", merchantName: "Kopi Kenangan Senopati", productType: "EDC", mid: "MID8891001", tid: "TID445501", status: "ACTIVE", salesVolumeCurrent: 1_250_000, salesVolumePrevious: 8_900_000, txCountCurrent: 18, txCountPrevious: 124, businessAddress: "Jl. Senopati No. 41, Jakarta Selatan", latitude: -6.22655, longitude: 106.8082, contactPhone: "081234567890" },
  { cif: "10982342", merchantName: "Warung Kopi Sejahtera", productType: "LIVIN_MERCHANT", mid: "LVM99201", tid: null, status: "ACTIVE", salesVolumeCurrent: 450_000, salesVolumePrevious: 1_200_000, txCountCurrent: 12, txCountPrevious: 35, businessAddress: "Jl. Suryo No. 12, Jakarta Selatan", latitude: -6.2345, longitude: 106.8123, contactPhone: "081298765432" },
  { cif: "10982343", merchantName: "Bakso Solo Samrat", productType: "EDC", mid: "MID8891003", tid: "TID445503", status: "ACTIVE", salesVolumeCurrent: 15_400_000, salesVolumePrevious: 16_200_000, txCountCurrent: 310, txCountPrevious: 325, businessAddress: "Jl. Wolter Monginsidi No. 58, Jakarta Selatan", latitude: -6.2389, longitude: 106.8184, contactPhone: "081311223344" },
  { cif: "10982344", merchantName: "Cafe Batavia Corner", productType: "BOTH", mid: "MID8891004", tid: "TID445504", status: "ACTIVE", salesVolumeCurrent: 0, salesVolumePrevious: 4_500_000, txCountCurrent: 0, txCountPrevious: 62, businessAddress: "Jl. Gunawarman No. 22, Jakarta Selatan", latitude: -6.2321, longitude: 106.8099, contactPhone: "081122334455" },
  { cif: "10982345", merchantName: "Apotek Sehat Mandiri", productType: "EDC", mid: "MID8891005", tid: "TID445505", status: "INACTIVE", salesVolumeCurrent: 0, salesVolumePrevious: 0, txCountCurrent: 0, txCountPrevious: 0, businessAddress: "Jl. Cikajang No. 18, Jakarta Selatan", latitude: -6.2401, longitude: 106.8115, contactPhone: "081566778899" },
  { cif: "10982346", merchantName: "Roti Bakar Senayan", productType: "EDC", mid: "MID8891006", tid: "TID445506", status: "ACTIVE", salesVolumeCurrent: 6_200_000, salesVolumePrevious: 6_800_000, txCountCurrent: 140, txCountPrevious: 150, businessAddress: "Jl. Senayan No. 5, Jakarta Selatan", latitude: -6.227, longitude: 106.805, contactPhone: "081300000001" },
  { cif: "10982347", merchantName: "Nasi Goreng Pak Kumis", productType: "LIVIN_MERCHANT", mid: "LVM99202", tid: null, status: "ACTIVE", salesVolumeCurrent: 2_100_000, salesVolumePrevious: 5_400_000, txCountCurrent: 40, txCountPrevious: 90, businessAddress: "Jl. Melawai Raya No. 7, Jakarta Selatan", latitude: -6.244, longitude: 106.802, contactPhone: "081300000002" },
  { cif: "10982348", merchantName: "Toko Buku Senopati", productType: "BOTH", mid: "MID8891008", tid: "TID445508", status: "ACTIVE", salesVolumeCurrent: 8_500_000, salesVolumePrevious: 8_200_000, txCountCurrent: 95, txCountPrevious: 88, businessAddress: "Jl. Senopati Raya No. 90, Jakarta Selatan", latitude: -6.231, longitude: 106.81, contactPhone: "081300000003" },
  { cif: "10982349", merchantName: "Laundry Bersih Kilat", productType: "EDC", mid: "MID8891009", tid: "TID445509", status: "ACTIVE", salesVolumeCurrent: 900_000, salesVolumePrevious: 3_200_000, txCountCurrent: 8, txCountPrevious: 40, businessAddress: "Jl. Wolter Monginsidi No. 12, Jakarta Selatan", latitude: -6.236, longitude: 106.814, contactPhone: "081300000004" },
  { cif: "10982350", merchantName: "Kedai Es Teh Manis", productType: "LIVIN_MERCHANT", mid: "LVM99203", tid: null, status: "ACTIVE", salesVolumeCurrent: 4_800_000, salesVolumePrevious: 4_600_000, txCountCurrent: 220, txCountPrevious: 210, businessAddress: "Jl. Suryo Blok M No. 3, Jakarta Selatan", latitude: -6.242, longitude: 106.806, contactPhone: "081300000005" },
  { cif: "10982351", merchantName: "Bengkel Motor Jaya", productType: "EDC", mid: "MID8891011", tid: "TID445511", status: "ACTIVE", salesVolumeCurrent: 12_000_000, salesVolumePrevious: 11_500_000, txCountCurrent: 60, txCountPrevious: 55, businessAddress: "Jl. Panglima Polim No. 20, Jakarta Selatan", latitude: -6.246, longitude: 106.8, contactPhone: "081300000006" },
  { cif: "10982352", merchantName: "Salon Cantik Senayan", productType: "BOTH", mid: "MID8891012", tid: "TID445512", status: "ACTIVE", salesVolumeCurrent: 3_400_000, salesVolumePrevious: 7_100_000, txCountCurrent: 25, txCountPrevious: 70, businessAddress: "Jl. Senayan No. 88, Jakarta Selatan", latitude: -6.225, longitude: 106.803, contactPhone: "081300000007" },
  { cif: "10982353", merchantName: "Minimarket Ceria", productType: "EDC", mid: "MID8891013", tid: "TID445513", status: "ACTIVE", salesVolumeCurrent: 22_000_000, salesVolumePrevious: 21_000_000, txCountCurrent: 480, txCountPrevious: 460, businessAddress: "Jl. Melawai No. 15, Jakarta Selatan", latitude: -6.243, longitude: 106.799, contactPhone: "081300000008" },
  { cif: "10982354", merchantName: "Toko Elektronik Maju", productType: "EDC", mid: "MID8891014", tid: "TID445514", status: "INACTIVE", salesVolumeCurrent: 0, salesVolumePrevious: 2_000_000, txCountCurrent: 0, txCountPrevious: 10, businessAddress: "Jl. Cikajang No. 5, Jakarta Selatan", latitude: -6.241, longitude: 106.813, contactPhone: "081300000009" },
  { cif: "10982355", merchantName: "Warung Nasi Padang Sederhana", productType: "LIVIN_MERCHANT", mid: "LVM99204", tid: null, status: "ACTIVE", salesVolumeCurrent: 5_500_000, salesVolumePrevious: 5_200_000, txCountCurrent: 180, txCountPrevious: 170, businessAddress: "Jl. Gunawarman No. 5, Jakarta Selatan", latitude: -6.233, longitude: 106.807, contactPhone: "081300000010" },
  { cif: "10982356", merchantName: "Kafe Kopi Pagi", productType: "BOTH", mid: "MID8891016", tid: "TID445516", status: "ACTIVE", salesVolumeCurrent: 1_800_000, salesVolumePrevious: 6_500_000, txCountCurrent: 22, txCountPrevious: 80, businessAddress: "Jl. Senopati No. 12, Jakarta Selatan", latitude: -6.228, longitude: 106.811, contactPhone: "081300000011" },
  { cif: "10982357", merchantName: "Toko Kue Manis", productType: "EDC", mid: "MID8891017", tid: "TID445517", status: "ACTIVE", salesVolumeCurrent: 7_200_000, salesVolumePrevious: 6_900_000, txCountCurrent: 150, txCountPrevious: 140, businessAddress: "Jl. Wolter Monginsidi No. 30, Jakarta Selatan", latitude: -6.237, longitude: 106.816, contactPhone: "081300000012" },
  { cif: "10982358", merchantName: "Apotek Keluarga", productType: "EDC", mid: "MID8891018", tid: "TID445518", status: "ACTIVE", salesVolumeCurrent: 9_800_000, salesVolumePrevious: 10_200_000, txCountCurrent: 200, txCountPrevious: 210, businessAddress: "Jl. Panglima Polim No. 45, Jakarta Selatan", latitude: -6.248, longitude: 106.798, contactPhone: "081300000013" },
  { cif: "10982359", merchantName: "Studio Foto Senopati", productType: "LIVIN_MERCHANT", mid: "LVM99205", tid: null, status: "ACTIVE", salesVolumeCurrent: 600_000, salesVolumePrevious: 2_800_000, txCountCurrent: 5, txCountPrevious: 30, businessAddress: "Jl. Suryo No. 28, Jakarta Selatan", latitude: -6.235, longitude: 106.81, contactPhone: "081300000014" },
  { cif: "10982360", merchantName: "Restoran Sunda Asli", productType: "BOTH", mid: "MID8891020", tid: "TID445520", status: "ACTIVE", salesVolumeCurrent: 18_500_000, salesVolumePrevious: 17_800_000, txCountCurrent: 260, txCountPrevious: 250, businessAddress: "Jl. Melawai Raya No. 22, Jakarta Selatan", latitude: -6.245, longitude: 106.804, contactPhone: "081300000015" },
  { cif: "10982361", merchantName: "Toko Sepatu Baru", productType: "EDC", mid: "MID8891021", tid: "TID445521", status: "ACTIVE", salesVolumeCurrent: 3_100_000, salesVolumePrevious: 3_400_000, txCountCurrent: 18, txCountPrevious: 20, businessAddress: "Jl. Senayan No. 60, Jakarta Selatan", latitude: -6.226, longitude: 106.801, contactPhone: "081300000016" },
  { cif: "10982362", merchantName: "Warung Makan Ibu Siti", productType: "LIVIN_MERCHANT", mid: "LVM99206", tid: null, status: "ACTIVE", salesVolumeCurrent: 2_400_000, salesVolumePrevious: 2_200_000, txCountCurrent: 90, txCountPrevious: 85, businessAddress: "Jl. Cikajang No. 30, Jakarta Selatan", latitude: -6.239, longitude: 106.815, contactPhone: "081300000017" },
];

export async function seedDatabase() {
  await prisma.visitLog.deleteMany();
  await prisma.merchant.deleteMany();

  const branch = await prisma.branchConfig.upsert({
    where: { id: "default-branch" },
    update: {},
    create: { id: "default-branch" },
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
