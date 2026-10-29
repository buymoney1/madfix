// src/app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      totalArticles,
      publishedArticles,
      totalViewsAgg,
      totalRepairRequests,
      todayRepairRequests,
      pendingRepairRequests,
      completedRepairRequests,
    ] = await Promise.all([
      prisma.seoArticle.count(),
      prisma.seoArticle.count({ where: { isPublished: true } }),
      prisma.seoArticle.aggregate({ _sum: { viewCount: true } }),
      prisma.repairRequest.count(),
      prisma.repairRequest.count({
        where: { createdAt: { gte: startOfDay, lte: endOfDay } },
      }),
      prisma.repairRequest.count({ where: { status: "PENDING" } }),
      prisma.repairRequest.count({ where: { status: "COMPLETED" } }),
    ]);

    return NextResponse.json({
      totalArticles,
      publishedArticles,
      totalViews: totalViewsAgg._sum.viewCount ?? 0,
      totalRepairRequests,
      todayRepairRequests,
      pendingRepairRequests,
      completedRepairRequests,
    });
  } catch (err: unknown) {
    console.error("GET /api/admin/stats error:", err);
    return NextResponse.json(
      { error: "خطا در دریافت آمار" },
      { status: 500 }
    );
  }
}