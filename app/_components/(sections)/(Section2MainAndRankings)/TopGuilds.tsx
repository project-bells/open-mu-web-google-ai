import {prisma} from '@/lib/prisma'
import { Guild } from '@prisma/client'
import { TranslatedText } from '@/app/_context/LanguageContext'

export default async function TopGuilds() {
  const guilds: Guild[] = await getTop5Guilds();

  return (
    <div className="w-full rounded-xl bg-slate-950/70 border border-slate-800/80 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="font-display text-base font-bold text-slate-100 tracking-wide">
          <TranslatedText th="อันดับกิลด์" en="Guilds Ranking" />
        </h2>
        <span className="text-xs text-slate-400">
          <TranslatedText th="5 อันดับแรก" en="Top 5" />
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-slate-400 border-b border-slate-800/60">
            <th className="text-left font-medium pb-2.5 w-8">#</th>
            <th className="text-left font-medium pb-2.5">
              <TranslatedText th="ชื่อกิลด์" en="Guild" />
            </th>
            <th className="text-right font-medium pb-2.5">
              <TranslatedText th="คะแนน" en="Score" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/40">
          {guilds.map((g, i) => (
            <tr key={g.Name} className="hover:bg-slate-900/50 transition-colors">
              <td className="py-2.5 font-mono tabular-nums text-xs text-slate-400">{i + 1}</td>
              <td className="py-2.5 font-medium text-slate-200">{g.Name}</td>
              <td className="py-2.5 font-mono tabular-nums text-right font-semibold text-amber-400">
                {g.Score}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

async function getTop5Guilds() {
  const guilds: Guild[] = await prisma.guild.findMany({
    take: 5,
    orderBy: {
      Score: "desc"
    }
  })
  return guilds;
}


