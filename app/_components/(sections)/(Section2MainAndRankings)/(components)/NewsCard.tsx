"use client"
import NewsComplete from '@/app/_models/NewsComplete'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import { useLanguage } from '@/app/_context/LanguageContext'

export default function NewsCard({news, shortVersion} : {news: NewsComplete, shortVersion?: boolean}) {
    const [role, setRole] = useState<string | null>();
    const [showDialog, setShowDialog] = useState(false);
    const { lang } = useLanguage();

    function hideDialog(){
      setShowDialog(false);
    }

    const router = useRouter()
    function goToNewsPage() {
        router.push("/news/" + news.id)
    }

    useEffect(() => {
      setRole(localStorage.getItem("role"));
    },[])

    async function deleteNews(){
      const request = await fetch("/api/admin/news/" + news.id, {
        method: "DELETE"
      });
      const result = await request.json();
      if(request.ok){
        toast.success(result.message);
        router.refresh();
      }else {
        toast.error(result.message);
      }
      hideDialog();
    }

    const displayTitle = news.title;
    const displayBody = news.body;
    const readMoreSuffix = lang === "th" ? "...  คลิกเพื่ออ่านต่อทั้งหมด" : "...  Click to read all.";

  return (
    <article className="rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/40 p-5 sm:p-6 transition-colors">
      {showDialog && <DeleteConfirmationDialog onConfirm={deleteNews} onCancel={hideDialog} />}

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5" suppressHydrationWarning>
            <span className="font-medium text-amber-400">{news.author}</span>
            <span aria-hidden="true">·</span>
            <span suppressHydrationWarning>
              {new Date(news.creationDate).toLocaleDateString("th-TH", { timeZone: "UTC" })}
            </span>
          </div>
          <h3
            onClick={goToNewsPage}
            className="font-display text-lg sm:text-xl font-bold text-slate-100 hover:text-amber-400 transition-colors cursor-pointer"
          >
            {displayTitle}
          </h3>
        </div>

        {role === "GAME_MASTER" && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-300 transition-colors"
              onClick={() => router.push("/admin?tab=news")}
            >
              {lang === "th" ? "แก้ไข" : "Edit"}
            </button>
            <button
              className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-300 transition-colors"
              onClick={() => setShowDialog(true)}
            >
              {lang === "th" ? "ลบข่าว" : "Delete"}
            </button>
          </div>
        )}
      </div>

      <div className="news-body mt-3 text-sm sm:text-base text-slate-300 leading-relaxed cursor-pointer" onClick={goToNewsPage}>
        <p className="whitespace-pre-line">
          {shortVersion
            ? displayBody.length < 350
              ? displayBody
              : displayBody.slice(0, 350).concat(readMoreSuffix)
            : displayBody}
        </p>
      </div>
    </article>
  )
}
