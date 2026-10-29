// src/app/admin/articles/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Eye, Edit, Trash2, Loader2,
  ArrowUpDown, ArrowUp, ArrowDown, FileText,
} from "lucide-react";
import { toast } from "sonner";

// ==================== Types ====================
interface Article {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  viewCount: number;
  keywords: string[];
  createdAt: string;
  _count?: { views: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type SortField = "createdAt" | "views";
type SortOrder = "asc" | "desc";

// ==================== Component ====================
export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        search,
        limit: "20",
        sortBy,
        sortOrder,
      });
      const res = await fetch(`/api/admin/articles?${params}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در دریافت مقالات");
        return;
      }

      setArticles(data.articles || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error(err);
      toast.error("خطای شبکه در دریافت مقالات");
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`آیا از حذف «${title}» اطمینان دارید؟`)) return;

    const loadingToast = toast.loading("در حال حذف...");
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "خطا در حذف", { id: loadingToast });
        return;
      }
      toast.success("مقاله حذف شد", { id: loadingToast });
      loadArticles();
    } catch (err) {
      console.error(err);
      toast.error("خطای شبکه در حذف", { id: loadingToast });
    }
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
    return sortOrder === "asc"
      ? <ArrowUp className="w-3 h-3 text-[#FF5722]" />
      : <ArrowDown className="w-3 h-3 text-[#FF5722]" />;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#1A1410]">مقالات</h1>
          <p className="text-[10px] text-[#1A1410]/40 mt-0.5">
            مدیریت مقالات مجله مدفیکس
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="px-4 py-2.5 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#FF5722]/25 transition-all"
        >
          <Plus className="w-4 h-4" /> مقاله جدید
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-[#1A1410]/8 mb-4 p-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1410]/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="جستجوی مقاله..."
            className="w-full h-10 pr-9 pl-4 bg-[#FFF9F5] border border-[#1A1410]/10 rounded-lg text-sm outline-none focus:border-[#FF5722]/40 focus:bg-white focus:ring-2 focus:ring-[#FF5722]/10 transition-all placeholder:text-[#1A1410]/30"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#FF5722] animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#1A1410]/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FFF9F5] border-b border-[#1A1410]/8">
                  <th className="p-3 text-right text-xs font-bold text-[#1A1410]/50">عنوان</th>
                  <th className="p-3 text-right text-xs font-bold text-[#1A1410]/50">وضعیت</th>
                  <th className="p-3 text-right text-xs font-bold text-[#1A1410]/50">
                    <button
                      onClick={() => handleSort("views")}
                      className="flex items-center gap-1 hover:text-[#FF5722] transition-colors"
                    >
                      بازدید {getSortIcon("views")}
                    </button>
                  </th>
                  <th className="p-3 text-right text-xs font-bold text-[#1A1410]/50">
                    <button
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center gap-1 hover:text-[#FF5722] transition-colors"
                    >
                      تاریخ {getSortIcon("createdAt")}
                    </button>
                  </th>
                  <th className="p-3 text-right text-xs font-bold text-[#1A1410]/50">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1410]/5">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-[#FF5722]/[0.02] transition-colors">
                    <td className="p-3">
                      <p className="text-sm font-medium text-[#1A1410] truncate max-w-xs">
                        {article.title}
                      </p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {article.keywords?.slice(0, 3).map((kw) => (
                          <span
                            key={kw}
                            className="text-[9px] bg-[#FF5722]/8 text-[#FF5722] px-1.5 py-0.5 rounded border border-[#FF5722]/15"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          article.isPublished
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-[#FF5722]/8 text-[#FF5722]"
                        }`}
                      >
                        {article.isPublished ? "منتشر شده" : "پیش‌نویس"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#1A1410]/30" />
                        <span className="text-sm font-medium text-[#1A1410]">
                          {(article._count?.views ?? article.viewCount ?? 0).toLocaleString("fa-IR")}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-[#1A1410]/40">
                      {new Date(article.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-1.5 rounded-lg text-[#1A1410]/40 hover:text-[#FF5722] hover:bg-[#FF5722]/8 transition-colors"
                          aria-label="ویرایش"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="p-1.5 rounded-lg text-[#1A1410]/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {articles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-8 h-8 text-[#1A1410]/20 mx-auto mb-2" />
              <p className="text-[#1A1410]/40 text-sm">مقاله‌ای یافت نشد</p>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between p-3 border-t border-[#1A1410]/8">
              <span className="text-xs text-[#1A1410]/40">
                {pagination.total.toLocaleString("fa-IR")} مقاله — صفحه {page.toLocaleString("fa-IR")} از {pagination.totalPages.toLocaleString("fa-IR")}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                      page === i + 1
                        ? "bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white shadow-sm"
                        : "border border-[#1A1410]/10 text-[#1A1410]/50 hover:border-[#FF5722]/30 hover:text-[#FF5722]"
                    }`}
                  >
                    {(i + 1).toLocaleString("fa-IR")}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}