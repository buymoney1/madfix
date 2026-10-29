// src/app/admin/layout-client.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles, Wrench, Menu } from "lucide-react";
import { Session } from "next-auth";
import AdminSidebar from "@/components/admin/Sidebar";

// ==================== Types ====================
interface AdminLayoutClientProps {
  children: React.ReactNode;
  session: Session;
}

// ==================== Decorative ====================
function DecorativeLine({ className = "" }: { className?: string }) {
  return (
    <svg width="50" height="5" viewBox="0 0 50 5" fill="none" className={className}>
      <path
        d="M0,2.5 Q12.5,5 25,2.5 Q37.5,0 50,2.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        className="opacity-40"
      />
    </svg>
  );
}

// ==================== Main Layout ====================
export default function AdminLayoutClient({ children, session }: AdminLayoutClientProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("medfix-admin-sidebar-collapsed");
    if (saved === "true") setSidebarCollapsed(true);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("medfix-admin-sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  const openMobileSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-mobile-sidebar"));
  };

  const userInitial = session.user?.name?.[0]?.toUpperCase() || "م";

  return (
    <div className="min-h-screen bg-[#FFF9F5] selection:bg-[#FF5722]/20 selection:text-[#1A1410] relative font-[vazirmatn,sans-serif]">
      {/* Background texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 25%, #FF5722 1px, transparent 1px),
                            radial-gradient(circle at 85% 75%, #FFA000 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Background blurs */}
      <div className="fixed top-0 right-0 w-[50%] h-[50%] bg-[#FF5722]/[0.03] rounded-full blur-[120px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[40%] h-[40%] bg-[#FFA000]/[0.04] rounded-full blur-[100px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* Top Bar */}
      <header
        className={`sticky top-0 z-30 h-14 bg-white/80 backdrop-blur-xl border-b transition-all duration-300 ${
          scrolled ? "border-[#1A1410]/10 shadow-sm" : "border-[#1A1410]/5"
        } flex items-center justify-between px-4 md:px-6`}
      >
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile menu */}
          <button
            onClick={openMobileSidebar}
            className="lg:hidden w-9 h-9 rounded-lg bg-[#FF5722]/8 hover:bg-[#FF5722]/15 flex items-center justify-center text-[#FF5722] transition-colors"
            aria-label="باز کردن منو"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-2 md:gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#FFA000] shadow-md shadow-[#FF5722]/30 flex items-center justify-center transition-transform group-hover:scale-105">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="h-5 w-px bg-[#1A1410]/10 hidden sm:block" />
            <span className="text-sm font-black text-[#1A1410] tracking-tight hidden sm:block">
              پنل مدیریت مدفیکس
            </span>
            <DecorativeLine className="text-[#FF5722] hidden sm:block" />
          </Link>
        </div>

       
      </header>

      {/* Decorative border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#FF5722]/25 to-transparent" />

      {/* Main with Sidebar */}
      <div className="flex">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          userName={session.user?.name}
          userEmail={session.user?.email}
        />

        <main
          className={`flex-1 transition-all duration-300 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 min-h-[calc(100vh-3.5rem)] ${
            sidebarCollapsed ? "lg:mr-20" : "lg:mr-64"
          }`}
        >
          <div className="bg-white rounded-2xl md:rounded-3xl border border-[#1A1410]/8 shadow-sm shadow-[#FF5722]/5 p-4 md:p-6 lg:p-8 min-h-[calc(100vh-8rem)] relative">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="hidden lg:flex border-t border-[#1A1410]/8 bg-white/60 backdrop-blur-sm px-6 py-2.5 items-center justify-between text-[10px] text-[#1A1410]/40">
        <div className="flex items-center gap-1.5">
          <div className="relative w-4 h-4 rounded-md overflow-hidden">
            <Image src="/logo.png" alt="مدفیکس" fill sizes="16px" className="object-contain" />
          </div>
          <span>مدفیکس شیراز — پنل مدیریت</span>
        </div>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}