"use client"

import React from 'react'
import Image from "next/image"
import img from "@/public/img/img-util.jpg"
import { useLanguage } from "@/app/_context/LanguageContext"

export default function Info() {
  const { lang } = useLanguage();

  const specs =
    lang === "th"
      ? [
          { label: "เวอร์ชันเซิร์ฟเวอร์", value: "Season 6 Episode 3" },
          { label: "อัตราคูณค่าประสบการณ์ (EXP)", value: "x100" },
          { label: "อัตราดรอปไอเทมยอดเยี่ยม (Excellent)", value: "50%" },
          { label: "อัตราดรอปเงิน (Zen)", value: "70%" },
          { label: "โบนัส EXP ปาร์ตี้", value: "25% · 30% · 50%" },
          { label: "บัฟทหารเอลฟ์ (Elf Soldier)", value: "ถึงเลเวล 250 และ 1 รีเซ็ต" },
          { label: "จำกัดการเชื่อมต่อ", value: "สูงสุด 2 จอ ต่อ IP/HWID" },
          { label: "ร้านค้า NPC", value: "ปรับแต่งสมดุลสายคลาสสิก" },
        ]
      : [
          { label: "Server Version", value: "Season 6 Episode 3" },
          { label: "Experience Rate", value: "x100" },
          { label: "Drop Rate Excellent", value: "50%" },
          { label: "Drop Rate Zen", value: "70%" },
          { label: "Party Bonus Exp", value: "25% · 30% · 50%" },
          { label: "Elf Soldier Buff", value: "Up to Level 250 & 1 Reset" },
          { label: "Connection Limit", value: "Max 2 Accounts per IP/HWID" },
          { label: "NPC Shops", value: "Configured for Low-Exp Progression" },
        ];

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
          {lang === "th" ? "ข้อมูลเซิร์ฟเวอร์ Mu Origisns S6E3" : "Mu Origisns S6E3 Server Information"}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th"
            ? "รายละเอียดอัตราคูณ ระบบการเล่น และการตั้งค่าภายในเซิร์ฟเวอร์"
            : "Realm rates, progression mechanics, and gameplay configuration"}
        </p>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 relative">
        <Image className="w-full h-56 sm:h-72 object-cover" src={img} alt="img_mu_online" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80"
          >
            <span className="text-sm text-slate-400">{spec.label}</span>
            <span className="font-mono tabular-nums text-sm font-bold text-amber-400 text-right">
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-amber-400">
          {lang === "th" ? "แนวทางเซิร์ฟเวอร์ Play2Win" : "Play2Win Philosophy"}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          {lang === "th"
            ? "ไม่มีระบบ Web-Shop ขายไอเทมเทพ ไม่มี Cash-Shop เอาเปรียบผู้เล่น มีเพียงระบบ VIP (ไม่มีเซิร์ฟแยก) และเครดิตสำหรับฟีเจอร์เสริมเท่านั้น อุปกรณ์และไอเทมทุกชิ้นหาได้จากการล่าบอส กิจกรรมบุกเมือง และการแลกเปลี่ยนภายในเกมอย่างเท่าเทียม"
            : "No Web-Shop, no Cash-Shop, only VIP System (without VIP Server) & Web-Credits for Premium Modules. Every piece of gear is earned through boss hunts, invasions, and in-game trading."}
        </p>
      </div>

      <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-slate-100">
          {lang === "th" ? "แนะนำโลกแห่ง Mu Origisns S6E3" : "MU Introduction"}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          {lang === "th"
            ? "MU Online เป็นเกมแนว 3D MMORPG แฟนตาซีระดับตำนานจากเกาหลี ที่มีฉากหลังอยู่บนทวีป MU อันกว้างใหญ่ ผู้เล่นสามารถเลือกสายอาชีพ ค้นหาชุดเกราะและปีกสุดอลังการ พร้อมร่วมต่อสู้ในสงครามกิลด์สุดยิ่งใหญ่ในรูปแบบคลาสสิก Season 6 Episode 3"
            : "MU Online, produced by Webzen Inc, is a full 3D MMORPG and one of the leading fantasy online role-playing games developed in Korea. Set across the legendary Continent of MU, it established the foundational design of classic 3D isometric action RPGs."}
        </p>
      </div>
    </div>
  )
}

