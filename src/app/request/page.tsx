// app/requests/page.tsx
"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  Wrench,
  Send,
  CheckCircle2,
  ArrowRight,
  Loader2,
  User,
  Phone,
  Laptop,
  Monitor,
  HardDrive,
  AlertCircle,
  MapPin,
  Clock,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type DeviceTypeValue = "لپ‌تاپ" | "کامپیوتر (PC)" | "مک‌بوک" | "هارد / SSD" | "سایر";

interface FormState {
  name: string;
  phone: string;
  deviceType: DeviceTypeValue;
  brand: string;
  problem: string;
  description: string;
}

interface ApiResponse {
  ok?: boolean;
  success?: boolean;
  id?: string;
  error?: string;
  message?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const NAME_MIN = 2;
const PROBLEM_MIN = 5;

const deviceTypes: { value: DeviceTypeValue; icon: typeof Laptop }[] = [
  { value: "لپ‌تاپ", icon: Laptop },
  { value: "کامپیوتر (PC)", icon: Monitor },
  { value: "مک‌بوک", icon: Laptop },
  { value: "هارد / SSD", icon: HardDrive },
  { value: "سایر", icon: Wrench },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toEnglishDigits = (str: string): string => {
  const persian = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
  const arabic  = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
  let out = str;
  for (let i = 0; i < 10; i++) {
    out = out
      .replace(new RegExp(persian[i], "g"), String(i))
      .replace(new RegExp(arabic[i], "g"), String(i));
  }
  return out;
};

// ─── Decorative components ───────────────────────────────────────────────────
function DecorativeCircle({ className = "", size = 40, delay = 0 }: {
  className?: string; size?: number; delay?: number;
}) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 40 40" fill="none"
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: "easeInOut" }}
    >
      <motion.circle
        cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeDasharray="4 3"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.5, delay, ease: "easeInOut" }}
      />
      <motion.circle
        cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1, delay: delay + 0.3, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

function DecorativeLine({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.svg
      width="80" height="6" viewBox="0 0 80 6" fill="none" className={className}
      initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 1, delay, ease: "easeInOut" }}
    >
      <motion.path
        d="M0,3 Q20,6 40,3 Q60,0 80,3" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1, delay, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function RequestPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    deviceType: "لپ‌تاپ",
    brand: "",
    problem: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (form.name.trim().length < NAME_MIN) return `نام حداقل ${NAME_MIN} کاراکتر باشد`;
    if (!/^09[0-9]{9}$/.test(form.phone)) return "شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد";
    if (!form.deviceType) return "نوع دستگاه را انتخاب کنید";
    if (form.problem.trim().length < PROBLEM_MIN) return `شرح مشکل حداقل ${PROBLEM_MIN} کاراکتر باشد`;
    return null;
  };

  // ─── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("در حال ثبت درخواست...");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: ApiResponse = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        toast.error(data.error || "ثبت درخواست ناموفق بود. لطفاً دوباره تلاش کنید.", {
          id: loadingToast,
        });
        return;
      }

      toast.success(data.message || "درخواستت با موفقیت ثبت شد!", {
        id: loadingToast,
        description: data.id ? `کد پیگیری: ${data.id.slice(-6)}` : undefined,
      });

      setSuccess(true);
    } catch (err) {
      console.error("Submit request error:", err);
      toast.error("خطای شبکه، اتصال اینترنت را بررسی کنید", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  // ─── Success Screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] text-[#1A1410] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="fixed top-0 right-0 w-[70%] h-[70%] bg-[#FF5722]/8 rounded-full blur-[180px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="fixed bottom-0 left-0 w-[60%] h-[60%] bg-[#FFA000]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md w-full bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-10 border border-[#FF5722]/15 shadow-xl shadow-[#FF5722]/10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-l from-[#FF5722] to-[#FFA000] flex items-center justify-center shadow-lg shadow-[#FF5722]/30"
          >
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3">درخواستت ثبت شد!</h1>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
            کارشناسان مدفیکس شیراز در اسرع وقت با تو تماس می‌گیرند تا زمان مراجعه و عیب‌یابی هماهنگ شود.
          </p>
          <div className="flex flex-col gap-3">
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
              <span>تخمین هزینه تعمیر</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Main Form ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FFF9F5] font-[vazirmatn,sans-serif] flex flex-col relative overflow-x-hidden text-right text-[#1A1410] selection:bg-[#FF5722] selection:text-white">
      {/* Background */}
      <div className="fixed top-0 right-0 w-[70%] h-[70%] bg-[#FF5722]/8 rounded-full blur-[180px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[60%] h-[60%] bg-[#FFA000]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 py-2.5 sm:py-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg shadow-[#FF5722]/10 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between border border-[#FF5722]/15 gap-2"
        >
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink">
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
        </motion.div>
      </header>

      <main className="flex-1 pt-20 sm:pt-28 pb-12 sm:pb-16 px-3 sm:px-4 max-w-3xl mx-auto w-full relative z-10">
        {/* Title — کوتاه و جمع‌وجور در موبایل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5 sm:mb-10"
        >
          {/* دایره تزئینی فقط در sm+ */}
          <DecorativeCircle size={40} className="text-[#FF5722]/50 mx-auto mb-3 hidden sm:block" delay={0.1} />

          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#FF5722]/8 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-2.5 sm:mb-4 border border-[#FF5722]/25">
            <Wrench className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5722]" />
            <span className="text-[#FF5722] text-[10px] sm:text-[11px] font-bold tracking-wider">درخواست تعمیر</span>
          </div>

          <h1 className="text-[#1A1410] text-xl sm:text-3xl md:text-4xl font-black mb-1.5 sm:mb-3 leading-tight px-2">
            دستگاهت رو بسپار به متخصص
          </h1>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed px-3">
            فرم را پر کن؛ کارشناسان ما در اسرع وقت با تو تماس می‌گیرند
          </p>

          {/* خط تزئینی فقط در sm+ */}
          <DecorativeLine className="mx-auto mt-4 hidden sm:block text-[#FF5722]/45" delay={0.3} />
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-3xl sm:rounded-[36px] p-4 sm:p-9 border border-[#FF5722]/10 shadow-xl shadow-[#FF5722]/8 space-y-4 sm:space-y-6"
        >
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-[#1A1410]/70 text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2">
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5722]" />
                نام و نام خانوادگی <span className="text-[#FF5722]">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="مثلاً علی رضایی"
                autoComplete="name"
                className="w-full bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-[#1A1410] placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/15 transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 sm:gap-2 text-[#1A1410]/70 text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2">
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5722]" />
                شماره تماس <span className="text-[#FF5722]">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) =>
                  update(
                    "phone",
                    toEnglishDigits(e.target.value).replace(/[^0-9]/g, "").slice(0, 11)
                  )
                }
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                dir="ltr"
                className="w-full bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-[#1A1410] placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/15 transition-all text-left"
              />
            </div>
          </div>

          {/* Device type */}
          <div>
            <label className="flex items-center gap-1.5 sm:gap-2 text-[#1A1410]/70 text-[11px] sm:text-xs font-bold mb-2 sm:mb-3">
              <Laptop className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5722]" />
              نوع دستگاه <span className="text-[#FF5722]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
              {deviceTypes.map((d) => {
                const Icon = d.icon;
                const active = form.deviceType === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => update("deviceType", d.value)}
                    aria-pressed={active}
                    className={`flex flex-col items-center gap-1 sm:gap-1.5 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border text-[10px] sm:text-[11px] font-bold transition-all ${
                      active
                        ? "bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white border-transparent shadow-md shadow-[#FF5722]/25"
                        : "bg-[#FFF9F5] text-[#1A1410]/60 border-[#1A1410]/10 hover:border-[#FF5722]/40"
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="leading-tight text-center">{d.value}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand */}
          <div>
            <label className="flex items-center gap-1.5 sm:gap-2 text-[#1A1410]/70 text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2">
              <Monitor className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5722]" />
              برند / مدل دستگاه
            </label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => update("brand", e.target.value)}
              placeholder="مثلاً ASUS VivoBook"
              className="w-full bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-[#1A1410] placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/15 transition-all"
            />
          </div>

          {/* Problem */}
          <div>
            <label className="flex items-center gap-1.5 sm:gap-2 text-[#1A1410]/70 text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2">
              <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5722]" />
              مشکل اصلی <span className="text-[#FF5722]">*</span>
            </label>
            <input
              type="text"
              value={form.problem}
              onChange={(e) => update("problem", e.target.value)}
              placeholder="مثلاً روشن نمی‌شود / صفحه خراب شده"
              className="w-full bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-[#1A1410] placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/15 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-1.5 sm:gap-2 text-[#1A1410]/70 text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2">
              <Wrench className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5722]" />
              توضیحات بیشتر
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="جزئیات مشکل را بنویس تا سریع‌تر عیب‌یابی کنیم..."
              className="w-full bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl sm:rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm text-[#1A1410] placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/15 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full inline-flex items-center justify-center gap-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-full font-bold transition-all shadow-[0_8px_30px_rgba(255,87,34,0.3)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.45)] py-3.5 sm:py-4 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>در حال ثبت...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
                <span>ثبت درخواست تعمیر</span>
              </>
            )}
          </button>

          {/* Helper info */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 pt-1 sm:pt-2 text-[10px] sm:text-[11px] text-[#1A1410]/50">
            <span className="flex items-center gap-1 sm:gap-1.5">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5722]" /> شیراز
            </span>
            <span className="w-px h-2.5 sm:h-3 bg-[#1A1410]/15" />
            <span className="flex items-center gap-1 sm:gap-1.5">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5722]" /> پاسخ‌گویی سریع
            </span>
            <span className="w-px h-2.5 sm:h-3 bg-[#1A1410]/15" />
            <span className="flex items-center gap-1 sm:gap-1.5">
              <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF5722]" /> عیب‌یابی رایگان
            </span>
          </div>
        </motion.form>
      </main>
    </div>
  );
}