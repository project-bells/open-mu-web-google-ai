"use client"

import { CharacterRanking } from "@/app/_models/character";
import { useEffect, useState } from "react";
import Image from "next/image"
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { getImage } from "@/app/_utils/characterAvatarReturn";
import { toast } from "react-toastify";
import { useLanguage } from "@/app/_context/LanguageContext";

export default function TopPlayers() {
  const [characters, setCharacters]= useState<CharacterRanking[]>([])
  const { lang } = useLanguage();

  //cals the top players api
  useEffect(() => {
    async function fetchData() {
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL || ""}/api/characters/ranking/reset`);
        const res = await response.json();
        setCharacters(Array.isArray(res) ? res : []);
      }catch (e) {
        toast.error("There was a problem! Try again later")
      }
    }
    fetchData();
  }, [])

  return (
    <div className="w-full rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-900/90 text-xs text-slate-400 border-b border-slate-800">
          <tr>
            <th className="text-left font-medium py-3.5 pl-4 w-12">#</th>
            <th className="text-left font-medium py-3.5">
              {lang === "th" ? "ตัวละคร" : "Character"}
            </th>
            <th className="text-right font-medium py-3.5">
              {lang === "th" ? "เลเวล" : "Level"}
            </th>
            <th className="text-right font-medium py-3.5">
              {lang === "th" ? "มาสเตอร์เลเวล" : "Master Level"}
            </th>
            <th className="text-right font-medium py-3.5 pr-4">
              {lang === "th" ? "รีเซ็ต" : "Resets"}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {characters.map((c, i) => (
            <tr key={c.Name} className="hover:bg-slate-900/40 transition-colors">
              <td className="py-3 pl-4 font-mono tabular-nums text-xs text-slate-400">{i + 1}</td>
              <td className="py-3 font-medium text-slate-100 flex items-center gap-3">
                <Image
                  className="rounded-lg border border-slate-700"
                  src={(getImage(c.CharacterClassId) as StaticImport)}
                  width={32}
                  height={32}
                  alt="character_avatar"
                />
                <span>{c.Name}</span>
              </td>
              <td className="py-3 font-mono tabular-nums text-right text-slate-200">{c.lvl}</td>
              <td className="py-3 font-mono tabular-nums text-right text-slate-300">{c.masterlvl}</td>
              <td className="py-3 pr-4 font-mono tabular-nums text-right font-bold text-amber-400">{c.resets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}




