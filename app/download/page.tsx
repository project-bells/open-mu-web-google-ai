"use client"

import Image from "next/image";
import google from "@/public/img/download/google.png";
import mediafire from "@/public/img/download/mediafire.png";
import mega from "@/public/img/download/mega.png";
import netframework from "@/public/img/download/netframework.png";
import visual from "@/public/img/download/visual.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/app/_context/LanguageContext";
import { ExternalLink } from "lucide-react";

function sanitizeEnvLink(val?: string): string {
  if (!val) return "";
  const cleaned = val.trim().replace(/^["']+|["']+$/g, "").trim();
  return cleaned === ">" ? "" : cleaned;
}

export default function Download() {
  const { lang } = useLanguage();

  const [links, setLinks] = useState({
    discord: sanitizeEnvLink(process.env.NEXT_PUBLIC_DISCORD_LINK),
    gd: sanitizeEnvLink(process.env.NEXT_PUBLIC_GOODLE_DRIVE_LINK),
    mf: sanitizeEnvLink(
      process.env.NEXT_PUBLIC_MEDIAFIRE_LINK ||
        "https://www.mediafire.com/file/y0cu54tjwrp1ppl/MuOrigins-Client.rar/file"
    ),
    mega: sanitizeEnvLink(
      process.env.NEXT_PUBLIC_MEGA_LINK ||
        "https://mega.nz/file/zlBEhYLB#MgmpfUPV02ylIy_S_oIbMaXa77uwa6dwke4SFaQAB2Q"
    ),
  });

  useEffect(() => {
    fetch("/api/downloads", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setLinks({
          discord: sanitizeEnvLink(data.NEXT_PUBLIC_DISCORD_LINK),
          gd: sanitizeEnvLink(data.NEXT_PUBLIC_GOODLE_DRIVE_LINK),
          mf: sanitizeEnvLink(data.NEXT_PUBLIC_MEDIAFIRE_LINK),
          mega: sanitizeEnvLink(data.NEXT_PUBLIC_MEGA_LINK),
        });
      })
      .catch(() => {});
  }, []);

  const gdLink = links.gd;
  const mfLink = links.mf;
  const megaLink = links.mega;
  const discordLink = links.discord;

  const hasCustomMirrors =
    gdLink !== "" || mfLink !== "" || megaLink !== "" || discordLink !== "";

  return (
    <div className="flex flex-col gap-10 w-full">
      <div>
        <div className="border-b border-slate-800/80 pb-4 mb-6">
          <h2 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
            {lang === "th" ? "ดาวน์โหลดตัวเกม (Client Downloads)" : "Client Downloads"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "th"
              ? "ดาวน์โหลดตัวเกม Mu Origisns S6E3 ตัวเต็มฟรี เลือกช่องทางที่สะดวกด้านล่าง"
              : "Download the full Mu Origisns S6E3 client for free"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {hasCustomMirrors ? (
            <>
              {gdLink !== "" && (
                <a
                  href={gdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all"
                >
                  <Image src={google} width={160} quality={100} alt="google_drive" />
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-400 group-hover:text-amber-300 font-medium">
                    {lang === "th" ? "ดาวน์โหลดผ่าน Google Drive" : "Download via Google Drive"}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              )}
              {mfLink !== "" && (
                <a
                  href={mfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all"
                >
                  <Image src={mediafire} width={160} quality={100} alt="mediafire" />
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-400 group-hover:text-amber-300 font-medium">
                    {lang === "th" ? "ดาวน์โหลดผ่าน MediaFire" : "Download via MediaFire"}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              )}
              {megaLink !== "" && (
                <a
                  href={megaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all"
                >
                  <Image src={mega} width={160} quality={100} alt="mega" />
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-400 group-hover:text-amber-300 font-medium">
                    {lang === "th" ? "ดาวน์โหลดผ่าน MEGA" : "Download via MEGA"}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              )}
              {discordLink !== "" && (
                <a
                  href={discordLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all"
                >
                  <span className="font-display text-base font-bold text-slate-100">
                    Discord
                  </span>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-amber-400 group-hover:text-amber-300 font-medium">
                    {lang === "th" ? "ดาวน์โหลดผ่าน Discord" : "Download via Discord"}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </a>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <Image src={google} width={150} quality={100} alt="google_drive" />
                <span className="mt-2 text-xs text-slate-400">
                  {lang === "th" ? "ลิงก์สำรอง Google Drive" : "Google Drive Mirror"}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <Image src={mediafire} width={150} quality={100} alt="mediafire" />
                <span className="mt-2 text-xs text-slate-400">
                  {lang === "th" ? "ลิงก์สำรอง MediaFire" : "MediaFire Mirror"}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <Image src={mega} width={150} quality={100} alt="mega" />
                <span className="mt-2 text-xs text-slate-400">
                  {lang === "th" ? "ลิงก์สำรอง MEGA" : "MEGA Mirror"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div>
        <div className="border-b border-slate-800/80 pb-4 mb-6">
          <h2 className="font-display text-xl font-bold text-slate-100 tracking-wide">
            {lang === "th" ? "โปรแกรมเสริมและไดรเวอร์ที่จำเป็น" : "Required Utilities & Drivers"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "th"
              ? "กรุณาติดตั้งชุดโปรแกรมรันไทม์ล่าสุดเพื่อให้เข้าเล่นเกมได้อย่างราบรื่น"
              : "Make sure you install the latest runtime packages for smooth performance"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="https://dotnet.microsoft.com/en-us/download"
            target="_blank"
            className="flex items-center justify-center p-5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-colors"
          >
            <Image src={netframework} width={160} quality={100} alt="dotnet" />
          </Link>
          <Link
            href="https://dotnet.microsoft.com/en-us/download"
            target="_blank"
            className="flex items-center justify-center p-5 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-colors"
          >
            <Image src={visual} width={160} quality={100} alt="visual_cpp" />
          </Link>
        </div>
      </div>

      <div>
        <div className="border-b border-slate-800/80 pb-4 mb-6">
          <h2 className="font-display text-xl font-bold text-slate-100 tracking-wide">
            {lang === "th" ? "ความต้องการของระบบ (System Requirements)" : "System Requirements"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === "th"
              ? "ตรวจสอบสเปกคอมพิวเตอร์ขั้นต่ำและสเปกแนะนำสำหรับการเล่นเกม"
              : "Check if your hardware meets the recommended specifications"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/90 text-xs text-slate-400 border-b border-slate-800">
              <tr>
                <th className="text-left font-medium py-3.5 px-5">
                  {lang === "th" ? "อุปกรณ์" : "Component"}
                </th>
                <th className="text-left font-medium py-3.5 px-5">
                  {lang === "th" ? "สเปกขั้นต่ำ" : "Minimum Requirements"}
                </th>
                <th className="text-left font-medium py-3.5 px-5">
                  {lang === "th" ? "สเปกแนะนำ" : "Recommended Requirements"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-200">
              <tr>
                <td className="py-3 px-5 font-medium text-slate-300">
                  {lang === "th" ? "ระบบปฏิบัติการ (OS)" : "Operating System"}
                </td>
                <td className="py-3 px-5">Windows XP</td>
                <td className="py-3 px-5 text-amber-400">Windows 10 / 11</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-slate-300">
                  {lang === "th" ? "หน่วยประมวลผล (CPU)" : "Processor"}
                </td>
                <td className="py-3 px-5 font-mono tabular-nums">Pentium 3 700Mhz</td>
                <td className="py-3 px-5 font-mono tabular-nums text-amber-400">Pentium 4 2.0Ghz+</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-slate-300">
                  {lang === "th" ? "หน่วยความจำ (RAM)" : "System Memory"}
                </td>
                <td className="py-3 px-5 font-mono tabular-nums">1 GB</td>
                <td className="py-3 px-5 font-mono tabular-nums text-amber-400">4 GB</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-slate-300">
                  {lang === "th" ? "การ์ดจอ (GPU)" : "Video Card"}
                </td>
                <td className="py-3 px-5 font-mono tabular-nums">
                  {lang === "th" ? "128 MB ขึ้นไป" : "128 MB or higher"}
                </td>
                <td className="py-3 px-5 font-mono tabular-nums text-amber-400">
                  {lang === "th" ? "128 MB ขึ้นไป" : "128 MB or higher"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-slate-300">
                  {lang === "th" ? "เวอร์ชัน DirectX" : "DirectX Version"}
                </td>
                <td className="py-3 px-5 font-mono tabular-nums">DirectX 8.1a</td>
                <td className="py-3 px-5 font-mono tabular-nums text-amber-400">DirectX 9.0c</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-slate-300">
                  {lang === "th" ? "พื้นที่จัดเก็บข้อมูล" : "Hard Disk Space"}
                </td>
                <td className="py-3 px-5 font-mono tabular-nums">1 GB</td>
                <td className="py-3 px-5 font-mono tabular-nums text-amber-400">1 GB</td>
              </tr>
              <tr>
                <td className="py-3 px-5 font-medium text-slate-300">
                  {lang === "th" ? "เวอร์ชัน Framework" : "Framework Version"}
                </td>
                <td className="py-3 px-5 font-mono tabular-nums">.NET Framework 7</td>
                <td className="py-3 px-5 font-mono tabular-nums text-amber-400">.NET Framework 7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

