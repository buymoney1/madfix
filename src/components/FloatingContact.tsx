"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, Send, X } from "lucide-react";
import type { ComponentType } from "react";
import InstagramIcon from "@/components/InstagramIcon";

interface ContactLink {
  name: string;
  handle: string;
  ariaLabel: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  gradient: string;
  shadow: string;
}

const CONTACTS: ContactLink[] = [
  {
    name: "اینستاگرام",
    handle: "@madfix.ir",
    ariaLabel: "اینستاگرام مدفیکس - madfix.ir",
    href: "https://instagram.com/madfix.ir",
    icon: InstagramIcon,
    gradient: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    shadow: "shadow-[0_6px_18px_rgba(221,42,123,0.3)]",
  },
  {
    name: "تلگرام",
    handle: "@madfix_ir",
    ariaLabel: "تلگرام مدفیکس - madfix_ir",
    href: "https://t.me/madfix_ir",
    icon: Send,
    gradient: "from-[#229ED9] to-[#1C8AC0]",
    shadow: "shadow-[0_6px_18px_rgba(34,158,217,0.3)]",
  },
];

export default function FloatingContact() {
  const pathname = usePathname();
  const isHiddenPage =
    pathname?.startsWith("/admin") || pathname?.startsWith("/login");

  if (isHiddenPage) {
    return null;
  }

  return <FloatingContactWidget key={pathname ?? "root"} />;
}

function FloatingContactWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.6 }}
      className="fixed bottom-4 right-12 sm:bottom-6 sm:right-14 z-50 flex flex-col items-start gap-3 print:hidden"
      aria-label="راه‌های ارتباطی مدفیکس"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="media-links"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-start gap-2.5"
          >
            <span className="text-[10px] font-bold text-[#1A1410]/45 bg-white/85 backdrop-blur border border-[#1A1410]/8 rounded-full px-3 py-1 shadow-sm">
              با ما در ارتباط باشید
            </span>

            {CONTACTS.map((contact, index) => (
              <motion.a
                key={contact.name}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={contact.ariaLabel}
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 14 }}
                transition={{ duration: 0.18, delay: index * 0.05 }}
                className="group flex items-center gap-3 rounded-full bg-white/95 backdrop-blur border border-[#1A1410]/8 shadow-[0_8px_25px_rgba(26,20,16,0.08)] py-2 pr-2 pl-4 hover:border-[#FF5722]/30 hover:shadow-[0_12px_30px_rgba(255,87,34,0.12)] hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722]/50 focus-visible:ring-offset-2"
              >
                <span
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${contact.gradient} ${contact.shadow} text-white flex items-center justify-center ring-2 ring-white/60 flex-shrink-0`}
                >
                  <contact.icon className="w-5 h-5" />
                </span>
                <span className="flex flex-col items-start min-w-0">
                  <span className="text-xs font-black text-[#1A1410] group-hover:text-[#FF5722] transition-colors">
                    {contact.name}
                  </span>
                  <span
                    className="text-[10px] text-[#1A1410]/40 font-medium tracking-wide"
                    dir="ltr"
                  >
                    {contact.handle}
                  </span>
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <span className="absolute -inset-1 rounded-full bg-gradient-to-l from-[#FF5722] to-[#FFA000] opacity-30 blur-lg pointer-events-none" />
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="media-links"
          aria-label={
            isOpen ? "بستن راه‌های ارتباطی" : "باز کردن راه‌های ارتباطی"
          }
          className={`group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-l from-[#FF5722] to-[#FFA000] text-white shadow-[0_10px_30px_rgba(255,87,34,0.35)] hover:shadow-[0_14px_40px_rgba(255,87,34,0.5)] hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5722] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9F5] transition-all ${
            isOpen ? "ring-2 ring-white/70" : "ring-1 ring-white/30"
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
