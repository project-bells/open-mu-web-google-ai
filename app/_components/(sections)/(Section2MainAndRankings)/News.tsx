import { prisma } from '@/lib/prisma'
import React from 'react'
import NewsCard from './(components)/NewsCard';
import NewsComplete from '@/app/_models/NewsComplete';
import ChangePageButton from './(components)/ChangePageButton';
import { TranslatedText } from '@/app/_context/LanguageContext';

export default async function News({page} : {page: number}) {
  page = page >= 0 ? page : 0;

  const NEWS_PER_PAGE = 4;
  const SKIP = (page * NEWS_PER_PAGE) || 0; 

  const news: NewsComplete[] = await prisma.openMuWeb_News.findMany({
    skip: SKIP,
    take: NEWS_PER_PAGE,
    orderBy: {
      creationDate: 'desc'
    }
  });

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-4 mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
          <TranslatedText th="ข่าวสารและประกาศล่าสุด" en="Latest Announcements" />
        </h2>
        <span className="text-xs text-slate-400">
          <TranslatedText th="อัปเดตอย่างเป็นทางการจาก Mu Origisns S6E3" en="Official Mu Origisns S6E3 Updates" />
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {news.map((n, i) => (
          <NewsCard news={n} key={i} shortVersion={true} />
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        {(page > 0) && <ChangePageButton forward={false} />}
        {((!page || page >= 0) && news.length > 3) && <ChangePageButton forward={true} />}
      </div>
    </div>
  )
}

