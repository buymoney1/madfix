// src/app/sitemap-blog.xml/route.ts
import { prisma } from "@/lib/prisma";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medfixshiraz.ir";

  const articles = await prisma.seoArticle.findMany({
    where: { isPublished: true },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
      coverImage: true,
      title: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${siteUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/requests</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${articles
    .map(
      (article: {
        slug: string;
        updatedAt: Date | null;
        publishedAt: Date | null;
        coverImage: string | null;
        title: string;
      }) => {
        const lastmod = (
          article.updatedAt ||
          article.publishedAt ||
          new Date()
        ).toISOString();
        const imageXml = article.coverImage
          ? `
    <image:image>
      <image:loc>${article.coverImage}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>`
          : "";
        return `
  <url>
    <loc>${siteUrl}/blog/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageXml}
  </url>`;
      }
    )
    .join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

// برای جلوگیری از خرابی XML در صورت وجود کاراکترهای خاص
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}