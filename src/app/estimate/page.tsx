// src/app/estimate/page.tsx
"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ComponentType,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  AlertCircle,
  Apple,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Info,
  Laptop,
  Loader2,
  MapPin,
  Monitor,
  Newspaper,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
  Truck,
  User,
  Users,
} from "lucide-react";
import {
  estimate,
  BRAND_LABELS,
  AGE_LABELS,
  faNum,
  getServicesForDevice,
  type DeviceCategory,
  type EstimatorInput,
} from "@/lib/pricing";

type Step = "device" | "problem" | "details" | "result";

interface FormState {
  device: DeviceCategory;
  problem: string;
  brand: EstimatorInput["brand"];
  age: EstimatorInput["age"];
  warranty: EstimatorInput["warranty"];
  deviceValue?: number;
}

interface DeviceOption {
  value: DeviceCategory;
  label: string;
  icon: ComponentType<{ className?: string }>;
  desc: string;
}

interface ProblemOption {
  value: string;
  label: string;
  hint: string;
}

const DEVICES: DeviceOption[] = [
  { value: "laptop", label: "لپ‌تاپ", icon: Laptop, desc: "تعمیر و سرویس" },
  { value: "desktop", label: "کامپیوتر", icon: Monitor, desc: "کیس و آل‌این‌وان" },
  { value: "macbook", label: "مک", icon: Apple, desc: "اورهال و خنک‌کنندگی" },
];

const PROBLEMS: ProblemOption[] = [
  { value: "diagnosis", label: "نمی‌دانم مشکل چیست — فقط عیب‌یابی", hint: "بررسی تخصصی دستگاه" },
  { value: "mac-service", label: "سرویس و اورهال مک", hint: "سرویس کامل دستگاه" },
  { value: "fan-paste", label: "دستگاه داغ می‌شود / فن صدا می‌دهد", hint: "سرویس فن و خنک‌کنندگی" },
  { value: "general-service", label: "سرویس عمومی لپ‌تاپ", hint: "گردگیری و خمیر سیلیکون" },
  { value: "general-service-normal", label: "سرویس کامل سیستم معمولی", hint: "سرویس دوره‌ای کیس" },
  { value: "general-service-gaming", label: "سرویس کامل سیستم گیمینگ", hint: "سرویس سیستم حرفه‌ای" },
  { value: "software", label: "کند شده / ویروس گرفته / بالا نمی‌آید", hint: "رفع اشکال نرم‌افزاری" },
  { value: "virus-scan", label: "ویروس‌یابی و حذف بدافزار", hint: "پاک‌سازی کامل سیستم" },
  { value: "win-install", label: "می‌خواهم ویندوز نصب کنم", hint: "نصب ویندوز + درایور" },
  { value: "mac-windows-install", label: "می‌خواهم روی مک ویندوز نصب کنم", hint: "بوت‌کمپ یا ماشین مجازی" },
  { value: "macos-install", label: "می‌خواهم مک‌اواس نصب / بازنشانی کنم", hint: "نصب macOS" },
  { value: "linux-install", label: "می‌خواهم لینوکس نصب کنم", hint: "لینوکس / اوبونتو" },
  { value: "lcd-repair", label: "صفحه‌نمایش شکسته یا خط دارد", hint: "تعمیر یا تعویض LCD" },
  { value: "keyboard-nosolder", label: "بعضی کلیدهای کیبورد کار نمی‌کنند", hint: "تعویض کیبورد" },
  { value: "charge-socket-repair", label: "شارژ نمی‌شود / سوکت شارژ مشکل دارد", hint: "تعمیر یا تعویض سوکت" },
  { value: "hdd-repair", label: "هارد صدا می‌دهد یا شناسایی نمی‌شود", hint: "تعمیر یا تعویض هارد" },
  { value: "hdd-upgrade", label: "می‌خواهم هارد را ارتقا بدهم (SSD)", hint: "ارتقای هارد" },
  { value: "ram", label: "می‌خواهم RAM را ارتقا بدهم", hint: "تعویض یا ارتقای RAM" },
  { value: "motherboard", label: "دستگاه روشن نمی‌شود / مادربرد مشکل دارد", hint: "تعمیر مادربرد" },
  { value: "motherboard-replace", label: "می‌خواهم مادربرد تعویض شود", hint: "تعویض مادربرد" },
  { value: "gpu", label: "گرافیک ضعیف شده / تصویر خراب است", hint: "تعمیر یا تعویض گرافیک" },
  { value: "gpu-repair", label: "کارت گرافیک مشکل دارد", hint: "تعمیر کارت گرافیک" },
  { value: "bios-software", label: "بایوس مشکل دارد / صفحه سیاه است", hint: "پروگرام بایوس" },
  { value: "hinge", label: "لولا / قاب دستگاه شل شده", hint: "تعمیر یا تعویض لولا" },
  { value: "case-repair", label: "بدنه / قاب شکسته", hint: "تعمیر قاب" },
  { value: "psu", label: "پاور مشکل دارد", hint: "تعمیر یا تعویض پاور" },
  { value: "psu-repair", label: "می‌خواهم پاور تعمیر شود", hint: "تعمیر پاور" },
  { value: "psu-replace", label: "می‌خواهم پاور تعویض شود", hint: "تعویض پاور" },
  { value: "fan-replace", label: "فن خراب شده / صدا می‌دهد", hint: "تعویض فن" },
  { value: "liquid-cooling", label: "می‌خواهم خنک‌کننده مایع نصب کنم", hint: "نصب سیستم خنک‌کننده" },
  { value: "assemble-normal", label: "اسمبل سیستم معمولی", hint: "بستن و راه‌اندازی سیستم" },
  { value: "assemble-gaming", label: "اسمبل سیستم گیمینگ", hint: "اسمبل سیستم حرفه‌ای" },
  { value: "hardware-install", label: "نصب کارت سخت‌افزاری", hint: "نصب قطعه و درایور" },
  { value: "diagnosis-part-level", label: "عیب‌یابی در سطح تعویض قطعه", hint: "بررسی قطعه‌به‌قطعه" },
  { value: "diagnosis-circuit-level", label: "عیب‌یابی در سطح تعمیرات مداری", hint: "بررسی تخصصی مدار" },
  { value: "software-special", label: "نصب نرم‌افزار تخصصی", hint: "نصب و راه‌اندازی نرم‌افزار" },
  { value: "peripheral-install", label: "نصب تجهیزات جانبی", hint: "پرینتر، اسکنر و..." },
];

const DEVICE_TO_API: Record<DeviceCategory, "لپ‌تاپ" | "کامپیوتر (PC)" | "مک‌بوک"> = {
  laptop: "لپ‌تاپ",
  desktop: "کامپیوتر (PC)",
  macbook: "مک‌بوک",
};

const toEnglishDigits = (value: string): string => {
  const persian = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let output = value;

  for (let index = 0; index < 10; index += 1) {
    output = output
      .replace(new RegExp(persian[index], "g"), String(index))
      .replace(new RegExp(arabic[index], "g"), String(index));
  }

  return output;
};

const formatThousands = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "";
  }

  return value.toLocaleString("fa-IR");
};

function StepIndicator({ step }: { step: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "device", label: "دستگاه" },
    { id: "problem", label: "خدمت" },
    { id: "details", label: "جزئیات" },
    { id: "result", label: "تخمین" },
  ];
  const currentIndex = steps.findIndex((item) => item.id === step);

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {steps.map((item, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={item.id} className="flex items-center gap-1 sm:gap-2">
            <div
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold transition-all ${
                isActive
                  ? "bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white shadow-md shadow-[#FF5722]/25"
                  : isDone
                    ? "bg-[#FF5722]/10 text-[#FF5722]"
                    : "bg-[#1A1410]/5 text-[#1A1410]/30"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <span>{faNum(index + 1)}</span>
              )}
              <span className="hidden sm:inline">{item.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-4 sm:w-6 h-px ${isDone ? "bg-[#FF5722]/40" : "bg-[#1A1410]/10"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = toEnglishDigits(event.target.value);
    const digitsOnly = raw.replace(/[^0-9]/g, "");

    if (digitsOnly === "") {
      setDisplay("");
      onChange(undefined);
      return;
    }

    let parsedValue = parseInt(digitsOnly, 10);

    if (Number.isNaN(parsedValue)) {
      setDisplay("");
      onChange(undefined);
      return;
    }

    if (min !== undefined && parsedValue < min) {
      parsedValue = min;
    }
    if (max !== undefined && parsedValue > max) {
      parsedValue = max;
    }

    setDisplay(formatThousands(parsedValue));
    onChange(parsedValue);
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (sending) {
      return;
    }

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
      const description = [
        `تخمین اولیه: ${faNum(estimateMin)} تا ${faNum(estimateMax)} تومان`,
        `برند: ${BRAND_LABELS[form.brand]}`,
        `سن دستگاه: ${AGE_LABELS[form.age]}`,
        `گارانتی: ${
          form.warranty === "yes"
            ? "دارد"
            : form.warranty === "no"
              ? "ندارد"
              : "نامشخص"
        }`,
        form.deviceValue ? `ارزش دستگاه: ${faNum(form.deviceValue)} تومان` : null,
      ]
        .filter(Boolean)
        .join(" | ");

      const response = await fetch("/api/requests", {
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

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        toast.error(data.error || "ثبت درخواست انجام نشد. دوباره تلاش کن.", {
          id: loadingToast,
        });
        return;
      }

      toast.success("درخواستت ثبت شد!", { id: loadingToast });

      const params = new URLSearchParams();
      if (data.id) {
        params.set("id", data.id);
      }
      params.set("phone", phone);
      params.set("name", name.trim());
      router.push(`/requests/success?${params.toString()}`);
    } catch (error) {
      console.error("Quick submit error:", error);
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
            فقط اسم و شماره‌ت رو بده، بقیه‌ش با تیم متخصص ما
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
            onChange={(event) => setName(event.target.value)}
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
            onChange={(event) =>
              setPhone(
                toEnglishDigits(event.target.value)
                  .replace(/[^0-9]/g, "")
                  .slice(0, 11)
              )
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
          با ثبت درخواست، کارشناس ما تماس می‌گیرد و عیب‌یابی رایگان است
        </p>
      </form>
    </div>
  );
}

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

  const services = useMemo(
    () => getServicesForDevice(form.device),
    [form.device]
  );

  const handleBack = () => {
    if (step === "problem") {
      setStep("device");
      return;
    }
    if (step === "details") {
      setStep("problem");
      return;
    }
    if (step === "result") {
      setStep("details");
    }
  };

  const resetForm = () => {
    setForm({
      device: "laptop",
      problem: "",
      brand: "other",
      age: "1to3",
      warranty: "no",
      deviceValue: undefined,
    });
    setStep("device");
  };

  const selectDevice = (device: DeviceCategory) => {
    setForm((current) => ({
      ...current,
      device,
      problem: "",
      brand: device === "macbook" ? "apple" : current.brand,
    }));
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-[vazirmatn,sans-serif] flex flex-col relative overflow-x-hidden text-right text-[#1A1410] selection:bg-[#FF5722]/20 selection:text-white">
      <div className="fixed top-0 right-0 w-[70%] h-[70%] bg-[#FF5722]/8 rounded-full blur-[180px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[60%] h-[60%] bg-[#FFA000]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg shadow-[#FF5722]/10 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between border border-[#FF5722]/15 gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-shrink"
          >
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

          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/#services"
              className="px-3 py-2 rounded-full text-[12px] font-bold text-[#1A1410]/60 hover:text-[#FF5722] hover:bg-[#FF5722]/6 transition-colors whitespace-nowrap"
            >
              خدمات
            </Link>
            <Link
              href="/blog"
              className="px-3 py-2 rounded-full text-[12px] font-bold text-[#1A1410]/60 hover:text-[#FF5722] hover:bg-[#FF5722]/6 transition-colors whitespace-nowrap"
            >
              مقالات
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Link
              href="/blog"
              aria-label="مقالات"
              className="sm:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#FF5722]/25 text-[#FF5722] hover:bg-[#FF5722]/8 transition-colors"
            >
              <Newspaper className="w-4 h-4" />
            </Link>
            <Link
              href="/request"
              className="text-[#FF5722] text-[11px] sm:text-sm font-bold hover:text-[#F4511E] transition-colors whitespace-nowrap flex-shrink-0"
            >
              درخواست خدمات
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 sm:pt-32 pb-16 px-4 max-w-3xl mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-7 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-[#FF5722]/8 rounded-full px-3.5 py-1.5 mb-4 border border-[#FF5722]/25">
            <Users className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="text-[#FF5722] text-[10px] sm:text-[11px] font-bold tracking-wider">
              تخمین توسط تیم متخصص مدفیکس
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black mb-3">
            هزینه خدماتت رو تخمین بزن
          </h1>
          <p className="text-[#1A1410]/55 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed px-2">
            نوع دستگاه و خدمت مورد نیازت را انتخاب کن و در چند ثانیه بازه تقریبی هزینه را
            ببین.
          </p>

          <div className="mt-4 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 bg-white border border-[#1A1410]/8 rounded-2xl px-3.5 py-2 text-[10px] sm:text-[11px] text-[#1A1410]/55">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="w-3 h-3 text-[#FF5722]" />
              شیراز: حضوری و مراجعه در محل
            </span>
            <span className="w-px h-3 bg-[#1A1410]/10 hidden sm:block" />
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <Truck className="w-3 h-3 text-[#FF5722]" />
              سایر شهرها: ارسال به شیراز
            </span>
          </div>
        </motion.div>

        <StepIndicator step={step} />

        <AnimatePresence mode="wait">
          {step === "device" && (
            <motion.section
              key="device"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[36px] p-6 sm:p-9 border border-[#FF5722]/10 shadow-xl shadow-[#FF5722]/8"
            >
              <h2 className="text-lg font-black mb-1">دستگاهت چیه؟</h2>
              <p className="text-xs text-[#1A1410]/50 mb-6">
                نوع دستگاه را انتخاب کن
              </p>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
                {DEVICES.map((device) => {
                  const Icon = device.icon;
                  const isActive = form.device === device.value;

                  return (
                    <button
                      key={device.value}
                      type="button"
                      onClick={() => selectDevice(device.value)}
                      className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border transition-all ${
                        isActive
                          ? "bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white border-transparent shadow-lg shadow-[#FF5722]/25"
                          : "bg-[#FFF9F5] text-[#1A1410]/60 border-[#1A1410]/10 hover:border-[#FF5722]/40"
                      }`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span className="text-xs sm:text-sm font-bold">
                        {device.label}
                      </span>
                      <span
                        className={`text-[9px] sm:text-[10px] text-center leading-tight ${
                          isActive ? "text-white/70" : "text-[#1A1410]/40"
                        }`}
                      >
                        {device.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setStep("problem")}
                className="w-full py-3.5 rounded-xl bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white text-sm font-bold hover:from-[#F4511E] hover:to-[#FF8F00] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5722]/25"
              >
                مرحله بعد
                <ArrowLeft className="w-4 h-4" />
              </button>
            </motion.section>
          )}

          {step === "problem" && (
            <motion.section
              key="problem"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[36px] p-6 sm:p-9 border border-[#FF5722]/10 shadow-xl shadow-[#FF5722]/8"
            >
              <h2 className="text-lg font-black mb-1">چه خدمتی نیاز داری؟</h2>
              <p className="text-xs text-[#1A1410]/50 mb-6">
                نزدیک‌ترین گزینه را انتخاب کن
              </p>

              <div className="space-y-2 mb-6 max-h-[420px] overflow-y-auto pl-1">
                {PROBLEMS.filter((problem) =>
                  services.some((service) => service.id === problem.value)
                ).map((problem) => (
                  <button
                    key={problem.value}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        problem: problem.value,
                      }))
                    }
                    className={`w-full text-right flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                      form.problem === problem.value
                        ? "bg-[#FF5722]/8 border-[#FF5722]/40"
                        : "bg-[#FFF9F5] border-[#1A1410]/10 hover:border-[#FF5722]/30"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        form.problem === problem.value
                          ? "border-[#FF5722] bg-[#FF5722]"
                          : "border-[#1A1410]/20"
                      }`}
                    >
                      {form.problem === problem.value && (
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1A1410]">
                        {problem.label}
                      </p>
                      <p className="text-[10px] text-[#1A1410]/40 mt-0.5">
                        {problem.hint}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3.5 rounded-xl border border-[#1A1410]/10 text-[#1A1410]/60 text-sm font-bold hover:bg-[#1A1410]/5 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  قبلی
                </button>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  disabled={!form.problem}
                  className="flex-[2] py-3.5 rounded-xl bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white text-sm font-bold hover:from-[#F4511E] hover:to-[#FF8F00] disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5722]/25"
                >
                  مرحله بعد
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </motion.section>
          )}

          {step === "details" && (
            <motion.section
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-[36px] p-6 sm:p-9 border border-[#FF5722]/10 shadow-xl shadow-[#FF5722]/8 space-y-5"
            >
              <div>
                <h2 className="text-lg font-black mb-1">چند سؤال کوتاه</h2>
                <p className="text-xs text-[#1A1410]/50 mb-6">
                  برای تخمین دقیق‌تر
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1410]/70 mb-2">
                  برند دستگاه
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(BRAND_LABELS) as EstimatorInput["brand"][]).map(
                    (brand) => (
                      <button
                        key={brand}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({ ...current, brand }))
                        }
                        className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                          form.brand === brand
                            ? "bg-[#FF5722]/10 border-[#FF5722]/40 text-[#FF5722]"
                            : "bg-[#FFF9F5] border-[#1A1410]/10 text-[#1A1410]/60 hover:border-[#FF5722]/30"
                        }`}
                      >
                        {BRAND_LABELS[brand]}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1410]/70 mb-2">
                  سن دستگاه
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(AGE_LABELS) as EstimatorInput["age"][]).map(
                    (age) => (
                      <button
                        key={age}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({ ...current, age }))
                        }
                        className={`py-2.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                          form.age === age
                            ? "bg-[#FF5722]/10 border-[#FF5722]/40 text-[#FF5722]"
                            : "bg-[#FFF9F5] border-[#1A1410]/10 text-[#1A1410]/60 hover:border-[#FF5722]/30"
                        }`}
                      >
                        {AGE_LABELS[age]}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1410]/70 mb-2">
                  گارانتی داری؟
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "yes", label: "بله" },
                    { value: "no", label: "خیر" },
                    { value: "unknown", label: "نمی‌دانم" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          warranty: option.value as EstimatorInput["warranty"],
                        }))
                      }
                      className={`py-2.5 rounded-xl text-[11px] font-bold border transition-all ${
                        form.warranty === option.value
                          ? "bg-[#FF5722]/10 border-[#FF5722]/40 text-[#FF5722]"
                          : "bg-[#FFF9F5] border-[#1A1410]/10 text-[#1A1410]/60 hover:border-[#FF5722]/30"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A1410]/70 mb-2">
                  ارزش تقریبی دستگاه (اختیاری — برای خدمات درصدی)
                </label>
                <FormattedNumberInput
                  value={form.deviceValue}
                  onChange={(deviceValue) =>
                    setForm((current) => ({ ...current, deviceValue }))
                  }
                  placeholder="مثلاً ۲۰٬۰۰۰٬۰۰۰"
                  className="w-full bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl px-4 py-3 pr-4 pl-14 text-sm text-[#1A1410] placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/15 transition-all"
                />
                <p className="text-[10px] text-[#1A1410]/40 mt-1">
                  اگر نمی‌دانی، خالی بگذار — با تایپ، اعداد به‌صورت خودکار جدا می‌شوند
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3.5 rounded-xl border border-[#1A1410]/10 text-[#1A1410]/60 text-sm font-bold hover:bg-[#1A1410]/5 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  قبلی
                </button>
                <button
                  type="button"
                  onClick={() => setStep("result")}
                  className="flex-[2] py-3.5 rounded-xl bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white text-sm font-bold hover:from-[#F4511E] hover:to-[#FF8F00] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5722]/25"
                >
                  <Sparkles className="w-4 h-4" />
                  نمایش تخمین
                </button>
              </div>
            </motion.section>
          )}

          {step === "result" && (
            <ResultStep form={form} onReset={resetForm} onBack={handleBack} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ResultStep({
  form,
  onReset,
  onBack,
}: {
  form: FormState;
  onReset: () => void;
  onBack: () => void;
}) {
  let result: ReturnType<typeof estimate>;

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
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-[#FF5722] hover:underline"
        >
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
      <div className="bg-gradient-to-br from-[#FF5722] to-[#FFA000] rounded-[36px] p-6 sm:p-9 text-white shadow-2xl shadow-[#FF5722]/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-white/80 text-[11px] font-bold">
              تخمین هزینه
            </span>
          </div>

          <p className="text-white/80 text-xs mb-2">{result.service.label}</p>

          <div className="mb-6">
            <p className="text-[11px] text-white/70 mb-1">بازه قیمت</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl sm:text-4xl font-black">
                {faNum(result.finalMin)}
              </span>
              <span className="text-lg text-white/70">تا</span>
              <span className="text-2xl sm:text-4xl font-black">
                {faNum(result.finalMax)}
              </span>
              <span className="text-sm text-white/70">تومان</span>
            </div>
          </div>

          {result.factors.length > 0 && (
            <div className="bg-white/15 rounded-2xl p-3 backdrop-blur-sm">
              <p className="text-[10px] text-white/70 mb-2 flex items-center gap-1">
                <Info className="w-3 h-3" />
                عوامل مؤثر:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.factors.map((factor) => (
                  <span
                    key={factor.label}
                    className="text-[10px] bg-white/20 px-2 py-1 rounded-full font-medium"
                  >
                    {factor.label} {factor.percent > 0 ? "+" : ""}
                    {faNum(factor.percent)}٪
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <QuickRequestForm
        form={form}
        estimateMin={result.finalMin}
        estimateMax={result.finalMax}
        serviceLabel={result.service.label}
      />

      <div className="bg-white rounded-[28px] p-5 border border-[#1A1410]/8">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-[#FF5722]" />
          <h3 className="text-sm font-bold">نکات مهم</h3>
        </div>
        <ul className="space-y-2">
          {result.notes.map((note) => (
            <li
              key={note}
              className="flex items-start gap-2 text-[11px] text-[#1A1410]/60 leading-relaxed"
            >
              <CheckCircle2 className="w-3 h-3 text-[#FF5722] flex-shrink-0 mt-0.5" />
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-[28px] p-5 border border-[#1A1410]/8">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-[#FF5722]" />
          <h3 className="text-sm font-bold">پوشش خدمات</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2.5 bg-[#FFF9F5] border border-[#1A1410]/8 rounded-xl px-3 py-2.5">
            <MapPin className="w-4 h-4 text-[#FF5722] flex-shrink-0" />
            <p className="text-[11px] text-[#1A1410]/60 leading-relaxed">
              شیراز: حضوری و مراجعه در محل مشتری
            </p>
          </div>
          <div className="flex items-center gap-2.5 bg-[#FFF9F5] border border-[#1A1410]/8 rounded-xl px-3 py-2.5">
            <Truck className="w-4 h-4 text-[#FF5722] flex-shrink-0" />
            <p className="text-[11px] text-[#1A1410]/60 leading-relaxed">
              سایر شهرها: ارسال دستگاه به شیراز
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-[#1A1410]/40">
          <Timer className="w-3 h-3 text-[#FF5722] flex-shrink-0" />
          <span>هماهنگی زمان خدمات با تیم متخصص انجام می‌شود</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onReset}
          className="py-3.5 rounded-xl border border-[#1A1410]/10 text-[#1A1410]/60 text-sm font-bold hover:bg-[#1A1410]/5 transition-all"
        >
          تخمین جدید
        </button>
        <Link
          href="/request"
          className="py-3.5 rounded-xl border border-[#FF5722]/40 text-[#FF5722] text-sm font-bold hover:bg-[#FF5722]/8 transition-all flex items-center justify-center gap-2"
        >
          <ClipboardList className="w-4 h-4" />
          فرم کامل
        </Link>
      </div>

      <p className="text-center text-[10px] text-[#1A1410]/40 pt-2">
        این تخمین تقریبی است — قیمت نهایی پس از عیب‌یابی توسط تیم متخصص مشخص می‌شود
      </p>
    </motion.div>
  );
}
