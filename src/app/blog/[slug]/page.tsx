// src/app/blog/[slug]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  ChevronLeft,
  Hash,
  Share2,
  BookOpen,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { BackToTop } from "@/components/blog/BackToTop";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareInline } from "@/components/blog/ShareInline";

// ==================== Constants ====================
const SITE_URL = "https://medfixshiraz.ir";
const PHONE_LINK = "tel:+989120000000"; // شماره واقعی

// ==================== Types ====================
interface Props {
  params: Promise<{ slug: string }>;
}

interface RelatedArticle {
  title: string;
  slug: string;
  excerpt: string | null;
  readingTime: number | null;
  coverImage: string | null;
  publishedAt: Date | null;
}

// ==================== Helpers ====================
function formatPersianDate(date: Date): string {
  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function DecorativeCircle({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" className="opacity-40" />
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-60" />
    </svg>
  );
}

// ==================== Metadata ====================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.seoArticle.findUnique({
    where: { slug, isPublished: true },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      excerpt: true,
      ogTitle: true,
      ogDescription: true,
      coverImage: true,
      publishedAt: true,
      slug: true,
    },
  });

  if (!article) {
    return { title: "مقاله یافت نشد | مدفیکس شیراز" };
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt || "",
    openGraph: {
      title: article.ogTitle || article.title,
      description: article.ogDescription || article.metaDescription || "",
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      images: article.coverImage ? [{ url: article.coverImage }] : [],
      locale: "fa_IR",
      siteName: "مدفیکس شیراز",
    },
    twitter: {
      card: "summary_large_image",
      title: article.ogTitle || article.title,
      description: article.ogDescription || article.metaDescription || "",
      images: article.coverImage ? [article.coverImage] : [],
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${article.slug}`,
    },
  };
}

// ==================== Main Page ====================
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const article = await prisma.seoArticle.findUnique({
    where: { slug, isPublished: true },
    include: {
      author: { select: { name: true } },
    },
  });

  if (!article) notFound();

  // Record view (fire & forget)
  try {
    await Promise.all([
      prisma.seoArticleView.create({ data: { articleId: article.id } }),
      prisma.seoArticle.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      }),
    ]);
  } catch {
    // Silently ignore
  }

  const relatedArticles: RelatedArticle[] = await prisma.seoArticle.findMany({
    where: {
      isPublished: true,
      id: { not: article.id },
      OR: [
        { category: article.category || "" },
        { keywords: { hasSome: article.keywords as string[] } },
      ],
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
    select: {
      title: true,
      slug: true,
      excerpt: true,
      readingTime: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  const readingTime = article.readingTime || Math.ceil((article.wordCount || 0) / 200) || 5;
  const publishedDate = article.publishedAt ? formatPersianDate(article.publishedAt) : "";
  const shareUrl = `${SITE_URL}/blog/${article.slug}`;

  // Schema.org
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: article.coverImage || `${SITE_URL}/og-image.png`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    author: {
      "@type": "Person",
      name: article.author?.name || "مدفیکس شیراز",
    },
    publisher: {
      "@type": "Organization",
      name: "مدفیکس شیراز",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": shareUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgress />
      <BackToTop />

      <div
        className="min-h-screen bg-[#FFF9F5] selection:bg-[#FF5722]/20 selection:text-[#1A1410] relative font-[vazirmatn,sans-serif]"
        dir="rtl"
      >
        {/* Background */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.012]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #FF5722 1px, transparent 1px),
                              radial-gradient(circle at 80% 70%, #FFA000 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="fixed top-0 right-0 w-[60%] h-[60%] bg-[#FF5722]/[0.04] rounded-full blur-[150px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-[#FFA000]/[0.05] rounded-full blur-[130px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

        {/* ==================== Header ==================== */}
        <header className="sticky top-0 z-50 px-4 py-4">
          <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl shadow-lg shadow-[#FF5722]/10 rounded-full px-5 py-3 flex items-center justify-between border border-[#FF5722]/15">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="مدفیکس شیراز"
                  fill
                  sizes="32px"
                  className="object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="h-5 w-px bg-[#1A1410]/15 flex-shrink-0" />
              <span className="text-[#1A1410]/50 text-[11px] font-medium inline-block whitespace-nowrap">
                مجله تعمیرات و نگهداری
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/blog"
                className="text-xs font-medium text-[#1A1410]/50 hover:text-[#FF5722] transition-colors hidden sm:flex items-center gap-1"
              >
                همه مقالات
              </Link>
              <Link
  href="/requests"
  className="group flex items-center gap-1.5 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white px-4 py-2 rounded-full text-xs font-bold transition-all shadow-[0_4px_15px_rgba(255,87,34,0.3)] hover:shadow-[0_6px_20px_rgba(255,87,34,0.4)] hover:-translate-y-0.5 active:translate-y-0"
>
  <Wrench className="w-3.5 h-3.5" />
  <span className="hidden sm:inline">درخواست تعمیر</span>
  <span className="sm:hidden">تعمیر</span>
  <ArrowUpRight className="w-3 h-3 hidden sm:block group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
</Link>
            </div>
          </div>
        </header>

        {/* ==================== Main Layout ==================== */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-4 shadow-sm">
                  <h4 className="text-[11px] font-bold text-[#1A1410]/60 mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#FF5722]" />
                    فهرست مطالب
                  </h4>
                  <TableOfContents content={article.content} />
                </div>

                <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-4 shadow-sm">
                  <h4 className="text-[11px] font-bold text-[#1A1410]/60 mb-3 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#FF5722]" />
                    اشتراک‌گذاری
                  </h4>
                  <ShareInline url={shareUrl} title={article.title} />
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-br from-[#1A1410] to-[#2D2420] rounded-2xl border border-white/10 p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#FF5722]/15 rounded-full blur-2xl pointer-events-none" />
                  <div className="relative">
                    <Wrench className="w-5 h-5 text-[#FFA000] mb-2" />
                    <h4 className="text-[11px] font-bold text-white mb-1">
                      دستگاهت مشکل داره؟
                    </h4>
                    <p className="text-[10px] text-white/40 mb-3 leading-relaxed">
                      همین حالا درخواست تعمیر ثبت کن
                    </p>
                    <Link
                      href="/requests"
                      className="group inline-flex items-center gap-1 text-[10px] font-bold text-[#FFA000] hover:text-[#FF8F00] transition-colors"
                    >
                      ثبت درخواست
                      <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                <div className="flex justify-center">
                  <DecorativeCircle size={24} className="text-[#FF5722]/30" />
                </div>
              </div>
            </aside>

            {/* Article */}
            <article className="flex-1 min-w-0 pt-4 pb-8 max-w-3xl mx-auto lg:mx-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-[11px] text-[#1A1410]/40 mb-8 flex-wrap">
                <Link href="/" className="hover:text-[#FF5722] transition-colors">
                  خانه
                </Link>
                <span className="text-[#1A1410]/20">/</span>
                <Link href="/blog" className="hover:text-[#FF5722] transition-colors">
                  مقالات
                </Link>
                {article.category && (
                  <>
                    <span className="text-[#1A1410]/20">/</span>
                    <Link
                      href={`/blog?category=${encodeURIComponent(article.category)}`}
                      className="hover:text-[#FF5722] transition-colors"
                    >
                      {article.category}
                    </Link>
                  </>
                )}
                <span className="text-[#1A1410]/20">/</span>
                <span className="text-[#1A1410]/60 truncate max-w-[200px]">
                  {article.title}
                </span>
              </nav>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-black text-[#1A1410] mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Category */}
              {article.category && (
                <div className="flex items-center gap-2 mb-5">
                  <DecorativeCircle size={20} className="text-[#FF5722]/40" />
                  <Link
                    href={`/blog?category=${encodeURIComponent(article.category)}`}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#FF5722] bg-[#FF5722]/8 hover:bg-[#FF5722]/15 px-3 py-1.5 rounded-full border border-[#FF5722]/20 transition-colors"
                  >
                    <Hash className="w-3 h-3" />
                    {article.category}
                  </Link>
                </div>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-5 text-[11px] text-[#1A1410]/45 py-3 border-y border-[#1A1410]/8 mb-8">
                {article.author?.name && (
                  <span className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF5722] to-[#FFA000] flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      {article.author.name[0]}
                    </div>
                    {article.author.name}
                  </span>
                )}
                {publishedDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1A1410]/25" />
                    {publishedDate}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#1A1410]/25" />
                  {readingTime} دقیقه مطالعه
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#1A1410]/25" />
                  {article.viewCount.toLocaleString("fa-IR")} بازدید
                </span>
              </div>

              {/* Content */}
              <div
                className="article-content prose prose-stone max-w-none prose-headings:font-black prose-headings:text-[#1A1410] prose-a:text-[#FF5722] prose-a:no-underline hover:prose-a:text-[#F4511E] prose-img:rounded-2xl prose-img:shadow-md prose-blockquote:border-[#FF5722] prose-blockquote:bg-[#FF5722]/5 prose-blockquote:rounded-l-xl prose-blockquote:py-1 prose-blockquote:px-4 prose-code:bg-[#1A1410]/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-xs prose-strong:text-[#1A1410]"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Keywords */}
              {article.keywords && article.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8">
                  {(article.keywords as string[]).map((kw: string) => (
                    <span
                      key={kw}
                      className="text-[10px] text-[#1A1410]/50 bg-white border border-[#1A1410]/10 px-3 py-1.5 rounded-full hover:border-[#FF5722]/30 hover:text-[#FF5722] transition-colors cursor-default"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}

              {/* Mobile share */}
              <div className="lg:hidden mt-10 pt-6 border-t border-[#1A1410]/8">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#1A1410]/40 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#FF5722]" />
                    اشتراک‌گذاری:
                  </span>
                  <ShareInline url={shareUrl} title={article.title} />
                </div>
              </div>

              {/* Mobile back */}
              <div className="lg:hidden mt-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm text-[#1A1410]/50 hover:text-[#FF5722] transition-colors bg-white border border-[#1A1410]/10 rounded-full px-4 py-2.5"
                >
                  <ArrowRight className="w-4 h-4" />
                  همه مقالات
                </Link>
              </div>

              {/* Related */}
              {relatedArticles.length > 0 && (
                <section className="mt-14 pt-10 border-t border-[#1A1410]/8">
                  <div className="flex items-center gap-3 mb-6">
                    <DecorativeCircle size={24} className="text-[#FF5722]/30" />
                    <h2 className="text-lg font-black text-[#1A1410]">مطالب مرتبط</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}`}
                        className="group bg-white rounded-2xl border border-[#1A1410]/8 hover:border-[#FF5722]/30 hover:shadow-lg hover:shadow-[#FF5722]/10 transition-all hover:-translate-y-1 p-5"
                      >
                        <h3 className="text-sm font-bold text-[#1A1410] mb-2 group-hover:text-[#FF5722] transition-colors line-clamp-2 leading-relaxed">
                          {related.title}
                        </h3>
                        {related.excerpt && (
                          <p className="text-[11px] text-[#1A1410]/45 line-clamp-2 mb-4 leading-relaxed">
                            {related.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-[10px] pt-3 border-t border-[#1A1410]/5">
                          <span className="text-[#1A1410]/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {related.readingTime || 5} دقیقه
                          </span>
                          <span className="text-[#FF5722] flex items-center gap-1 font-bold">
                            مطالعه
                            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Final CTA */}
              <section className="mt-14 pt-10 border-t border-[#1A1410]/8 text-center">
                <div className="inline-flex items-center gap-2 bg-white border border-[#1A1410]/10 rounded-full px-4 py-1.5 mb-4 shadow-sm">
                  <Wrench className="w-3.5 h-3.5 text-[#FF5722]" />
                  <span className="text-[#1A1410]/50 text-[11px] font-medium">
                    تعمیر تخصصی در شیراز
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-[#1A1410] mb-3">
                  دستگاهت رو بسپار به متخصص
                </h2>
                <p className="text-[#1A1410]/40 text-xs mb-6 max-w-md mx-auto leading-relaxed">
                  عیب‌یابی رایگان، قطعات اصل و گارانتی خدمات
                </p>
                <Link
                  href="/requests"
                  className="group inline-flex items-center gap-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-[0_8px_30px_rgba(255,87,34,0.25)] hover:shadow-[0_10px_35px_rgba(255,87,34,0.35)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>ثبت درخواست تعمیر</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </section>
            </article>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-[#1A1410]/8 bg-white">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="relative w-7 h-7">
                <Image src="/logo.png" alt="مدفیکس شیراز" fill sizes="28px" className="object-contain" />
              </div>
              <span className="text-sm font-bold text-[#1A1410]/80">مدفیکس شیراز</span>
            </div>

            <div className="flex items-center gap-6 text-[11px] text-[#1A1410]/40">
              <Link href="/blog" className="hover:text-[#FF5722] transition-colors">
                مقالات
              </Link>
              <Link href="/requests" className="hover:text-[#FF5722] transition-colors">
                درخواست تعمیر
              </Link>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}