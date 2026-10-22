"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useLanguage } from "@/app/_context/LanguageContext"
import type { MenuItemConfig } from "@/lib/siteConfig"
import { Shield } from "lucide-react"

const defaultMenus: MenuItemConfig[] = [
  { id: "home", labelTh: "หน้าแรก", labelEn: "Home", href: "/", enabled: true },
  { id: "info", labelTh: "ข้อมูลเซิร์ฟเวอร์", labelEn: "Server Info", href: "/info", enabled: true },
  { id: "ranking", labelTh: "จัดอันดับ", labelEn: "Rankings", href: "/ranking", enabled: true },
  { id: "download", labelTh: "ดาวน์โหลด", labelEn: "Download", href: "/download", enabled: true },
  { id: "register", labelTh: "สมัครสมาชิก", labelEn: "Register", href: "/register", enabled: true },
];

export default function Navbar() {
  const { lang } = useLanguage();
  const [menus, setMenus] = useState<MenuItemConfig[]>(defaultMenus);
  const [serverName, setServerName] = useState("Mu Origisns S6E3");
  const [isAdmin, setIsAdmin] = useState(false);

  const loadConfig = () => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.menus)) {
          setMenus(data.menus);
        }
        if (data?.serverInfo?.serverName) {
          setServerName(data.serverInfo.serverName);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadConfig();
    setIsAdmin(localStorage.getItem("role") === "GAME_MASTER");

    const handleUpdate = () => {
      loadConfig();
      setIsAdmin(localStorage.getItem("role") === "GAME_MASTER");
    };
    window.addEventListener("site-config-updated", handleUpdate);
    return () => window.removeEventListener("site-config-updated", handleUpdate);
  }, []);

  const visibleMenus = menus.filter((m) => m.enabled);

  return (
    <header className="relative z-20 w-full border-b border-slate-800/80 bg-[#090D16]/85 backdrop-blur-md">
      <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-wide text-amber-400 whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors"
        >
          {serverName}
        </Link>

        <nav className="flex flex-wrap items-center gap-6 sm:gap-8 text-sm font-medium text-slate-300">
          {visibleMenus.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {lang === "th" ? item.labelTh : item.labelEn}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-bold text-xs transition-colors whitespace-nowrap shrink-0"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === "th" ? "จัดการระบบ (Admin)" : "Admin Panel"}</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
