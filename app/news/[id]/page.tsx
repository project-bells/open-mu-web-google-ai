import NewsCard from '@/app/_components/(sections)/(Section2MainAndRankings)/(components)/NewsCard';
import ReturnToHomeButton from '@/app/_components/(sections)/(Section2MainAndRankings)/(components)/ReturnToHomeButton';
import NewsComplete from '@/app/_models/NewsComplete'
import { prisma } from '@/lib/prisma'
import React from 'react'
import { TranslatedText } from '@/app/_context/LanguageContext';

export default async function page({params} : {params: {id: string}}) {
    //used to test the validity of regex
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    let news: NewsComplete | null = null;
    try {
        if(uuidRegex.test(params.id)){
            news = await prisma.openMuWeb_News.findFirst({
                where: {
                    id: params.id
                }
            })
        }
    } catch(e){
        console.log(e);
    }

  return (
    <div className="flex flex-col gap-5 w-full">
      <ReturnToHomeButton />
      {news ? (
        <NewsCard news={news} />
      ) : (
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-8 text-center">
          <p className="text-slate-300 text-base font-medium">
            <TranslatedText th="ไม่พบข้อมูลข่าวสารที่คุณต้องการ!" en="No News was found!" />
          </p>
        </div>
      )}
    </div>
  )
}

