"use client"

import React from "react"
import ReturnToHomeButton from "../_components/(sections)/(Section2MainAndRankings)/(components)/ReturnToHomeButton"
import { useLanguage } from "../_context/LanguageContext"

export default function PlayOnlinePage() {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
            Play Online
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "th"
              ? "ระบบเข้าเล่นผ่านเว็บเบราว์เซอร์ Mu Origisns S6E3"
              : "Mu Origisns S6E3 Web Browser Launcher"}
          </p>
        </div>
        <ReturnToHomeButton />
      </div>

      <div className="rounded-xl bg-slate-950/70 border border-amber-500/30 p-12 sm:p-16 flex flex-col items-center justify-center text-center gap-3">
        <span className="text-xs font-bold tracking-widest uppercase text-amber-400">
          Mu Origisns S6E3
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-slate-100 tracking-wide">
          Coming soon..
        </h2>
        <p className="text-sm text-slate-400 max-w-md mt-2 leading-relaxed">
          {lang === "th"
            ? "ระบบ Play Online กำลังอยู่ระหว่างการพัฒนา เตรียมพบกันเร็วๆ นี้! ในระหว่างนี้คุณสามารถดาวน์โหลดตัวเกมเต็มเพื่อเข้าเล่นได้ทันที"
            : "The Play Online feature is currently under development. Stay tuned! In the meantime, you can download the full client to play right away."}
        </p>
      </div>
    </div>
  )
}
