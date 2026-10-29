// src/app/admin/keyword-pools/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Trash2, Loader2, Zap, Play, FileJson, List,
  Upload, CheckCircle2, AlertCircle, Layers, Tags,
} from "lucide-react";
import { toast } from "sonner";

// ==================== Types ====================
interface Pool {
  id: string;
  name: string;
  keywords: string[];
  category: string | null;
}

interface ParsedPool {
  id: string;
  name: string;
  category: string | null;
  keywords: string[];
}

type TabType = "list" | "batch";

// ==================== Component ====================
export default function KeywordPoolsPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [keywordsText, setKeywordsText] = useState("");
  const [category, setCategory] = useState("");
  const [running, setRunning] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("list");

  // Batch
  const [jsonInput, setJsonInput] = useState("");
  const [parsedPools, setParsedPools] = useState<ParsedPool[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const loadPools = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/keyword-pools");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطا");
      setPools(data.pools || []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در دریافت گروه‌ها");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPools(); }, [loadPools]);

  // ==================== Single Create ====================
  const handleCreate = async () => {
    const keywords = keywordsText.split("\n").map((k) => k.trim()).filter(Boolean);
    if (!name.trim() || keywords.length < 2) {
      return toast.error("نام گروه و حداقل ۲ کلیدواژه لازم است");
    }

    setCreating(true);
    const loadingToast = toast.loading("در حال ایجاد...");
    try {
      const res = await fetch("/api/admin/keyword-pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), keywords, category: category.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "خطا در ایجاد", { id: loadingToast });
        return;
      }
      toast.success("گروه ساخته شد", { id: loadingToast });
      setName(""); setKeywordsText(""); setCategory("");
      loadPools();
    } catch {
      toast.error("خطای شبکه", { id: loadingToast });
    } finally {
      setCreating(false);
    }
  };

  // ==================== Delete ====================
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`گروه «${name}» حذف شود؟`)) return;
    setDeletingId(id);
    const loadingToast = toast.loading("در حال حذف...");
    try {
      const res = await fetch("/api/admin/keyword-pools", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "خطا در حذف", { id: loadingToast });
        return;
      }
      toast.success("گروه حذف شد", { id: loadingToast });
      loadPools();
    } catch {
      toast.error("خطای شبکه", { id: loadingToast });
    } finally {
      setDeletingId(null);
    }
  };

  // ==================== Run Cron ====================
  const handleRunNow = async () => {
    setRunning(true);
    const loadingToast = toast.loading("در حال اجرای کران...");
    try {
      const res = await fetch("/api/cron/auto-blog", {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ""}` },
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        toast.success(`مقاله ${data.wordCount} کلمه‌ای از «${data.poolName}» ساخته شد`, {
          id: loadingToast, duration: 5000,
        });
      } else {
        toast.error(data.error || "خطا در اجرا", { id: loadingToast });
      }
      loadPools();
    } catch {
      toast.error("خطای شبکه", { id: loadingToast });
    } finally {
      setRunning(false);
    }
  };

  // ==================== Batch Parse ====================
  const handleParseJSON = () => {
    setParseError(null);
    setParsedPools([]);

    if (!jsonInput.trim()) {
      setParseError("لطفاً JSON را وارد کنید");
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        setParseError("فرمت باید آرایه‌ای از گروه‌ها باشد: [{}, {}, ...]");
        return;
      }

      const validPools: ParsedPool[] = [];
      const errors: string[] = [];

      parsed.forEach((item: unknown, index: number) => {
        const obj = item as Record<string, unknown>;
        if (!obj.name || typeof obj.name !== "string") {
          errors.push(`آیتم ${index + 1}: "name" الزامی است`);
          return;
        }
        if (!Array.isArray(obj.keywords) || obj.keywords.length < 2) {
          errors.push(`«${obj.name}»: حداقل ۲ کلیدواژه الزامی است`);
          return;
        }
        validPools.push({
          id: `preview-${index}`,
          name: obj.name as string,
          category: typeof obj.category === "string" ? obj.category : null,
          keywords: (obj.keywords as unknown[]).map((k) => String(k).trim()).filter(Boolean),
        });
      });

      if (errors.length > 0) {
        setParseError(errors.join("\n"));
        setParsedPools(validPools);
        return;
      }

      setParsedPools(validPools);
      toast.success(`${validPools.length} گروه شناسایی شد`);
    } catch (e: unknown) {
      setParseError(`خطای JSON: ${e instanceof Error ? e.message : "نامشخص"}`);
    }
  };

  // ==================== Batch Import ====================
  const handleBatchImport = async () => {
    if (parsedPools.length === 0) return;
    setImporting(true);
    const loadingToast = toast.loading("در حال ذخیره گروه‌ها...");

    try {
      const payload = parsedPools.map(({ name, category, keywords }) => ({
        name, category: category || undefined, keywords,
      }));

      const res = await fetch("/api/admin/keyword-pools/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pools: payload }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success(`${data.count} گروه با موفقیت ذخیره شد`, { id: loadingToast });
        setJsonInput(""); setParsedPools([]); setActiveTab("list");
        loadPools();
      } else {
        toast.error(data.error || "خطا در ذخیره‌سازی", { id: loadingToast });
      }
    } catch {
      toast.error("خطای شبکه", { id: loadingToast });
    } finally {
      setImporting(false);
    }
  };

  // ==================== Styles ====================
  const tabButtonClass = (tab: TabType) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
      activeTab === tab
        ? "bg-[#1A1410] text-white shadow-lg shadow-[#1A1410]/20"
        : "bg-[#FF5722]/8 text-[#1A1410]/50 hover:bg-[#FF5722]/15"
    }`;

  const inputClass =
    "w-full px-3 py-2.5 border border-[#1A1410]/10 rounded-lg text-sm outline-none focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/10 bg-white placeholder:text-[#1A1410]/30 text-[#1A1410] transition-all";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-[#1A1410]">گروه‌های کلیدواژه</h1>
          <p className="text-[10px] text-[#1A1410]/40 mt-0.5">
            سیستم تولید خودکار مقاله بر اساس کلیدواژه‌ها
          </p>
        </div>
        <button
          onClick={handleRunNow}
          disabled={running}
          className="px-4 py-2 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#FF5722]/25 transition-all"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          اجرای دستی
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-[#FF5722]/8 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab("list")} className={tabButtonClass("list")}>
          <List className="w-4 h-4" /> لیست گروه‌ها
        </button>
        <button onClick={() => setActiveTab("batch")} className={tabButtonClass("batch")}>
          <Upload className="w-4 h-4" /> ورود گروهی
        </button>
      </div>

      {/* ==================== Tab: List ==================== */}
      {activeTab === "list" && (
        <>
          {/* Create */}
          <div className="bg-white rounded-xl border border-[#1A1410]/8 p-4 mb-6 space-y-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام گروه (مثلاً: تعمیر لپ‌تاپ شیراز)"
                className={inputClass}
              />
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="دسته‌بندی (مثلاً: لپ‌تاپ)"
                className={inputClass}
              />
            </div>
            <textarea
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
              placeholder={`کلیدواژه‌ها (هر خط یکی):\nتعمیر لپ تاپ شیراز\nتعمیر مادربرد\nتعویض باتری لپ تاپ\nبازیابی اطلاعات هارد`}
              rows={8}
              className={`${inputClass} resize-none font-mono`}
              dir="ltr"
            />
            <button
              onClick={handleCreate}
              disabled={creating}
              className="w-full py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              ایجاد گروه کلیدواژه
            </button>
          </div>

          {/* List */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF5722]" />
            </div>
          ) : (
            <div className="space-y-3">
              {pools.map((pool) => (
                <div key={pool.id} className="bg-white rounded-xl border border-[#1A1410]/8 p-4 hover:border-[#FF5722]/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1410] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#FF5722]" />
                        {pool.name}
                      </h3>
                      <span className="text-[10px] text-[#1A1410]/40">
                        {pool.keywords.length} کلیدواژه | {pool.category || "بدون دسته"}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(pool.id, pool.name)}
                      disabled={deletingId === pool.id}
                      className="p-1.5 rounded-lg text-[#1A1410]/40 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      aria-label="حذف"
                    >
                      {deletingId === pool.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pool.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[11px] bg-[#FF5722]/8 text-[#FF5722] px-2.5 py-1 rounded-full border border-[#FF5722]/15 font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {pools.length === 0 && (
                <div className="text-center py-16 text-[#1A1410]/40">
                  <Zap className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#FF5722]" />
                  <p className="text-sm">هیچ گروهی نساختی. یک گروه بساز تا سیستم خودکار مقاله تولید کند.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ==================== Tab: Batch ==================== */}
      {activeTab === "batch" && (
        <div className="space-y-4">
          {/* Info */}
          <div className="bg-[#FF5722]/5 border border-[#FF5722]/20 rounded-xl p-4 text-sm text-[#FF5722]">
            <p className="font-bold mb-1 flex items-center gap-1.5">
              <FileJson className="w-4 h-4" /> فرمت JSON مورد نیاز:
            </p>
            <pre className="text-xs bg-white/60 p-3 rounded-lg mt-2 overflow-x-auto border border-[#FF5722]/10" dir="ltr">
{`[
  {
    "name": "تعمیر لپ‌تاپ شیراز",
    "category": "لپ‌تاپ",
    "keywords": ["تعمیر لپ تاپ", "تعویض باتری", "تعمیر مادربرد"]
  },
  {
    "name": "بازیابی اطلاعات",
    "category": "هارد",
    "keywords": ["بازیابی هارد", "SSD", "دیتا ریکاوری"]
  }
]`}
            </pre>
            <p className="text-[11px] mt-2 text-[#FF5722]/70">
              ✅ name: الزامی | category: اختیاری | keywords: آرایه با حداقل ۲ کلیدواژه
            </p>
          </div>

          {/* JSON Input */}
          <div className="bg-white rounded-xl border border-[#1A1410]/8 p-4">
            <label className="block text-sm font-bold text-[#1A1410]/70 mb-2">
              محتوای JSON را اینجا paste کنید:
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setParseError(null);
                setParsedPools([]);
              }}
              rows={15}
              className={`${inputClass} resize-none font-mono`}
              dir="ltr"
              placeholder='[{ "name": "...", "category": "...", "keywords": ["..."] }]'
            />
            <button
              onClick={handleParseJSON}
              disabled={!jsonInput.trim()}
              className="mt-3 px-4 py-2 bg-[#1A1410] hover:bg-[#1A1410]/90 text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              <FileJson className="w-4 h-4" /> بررسی و نمایش
            </button>
          </div>

          {/* Error */}
          {parseError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700 mb-1">خطا در فرمت:</p>
                  <pre className="text-xs text-red-600 whitespace-pre-wrap">{parseError}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {parsedPools.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-bold text-[#1A1410]/70 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  پیش‌نمایش ({parsedPools.length} گروه)
                </h3>
                <button
                  onClick={handleBatchImport}
                  disabled={importing}
                  className="px-5 py-2.5 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl text-sm font-bold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#FF5722]/25 transition-all"
                >
                  {importing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> در حال ذخیره...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> ذخیره همه گروه‌ها</>
                  )}
                </button>
              </div>

              {parsedPools.map((pool, index) => (
                <div key={pool.id} className="bg-white rounded-xl border border-emerald-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] text-emerald-500 font-bold">گروه #{index + 1}</span>
                      <h4 className="text-sm font-bold text-[#1A1410] flex items-center gap-1.5">
                        <Tags className="w-3.5 h-3.5 text-emerald-500" />
                        {pool.name}
                      </h4>
                      {pool.category && (
                        <span className="text-[10px] text-[#1A1410]/40">دسته: {pool.category}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#1A1410]/40">{pool.keywords.length} کلیدواژه</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pool.keywords.map((kw) => (
                      <span key={kw} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!parseError && parsedPools.length === 0 && !jsonInput.trim() && (
            <div className="text-center py-16 text-[#1A1410]/40">
              <FileJson className="w-12 h-12 mx-auto mb-4 opacity-30 text-[#FF5722]" />
              <p className="text-sm">JSON گروه‌های کلیدواژه را paste و بررسی کنید</p>
              <p className="text-xs mt-1">می‌توانید چندین گروه را یکجا import کنید</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}