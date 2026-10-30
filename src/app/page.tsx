// src/app/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Apple,
  ArrowUpRight,
  BadgeCheck,
  Calculator,
  MapPin,
  Newspaper,
  PenTool,
  Phone,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  Timer,
  Truck,
  Users,
  Wind,
  Wrench,
} from "lucide-react";

const NAV_LINKS = [
  { href: "#services", label: "خدمات" },
  { href: "/estimate", label: "تخمین هزینه" },
  { href: "/blog", label: "مقالات" },
];

const SERVICES = [
  {
    title: "تعمیر تخصصی لپ‌تاپ و کامپیوتر",
    description:
      "عیب‌یابی دقیق و تعمیر سخت‌افزار و نرم‌افزار توسط تیم متخصص؛ از مادربرد و شارژ تا صفحه‌نمایش و کیبورد.",
    icon: Wrench,
    tags: ["لپ‌تاپ", "کامپیوتر", "سخت‌افزار", "نرم‌افزار"],
  },
  {
    title: "نصب انواع سیستم‌عامل",
    description:
      "نصب تخصصی ویندوز در همه نسخه‌ها، لینوکس و مک‌اواس همراه با درایور و بهینه‌سازی اولیه.",
    icon: Settings,
    tags: ["ویندوز", "لینوکس", "مک‌اواس"],
  },
  {
    title: "نصب ویندوز روی مک",
    description:
      "اجرای ویندوز روی مک‌بوک به‌صورت بوت‌کمپ یا ماشین مجازی، با تنظیمات کامل و پایدار.",
    icon: Apple,
    tags: ["مک‌بوک", "بوت‌کمپ", "ویندوز"],
  },
  {
    title: "خدمات تخصصی مک",
    description:
      "اورهال، سرویس خنک‌کنندگی و سرویس دوره‌ای مک؛ بدون تعمیرات غیرضروری و با قطعات مناسب.",
    icon: Wind,
    tags: ["اورهال", "خنک‌کنندگی", "سرویس"],
  },
  {
    title: "طراحی سایت و برنامه‌نویسی",
    description:
      "طراحی و توسعه سایت شرکتی، فروشگاهی، شخصی و اپلیکیشن با کد تمیز، سرعت بالا و ظاهر حرفه‌ای.",
    icon: PenTool,
    tags: ["سایت شرکتی", "فروشگاهی", "اپلیکیشن"],
  },
  {
    title: "ارتقا، بهینه‌سازی و نگهداری",
    description:
      "ارتقای SSD و رم، حذف بدافزار، سرویس دوره‌ای و بهینه‌سازی سرعت برای عمر بیشتر دستگاه.",
    icon: Rocket,
    tags: ["SSD", "رم", "بهینه‌سازی"],
  },
];

const COVERAGE = [
  {
    icon: MapPin,
    title: "حضوری در شیراز",
    description:
      "مراجعه به مرکز خدمات مدفیکس یا هماهنگی برای مراجعه کارشناس در محل شما.",
  },
  {
    icon: Truck,
    title: "ارسال از سراسر ایران",
    description:
      "برای سایر شهرها دستگاه را به شیراز ارسال کنید؛ روند پذیرش و بازگشت هماهنگ می‌شود.",
  },
  {
    icon: Phone,
    title: "پشتیبانی و هماهنگی",
    description:
      "ثبت درخواست، مشاوره تلفنی و هماهنگی زمان ارسال یا مراجعه، بدون رفت‌وآمد اضافه.",
  },
];

const TRUST_ITEMS = [
  {
    icon: Users,
    title: "تیم متخصص",
    description: "کارشناسان باتجربه در تعمیرات، سیستم‌عامل و توسعه وب.",
  },
  {
    icon: ShieldCheck,
    title: "خدمات با ضمانت",
    description: "شفافیت در روند کار و پشتیبانی پس از ارائه خدمات.",
  },
  {
    icon: BadgeCheck,
    title: "قطعات مناسب",
    description: "انتخاب قطعه بر اساس دستگاه، نیاز و بودجه شما.",
  },
  {
    icon: Timer,
    title: "پاسخ سریع",
    description: "هماهنگی و عیب‌یابی در کوتاه‌ترین زمان ممکن.",
  },
];

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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: "easeInOut" }}
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
        transition={{ duration: 1.4, delay, ease: "easeInOut" }}
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

function DecorativeLine({
  className = "",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.svg
      width="80"
      height="6"
      viewBox="0 0 80 6"
      fill="none"
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
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

function SectionHeading({
  eyebrow,
  title,
  description,
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
  return (
    <div className="min-h-screen bg-[#FFF9F5] font-[vazirmatn,sans-serif] flex flex-col relative overflow-x-hidden text-right text-[#1A1410] selection:bg-[#FF5722] selection:text-white">
      <div className="fixed top-0 right-0 w-[70%] h-[70%] bg-[#FF5722]/8 rounded-full blur-[180px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[60%] h-[60%] bg-[#FFA000]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/4 -translate-x-1/4" />
      <div className="fixed top-1/2 left-1/2 w-[40%] h-[40%] bg-[#FF5722]/5 rounded-full blur-[200px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 py-3 sm:py-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg shadow-[#FF5722]/10 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 border border-[#FF5722]/15"
        >
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink"
          >
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="مدفیکس شیراز"
                fill
                sizes="32px"
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="h-4 sm:h-5 w-px bg-[#1A1410]/15 flex-shrink-0 hidden sm:block" />
            <span className="text-[#1A1410]/60 text-[10px] sm:text-[11px] font-medium whitespace-nowrap tracking-wider truncate">
              مدفیکس شیراز
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-full text-[12px] font-bold text-[#1A1410]/60 hover:text-[#FF5722] hover:bg-[#FF5722]/6 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Link
              href="/blog"
              aria-label="مقالات"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#FF5722]/25 text-[#FF5722] hover:bg-[#FF5722]/8 transition-colors"
            >
              <Newspaper className="w-4 h-4" />
            </Link>
            <Link
              href="/request"
              className="group inline-flex items-center gap-1.5 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-full font-bold transition-all shadow-[0_8px_30px_rgba(255,87,34,0.3)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.45)] hover:-translate-y-0.5 active:translate-y-0 px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>درخواست خدمات</span>
              <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform hidden sm:block" />
            </Link>
          </div>
        </motion.div>
      </header>

      <main className="flex-1">
        <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 px-4 flex flex-col items-center justify-center gap-6 sm:gap-8 max-w-5xl mx-auto w-full relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex flex-col items-center w-full"
          >
            <div className="inline-flex items-center gap-2 bg-[#FF5722]/8 rounded-full px-3 sm:px-4 py-1.5 mb-4 sm:mb-5 border border-[#FF5722]/25">
              <Users className="w-3.5 h-3.5 text-[#FF5722]" />
              <span className="text-[#FF5722] text-[10px] sm:text-[11px] font-bold tracking-wider whitespace-nowrap">
                تیم متخصص خدمات کامپیوتر در شیراز
              </span>
            </div>

            <h1 className="text-[#1A1410] font-black leading-[1.2] tracking-tight mb-4 sm:mb-6 px-2">
              <span className="block text-[1.7rem] sm:text-[2.6rem] md:text-[3.3rem] lg:text-[3.9rem]">
                خدمات تخصصی
              </span>
              <span className="block text-[1.7rem] sm:text-[2.6rem] md:text-[3.3rem] lg:text-[3.9rem]">
                <span className="relative inline-block bg-gradient-to-l from-[#FF5722] to-[#FFA000] bg-clip-text text-transparent">
                  کامپیوتر، مک و وب
                  <DecorativeLine
                    className="absolute -bottom-1 sm:-bottom-2 lg:-bottom-3 right-0 text-[#FF5722] w-10 sm:w-14 lg:w-20 hidden xs:block"
                    delay={0.8}
                  />
                </span>
              </span>
            </h1>

            <p className="text-[#1A1410]/65 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-medium mb-3 px-2">
              تعمیر، نصب سیستم‌عامل، خدمات مک و طراحی سایت؛ همه با تیم متخصص مدفیکس.
            </p>
            <p className="text-[#1A1410]/45 text-xs sm:text-sm leading-relaxed max-w-lg font-medium mb-6 sm:mb-8 px-2">
              خدمات حضوری در شیراز و امکان مراجعه در محل مشتری؛ برای سراسر ایران با ارسال
              دستگاه به شیراز در خدمت شما هستیم.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto px-2 sm:px-0 max-w-sm sm:max-w-none mx-auto">
              <Link
                href="/request"
                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-full font-bold transition-all shadow-[0_8px_30px_rgba(255,87,34,0.3)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.45)] hover:-translate-y-0.5 px-6 sm:px-8 py-3.5 text-sm sm:text-base whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>ثبت درخواست خدمات</span>
                <ArrowUpRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                href="/estimate"
                className="group inline-flex items-center justify-center gap-2 border border-[#FF5722]/40 hover:border-[#FF5722] hover:bg-[#FF5722]/8 text-[#FF5722] rounded-full font-bold transition-all px-5 sm:px-6 py-3.5 text-sm whitespace-nowrap"
              >
                <Calculator className="w-4 h-4 flex-shrink-0" />
                <span>تخمین هزینه</span>
              </Link>
            </div>

            <ThinDivider className="my-7 sm:my-9" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-2xl">
              {[
                { icon: Users, label: "تیم متخصص" },
                { icon: MapPin, label: "حضوری در شیراز" },
                { icon: Truck, label: "ارسال از سراسر ایران" },
                { icon: ShieldCheck, label: "خدمات با ضمانت" },
              ].map((item) => (
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
            </div>
          </motion.div>
        </section>

        <section
          id="services"
          className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10 scroll-mt-24"
        >
          <SectionHeading
            eyebrow="خدمات مدفیکس"
            title="از تعمیر دستگاه تا ساخت سایت"
            description="خدمات متنوع و تخصصی برای دستگاه‌ها و کسب‌وکار شما، با یک تیم متخصص و روند شفاف."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {SERVICES.map((service, index) => (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl sm:rounded-[34px] p-5 sm:p-7 border border-[#FF5722]/10 shadow-sm hover:shadow-xl hover:shadow-[#FF5722]/10 hover:border-[#FF5722]/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF5722]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-[#FF5722]/10 transition-all" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#FFA000] flex items-center justify-center mb-4 shadow-lg shadow-[#FF5722]/20">
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[#1A1410] font-black text-base sm:text-lg mb-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-[#1A1410]/50 text-xs sm:text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium text-[#FF5722] bg-[#FF5722]/8 border border-[#FF5722]/15 rounded-full px-2.5 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
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

        <section
          id="coverage"
          className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10 scroll-mt-24"
        >
          <SectionHeading
            eyebrow="پوشش خدمات"
            title="حضوری در شیراز، در دسترس در سراسر ایران"
            description="خدمات مدفیکس برای همه شهرهای ایران ارائه می‌شود؛ در شیراز حضوری و در محل مشتری، در سایر شهرها با ارسال دستگاه به شیراز."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {COVERAGE.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl sm:rounded-[34px] p-5 sm:p-7 border border-[#FFA000]/15 shadow-sm hover:shadow-xl hover:shadow-[#FFA000]/15 hover:border-[#FFA000]/40 transition-all group relative overflow-hidden"
              >
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#FFA000]/6 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl group-hover:bg-[#FFA000]/12 transition-all" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FFA000]/12 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#F57C00]" />
                    </div>
                    <div className="w-8 h-px bg-[#FFA000]/35" />
                  </div>
                  <h3 className="text-[#1A1410] font-black text-base sm:text-lg mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[#1A1410]/50 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-[#FF5722]/6 border border-[#FF5722]/15 px-4 py-3.5 text-center"
          >
            <Truck className="w-4 h-4 text-[#FF5722] flex-shrink-0" />
            <p className="text-[11px] sm:text-xs text-[#1A1410]/60 leading-relaxed font-medium">
              شیراز: حضوری و مراجعه در محل مشتری
              <span className="mx-2 text-[#FF5722]/40">|</span>
              سایر شهرها: ارسال دستگاه به شیراز
            </p>
          </motion.div>
        </section>

        <div className="max-w-7xl mx-auto w-full px-4 relative z-10">
          <div className="flex items-center justify-center gap-4">
            <div className="flex-1 h-px bg-[#1A1410]/8" />
            <DecorativeCircle size={20} className="text-[#FFA000]/35" />
            <div className="flex-1 h-px bg-[#1A1410]/8" />
          </div>
        </div>

        <section className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10">
          <SectionHeading
            eyebrow="چرا مدفیکس"
            title="کار را به تیم متخصص بسپارید"
            description="تجربه، شفافیت و پشتیبانی؛ سه چیزی که در مدفیکس تضمین می‌شود."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {TRUST_ITEMS.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-[#1A1410]/8 shadow-sm hover:shadow-lg hover:border-[#FF5722]/25 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FF5722]/8 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-[#FF5722]" />
                </div>
                <h3 className="text-[#1A1410] font-black text-sm sm:text-base mb-1.5">
                  {item.title}
                </h3>
                <p className="text-[#1A1410]/50 text-[11px] sm:text-xs leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="estimate"
          className="py-14 sm:py-20 px-4 max-w-7xl mx-auto w-full relative z-10 scroll-mt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl sm:rounded-[38px] border border-[#FF5722]/25 bg-gradient-to-l from-[#FF5722]/10 via-[#FFA000]/8 to-[#FFF9F5] p-6 sm:p-10 shadow-sm"
          >
            <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#FF5722]/15 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#FFA000]/15 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="flex-1 text-center lg:text-right">
                <div className="inline-flex items-center gap-2 bg-white/70 border border-[#FF5722]/20 rounded-full px-3.5 py-1.5 mb-4">
                  <Calculator className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span className="text-[#FF5722] text-[10px] sm:text-[11px] font-bold tracking-wider">
                    تخمین هزینه
                  </span>
                </div>
                <h2 className="text-[#1A1410] text-xl sm:text-2xl md:text-3xl font-black mb-3 leading-tight">
                  قبل از مراجعه، بازه هزینه را بدانید
                </h2>
                <p className="text-[#1A1410]/55 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto lg:mx-0">
                  در صفحه تخمین هزینه، نوع دستگاه و خدمت مورد نیاز را انتخاب می‌کنید و یک
                  بازه تقریبی می‌بینید. قیمت نهایی بعد از عیب‌یابی توسط تیم متخصص اعلام
                  می‌شود.
                </p>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 max-w-md mx-auto lg:mx-0">
                  {["انتخاب دستگاه", "انتخاب خدمت", "دریافت تخمین"].map(
                    (step, index) => (
                      <div
                        key={step}
                        className="bg-white/70 backdrop-blur-sm rounded-xl border border-[#1A1410]/8 px-2 py-2.5 text-center"
                      >
                        <span className="block text-[10px] font-black text-[#FF5722] mb-0.5">
                          {index + 1}
                        </span>
                        <span className="block text-[10px] sm:text-[11px] font-bold text-[#1A1410]/60 leading-tight">
                          {step}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 flex-shrink-0 w-full lg:w-auto">
                <Link
                  href="/estimate"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-full font-bold transition-all shadow-[0_8px_30px_rgba(255,87,34,0.35)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.5)] hover:-translate-y-0.5 px-6 sm:px-7 py-3.5 sm:py-4 text-sm w-full lg:w-auto whitespace-nowrap"
                >
                  <Calculator className="w-4 h-4 flex-shrink-0" />
                  <span>رفتن به صفحه تخمین هزینه</span>
                  <ArrowUpRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
                <Link
                  href="/request"
                  className="inline-flex items-center justify-center gap-2 border border-[#FF5722]/30 hover:border-[#FF5722] hover:bg-[#FF5722]/8 text-[#FF5722] rounded-full font-bold transition-all px-6 py-3 text-xs sm:text-sm w-full lg:w-auto whitespace-nowrap"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>ثبت درخواست و مشاوره</span>
                </Link>
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
              <span>مشاهده مقالات</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </section>

        <section className="py-10 sm:py-14 px-4 max-w-3xl mx-auto w-full relative z-10 text-center">
          <DecorativeCircle
            size={54}
            className="text-[#FF5722]/40 mx-auto mb-5 sm:mb-6"
            delay={0.1}
          />
          <h2 className="text-[#1A1410] text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 px-2 leading-tight">
            دستگاهت مشکل دارد یا خدمات جدید می‌خواهی؟
          </h2>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm mb-6 sm:mb-8 max-w-lg mx-auto leading-relaxed px-4">
            درخواستت را ثبت کن؛ تیم متخصص مدفیکس در شیراز و سراسر ایران همراهت است.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/request"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-full font-bold transition-all shadow-[0_8px_30px_rgba(255,87,34,0.3)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.45)] hover:-translate-y-0.5 px-6 sm:px-8 py-3.5 text-sm whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>ثبت درخواست خدمات</span>
              <ArrowUpRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href="/estimate"
              className="inline-flex items-center justify-center gap-2 border border-[#FF5722]/40 hover:border-[#FF5722] hover:bg-[#FF5722]/8 text-[#FF5722] rounded-full font-bold transition-all px-5 sm:px-6 py-3.5 text-sm whitespace-nowrap"
            >
              <Calculator className="w-4 h-4 flex-shrink-0" />
              <span>تخمین هزینه</span>
            </Link>
          </div>
          <DecorativeLine
            className="mx-auto mt-6 sm:mt-8 text-[#FF5722]/30"
            delay={0.5}
          />
        </section>
      </main>

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
            مدفیکس، تیم متخصص تعمیرات، خدمات کامپیوتر و طراحی سایت در شیراز
          </span>
        </div>
        <ThinDivider className="my-4 mx-auto" />
        <p className="text-[#1A1410]/35 text-[10px] sm:text-[11px] mb-3 sm:mb-4 px-2 leading-relaxed">
          تعمیر تخصصی • نصب سیستم‌عامل • خدمات مک • طراحی سایت و برنامه‌نویسی
        </p>
        <p className="text-[#1A1410]/35 text-[10px] sm:text-[11px] mb-4 px-2 leading-relaxed">
          شیراز: حضوری و مراجعه در محل • سایر شهرها: ارسال دستگاه به شیراز
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-[10px] sm:text-[11px] text-[#1A1410]/55">
          <Link href="/blog" className="hover:text-[#FF5722] transition-colors">
            مقالات
          </Link>
          <span className="w-px h-3 bg-[#1A1410]/15" />
          <Link
            href="/estimate"
            className="hover:text-[#FF5722] transition-colors"
          >
            تخمین هزینه
          </Link>
          <span className="w-px h-3 bg-[#1A1410]/15" />
          <Link
            href="/request"
            className="hover:text-[#FF5722] transition-colors"
          >
            درخواست خدمات
          </Link>
        </div>
      </footer>
    </div>
  );
}
