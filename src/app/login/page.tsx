// src/app/login/page.tsx
"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Wrench, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// ==================== Loading Fallback ====================
function LoginFallback() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-0 right-0 w-[70%] h-[70%] bg-[#FF5722]/8 rounded-full blur-[180px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[60%] h-[60%] bg-[#FFA000]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-8 border border-[#FF5722]/15 relative z-10">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#FFA000] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF5722]/25">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#1A1410]">ورود ادمین</h1>
          <p className="text-sm text-[#1A1410]/50 mt-1">پنل مدیریت مدفیکس</p>
        </div>
        <div className="space-y-4">
          <div className="w-full h-11 bg-[#FF5722]/8 rounded-xl animate-pulse" />
          <div className="w-full h-11 bg-[#FF5722]/8 rounded-xl animate-pulse" />
          <div className="w-full h-11 bg-gradient-to-l from-[#FF5722]/30 to-[#FFA000]/30 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ==================== Login Form ====================
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    const loadingToast = toast.loading("در حال ورود...");

    try {
      const result = await signIn("credentials", {
        email: identifier.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        const msg = "ایمیل/نام کاربری یا رمز عبور اشتباهه";
        setError(msg);
        toast.error(msg, { id: loadingToast });
      } else {
        toast.success("خوش اومدی!", { id: loadingToast });
        const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("خطا در ارتباط با سرور، دوباره تلاش کن");
      toast.error("خطا در ارتباط با سرور", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] font-[vazirmatn,sans-serif] flex items-center justify-center p-4 relative overflow-hidden text-right text-[#1A1410]">
      {/* Background */}
      <div className="fixed top-0 right-0 w-[70%] h-[70%] bg-[#FF5722]/8 rounded-full blur-[180px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[60%] h-[60%] bg-[#FFA000]/10 rounded-full blur-[150px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6 sm:p-8 border border-[#FF5722]/15 relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#FFA000] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF5722]/25">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#1A1410]">ورود ادمین</h1>
          <p className="text-sm text-[#1A1410]/50 mt-1">پنل مدیریت مدفیکس شیراز</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A1410]/70 mb-1.5 mr-1">
              ایمیل یا نام کاربری
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (error) setError("");
              }}
              placeholder="madfix یا admin@medfixshiraz.ir"
              dir="ltr"
              required
              autoComplete="username"
              autoFocus
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl border border-[#1A1410]/10 bg-[#FFF9F5] outline-none text-left text-sm transition-all focus:border-[#FF5722]/50 focus:bg-white focus:ring-4 focus:ring-[#FF5722]/10 placeholder:text-[#1A1410]/30 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1410]/70 mb-1.5 mr-1">
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="••••••••"
              dir="ltr"
              required
              autoComplete="current-password"
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl border border-[#1A1410]/10 bg-[#FFF9F5] outline-none text-left text-sm transition-all focus:border-[#FF5722]/50 focus:bg-white focus:ring-4 focus:ring-[#FF5722]/10 placeholder:text-[#1A1410]/30 disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 border border-red-100 py-2.5 px-3 rounded-xl font-medium">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-l from-[#FF5722] to-[#FFA000] hover:from-[#F4511E] hover:to-[#FF8F00] text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#FF5722]/25 hover:shadow-xl hover:shadow-[#FF5722]/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال ورود...
              </>
            ) : (
              "ورود به پنل"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#1A1410]/8 text-center space-y-2">
          <p className="text-[10px] text-[#1A1410]/40">
            فقط ادمین‌های مدفیکس مجاز به ورود هستن
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] text-[#FF5722] hover:text-[#F4511E] font-bold transition-colors"
          >
            <ArrowRight className="w-3 h-3" />
            <span>بازگشت به سایت</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// ==================== Main Page ====================
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}