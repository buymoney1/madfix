// src/app/admin/articles/[id]/edit/page.tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, Save, Eye, ArrowRight, Sparkles, FileText, Globe,
  Tag, FolderOpen, Hash, Clock, BarChart3, CheckCircle2,
  FileEdit, AlertCircle, Wrench,
} from "lucide-react";
import { toast } from "sonner";

// ==================== Types ====================
interface ArticleForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  coverImage: string;
  isPublished: boolean;
  wordCount: number;
  readingTime: number;
  viewCount: number;
}

interface ArticleApiData {
  id: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  category?: string;
  coverImage?: string;
  isPublished?: boolean;
  wordCount?: number;
  readingTime?: number;
  viewCount?: number;
}

// ==================== Decorative ====================
function DecorativeCircle({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3" className="opacity-30" />
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="opacity-50" />
    </svg>
  );
}

function DecorativeLine({ className = "" }: { className?: string }) {
  return (
    <svg width="50" height="5" viewBox="0 0 50 5" fill="none" className={className}>
      <path d="M0,2.5 Q12.5,5 25,2.5 Q37.5,0 50,2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" className="opacity-40" />
    </svg>
  );
}

// ==================== Skeleton ====================
function EditSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF5722]/10 rounded-xl" />
          <div className="h-7 w-40 bg-[#FF5722]/10 rounded-lg" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-[#FF5722]/10 rounded-xl" />
          <div className="h-10 w-28 bg-[#FF5722]/10 rounded-xl" />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-5">
            <div className="h-4 w-16 bg-[#FF5722]/10 rounded-md mb-3" />
            <div className="h-12 bg-[#FF5722]/5 rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-5">
            <div className="h-4 w-20 bg-[#FF5722]/10 rounded-md mb-3" />
            <div className="h-96 bg-[#FF5722]/5 rounded-xl" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-5">
            <div className="h-4 w-24 bg-[#FF5722]/10 rounded-md mb-4" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="mb-3">
                <div className="h-3 w-16 bg-[#FF5722]/10 rounded-md mb-2" />
                <div className="h-10 bg-[#FF5722]/5 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== Main ====================
export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [article, setArticle] = useState<ArticleApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "seo">("content");
  const [form, setForm] = useState<ArticleForm>({
    title: "", slug: "", content: "", excerpt: "", metaTitle: "",
    metaDescription: "", keywords: [], category: "", coverImage: "",
    isPublished: false, wordCount: 0, readingTime: 0, viewCount: 0,
  });

  // Fetch
  useEffect(() => {
    let cancelled = false;
    const loadingToast = toast.loading("در حال بارگذاری مقاله...");

    fetch(`/api/admin/articles/${id}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "خطا در دریافت");
        return data;
      })
      .then((data: { article?: ArticleApiData }) => {
        if (cancelled) return;
        if (data.article) {
          setArticle(data.article);
          setForm({
            title: data.article.title || "",
            slug: data.article.slug || "",
            content: data.article.content || "",
            excerpt: data.article.excerpt || "",
            metaTitle: data.article.metaTitle || "",
            metaDescription: data.article.metaDescription || "",
            keywords: data.article.keywords || [],
            category: data.article.category || "",
            coverImage: data.article.coverImage || "",
            isPublished: data.article.isPublished || false,
            wordCount: data.article.wordCount || 0,
            readingTime: data.article.readingTime || 0,
            viewCount: data.article.viewCount || 0,
          });
          toast.success("مقاله بارگذاری شد", { id: loadingToast });
        } else {
          toast.error("مقاله یافت نشد", { id: loadingToast });
        }
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "خطا در دریافت مقاله";
        toast.error(message, { id: loadingToast });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  // Save
  const handleSave = async (publish: boolean = false) => {
    if (saving) return;
    setSaving(true);
    const loadingToast = toast.loading(publish ? "در حال انتشار..." : "در حال ذخیره...");

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isPublished: publish || form.isPublished }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error || "خطا در ذخیره‌سازی", { id: loadingToast });
        return;
      }

      toast.success(publish ? "مقاله منتشر شد" : "پیش‌نویس ذخیره شد", { id: loadingToast });
      router.push("/admin/articles");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("خطای شبکه، دوباره تلاش کنید", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof ArticleForm>(field: K, value: ArticleForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Loading
  if (loading) return <EditSkeleton />;

  // Error
  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-300" />
        </div>
        <h2 className="text-lg font-bold text-[#1A1410] mb-2">مقاله یافت نشد</h2>
        <p className="text-sm text-[#1A1410]/40 mb-4">مقاله مورد نظر حذف شده یا وجود ندارد</p>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#FF5722] bg-[#FF5722]/8 hover:bg-[#FF5722]/15 px-4 py-2.5 rounded-full transition-all"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          بازگشت به مقالات
        </Link>
      </div>
    );
  }

  // Styles
  const inputClass =
    "w-full px-4 py-2.5 bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl text-sm outline-none transition-all focus:border-[#FF5722]/40 focus:bg-white focus:ring-4 focus:ring-[#FF5722]/10 placeholder:text-[#1A1410]/30 text-[#1A1410]";
  const labelClass = "block text-[11px] font-bold text-[#1A1410]/60 mb-2 uppercase tracking-wider";

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2.5 rounded-xl bg-white border border-[#1A1410]/10 text-[#1A1410]/40 hover:text-[#FF5722] hover:border-[#FF5722]/30 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DecorativeCircle size={20} className="text-[#FF5722]/40 flex-shrink-0" />
              <h1 className="text-xl md:text-2xl font-black text-[#1A1410] tracking-tight">
                ویرایش مقاله
              </h1>
            </div>
            <DecorativeLine className="text-[#FF5722] mr-8" />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href={`/blog/${form.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white border border-[#1A1410]/10 text-[#1A1410]/50 hover:text-[#FF5722] hover:border-[#FF5722]/30 rounded-xl text-xs font-medium transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">پیش‌نمایش</span>
          </Link>

          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#1A1410]/5 hover:bg-[#1A1410]/10 text-[#1A1410]/70 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileEdit className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">ذخیره پیش‌نویس</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#FF5722]/25 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">انتشار</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-5 shadow-sm">
            <label className={labelClass}>
              <FileText className="w-3.5 h-3.5 inline-block ml-1.5 text-[#FF5722]" />
              عنوان مقاله
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="عنوان جذاب مقاله را وارد کنید..."
              className={`${inputClass} text-base font-bold`}
            />
          </div>

          {/* Mobile tabs */}
          <div className="lg:hidden flex gap-1 bg-[#FF5722]/8 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "content" ? "bg-white text-[#1A1410] shadow-sm" : "text-[#1A1410]/50"
              }`}
            >
              محتوا
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === "seo" ? "bg-white text-[#1A1410] shadow-sm" : "text-[#1A1410]/50"
              }`}
            >
              سئو و تنظیمات
            </button>
          </div>

          <div className={`bg-white rounded-2xl border border-[#1A1410]/8 p-5 shadow-sm ${activeTab === "seo" ? "hidden lg:block" : ""}`}>
            <label className={labelClass}>
              <Sparkles className="w-3.5 h-3.5 inline-block ml-1.5 text-[#FF5722]" />
              محتوای مقاله (HTML)
            </label>
            <textarea
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              rows={28}
              className={`${inputClass} font-mono text-xs leading-relaxed`}
              dir="ltr"
              placeholder="<h2>محتوای مقاله...</h2>"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className={`space-y-4 ${activeTab === "content" ? "hidden lg:block" : ""}`}>
          <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-[#FF5722]" />
              <h3 className="text-sm font-bold text-[#1A1410]">تنظیمات SEO</h3>
            </div>

            <div>
              <label className={labelClass}>
                <Hash className="w-3 h-3 inline-block ml-1" />
                Slug
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                className={inputClass}
                dir="ltr"
                placeholder="article-slug"
              />
            </div>

            <div>
              <label className={labelClass}>Meta Title</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
                className={inputClass}
                placeholder="عنوان برای موتورهای جستجو"
              />
            </div>

            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                rows={3}
                className={inputClass}
                placeholder="توضیح کوتاه برای نتایج جستجو..."
              />
              <p className="text-[9px] text-[#1A1410]/40 mt-1 text-left" dir="ltr">
                {form.metaDescription.length}/160
              </p>
            </div>

            <div>
              <label className={labelClass}>خلاصه مقاله</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                rows={3}
                className={inputClass}
                placeholder="خلاصه‌ای جذاب از مقاله..."
              />
            </div>

            <div>
              <label className={labelClass}>
                <Tag className="w-3 h-3 inline-block ml-1" />
                کلمات کلیدی
              </label>
              <input
                type="text"
                value={form.keywords.join(", ")}
                onChange={(e) =>
                  updateField(
                    "keywords",
                    e.target.value.split(",").map((k) => k.trim()).filter(Boolean)
                  )
                }
                className={inputClass}
                placeholder="کلمه1, کلمه2, ..."
              />
              {form.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-[#1A1410]/60 bg-[#FF5722]/8 px-2.5 py-1 rounded-full border border-[#FF5722]/15"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>
                <FolderOpen className="w-3 h-3 inline-block ml-1" />
                دسته‌بندی
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={inputClass}
                placeholder="تعمیر لپ‌تاپ، باتری، مادربرد..."
              />
            </div>

            <div>
              <label className={labelClass}>تصویر کاور (URL)</label>
              <input
                type="text"
                value={form.coverImage}
                onChange={(e) => updateField("coverImage", e.target.value)}
                className={inputClass}
                dir="ltr"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#FF5722]" />
              <h3 className="text-sm font-bold text-[#1A1410]">اطلاعات مقاله</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#1A1410]/5">
                <span className="text-[11px] text-[#1A1410]/50 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  وضعیت
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    form.isPublished
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-[#FF5722]/8 text-[#FF5722]"
                  }`}
                >
                  {form.isPublished ? "منتشر شده" : "پیش‌نویس"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#1A1410]/5">
                <span className="text-[11px] text-[#1A1410]/50 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  تعداد کلمات
                </span>
                <span className="text-[11px] font-bold text-[#1A1410]">
                  {form.wordCount.toLocaleString("fa-IR")}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#1A1410]/5">
                <span className="text-[11px] text-[#1A1410]/50 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  زمان مطالعه
                </span>
                <span className="text-[11px] font-bold text-[#1A1410]">
                  {form.readingTime} دقیقه
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-[11px] text-[#1A1410]/50 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  بازدید
                </span>
                <span className="text-[11px] font-bold text-[#1A1410]">
                  {form.viewCount.toLocaleString("fa-IR")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <DecorativeCircle size={20} className="text-[#FF5722]/20" />
          </div>
        </div>
      </div>
    </div>
  );
}