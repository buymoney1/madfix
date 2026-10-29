// src/app/api/admin/prompts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

    const existing = await prisma.articlePrompt.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "پرامپت یافت نشد" }, { status: 404 });
    }

    await prisma.articlePrompt.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE /api/admin/prompts/[id] error:", err);
    return NextResponse.json(
      { error: "خطا در حذف پرامپت" },
      { status: 500 }
    );
  }
}