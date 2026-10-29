// src/app/api/cron/auto-blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { autoGenerateAndPublish } from "@/lib/auto-blogger";

export const runtime = "nodejs";
export const maxDuration = 60; // برای Vercel (حداکثر تا 300 در Pro)

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("\n⏰ CRON JOB: Auto Blogger\n");

    const result = await autoGenerateAndPublish();

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    console.error("❌ CRON error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}