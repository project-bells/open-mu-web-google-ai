"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import OnlineStatus from "../../../../public/img/online.png"
import OfflineStatus from "../../../../public/img/offline.png"
import { ServerStatus } from '@/app/_models/serverStatus';
import { useLanguage } from '@/app/_context/LanguageContext';

export default function ServerStatistics() {
  const [status, setStatus] = useState<ServerStatus>();
  const { lang } = useLanguage();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const fetchData = await fetch("/api/status");
        if (fetchData.ok) {
          setStatus(await fetchData.json())
        }
      } catch (e) {
        console.log("Couldn't connect to the gameserver, make sure the GAMESERVER_URL is set correctly(serverStats)");
      }
    }
    checkStatus();
  }, []);

  const isOnline = status?.state === "Online";

  return (
    <div className="w-full rounded-xl bg-slate-950/70 border border-slate-800/80 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <h2 className="font-display text-base font-bold text-slate-100 tracking-wide">
          {lang === "th" ? "สถานะเซิร์ฟเวอร์" : "Server Status"}
        </h2>
        <span className="text-xs text-slate-400">Season 6 Ep 3</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Image
            src={isOnline ? OnlineStatus : OfflineStatus}
            alt="online_status"
            width={20}
            className="w-5 h-5 object-contain"
          />
          <span className="text-sm font-bold text-slate-200">Mu Origisns S6E3</span>
        </div>
        <span className={`text-xs font-bold ${isOnline ? "text-emerald-400" : "text-slate-400"}`}>
          {isOnline
            ? lang === "th" ? "ออนไลน์" : "Online"
            : lang === "th" ? "ออฟไลน์" : "Offline"}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-sm">
        <span className="text-slate-400">
          {lang === "th" ? "ผู้เล่นออนไลน์" : "Online Players"}
        </span>
        <span className="font-mono tabular-nums font-bold text-amber-400 text-base">
          {status?.players || 0}
        </span>
      </div>
    </div>
  )
}

