"use client"

import Link from "next/link"
import { useLanguage } from "@/app/_context/LanguageContext"

export default function Navbar() {
  const { lang, setLang } = useLanguage();

  return (
    <header className="relative z-20 w-full border-b border-slate-800/80 bg-[#090D16]/85 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8 px-6 py-4">
        <Link href="/" className="font-display text-xl font-bold tracking-wide text-amber-400 whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors">
          Mu Origisns S6E3
        </Link>

        <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            {lang === "th" ? "หน้าแรก" : "Home"}
          </Link>
          <Link href="/info" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            {lang === "th" ? "ข้อมูลเซิร์ฟเวอร์" : "Server Info"}
          </Link>
          <Link href="/ranking" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            {lang === "th" ? "จัดอันดับ" : "Rankings"}
          </Link>
          <Link href="/download" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            {lang === "th" ? "ดาวน์โหลด" : "Download"}
          </Link>
          <Link href="/register" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
            {lang === "th" ? "สมัครสมาชิก" : "Register"}
          </Link>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0"
            title={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
          >
            {lang === "th" ? "TH · ภาษาไทย (เปลี่ยนเป็น EN)" : "EN · English (Switch to TH)"}
          </button>
        </div>
      </div>
    </header>
  )
}

