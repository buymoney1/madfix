// src/app/contact/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Send,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Wrench,
  ShieldCheck,
  Users,
} from "lucide-react";

/* ============================================================
   اجزای تزئینی (هماهنگ با صفحه اصلی)
   ============================================================ */
function DecorativeCircle({
  className = "",
  size = 40,
  delay = 0,
}: {
  className?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: "easeInOut" }}
    >
      <motion.circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
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

function DecorativeLine({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      width="80"
      height="6"
      viewBox="0 0 80 6"
      fill="none"
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: "easeInOut" }}
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

/* ============================================================
   داده‌های تماس
   ============================================================ */
const socialLinks = [
  {
    name: "تلگرام",
    handle: "@madfix_ir",
    href: "https://t.me/madfix_ir",
    icon: Send,
    accent: "from-[#229ED9] to-[#1C8DC2]",
    hoverShadow: "hover:shadow-[#229ED9]/30",
    hoverBorder: "hover:border-[#229ED9]/50",
    bgHover: "group-hover:bg-[#229ED9]/10",
    textHover: "group-hover:text-[#229ED9]",
    desc: "پاسخ سریع، ارسال عکس و ویدیو مشکل، پیگیری وضعیت تعمیر",
  },
  {
    name: "اینستاگرام",
    handle: "@madfix.ir",
    href: "https://instagram.com/medfix.ir",
    icon: Send,
    accent: "from-[#E1306C] to-[#F77737]",
    hoverShadow: "hover:shadow-[#E1306C]/30",
    hoverBorder: "hover:border-[#E1306C]/50",
    bgHover: "group-hover:bg-[#E1306C]/10",
    textHover: "group-hover:text-[#E1306C]",
    desc: "نمونه‌کارها، اخبار، آموزش‌های کوتاه و پشت‌صحنه تعمیرات",
  },
];

const contactInfo = [
  {
    icon: MapPin,
    title: "آدرس حضوری",
    value: "شیراز، مرکز تخصصی مدفیکس",
    note: "امکان مراجعه در محل مشتری نیز فراهم است",
  },
  {
    icon: Phone,
    title: "تلفن تماس",
    value: "۰۷۱-XXXXXXXX",
    note: "شنبه تا پنجشنبه، ۹ صبح تا ۸ شب",
  },
  {
    icon: Mail,
    title: "ایمیل",
    value: "info@medfix.ir",
    note: "پاسخ حداکثر تا ۲۴ ساعت کاری",
  },
  {
    icon: Clock,
    title: "ساعات کاری",
    value: "شنبه تا پنجشنبه ۹ تا ۲۰",
    note: "جمعه‌ها تعطیل — پشتیبانی تلگرام ۲۴/۷",
  },
];

const trustPoints = [
  { icon: Users, label: "تیم متخصص" },
  { icon: ShieldCheck, label: "تعمیر با ضمانت" },
  { icon: Wrench, label: "عیب‌یابی دقیق" },
];

/* ============================================================
   صفحه تماس
   ============================================================ */
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] font-[vazirmatn,sans-serif] flex flex-col relative overflow-x-hidden text-right text-[#1A1410] selection:bg-[#FF5722] selection:text-white">
      {/* پس‌زمینه تزئینی */}
      <div className="fixed top-0 right-0 w-[70%] h-[70%] bg-[#FF5722]/8 rounded-full blur-[180px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[60%] h-[60%] bg-[#FFA000]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/4 -translate-x-1/4" />
      <div className="fixed top-1/2 left-1/2 w-[40%] h-[40%] bg-[#FF5722]/5 rounded-full blur-[200px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="fixed inset-0 pointer-events-none opacity-[0.06]">
        <div className="absolute top-[20%] left-[5%] w-px h-32 bg-[#FF5722]" />
        <div className="absolute top-[40%] right-[8%] w-px h-24 bg-[#FFA000]" />
        <div className="absolute bottom-[30%] left-[15%] w-16 h-px bg-[#FF5722]" />
      </div>

      {/* === هدر مینیمال (هماهنگ با صفحه اصلی) === */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 py-3 sm:py-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg shadow-[#FF5722]/10 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 border border-[#FF5722]/15"
        >
          <Link href="/" className="flex items-center gap-2 min-w-0 flex-shrink">
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0">
              <Image src="/logo.png" alt="مدفیکس شیراز" fill sizes="28px" className="object-contain" unoptimized />
            </div>
            <span className="text-[#1A1410]/70 text-[11px] sm:text-xs font-bold whitespace-nowrap">مدفیکس</span>
          </Link>

          <nav className="flex items-center gap-3 sm:gap-5 text-[11px] sm:text-xs text-[#1A1410]/60 font-medium">
            <Link href="/" className="hover:text-[#FF5722] transition-colors whitespace-nowrap">خانه</Link>
            <Link href="/#services" className="hover:text-[#FF5722] transition-colors whitespace-nowrap hidden sm:inline">خدمات</Link>
            <Link href="/estimate" className="hover:text-[#FF5722] transition-colors whitespace-nowrap hidden sm:inline">تخمین هزینه</Link>
            <Link href="/blog" className="hover:text-[#FF5722] transition-colors whitespace-nowrap">مقالات</Link>
          </nav>

          <Link
            href="/request"
            className="group inline-flex items-center gap-1.5 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-full font-bold transition-all shadow-[0_6px_20px_rgba(255,87,34,0.3)] hover:shadow-[0_10px_30px_rgba(255,87,34,0.45)] px-3 py-2 text-[10px] sm:text-xs whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            <span>درخواست تعمیر</span>
          </Link>
        </motion.div>
      </header>


      {/* === شبکه‌های اجتماعی (تلگرام و اینستاگرام) === */}
      <section className="mt-10 py-10 sm:py-14 px-4 max-w-4xl mx-auto w-full relative z-10">
        <div className="text-center mb-8 sm:mb-10">
          <DecorativeCircle size={48} className="text-[#FF5722]/50 mx-auto mb-4 sm:mb-5" delay={0.1} />
          <h2 className="text-[#1A1410] text-xl sm:text-2xl md:text-3xl font-black mb-2 px-2 leading-tight">
            ما را در شبکه‌های اجتماعی دنبال کنید
          </h2>
          <DecorativeLine className="mx-auto mt-4 sm:mt-5 text-[#FF5722]/45" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className={`group relative overflow-hidden bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-8 border shadow-sm hover:shadow-xl transition-all flex flex-col ${social.hoverShadow} ${social.hoverBorder}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-10 ${social.bgHover}`} />

                <div className="relative z-10 flex items-start justify-between mb-4">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${social.accent} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={1.8} />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[#1A1410]/30 group-hover:text-[#1A1410]/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div className="relative z-10 flex-1">
                  <h3 className={`text-[#1A1410] font-black text-lg sm:text-xl mb-1 transition-colors ${social.textHover}`}>
                    {social.name}
                  </h3>
                  <p className="text-[#1A1410]/50 text-sm font-medium mb-3 dir-ltr text-right" dir="ltr">
                    {social.handle}
                  </p>
                  <p className="text-[#1A1410]/55 text-xs sm:text-sm leading-relaxed">{social.desc}</p>
                </div>

                <div className="relative z-10 mt-5 pt-4 border-t border-[#1A1410]/8 flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] text-[#1A1410]/40 font-medium">کلیک برای باز کردن</span>
                  <ExternalLink className={`w-3.5 h-3.5 text-[#1A1410]/30 transition-colors ${social.textHover}`} />
                </div>
              </motion.a>
            );
          })}
        </div>
      </section>


      {/* === CTA نهایی === */}
      <section className="py-10 sm:py-14 px-4 max-w-3xl mx-auto w-full relative z-10 text-center">
        <DecorativeCircle size={56} className="text-[#FF5722]/40 mx-auto mb-5 sm:mb-6" delay={0.1} />
        <h2 className="text-[#1A1410] text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 px-2 leading-tight">
          دستگاهت مشکل داره؟ منتظرت هستیم
        </h2>
        <p className="text-[#1A1410]/55 text-xs sm:text-sm mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed px-4">
          در تلگرام به ما پیام بده یا درخواست عیب‌یابی رایگان ثبت کن؛ تیم متخصص مدفیکس آماده کمک است
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
          <a
            href="https://t.me/medfix_shiraz"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 bg-gradient-to-l from-[#229ED9] to-[#1C8DC2] hover:from-[#1C8DC2] hover:to-[#1577A8] text-white rounded-full font-bold transition-all shadow-[0_8px_30px_rgba(34,158,217,0.3)] hover:shadow-[0_12px_40px_rgba(34,158,217,0.45)] hover:-translate-y-0.5 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
          >
            <Send className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap">پیام در تلگرام</span>
          </a>
          <Link
            href="/request"
            className="inline-flex items-center justify-center gap-2 border border-[#FF5722]/40 hover:border-[#FF5722] hover:bg-[#FF5722]/8 text-[#FF5722] rounded-full font-bold transition-all px-5 sm:px-6 py-3.5 text-sm w-full sm:w-auto whitespace-nowrap"
          >
            <Wrench className="w-4 h-4 flex-shrink-0" />
            <span>درخواست تعمیر</span>
          </Link>
        </div>
        <DecorativeLine className="mx-auto mt-6 sm:mt-8 text-[#FF5722]/30" delay={0.5} />
      </section>

      {/* === فوتر === */}
      <footer className="py-8 sm:py-10 px-4 text-center relative z-10 border-t border-[#1A1410]/8 bg-white/50">
        <div className="flex items-center justify-center gap-2 text-[#1A1410]/50 text-[11px] sm:text-xs px-2">
          <div className="w-5 h-5 relative flex-shrink-0">
            <Image src="/logo.png" alt="لوگو" fill sizes="20px" className="object-contain opacity-70" unoptimized />
          </div>
          <span className="text-center leading-tight">
            مدفیکس؛ تیم متخصص تعمیر لپ‌تاپ، کامپیوتر، نصب سیستم‌عامل و طراحی وب در شیراز
          </span>
        </div>
        <ThinDivider className="my-4 mx-auto" />
        <p className="text-[#1A1410]/35 text-[10px] sm:text-[11px] mb-3 sm:mb-4 px-2 leading-relaxed">
          تعمیر تخصصی • نصب سیستم‌عامل • طراحی سایت • خدمات حضوری در شیراز و ارسال برای سراسر ایران
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[10px] sm:text-[11px] text-[#1A1410]/55">
          <Link href="/" className="hover:text-[#FF5722] transition-colors">خانه</Link>
          <span className="w-px h-3 bg-[#1A1410]/15" />
          <Link href="/#services" className="hover:text-[#FF5722] transition-colors">خدمات</Link>
          <span className="w-px h-3 bg-[#1A1410]/15" />
          <Link href="/blog" className="hover:text-[#FF5722] transition-colors">مقالات</Link>
          <span className="w-px h-3 bg-[#1A1410]/15" />
          <Link href="/estimate" className="hover:text-[#FF5722] transition-colors">تخمین هزینه</Link>
          <span className="w-px h-3 bg-[#1A1410]/15" />
          <Link href="/request" className="hover:text-[#FF5722] transition-colors">درخواست تعمیر</Link>
        </div>
      </footer>
    </div>
  );
}