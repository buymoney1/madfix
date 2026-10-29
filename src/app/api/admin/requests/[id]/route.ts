// src/app/api/admin/requests/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  name: z.string().trim().min(2).max(60).optional(),
  phone: z.string().regex(/^09[0-9]{9}$/).optional(),
  problem: z.string().trim().min(5).max(2000).optional(),
  description: z.string().trim().max(2000).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const raw = await req.json().catch(() => null);
    if (!raw) {
      return NextResponse.json({ error: "بدنه درخواست نامعتبر است" }, { status: 400 });
    }

    const parsed = updateSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "داده نامعتبر" },
        { status: 400 }
      );
    }

    const existing = await prisma.repairRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "درخواست یافت نشد" }, { status: 404 });
    }

    const updated = await prisma.repairRequest.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json({ ok: true, request: updated });
  } catch (err: unknown) {
    console.error("PATCH /api/admin/requests/[id] error:", err);
    return NextResponse.json({ error: "خطا در بروزرسانی" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await prisma.repairRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "درخواست یافت نشد" }, { status: 404 });
    }
    await prisma.repairRequest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("DELETE /api/admin/requests/[id] error:", err);
    return NextResponse.json({ error: "خطا در حذف" }, { status: 500 });
  }
}