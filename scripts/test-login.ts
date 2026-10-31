// scripts/test-login.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: { email: "madfix@gmail.ir" },
  });

  if (!user) {
    console.log("❌ کاربر پیدا نشد");
    return;
  }

  console.log("user:", {
    email: user.email,
    role: user.role,
    status: user.status,
    hasHash: !!user.passwordHash,
    hashPrefix: user.passwordHash?.slice(0, 7),
  });

  if (!user.passwordHash) {
    console.log("❌ passwordHash خالیه — اسکریپت create-admin رو دوباره اجرا کن");
    return;
  }

  const ok = await bcrypt.compare("Madfix@123", user.passwordHash);
  console.log("✅ پسورد درسته؟", ok);
}
main();