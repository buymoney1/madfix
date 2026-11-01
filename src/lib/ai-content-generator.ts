// src/lib/ai-content-generator.ts

import { aiRouter } from "./ai-router";
import { researchTopic, ResearchData } from "./serper-search";

// ==================== Brand Constants ====================
const BRAND_NAME = "مدفیکس";
const BRAND_DOMAIN = "madfix.ir";
const BRAND_TEAM = "تیم متخصص مدفیکس";
const BRAND_CITY = "شیراز";
const BRAND_SCOPE = "تعمیرات تخصصی لپ‌تاپ، کامپیوتر";

// ==================== Types ====================
interface ExtractedData {
  entities: string[];
  numbersAndStats: string[];
  moneyValues: string[];
  quotes: string[];
  contactInfo: string[];
}

// ==================== Main ====================
export async function generateResearchedArticle(
  keywords: string[],
  topic?: string
): Promise<{
  title: string;
  content: string;
  metaDescription: string;
  researchData: {
    sourcesFound: number;
    sourcesScraped: number;
    modelUsed: string;
    relatedSearches: string[];
    extractedData: ExtractedData;
  };
}> {
  const articleTopic = topic || keywords.join(" - ");
  console.log(`\n🚀 MADFIX GENERATING: ${articleTopic}\n`);

  const research = await doResearch(keywords);
  const extractedData = extractGenericData(research.competitorContents.join("\n"));
  const { title, content, metaDescription } = await doGenerate(
    articleTopic,
    keywords,
    research,
    extractedData
  );

  console.log(
    `✅ "${title}" | ${research.sourcesScraped} src | ${countDataPoints(extractedData)} pts\n`
  );

  return {
    title,
    content,
    metaDescription,
    researchData: {
      sourcesFound: research.sourcesFound,
      sourcesScraped: research.sourcesScraped,
      modelUsed: "AI Router",
      relatedSearches: research.relatedSearches,
      extractedData,
    },
  };
}

// ==================== Research ====================
async function doResearch(keywords: string[]): Promise<ResearchData> {
  try {
    return await researchTopic(keywords, { num: 10 });
  } catch (error: any) {
    console.error("Research failed:", error.message);
    return {
      query: keywords.join(" "),
      sourcesFound: 0,
      sourcesScraped: 0,
      competitorAnalysis: "",
      competitorContents: [],
      topResults: [],
      relatedSearches: [],
      peopleAlsoAsk: [],
    };
  }
}

// ==================== Generic Data Extraction ====================
function emptyData(): ExtractedData {
  return {
    entities: [],
    numbersAndStats: [],
    moneyValues: [],
    quotes: [],
    contactInfo: [],
  };
}

function countDataPoints(d: ExtractedData): number {
  return (
    d.entities.length +
    d.numbersAndStats.length +
    d.moneyValues.length +
    d.quotes.length +
    d.contactInfo.length
  );
}

function unique(arr: string[]): string[] {
  return [...new Set(arr.filter(Boolean))];
}

function extractGenericData(content: string): ExtractedData {
  if (!content || content.length < 50) {
    console.log("   ⏩ No content");
    return emptyData();
  }

  console.log("📋 Extracting repair-related data...");

  // موجودیت‌های مرتبط با تعمیرات: برند لپ‌تاپ، مدل، قطعه، نرم‌افزار
  const entityMatches = [
    ...content.matchAll(
      /(?:شرکت|برند|مدل|لپ‌تاپ|کامپیوتر|مادربرد|پردازنده|کارت\s+گرافیک|هارد|حافظه|پاور|باتری|نمایشگر|ویندوز|نرم‌افزار|ابزار|دستگاه)\s+([آ-یa-zA-Z0-9\s-]{3,40})/gi
    ),
  ];
  const entities = unique(
    entityMatches.map((m) => m[1].trim()).slice(0, 15)
  );

  // آمار و اعداد
  const statMatches = [
    ...content.matchAll(
      /(\d+[\d,./]*\s*(?:%|درصد|نفر|سال|ماه|روز|ساعت|گیگابایت|گیگ|ترابایت|مگاهرتز|وات|برابر|میلیون|میلیارد))/gi
    ),
  ];
  const numbersAndStats = unique(
    statMatches.map((m) => m[0].trim()).slice(0, 15)
  );

  // مبالغ و هزینه‌های تعمیر
  const moneyMatches = [
    ...content.matchAll(
      /(\d+[\d,\/]*\s*(?:تومان|ریال|دلار|یورو|Toman|USD))/gi
    ),
  ];
  const moneyValues = unique(
    moneyMatches.map((m) => m[0].trim()).slice(0, 10)
  );

  // نقل قول‌ها
  const quoteMatches = [...content.matchAll(/["«]([^"«»]{15,150})["»]/g)];
  const quotes = unique(
    quoteMatches.map((m) => m[1].trim()).slice(0, 10)
  );

  // اطلاعات تماس
  const contactMatches = [
    ...content.matchAll(
      /(?:[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})|(?:09\d{9})|(?:\b\d{3,4}-\d{4,8}\b)/g
    ),
  ];
  const contactInfo = unique(
    contactMatches.map((m) => m[0].trim()).slice(0, 5)
  );

  const result = { entities, numbersAndStats, moneyValues, quotes, contactInfo };
  console.log(`   ✅ ${countDataPoints(result)} data points extracted.`);
  return result;
}

// ==================== Generate ====================
async function doGenerate(
  articleTopic: string,
  keywords: string[],
  research: ResearchData,
  extractedData: ExtractedData
): Promise<{ title: string; content: string; metaDescription: string }> {
  const hasResearch = research.sourcesScraped > 0;
  const sourcesText = research.competitorContents
    .map((c, i) => `--- منبع ${i + 1} ---\n${c.slice(0, 5000)}`)
    .join("\n\n");

  const prompt = buildPrompt(
    articleTopic,
    keywords,
    hasResearch,
    sourcesText,
    research,
    extractedData
  );

  console.log("✍️ Writing madfix article...\n");

  const result = await aiRouter.generateText(
    prompt,
    `Write repair article for ${BRAND_NAME}: ${articleTopic}`,
    { temperature: 0.85, maxTokens: 12000 }
  );

  if (!result.success) throw new Error(result.error || "Generation failed");

  return {
    title: extractTitle(result.text) || keywords[0],
    content: result.text,
    metaDescription: extractMeta(result.text),
  };
}

function buildPrompt(
  articleTopic: string,
  keywords: string[],
  hasResearch: boolean,
  sourcesText: string,
  research: ResearchData,
  extractedData: ExtractedData
): string {
  const dp = countDataPoints(extractedData);

  let dataBlock = "";
  if (dp > 0) {
    const formatList = (label: string, items: string[]) =>
      items.length
        ? `**${label}:**\n${items
            .map((item, i) => `${i + 1}. ${item}`)
            .join("\n")}\n\n`
        : "";

    dataBlock = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 داده‌های واقعی استخراج‌شده (${dp} مورد)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
این داده‌ها از بررسی منابع معتبر و رقبا به دست آمده‌اند تا محتوای تو دقیق و مستند باشد:

${formatList("مدل‌ها، قطعات و برندهای مرتبط", extractedData.entities)}
${formatList("آمار و ارقام فنی", extractedData.numbersAndStats)}
${formatList("مبالغ و هزینه‌های تعمیر", extractedData.moneyValues)}
${formatList("نقل قول‌ها و عبارات مهم", extractedData.quotes)}

⚠️ **تکلیف اجباری:**
- از این مدل‌ها و آمار به‌عنوان فکت مستند استفاده کن تا اعتبار مقاله (E-E-A-T) بالا برود.
- از اطلاعات ساختگی یا نام‌های فرضی مثل «تعمیرگاه الف» یا «برند فلان» پرهیز کن.
`;
  }

  const researchBlock = hasResearch
    ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 تحقیقات سئو و بررسی رقبا
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
متن منابع برتر رقبا:
${sourcesText.slice(0, 25000)}

**شکاف‌های محتوایی رقبا:** ${research.competitorAnalysis}
**سوالات واقعی کاربران در گوگل:** ${
        research.peopleAlsoAsk.map((p) => p.question).join(" | ") || "ندارد"
      }
**جستجوهای مرتبط:** ${research.relatedSearches.join("، ") || "ندارد"}
`
    : "";

  return `تو یک نویسنده‌ی ارشد فارسی‌زبان و متخصص حوزه‌ی تعمیرات لپ‌تاپ و کامپیوتر هستی.
تو برای وب‌سایت رسمی «${BRAND_NAME}» (${BRAND_DOMAIN}) می‌نویسی — یک مرکز ${BRAND_SCOPE} در ${BRAND_CITY}.

🎯 **ماموریت:** نوشتن یک مقاله جامع، مرجع و رتبه یک گوگل درباره موضوع: "${articleTopic}"
کلمات کلیدی اصلی: ${keywords.join("، ")}

${researchBlock}

${dataBlock}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️ قوانین معرفی برند «${BRAND_NAME}» (مهم — دقیق اجرا کن)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. برند را **حداکثر ۲ بار** در کل مقاله معرفی کن — نه بیشتر.
2. معرفی باید **طبیعی و در بافت** باشد؛ مثلاً در بخش «چه زمانی به متخصص مراجعه کنیم» یا «نتیجه‌گیری».
3. نمونه‌ی مجاز:
   - «اگر مشکل ادامه‌دار بود، ${BRAND_TEAM} در ${BRAND_CITY} می‌تواند با عیب‌یابی دقیق، علت اصلی را پیدا کند.»
   - «تشخیص نهایی نیاز به تجهیزات تخصصی دارد که ${BRAND_TEAM} در ${BRAND_DOMAIN} ارائه می‌دهد.»
4. **هرگز** نگو «بهترین تعمیرگاه»، «با ما تماس بگیرید»، «تخفیف ویژه»، «بی‌نظیر».
5. **هرگز** ادعای قیمت یا تخفیف خاص نکن.
6. **هرگز** برندهای رقیب را نقد یا تحقیر نکن.
7. لینک ${BRAND_DOMAIN} فقط **یک بار** و به‌شکل طبیعی در جمع‌بندی بیاور.
8. اگر موضوع مقاله به تعمیر سخت‌افزار مربوط نیست، معرفی برند را حذف کن — نباید زورکی باشد.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴 قوانین طلایی محتوا (تعمیرات)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

۱. **تجربه و تخصص (E-E-A-T):**
مثل یک تعمیرکار باتجربه بنویس که سال‌ها دستگاه واقعی باز کرده. به جای کلی‌گویی، سناریوی واقعی بیاور:
- «لپ‌تاپ ایسوس ویووبوک که بعد از آپدیت ویندوز بلواسکرین می‌دهد»
- «هارد سیگیت که صدای تیک‌تیک می‌دهد و نشانه‌ی خرابی هد است»
- «مادربرد HP که بعد از نوسان برق روشن نمی‌شود»
از علائم، نشانه‌ها، و مراحل عیب‌یابی واقعی حرف بزن.

۲. **لحن و نگارش:**
لحن حرفه‌ای، روان، قابل‌اعتماد و صمیمی. پاراگراف‌ها کوتاه (حداکثر ۳-۴ خط). از نیم‌فاصله‌ی استاندارد فارسی استفاده کن. از عبارات پرکننده مثل «همانطور که می‌دانید» و «شایان ذکر است» پرهیز کن.

۳. **ساختار HTML حرفه‌ای:**
فقط HTML خالص تولید کن (بدون markdown).
- <h1 class="text-3xl font-bold mb-6"> برای عنوان اصلی (فقط یک بار).
- <h2 class="text-2xl font-semibold mt-8 mb-4"> برای بخش‌ها.
- <h3> برای زیرتیترها و FAQ.
- <p class="mb-4 leading-relaxed"> برای متن.
- از <ul>, <ol>, <li> برای لیست‌ها.
- از <strong> برای مفاهیم کلیدی و <blockquote> برای نقل قول.
- باکس‌های محتوایی مخصوص تعمیرات:
  <div class="summary-box bg-gray-100 p-4 rounded-lg mb-6"> برای خلاصه مقاله
  <div class="tip-box bg-amber-50 border-r-4 border-amber-500 p-4 my-4"> برای «نکته‌ی تعمیرکاری»
  <div class="warning-box bg-red-50 border-r-4 border-red-500 p-4 my-4"> برای «هشدار خرابی جدی»

۴. **بخش «چه زمانی به متخصص مراجعه کنیم»:**
حتماً یک H2 با این عنوان یا مشابه داشته باش که علائم نیاز به متخصص را فهرست کند. اینجاست که معرفی برند به‌شکل طبیعی می‌گنجد (فقط یک بار).

۵. **سوالات متداول (FAQ):**
در انتها یک بخش FAQ با سؤالات واقعی کاربران (از داده‌های بالا) و پاسخ دقیق (حداقل ۴ خط برای هر پاسخ) اضافه کن.

۶. **نتیجه‌گیری و CTA:**
جمع‌بندی ساختاریافته + گام‌های عملی بعدی + یک سؤال تعاملی برای ترغیب به کامنت. لینک ${BRAND_DOMAIN} فقط یک بار اینجا (اگر موضوع مرتبط بود).

۷. **طول مقاله:**
حداقل ${hasResearch ? "۱۸۰۰" : "۱۲۰۰"} کلمه. کیفیت فدای کمیت نشود، اما تمام زوایا پوشش داده شود.

🚀 اکنون مقاله نهایی را به‌صورت HTML استایل‌دهی‌شده تولید کن.`;
}

// ==================== Helpers ====================
function extractTitle(html: string): string | null {
  const m = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : null;
}

function extractMeta(html: string): string {
  const m = html.match(/<p[^>]*>(.*?)<\/p>/i);
  return m ? m[1].replace(/<[^>]+>/g, "").trim().slice(0, 160) : "";
}