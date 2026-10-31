// src/app/page.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ComponentType } from "react";
import InstagramIcon from "@/components/InstagramIcon";
import {
  Sparkles,
  Wrench,
  Cpu,
  HardDrive,
  Laptop,
  Monitor,
  ShieldCheck,
  Microscope,
  PenTool,
  Settings,
  Rocket,
  ArrowUpRight,
  Calculator,
  TrendingDown,
  BadgeCheck,
  Timer,
  Banknote,
} from "lucide-react";

// === دایره تزئینی ===
function DecorativeCircle({ className = "", size = 40, delay = 0 }: {
  className?: string; size?: number; delay?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: "easeInOut" }}
    >
      <motion.circle
        cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeDasharray="4 3"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.5, delay, ease: "easeInOut" }}
      />
      <motion.circle
        cx="20"
        cy="20"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: delay + 0.3, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

// === خط تزئینی ===
function DecorativeLine({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      width="80" height="6" viewBox="0 0 80 6" fill="none" className={className}
      initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 1, delay, ease: "easeInOut" }}
    >
      <motion.path
        d="M0,3 Q20,6 40,3 Q60,0 80,3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

function ThinDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <div className="w-px h-3 bg-[#FF5722]/30" />
      <div className="w-1 h-1 rounded-full bg-[#FFA000]/70" />
      <div className="w-px h-3 bg-[#FF5722]/30" />
    </div>
  );
}

// === دکمه CTA اصلی ===
function PrimaryCTA({
  label = "درخواست تعمیر",
  href = "/request",
  className = "",
  size = "lg",
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center mb-10 sm:mb-14">
      <DecorativeCircle
        size={46}
        className="text-[#FF5722]/50 mx-auto mb-4 sm:mb-5"
        delay={0.1}
      />
      <div className="inline-flex items-center gap-2 bg-[#FF5722]/8 rounded-full px-3 sm:px-4 py-1.5 mb-3 sm:mb-4 border border-[#FF5722]/25">
        <Sparkles className="w-3.5 h-3.5 text-[#FF5722]" />
        <span className="text-[#FF5722] text-[10px] sm:text-[11px] font-bold tracking-wider whitespace-nowrap">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-[#1A1410] text-2xl sm:text-3xl md:text-4xl font-black mb-3 px-2 leading-tight">
        {title}
      </h2>
      <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-4">
        {description}
      </p>
      <DecorativeLine
        className="mx-auto mt-4 sm:mt-5 text-[#FF5722]/45"
        delay={0.3}
      />
    </div>
  );
}

export default function HomePage() {
  const featuresRef = useRef(null);
  useInView(featuresRef, { once: true, margin: "-100px" });

  // === محتوا ===
  const diagnosisFeatures = [
    { title: "عیب‌یابی تخصصی سخت‌افزار", desc: "تشخیص دقیق مشکل مادربرد، CPU، GPU و رم با تجهیزات آزمایشگاهی پیشرفته", line: true },
    { title: "عیب‌یابی نرم‌افزاری", desc: "بررسی عمیق ویندوز، درایورها، بدافزارها و اختلالات سیستم‌عامل", line: true },
    { title: "گزارش شفاف و قیمت‌گذاری", desc: "قبل از هر تعمیری، گزارش کامل عیب و هزینه دقیق را دریافت می‌کنید", line: false },
  ];

  const repairFeatures = [
    { title: "تعمیر لپ‌تاپ", desc: "تعمیر تخصصی مادربرد، تعویض ال‌سی‌دی، تعمیر لولا، شارژ و باتری", icon: Laptop },
    { title: "تعمیر کامپیوتر و PC", desc: "رفع مشکلات پاور، مادربرد، کارت گرافیک و ارتقای سخت‌افزار", icon: Monitor },
    { title: "بازیابی اطلاعات", desc: "بازیابی اطلاعات از هارد، SSD و حافظه‌های فلش با درصد موفقیت بالا", icon: HardDrive },
  ];

  const softwareFeatures = [
    { title: "نصب و بهینه‌سازی ویندوز", desc: "نصب تخصصی ویندوز، درایور و بهینه‌سازی سرعت سیستم", icon: Settings },
    { title: "حذف بدافزار و ویروس", desc: "پاک‌سازی کامل ویروس، باج‌گیر و نرم‌افزارهای مخرب", icon: ShieldCheck },
    { title: "ارتقای سیستم", desc: "پیشنهاد و نصب SSD، رم و سخت‌افزار مناسب برای سرعت بیشتر", icon: Cpu },
  ];

  const articleFeatures = [
    { title: "مقالات تخصصی تعمیرات", desc: "آموزش‌ها و راهنمای گام‌به‌گام تعمیر لپ‌تاپ و کامپیوتر", line: true },
    { title: "راهنمای عیب‌یابی", desc: "با علائم مشکلات آشنا شوید و قبل از مراجعه، تشخیص اولیه بگیرید", line: true },
    { title: "نکات نگهداری دستگاه", desc: "با رعایت نکات ساده، عمر دستگاهت را چند برابر کن", line: false },
  ];

  const estimateItems = [
    { title: "تعمیر مادربرد", price: "از ۸۵۰,۰۰۰ تومان", note: "بسته به نوع عیب و مدل دستگاه", icon: Cpu },
    { title: "تعویض ال‌سی‌دی لپ‌تاپ", price: "از ۱,۲۰۰,۰۰۰ تومان", note: "شامل قطعه و اجرت، با ضمانت", icon: Monitor },
    { title: "بازیابی اطلاعات هارد", price: "از ۶۵۰,۰۰۰ تومان", note: "بر اساس حجم و نوع خرابی", icon: HardDrive },
    { title: "نصب ویندوز + درایور", price: "از ۲۵۰,۰۰۰ تومان", note: "به همراه بهینه‌سازی اولیه", icon: Settings },
  ];

  const heroHighlights = [
    { icon: Microscope, label: "عیب‌یابی تخصصی" },
    { icon: Wrench, label: "تعمیر حرفه‌ای" },
    { icon: HardDrive, label: "بازیابی اطلاعات" },
    { icon: Banknote, label: "تخمین هزینه" },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-[vazirmatn,sans-serif] flex flex-col relative overflow-x-hidden text-right text-[#1A1410] selection:bg-[#FF5722] selection:text-white">
      <div className="fixed top-0 right-0 w-[70%] h-[70%] bg-[#FF5722]/8 rounded-full blur-[180px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[60%] h-[60%] bg-[#FFA000]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/4 -translate-x-1/4" />
      <div className="fixed top-1/2 left-1/2 w-[40%] h-[40%] bg-[#FF5722]/5 rounded-full blur-[200px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="fixed inset-0 pointer-events-none opacity-[0.06]">
        <div className="absolute top-[20%] left-[5%] w-px h-32 bg-[#FF5722]" />
        <div className="absolute top-[40%] right-[8%] w-px h-24 bg-[#FFA000]" />
        <div className="absolute bottom-[30%] left-[15%] w-16 h-px bg-[#FF5722]" />
      </div>

      {/* === هدر === */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 py-3 sm:py-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg shadow-[#FF5722]/10 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 border border-[#FF5722]/15"
        >
          {/* برند */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
              <Image src="/logo.png" alt="مدفیکس شیراز" fill sizes="32px" className="object-contain" unoptimized />
            </div>
            <div className="h-4 sm:h-5 w-px bg-[#1A1410]/15 flex-shrink-0 hidden sm:block" />
            <span className="text-[#1A1410]/60 text-[10px] sm:text-[11px] font-medium whitespace-nowrap tracking-wider truncate">
              مدفیکس شیراز
            </span>
          </Link>

          {/* دکمه */}
          <PrimaryCTA label="درخواست تعمیر" size="md" href="/request" />
        </motion.div>
      </header>

      {/* === Hero === */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 flex flex-col items-center justify-center gap-6 sm:gap-8 max-w-5xl mx-auto w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center w-full"
        >
          {/* بج */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-[#FF5722]/8 rounded-full px-3 sm:px-4 py-1.5 mb-4 sm:mb-5 border border-[#FF5722]/25"
          >
            <Rocket className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="text-[#FF5722] text-[10px] sm:text-[11px] font-bold tracking-wider whitespace-nowrap">
              تعمیرات تخصصی در شیراز
            </span>
          </motion.div>

          {/* تیتر */}
          <h1 className="text-[#1A1410] font-black leading-[1.15] tracking-tight mb-3 sm:mb-5 px-2">
            <span className="block text-[1.75rem] xs:text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem]">
              لپ‌تاپ و کامپیوترت
            </span>
            <span className="block text-[1.75rem] xs:text-[2rem] sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4.25rem]">
              <span className="relative inline-block bg-gradient-to-l from-[#FF5722] to-[#FFA000] bg-clip-text text-transparent">
                تخصصی تعمیر
                <DecorativeLine className="absolute -bottom-1 sm:-bottom-2 lg:-bottom-3 right-0 text-[#FF5722] w-10 sm:w-14 lg:w-20 hidden xs:block" delay={0.8} />
              </span>{" "}
          می‌شه
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#1A1410]/65 text-sm sm:text-base md:text-lg leading-relaxed max-w-md md:max-w-lg font-medium mb-2 px-2"
          >
            عیب‌یابی دقیق، تعمیر حرفه‌ای و بازیابی اطلاعات — با شفافیت کامل
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-[#1A1410]/45 text-xs sm:text-sm leading-relaxed max-w-sm md:max-w-md font-medium mb-6 sm:mb-8 px-2"
          >
            تعمیر مادربرد، تعویض ال‌سی‌دی، بازیابی هارد، نصب ویندوز و ارتقای سخت‌افزار — همه در یک مرکز تخصصی
          </motion.p>

          {/* دکمه‌ها */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto px-2 sm:px-0 max-w-sm sm:max-w-none mx-auto"
          >
            <PrimaryCTA label="درخواست عیب‌یابی رایگان" size="lg" href="/request" />
            <Link
              href="/estimate"
              className="group inline-flex items-center justify-center gap-2 border border-[#FF5722]/40 hover:border-[#FF5722] hover:bg-[#FF5722]/8 text-[#FF5722] rounded-full font-bold transition-all px-5 sm:px-6 py-3.5 text-sm w-full sm:w-auto"
            >
              <Calculator className="w-4 h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">تخمین هزینه تعمیر</span>
            </Link>
          </motion.div>

            <ThinDivider className="my-7 sm:my-9" />

          {/* هایلایت‌ها */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-2xl"
          >
            {heroHighlights.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 bg-white rounded-2xl p-3 sm:p-4 border border-[#FF5722]/10 shadow-sm hover:border-[#FF5722]/30 hover:shadow-md transition-all min-h-[80px]"
              >
                <item.icon className="w-5 h-5 text-[#FF5722]" />
                <span className="text-[#1A1410]/60 text-[10px] sm:text-xs font-medium text-center leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* === بخش عیب‌یابی === */}
      <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <DecorativeCircle size={48} className="text-[#FF5722]/50 mx-auto mb-4 sm:mb-5" delay={0.1} />
          <h2 className="text-[#1A1410] text-2xl sm:text-3xl md:text-4xl font-black mb-3 px-2 leading-tight">
            اول عیب‌یابی، بعد تعمیر
          </h2>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-4">
            قبل از هر هزینه‌ای، مشکل دستگاهت را دقیق تشخیص می‌دهیم و گزارش شفاف می‌دهیم
          </p>
          <DecorativeLine className="mx-auto mt-4 sm:mt-5 text-[#FF5722]/45" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {diagnosisFeatures.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl sm:rounded-[36px] p-5 sm:p-7 border border-[#FF5722]/10 shadow-sm hover:shadow-xl hover:shadow-[#FF5722]/10 hover:border-[#FF5722]/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5722]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#FF5722]/10 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <Microscope className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF5722]" />
                  <div className="w-6 h-px bg-[#FF5722]/30" />
                </div>
                <h4 className="text-[#1A1410] font-bold text-base sm:text-lg mb-2 leading-snug">{item.title}</h4>
                <p className="text-[#1A1410]/50 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                {item.line && (
                  <div className="mt-4 w-12 h-px bg-[#FF5722]/30 group-hover:w-20 transition-all duration-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 relative z-10">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-[#1A1410]/8" />
          <DecorativeCircle size={20} className="text-[#FF5722]/30" />
          <div className="flex-1 h-px bg-[#1A1410]/8" />
        </div>
      </div>

      {/* === بخش تعمیر === */}
      <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <DecorativeCircle size={48} className="text-[#FF5722]/50 mx-auto mb-4 sm:mb-5" delay={0.1} />
          <h2 className="text-[#1A1410] text-2xl sm:text-3xl md:text-4xl font-black mb-3 px-2 leading-tight">
            تعمیر تخصصی، بدون ریسک
          </h2>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-4">
       لپ‌تاپ، کامپیوتر و هاردت را به دست متخصص بسپار 
          </p>
          <DecorativeLine className="mx-auto mt-4 sm:mt-5 text-[#FFA000]/50" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {repairFeatures.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl sm:rounded-[36px] p-5 sm:p-7 border border-[#FFA000]/15 shadow-sm hover:shadow-xl hover:shadow-[#FFA000]/15 hover:border-[#FFA000]/40 transition-all group relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFA000]/6 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl group-hover:bg-[#FFA000]/12 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFA000]" />
                  <div className="w-6 h-px bg-[#FFA000]/35" />
                </div>
                <h4 className="text-[#1A1410] font-bold text-base sm:text-lg mb-2 leading-snug">{item.title}</h4>
                <p className="text-[#1A1410]/50 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-4 w-12 h-px bg-[#FFA000]/30 group-hover:w-20 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 relative z-10">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-[#1A1410]/8" />
          <DecorativeCircle size={20} className="text-[#FFA000]/35" />
          <div className="flex-1 h-px bg-[#1A1410]/8" />
        </div>
      </div>

      {/* === بخش نرم‌افزار === */}
      <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <DecorativeCircle size={48} className="text-[#FF5722]/50 mx-auto mb-4 sm:mb-5" delay={0.1} />
          <div className="inline-flex items-center gap-2 bg-[#FF5722]/8 rounded-full px-3 sm:px-4 py-1.5 mb-3 sm:mb-4 border border-[#FF5722]/25">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="text-[#FF5722] text-[10px] sm:text-[11px] font-bold tracking-wider whitespace-nowrap">
              SOFTWARE & OPTIMIZATION
            </span>
          </div>
          <h2 className="text-[#1A1410] text-2xl sm:text-3xl md:text-4xl font-black mb-3 px-2 leading-tight">
            سیستم‌ت را دوباره نو کن
          </h2>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-4">
            نصب ویندوز، حذف بدافزار و ارتقای سخت‌افزار — سرعت و امنیت را به دستگاهت برگردان
          </p>
          <DecorativeLine className="mx-auto mt-4 sm:mt-5 text-[#FF5722]/45" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {softwareFeatures.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl sm:rounded-[36px] p-5 sm:p-7 border border-[#FF5722]/10 shadow-sm hover:shadow-xl hover:shadow-[#FF5722]/10 hover:border-[#FF5722]/30 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5722]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF5722]" />
                  <div className="w-6 h-px bg-[#FF5722]/30" />
                </div>
                <h4 className="text-[#1A1410] font-bold text-base sm:text-lg mb-2 leading-snug">{item.title}</h4>
                <p className="text-[#1A1410]/50 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-4 w-12 h-px bg-[#FF5722]/30 group-hover:w-20 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 relative z-10">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-[#1A1410]/8" />
          <DecorativeCircle size={20} className="text-[#FF5722]/30" />
          <div className="flex-1 h-px bg-[#1A1410]/8" />
        </div>
      </div>

      {/* === تخمین هزینه === */}
      <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <DecorativeCircle size={48} className="text-[#FFA000]/60 mx-auto mb-4 sm:mb-5" delay={0.1} />
          <div className="inline-flex items-center gap-2 bg-[#FFA000]/10 rounded-full px-3 sm:px-4 py-1.5 mb-3 sm:mb-4 border border-[#FFA000]/30">
            <Calculator className="w-3.5 h-3.5 text-[#F57C00]" />
            <span className="text-[#F57C00] text-[10px] sm:text-[11px] font-bold tracking-wider whitespace-nowrap">
              COST ESTIMATOR
            </span>
          </div>
          <h2 className="text-[#1A1410] text-2xl sm:text-3xl md:text-4xl font-black mb-3 px-2 leading-tight">
            هزینه تعمیرت را تخمین بزن
          </h2>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-4">
            قبل از مراجعه، محدوده قیمت خدمات رایج را ببین — شفاف، بدون هزینه پنهان
          </p>
          <DecorativeLine className="mx-auto mt-4 sm:mt-5 text-[#FFA000]/50" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {estimateItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl sm:rounded-[32px] p-5 sm:p-6 border border-[#FFA000]/20 shadow-sm hover:shadow-xl hover:shadow-[#FFA000]/15 hover:border-[#FFA000]/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFA000]/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#FFA000]/15 transition-all" />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                  <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF5722]" />
                  <span className="text-[9px] font-mono text-[#FF5722] bg-[#FF5722]/10 px-2 py-0.5 rounded-full font-bold">
                    تخمینی
                  </span>
                </div>
                <h4 className="text-[#1A1410] font-bold text-sm sm:text-base mb-2 leading-snug">{item.title}</h4>
                <p className="text-[#F57C00] font-black text-base sm:text-lg mb-1" dir="rtl">{item.price}</p>
                <p className="text-[#1A1410]/45 text-[10px] sm:text-[11px] leading-relaxed mt-auto pt-3 border-t border-[#1A1410]/8">
                  {item.note}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA تخمین دقیق */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-3xl sm:rounded-[36px] border border-[#FF5722]/25 bg-gradient-to-l from-[#FF5722]/10 via-[#FFA000]/8 to-[#FFF9F5] p-6 sm:p-10 shadow-sm"
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FF5722]/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFA000]/15 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-center md:text-right">
            <div className="flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <TrendingDown className="w-5 h-5 text-[#FF5722]" />
                <span className="text-[#FF5722] text-xs font-bold tracking-wider">تخمین دقیق‌تر</span>
              </div>
              <h3 className="text-[#1A1410] text-lg sm:text-xl md:text-2xl font-black mb-2 leading-tight">
                مدل دستگاهت را وارد کن، قیمت دقیق بگیر
              </h3>
              <p className="text-[#1A1410]/55 text-xs sm:text-sm leading-relaxed max-w-md mx-auto md:mx-0">
                با انتخاب نوع دستگاه و مشکل، تخمین دقیق‌تری از هزینه و زمان تعمیر دریافت می‌کنی
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 mt-4 text-[10px] sm:text-[11px] text-[#1A1410]/55">
                <span className="flex items-center gap-1.5 whitespace-nowrap"><BadgeCheck className="w-3.5 h-3.5 text-[#FF5722] flex-shrink-0" /> بدون هزینه پنهان</span>
                <span className="flex items-center gap-1.5 whitespace-nowrap"><Timer className="w-3.5 h-3.5 text-[#FF5722] flex-shrink-0" /> تخمین زمان تعمیر</span>
                <span className="flex items-center gap-1.5 whitespace-nowrap"><Banknote className="w-3.5 h-3.5 text-[#FF5722] flex-shrink-0" /> پرداخت پس از تعمیر</span>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="px-4 pb-10 sm:pb-14 max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="bg-white rounded-full border border-[#1A1410]/8 shadow-sm px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Newspaper className="w-4 h-4 text-[#FF5722] flex-shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-[#1A1410]/70 truncate">
                مقالات تخصصی مدفیکس
              </span>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[#FF5722] hover:text-[#F4511E] text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors"
            >
              <Calculator className="w-4 h-4 flex-shrink-0" />
              <span>محاسبه دقیق هزینه</span>
              <ArrowUpRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </section>

      <div className="max-w-7xl mx-auto w-full px-4 relative z-10">
        <div className="flex items-center justify-center gap-4">
          <div className="flex-1 h-px bg-[#1A1410]/8" />
          <DecorativeCircle size={20} className="text-[#FF5722]/30" />
          <div className="flex-1 h-px bg-[#1A1410]/8" />
        </div>
      </div>

      {/* === مقالات === */}
      <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <DecorativeCircle size={48} className="text-[#FF5722]/50 mx-auto mb-4 sm:mb-5" delay={0.1} />
          <h2 className="text-[#1A1410] text-2xl sm:text-3xl md:text-4xl font-black mb-3 px-2 leading-tight">
            دانش تعمیرات، در دسترس تو
          </h2>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-4">
            مقالات تخصصی، راهنمای عیب‌یابی و آموزش‌های گام‌به‌گام برای نگهداری بهتر دستگاهت
          </p>
          <DecorativeLine className="mx-auto mt-4 sm:mt-5 text-[#FFA000]/50" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {articleFeatures.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl sm:rounded-[36px] p-5 sm:p-7 border border-[#FFA000]/15 shadow-sm hover:shadow-xl hover:shadow-[#FFA000]/15 hover:border-[#FFA000]/40 transition-all group relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FFA000]/6 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <PenTool className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFA000]" />
                  <div className="w-6 h-px bg-[#FFA000]/35" />
                </div>
                <h4 className="text-[#1A1410] font-bold text-base sm:text-lg mb-2 leading-snug">{item.title}</h4>
                <p className="text-[#1A1410]/50 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                {item.line && (
                  <div className="mt-4 w-12 h-px bg-[#FFA000]/30 group-hover:w-20 transition-all duration-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#FF5722] hover:text-[#FFA000] transition-colors text-sm font-bold"
          >
            <span>مشاهده همه مقالات</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* === CTA نهایی === */}
      <section className="py-14 sm:py-16 px-4 max-w-3xl mx-auto w-full relative z-10 text-center">
        <DecorativeCircle size={56} className="text-[#FF5722]/40 mx-auto mb-5 sm:mb-6" delay={0.1} />
        <h2 className="text-[#1A1410] text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 px-2 leading-tight">
          دستگاهت مشکل داره؟ همین حالا اقدام کن
        </h2>
        <p className="text-[#1A1410]/55 text-xs sm:text-sm mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed px-4">
          درخواست عیب‌یابی رایگان بده و دستگاهت را به متخصصان مدفیکس شیراز بسپار
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
          <PrimaryCTA label="درخواست عیب‌یابی رایگان" size="lg" href="/requests" />
          <Link
            href="/estimate"
            className="inline-flex items-center justify-center gap-2 border border-[#FF5722]/40 hover:border-[#FF5722] hover:bg-[#FF5722]/8 text-[#FF5722] rounded-full font-bold transition-all px-5 sm:px-6 py-3.5 text-sm w-full sm:w-auto whitespace-nowrap"
          >
            <Calculator className="w-4 h-4 flex-shrink-0" />
            <span>تخمین هزینه تعمیر</span>
          </Link>
        </div>
        <DecorativeLine className="mx-auto mt-6 sm:mt-8 text-[#FF5722]/30" delay={0.5} />
      </section>

      <footer className="py-8 sm:py-10 px-4 text-center relative z-10 border-t border-[#1A1410]/8 bg-white/50">
        <div className="flex items-center justify-center gap-2 text-[#1A1410]/50 text-[11px] sm:text-xs px-2">
          <div className="w-5 h-5 relative flex-shrink-0">
            <Image
              src="/logo.png"
              alt="لوگو"
              fill
              sizes="20px"
              className="object-contain opacity-70"
              unoptimized
            />
          </div>
          <span className="text-center leading-tight">
            مدفیکس، تعمیرات تخصصی لپ‌تاپ و کامپیوتر در شیراز
          </span>
        </div>
        <ThinDivider className="my-4 mx-auto" />
        <p className="text-[#1A1410]/35 text-[10px] sm:text-[11px] mb-3 sm:mb-4 px-2 leading-relaxed">
          عیب‌یابی تخصصی • تعمیر با ضمانت • بازیابی اطلاعات • مقالات به‌روز
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[10px] sm:text-[11px] text-[#1A1410]/55">
          <Link href="/blog" className="hover:text-[#FF5722] transition-colors">مقالات</Link>
          <span className="w-px h-3 bg-[#1A1410]/15" />
          <a
            href="https://instagram.com/madfix.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF5722] transition-colors"
          >
            اینستاگرام
          </a>
          <span className="w-px h-3 bg-[#1A1410]/15" />
          <Link href="/requests" className="hover:text-[#FF5722] transition-colors">درخواست تعمیر</Link>
        </div>
      </footer>
    </div>
  );
}
