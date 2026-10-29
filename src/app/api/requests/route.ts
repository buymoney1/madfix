// app/api/requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const phoneSchema = z
  .string()
  .regex(/^09[0-9]{9}$/, "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد");

const createRequestSchema = z.object({
  name: z.string().trim().min(2, "نام حداقل ۲ کاراکتر").max(60),
  phone: phoneSchema,
  deviceType: z.string().trim().min(1, "نوع دستگاه الزامی است").max(50),
  problem: z.string().trim().min(5, "شرح مشکل حداقل ۵ کاراکتر").max(2000),
  brand: z.string().trim().max(60).optional(),
  model: z.string().trim().max(60).optional(),
  description: z.string().trim().max(2000).optional(),
  address: z.string().trim().max(300).optional(),
  email: z
    .string()
    .trim()
    .email("ایمیل نامعتبر")
    .max(120)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

const toEnglishDigits = (str: string): string => {
  const persian = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
  const arabic  = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
  let out = str;
  for (let i = 0; i < 10; i++) {
    out = out
      .replace(new RegExp(persian[i], "g"), String(i))
      .replace(new RegExp(arabic[i], "g"), String(i));
  }
  return out;
};

const formatZodError = (err: z.ZodError): string =>
  err.issues[0]?.message || "داده‌های ورودی نامعتبر است";

const isValidObjectId = (id: unknown): id is string =>
  typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json().catch(() => null);
    if (!raw || typeof raw !== "object") {
      return NextResponse.json(
        { ok: false, error: "بدنه درخواست نامعتبر است" },
        { status: 400 }
      );
    }

    const normalized = {
      ...raw,
      phone:
        typeof raw.phone === "string"
          ? toEnglishDigits(raw.phone).replace(/[^0-9]/g, "")
          : raw.phone,
    };

    const parsed = createRequestSchema.safeParse(normalized);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    let userId: string | undefined;
    try {
      const session = await auth();
      if (isValidObjectId(session?.user?.id)) userId = session.user.id;
    } catch {}

    const newRequest = await prisma.repairRequest.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        deviceType: parsed.data.deviceType,
        problem: parsed.data.problem,
        brand: parsed.data.brand ?? undefined,
        model: parsed.data.model ?? undefined,
        description: parsed.data.description ?? undefined,
        address: parsed.data.address ?? undefined,
        email: parsed.data.email ?? undefined,
        ...(userId ? { userId } : {}),
      },
      select: { id: true },
    });

    return NextResponse.json(
      { ok: true, success: true, id: newRequest.id, message: "درخواست با موفقیت ثبت شد" },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST /api/requests error:", err);
    return NextResponse.json(
      { ok: false, error: "خطا در ثبت درخواست، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const isAdmin = session?.user?.role === "ADMIN"; // ✅ حرف بزرگ

    if (!isAdmin && !isValidObjectId(session?.user?.id)) {
      return NextResponse.json({
        ok: true,
        requests: [],
        pagination: { page: 1, limit: 0, total: 0, totalPages: 0 },
      });
    }

    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const skip  = (page - 1) * limit;

    const where: Record<string, unknown> = isAdmin
      ? {}
      : { userId: session!.user!.id };

    const [requests, total] = await Promise.all([
      prisma.repairRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true, name: true, phone: true, deviceType: true,
          problem: true, brand: true, model: true, status: true, createdAt: true,
        },
      }),
      prisma.repairRequest.count({ where }),
    ]);

    return NextResponse.json({
      ok: true,
      requests,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err: unknown) {
    console.error("GET /api/requests error:", err);
    return NextResponse.json(
      { ok: false, error: "خطا در دریافت درخواست‌ها" },
      { status: 500 }
    );
  }
}