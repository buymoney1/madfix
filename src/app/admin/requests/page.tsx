// src/app/admin/requests/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Loader2, Search, Phone, Wrench, Clock, CheckCircle2,
  XCircle, AlertCircle, RefreshCw, Eye, ChevronLeft,
  ChevronRight, MessageCircle, User, Laptop, Calendar,
  ClipboardList, Filter, MoreVertical,
} from "lucide-react";
import { toast } from "sonner";

// ==================== Types ====================
type RepairStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface RepairRequest {
  id: string;
  name: string;
  phone: string;
  deviceType: string;
  problem: string;
  brand?: string | null;
  model?: string | null;
  description?: string | null;
  address?: string | null;
  email?: string | null;
  status: RepairStatus;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name?: string | null; phone?: string | null } | null;
}

interface ApiResponse {
  ok?: boolean;
  requests?: RepairRequest[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

// ==================== Config ====================
const STATUS_CONFIG: Record<
  RepairStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  PENDING: {
    label: "در انتظار",
    color: "text-[#FFA000]",
    bg: "bg-[#FFA000]/10",
    border: "border-[#FFA000]/30",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "در حال انجام",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: Wrench,
  },
  COMPLETED: {
    label: "تکمیل شده",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "لغو شده",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
  },
};

const STATUS_ORDER: RepairStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

const FILTER_OPTIONS: { value: "all" | RepairStatus; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "PENDING", label: "در انتظار" },
  { value: "IN_PROGRESS", label: "در حال انجام" },
  { value: "COMPLETED", label: "تکمیل شده" },
  { value: "CANCELLED", label: "لغو شده" },
];

// ==================== Helpers ====================
const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const formatRelative = (iso: string): string => {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "همین حالا";
    if (mins < 60) return `${mins} دقیقه پیش`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ساعت پیش`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} روز پیش`;
    return formatDate(iso);
  } catch {
    return "—";
  }
};

const phoneToTel = (phone: string): string => `tel:+98${phone.replace(/^0/, "")}`;
const phoneToWhatsApp = (phone: string): string =>
  `https://wa.me/98${phone.replace(/^0/, "")}`;

// ==================== Main ====================
export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [pagination, setPagination] = useState<ApiResponse["pagination"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | RepairStatus>("all");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null);

  // ==================== Load ====================
  const loadRequests = useCallback(
    async (silent = false) => {
      if (silent) setRefreshing(true);
      else setLoading(true);

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "20",
        });
        if (search.trim()) params.set("search", search.trim());
        if (statusFilter !== "all") params.set("status", statusFilter);

        const res = await fetch(`/api/admin/requests?${params}`);
        const data: ApiResponse = await res.json().catch(() => ({}));

        if (!res.ok) {
          toast.error(data.error || "خطا در دریافت درخواست‌ها");
          return;
        }

        setRequests(data.requests || []);
        setPagination(data.pagination || null);
      } catch (err) {
        console.error("loadRequests error:", err);
        toast.error("خطای شبکه در دریافت درخواست‌ها");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search, statusFilter]
  );

  // Debounced load on search change
  useEffect(() => {
    const timer = setTimeout(() => loadRequests(), search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [loadRequests, search]);

  // ==================== Update Status ====================
  const updateStatus = async (id: string, status: RepairStatus) => {
    if (updatingId) return;
    setUpdatingId(id);
    const loadingToast = toast.loading("در حال بروزرسانی...");

    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error || "خطا در بروزرسانی وضعیت", { id: loadingToast });
        return;
      }

      // بروزرسانی محلی (به‌جای reload کامل)
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status });
      }

      toast.success(`وضعیت به «${STATUS_CONFIG[status].label}» تغییر کرد`, {
        id: loadingToast,
      });
    } catch {
      toast.error("خطای شبکه در بروزرسانی", { id: loadingToast });
    } finally {
      setUpdatingId(null);
    }
  };

  // ==================== Render ====================
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#FFA000] flex items-center justify-center shadow-md shadow-[#FF5722]/25">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1A1410]">درخواست‌های تعمیر</h1>
            <p className="text-[10px] sm:text-xs text-[#1A1410]/40 mt-0.5">
              {pagination ? `${pagination.total.toLocaleString("fa-IR")} درخواست ثبت شده` : "مدیریت درخواست‌های مشتریان"}
            </p>
          </div>
        </div>

        <button
          onClick={() => loadRequests(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#1A1410]/10 hover:border-[#FF5722]/30 text-[#1A1410]/60 hover:text-[#FF5722] rounded-xl text-sm font-bold transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          بروزرسانی
        </button>
      </div>

      {/* Filter + Search */}
      <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-3 mb-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1410]/30 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="جستجو در نام، شماره، یا مشکل..."
            className="w-full h-10 pr-10 pl-4 bg-[#FFF9F5] border border-[#1A1410]/10 rounded-xl text-sm outline-none focus:border-[#FF5722]/40 focus:bg-white focus:ring-2 focus:ring-[#FF5722]/10 transition-all placeholder:text-[#1A1410]/30"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {FILTER_OPTIONS.map((opt) => {
            const active = statusFilter === opt.value;
            const config = opt.value !== "all" ? STATUS_CONFIG[opt.value] : null;
            return (
              <button
                key={opt.value}
                onClick={() => { setStatusFilter(opt.value); setPage(1); }}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap border ${
                  active
                    ? "bg-[#FF5722] text-white border-[#FF5722] shadow-sm"
                    : "bg-white border-[#1A1410]/10 text-[#1A1410]/50 hover:border-[#FF5722]/30 hover:text-[#FF5722]"
                }`}
              >
                {config && <config.icon className="w-3 h-3 inline-block ml-1" />}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#FF5722] animate-spin mb-3" />
          <p className="text-xs text-[#1A1410]/40">در حال بارگذاری...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-16 text-center">
          <div className="w-16 h-16 bg-[#FF5722]/8 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-[#FF5722]/50" />
          </div>
          <h2 className="text-base font-bold text-[#1A1410] mb-2">درخواستی یافت نشد</h2>
          <p className="text-sm text-[#1A1410]/40">
            {search || statusFilter !== "all"
              ? "نتیجه‌ای با این فیلترها پیدا نشد"
              : "هنوز هیچ درخواستی ثبت نشده"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              updating={updatingId === req.id}
              onUpdateStatus={updateStatus}
              onShowDetails={() => setSelectedRequest(req)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#1A1410]/8 mt-4">
          <span className="text-xs text-[#1A1410]/40">
            صفحه {pagination.page.toLocaleString("fa-IR")} از {pagination.totalPages.toLocaleString("fa-IR")}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pagination.page === 1}
              className="w-8 h-8 rounded-lg border border-[#1A1410]/10 flex items-center justify-center text-[#1A1410]/50 hover:border-[#FF5722]/30 hover:text-[#FF5722] disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page === pagination.totalPages}
              className="w-8 h-8 rounded-lg border border-[#1A1410]/10 flex items-center justify-center text-[#1A1410]/50 hover:border-[#FF5722]/30 hover:text-[#FF5722] disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={updateStatus}
          updatingId={updatingId}
        />
      )}
    </div>
  );
}

// ==================== Request Card ====================
function RequestCard({
  request,
  updating,
  onUpdateStatus,
  onShowDetails,
}: {
  request: RepairRequest;
  updating: boolean;
  onUpdateStatus: (id: string, status: RepairStatus) => void;
  onShowDetails: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const config = STATUS_CONFIG[request.status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-white rounded-2xl border border-[#1A1410]/8 p-4 hover:border-[#FF5722]/20 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Left: User + device */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#FF5722]" />
              <span className="text-sm font-bold text-[#1A1410]">{request.name}</span>
            </div>

            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${config.bg} ${config.color} ${config.border}`}>
              <StatusIcon className="w-3 h-3" />
              {config.label}
            </span>

            <span className="text-[10px] text-[#1A1410]/40 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelative(request.createdAt)}
            </span>
          </div>

          <p className="text-xs text-[#1A1410]/60 mb-2 line-clamp-1">
            <AlertCircle className="w-3 h-3 inline-block ml-1 text-[#FF5722]" />
            {request.problem}
          </p>

          <div className="flex items-center gap-2 flex-wrap text-[10px] text-[#1A1410]/50">
            <span className="flex items-center gap-1">
              <Laptop className="w-3 h-3" />
              {request.deviceType}
              {request.brand && ` · ${request.brand}`}
            </span>
            <span className="w-px h-2.5 bg-[#1A1410]/15" />
            <span className="flex items-center gap-1" dir="ltr">
              <Phone className="w-3 h-3" />
              {request.phone}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <a
            href={phoneToTel(request.phone)}
            className="p-2 rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            title="تماس"
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href={phoneToWhatsApp(request.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-green-600 bg-green-50 hover:bg-green-100 transition-colors"
            title="واتس‌اپ"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <button
            onClick={onShowDetails}
            className="p-2 rounded-lg text-[#FF5722] bg-[#FF5722]/8 hover:bg-[#FF5722]/15 transition-colors"
            title="جزئیات"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Status dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              disabled={updating}
              className="p-2 rounded-lg text-[#1A1410]/40 hover:text-[#FF5722] hover:bg-[#FF5722]/8 transition-colors disabled:opacity-50"
              title="تغییر وضعیت"
            >
              {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute left-0 top-full mt-1 bg-white rounded-xl border border-[#1A1410]/10 shadow-xl p-1 z-20 min-w-[160px]">
                  {STATUS_ORDER.map((s) => {
                    const c = STATUS_CONFIG[s];
                    const Icon = c.icon;
                    const isCurrent = request.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => { onUpdateStatus(request.id, s); setMenuOpen(false); }}
                        disabled={isCurrent}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-right transition-colors ${
                          isCurrent
                            ? "bg-[#FF5722]/5 text-[#FF5722] cursor-default"
                            : "hover:bg-[#1A1410]/5 text-[#1A1410]/70"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${c.color}`} />
                        {c.label}
                        {isCurrent && <CheckCircle2 className="w-3 h-3 mr-auto" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== Details Modal ====================
function RequestDetailsModal({
  request,
  onClose,
  onUpdateStatus,
  updatingId,
}: {
  request: RepairRequest;
  onClose: () => void;
  onUpdateStatus: (id: string, status: RepairStatus) => void;
  updatingId: string | null;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const config = STATUS_CONFIG[request.status];
  const StatusIcon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl sm:rounded-3xl border border-[#1A1410]/8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#1A1410]/8 p-4 sm:p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#FFA000] flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#1A1410]">
                جزئیات درخواست
              </h2>
              <p className="text-[10px] text-[#1A1410]/40 font-mono" dir="ltr">
                #{request.id.slice(-8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#1A1410]/40 hover:text-[#1A1410] hover:bg-[#1A1410]/5 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between gap-3 p-3 bg-[#FFF9F5] rounded-xl border border-[#1A1410]/8">
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-4 h-4 ${config.color}`} />
              <span className={`text-xs font-bold ${config.color}`}>{config.label}</span>
            </div>
            <select
              value={request.status}
              onChange={(e) => onUpdateStatus(request.id, e.target.value as RepairStatus)}
              disabled={updatingId === request.id}
              className="text-xs font-medium bg-white border border-[#1A1410]/10 rounded-lg px-2 py-1.5 outline-none focus:border-[#FF5722]/40 disabled:opacity-50"
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>

          {/* Contact */}
          <div className="bg-white border border-[#1A1410]/8 rounded-xl p-4 space-y-2">
            <h3 className="text-[11px] font-bold text-[#1A1410]/60 mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#FF5722]" />
              اطلاعات تماس
            </h3>
            <InfoRow label="نام" value={request.name} />
            <InfoRow label="شماره" value={request.phone} dir="ltr" />
            {request.email && <InfoRow label="ایمیل" value={request.email} dir="ltr" />}
            {request.address && <InfoRow label="آدرس" value={request.address} />}
          </div>

          {/* Device */}
          <div className="bg-white border border-[#1A1410]/8 rounded-xl p-4 space-y-2">
            <h3 className="text-[11px] font-bold text-[#1A1410]/60 mb-2 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-[#FF5722]" />
              اطلاعات دستگاه
            </h3>
            <InfoRow label="نوع" value={request.deviceType} />
            {request.brand && <InfoRow label="برند" value={request.brand} />}
            {request.model && <InfoRow label="مدل" value={request.model} />}
          </div>

          {/* Problem */}
          <div className="bg-white border border-[#1A1410]/8 rounded-xl p-4">
            <h3 className="text-[11px] font-bold text-[#1A1410]/60 mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#FF5722]" />
              شرح مشکل
            </h3>
            <p className="text-sm text-[#1A1410] font-medium mb-2">{request.problem}</p>
            {request.description && (
              <p className="text-xs text-[#1A1410]/60 leading-relaxed whitespace-pre-wrap">
                {request.description}
              </p>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#1A1410]/8 rounded-xl p-4 space-y-2">
            <h3 className="text-[11px] font-bold text-[#1A1410]/60 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#FF5722]" />
              زمان‌ها
            </h3>
            <InfoRow label="ثبت" value={formatDate(request.createdAt)} />
            <InfoRow label="آخرین بروزرسانی" value={formatDate(request.updatedAt)} />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#1A1410]/8 p-4 flex gap-2">
          <a
            href={phoneToTel(request.phone)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all"
          >
            <Phone className="w-4 h-4" />
            تماس
          </a>
          <a
            href={phoneToWhatsApp(request.phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            واتس‌اپ
          </a>
        </div>
      </div>
    </div>
  );
}

// ==================== InfoRow ====================
function InfoRow({ label, value, dir }: { label: string; value: string; dir?: "ltr" | "rtl" }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-[#1A1410]/40 flex-shrink-0">{label}:</span>
      <span className="text-[#1A1410] font-medium text-left" dir={dir}>
        {value}
      </span>
    </div>
  );
}