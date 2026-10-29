// src/lib/auto-blogger.ts
import { prisma } from "@/lib/prisma";
import { generateResearchedArticle } from "./ai-content-generator";
import { generateSEOMetadata } from "./ai";
import type { SeoArticle } from "@prisma/client";

// ===================================================================
// ============== Types =============================================
// ===================================================================
export interface AutoBlogResult {
  success: boolean;
  article?: SeoArticle;
  error?: string;
  poolName: string;
  keywords: string[];
  wordCount: number;
  passedValidation: boolean;
  validationErrors: string[];
}

interface ValidationResult {
  passed: boolean;
  errors: string[];
}

interface GeneratedArticle {
  title: string;
  content: string;
  metaDescription: string;
}

// ===================================================================
// ============== Constants =========================================
// ===================================================================
const MIN_WORDS = 500;
const MIN_TITLE_LENGTH = 10;
const MIN_H2 = 2;
const MIN_P = 3;
const MAX_SLUG_ATTEMPTS = 50;

// الگوهای محتوای ساختگی (برای رد کردن)
const FAKE_PATTERNS: RegExp[] = [
  /آموزشگاه\s+الف/i,
  /آموزشگاه\s+ب/i,
  /آموزشگاه\s+ج/i,
  /\[نام\s+(?:آموزشگاه|شرکت|فروشگاه)\]/i,
  /\[(?:نام|آدرس|تلفن)\]/i,
  /lorem\s+ipsum/i,
  /XXX/,
];

// ===================================================================
// ============== Helpers ===========================================
// ===================================================================

/** شمارش کلمات از HTML */
function countWords(html: string): number {
  const plain = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return plain ? plain.split(" ").length : 0;
}

/** مرتب‌سازی و نرمال‌سازی کلیدواژه‌ها */
function normalizeKeywords(keywords: string[]): string[] {
  return [...new Set(keywords.map((k) => k.trim().toLowerCase()))]
    .filter(Boolean)
    .sort();
}

/** مقایسه‌ی دقیق دو آرایه‌ی مرتب‌شده */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

/** پاکسازی و ایمن‌سازی عنوان */
function sanitizeTitle(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

/** ساخت slug از عنوان */
function buildSlug(title: string, providedSlug?: string): string {
  const base = (providedSlug || title || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  return base || `article-${Date.now().toString(36)}`;
}

/** تولید slug یکتا با سقف تلاش */
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (counter <= MAX_SLUG_ATTEMPTS) {
    const exists = await prisma.seoArticle.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!exists) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  // fallback نهایی
  return `${baseSlug}-${Date.now().toString(36)}`;
}

// ===================================================================
// ============== Validation ========================================
// ===================================================================
function validateArticle(content: string, title: string): ValidationResult {
  const errors: string[] = [];

  if (!content || content.trim().length === 0) {
    return { passed: false, errors: ["محتوای مقاله خالی است"] };
  }

  const wordCount = countWords(content);
  if (wordCount < MIN_WORDS) {
    errors.push(`تعداد کلمات: ${wordCount} (حداقل ${MIN_WORDS})`);
  }

  const cleanTitle = sanitizeTitle(title);
  if (cleanTitle.length < MIN_TITLE_LENGTH) {
    errors.push(`عنوان کوتاه است (${cleanTitle.length} کاراکتر، حداقل ${MIN_TITLE_LENGTH})`);
  }

  const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
  if (h2Count < MIN_H2) {
    errors.push(`تعداد H2: ${h2Count} (حداقل ${MIN_H2})`);
  }

  const pCount = (content.match(/<p[^>]*>/gi) || []).length;
  if (pCount < MIN_P) {
    errors.push(`تعداد پاراگراف: ${pCount} (حداقل ${MIN_P})`);
  }

  for (const pattern of FAKE_PATTERNS) {
    if (pattern.test(content)) {
      errors.push(`محتوای ساختگی شناسایی شد: ${pattern.source}`);
      break;
    }
  }

  return { passed: errors.length === 0, errors };
}

// ===================================================================
// ============== Duplicate Check ===================================
// ===================================================================

/**
 * بررسی می‌کند آیا مقاله‌ای با «دقیقاً همین مجموعه کلیدواژه» قبلاً ساخته شده.
 * (نه کمتر، نه بیشتر)
 */
async function isExactMatchExists(keywords: string[]): Promise<boolean> {
  const sortedKeywords = normalizeKeywords(keywords);
  if (sortedKeywords.length === 0) return false;

  // کوئری: مقالاتی که همه‌ی این کلیدواژه‌ها را دارند
  const candidates = await prisma.seoArticle.findMany({
    where: {
      keywords: { hasEvery: sortedKeywords },
    },
    select: { id: true, keywords: true },
  });

  for (const article of candidates) {
    const articleKeywords = normalizeKeywords(article.keywords ?? []);
    if (arraysEqual(articleKeywords, sortedKeywords)) {
      console.log(`  ⏩ Exact match found: article ${article.id}`);
      return true;
    }
  }

  return false;
}

// ===================================================================
// ============== Cron Log Helpers ==================================
// ===================================================================
async function logCronJob(params: {
  status: "success" | "skipped" | "failed";
  details?: Record<string, unknown>;
  error?: string;
  startedAt: Date;
}) {
  try {
    await prisma.cronJobLog.create({
      data: {
        jobName: "auto-blogger",
        status: params.status,
        details: params.details ? JSON.stringify(params.details) : null,
        error: params.error ?? null,
        startedAt: params.startedAt,
        completedAt: new Date(),
      },
    });
  } catch (logErr) {
    // اگر لاگ هم شکست خورد، فقط چاپ کن (نباید کل جریان را بشکند)
    console.error("⚠️ Failed to write cron log:", logErr);
  }
}

// ===================================================================
// ============== Main ==============================================
// ===================================================================
export async function autoGenerateAndPublish(): Promise<AutoBlogResult> {
  const startedAt = new Date();
  console.log("\n🤖 AUTO BLOGGER\n");

  const emptyResult = (error: string, extra?: Partial<AutoBlogResult>): AutoBlogResult => ({
    success: false,
    error,
    poolName: "",
    keywords: [],
    wordCount: 0,
    passedValidation: false,
    validationErrors: [error],
    ...extra,
  });

  try {
    // ---------------------------------------------------------------
    // Step 1: بارگذاری همه‌ی گروه‌های فعال
    // ---------------------------------------------------------------
    const allPools = await prisma.keywordPool.findMany({
      where: { isActive: true },
      orderBy: { updatedAt: "asc" }, // گروه‌هایی که دیرتر استفاده شده‌اند اول
      select: { id: true, name: true, keywords: true, category: true },
    });

    if (allPools.length === 0) {
      return emptyResult("هیچ گروه کلیدواژه فعالی وجود ندارد");
    }

    // ---------------------------------------------------------------
    // Step 2: انتخاب گروه بدون مقاله (با shuffle برای تنوع)
    // ---------------------------------------------------------------
    const shuffled = [...allPools].sort(() => Math.random() - 0.5);
    console.log(`🔍 Scanning ${shuffled.length} pools for fresh topics...\n`);

    let selectedPool: typeof allPools[number] | null = null;

    for (const pool of shuffled) {
      const normalized = normalizeKeywords(pool.keywords);
      console.log(`  📦 "${pool.name}" (${normalized.length} keywords)`);

      if (normalized.length === 0) {
        console.log(`  ⚠️ SKIP: empty keywords\n`);
        continue;
      }

      const exists = await isExactMatchExists(normalized);
      if (exists) {
        console.log(`  ⏭️ SKIP: exact article already exists\n`);
        continue;
      }

      console.log(`  ✅ FRESH: no article for this exact set\n`);
      selectedPool = pool;
      break;
    }

    if (!selectedPool) {
      return emptyResult("همه گروه‌ها مقاله دارند — مقاله جدیدی برای تولید نیست", {
        passedValidation: false,
      });
    }

    const pool = selectedPool;
    const keywords = normalizeKeywords(pool.keywords);
    const topic = pool.name;

    console.log(`📦 Selected: "${pool.name}"`);
    console.log(`🎯 Keywords (${keywords.length}): ${keywords.join(" | ")}\n`);

    // ---------------------------------------------------------------
    // Step 3: تولید مقاله
    // ---------------------------------------------------------------
    console.log("✍️ Generating article...");
    let generated: GeneratedArticle;
    try {
      generated = await generateResearchedArticle(keywords, topic);
    } catch (genErr) {
      const message = genErr instanceof Error ? genErr.message : "خطای ناشناس در تولید";
      await logCronJob({
        status: "failed",
        error: `Generation failed: ${message}`,
        details: { pool: pool.name, keywords },
        startedAt,
      });
      return emptyResult(`خطا در تولید مقاله: ${message}`, {
        poolName: pool.name,
        keywords,
      });
    }

    const title = sanitizeTitle(generated.title);
    const content = generated.content;

    // ---------------------------------------------------------------
    // Step 4: اعتبارسنجی
    // ---------------------------------------------------------------
    console.log("🔍 Validating...");
    const validation = validateArticle(content, title);
    const wordCount = countWords(content);

    if (!validation.passed) {
      console.log("❌ Validation failed:", validation.errors);
      await logCronJob({
        status: "skipped",
        details: {
          pool: pool.name,
          keywords,
          errors: validation.errors,
          wordCount,
        },
        startedAt,
      });
      return {
        success: false,
        error: "مقاله استانداردهای کیفی را ندارد",
        poolName: pool.name,
        keywords,
        wordCount,
        passedValidation: false,
        validationErrors: validation.errors,
      };
    }

    // ---------------------------------------------------------------
    // Step 5: SEO metadata
    // ---------------------------------------------------------------
    console.log("🎯 Generating SEO metadata...");
    let seoData: Awaited<ReturnType<typeof generateSEOMetadata>> = {} as never;
    try {
      seoData = await generateSEOMetadata(title, content, keywords);
    } catch (seoErr) {
      console.warn("⚠️ SEO metadata generation failed, using fallbacks:", seoErr);
    }

    // ---------------------------------------------------------------
    // Step 6: Slug یکتا
    // ---------------------------------------------------------------
    const baseSlug = buildSlug(title, seoData?.slug);
    const slug = await ensureUniqueSlug(baseSlug);

    // ---------------------------------------------------------------
    // Step 7: ذخیره (publish)
    // ---------------------------------------------------------------
    console.log("📤 Publishing article...");
    const article = await prisma.seoArticle.create({
      data: {
        title: seoData?.metaTitle || title,
        slug,
        content,
        excerpt: seoData?.excerpt || generated.metaDescription || "",
        metaTitle: seoData?.metaTitle || title.slice(0, 60),
        metaDescription: seoData?.metaDescription || generated.metaDescription || "",
        ogTitle: seoData?.metaTitle || title,
        ogDescription: seoData?.metaDescription || "",
        keywords,
        tags: seoData?.tags?.length ? seoData.tags : keywords.slice(0, 5),
        category: seoData?.category || pool.category || keywords[0] || "عمومی",
        wordCount,
        readingTime:
          seoData?.readingTime || Math.max(1, Math.ceil(wordCount / 200)),
        isPublished: true,
        publishedAt: new Date(),
      },
    });

    // ---------------------------------------------------------------
    // Step 8: بروزرسانی گروه (چرخش منصفانه)
    // ---------------------------------------------------------------
    try {
      await prisma.keywordPool.update({
        where: { id: pool.id },
        data: { updatedAt: new Date() },
      });
    } catch (updErr) {
      console.warn("⚠️ Failed to update pool timestamp:", updErr);
    }

    // ---------------------------------------------------------------
    // Step 9: لاگ موفقیت
    // ---------------------------------------------------------------
    await logCronJob({
      status: "success",
      details: {
        articleId: article.id,
        slug: article.slug,
        pool: pool.name,
        keywords,
        wordCount,
      },
      startedAt,
    });

    console.log(`\n✅ Published: ${article.slug} (${wordCount} words)`);
    console.log(`📦 Pool: "${pool.name}" is now covered\n`);

    return {
      success: true,
      article,
      poolName: pool.name,
      keywords,
      wordCount,
      passedValidation: true,
      validationErrors: [],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "خطای ناشناس در auto-blogger";
    console.error("❌ Fatal error:", message);

    await logCronJob({
      status: "failed",
      error: message,
      startedAt,
    });

    return emptyResult(message);
  }
}