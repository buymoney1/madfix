// src/app/page.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Wrench,
  Laptop,
  Monitor,
  Cpu,
  ShieldCheck,
  Settings,
  Terminal,
  Apple,
  Globe,
  Code2,
  Store,
  AppWindow,
  Calculator,
  ArrowUpRight,
  Rocket,
  BookOpen,
  MapPin,
  Truck,
  Users,
  Microscope,
  BadgeCheck,
  Timer,
  Banknote,
  TrendingDown,
  Server,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

/* ============================================================
   تنظیمات رنگ
   ============================================================ */
const accents = {
  orange: {
    text: "text-[#FF5722]",
    border: "border-[#FF5722]/10 hover:border-[#FF5722]/30",
    shadow: "hover:shadow-[#FF5722]/10",
    blob: "bg-[#FF5722]/5 group-hover:bg-[#FF5722]/10",
    line: "bg-[#FF5722]/30",
  },
  amber: {
    text: "text-[#FFA000]",
    border: "border-[#FFA000]/15 hover:border-[#FFA000]/40",
    shadow: "hover:shadow-[#FFA000]/15",
    blob: "bg-[#FFA000]/6 group-hover:bg-[#FFA000]/12",
    line: "bg-[#FFA000]/35",
  },
} as const;

type Accent = keyof typeof accents;

/* ============================================================
   اجزای تزئینی
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

function SectionDivider({ accent = "orange" }: { accent?: Accent }) {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 relative z-10">
      <div className="flex items-center justify-center gap-4">
        <div className="flex-1 h-px bg-[#1A1410]/8" />
        <DecorativeCircle size={20} className={accent === "orange" ? "text-[#FF5722]/30" : "text-[#FFA000]/35"} />
        <div className="flex-1 h-px bg-[#1A1410]/8" />
      </div>
    </div>
  );
}

/* ============================================================
   دکمه‌ها
   ============================================================ */
function PrimaryCTA({
  label = "درخواست تعمیر",
  href = "/request",
  className = "",
  size = "lg",
}: {
  label?: string;
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses =
    size === "lg"
      ? "px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base w-full sm:w-auto justify-center"
      : size === "md"
      ? "px-4 sm:px-5 py-2.5 text-xs sm:text-sm"
      : "px-3 py-2 text-[10px] sm:text-xs";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-full font-bold transition-all shadow-[0_8px_30px_rgba(255,87,34,0.3)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.45)] hover:-translate-y-0.5 active:translate-y-0 ${sizeClasses} ${className}`}
    >
      <Sparkles className="w-4 h-4 flex-shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
      <ArrowUpRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </Link>
  );
}

function OutlineCTA({
  label,
  href,
  icon: Icon = Calculator,
  className = "",
}: {
  label: string;
  href: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 border border-[#FF5722]/40 hover:border-[#FF5722] hover:bg-[#FF5722]/8 text-[#FF5722] rounded-full font-bold transition-all px-5 sm:px-6 py-3.5 text-sm w-full sm:w-auto whitespace-nowrap ${className}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

/* ============================================================
   کارت خدمت
   ============================================================ */
function ServiceCard({
  title,
  desc,
  icon: Icon,
  accent,
  index,
  showLine = true,
}: {
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: Accent;
  index: number;
  showLine?: boolean;
}) {
  const a = accents[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12 }}
      whileHover={{ y: -4 }}
      className={`bg-white rounded-3xl sm:rounded-[36px] p-5 sm:p-7 border shadow-sm hover:shadow-xl transition-all group relative overflow-hidden ${a.border} ${a.shadow}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl transition-all ${a.blob}`} />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${a.text}`} />
          <div className={`w-6 h-px ${a.line}`} />
        </div>
        <h4 className="text-[#1A1410] font-bold text-base sm:text-lg mb-2 leading-snug">{title}</h4>
        <p className="text-[#1A1410]/50 text-xs sm:text-sm leading-relaxed">{desc}</p>
        {showLine && <div className={`mt-4 w-12 h-px group-hover:w-20 transition-all duration-500 ${a.line}`} />}
      </div>
    </motion.div>
  );
}

/* ============================================================
   داده‌ها
   ============================================================ */
const heroHighlights = [
  { icon: Microscope, label: "تیم متخصص عیب‌یابی" },
  { icon: Wrench, label: "تعمیر لپ‌تاپ و PC" },
  { icon: Terminal, label: "نصب سیستم‌عامل" },
  { icon: Code2, label: "طراحی سایت" },
];

const repairServices: { title: string; desc: string; icon: LucideIcon }[] = [
  {
    title: "تعمیر تخصصی لپ‌تاپ",
    desc: "تعمیر مادربرد، تعویض ال‌سی‌دی، تعمیر لولا، رفع مشکل شارژ و باتری توسط تیم متخصص مدفیکس",
    icon: Laptop,
  },
  {
    title: "تعمیر کامپیوتر و PC",
    desc: "رفع مشکلات پاور، مادربرد، کارت گرافیک و عیب‌یابی دقیق سخت‌افزار دسکتاپ",
    icon: Monitor,
  },
  {
    title: "ارتقای سخت‌افزار",
    desc: "پیشنهاد و نصب SSD، رم و قطعات مناسب برای افزایش سرعت و عمر دستگاه",
    icon: Cpu,
  },
];

const osServices: { title: string; desc: string; icon: LucideIcon }[] = [
  {
    title: "نصب انواع ویندوز",
    desc: "نصب ویندوز ۷، ۸، ۸.۱، ۱۰ و ۱۱ (نسخه خانگی، حرفه‌ای و سازمانی) به همراه درایور و نرم‌افزارهای ضروری",
    icon: Settings,
  },
  {
    title: "نصب لینوکس",
    desc: "نصب و پیکربندی توزیع‌های مختلف لینوکس مانند اوبونتو، دبیان و سایر توزیع‌های محبوب",
    icon: Terminal,
  },
  {
    title: "نصب macOS و ویندوز روی مک",
    desc: "نصب و راه‌اندازی macOS روی سیستم‌های سازگار و نصب ویندوز روی مک با تنظیمات بهینه",
    icon: Apple,
  },
  {
    title: "حذف بدافزار و بهینه‌سازی",
    desc: "پاک‌سازی کامل ویروس و باج‌گیر، بهینه‌سازی سرعت سیستم و تنظیمات امنیتی",
    icon: ShieldCheck,
  },
];

const webServices: { title: string; desc: string; icon: LucideIcon }[] = [
  {
    title: "سایت شرکتی و معرفی",
    desc: "طراحی سایت حرفه‌ای برای شرکت، برند یا کسب‌وکار با طراحی واکنش‌گرا و سازگار با موبایل",
    icon: Globe,
  },
  {
    title: "فروشگاه اینترنتی",
    desc: "راه‌اندازی فروشگاه آنلاین با پنل مدیریت، درگاه پرداخت و مدیریت موجودی و سفارش",
    icon: Store,
  },
  {
    title: "وب‌اپلیکیشن و پنل مدیریت",
    desc: "برنامه‌نویسی سامانه‌های تحت وب، داشبورد، پنل مدیریت و نرم‌افزارهای سفارشی",
    icon: AppWindow,
  },
  {
    title: "برنامه‌نویسی و اپلیکیشن",
    desc: "توسعه اپلیکیشن‌های موبایل و دسکتاپ و اتصال به سرویس‌ها و پایگاه داده",
    icon: Smartphone,
  },
  {
    title: "نگهداری و پشتیبانی سایت",
    desc: "به‌روزرسانی، امنیت، پشتیبان‌گیری و رفع خطاهای سایت به صورت دوره‌ای",
    icon: Server,
  },
];

/* ============================================================
   صفحه اصلی
   ============================================================ */
export default function HomePage() {
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

      {/* === هدر مینیمال === */}
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
            <Link href="/#services" className="hover:text-[#FF5722] transition-colors whitespace-nowrap">خدمات</Link>
            <Link href="/estimate" className="hover:text-[#FF5722] transition-colors whitespace-nowrap">تخمین هزینه</Link>
            <Link href="/blog" className="hover:text-[#FF5722] transition-colors whitespace-nowrap">مقالات</Link>
          </nav>

          <PrimaryCTA label="درخواست تعمیر" size="sm" href="/request" />
        </motion.div>
      </header>

      {/* === Hero === */}
      <section className="pt-28 sm:pt-32 md:pt-36 pb-12 sm:pb-16 px-4 flex flex-col items-center justify-center gap-6 sm:gap-8 max-w-5xl mx-auto w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center w-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-[#FF5722]/8 rounded-full px-3 sm:px-4 py-1.5 mb-4 sm:mb-5 border border-[#FF5722]/25"
          >
            <Rocket className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="text-[#FF5722] text-[10px] sm:text-[11px] font-bold tracking-wider whitespace-nowrap">
              تیم متخصص مدفیکس در شیراز
            </span>
          </motion.div>

          <h1 className="text-[#1A1410] font-black leading-[1.2] tracking-tight mb-3 sm:mb-5 px-2">
            <span className="block text-[1.75rem] sm:text-[2.5rem] md:text-[3.25rem] lg:text-[4rem]">
          لپ‌تاپ و کامپیوترت رو  
            </span>
            <span className="block text-[1.75rem] sm:text-[2.5rem] md:text-[3.25rem] lg:text-[4rem]">
              <span className="relative inline-block bg-gradient-to-l from-[#FF5722] to-[#FFA000] bg-clip-text text-transparent">
                به دست متخصص بسپار
                <DecorativeLine className="absolute -bottom-1 sm:-bottom-2 lg:-bottom-3 right-0 text-[#FF5722] w-10 sm:w-14 lg:w-20" delay={0.8} />
              </span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#1A1410]/65 text-sm sm:text-base md:text-lg leading-relaxed max-w-md md:max-w-lg font-medium mb-2 px-2"
          >
            ما یک تیم متخصص در تعمیر سخت‌افزار، نصب سیستم‌عامل و طراحی وب هستیم؛ با شفافیت کامل و گزارش دقیق
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="inline-flex items-center gap-2 text-[#1A1410]/50 text-xs sm:text-sm font-medium mb-6 sm:mb-8 px-2"
          >
            <MapPin className="w-3.5 h-3.5 text-[#FF5722] flex-shrink-0" />
            <span>حضوری در شیراز و امکان مراجعه در محل • خدمات برای کل ایران با ارسال به شیراز</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto px-2 sm:px-0 max-w-sm sm:max-w-none mx-auto"
          >
            <PrimaryCTA label="درخواست عیب‌یابی رایگان" size="lg" href="/request" />
            <OutlineCTA label="تخمین هزینه تعمیر" href="/estimate" />
          </motion.div>

          <ThinDivider className="my-7 sm:my-9" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-2xl"
          >
            {heroHighlights.map((item) => (
              <div
                key={item.label}
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

      {/* === بخش تعمیرات === */}
      <section id="services" className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10 scroll-mt-24">
        <div className="text-center mb-10 sm:mb-14">
          <DecorativeCircle size={48} className="text-[#FF5722]/50 mx-auto mb-4 sm:mb-5" delay={0.1} />
          <h2 className="text-[#1A1410] text-2xl sm:text-3xl md:text-4xl font-black mb-3 px-2 leading-tight">
            تعمیر تخصصی، بدون ریسک
          </h2>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-4">
            تیم متخصص ما قبل از هر تعمیر، عیب را دقیق تشخیص می‌دهد و گزارش شفاف می‌دهد
          </p>
          <DecorativeLine className="mx-auto mt-4 sm:mt-5 text-[#FF5722]/45" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {repairServices.map((item, i) => (
            <ServiceCard key={item.title} {...item} accent="orange" index={i} />
          ))}
        </div>
      </section>

      <SectionDivider accent="orange" />

      {/* === نصب سیستم‌عامل === */}
      <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <DecorativeCircle size={48} className="text-[#FFA000]/50 mx-auto mb-4 sm:mb-5" delay={0.1} />
          <div className="inline-flex items-center gap-2 bg-[#FFA000]/10 rounded-full px-3 sm:px-4 py-1.5 mb-3 sm:mb-4 border border-[#FFA000]/30">
            <Terminal className="w-3.5 h-3.5 text-[#F57C00]" />
            <span className="text-[#F57C00] text-[10px] sm:text-[11px] font-bold tracking-wider whitespace-nowrap">
              OPERATING SYSTEMS
            </span>
          </div>
          <h2 className="text-[#1A1410] text-2xl sm:text-3xl md:text-4xl font-black mb-3 px-2 leading-tight">
            نصب سیستم‌عامل، با تیم متخصص
          </h2>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-4">
            ویندوز، لینوکس و macOS؛ حتی نصب ویندوز روی مک. سیستم‌ت را تمیز، امن و سریع تحویل بگیر
          </p>
          <DecorativeLine className="mx-auto mt-4 sm:mt-5 text-[#FFA000]/50" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {osServices.map((item, i) => (
            <ServiceCard key={item.title} {...item} accent="amber" index={i} showLine={false} />
          ))}
        </div>
      </section>

      <SectionDivider accent="amber" />

      {/* === طراحی سایت === */}
      <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <DecorativeCircle size={48} className="text-[#FF5722]/50 mx-auto mb-4 sm:mb-5" delay={0.1} />
          <div className="inline-flex items-center gap-2 bg-[#FF5722]/8 rounded-full px-3 sm:px-4 py-1.5 mb-3 sm:mb-4 border border-[#FF5722]/25">
            <Code2 className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="text-[#FF5722] text-[10px] sm:text-[11px] font-bold tracking-wider whitespace-nowrap">
              WEB & SOFTWARE
            </span>
          </div>
          <h2 className="text-[#1A1410] text-2xl sm:text-3xl md:text-4xl font-black mb-3 px-2 leading-tight">
            طراحی سایت و برنامه‌نویسی
          </h2>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed px-4">
            از معرفی کسب‌وکارت تا فروشگاه و سامانه‌های اختصاصی؛ توسط تیم متخصص مدفیکس
          </p>
          <DecorativeLine className="mx-auto mt-4 sm:mt-5 text-[#FF5722]/45" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {webServices.map((item, i) => (
            <ServiceCard key={item.title} {...item} accent="orange" index={i} showLine={false} />
          ))}
        </div>
      </section>

      <SectionDivider accent="orange" />

      {/* === پوشش خدمات === */}
      <section className="py-14 sm:py-20 px-4 max-w-5xl mx-auto w-full relative z-10">
        <div className="text-center mb-10 sm:mb-12">
          <DecorativeCircle size={48} className="text-[#FF5722]/50 mx-auto mb-4 sm:mb-5" delay={0.1} />
          <h2 className="text-[#1A1410] text-2xl sm:text-3xl md:text-4xl font-black mb-3 leading-tight">
            خدمات در شیراز و سراسر ایران
          </h2>
          <DecorativeLine className="mx-auto mt-4 sm:mt-5 text-[#FF5722]/45" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-8 border border-[#FF5722]/15 shadow-sm"
          >
            <MapPin className="w-6 h-6 text-[#FF5722] mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2">حضوری در شیراز</h3>
            <p className="text-[#1A1410]/55 text-xs sm:text-sm leading-relaxed">
              مراجعه حضوری به مرکز مدفیکس یا درخواست مراجعه تیم متخصص در محل شما
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-8 border border-[#FFA000]/20 shadow-sm"
          >
            <Truck className="w-6 h-6 text-[#FFA000] mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2">خدمات برای کل ایران</h3>
            <p className="text-[#1A1410]/55 text-xs sm:text-sm leading-relaxed">
              برای شهرهای دیگر، دستگاه را به شیراز ارسال کنید؛ پس از بررسی و تعمیر، برایتان بازمی‌گردانیم
            </p>
          </motion.div>
        </div>
      </section>

      <SectionDivider accent="amber" />

      {/* === تخمین هزینه (فقط توضیح و لینک) === */}
      <section className="py-14 sm:py-20 px-4 max-w-5xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl sm:rounded-[36px] border border-[#FF5722]/25 bg-gradient-to-l from-[#FF5722]/10 via-[#FFA000]/8 to-[#FFF9F5] p-6 sm:p-10 shadow-sm"
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FF5722]/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFA000]/15 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-center md:text-right">
            <div className="flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <TrendingDown className="w-5 h-5 text-[#FF5722]" />
                <span className="text-[#FF5722] text-xs font-bold tracking-wider">تخمین هزینه</span>
              </div>
              <h2 className="text-[#1A1410] text-lg sm:text-xl md:text-2xl font-black mb-2 leading-tight">
                هزینه تعمیر دستگاهت را از قبل بدان
              </h2>
              <p className="text-[#1A1410]/55 text-xs sm:text-sm leading-relaxed max-w-md mx-auto md:mx-0">
                با انتخاب نوع دستگاه، سرویس مورد نیاز و شرح مشکل، در صفحه تخمین هزینه محدوده قیمت و زمان تقریبی را ببینید
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 mt-4 text-[10px] sm:text-[11px] text-[#1A1410]/55">
                <span className="flex items-center gap-1.5 whitespace-nowrap"><BadgeCheck className="w-3.5 h-3.5 text-[#FF5722] flex-shrink-0" /> شفاف و بدون هزینه پنهان</span>
                <span className="flex items-center gap-1.5 whitespace-nowrap"><Timer className="w-3.5 h-3.5 text-[#FF5722] flex-shrink-0" /> تخمین زمان تعمیر</span>
                <span className="flex items-center gap-1.5 whitespace-nowrap"><Banknote className="w-3.5 h-3.5 text-[#FF5722] flex-shrink-0" /> پرداخت پس از تعمیر</span>
              </div>
            </div>
            <Link
              href="/estimate"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-full font-bold transition-all shadow-[0_8px_30px_rgba(255,87,34,0.35)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.5)] hover:-translate-y-0.5 px-6 sm:px-7 py-3.5 sm:py-4 text-sm w-full md:w-auto whitespace-nowrap"
            >
              <Calculator className="w-4 h-4 flex-shrink-0" />
              <span>رفتن به صفحه تخمین</span>
              <ArrowUpRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      <SectionDivider accent="orange" />

      {/* === مقالات (دکمه ورود) === */}
      <section className="py-14 sm:py-16 px-4 max-w-3xl mx-auto w-full relative z-10 text-center">
        <DecorativeCircle size={48} className="text-[#FFA000]/50 mx-auto mb-4 sm:mb-5" delay={0.1} />
        <h2 className="text-[#1A1410] text-xl sm:text-2xl md:text-3xl font-black mb-3 leading-tight">
          مقالات و راهنمای مدفیکس
        </h2>
        <p className="text-[#1A1410]/55 text-xs sm:text-sm mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed px-4">
          آموزش‌ها و نکات تخصصی تیم مدفیکس درباره نگهداری، عیب‌یابی و نصب سیستم‌عامل
        </p>
        <Link
          href="/blog"
          className="group inline-flex items-center justify-center gap-2 border border-[#FFA000]/50 hover:border-[#FFA000] hover:bg-[#FFA000]/10 text-[#F57C00] rounded-full font-bold transition-all px-6 py-3 text-sm"
        >
          <BookOpen className="w-4 h-4" />
          <span>مشاهده مقالات</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </section>

      {/* === CTA نهایی === */}
      <section className="py-14 sm:py-16 px-4 max-w-3xl mx-auto w-full relative z-10 text-center">
        <DecorativeCircle size={56} className="text-[#FF5722]/40 mx-auto mb-5 sm:mb-6" delay={0.1} />
        <h2 className="text-[#1A1410] text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 px-2 leading-tight">
          دستگاهت مشکل داره؟ همین حالا اقدام کن
        </h2>
        <p className="text-[#1A1410]/55 text-xs sm:text-sm mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed px-4">
          درخواست عیب‌یابی رایگان بده و کار را به تیم متخصص مدفیکس شیراز بسپار
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
          <PrimaryCTA label="درخواست عیب‌یابی رایگان" size="lg" href="/request" />
          <OutlineCTA label="تخمین هزینه تعمیر" href="/estimate" />
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
