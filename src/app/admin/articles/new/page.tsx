// src/app/admin/articles/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2, Sparkles, Save, X, Eye, FileText, Wand2, Send,
  Search, Globe, Database, Zap, Wrench,
} from "lucide-react";
import { toast } from "sonner";

// ==================== Types ====================
interface Prompt {
  id: string;
  name: string;
  description: string;
  category: string;
}

type TabType = "research" | "ai" | "manual";
type ResearchDepth = "quick" | "deep";

// ==================== Component ====================
export default function NewArticlePage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("manual");
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  // AI Quick
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [keywords, setKeywords] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  // Research
  const [researchDepth, setResearchDepth] = useState<ResearchDepth>("deep");
  const [researchTopic, setResearchTopic] = useState("");
  const [researchKeywords, setResearchKeywords] = useState("");

  // Editor
  const [articleId, setArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [readingTime, setReadingTime] = useState(5);

  // Common
  const [generating, setGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/admin/prompts")
      .then((r) => r.json())
      .then((data) => setPrompts(data.prompts || []))
      .catch(() => toast.error("خطا در دریافت پرامپت‌ها"));
  }, []);

  // ==================== Helpers ====================
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const fillEditorFromArticle = (article: {
    id?: string; title?: string; slug?: string; content?: string;
    excerpt?: string; metaTitle?: string; metaDescription?: string;
    category?: string; keywords?: string[]; tags?: string[];
    readingTime?: number; coverImage?: string;
  }) => {
    if (article.id) setArticleId(article.id);
    setTitle(article.title || "");
    setSlug(article.slug || "");
    setContent(article.content || "");
    setExcerpt(article.excerpt || "");
    setMetaTitle(article.metaTitle || "");
    setMetaDescription(article.metaDescription || "");
    setCategory(article.category || "");
    setKeywordsInput((article.keywords || []).join(", "));
    setTagsInput((article.tags || []).join(", "));
    setReadingTime(article.readingTime || 5);
    setCoverImage(article.coverImage || "");
    setActiveTab("manual");
  };

  // ==================== AI Quick Generate ====================
  const handleQuickGenerate = async () => {
    const keywordList = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    if (keywordList.length === 0) return toast.error("حداقل یک کلیدواژه وارد کنید");

    setGenerating(true);
    setGenerationStatus("در حال تولید مقاله...");
    const loadingToast = toast.loading("در حال تولید مقاله...");

    try {
      const res = await fetch("/api/admin/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId: selectedPrompt || undefined,
          keywords: keywordList,
          customPrompt: customPrompt || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.article) {
        fillEditorFromArticle(data.article);
        toast.success("مقاله با موفقیت تولید شد", { id: loadingToast });
      } else {
        toast.error(data.error || "خطا در تولید", { id: loadingToast });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: loadingToast });
    } finally {
      setGenerating(false);
      setGenerationStatus("");
    }
  };

  // ==================== Research Generate ====================
  const handleResearchGenerate = async () => {
    const keywordList = researchKeywords.split(",").map((k) => k.trim()).filter(Boolean);
    if (keywordList.length === 0) return toast.error("حداقل یک کلیدواژه وارد کنید");

    setGenerating(true);
    const loadingToast = toast.loading("در حال تحقیق و تولید...");

    try {
      const res = await fetch("/api/admin/articles/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywordList,
          topic: researchTopic || undefined,
          depth: researchDepth,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.article) {
        fillEditorFromArticle(data.article);
        toast.success(
          data.researchData?.sourcesScraped
            ? `مقاله با تحلیل ${data.researchData.sourcesScraped} منبع تولید شد`
            : "مقاله تولید شد",
          { id: loadingToast, duration: 5000 }
        );
      } else {
        toast.error(data.error || "خطا در تولید", { id: loadingToast });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: loadingToast });
    } finally {
      setGenerating(false);
      setGenerationStatus("");
    }
  };

  // ==================== Save ====================
  const handleSaveNew = async (publish: boolean) => {
    if (!title || !content) return toast.error("عنوان و محتوا الزامی است");
    setSaving(true);
    const loadingToast = toast.loading(publish ? "در حال انتشار..." : "در حال ذخیره...");

    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          content,
          excerpt,
          metaTitle: metaTitle || title,
          metaDescription,
          keywords: keywordsInput.split(",").map((k) => k.trim()).filter(Boolean),
          tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
          category,
          coverImage: coverImage || undefined,
          readingTime,
          isPublished: publish,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(publish ? "مقاله منتشر شد" : "پیش‌نویس ذخیره شد", { id: loadingToast });
        router.push("/admin/articles");
        router.refresh();
      } else {
        toast.error(data.error || "خطا در ذخیره", { id: loadingToast });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handlePublishGenerated = async () => {
    if (!articleId) return;
    setSaving(true);
    const loadingToast = toast.loading("در حال انتشار...");

    try {
      await fetch(`/api/admin/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          content,
          excerpt,
          metaTitle: metaTitle || title,
          metaDescription,
          keywords: keywordsInput.split(",").map((k) => k.trim()).filter(Boolean),
          tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
          category,
          coverImage: coverImage || undefined,
          readingTime,
        }),
      });

      const res = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isPublished: true,
          publishedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        toast.success("مقاله منتشر شد", { id: loadingToast });
        router.push("/admin/articles");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "خطا در انتشار", { id: loadingToast });
      }
    } catch {
      toast.error("خطا در ارتباط با سرور", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  // ==================== Styles ====================
  const inputClass =
    "w-full px-3 py-2.5 border border-[#1A1410]/10 rounded-lg text-sm outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/10 transition-all bg-white placeholder:text-[#1A1410]/30 text-[#1A1410]";
  const labelClass = "block text-xs font-medium text-[#1A1410]/60 mb-1.5";
  const tabButtonClass = (tab: TabType) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
      activeTab === tab
        ? "bg-[#1A1410] text-white shadow-lg shadow-[#1A1410]/20"
        : "bg-[#FF5722]/8 text-[#1A1410]/50 hover:bg-[#FF5722]/15"
    }`;

  // ==================== Render ====================
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-xl bg-white border border-[#1A1410]/10 text-[#1A1410]/40 hover:text-[#FF5722] hover:border-[#FF5722]/30 transition-all"
          >
            <X className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#1A1410]">مقاله جدید</h1>
            <p className="text-[10px] text-[#1A1410]/40 mt-0.5">
              {activeTab === "research" && "تحقیق + تحلیل رقبا + تولید"}
              {activeTab === "ai" && "تولید سریع با هوش مصنوعی"}
              {activeTab === "manual" && "نوشتن دستی"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 bg-[#1A1410]/5 hover:bg-[#1A1410]/10 text-[#1A1410]/70 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
          >
            <Eye className="w-4 h-4" />
            {preview ? "ویرایش" : "پیش‌نمایش"}
          </button>

          {articleId ? (
            <button
              onClick={handlePublishGenerated}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-[#FF5722]/25"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              انتشار
            </button>
          ) : (
            <>
              <button
                onClick={() => handleSaveNew(false)}
                disabled={saving}
                className="px-4 py-2 bg-[#1A1410]/5 hover:bg-[#1A1410]/10 text-[#1A1410]/70 rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                <Save className="w-4 h-4" />
                پیش‌نویس
              </button>
              <button
                onClick={() => handleSaveNew(true)}
                disabled={saving}
                className="px-5 py-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-[#FF5722]/25"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                انتشار
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[#FF5722]/8 p-1 rounded-xl w-fit flex-wrap">
        <button onClick={() => setActiveTab("research")} className={tabButtonClass("research")}>
          <Globe className="w-4 h-4" />
          تحقیقمحور
        </button>
        <button onClick={() => setActiveTab("ai")} className={tabButtonClass("ai")}>
          <Wand2 className="w-4 h-4" />
          سریع
        </button>
        <button onClick={() => setActiveTab("manual")} className={tabButtonClass("manual")}>
          <FileText className="w-4 h-4" />
          دستی
        </button>
      </div>

      {/* Research */}
      {activeTab === "research" && (
        <div className="bg-white rounded-xl border border-[#FF5722]/20 shadow-sm p-6 space-y-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-[#FF5722]/8 border border-[#FF5722]/20">
              <Search className="w-5 h-5 text-[#FF5722]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A1410]">تولید تحقیقمحور</h3>
              <p className="text-xs text-[#1A1410]/40">جستجوی گوگل + تحلیل رقبا + تولید مقاله برتر</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>عمق تحقیق</label>
            <div className="flex gap-2">
              <button
                onClick={() => setResearchDepth("deep")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  researchDepth === "deep"
                    ? "bg-[#FF5722]/8 border-[#FF5722]/40 text-[#FF5722]"
                    : "border-[#1A1410]/10 text-[#1A1410]/50 hover:border-[#1A1410]/20"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  عمیق (۳ منبع)
                </div>
                <p className="text-[10px] font-normal mt-0.5 text-[#1A1410]/40">۲-۳ دقیقه</p>
              </button>
              <button
                onClick={() => setResearchDepth("quick")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                  researchDepth === "quick"
                    ? "bg-[#FF5722]/8 border-[#FF5722]/40 text-[#FF5722]"
                    : "border-[#1A1410]/10 text-[#1A1410]/50 hover:border-[#1A1410]/20"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  سریع (۱ منبع)
                </div>
                <p className="text-[10px] font-normal mt-0.5 text-[#1A1410]/40">۳۰-۶۰ ثانیه</p>
              </button>
            </div>
          </div>

          <div className="bg-[#FF5722]/8 rounded-xl p-3 text-xs text-[#FF5722] leading-relaxed">
            💡 این روش محتوای برتر صفحه اول گوگل را تحلیل کرده و مقاله‌ای جامع‌تر می‌سازد.
          </div>

          <div>
            <label className={labelClass}>موضوع مقاله (اختیاری)</label>
            <input
              type="text"
              value={researchTopic}
              onChange={(e) => setResearchTopic(e.target.value)}
              placeholder="مثلاً: علت داغ شدن لپ‌تاپ و راه‌حل"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              کلیدواژه‌ها <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={researchKeywords}
              onChange={(e) => setResearchKeywords(e.target.value)}
              placeholder="تعمیر لپ تاپ, تعمیر باتری, ..."
              className={inputClass}
            />
            <p className="text-[10px] text-[#1A1410]/40 mt-1">با کاما (,) جدا کنید</p>
          </div>

          {generating && generationStatus ? (
            <div className="bg-[#FF5722]/8 border border-[#FF5722]/20 rounded-xl p-4 text-center">
              <Loader2 className="w-6 h-6 text-[#FF5722] animate-spin mx-auto mb-2" />
              <p className="text-sm font-medium text-[#FF5722]">{generationStatus}</p>
              <p className="text-[10px] text-[#FF5722]/60 mt-1">لطفاً صبور باشید...</p>
            </div>
          ) : (
            <button
              onClick={handleResearchGenerate}
              disabled={generating}
              className="w-full py-3 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5722]/25"
            >
              <Search className="w-4 h-4" />
              تحقیق و تولید مقاله برتر
            </button>
          )}
        </div>
      )}

      {/* AI */}
      {activeTab === "ai" && (
        <div className="bg-white rounded-xl border border-[#1A1410]/10 p-6 space-y-4 max-w-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-[#FF5722]/8 border border-[#FF5722]/20">
              <Sparkles className="w-5 h-5 text-[#FF5722]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1A1410]">تولید سریع با هوش مصنوعی</h3>
              <p className="text-xs text-[#1A1410]/40">ایده‌آل برای مقالات کوتاه و محتوای عمومی</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>پرامپت (اختیاری)</label>
            <select value={selectedPrompt} onChange={(e) => setSelectedPrompt(e.target.value)} className={inputClass}>
              <option value="">-- انتخاب پرامپت ذخیره شده --</option>
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.category ? `(${p.category})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              کلیدواژه‌ها <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="تعمیر لپ تاپ, تعمیر مادربرد, ..."
              className={inputClass}
            />
            <p className="text-[10px] text-[#1A1410]/40 mt-1">با کاما (,) جدا کنید</p>
          </div>

          <div>
            <label className={labelClass}>دستورالعمل اضافه (اختیاری)</label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
              placeholder="هر توضیح اضافی برای AI..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {generating && generationStatus ? (
            <div className="bg-[#FF5722]/8 border border-[#FF5722]/20 rounded-xl p-4 text-center">
              <Loader2 className="w-6 h-6 text-[#FF5722] animate-spin mx-auto mb-2" />
              <p className="text-sm font-medium text-[#FF5722]">{generationStatus}</p>
            </div>
          ) : (
            <button
              onClick={handleQuickGenerate}
              disabled={generating}
              className="w-full py-3 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5722]/25"
            >
              <Sparkles className="w-4 h-4" />
              تولید مقاله با هوش مصنوعی
            </button>
          )}
        </div>
      )}

      {/* Manual */}
      {activeTab === "manual" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-[#1A1410]/10 shadow-sm p-4">
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="عنوان مقاله را اینجا بنویسید..."
                className="w-full text-xl font-bold text-[#1A1410] outline-none placeholder:text-[#1A1410]/25"
                autoFocus
              />
            </div>

            <div className="bg-white rounded-xl border border-[#1A1410]/10 shadow-sm p-4 min-h-[500px]">
              {preview ? (
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{
                    __html: content || '<p class="text-[#1A1410]/30 text-center py-20">محتوایی وارد نشده است</p>',
                  }}
                />
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder='<h2>عنوان بخش</h2>&#10;<p>محتوای خود را اینجا بنویسید...</p>'
                  rows={30}
                  className="w-full outline-none text-sm text-[#1A1410]/80 resize-none placeholder:text-[#1A1410]/25 font-mono leading-relaxed"
                  dir="ltr"
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#1A1410]/10 shadow-sm p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1A1410] flex items-center gap-2">
                <Search className="w-4 h-4 text-[#FF5722]" /> SEO
              </h3>
              <div>
                <label className={labelClass}>Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} dir="ltr" placeholder="article-slug" />
              </div>
              <div>
                <label className={labelClass}>Meta Title</label>
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className={inputClass} placeholder="حداکثر ۶۰ کاراکتر" />
              </div>
              <div>
                <label className={labelClass}>Meta Description</label>
                <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="حداکثر ۱۶۰ کاراکتر" />
              </div>
              <div>
                <label className={labelClass}>خلاصه</label>
                <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="خلاصه کوتاه..." />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#1A1410]/10 shadow-sm p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1A1410]">دسته‌بندی</h3>
              <div>
                <label className={labelClass}>دسته‌بندی</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} placeholder="مثلاً: تعمیر لپ‌تاپ" />
              </div>
              <div>
                <label className={labelClass}>کلمات کلیدی (کاما جدا)</label>
                <input type="text" value={keywordsInput} onChange={(e) => setKeywordsInput(e.target.value)} className={inputClass} dir="ltr" placeholder="keyword1, keyword2" />
              </div>
              <div>
                <label className={labelClass}>برچسب‌ها (کاما جدا)</label>
                <input type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={inputClass} dir="ltr" placeholder="tag1, tag2" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#1A1410]/10 shadow-sm p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#1A1410]">تصویر شاخص</h3>
              <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={inputClass} dir="ltr" placeholder="https://example.com/image.jpg" />
              {coverImage && (
                <img
                  src={coverImage}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg border border-[#1A1410]/10"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>

            <div className="bg-white rounded-xl border border-[#1A1410]/10 shadow-sm p-4">
              <label className={labelClass}>⏱️ زمان مطالعه (دقیقه)</label>
              <input type="number" value={readingTime} onChange={(e) => setReadingTime(parseInt(e.target.value) || 5)} className={inputClass} min="1" max="60" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}