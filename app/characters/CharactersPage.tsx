"use client"

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import AddStatsIcon from "@/public/img/account/add-stats.png";
import ClearPkIcon from "@/public/img/account/clear-pk.png";
import ResetStats from "@/public/img/account/reset-stats.png";
import ResetIcon from "@/public/img/account/reset.png";
import AddStatsCard from "./AddStatsCard";
import { useEffect, useState } from "react";
import { getImage } from "@/app/_utils/characterAvatarReturn";
import { CharacterEdit } from "../_models/characterEdit";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/_context/LanguageContext";
import type { CharacterFeatureSettings } from "@/lib/siteConfig";
import { ArrowUpCircle } from "lucide-react";

const defaultCharSettings: CharacterFeatureSettings = {
  pk: { enabled: true, zenCost: 1000000 },
  reset: { enabled: true, zenCost: 5000000, requiredLevel: 400, maxReset: 100 },
  relevel: { enabled: true, zenCost: 2000000, targetLevel: 400 },
  addStats: { enabled: true },
  resetStats: { enabled: true, zenCost: 3000000 },
};

export default function CharactersPage({
  result,
  initialSettings,
}: {
  result: CharacterEdit[];
  initialSettings?: CharacterFeatureSettings;
}) {
  const [characters, setCharacters] = useState([false, false, false, false, false]);
  const [lastClicked, setLastClicked] = useState(-1);
  const [settings, setSettings] = useState<CharacterFeatureSettings>(
    initialSettings || defaultCharSettings
  );
  const { lang } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.characterSettings) {
          setSettings(data.characterSettings);
        }
      })
      .catch(() => {});
  }, []);

  function openStatistic(index: number) {
    const arr = Array(5).fill(false);
    if (lastClicked !== index) {
      arr[index] = true;
      setLastClicked(index);
    } else {
      arr[index] = false;
      setLastClicked(-1);
    }
    setCharacters(arr);
  }

  async function resetCharacter(name: string, clasId: string) {
    const response = await fetch("/api/characters/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, clasId }),
    });
    const body = await response.json();
    if (response.ok) {
      toast.success(body.message);
      router.refresh();
    } else {
      toast.error(body.message);
    }
  }

  async function pkClear(name: string) {
    const response = await fetch("/api/characters/pkclear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = await response.json();
    if (response.ok) {
      toast.success(body.message);
      router.refresh();
    } else {
      toast.error(body.message);
    }
  }

  async function relevelCharacter(name: string) {
    const response = await fetch("/api/characters/relevel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = await response.json();
    if (response.ok) {
      toast.success(body.message);
      router.refresh();
    } else {
      toast.error(body.message);
    }
  }

  async function resetStats(name: string, clasId: string) {
    const response = await fetch("/api/characters/resetStats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, clasId }),
    });
    const body = await response.json();
    if (response.ok) {
      toast.success(body.message);
      openStatistic(-1);
      router.refresh();
    } else {
      toast.error(body.message);
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="border-b border-slate-800/80 pb-4 mb-6">
        <h1 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
          {lang === "th" ? "จัดการตัวละคร" : "Manage Characters"}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th"
            ? "กระจายแต้มสเตตัส รีเซ็ตเลเวล รีเลเวล และล้างสถานะหัวแดง (PK)"
            : "Distribute level-up points, reset levels, relevel, and clear PK status"}
        </p>
      </div>

      {result.length === 0 && (
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-8 text-center">
          <p className="text-slate-300 text-sm font-medium">
            {lang === "th"
              ? "ยังไม่มีตัวละครที่สร้างไว้ในบัญชีนี้ในขณะนี้ (กรุณาเข้าสู่ระบบก่อนใช้งาน)"
              : "There are no created characters on this account at the moment."}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {result?.map((c, i) => (
          <div
            key={c.name}
            className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-5 flex flex-col gap-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src={getImage(c.characterClassId) as StaticImport}
                  alt="character_avatar"
                  width={48}
                  height={48}
                  className="rounded-xl border border-slate-700"
                />
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-100">{c.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono tabular-nums">
                    <span>
                      {lang === "th" ? "รีเซ็ต:" : "Resets:"}{" "}
                      <strong className="text-amber-400">{c.resets}</strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {lang === "th" ? "เลเวล:" : "Lvl:"}{" "}
                      <strong className="text-slate-200">{c.lvl}</strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {lang === "th" ? "มาสเตอร์:" : "Master Lvl:"}{" "}
                      <strong className="text-slate-200">{c.masterlvl}</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {settings.reset?.enabled && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors whitespace-nowrap shrink-0"
                    onClick={() => resetCharacter(c.name, c.characterClassId)}
                  >
                    <Image
                      src={ResetIcon}
                      width={18}
                      alt="reset_icon"
                      className="w-4 h-4 object-contain"
                    />
                    <span>{lang === "th" ? "รีเซ็ตเลเวล (RESET)" : "Reset"}</span>
                  </button>
                )}

                {settings.relevel?.enabled && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition-colors whitespace-nowrap shrink-0"
                    onClick={() => relevelCharacter(c.name)}
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    <span>{lang === "th" ? "รีเลเวล (Relevel)" : "Relevel"}</span>
                  </button>
                )}

                {settings.pk?.enabled && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold text-rose-300 transition-colors whitespace-nowrap shrink-0"
                    onClick={() => pkClear(c.name)}
                  >
                    <Image
                      src={ClearPkIcon}
                      width={18}
                      alt="clear_pk_icon"
                      className="w-4 h-4 object-contain"
                    />
                    <span>{lang === "th" ? "ล้างหัวแดง (PK)" : "PK Clear"}</span>
                  </button>
                )}

                {settings.addStats?.enabled && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 transition-colors whitespace-nowrap shrink-0"
                    onClick={() => openStatistic(i)}
                  >
                    <Image
                      src={AddStatsIcon}
                      width={18}
                      alt="add_stats_icon"
                      className="w-4 h-4 object-contain"
                    />
                    <span>{lang === "th" ? "อัพสเตตัส" : "Add Stats"}</span>
                  </button>
                )}

                {settings.resetStats?.enabled && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors whitespace-nowrap shrink-0"
                    onClick={() => resetStats(c.name, c.characterClassId)}
                  >
                    <Image
                      src={ResetStats}
                      width={18}
                      alt="reset_stats_icon"
                      className="w-4 h-4 object-contain"
                    />
                    <span>{lang === "th" ? "รีเซ็ตสเตตัส" : "Reset Stats"}</span>
                  </button>
                )}
              </div>
            </div>

            {settings.addStats?.enabled && characters[i] && (
              <AddStatsCard characterEdit={c} key={i} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
