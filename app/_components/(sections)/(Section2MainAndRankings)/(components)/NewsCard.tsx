"use client"
import NewsComplete from '@/app/_models/NewsComplete'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'
import { useLanguage } from '@/app/_context/LanguageContext'

const localizedDefaultNews: Record<string, { th: { title: string; body: string }; en: { title: string; body: string } }> = {
  "00000000-0000-4000-8000-000000000001": {
    th: {
      title: "เปิดให้บริการเซิร์ฟเวอร์ Mu Origisns S6E3 อย่างเป็นทางการ",
      body: "เซิร์ฟเวอร์ Mu Origisns S6E3 พร้อมเปิดให้บริการแล้ววันนี้! สมัครสมาชิก ดาวน์โหลดตัวเกมตัวเต็ม และเข้าร่วมการผจญภัยบนทวีป MU ได้ทันที อัตราคูณค่าประสบการณ์ x100 อัตราดรอปไอเทมยอดเยี่ยม (Excellent) 50% ในรูปแบบ Play2Win สมดุลทุกสายอาชีพ",
    },
    en: {
      title: "Mu Origisns S6E3 Realm Officially Open",
      body: "Our Mu Origisns S6E3 server is now live! Create your account, download the full game client, and join the adventure across the continent of MU. Experience rate is set to x100 with a 50% excellent drop rate and Play2Win progression.",
    },
  },
  "00000000-0000-4000-8000-000000000002": {
    th: {
      title: "ตารางการลงทะเบียนและศึกชิงปราสาท Castle Siege",
      body: "หัวหน้ากิลด์สามารถลงทะเบียนและส่งมอบ Sign of Lord สำหรับศึกชิงปราสาท Valley of Loren ที่กำลังจะมาถึงได้แล้ว รวบรวมพันธมิตรของคุณ ป้องกันห้องบัลลังก์ และชิงสิทธิ์เข้าใช้งาน Lord Mix พร้อมเกียรติยศสูงสุดประจำเซิร์ฟเวอร์",
    },
    en: {
      title: "Castle Siege Registration & Schedule",
      body: "Guild Masters may now register Sign of Lord marks for the upcoming Valley of Loren Castle Siege. Gather your alliance, fortify the Crown Room, and compete for exclusive Lord Mix access and realm glory.",
    },
  },
  "00000000-0000-4000-8000-000000000003": {
    th: {
      title: "อัปเดตสมดุลปราสาทเลือด (Blood Castle) และลานปีศาจ (Devil Square)",
      body: "ปรับความหนาแน่นของมอนสเตอร์และอัตราดรอปเพชร Jewel of Bless ใน Blood Castle ชั้น 7 และ Devil Square ชั้น 6 เพื่อให้คุ้มค่ากับการเล่นเป็นปาร์ตี้มากยิ่งขึ้น โบนัสค่าประสบการณ์ปาร์ตี้เพิ่มขึ้นสูงสุดถึง 50% เมื่อครบปาร์ตี้ 5 คน",
    },
    en: {
      title: "Blood Castle & Devil Square Balance Patch",
      body: "Monster density and Jewel of Bless drop rates in Blood Castle 7 and Devil Square 6 have been tuned to reward party play. Party bonus experience scales up to 50% for full 5-player groups.",
    },
  },
};

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
      const request = await fetch(`${process.env.NEXT_PUBLIC_URL || ""}/api/admin/news/`+news.id, {
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

    const localized = localizedDefaultNews[news.id]?.[lang];
    const displayTitle = localized ? localized.title : news.title;
    const displayBody = localized ? localized.body : news.body;
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
              {new Date(news.creationDate).toLocaleDateString("en-US", { timeZone: "UTC" })}
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
          <button
            className="px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-300 transition-colors shrink-0"
            onClick={() => setShowDialog(true)}
          >
            {lang === "th" ? "ลบข่าว" : "Delete"}
          </button>
        )}
      </div>

      <div className="news-body mt-3 text-sm sm:text-base text-slate-300 leading-relaxed" onClick={goToNewsPage}>
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

