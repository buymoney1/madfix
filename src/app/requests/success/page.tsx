// src/app/requests/success/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Phone,
  ClipboardList,
  MessageCircle,
  Clock,
} from "lucide-react";

// ─── Content ────────────────────────────────────────────────────────────────
function SuccessContent() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const phone = params.get("phone") || "";
  const name = params.get("name") || "";

  const trackingCode = id ? `#${id.slice(-8).toUpperCase()}` : "";

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-[vazirmatn,sans-serif] text-[#1A1410] relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="fixed top-0 right-0 w-[70%] h-[70%] bg-[#FF5722]/8 rounded-full blur-[180px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[60%] h-[60%] bg-[#FFA000]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* Header */}
      <header className="relative z-40 px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg shadow-[#FF5722]/10 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between border border-[#FF5722]/15 gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="مدفیکس شیراز"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <div className="h-4 sm:h-5 w-px bg-[#1A1410]/15 flex-shrink-0 hidden sm:block" />
            <span className="text-[#1A1410]/60 text-[10px] sm:text-[11px] font-medium whitespace-nowrap tracking-wider group-hover:text-[#FF5722] transition-colors truncate">
              مدفیکس شیراز
            </span>
          </Link>
          <Link
            href="/estimate"
            className="text-[#FF5722] text-xs sm:text-sm font-bold hover:text-[#F4511E] transition-colors whitespace-nowrap flex-shrink-0"
          >
            تخمین هزینه
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-10 border border-[#FF5722]/15 shadow-xl shadow-[#FF5722]/10 text-center"
        >
          {/* Check icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-l from-[#FF5722] to-[#FFA000] flex items-center justify-center shadow-lg shadow-[#FF5722]/30"
          >
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3">
            {name ? `${name.split(" ")[0]} جان، درخواستت ثبت شد!` : "درخواستت ثبت شد!"}
          </h1>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6">
            کارشناس‌های مدفیکس به‌زودی با شماره{" "}
            {phone && (
              <span dir="ltr" className="font-bold text-[#1A1410]">
                {phone}
              </span>
            )}{" "}
            تماس می‌گیرن.
          </p>

          {/* Tracking */}
          {trackingCode && (
            <div className="bg-[#FF5722]/5 border border-[#FF5722]/20 rounded-2xl p-3 mb-5 sm:mb-6">
              <p className="text-[10px] text-[#1A1410]/40 mb-1">کد پیگیری شما</p>
              <p className="text-base font-mono font-black text-[#FF5722] tracking-wider" dir="ltr">
                {trackingCode}
              </p>
            </div>
          )}

          {/* Steps */}
          <div className="bg-[#FFF9F5] rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 text-right">
            <p className="text-[11px] font-bold text-[#1A1410]/70 mb-2.5">قدم بعدی چیه؟</p>
            <div className="space-y-2">
              <StepItem
                icon={Clock}
                text="بررسی درخواستت توسط کارشناس (حداکثر ۱ ساعت کاری)"
              />
              <StepItem
                icon={Phone}
                text="تماس تلفنی برای هماهنگی زمان مراجعه"
              />
              <StepItem
                icon={ClipboardList}
                text="عیب‌یابی رایگان و اعلام قیمت دقیق"
              />
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white rounded-full font-bold px-6 py-3 sm:py-3.5 text-sm shadow-[0_8px_30px_rgba(255,87,34,0.3)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.45)] transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به صفحه اصلی</span>
            </Link>
            <Link
              href="/estimate"
              className="inline-flex items-center justify-center gap-2 border border-[#FF5722]/40 text-[#FF5722] rounded-full font-bold px-6 py-3 sm:py-3.5 text-sm hover:bg-[#FF5722]/8 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>تخمین هزینه تعمیر</span>
            </Link>
            <Link
              href="/requests"
              className="text-xs text-[#1A1410]/40 hover:text-[#FF5722] transition-colors py-2"
            >
              ثبت درخواست جدید
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// ─── Step Item ──────────────────────────────────────────────────────────────
function StepItem({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 rounded-lg bg-[#FF5722]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3 h-3 text-[#FF5722]" />
      </div>
      <p className="text-[11px] text-[#1A1410]/60 leading-relaxed">{text}</p>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function RequestSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#FF5722] border-t-transparent animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}