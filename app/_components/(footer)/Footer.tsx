"use client"

import Link from "next/link"
import { useLanguage } from "@/app/_context/LanguageContext"
import { Send } from "lucide-react"

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="relative z-10 w-full mt-auto border-t border-slate-800/80 bg-[#070A12] overflow-hidden">
      <div className="absolute inset-0 bg-[url('~/public/img/bg-footer.jpg')] bg-bottom bg-cover bg-no-repeat opacity-15 pointer-events-none" />
      <div className="relative max-w-[1280px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-sm text-slate-400">
        <div>
          <p className="font-display font-bold text-slate-200 tracking-wide">© Mu Origisns S6E3</p>
          <p className="mt-1 text-xs text-slate-500">
            {lang === "th"
              ? "เว็บไซต์นี้ไม่มีส่วนเกี่ยวข้องหรือได้รับการรับรองจาก Webzen Inc."
              : "This site is in no way associated with or endorsed by Webzen Inc."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
          <Link href="/terms-and-conditions" className="hover:text-amber-400 transition-colors">
            {lang === "th" ? "ข้อกำหนดและเงื่อนไข" : "Terms and Conditions"}
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="https://www.facebook.com/profile.php?id=61595685382415"
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook Page"
            aria-label="Facebook Page"
            className="inline-flex items-center gap-1.5 hover:text-[#4599FF] transition-colors"
          >
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#1877F2] text-white font-bold text-[10px] leading-none">
              f
            </span>
            <span>Facebook</span>
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="https://t.me/muorigins6e3"
            target="_blank"
            rel="noopener noreferrer"
            title="Telegram"
            aria-label="Telegram"
            className="inline-flex items-center gap-1.5 hover:text-[#38B2F6] transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-[#229ED9]" />
            <span>Telegram</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}

