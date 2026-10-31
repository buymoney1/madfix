// src/lib/pricing.ts
// ===================================================================
// ============== موتور قیمت‌گذاری تخمینی مدفیکس =====================
// ===================================================================

export type DeviceCategory = "laptop" | "desktop" | "macbook";

export interface PriceRange {
  min: number;
  max: number;
}

export interface ServiceItem {
  id: string;
  label: string;
  category: DeviceCategory;
  range: PriceRange | { minPercent: number; maxPercent: number };
  isPercentage?: boolean;
  unit: string;
  keywords: string[];
}

// ===================================================================
// ============== جدول خدمات لپ‌تاپ =================================
// ===================================================================
const LAPTOP_SERVICES: ServiceItem[] = [
  { id: "diagnosis", label: "بازدید و عیب‌یابی", category: "laptop", range: { min: 500_000, max: 1_000_000 }, unit: "هر سرویس", keywords: ["عیب یابی", "بررسی"] },
  { id: "open-close", label: "باز و بست دستگاه", category: "laptop", range: { min: 600_000, max: 1_000_000 }, unit: "هر دستگاه", keywords: ["باز کردن"] },
  { id: "general-service", label: "سرویس عمومی", category: "laptop", range: { min: 800_000, max: 1_500_000 }, unit: "هر دستگاه", keywords: ["سرویس"] },
  { id: "lcd-repair", label: "تعمیر یا تعویض LCD", category: "laptop", range: { min: 1_000_000, max: 2_500_000 }, unit: "هر عدد", keywords: ["صفحه", "نمایشگر"] },
  { id: "keyboard-noopen", label: "تعویض کیبورد بدون باز کردن دستگاه", category: "laptop", range: { min: 500_000, max: 1_000_000 }, unit: "هر قطعه", keywords: ["کیبورد"] },
  { id: "keyboard-nosolder", label: "تعویض کیبورد بدون نیاز به جوش", category: "laptop", range: { min: 550_000, max: 1_000_000 }, unit: "هر قطعه", keywords: ["کیبورد"] },
  { id: "keyboard-solder", label: "تعویض کیبورد با جوش پلاستیک", category: "laptop", range: { min: 900_000, max: 2_000_000 }, unit: "هر قطعه", keywords: ["کیبورد"] },
  { id: "adapter-cable", label: "تعویض کابل آداپتور یا شارژر", category: "laptop", range: { min: 450_000, max: 850_000 }, unit: "هر قطعه", keywords: ["شارژر"] },
  { id: "adapter-repair", label: "تعمیر آداپتور", category: "laptop", range: { min: 500_000, max: 1_000_000 }, unit: "هر عدد", keywords: ["آداپتور"] },
  { id: "charge-circuit", label: "تعمیر یا تعویض مدار شارژ", category: "laptop", range: { min: 900_000, max: 2_500_000 }, unit: "هر قطعه", keywords: ["شارژ"] },
  { id: "charge-socket-repair", label: "تعمیر سوکت شارژر", category: "laptop", range: { min: 600_000, max: 1_500_000 }, unit: "هر عدد", keywords: ["سوکت شارژ"] },
  { id: "charge-socket-replace", label: "تعویض سوکت شارژر", category: "laptop", range: { min: 500_000, max: 2_000_000 }, unit: "هر قطعه", keywords: ["سوکت شارژ"] },
  { id: "ports", label: "تعمیر یا تعویض پورت‌های ارتباطی", category: "laptop", range: { min: 650_000, max: 1_500_000 }, unit: "هر قطعه", keywords: ["پورت"] },
  { id: "chip-reball", label: "تعویض یا ریبال چیپ", category: "laptop", range: { min: 2_000_000, max: 4_750_000 }, unit: "هر قطعه", keywords: ["چیپ"] },
  { id: "cpu-socket", label: "تعویض CPU سوکت‌دار", category: "laptop", range: { min: 850_000, max: 1_500_000 }, unit: "هر قطعه", keywords: ["cpu"] },
  { id: "cpu-onboard", label: "تعویض CPU آنبرد", category: "laptop", range: { min: 1_600_000, max: 3_100_000 }, unit: "هر قطعه", keywords: ["cpu"] },
  { id: "cpu-repair", label: "تعمیر CPU", category: "laptop", range: { min: 1_000_000, max: 5_000_000 }, unit: "هر سرویس", keywords: ["cpu"] },
  { id: "ram", label: "تعویض یا ارتقای RAM", category: "laptop", range: { min: 500_000, max: 950_000 }, unit: "هر قطعه", keywords: ["رم"] },
  { id: "hdd-repair", label: "تعمیر یا تعویض هارد", category: "laptop", range: { minPercent: 10, maxPercent: 35 }, isPercentage: true, unit: "کل کار", keywords: ["هارد"] },
  { id: "hdd-upgrade", label: "ارتقای هارد", category: "laptop", range: { min: 750_000, max: 1_400_000 }, unit: "هر قطعه", keywords: ["هارد"] },
  { id: "inverter", label: "تعمیر و تعویض برد اینورتر", category: "laptop", range: { min: 800_000, max: 2_250_000 }, unit: "هر عدد", keywords: ["اینورتر"] },
  { id: "fan-paste", label: "سرویس فن و خمیر سیلیکون", category: "laptop", range: { min: 800_000, max: 2_000_000 }, unit: "هر سرویس", keywords: ["فن", "خمیر", "داغ"] },
  { id: "fan-repair", label: "تعمیر فن", category: "laptop", range: { min: 500_000, max: 1_000_000 }, unit: "هر عدد", keywords: ["فن"] },
  { id: "fan-replace", label: "تعویض فن", category: "laptop", range: { min: 550_000, max: 1_100_000 }, unit: "هر قطعه", keywords: ["فن"] },
  { id: "touchpad", label: "تعمیر یا تعویض تاچ پد", category: "laptop", range: { min: 900_000, max: 2_500_000 }, unit: "هر قطعه", keywords: ["تاچ پد"] },
  { id: "lcd-touch", label: "تعویض LCD تاچ", category: "laptop", range: { min: 1_000_000, max: 2_500_000 }, unit: "هر قطعه", keywords: ["صفحه"] },
  { id: "motherboard", label: "تعویض مادربرد", category: "laptop", range: { min: 1_200_000, max: 3_000_000 }, unit: "کل کار", keywords: ["مادربرد"] },
  { id: "case-ab", label: "تعویض قاب A و B", category: "laptop", range: { min: 1_000_000, max: 2_000_000 }, unit: "هر قطعه", keywords: ["قاب"] },
  { id: "case-cd", label: "تعویض قاب C و D", category: "laptop", range: { min: 750_000, max: 2_000_000 }, unit: "هر قطعه", keywords: ["قاب"] },
  { id: "case-repair", label: "تعمیر قاب", category: "laptop", range: { min: 675_000, max: 2_000_000 }, unit: "هر قطعه", keywords: ["قاب"] },
  { id: "hinge", label: "تعمیر یا تعویض لولا", category: "laptop", range: { min: 900_000, max: 2_000_000 }, unit: "هر قطعه", keywords: ["لولا"] },
  { id: "gpu", label: "تعمیر یا تعویض کارت گرافیک", category: "laptop", range: { min: 700_000, max: 2_000_000 }, unit: "هر قطعه", keywords: ["گرافیک"] },
  { id: "wifi", label: "تعمیر یا تعویض چیپ وای‌فای و شبکه", category: "laptop", range: { min: 800_000, max: 1_750_000 }, unit: "هر قطعه", keywords: ["وای فای"] },
  { id: "speaker", label: "تعمیر یا تعویض اسپیکر", category: "laptop", range: { min: 550_000, max: 1_500_000 }, unit: "هر قطعه", keywords: ["اسپیکر"] },
  { id: "webcam", label: "تعمیر یا تعویض وب‌کم", category: "laptop", range: { min: 550_000, max: 1_500_000 }, unit: "هر قطعه", keywords: ["وب کم"] },
  { id: "flat", label: "تعمیر و تعویض فلت", category: "laptop", range: { min: 775_000, max: 1_900_000 }, unit: "هر عدد", keywords: ["فلت"] },
  { id: "software", label: "رفع اشکالات نرم‌افزاری", category: "laptop", range: { min: 475_000, max: 1_350_000 }, unit: "هر دستگاه", keywords: ["نرم افزار", "ویندوز"] },
  { id: "win-install", label: "نصب ویندوز و درایور", category: "laptop", range: { min: 870_000, max: 1_150_000 }, unit: "هر سیستم", keywords: ["ویندوز"] },
  { id: "linux-install", label: "نصب لینوکس و اوبونتو", category: "laptop", range: { min: 1_000_000, max: 2_000_000 }, unit: "هر سیستم", keywords: ["لینوکس"] },
  { id: "macos-install", label: "نصب مک‌اواس و بهینه‌سازی", category: "laptop", range: { min: 1_200_000, max: 2_200_000 }, unit: "هر سیستم", keywords: ["مک", "macos"] },
  { id: "software-general", label: "نصب نرم‌افزارهای عمومی", category: "laptop", range: { min: 174_000, max: 230_000 }, unit: "هر نرم‌افزار", keywords: ["نصب نرم افزار"] },
  { id: "software-special", label: "نصب نرم‌افزارهای تخصصی", category: "laptop", range: { min: 348_000, max: 460_000 }, unit: "هر نرم‌افزار", keywords: ["نرم افزار تخصصی"] },
  { id: "virus-scan", label: "ویروس‌یابی و ویروس‌زدایی سیستم", category: "laptop", range: { min: 478_000, max: 633_000 }, unit: "هر سیستم", keywords: ["ویروس"] },
  { id: "antivirus", label: "نصب آنتی‌ویروس", category: "laptop", range: { min: 391_000, max: 517_000 }, unit: "هر سیستم", keywords: ["آنتی ویروس"] },
  { id: "peripheral-install", label: "نصب تجهیزات جانبی", category: "laptop", range: { min: 348_000, max: 460_000 }, unit: "هر دستگاه", keywords: ["پرینتر"] },
  { id: "transport", label: "ایاب و ذهاب", category: "laptop", range: { min: 261_000, max: 345_000 }, unit: "هر سرویس", keywords: ["ایاب"] },
  { id: "diagnosis-part-level", label: "عیب‌یابی در سطح تعویض قطعه", category: "laptop", range: { min: 522_000, max: 690_000 }, unit: "هر قطعه", keywords: ["عیب یابی"] },
  { id: "diagnosis-circuit-level", label: "عیب‌یابی در سطح تعمیرات مداری", category: "laptop", range: { min: 870_000, max: 1_150_000 }, unit: "هر قطعه", keywords: ["عیب یابی"] },
  { id: "bios-software", label: "پروگرام نرم‌افزاری بایوس", category: "laptop", range: { min: 500_000, max: 661_000 }, unit: "هر سیستم", keywords: ["بایوس"] },
  { id: "bios-hardware", label: "پروگرام سخت‌افزاری بایوس", category: "laptop", range: { min: 1_040_000, max: 1_380_000 }, unit: "هر سیستم", keywords: ["بایوس"] },
  { id: "cpu-socket-bga", label: "تعویض سوکت CPU با دستگاه BGA", category: "laptop", range: { min: 1_740_000, max: 2_300_000 }, unit: "هر قطعه", keywords: ["سوکت cpu"] },
  { id: "psu", label: "تعمیر پاور", category: "laptop", range: { min: 700_000, max: 2_000_000 }, unit: "هر عدد", keywords: ["پاور"] },
  { id: "odd", label: "تعمیر ODD (درایو نوری)", category: "laptop", range: { min: 325_000, max: 950_000 }, unit: "هر قطعه", keywords: ["odd"] },
  { id: "led-lcd-repair", label: "تعمیر LED و LCD", category: "laptop", range: { minPercent: 20, maxPercent: 25 }, isPercentage: true, unit: "هر دستگاه", keywords: ["صفحه"] },
];

// ===================================================================
// ============== جدول خدمات کامپیوتر ===============================
// ===================================================================
const DESKTOP_SERVICES: ServiceItem[] = [
  { id: "general-service-normal", label: "سرویس کامل سیستم معمولی", category: "desktop", range: { min: 826_000, max: 1_090_000 }, unit: "هر سیستم", keywords: ["سرویس"] },
  { id: "general-service-gaming", label: "سرویس کامل سیستم حرفه‌ای و گیمینگ", category: "desktop", range: { min: 1_740_000, max: 2_300_000 }, unit: "هر سیستم", keywords: ["سرویس"] },
  { id: "diagnosis-part-level", label: "عیب‌یابی در سطح تعویض قطعه", category: "desktop", range: { min: 435_000, max: 575_000 }, unit: "هر قطعه", keywords: ["عیب یابی"] },
  { id: "diagnosis-circuit-level", label: "عیب‌یابی در سطح تعمیرات مداری", category: "desktop", range: { min: 783_000, max: 1_030_000 }, unit: "هر قطعه", keywords: ["عیب یابی"] },
  { id: "motherboard-repair", label: "تعمیر مادربرد", category: "desktop", range: { minPercent: 13, maxPercent: 30 }, isPercentage: true, unit: "هر قطعه", keywords: ["مادربرد"] },
  { id: "motherboard-replace", label: "تعویض مادربرد", category: "desktop", range: { min: 900_000, max: 2_000_000 }, unit: "کل کار", keywords: ["مادربرد"] },
  { id: "jack-socket", label: "تعویض جک و سوکت", category: "desktop", range: { min: 435_000, max: 575_000 }, unit: "هر قطعه", keywords: ["سوکت"] },
  { id: "slot", label: "تعویض اسلات", category: "desktop", range: { min: 478_000, max: 633_000 }, unit: "هر قطعه", keywords: ["اسلات"] },
  { id: "cpu-socket-bga", label: "تعویض سوکت CPU با دستگاه BGA", category: "desktop", range: { min: 1_430_000, max: 1_900_000 }, unit: "هر قطعه", keywords: ["سوکت cpu"] },
  { id: "psu-repair", label: "تعمیر پاور", category: "desktop", range: { min: 775_000, max: 2_000_000 }, unit: "هر عدد", keywords: ["پاور"] },
  { id: "psu-replace", label: "تعویض پاور", category: "desktop", range: { min: 500_000, max: 1_200_000 }, unit: "هر قطعه", keywords: ["پاور"] },
  { id: "odd-repair", label: "تعمیر ODD", category: "desktop", range: { min: 500_000, max: 800_000 }, unit: "هر قطعه", keywords: ["odd"] },
  { id: "odd-install", label: "نصب ODD", category: "desktop", range: { min: 435_000, max: 575_000 }, unit: "هر قطعه", keywords: ["odd"] },
  { id: "speaker", label: "تعمیر اسپیکر", category: "desktop", range: { min: 500_000, max: 1_800_000 }, unit: "هر قطعه", keywords: ["اسپیکر"] },
  { id: "bios-hardware", label: "پروگرام سخت‌افزاری بایوس", category: "desktop", range: { min: 1_000_000, max: 1_320_000 }, unit: "هر سیستم", keywords: ["بایوس"] },
  { id: "bios-software", label: "پروگرام نرم‌افزاری بایوس", category: "desktop", range: { min: 630_000, max: 834_000 }, unit: "هر سیستم", keywords: ["بایوس"] },
  { id: "case-repair", label: "تعمیر قاب", category: "desktop", range: { min: 500_000, max: 1_250_000 }, unit: "هر قطعه", keywords: ["قاب"] },
  { id: "gpu-repair", label: "تعمیر کارت گرافیک", category: "desktop", range: { minPercent: 15, maxPercent: 40 }, isPercentage: true, unit: "هر قطعه", keywords: ["گرافیک"] },
  { id: "led-lcd-repair", label: "تعمیر LED و LCD", category: "desktop", range: { minPercent: 20, maxPercent: 20 }, isPercentage: true, unit: "هر دستگاه", keywords: ["صفحه"] },
  { id: "open-close-case", label: "باز و بست کیس و مینی کیس", category: "desktop", range: { min: 435_000, max: 575_000 }, unit: "هر سیستم", keywords: ["باز کردن"] },
  { id: "open-close-aio", label: "باز و بست دستگاه آل این وان", category: "desktop", range: { min: 1_040_000, max: 1_380_000 }, unit: "هر دستگاه", keywords: ["آل این وان"] },
  { id: "assemble-normal", label: "اسمبل سیستم معمولی", category: "desktop", range: { min: 1_190_000, max: 1_580_000 }, unit: "هر سیستم", keywords: ["اسمبل"] },
  { id: "assemble-gaming", label: "اسمبل سیستم حرفه‌ای و گیمینگ", category: "desktop", range: { min: 2_610_000, max: 3_450_000 }, unit: "هر سیستم", keywords: ["اسمبل"] },
  { id: "fan-paste", label: "سرویس فن و خمیر سیلیکون", category: "desktop", range: { min: 575_000, max: 1_750_000 }, unit: "هر سرویس", keywords: ["فن", "خمیر"] },
  { id: "fan-replace", label: "تعویض فن داخلی کیس و فن CPU", category: "desktop", range: { min: 609_000, max: 805_000 }, unit: "هر قطعه", keywords: ["فن"] },
  { id: "liquid-cooling", label: "نصب سیستم خنک‌کننده مایع", category: "desktop", range: { min: 870_000, max: 1_150_000 }, unit: "هر سیستم", keywords: ["خنک"] },
  { id: "hardware-install", label: "نصب کارت‌های سخت‌افزاری به همراه درایور", category: "desktop", range: { min: 500_000, max: 1_200_000 }, unit: "هر قطعه", keywords: ["نصب"] },
  { id: "peripheral-service", label: "تعویض و سرویس قطعات و کارت‌های جانبی", category: "desktop", range: { min: 522_000, max: 690_000 }, unit: "هر قطعه", keywords: ["جانبی"] },
  { id: "win-install", label: "نصب ویندوز و درایور", category: "desktop", range: { min: 783_000, max: 1_030_000 }, unit: "هر سیستم", keywords: ["ویندوز"] },
  { id: "software-general", label: "نصب نرم‌افزارهای عمومی", category: "desktop", range: { min: 196_000, max: 259_000 }, unit: "هر نرم‌افزار", keywords: ["نصب نرم افزار"] },
  { id: "software-special", label: "نصب نرم‌افزارهای تخصصی", category: "desktop", range: { min: 348_000, max: 460_000 }, unit: "هر نرم‌افزار", keywords: ["نرم افزار تخصصی"] },
  { id: "linux-install", label: "نصب لینوکس و اوبونتو", category: "desktop", range: { min: 1_000_000, max: 1_700_000 }, unit: "هر سیستم", keywords: ["لینوکس"] },
  { id: "macos-install", label: "نصب مک‌اواس و بهینه‌سازی", category: "desktop", range: { min: 1_200_000, max: 2_200_000 }, unit: "هر سیستم", keywords: ["مک", "macos"] },
  { id: "virus-scan", label: "ویروس‌یابی و ویروس‌زدایی", category: "desktop", range: { min: 435_000, max: 575_000 }, unit: "هر سیستم", keywords: ["ویروس"] },
  { id: "antivirus", label: "نصب آنتی‌ویروس", category: "desktop", range: { min: 370_000, max: 489_000 }, unit: "هر سیستم", keywords: ["آنتی ویروس"] },
  { id: "peripheral-install", label: "نصب تجهیزات جانبی", category: "desktop", range: { min: 304_000, max: 402_000 }, unit: "هر دستگاه", keywords: ["پرینتر"] },
];

// ===================================================================
// ============== جدول خدمات مک =====================================
// خدمات مک فقط شامل سرویس، اورهال و خنک‌کنندگی است؛ تعمیرات سخت‌افزاری ارائه نمی‌شود.
// ===================================================================
const MACBOOK_SERVICES: ServiceItem[] = [
  { id: "mac-service", label: "سرویس و اورهال مک", category: "macbook", range: { min: 1_500_000, max: 3_200_000 }, unit: "هر دستگاه", keywords: ["اورهال", "سرویس مک"] },
  { id: "fan-paste", label: "سرویس خنک‌کنندگی مک", category: "macbook", range: { min: 1_200_000, max: 2_600_000 }, unit: "هر سرویس", keywords: ["فن", "خنک", "خمیر"] },
  { id: "mac-windows-install", label: "نصب ویندوز روی مک", category: "macbook", range: { min: 1_500_000, max: 2_800_000 }, unit: "هر سیستم", keywords: ["ویندوز", "بوت کمپ"] },
  { id: "macos-install", label: "نصب و بازنشانی مک‌اواس", category: "macbook", range: { min: 1_200_000, max: 2_500_000 }, unit: "هر سیستم", keywords: ["مک", "macos"] },
  { id: "linux-install", label: "نصب لینوکس روی مک", category: "macbook", range: { min: 1_500_000, max: 2_800_000 }, unit: "هر سیستم", keywords: ["لینوکس"] },
  { id: "software", label: "نصب نرم‌افزارهای تخصصی مک", category: "macbook", range: { min: 600_000, max: 1_500_000 }, unit: "هر دستگاه", keywords: ["نرم افزار"] },
  { id: "diagnosis", label: "بررسی و عیب‌یابی وضعیت مک", category: "macbook", range: { min: 800_000, max: 1_500_000 }, unit: "هر سرویس", keywords: ["عیب یابی"] },
];

// ===================================================================
// ============== API اصلی =========================================
// ===================================================================
export function getServicesForDevice(device: DeviceCategory): ServiceItem[] {
  if (device === "desktop") return DESKTOP_SERVICES;
  if (device === "macbook") return MACBOOK_SERVICES;
  return LAPTOP_SERVICES;
}

export function getServiceById(id: string, device: DeviceCategory): ServiceItem | undefined {
  return getServicesForDevice(device).find((s) => s.id === id);
}

export function resolveRange(service: ServiceItem, deviceValue: number): PriceRange {
  if (service.isPercentage) {
    const r = service.range as { minPercent: number; maxPercent: number };
    return {
      min: Math.round((deviceValue * r.minPercent) / 100),
      max: Math.round((deviceValue * r.maxPercent) / 100),
    };
  }
  return service.range as PriceRange;
}

// ===================================================================
// ============== منطق چندلایه تخمین ===============================
// ===================================================================
export interface EstimatorInput {
  device: DeviceCategory;
  brand: "apple" | "asus" | "hp" | "lenovo" | "dell" | "acer" | "msi" | "microsoft" | "other";
  age: "under1" | "1to3" | "3to5" | "over5";
  problem: string;
  warranty: "yes" | "no" | "unknown";
  deviceValue?: number;
}

export interface EstimatorResult {
  service: ServiceItem;
  range: PriceRange;
  finalMin: number;
  finalMax: number;
  factors: { label: string; percent: number }[];
  notes: string[];
}

const BRAND_FACTOR: Record<EstimatorInput["brand"], number> = {
  apple: 1.35,
  asus: 1.0,
  hp: 1.0,
  lenovo: 1.0,
  dell: 1.0,
  acer: 0.95,
  msi: 1.1,
  microsoft: 1.15,
  other: 1.0,
};

const AGE_FACTOR: Record<EstimatorInput["age"], number> = {
  under1: 0.9,
  "1to3": 1.0,
  "3to5": 1.05,
  over5: 1.1,
};

const TRANSPORT_PERCENT = 0.03;

export function estimate(input: EstimatorInput): EstimatorResult {
  const services = getServicesForDevice(input.device);
  const service = services.find((s) => s.id === input.problem);
  if (!service) throw new Error("سرویس یافت نشد");

  const baseRange = resolveRange(service, input.deviceValue ?? 0);

  const factors: { label: string; percent: number }[] = [];
  let multiplier = 1;

  const brandMul = BRAND_FACTOR[input.brand] ?? 1;
  if (brandMul !== 1) {
    factors.push({ label: `برند (${input.brand})`, percent: Math.round((brandMul - 1) * 100) });
    multiplier *= brandMul;
  }

  const ageMul = AGE_FACTOR[input.age] ?? 1;
  if (ageMul !== 1) {
    factors.push({ label: "سن دستگاه", percent: Math.round((ageMul - 1) * 100) });
    multiplier *= ageMul;
  }

  factors.push({ label: "ایاب و ذهاب", percent: Math.round(TRANSPORT_PERCENT * 100) });
  multiplier *= 1 + TRANSPORT_PERCENT;

  let finalMin = Math.round(baseRange.min * multiplier);
  let finalMax = Math.round(baseRange.max * multiplier);

  if (input.warranty === "yes") {
    factors.push({ label: "گارانتی (تخفیف)", percent: -10 });
    finalMin = Math.round(finalMin * 0.9);
    finalMax = Math.round(finalMax * 0.9);
  }

  const round50 = (n: number) => Math.round(n / 50_000) * 50_000;
  finalMin = Math.max(200_000, round50(finalMin));
  finalMax = Math.max(finalMin + 100_000, round50(finalMax));

  const notes: string[] = [
    "این تخمین بر اساس قیمت میانه بازار و جدول تعرفه مدفیکس است.",
    "قیمت نهایی پس از عیب‌یابی دقیق توسط تیم متخصص مشخص می‌شود.",
    "قطعات مصرفی (مثل LCD، باتری، هارد) جدا از اجرت محاسبه می‌شوند.",
    "در شیراز خدمات حضوری و مراجعه در محل انجام می‌شود؛ برای سایر شهرها دستگاه به شیراز ارسال می‌شود.",
  ];
  if (input.warranty === "yes") notes.push("با توجه به گارانتی، تخفیف ۱۰٪ اعمال شد.");

  return { service, range: baseRange, finalMin, finalMax, factors, notes };
}

export const faNum = (n: number): string => n.toLocaleString("fa-IR");

export const DEVICE_LABELS: Record<DeviceCategory, string> = {
  laptop: "لپ‌تاپ",
  desktop: "کامپیوتر",
  macbook: "مک‌بوک",
};

export const BRAND_LABELS: Record<EstimatorInput["brand"], string> = {
  apple: "اپل / مک‌بوک",
  asus: "ایسوس",
  hp: "اچ‌پی",
  lenovo: "لنوو",
  dell: "دل",
  acer: "ایسر",
  msi: "ام‌اس‌آی",
  microsoft: "مایکروسافت / سرفیس",
  other: "سایر",
};

export const AGE_LABELS: Record<EstimatorInput["age"], string> = {
  under1: "کمتر از ۱ سال",
  "1to3": "۱ تا ۳ سال",
  "3to5": "۳ تا ۵ سال",
  over5: "بیشتر از ۵ سال",
};