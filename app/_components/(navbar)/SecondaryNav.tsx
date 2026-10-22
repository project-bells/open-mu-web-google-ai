"use client"

import Image from "next/image"
import DownloadIcon from "../../../public/img/download.png"
import RegisterIcon from "../../../public/img/register.png"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useLanguage } from "@/app/_context/LanguageContext"
import { Send, Play } from "lucide-react"

export default function SecondaryNav() {
  const router = useRouter();
  const { lang } = useLanguage();

  const [serverInfo, setServerInfo] = useState({
    serverName: "Mu Origisns S6E3",
    taglineTh: "Season 6 Episode 3 · คูณประสบการณ์ x100 · แนว Play-to-Win",
    taglineEn: "Season 6 Episode 3 · x100 Experience · Play-to-Win",
    heroDescriptionTh:
      "สร้างตัวละครสุดแกร่ง พิชิตปราสาทเลือด (Blood Castle) และศึกชิงปราสาท (Castle Siege) พร้อมก้าวสู่อันดับสูงสุดแห่งทวีป MU ในเซิร์ฟเวอร์สุดคลาสสิกที่สมดุล",
    heroDescriptionEn:
      "Forge your character, conquer Blood Castle and Castle Siege, and climb the realm rankings in a balanced classic MMORPG experience.",
    facebookUrl: "https://www.facebook.com/profile.php?id=61595685382415",
    telegramUrl: "https://t.me/muorigins6e3",
    playOnlineEnabled: true,
  });

  const loadConfig = () => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.serverInfo) {
          setServerInfo((prev) => ({ ...prev, ...data.serverInfo }));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadConfig();
    window.addEventListener("site-config-updated", loadConfig);
    return () => window.removeEventListener("site-config-updated", loadConfig);
  }, []);

  const navigate = (location: string) => {
    router.push(location);
  }

  return (
    <section className="w-full py-6 sm:py-10 flex flex-col gap-5">
      <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wider text-amber-400/90 mb-2">
            {lang === "th" ? serverInfo.taglineTh : serverInfo.taglineEn}
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-50 leading-tight">
            {serverInfo.serverName}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            {lang === "th" ? serverInfo.heroDescriptionTh : serverInfo.heroDescriptionEn}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            {serverInfo.playOnlineEnabled && (
              <button
                onClick={() => navigate("/play-online")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors whitespace-nowrap shrink-0 shadow-lg shadow-emerald-500/10"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Online</span>
              </button>
            )}

            <button
              onClick={() => navigate("/download")}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors whitespace-nowrap shrink-0 shadow-lg shadow-amber-500/10"
            >
              <Image src={DownloadIcon} alt="download_icon" width={20} className="w-5 h-5 object-contain" />
              <span>{lang === "th" ? "ดาวน์โหลดเกม" : "Download Client"}</span>
            </button>

            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 font-bold text-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Image src={RegisterIcon} alt="register_icon" width={20} className="w-5 h-5 object-contain" />
              <span>{lang === "th" ? "สมัครสมาชิก" : "Register Account"}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {serverInfo.facebookUrl && (
              <Link
                href={serverInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook Page"
                aria-label="Facebook Page"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1877F2]/20 hover:bg-[#1877F2] border border-[#1877F2]/50 hover:border-[#1877F2] text-slate-100 hover:text-white font-bold text-xs transition-colors whitespace-nowrap shrink-0"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1877F2] text-white font-bold text-xs leading-none">
                  f
                </span>
                <span>Facebook Page</span>
              </Link>
            )}

            {serverInfo.telegramUrl && (
              <Link
                href={serverInfo.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Telegram"
                aria-label="Telegram"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9] border border-[#229ED9]/50 hover:border-[#229ED9] text-slate-100 hover:text-white font-bold text-xs transition-colors whitespace-nowrap shrink-0"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#229ED9] text-white">
                  <Send className="w-3 h-3" />
                </span>
                <span>Telegram</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
