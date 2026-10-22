"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import img from "@/public/img/img-util.jpg";
import { useLanguage } from "@/app/_context/LanguageContext";
import type { ServerSpecItem } from "@/lib/siteConfig";

const defaultSpecs: ServerSpecItem[] = [
  {
    id: "version",
    labelTh: "เวอร์ชันเซิร์ฟเวอร์",
    labelEn: "Server Version",
    valueTh: "Season 6 Episode 3",
    valueEn: "Season 6 Episode 3",
  },
  {
    id: "exp",
    labelTh: "อัตราคูณค่าประสบการณ์ (EXP)",
    labelEn: "Experience Rate",
    valueTh: "x100",
    valueEn: "x100",
  },
  {
    id: "drop_exc",
    labelTh: "อัตราดรอปไอเทมยอดเยี่ยม (Excellent)",
    labelEn: "Drop Rate Excellent",
    valueTh: "50%",
    valueEn: "50%",
  },
  {
    id: "drop_zen",
    labelTh: "อัตราดรอปเงิน (Zen)",
    labelEn: "Drop Rate Zen",
    valueTh: "70%",
    valueEn: "70%",
  },
  {
    id: "party_exp",
    labelTh: "โบนัส EXP ปาร์ตี้",
    labelEn: "Party Bonus Exp",
    valueTh: "25% · 30% · 50%",
    valueEn: "25% · 30% · 50%",
  },
  {
    id: "elf_buff",
    labelTh: "บัฟทหารเอลฟ์ (Elf Soldier)",
    labelEn: "Elf Soldier Buff",
    valueTh: "ถึงเลเวล 250 และ 1 รีเซ็ต",
    valueEn: "Up to Level 250 & 1 Reset",
  },
  {
    id: "conn_limit",
    labelTh: "จำกัดการเชื่อมต่อ",
    labelEn: "Connection Limit",
    valueTh: "สูงสุด 2 จอ ต่อ IP/HWID",
    valueEn: "Max 2 Accounts per IP/HWID",
  },
  {
    id: "npc_shop",
    labelTh: "ร้านค้า NPC",
    labelEn: "NPC Shops",
    valueTh: "ปรับแต่งสมดุลสายคลาสสิก",
    valueEn: "Configured for Low-Exp Progression",
  },
];

export default function Info() {
  const { lang } = useLanguage();
  const [serverInfo, setServerInfo] = useState({
    serverName: "Mu Origisns S6E3",
    specs: defaultSpecs,
    play2WinTitleTh: "แนวทางเซิร์ฟเวอร์ Play2Win",
    play2WinTitleEn: "Play2Win Philosophy",
    play2WinBodyTh:
      "ไม่มีระบบ Web-Shop ขายไอเทมเทพ ไม่มี Cash-Shop เอาเปรียบผู้เล่น มีเพียงระบบ VIP (ไม่มีเซิร์ฟแยก) และเครดิตสำหรับฟีเจอร์เสริมเท่านั้น อุปกรณ์และไอเทมทุกชิ้นหาได้จากการล่าบอส กิจกรรมบุกเมือง และการแลกเปลี่ยนภายในเกมอย่างเท่าเทียม",
    play2WinBodyEn:
      "No Web-Shop, no Cash-Shop, only VIP System (without VIP Server) & Web-Credits for Premium Modules. Every piece of gear is earned through boss hunts, invasions, and in-game trading.",
    introTitleTh: "แนะนำโลกแห่ง Mu Origisns S6E3",
    introTitleEn: "MU Introduction",
    introBodyTh:
      "MU Online เป็นเกมแนว 3D MMORPG แฟนตาซีระดับตำนานจากเกาหลี ที่มีฉากหลังอยู่บนทวีป MU อันกว้างใหญ่ ผู้เล่นสามารถเลือกสายอาชีพ ค้นหาชุดเกราะและปีกสุดอลังการ พร้อมร่วมต่อสู้ในสงครามกิลด์สุดยิ่งใหญ่ในรูปแบบคลาสสิก Season 6 Episode 3",
    introBodyEn:
      "MU Online, produced by Webzen Inc, is a full 3D MMORPG and one of the leading fantasy online role-playing games developed in Korea. Set across the legendary Continent of MU, it established the foundational design of classic 3D isometric action RPGs.",
  });

  const loadConfig = () => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.serverInfo) {
          setServerInfo((prev) => ({
            ...prev,
            ...data.serverInfo,
            specs: Array.isArray(data.serverInfo.specs)
              ? data.serverInfo.specs
              : prev.specs,
          }));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadConfig();
    window.addEventListener("site-config-updated", loadConfig);
    return () => window.removeEventListener("site-config-updated", loadConfig);
  }, []);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
          {lang === "th"
            ? `ข้อมูลเซิร์ฟเวอร์ ${serverInfo.serverName}`
            : `${serverInfo.serverName} Server Information`}
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
        {serverInfo.specs.map((spec) => (
          <div
            key={spec.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800/80"
          >
            <span className="text-sm text-slate-400">
              {lang === "th" ? spec.labelTh : spec.labelEn}
            </span>
            <span className="font-mono tabular-nums text-sm font-bold text-amber-400 text-right">
              {lang === "th" ? spec.valueTh : spec.valueEn}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-amber-400">
          {lang === "th" ? serverInfo.play2WinTitleTh : serverInfo.play2WinTitleEn}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {lang === "th" ? serverInfo.play2WinBodyTh : serverInfo.play2WinBodyEn}
        </p>
      </div>

      <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-3">
        <h2 className="font-display text-lg font-bold text-slate-100">
          {lang === "th" ? serverInfo.introTitleTh : serverInfo.introTitleEn}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {lang === "th" ? serverInfo.introBodyTh : serverInfo.introBodyEn}
        </p>
      </div>
    </div>
  );
}
