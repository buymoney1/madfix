// src/app/admin/prompts/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Trash2, Loader2, MessageSquare, Sparkles, Edit3, X,
  Check, AlertCircle, Copy, Tag, FileText, Hash, ToggleLeft,
  ToggleRight, Search,
} from "lucide-react";
import { toast } from "sonner";

// ==================== Types ====================
interface Prompt {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
  isActive: boolean;
  _count?: { articles: number };
}

interface PromptForm {
  name: string;
  description: string;
  prompt: string;
  category: string;
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
function PromptSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-[#1A1410]/8 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[#FF5722]/10 rounded-xl" />
            <div className="h-4 w-32 bg-[#FF5722]/10 rounded-lg" />
            <div className="h-5 w-16 bg-[#FF5722]/5 rounded-full" />
          </div>
          <div className="h-3 bg-[#FF5722]/5 rounded-md w-full mb-2" />
          <div className="h-3 bg-[#FF5722]/5 rounded-md w-3/4" />
        </div>
      ))}
    </div>
  );
}

// ==================== Modal ====================
function PromptModal({
  isOpen, onClose, onSave, initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: PromptForm) => Promise<void>;
  initialData?: PromptForm;
}) {
  const [form, setForm] = useState<PromptForm>(initialData || { name: "", description: "", prompt: "", category: "" });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<PromptForm>>({});

  useEffect(() => {
    setForm(initialData || { name: "", description: "", prompt: "", category: "" });
    setErrors({});
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<PromptForm> = {};
    if (!form.name.trim()) newErrors.name = "نام پرامپت الزامی است";
    if (!form.prompt.trim()) newErrors.prompt = "متن پرامپت الزامی است";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در ذخیره‌سازی");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-4 py-2.5 bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl text-sm outline-none transition-all focus:border-[#FF5722]/40 focus:bg-white focus:ring-4 focus:ring-[#FF5722]/10 placeholder:text-[#1A1410]/30 text-[#1A1410]";
  const labelClass = "block text-[11px] font-bold text-[#1A1410]/60 mb-2 uppercase tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl border border-[#1A1410]/8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#1A1410]/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF5722]/10 to-[#FF5722]/5 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF5722]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1A1410]">
                {initialData ? "ویرایش پرامپت" : "پرامپت جدید"}
              </h2>
              <p className="text-[10px] text-[#1A1410]/40">
                {initialData ? "پرامپت مورد نظر را ویرایش کنید" : "پرامپت جدید برای تولید محتوا"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[#FF5722]/8 text-[#1A1410]/40 hover:text-[#FF5722] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={labelClass}>
              <Hash className="w-3 h-3 inline-block ml-1" />
              نام پرامپت *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="مثلاً: مقاله تعمیر باتری لپ‌تاپ"
              className={`${inputClass} ${errors.name ? "border-red-300 focus:border-red-400 focus:ring-red-50" : ""}`}
            />
            {errors.name && (
              <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              <Tag className="w-3 h-3 inline-block ml-1" /> دسته‌بندی
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="تعمیر لپ‌تاپ، باتری، هارد..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              <FileText className="w-3 h-3 inline-block ml-1" /> توضیحات
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="توضیح کوتاه درباره کاربرد این پرامپت..."
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              <MessageSquare className="w-3 h-3 inline-block ml-1" /> متن پرامپت *
            </label>
            <textarea
              value={form.prompt}
              onChange={(e) => setForm({ ...form, prompt: e.target.value })}
              placeholder="متن کامل پرامپت را وارد کنید..."
              rows={8}
              className={`${inputClass} font-mono text-xs leading-relaxed`}
              dir="ltr"
            />
            {errors.prompt && (
              <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.prompt}
              </p>
            )}
            <p className="text-[9px] text-[#1A1410]/40 mt-1 text-left" dir="ltr">
              {form.prompt.length} characters
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-[#1A1410]/8 bg-[#FFF9F5]/50 rounded-b-3xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-[#1A1410]/50 hover:text-[#1A1410] bg-white border border-[#1A1410]/10 rounded-xl transition-all"
          >
            انصراف
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#FF5722]/25 disabled:opacity-50"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> در حال ذخیره...</>
            ) : (
              <><Check className="w-4 h-4" /> {initialData ? "بروزرسانی" : "ذخیره پرامپت"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== Main ====================
export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/prompts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setPrompts(Array.isArray(data.prompts) ? data.prompts : []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطا در دریافت پرامپت‌ها";
      setError(message);
      setPrompts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPrompts(); }, [loadPrompts]);

  const handleSave = async (form: PromptForm) => {
    const url = editingPrompt ? `/api/admin/prompts/${editingPrompt.id}` : "/api/admin/prompts";
    const method = editingPrompt ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "خطا در ذخیره");
    }
    toast.success(editingPrompt ? "پرامپت بروزرسانی شد" : "پرامپت ایجاد شد");
    await loadPrompts();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`پرامپت «${name}» حذف شود؟`)) return;
    setDeletingId(id);
    const loadingToast = toast.loading("در حال حذف...");
    try {
      const res = await fetch(`/api/admin/prompts/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "خطا در حذف", { id: loadingToast });
        return;
      }
      toast.success("پرامپت حذف شد", { id: loadingToast });
      await loadPrompts();
    } catch {
      toast.error("خطای شبکه", { id: loadingToast });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (prompt: Prompt) => {
    setTogglingId(prompt.id);
    try {
      const res = await fetch(`/api/admin/prompts/${prompt.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !prompt.isActive }),
      });
      if (!res.ok) throw new Error("خطا");
      toast.success(prompt.isActive ? "غیرفعال شد" : "فعال شد");
      await loadPrompts();
    } catch {
      toast.error("خطا در تغییر وضعیت");
    } finally {
      setTogglingId(null);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("کپی شد");
    } catch {
      toast.error("خطا در کپی");
    }
  };

  const categories = ["all", ...new Set(prompts.map((p) => p.category).filter(Boolean))];

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      !searchTerm ||
      prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || prompt.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const activeCount = prompts.filter((p) => p.isActive).length;
  const totalArticles = prompts.reduce((sum, p) => sum + (p._count?.articles || 0), 0);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <DecorativeCircle size={28} className="text-[#FF5722]/40 flex-shrink-0" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1A1410] tracking-tight">پرامپت‌ها</h1>
            <DecorativeLine className="text-[#FF5722] mt-1" />
          </div>
        </div>

        <button
          onClick={() => { setEditingPrompt(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-[#FF5722]/25"
        >
          <Plus className="w-4 h-4" /> پرامپت جدید
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-3 text-center">
          <p className="text-lg font-black text-[#1A1410]">{prompts.length.toLocaleString("fa-IR")}</p>
          <p className="text-[10px] text-[#1A1410]/40">کل پرامپت‌ها</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-3 text-center">
          <p className="text-lg font-black text-emerald-600">{activeCount.toLocaleString("fa-IR")}</p>
          <p className="text-[10px] text-[#1A1410]/40">فعال</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-3 text-center">
          <p className="text-lg font-black text-[#1A1410]">{totalArticles.toLocaleString("fa-IR")}</p>
          <p className="text-[10px] text-[#1A1410]/40">مقالات تولید شده</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1410]/30 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجو در پرامپت‌ها..."
            className="w-full h-11 pr-10 pl-4 bg-white border border-[#1A1410]/8 rounded-xl text-sm outline-none transition-all focus:border-[#FF5722]/40 focus:ring-4 focus:ring-[#FF5722]/10 placeholder:text-[#1A1410]/30"
          />
        </div>

        {categories.length > 1 && (
          <div className="flex gap-1 bg-white border border-[#1A1410]/8 rounded-xl p-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                  categoryFilter === cat
                    ? "bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white shadow-sm"
                    : "text-[#1A1410]/40 hover:text-[#FF5722]"
                }`}
              >
                {cat === "all" ? "همه" : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200/60 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-600 flex-1">{error}</p>
          <button
            onClick={loadPrompts}
            className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-100 px-3 py-1.5 rounded-lg"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <PromptSkeleton />
      ) : filteredPrompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#1A1410]/8">
          <div className="w-16 h-16 bg-[#FF5722]/8 rounded-2xl flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-[#FF5722]/40" />
          </div>
          <h2 className="text-base font-bold text-[#1A1410] mb-2">پرامپتی یافت نشد</h2>
          <p className="text-sm text-[#1A1410]/40 mb-4">
            {searchTerm || categoryFilter !== "all"
              ? "نتیجه‌ای با این فیلترها پیدا نشد"
              : "هنوز هیچ پرامپتی ثبت نشده"}
          </p>
          {!searchTerm && categoryFilter === "all" && (
            <button
              onClick={() => { setEditingPrompt(null); setShowModal(true); }}
              className="text-xs font-bold text-[#FF5722] hover:text-white bg-[#FF5722]/8 hover:bg-[#FF5722] px-4 py-2 rounded-full transition-all"
            >
              ایجاد اولین پرامپت
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrompts.map((prompt) => (
            <div key={prompt.id} className="group bg-white rounded-2xl border border-[#1A1410]/8 p-5 hover:border-[#FF5722]/20 hover:shadow-md transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#FF5722]/10 to-[#FF5722]/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-4 h-4 text-[#FF5722]" />
                      </div>
                      <h3 className="text-sm font-bold text-[#1A1410] group-hover:text-[#FF5722] transition-colors">
                        {prompt.name}
                      </h3>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        prompt.isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-[#1A1410]/5 text-[#1A1410]/40"
                      }`}
                    >
                      {prompt.isActive ? "فعال" : "غیرفعال"}
                    </span>

                    {prompt.category && (
                      <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                        {prompt.category}
                      </span>
                    )}

                    <span className="text-[10px] text-[#1A1410]/40 flex items-center gap-1">
                      <FileText className="w-3 h-3" /> {prompt._count?.articles || 0} مقاله
                    </span>
                  </div>

                  {prompt.description && (
                    <p className="text-xs text-[#1A1410]/50 mb-2 leading-relaxed">{prompt.description}</p>
                  )}

                  <div className="relative bg-[#FFF9F5] rounded-xl p-3 border border-[#1A1410]/5 group/prompt">
                    <p className="text-[11px] text-[#1A1410]/60 font-mono leading-relaxed line-clamp-3" dir="ltr">
                      {prompt.prompt}
                    </p>
                    <button
                      onClick={() => handleCopy(prompt.prompt)}
                      className="absolute top-2 left-2 p-1.5 rounded-lg bg-white border border-[#1A1410]/10 text-[#1A1410]/40 hover:text-[#FF5722] hover:border-[#FF5722]/30 opacity-0 group-hover/prompt:opacity-100 transition-all"
                      title="کپی پرامپت"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(prompt)}
                    disabled={togglingId === prompt.id}
                    className="p-2 rounded-xl text-[#1A1410]/40 hover:text-[#FF5722] hover:bg-[#FF5722]/8 transition-all disabled:opacity-50"
                    title={prompt.isActive ? "غیرفعال کردن" : "فعال کردن"}
                  >
                    {togglingId === prompt.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : prompt.isActive ? (
                      <ToggleRight className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => { setEditingPrompt(prompt); setShowModal(true); }}
                    className="p-2 rounded-xl text-[#1A1410]/40 hover:text-[#FF5722] hover:bg-[#FF5722]/8 transition-all"
                    title="ویرایش"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(prompt.id, prompt.name)}
                    disabled={deletingId === prompt.id}
                    className="p-2 rounded-xl text-[#1A1410]/40 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                    title="حذف"
                  >
                    {deletingId === prompt.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PromptModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingPrompt(null); }}
        onSave={handleSave}
        initialData={
          editingPrompt
            ? {
                name: editingPrompt.name,
                description: editingPrompt.description || "",
                prompt: editingPrompt.prompt,
                category: editingPrompt.category || "",
              }
            : undefined
        }
      />
    </div>
  );
}