import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getBranchConfig() {
  return prisma.branchConfig.upsert({
    where: { id: "default-branch" },
    update: {},
    create: {
      id: "default-branch",
      branchName: "Bank Mandiri KCP Wisma Danantara Indonesia",
      branchCode: "07000",
      latitude: -6.22495,
      longitude: 106.81452,
    },
  });
}
