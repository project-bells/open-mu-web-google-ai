import React from 'react'
import { prisma } from "@/lib/prisma"
import { CharacterRanking } from '@/app/_models/character';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from "next/image"
import { getImage } from '@/app/_utils/characterAvatarReturn';
import { TranslatedText } from '@/app/_context/LanguageContext';

export default async function TopPlayers() {
  const characters: CharacterRanking[] = await getTop10Characters();

  return (
    <div className="w-full rounded-xl bg-slate-950/70 border border-slate-800/80 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="font-display text-base font-bold text-slate-100 tracking-wide">
          <TranslatedText th="อันดับตัวละคร" en="Characters Ranking" />
        </h2>
        <span className="text-xs text-slate-400">
          <TranslatedText th="10 อันดับแรก" en="Top 10" />
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-800/60">
            <th className="text-left font-medium pb-2.5 w-8">#</th>
            <th className="text-left font-medium pb-2.5">
              <TranslatedText th="ชื่อตัวละคร" en="Name" />
            </th>
            <th className="text-right font-medium pb-2.5">
              <TranslatedText th="เลเวล" en="Level" />
            </th>
            <th className="text-right font-medium pb-2.5">
              <TranslatedText th="รีเซ็ต" en="Resets" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40">
          {characters.map((c, i) => (
            <tr key={c.Name} className="hover:bg-slate-900/50 transition-colors">
              <td className="py-2.5 font-mono tabular-nums text-xs text-slate-400">{i + 1}</td>
              <td className="py-2.5 font-medium text-slate-200 flex items-center gap-2">
                <Image
                  className="rounded-md border border-slate-700"
                  src={(getImage(c.CharacterClassId) as StaticImport)}
                  width={24}
                  height={24}
                  alt="character_avatar"
                />
                <span className="truncate">{c.Name}</span>
              </td>
              <td className="py-2.5 font-mono tabular-nums text-right text-slate-200">
                {c.lvl}
                <sup className="ml-0.5 text-[10px] text-amber-400">{c.masterlvl}</sup>
              </td>
              <td className="py-2.5 font-mono tabular-nums text-right font-semibold text-amber-400">
                {c.resets}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

async function getTop10Characters () {
  const statAttribute: CharacterRanking[] = 
  await prisma.$queryRaw`SELECT sa."CharacterId", c."Name" , c."CharacterClassId" ,
    MAX(CASE WHEN sa."DefinitionId"  = '89a891a7-f9f9-4ab5-af36-12056e53a5f7' THEN sa."Value"  ELSE 0 END) AS resets,
    MAX(CASE WHEN sa."DefinitionId"  = '560931ad-0901-4342-b7f4-fd2e2fcc0563' THEN sa."Value"  ELSE 0 END) AS lvl,
    MAX(CASE WHEN sa."DefinitionId"  = '70cd8c10-391a-4c51-9aa4-a854600e3a9f' THEN sa."Value"  ELSE 0 END) AS masterlvl
  FROM 
  data."StatAttribute" sa
  inner join data."Character" c   on  sa."CharacterId" = c."Id" 
  GROUP BY sa."CharacterId", c."Name" , c."CharacterClassId"
  ORDER BY resets DESC, lvl desc, masterlvl desc
  limit 10;`
  return statAttribute;                                        
}

