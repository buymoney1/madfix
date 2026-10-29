// src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText, Users, Eye, TrendingUp, Loader2, MessageSquare,
  Sparkles, ArrowUpLeft, Plus, PenTool, ChevronLeft, Wrench,
  ClipboardList, CheckCircle2, Clock,
} from "lucide-react";
import { toast } from "sonner";

// ==================== Types ====================
interface Stats {
  totalArticles?: number;
  publishedArticles?: number;
  totalViews?: number;
  totalRepairRequests?: number;
  todayRepairRequests?: number;
  pendingRepairRequests?: number;
  completedRepairRequests?: number;
  // فیلدهای قدیمی که ممکن است هنوز در API باشند
  totalPreregistrations?: number;
  todayPreregistrations?: number;
}

// ==================== Decorative ====================
function DecorativeCircle({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" className="opacity-30" />
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-50" />
    </svg>
  );
}

function DecorativeLine({ className = "" }: { className?: string }) {
  return (
    <svg width="60" height="5" viewBox="0 0 60 5" fill="none" className={className}>
      <path d="M0,2.5 Q15,5 30,2.5 Q45,0 60,2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" className="opacity-40" />
    </svg>
  );
}

// ==================== Skeleton ====================
function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-[#FF5722]/10" />
        <div className="h-7 w-32 bg-[#FF5722]/10 rounded-lg" />
        <div className="h-4 w-24 bg-[#FF5722]/5 rounded-md" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#1A1410]/8 p-5">
            <div className="w-8 h-8 bg-[#FF5722]/10 rounded-xl mb-4" />
            <div className="h-8 w-16 bg-[#FF5722]/10 rounded-lg mb-2" />
            <div className="h-3 w-20 bg-[#FF5722]/5 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== Helper: safe number ====================
const num = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const faNum = (v: unknown): string => num(v).toLocaleString("fa-IR");

// ==================== Main ====================
export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadingToast = toast.loading("در حال بارگذاری آمار...");

    fetch("/api/admin/stats")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "خطا در دریافت آمار");
        return data as Stats;
      })
      .then((data) => {
        if (cancelled) return;
        setStats(data ?? {});
        toast.success("آمار بارگذاری شد", { id: loadingToast });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        toast.error(err instanceof Error ? err.message : "خطا در دریافت آمار", {
          id: loadingToast,
        });
        setStats({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-red-300" />
        </div>
        <h2 className="text-lg font-bold text-[#1A1410] mb-2">خطا در دریافت اطلاعات</h2>
        <p className="text-sm text-[#1A1410]/40 mb-4">لطفاً دوباره تلاش کنید</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs font-bold text-[#FF5722] hover:text-white bg-[#FF5722]/8 hover:bg-[#FF5722] px-4 py-2 rounded-full transition-all"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  // مقادیر امن (اگر API فیلدی نداد → 0)
  const totalArticles = num(stats.totalArticles);
  const publishedArticles = num(stats.publishedArticles);
  const totalViews = num(stats.totalViews);
  const totalRepairRequests = num(stats.totalRepairRequests);
  const todayRepairRequests = num(stats.todayRepairRequests);
  const pendingRepairRequests = num(stats.pendingRepairRequests);
  const completedRepairRequests = num(stats.completedRepairRequests);

  const statsCards = [
    {
      icon: FileText,
      label: "کل مقالات",
      value: faNum(totalArticles),
      href: "/admin/articles",
      color: "from-[#FF5722]/10 to-[#FF5722]/5",
      iconColor: "text-[#FF5722]",
      bgIcon: "bg-[#FF5722]/8",
    },
    {
      icon: TrendingUp,
      label: "منتشر شده",
      value: faNum(publishedArticles),
      href: "/admin/articles?status=published",
      color: "from-emerald-50 to-emerald-100/50",
      iconColor: "text-emerald-500",
      bgIcon: "bg-emerald-50",
    },
    {
      icon: Eye,
      label: "بازدید کل",
      value: faNum(totalViews),
      href: "#",
      color: "from-purple-50 to-purple-100/50",
      iconColor: "text-purple-500",
      bgIcon: "bg-purple-50",
    },
    {
      icon: Wrench,
      label: "درخواست‌های تعمیر",
      value: faNum(totalRepairRequests),
      href: "/admin/requests",
      color: "from-[#FFA000]/15 to-[#FFA000]/5",
      iconColor: "text-[#FFA000]",
      bgIcon: "bg-[#FFA000]/10",
    },
    {
      icon: Sparkles,
      label: "درخواست امروز",
      value: faNum(todayRepairRequests),
      href: "/admin/requests?filter=today",
      color: "from-rose-50 to-rose-100/50",
      iconColor: "text-rose-500",
      bgIcon: "bg-rose-50",
      highlight: todayRepairRequests > 0,
    },
  ];

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <DecorativeCircle size={28} className="text-[#FF5722]/40 flex-shrink-0" />
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1A1410] tracking-tight">
            داشبورد مدفیکس
          </h1>
          <DecorativeLine className="text-[#FF5722] mt-1" />
        </div>
        <div className="mr-auto text-[11px] text-[#1A1410]/40 bg-white border border-[#1A1410]/8 rounded-full px-3 py-1.5 hidden sm:block">
          {new Date().toLocaleDateString("fa-IR", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
        {statsCards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="group relative bg-white rounded-2xl border border-[#1A1410]/8 p-4 md:p-5 hover:border-[#FF5722]/30 hover:shadow-lg hover:shadow-[#FF5722]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${card.color} rounded-full -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none`} />
            <div className={`relative z-10 w-9 h-9 ${card.bgIcon} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <card.icon className={`w-4 h-4 ${card.iconColor}`} />
            </div>
            <p className="relative z-10 text-xl md:text-2xl font-black text-[#1A1410] mb-1 tracking-tight">
              {card.value}
              {card.highlight && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-500 bg-emerald-50 rounded-full px-1.5 py-0.5 mr-2 align-middle">
                  <ArrowUpLeft className="w-2.5 h-2.5" />
                  جدید
                </span>
              )}
            </p>
            <p className="relative z-10 text-[11px] text-[#1A1410]/50 font-medium">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/admin/articles/new"
          className="group relative bg-white rounded-2xl border border-[#1A1410]/8 p-6 hover:border-[#FF5722]/40 hover:shadow-lg hover:shadow-[#FF5722]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FF5722]/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none" />
          <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-[#FF5722]/10 to-[#FF5722]/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <PenTool className="w-6 h-6 text-[#FF5722]" />
          </div>
          <h3 className="relative z-10 text-base font-bold text-[#1A1410] mb-1.5 group-hover:text-[#FF5722] transition-colors">
            مقاله جدید
          </h3>
          <p className="relative z-10 text-xs text-[#1A1410]/40 mb-4 leading-relaxed">
            ایجاد مقاله با کمک هوش مصنوعی
          </p>
          <span className="relative z-10 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FF5722] group-hover:gap-2 transition-all">
            <Plus className="w-3.5 h-3.5" /> شروع نوشتن
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          href="/admin/requests"
          className="group relative bg-white rounded-2xl border border-[#1A1410]/8 p-6 hover:border-[#FFA000]/40 hover:shadow-lg hover:shadow-[#FFA000]/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFA000]/15 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none" />
          <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-[#FFA000]/15 to-[#FFA000]/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <ClipboardList className="w-6 h-6 text-[#FFA000]" />
          </div>
          <h3 className="relative z-10 text-base font-bold text-[#1A1410] mb-1.5 group-hover:text-[#FFA000] transition-colors">
            درخواست‌های تعمیر
          </h3>
          <p className="relative z-10 text-xs text-[#1A1410]/40 mb-4 leading-relaxed">
            مدیریت درخواست‌های مشتریان
          </p>
          <span className="relative z-10 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FFA000] group-hover:gap-2 transition-all">
            <Wrench className="w-3.5 h-3.5" /> مشاهده
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          href="/admin/prompts"
          className="group relative bg-white rounded-2xl border border-[#1A1410]/8 p-6 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-100/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent rounded-full -translate-y-1/2 -translate-x-1/2 opacity-60 pointer-events-none" />
          <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <MessageSquare className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="relative z-10 text-base font-bold text-[#1A1410] mb-1.5 group-hover:text-purple-500 transition-colors">
            مدیریت پرامپت‌ها
          </h3>
          <p className="relative z-10 text-xs text-[#1A1410]/40 mb-4 leading-relaxed">
            ثبت و ویرایش پرامپت‌های AI
          </p>
          <span className="relative z-10 inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-500 group-hover:gap-2 transition-all">
            <Sparkles className="w-3.5 h-3.5" /> مشاهده
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </div>

      {/* Repair Status Summary */}
      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#FFA000]" />
            <h3 className="text-sm font-bold text-[#1A1410]">درخواست‌های در انتظار</h3>
          </div>
          <p className="text-2xl font-black text-[#FFA000]">{faNum(pendingRepairRequests)}</p>
          <p className="text-[10px] text-[#1A1410]/40 mt-1">نیاز به بررسی فوری</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-bold text-[#1A1410]">تکمیل شده</h3>
          </div>
          <p className="text-2xl font-black text-emerald-500">{faNum(completedRepairRequests)}</p>
          <p className="text-[10px] text-[#1A1410]/40 mt-1">درخواست‌های انجام شده</p>
        </div>
      </div>

      {/* Empty helper */}
      {totalArticles === 0 && (
        <div className="mt-6 bg-[#FF5722]/5 border border-[#FF5722]/20 rounded-2xl p-5 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#FF5722] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#FF5722] mb-1">هنوز مقاله‌ای نساختی!</p>
            <p className="text-xs text-[#FF5722]/70 leading-relaxed">
              با کلیک روی «مقاله جدید» اولین مقاله‌ات رو با هوش مصنوعی بساز.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}