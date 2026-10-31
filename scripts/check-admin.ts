// scripts/check-admin.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      role: true,
      passwordHash: true, // 👈 مهم
      emailVerified: true,
      status: true,
    },
  });
  console.log(JSON.stringify(users, null, 2));
}
main();