"use client"

import { SyntheticEvent, useState } from "react";
import TopPlayers from "./(tables)/TopPlayers";
import TopGuilds from "./(tables)/TopGuilds";
import TopKillers from "./(tables)/TopKillers";
import OnlinePlayers from "./(tables)/OnlinePlayers";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function Ranking() {
  const [selectedRanking, setSelectedRanking] = useState<string>('topLevel')
  const { lang } = useLanguage();

  const tabs = [
    { id: "topLevel", label: lang === "th" ? "อันดับตัวละคร" : "Top Characters" },
    { id: "topKillers", label: lang === "th" ? "อันดับนักล่า (PK)" : "Top Killers" },
    { id: "topGuilds", label: lang === "th" ? "อันดับกิลด์" : "Top Guilds" },
    { id: "online", label: lang === "th" ? "ผู้เล่นออนไลน์" : "Online Players" },
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
            {lang === "th" ? "ทำเนียบจัดอันดับผู้เล่น" : "Hall of Fame Rankings"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "th"
              ? "ตารางอันดับตัวละคร กิลด์ และนักล่าแบบเรียลไทม์ของเซิร์ฟเวอร์ Mu Origisns S6E3"
              : "Real-time character, guild, and PvP leaderboards"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={tab.id}
              type="button"
              onClick={() => setSelectedRanking(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedRanking === tab.id
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {selectedRanking === 'topLevel' && <TopPlayers />}
      {selectedRanking === 'topGuilds' && <TopGuilds />}
      {selectedRanking === 'topKillers' && <TopKillers />}
      {selectedRanking === 'online' && <OnlinePlayers />}
    </div>
  )
}

