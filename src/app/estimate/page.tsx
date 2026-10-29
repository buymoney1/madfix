// src/app/estimate/page.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Laptop, Monitor, Apple, Wrench, ArrowRight, ArrowLeft,
  CheckCircle2, AlertCircle, Sparkles, Info, TrendingUp, ShieldCheck,
  User, Phone, Send, Loader2, ClipboardList,
} from "lucide-react";
import {
  estimate, BRAND_LABELS, AGE_LABELS, faNum,
  getServicesForDevice, type DeviceCategory, type EstimatorInput,
} from "@/lib/pricing";

// ==================== Types ====================
type Step = "device" | "problem" | "details" | "result";

interface FormState {
  device: DeviceCategory;
  problem: string;
  brand: EstimatorInput["brand"];
  age: EstimatorInput["age"];
  warranty: EstimatorInput["warranty"];
  deviceValue?: number;
}

// ==================== Helpers ====================
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

const formatThousands = (n: number): string => {
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("fa-IR");
};

// نگاشت DeviceCategory → مقادیر مجاز API (/api/requests)
const DEVICE_TO_API: Record<DeviceCategory, "لپ‌تاپ" | "کامپیوتر (PC)" | "مک‌بوک"> = {
  laptop: "لپ‌تاپ",
  desktop: "کامپیوتر (PC)",
  macbook: "مک‌بوک",
};

// ==================== Constants ====================
const DEVICES: { value: DeviceCategory; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "laptop", label: "لپ‌تاپ", icon: Laptop, desc: "تمام برندها" },
  { value: "desktop", label: "کامپیوتر", icon: Monitor, desc: "کیس، مینی‌کیس، آل‌این‌وان" },
  { value: "macbook", label: "مک‌بوک", icon: Apple, desc: "Apple MacBook" },
];

const PROBLEMS: { value: string; label: string; hint: string }[] = [
  { value: "fan-paste", label: "دستگاه داغ می‌شود / فن صدا می‌دهد", hint: "سرویس فن، خمیر سیلیکون" },
  { value: "charge-socket-repair", label: "شارژ نمی‌شود / سوکت شارژ مشکل دارد", hint: "تعمیر یا تعویض سوکت" },
  { value: "lcd-repair", label: "صفحه نمایش شکسته یا خط دارد", hint: "تعمیر یا تعویض LCD" },
  { value: "keyboard-nosolder", label: "بعضی کلیدهای کیبورد کار نمی‌کنند", hint: "تعویض کیبورد" },
  { value: "software", label: "کند شده / ویروس گرفته / بالا نمی‌آید", hint: "رفع اشکال نرم‌افزاری" },
  { value: "win-install", label: "می‌خواهم ویندوز نصب کنم", hint: "نصب ویندوز + درایور" },
  { value: "hdd-repair", label: "هارد صدا می‌دهد یا شناسایی نمی‌شود", hint: "تعمیر یا تعویض هارد" },
  { value: "hdd-upgrade", label: "می‌خواهم هارد را ارتقا بدهم (SSD)", hint: "ارتقای هارد" },
  { value: "ram", label: "می‌خواهم RAM را ارتقا بدهم", hint: "تعویض یا ارتقای RAM" },
  { value: "data-recovery", label: "اطلاعاتم پاک شده / هارد خراب شده", hint: "بازیابی اطلاعات" },
  { value: "motherboard", label: "دستگاه روشن نمی‌شود / مادربرد مشکل دارد", hint: "تعویض مادربرد" },
  { value: "bios-software", label: "بایوس مشکل دارد / صفحه سیاه است", hint: "پروگرام بایوس" },
  { value: "gpu", label: "گرافیک ضعیف شده / تصویر خراب است", hint: "تعمیر یا تعویض گرافیک" },
  { value: "hinge", label: "لولا / قاب دستگاه شل شده", hint: "تعمیر یا تعویض لولا" },
  { value: "case-repair", label: "بدنه / قاب شکسته", hint: "تعمیر قاب" },
  { value: "diagnosis", label: "نمی‌دانم مشکل چیست — فقط عیب‌یابی", hint: "عیب‌یابی تخصصی" },
];

// ==================== Step Indicator ====================
function StepIndicator({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "device", label: "دستگاه" },
    { id: "problem", label: "مشکل" },
    { id: "details", label: "جزئیات" },
    { id: "result", label: "تخمین" },
  ];
  const currentIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {steps.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <div key={s.id} className="flex items-center gap-1 sm:gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold transition-all ${
                active
                  ? "bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white shadow-md shadow-[#FF5722]/25"
                  : done
                  ? "bg-[#FF5722]/10 text-[#FF5722]"
                  : "bg-[#1A1410]/5 text-[#1A1410]/30"
              }`}
            >
              {done ? <CheckCircle2 className="w-3 h-3" /> : <span>{faNum(i + 1)}</span>}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-4 sm:w-6 h-px ${done ? "bg-[#FF5722]/40" : "bg-[#1A1410]/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ==================== Formatted Number Input ====================
function FormattedNumberInput({
  value,
  onChange,
  placeholder = "مثلاً ۲۰٬۰۰۰٬۰۰۰",
  className = "",
  max = 500_000_000,
  min = 0,
  suffix = "تومان",
}: {
  value?: number;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  className?: string;
  max?: number;
  min?: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState<string>(
    value !== undefined && value !== null ? formatThousands(value) : ""
  );

  useEffect(() => {
    setDisplay(value !== undefined && value !== null ? formatThousands(value) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = toEnglishDigits(e.target.value);
    const digitsOnly = raw.replace(/[^0-9]/g, "");

    if (digitsOnly === "") {
      setDisplay("");
      onChange(undefined);
      return;
    }

    let num = parseInt(digitsOnly, 10);
    if (Number.isNaN(num)) {
      setDisplay("");
      onChange(undefined);
      return;
    }

    if (min !== undefined && num < min) num = min;
    if (max !== undefined && num > max) num = max;

    setDisplay(formatThousands(num));
    onChange(num);
  };

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        aria-label="ارزش تقریبی دستگاه به تومان"
      />
      {suffix && display && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#1A1410]/40 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

// ==================== Quick Request Form ====================
function QuickRequestForm({
  form,
  estimateMin,
  estimateMax,
  serviceLabel,
}: {
  form: FormState;
  estimateMin: number;
  estimateMax: number;
  serviceLabel: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    if (name.trim().length < 2) {
      toast.error("اسمت رو کامل بنویس");
      return;
    }
    if (!/^09[0-9]{9}$/.test(phone)) {
      toast.error("شماره موبایل باید با ۰۹ شروع بشه و ۱۱ رقم باشه");
      return;
    }

    setSending(true);
    const loadingToast = toast.loading("در حال ثبت درخواست...");

    try {
      // توضیحات خودکار از اطلاعات تخمین
      const description = [
        `تخمین اولیه: ${faNum(estimateMin)} تا ${faNum(estimateMax)} تومان`,
        `برند: ${BRAND_LABELS[form.brand]}`,
        `سن دستگاه: ${AGE_LABELS[form.age]}`,
        `گارانتی: ${form.warranty === "yes" ? "دارد" : form.warranty === "no" ? "ندارد" : "نامشخص"}`,
        form.deviceValue ? `ارزش دستگاه: ${faNum(form.deviceValue)} تومان` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          deviceType: DEVICE_TO_API[form.device],
          problem: serviceLabel,
          description,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        toast.error(data.error || "ثبت درخواست انجام نشد. دوباره تلاش کن.", {
          id: loadingToast,
        });
        return;
      }

      toast.success("درخواستت ثبت شد!", { id: loadingToast });

      const params = new URLSearchParams();
      if (data.id) params.set("id", data.id);
      params.set("phone", phone);
      params.set("name", name.trim());
      router.push(`/requests/success?${params.toString()}`);
    } catch (err) {
      console.error("Quick submit error:", err);
      toast.error("خطای شبکه، اتصالت رو یه چک کن", { id: loadingToast });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-[#FF5722]/25 shadow-lg shadow-[#FF5722]/10">
      <div className="flex items-start gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#FFA000] flex items-center justify-center flex-shrink-0">
          <ClipboardList className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-[#1A1410] mb-0.5">
            همین حالا درخواستت رو ثبت کن
          </h3>
          <p className="text-[11px] text-[#1A1410]/50 leading-relaxed">
            فقط اسم و شماره‌ت رو بده، بقیه‌ش با ما
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A1410]/70 mb-1.5">
            <User className="w-3 h-3 text-[#FF5722]" />
            اسم و فامیل <span className="text-[#FF5722]">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً علی رضایی"
            autoComplete="name"
            disabled={sending}
            className="w-full bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl px-3.5 py-2.5 text-sm text-[#1A1410] placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/15 transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A1410]/70 mb-1.5">
            <Phone className="w-3 h-3 text-[#FF5722]" />
            شماره تماس <span className="text-[#FF5722]">*</span>
          </label>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="tel"
            value={phone}
            onChange={(e) =>
              setPhone(toEnglishDigits(e.target.value).replace(/[^0-9]/g, "").slice(0, 11))
            }
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            dir="ltr"
            disabled={sending}
            className="w-full bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl px-3.5 py-2.5 text-sm text-[#1A1410] placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/15 transition-all text-left disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="group w-full inline-flex items-center justify-center gap-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-full font-bold transition-all shadow-[0_8px_30px_rgba(255,87,34,0.3)] hover:shadow-[0_12px_40px_rgba(255,87,34,0.45)] py-3 text-sm"
        >
          {sending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>در حال ثبت...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>ثبت سریع درخواست</span>
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-[#1A1410]/40 leading-relaxed">
          با ثبت درخواست، کارشناس ما تماس می‌گیره و عیب‌یابی رایگانه
        </p>
      </form>
    </div>
  );
}

// ==================== Main ====================
export default function EstimatePage() {
  const [step, setStep] = useState<Step>("device");
  const [form, setForm] = useState<FormState>({
    device: "laptop",
    problem: "",
    brand: "other",
    age: "1to3",
    warranty: "no",
    deviceValue: undefined,
  });

  const services = useMemo(() => getServicesForDevice(form.device), [form.device]);

  const handleBack = () => {
    if (step === "problem") setStep("device");
    else if (step === "details") setStep("problem");
    else if (step === "result") setStep("details");
  };

  const resetForm = () => {
    setForm({ device: "laptop", problem: "", brand: "other", age: "1to3", warranty: "no", deviceValue: undefined });
    setStep("device");
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-[vazirmatn,sans-serif] flex flex-col relative overflow-x-hidden text-right text-[#1A1410] selection:bg-[#FF5722]/20 selection:text-white">
      {/* Background */}
      <div className="fixed top-0 right-0 w-[70%] h-[70%] bg-[#FF5722]/8 rounded-full blur-[180px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[60%] h-[60%] bg-[#FFA000]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg shadow-[#FF5722]/10 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between border border-[#FF5722]/15 gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink">
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
              <Image src="/logo.png" alt="مدفیکس شیراز" fill sizes="32px" className="object-contain" priority />
            </div>
            <div className="h-4 sm:h-5 w-px bg-[#1A1410]/15 flex-shrink-0 hidden sm:block" />
            <span className="text-[#1A1410]/60 text-[10px] sm:text-[11px] font-medium whitespace-nowrap tracking-wider group-hover:text-[#FF5722] transition-colors truncate">
              مدفیکس شیراز
            </span>
          </Link>
          <Link
            href="/requests"
            className="text-[#FF5722] text-xs sm:text-sm font-bold hover:text-[#F4511E] transition-colors whitespace-nowrap flex-shrink-0"
          >
            درخواست تعمیر
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-24 sm:pt-32 pb-16 px-4 max-w-3xl mx-auto w-full relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl sm:text-4xl font-black mb-3">هزینه تعمیرت رو حدس بزن</h1>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed px-2">
            در ۳۰ ثانیه، بر اساس جدول قیمت میانه بازار، بازه هزینه تعمیر دستگاهت رو ببین
          </p>
        </motion.div>

        <StepIndicator step={step} />

        <AnimatePresence mode="wait">
          {/* Step 1: Device */}
          {step === "device" && (
            <motion.div
              key="device"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[36px] p-6 sm:p-9 border border-[#FF5722]/10 shadow-xl shadow-[#FF5722]/8"
            >
              <h2 className="text-lg font-black mb-1">دستگاهت چیه؟</h2>
              <p className="text-xs text-[#1A1410]/50 mb-6">نوع دستگاه را انتخاب کن</p>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
                {DEVICES.map((d) => {
                  const Icon = d.icon;
                  const active = form.device === d.value;
                  return (
                    <button
                      key={d.value}
                      onClick={() => setForm({ ...form, device: d.value })}
                      className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border transition-all ${
                        active
                          ? "bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white border-transparent shadow-lg shadow-[#FF5722]/25"
                          : "bg-[#FFF9F5] text-[#1A1410]/60 border-[#1A1410]/10 hover:border-[#FF5722]/40"
                      }`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span className="text-xs sm:text-sm font-bold">{d.label}</span>
                      <span className={`text-[9px] sm:text-[10px] text-center leading-tight ${active ? "text-white/70" : "text-[#1A1410]/40"}`}>
                        {d.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setStep("problem")}
                className="w-full py-3.5 rounded-xl bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white text-sm font-bold hover:from-[#F4511E] hover:to-[#FF8F00] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5722]/25"
              >
                مرحله بعد
                <ArrowLeft className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Problem */}
          {step === "problem" && (
            <motion.div
              key="problem"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[36px] p-6 sm:p-9 border border-[#FF5722]/10 shadow-xl shadow-[#FF5722]/8"
            >
              <h2 className="text-lg font-black mb-1">چه مشکلی داری؟</h2>
              <p className="text-xs text-[#1A1410]/50 mb-6">نزدیک‌ترین گزینه را انتخاب کن</p>

              <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto pl-1">
                {PROBLEMS.filter((p) => services.some((s) => s.id === p.value)).map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setForm({ ...form, problem: p.value })}
                    className={`w-full text-right flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                      form.problem === p.value
                        ? "bg-[#FF5722]/8 border-[#FF5722]/40"
                        : "bg-[#FFF9F5] border-[#1A1410]/10 hover:border-[#FF5722]/30"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      form.problem === p.value ? "border-[#FF5722] bg-[#FF5722]" : "border-[#1A1410]/20"
                    }`}>
                      {form.problem === p.value && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1A1410]">{p.label}</p>
                      <p className="text-[10px] text-[#1A1410]/40 mt-0.5">{p.hint}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3.5 rounded-xl border border-[#1A1410]/10 text-[#1A1410]/60 text-sm font-bold hover:bg-[#1A1410]/5 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  قبلی
                </button>
                <button
                  onClick={() => setStep("details")}
                  disabled={!form.problem}
                  className="flex-[2] py-3.5 rounded-xl bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white text-sm font-bold hover:from-[#F4511E] hover:to-[#FF8F00] disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5722]/25"
                >
                  مرحله بعد
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Details */}
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[36px] p-6 sm:p-9 border border-[#FF5722]/10 shadow-xl shadow-[#FF5722]/8 space-y-5"
            >
              <div>
                <h2 className="text-lg font-black mb-1">چند سؤال کوتاه</h2>
                <p className="text-xs text-[#1A1410]/50 mb-6">برای تخمین دقیق‌تر</p>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-bold text-[#1A1410]/70 mb-2">برند دستگاه</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(BRAND_LABELS) as EstimatorInput["brand"][]).map((b) => (
                    <button
                      key={b}
                      onClick={() => setForm({ ...form, brand: b })}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                        form.brand === b
                          ? "bg-[#FF5722]/10 border-[#FF5722]/40 text-[#FF5722]"
                          : "bg-[#FFF9F5] border-[#1A1410]/10 text-[#1A1410]/60 hover:border-[#FF5722]/30"
                      }`}
                    >
                      {BRAND_LABELS[b]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-[#1A1410]/70 mb-2">سن دستگاه</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(AGE_LABELS) as EstimatorInput["age"][]).map((a) => (
                    <button
                      key={a}
                      onClick={() => setForm({ ...form, age: a })}
                      className={`py-2.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                        form.age === a
                          ? "bg-[#FF5722]/10 border-[#FF5722]/40 text-[#FF5722]"
                          : "bg-[#FFF9F5] border-[#1A1410]/10 text-[#1A1410]/60 hover:border-[#FF5722]/30"
                      }`}
                    >
                      {AGE_LABELS[a]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Warranty */}
              <div>
                <label className="block text-xs font-bold text-[#1A1410]/70 mb-2">گارانتی داری؟</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "yes", l: "بله" },
                    { v: "no", l: "خیر" },
                    { v: "unknown", l: "نمی‌دانم" },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() => setForm({ ...form, warranty: o.v as EstimatorInput["warranty"] })}
                      className={`py-2.5 rounded-xl text-[11px] font-bold border transition-all ${
                        form.warranty === o.v
                          ? "bg-[#FF5722]/10 border-[#FF5722]/40 text-[#FF5722]"
                          : "bg-[#FFF9F5] border-[#1A1410]/10 text-[#1A1410]/60 hover:border-[#FF5722]/30"
                      }`}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Device value */}
              <div>
                <label className="block text-xs font-bold text-[#1A1410]/70 mb-2">
                  ارزش تقریبی دستگاه (اختیاری — برای خدمات درصدی)
                </label>
                <FormattedNumberInput
                  value={form.deviceValue}
                  onChange={(v) => setForm({ ...form, deviceValue: v })}
                  placeholder="مثلاً ۲۰٬۰۰۰٬۰۰۰"
                  className="w-full bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl px-4 py-3 pr-4 pl-14 text-sm text-[#1A1410] placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/15 transition-all"
                />
                <p className="text-[10px] text-[#1A1410]/40 mt-1">
                  اگر نمی‌دانی، خالی بگذار — با تایپ، اعداد به‌صورت خودکار جدا می‌شوند
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleBack}
                  className="flex-1 py-3.5 rounded-xl border border-[#1A1410]/10 text-[#1A1410]/60 text-sm font-bold hover:bg-[#1A1410]/5 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  قبلی
                </button>
                <button
                  onClick={() => setStep("result")}
                  className="flex-[2] py-3.5 rounded-xl bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white text-sm font-bold hover:from-[#F4511E] hover:to-[#FF8F00] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5722]/25"
                >
                  <Sparkles className="w-4 h-4" />
                  نمایش تخمین
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Result */}
          {step === "result" && <ResultStep form={form} onReset={resetForm} onBack={handleBack} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ==================== Result Step ====================
function ResultStep({
  form,
  onReset,
  onBack,
}: {
  form: FormState;
  onReset: () => void;
  onBack: () => void;
}) {
  let result;
  try {
    result = estimate({
      device: form.device,
      problem: form.problem,
      brand: form.brand,
      age: form.age,
      warranty: form.warranty,
      deviceValue: form.deviceValue,
    });
  } catch {
    return (
      <div className="bg-white rounded-[36px] p-8 border border-red-200 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-sm font-bold text-red-600 mb-2">خطا در محاسبه</p>
        <p className="text-xs text-red-400 mb-4">لطفاً دوباره تلاش کنید</p>
        <button onClick={onBack} className="text-xs font-bold text-[#FF5722] hover:underline">
          بازگشت
        </button>
      </div>
    );
  }

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-4"
    >
      {/* Price Card */}
      <div className="bg-gradient-to-br from-[#FF5722] to-[#FFA000] rounded-[36px] p-6 sm:p-9 text-white shadow-2xl shadow-[#FF5722]/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-white/80 text-[11px] font-bold">تخمین هزینه</span>
          </div>

          <p className="text-white/80 text-xs mb-2">{result.service.label}</p>

          <div className="mb-6">
            <p className="text-[11px] text-white/70 mb-1">بازه قیمت</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl sm:text-4xl font-black">{faNum(result.finalMin)}</span>
              <span className="text-lg text-white/70">تا</span>
              <span className="text-2xl sm:text-4xl font-black">{faNum(result.finalMax)}</span>
              <span className="text-sm text-white/70">تومان</span>
            </div>
          </div>

          {/* Factors */}
          {result.factors.length > 0 && (
            <div className="bg-white/15 rounded-2xl p-3 backdrop-blur-sm">
              <p className="text-[10px] text-white/70 mb-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                عوامل مؤثر:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.factors.map((f, i) => (
                  <span key={i} className="text-[10px] bg-white/20 px-2 py-1 rounded-full font-medium">
                    {f.label} {f.percent > 0 ? "+" : ""}{faNum(f.percent)}٪
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Request Form — ثبت سریع از همین‌جا */}
      <QuickRequestForm
        form={form}
        estimateMin={result.finalMin}
        estimateMax={result.finalMax}
        serviceLabel={result.service.label}
      />

      {/* Notes */}
      <div className="bg-white rounded-[28px] p-5 border border-[#1A1410]/8">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-[#FF5722]" />
          <h3 className="text-sm font-bold">نکات مهم</h3>
        </div>
        <ul className="space-y-2">
          {result.notes.map((n, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-[#1A1410]/60 leading-relaxed">
              <CheckCircle2 className="w-3 h-3 text-[#FF5722] flex-shrink-0 mt-0.5" />
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA — فرم کامل (اختیاری) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onReset}
          className="py-3.5 rounded-xl border border-[#1A1410]/10 text-[#1A1410]/60 text-sm font-bold hover:bg-[#1A1410]/5 transition-all"
        >
          تخمین جدید
        </button>
        <Link
          href="/requests"
          className="py-3.5 rounded-xl border border-[#FF5722]/40 text-[#FF5722] text-sm font-bold hover:bg-[#FF5722]/8 transition-all flex items-center justify-center gap-2"
        >
          <ClipboardList className="w-4 h-4" />
          فرم کامل
        </Link>
      </div>

      <p className="text-center text-[10px] text-[#1A1410]/40 pt-2">
        این تخمین تقریبی است — قیمت نهایی پس از عیب‌یابی مشخص می‌شود
      </p>
    </motion.div>
  );
}