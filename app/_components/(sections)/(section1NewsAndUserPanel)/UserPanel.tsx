"use client"
import Image from "next/image"
import AccountIcon from "@/public/img/account/account.png"
import ResetIcon from "@/public/img/account/reset.png"
import { signOut } from "next-auth/react"
import Link from "next/link"
import AddNews from "@/public/img/account/add-news.png"
import { useEffect } from "react"
import { useLanguage } from "@/app/_context/LanguageContext"
import { Shield } from "lucide-react"

export default function UserPanel({ role }: { role: string }) {
  const { lang } = useLanguage();

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role])

  const isGm = role === "GAME_MASTER";

  function onSignOut() {
    localStorage.removeItem("role");
    signOut({ callbackUrl: "/" });
  }

  return (
    <div className="flex flex-col w-full gap-3.5">
      <div className="border-b border-slate-800/80 pb-3">
        <h3 className="font-display text-lg font-bold text-slate-100">
          {lang === "th" ? "ศูนย์ควบคุมผู้เล่น" : "Command Center"}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {lang === "th" ? "สถานะ" : "Role"} ·{" "}
          <span className="text-amber-400 font-bold">
            {isGm
              ? lang === "th"
                ? "ผู้ดูแลระบบ (Admin / GM)"
                : "Administrator / GM"
              : lang === "th"
              ? "ผู้เล่นทั่วไป"
              : "Player"}
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {isGm && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors shadow-md shadow-amber-500/10"
          >
            <Shield className="w-5 h-5 shrink-0" />
            <span>{lang === "th" ? "ระบบจัดการแอดมิน (Admin Panel)" : "Admin Management Panel"}</span>
          </Link>
        )}

        <Link
          href="/characters"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 text-sm font-medium text-slate-200 hover:text-amber-400 transition-colors"
        >
          <Image src={ResetIcon} width={22} alt="character_icon" className="w-5 h-5 object-contain" />
          <span>{lang === "th" ? "จัดการตัวละคร (PK / Reset / Relevel)" : "Manage Characters"}</span>
        </Link>

        <Link
          href="/account"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 text-sm font-medium text-slate-200 hover:text-amber-400 transition-colors"
        >
          <Image src={AccountIcon} width={22} alt="account_icon" className="w-5 h-5 object-contain" />
          <span>{lang === "th" ? "ตั้งค่าบัญชี" : "Account Settings"}</span>
        </Link>

        {isGm && (
          <Link
            href="/admin?tab=news"
            className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-800/90 text-xs font-medium text-slate-300 hover:text-amber-400 transition-colors"
          >
            <Image src={AddNews} width={18} alt="add_news_icon" className="w-4 h-4 object-contain" />
            <span>{lang === "th" ? "จัดการข่าวสารและประกาศ" : "Manage News"}</span>
          </Link>
        )}
      </div>

      <button
        className="mt-1 w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 text-xs font-bold text-slate-200 hover:text-red-300 transition-colors"
        onClick={() => onSignOut()}
      >
        {lang === "th" ? "ออกจากระบบ" : "Sign Out"}
      </button>
    </div>
  )
}
