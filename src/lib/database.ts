import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Auto-increment family ID generator
export const generateFamilyId = async (): Promise<string> => {
  const count = await prisma.family.count();
  return `FAM-${String(count + 1).padStart(4, '0')}`;
};