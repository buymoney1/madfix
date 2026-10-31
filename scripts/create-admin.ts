// scripts/create-admin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ⚙️ تنظیمات ادمین
const ADMIN = {
  email: "madfix@gmail.com",   // ایمیل ورود (می‌توانی عوض کنی)
  password: "Madfix@123",            // رمز عبور
  name: "madfix",                    // نام نمایشی
};

async function createAdmin() {
  console.log("\n🚀 در حال ساخت ادمین...\n");

  try {
    // بررسی وجود
    const existing = await prisma.user.findUnique({
      where: { email: ADMIN.email },
    });

    if (existing) {
      console.log(`⚠️ کاربر با ایمیل ${ADMIN.email} از قبل وجود دارد`);

      if (existing.role !== "ADMIN" || !existing.passwordHash) {
        const hashedPassword = await bcrypt.hash(ADMIN.password, 12);
        await prisma.user.update({
          where: { email: ADMIN.email },
          data: {
            role: "ADMIN",
            passwordHash: hashedPassword,
            name: ADMIN.name,
            emailVerified: new Date(),
          },
        });
        console.log("✅ کاربر به ادمین ارتقا یافت و رمز عبور بروز شد");
      } else {
        console.log("✅ کاربر از قبل ادمین است");
      }
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN.password, 12);

      await prisma.user.create({
        data: {
          email: ADMIN.email,
          passwordHash: hashedPassword,
          name: ADMIN.name,
          role: "ADMIN",
          emailVerified: new Date(),
        },
      });

      console.log("✅ ادمین با موفقیت ساخته شد!");
    }

    console.log(`\n📧 ایمیل: ${ADMIN.email}`);
    console.log(`🔑 رمز: ${ADMIN.password}`);
    console.log(`👤 نام: ${ADMIN.name}`);
    console.log(`\n🚀 آدرس ورود: http://localhost:3000/login\n`);
  } catch (error: unknown) {
    console.error("\n❌ خطا:", error instanceof Error ? error.message : error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();