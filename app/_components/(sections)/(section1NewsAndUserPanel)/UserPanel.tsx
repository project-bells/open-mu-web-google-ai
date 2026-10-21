"use client"
import Image from "next/image"
import AccountIcon from "@/public/img/account/account.png"
import ResetIcon from "@/public/img/account/reset.png"
import { signOut } from "next-auth/react"
import Link from "next/link"
import AddNews from "@/public/img/account/add-news.png"
import { useEffect } from "react"
import { useLanguage } from "@/app/_context/LanguageContext"

export default function UserPanel({ role }: { role: string }) {
  const { lang } = useLanguage();

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role])

  const isGm = role === "GAME_MASTER";

  function onSignOut() {
    localStorage.removeItem("role");
    signOut();
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="border-b border-slate-800/80 pb-3">
        <h3 className="font-display text-lg font-bold text-slate-100">
          {lang === "th" ? "ศูนย์ควบคุมผู้เล่น" : "Command Center"}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {lang === "th" ? "สถานะ" : "Role"} ·{" "}
          <span className="text-amber-400 font-medium">
            {isGm
              ? lang === "th"
                ? "เกมมาสเตอร์ (GM)"
                : "Game Master"
              : lang === "th"
              ? "ผู้เล่นทั่วไป"
              : "Player"}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Link
          href="/account"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 text-sm font-medium text-slate-200 hover:text-amber-400 transition-colors"
        >
          <Image src={AccountIcon} width={22} alt="account_icon" className="w-5 h-5 object-contain" />
          <span>{lang === "th" ? "ตั้งค่าบัญชี" : "Account Settings"}</span>
        </Link>

        <Link
          href="/characters"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 text-sm font-medium text-slate-200 hover:text-amber-400 transition-colors"
        >
          <Image src={ResetIcon} width={22} alt="character_icon" className="w-5 h-5 object-contain" />
          <span>{lang === "th" ? "จัดการตัวละคร" : "Manage Characters"}</span>
        </Link>

        {isGm && (
          <Link
            href="/admin/news"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 text-sm font-medium text-slate-200 hover:text-amber-400 transition-colors"
          >
            <Image src={AddNews} width={22} alt="add_news_icon" className="w-5 h-5 object-contain" />
            <span>{lang === "th" ? "ประกาศข่าวสาร" : "Publish News"}</span>
          </Link>
        )}
      </div>

      <button
        className="mt-2 w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-sm font-bold text-slate-200 hover:text-red-300 transition-colors"
        onClick={() => onSignOut()}
      >
        {lang === "th" ? "ออกจากระบบ" : "Sign Out"}
      </button>
    </div>
  )
}

