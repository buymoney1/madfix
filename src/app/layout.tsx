// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-vazir",
  display: "swap",
});

// ─── Site Config ─────────────────────────────────────────────────────────────
const SITE_URL = "https://medfixshiraz.ir"; // دامنه واقعی را جایگزین کن
const SITE_NAME = "مدفیکس شیراز";
const SITE_TITLE = "مدفیکس | تعمیرات تخصصی لپ‌تاپ و کامپیوتر در شیراز";
const SITE_DESCRIPTION =
  "مدفیکس شیراز، مرکز تخصصی تعمیر لپ‌تاپ، کامپیوتر، مک‌بوک و هارد/SSD. عیب‌یابی رایگان، قطعات اصل، گارانتی خدمات و پشتیبانی سریع. همین حالا درخواست تعمیر ثبت کنید.";

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.json",

  title: {
    default: SITE_TITLE,
    template: "%s | مدفیکس شیراز",
  },
  description: SITE_DESCRIPTION,

  keywords: [
    "تعمیر لپ تاپ شیراز",
    "تعمیر کامپیوتر شیراز",
    "تعمیر مک بوک شیراز",
    "تعمیر هارد و SSD",
    "بازیابی اطلاعات شیراز",
    "تعمیر مادربرد",
    "تعمیرات تخصصی لپ تاپ",
    "مدفیکس",
    "مدفیکس شیراز",
    "MedFix Shiraz",
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },

  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png", // ترجیحاً 1200×630
        width: 1200,
        height: 630,
        alt: "مدفیکس شیراز - تعمیرات تخصصی لپ‌تاپ",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  category: "technology",
};

// ─── Viewport (جدا از metadata در Next 14+) ─────────────────────────────────
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF9F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1410" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light",
};

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#FFF9F5] text-[#1A1410] selection:bg-[#FF5722] selection:text-white">
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          duration={4000}
          expand={false}
          visibleToasts={3}
          toastOptions={{
            style: {
              fontFamily: "var(--font-vazir), system-ui, sans-serif",
              borderRadius: "16px",
            },
            className: "text-right",
          }}
        />
      </body>
    </html>
  );
}