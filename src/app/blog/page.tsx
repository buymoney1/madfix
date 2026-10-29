// src/app/blog/page.tsx

import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Eye,
  Search,
  BookOpen,
  ChevronLeft,
  Hash,
  ArrowLeft,
  X,
  Wrench,
  ArrowUpRight,
  Phone,
} from "lucide-react";

// ==================== Constants ====================
const SITE_URL = "https://medfixshiraz.ir";
const PHONE_LINK = "tel:+989120000000"; // شماره واقعی را جایگزین کن

// ==================== Metadata ====================
export const metadata: Metadata = {
  title: "مقالات و راهنمای تعمیر لپ‌تاپ و کامپیوتر | مدفیکس شیراز",
  description:
    "مجموعه مقالات تخصصی تعمیر لپ‌تاپ، کامپیوتر، مک‌بوک، هارد و SSD؛ آموزش عیب‌یابی، افزایش عمر باتری، جلوگیری از خرابی مادربرد و نکات نگهداری دستگاه.",
  openGraph: {
    title: "مقالات و راهنمای تعمیر لپ‌تاپ و کامپیوتر | مدفیکس شیراز",
    description:
      "راهنمای تخصصی تعمیر و نگهداری لپ‌تاپ، کامپیوتر و مک‌بوک در شیراز",
    url: `${SITE_URL}/blog`,
    siteName: "مدفیکس شیراز",
    locale: "fa_IR",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

// ==================== Types ====================
interface ArticleCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  keywords: string[];
  readingTime: number | null;
  viewCount: number;
  publishedAt: Date | null;
}

interface CategoryResult {
  category: string | null;
}

// ==================== Helpers ====================
function formatPersianDate(date: Date): string {
  return new Date(date).toLocaleDateString("fa-IR", {
    month: "short",
    day: "numeric",
  });
}

function DecorativeLine({ className = "" }: { className?: string }) {
  return (
    <svg width="80" height="6" viewBox="0 0 80 6" fill="none" className={className}>
      <path
        d="M0,3 Q20,6 40,3 Q60,0 80,3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="opacity-50"
      />
    </svg>
  );
}

// ==================== Page Component ====================
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const search = (params.search || "").trim();
  const category = (params.category || "").trim();
  const limit = 12;

  // --- Build Query ---
  const where: Record<string, unknown> = { isPublished: true };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { keywords: { hasSome: [search] } },
    ];
  }

  if (category) {
    where.category = category;
  }

  // --- Data Fetching ---
  const [articles, total, categoriesResult] = await Promise.all([
    prisma.seoArticle.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        keywords: true,
        readingTime: true,
        viewCount: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.seoArticle.count({ where }),
    prisma.seoArticle.findMany({
      where: { isPublished: true, category: { not: null } },
      select: { category: true },
      distinct: ["category"],
    }) as Promise<CategoryResult[]>,
  ]);

  const categories: string[] = categoriesResult
    .map((cat) => cat.category)
    .filter((cat): cat is string => cat !== null);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#FFF9F5] selection:bg-[#FF5722]/20 selection:text-[#1A1410] relative font-[vazirmatn,sans-serif]">
      {/* ===== Background Texture ===== */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 35%, #FF5722 1px, transparent 1px),
                            radial-gradient(circle at 75% 65%, #FFA000 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ===== Background Blurs ===== */}
      <div className="fixed top-0 right-0 w-[60%] h-[60%] bg-[#FF5722]/[0.05] rounded-full blur-[150px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-[#FFA000]/[0.06] rounded-full blur-[130px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* ==================== Header ==================== */}
      <header className="sticky top-0 z-40 px-4 py-4">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg shadow-[#FF5722]/10 rounded-full px-4 py-2.5 flex items-center gap-3 border border-[#FF5722]/15">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative w-8 h-8">
              <Image
                src="/logo.png"
                alt="مدفیکس شیراز"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <div className="h-5 w-px bg-[#1A1410]/15" />
            <span className="text-[#1A1410]/50 text-[11px] font-medium hidden lg:inline-block whitespace-nowrap">
              مجله تعمیرات و نگهداری
            </span>
          </Link>

          {/* Search */}
          <form method="GET" className="flex-1 min-w-0">
            <div className="relative flex items-center bg-[#FFF9F5] border border-[#1A1410]/10 rounded-full overflow-hidden transition-all focus-within:bg-white focus-within:border-[#FF5722]/40 focus-within:shadow-md focus-within:shadow-[#FF5722]/10">
              <Search className="absolute right-3.5 w-3.5 h-3.5 text-[#1A1410]/30 flex-shrink-0" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="جستجوی مقاله..."
                className="w-full h-9 pr-9 pl-3 bg-transparent text-xs outline-none placeholder:text-[#1A1410]/30 text-[#1A1410]"
              />
              {search && (
                <Link
                  href="/blog"
                  className="ml-1 p-1.5 text-[#1A1410]/40 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                  aria-label="پاک کردن جستجو"
                >
                  <X className="w-3 h-3" />
                </Link>
              )}
            </div>
          </form>

          {/* CTA */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={PHONE_LINK}
              className="group flex items-center gap-1.5 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-[0_4px_15px_rgba(255,87,34,0.3)] hover:shadow-[0_6px_20px_rgba(255,87,34,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تماس با ما</span>
              <span className="sm:hidden">تماس</span>
              <ArrowUpRight className="w-3 h-3 hidden sm:block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </header>

      {/* ==================== Hero ==================== */}
      <section className="pt-8 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FF5722]/8 rounded-full px-4 py-1.5 mb-4 border border-[#FF5722]/20">
            <Wrench className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="text-[#FF5722] text-[10px] font-bold tracking-wider">
              مجله مدفیکس
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#1A1410] mb-3 leading-[1.15] tracking-tight">
            راهنمای{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#FF5722]">تعمیر و نگهداری</span>
              <DecorativeLine className="absolute -bottom-2 right-0 text-[#FF5722]" />
            </span>{" "}
            دستگاهت
          </h1>
          <p className="text-[#1A1410]/55 text-sm max-w-lg mx-auto leading-relaxed mt-4">
            نکات تخصصی، آموزش عیب‌یابی و راهکارهای جلوگیری از خرابی لپ‌تاپ و کامپیوتر
          </p>
        </div>
      </section>

      {/* ==================== Categories ==================== */}
      {categories.length > 0 && (
        <div className="px-4 pb-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide flex-nowrap">
              <Link
                href="/blog"
                className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-300 whitespace-nowrap ${
                  !category
                    ? "bg-[#1A1410] text-white shadow-lg shadow-[#1A1410]/20"
                    : "bg-white border border-[#1A1410]/10 text-[#1A1410]/50 hover:border-[#FF5722]/30 hover:text-[#FF5722]"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3 h-3" />
                  همه
                </span>
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/blog?category=${encodeURIComponent(cat)}`}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-300 whitespace-nowrap ${
                    category === cat
                      ? "bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white shadow-lg shadow-[#FF5722]/25"
                      : "bg-white border border-[#1A1410]/10 text-[#1A1410]/50 hover:border-[#FF5722]/30 hover:text-[#FF5722]"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== Articles Grid ==================== */}
      <section className="px-4 pb-10">
        <div className="max-w-6xl mx-auto">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-[#FF5722]/8 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Search className="w-6 h-6 text-[#FF5722]/50" />
              </div>
              <h2 className="text-lg font-bold text-[#1A1410] mb-2">مقاله‌ای یافت نشد</h2>
              <p className="text-[#1A1410]/40 text-xs mb-6">
                {search
                  ? `نتیجه‌ای برای "${search}" پیدا نشد`
                  : "هنوز مقاله‌ای در این دسته‌بندی منتشر نشده"}
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5722] hover:text-white bg-[#FF5722]/8 hover:bg-[#FF5722] px-4 py-2.5 rounded-full transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                همه مقالات
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==================== Pagination ==================== */}
      {totalPages > 1 && (
        <div className="px-4 pb-12">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-1.5">
            {page > 1 ? (
              <Link
                href={`/blog?page=${page - 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                className="w-9 h-9 rounded-xl border border-[#1A1410]/10 bg-white flex items-center justify-center text-[#1A1410]/50 hover:border-[#FF5722]/40 hover:text-[#FF5722] transition-all"
                aria-label="صفحه قبل"
              >
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </Link>
            ) : (
              <div className="w-9 h-9 rounded-xl border border-[#1A1410]/5 bg-[#1A1410]/5 flex items-center justify-center text-[#1A1410]/20 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </div>
            )}

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) pageNum = i + 1;
              else if (page <= 4) pageNum = i + 1;
              else if (page >= totalPages - 3) pageNum = totalPages - 6 + i;
              else pageNum = page - 3 + i;

              const isActive = page === pageNum;

              return (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                  className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-[#1A1410] text-white shadow-lg shadow-[#1A1410]/20"
                      : "bg-white border border-[#1A1410]/10 text-[#1A1410]/50 hover:border-[#FF5722]/30 hover:text-[#FF5722]"
                  }`}
                >
                  {pageNum.toLocaleString("fa-IR")}
                </Link>
              );
            })}

            {page < totalPages ? (
              <Link
                href={`/blog?page=${page + 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                className="w-9 h-9 rounded-xl border border-[#1A1410]/10 bg-white flex items-center justify-center text-[#1A1410]/50 hover:border-[#FF5722]/40 hover:text-[#FF5722] transition-all"
                aria-label="صفحه بعد"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
            ) : (
              <div className="w-9 h-9 rounded-xl border border-[#1A1410]/5 bg-[#1A1410]/5 flex items-center justify-center text-[#1A1410]/20 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== Footer CTA ==================== */}
      <section className="px-4 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-[#1A1410]/10 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Wrench className="w-3.5 h-3.5 text-[#FF5722]" />
            <span className="text-[#1A1410]/50 text-[11px] font-medium">
              دستگاهت مشکل داره؟
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#1A1410] mb-3">
            درخواست تعمیر ثبت کن
          </h2>
          <p className="text-[#1A1410]/40 text-xs mb-6 max-w-md mx-auto leading-relaxed">
            عیب‌یابی رایگان، کارشناس متخصص و پاسخ‌گویی سریع در شیراز
          </p>
          <Link
            href="/requests"
            className="group inline-flex items-center gap-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-[0_8px_30px_rgba(255,87,34,0.25)] hover:shadow-[0_10px_35px_rgba(255,87,34,0.35)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>ثبت درخواست تعمیر</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ==================== Article Card ====================
function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block bg-white rounded-[24px] border border-[#1A1410]/8 overflow-hidden hover:border-[#FF5722]/30 hover:shadow-xl hover:shadow-[#FF5722]/10 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] bg-[#FFF9F5] overflow-hidden">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#FF5722]/10 via-[#FFA000]/10 to-[#FFF9F5] flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-[#FF5722]/40 group-hover:scale-110 transition-transform duration-500" />
          </div>
        )}

        {article.category && (
          <div className="absolute top-2.5 right-2.5">
            <span className="inline-block text-[10px] font-bold text-[#1A1410]/70 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-[#1A1410]/5">
              {article.category}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-3.5">
        <h3 className="text-sm font-bold text-[#1A1410] mb-1.5 line-clamp-2 leading-relaxed group-hover:text-[#FF5722] transition-colors">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-[11px] text-[#1A1410]/45 line-clamp-2 mb-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-2.5 border-t border-[#1A1410]/5">
          <div className="flex items-center gap-2.5 text-[10px] text-[#1A1410]/40">
            {article.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readingTime} دقیقه
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount.toLocaleString("fa-IR")}
            </span>
          </div>

          {article.publishedAt && (
            <span className="text-[10px] text-[#1A1410]/40">
              {formatPersianDate(article.publishedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}