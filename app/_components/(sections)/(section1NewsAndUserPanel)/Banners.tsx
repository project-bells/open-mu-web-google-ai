"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import Slider1 from "../../../../public/img/slider-img-1.jpg"
import Slider2 from "../../../../public/img/slider-img-2.jpg"
import Slider3 from "../../../../public/img/slider-img-3.jpg"
import Slider4 from "../../../../public/img/slider-img-4.jpg"
import Slider5 from "../../../../public/img/slider-img-5.jpg"
import { useLanguage } from "@/app/_context/LanguageContext"

const SLIDES = [
  {
    src: Slider1,
    th: "ศึกชิงปราสาท Castle Siege และรางวัลประจำสัปดาห์",
    en: "Castle Siege Warfare & Weekly Rewards",
  },
  {
    src: Slider2,
    th: "สำรวจดินแดนแห่งทวีปใน Mu Origisns S6E3",
    en: "Explore New Mu Origisns S6E3 Realms",
  },
  {
    src: Slider3,
    th: "ปลดล็อกปีกเทพและชุดเกราะระดับสูง Season 6 Episode 3",
    en: "Unlock Divine Wings & High-Tier S6E3 Armor",
  },
  {
    src: Slider4,
    th: "ล่าบอสมังกรโบราณและดันเจี้ยนสุดท้าทาย",
    en: "Hunt Ancient Dragons & Conquer Epic Dungeons",
  },
  {
    src: Slider5,
    th: "สมรภูมิประลองยุทธ์ PvP และสงครามกิลด์สุดเดือด",
    en: "Intense PvP Arenas & Guild Battles",
  },
]

export default function Banners() {
  const [currentImg, setCurrentImg] = useState(0)
  const { lang } = useLanguage();

  //change banner image after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (SLIDES.length === prev + 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [])

  function onClick() {
    setCurrentImg((prev) => (SLIDES.length === prev + 1 ? 0 : prev + 1));
  }

  const activeSlide = SLIDES[currentImg] || SLIDES[0];

  return (
    <div className="w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 relative group select-none">
      {SLIDES.map((slide, idx) => (
        <Image
          key={idx}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          referrerPolicy="no-referrer"
          className={`object-cover object-top transition-opacity duration-500 ${
            currentImg === idx ? "opacity-100 z-0" : "opacity-0 pointer-events-none"
          }`}
          src={slide.src}
          alt={lang === "th" ? slide.th : slide.en}
          priority={idx === 0}
        />
      ))}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent pointer-events-none" />

      <div className="absolute z-20 bottom-5 left-6 right-6 flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-amber-400 tracking-wider truncate">
            {lang === "th" ? "กิจกรรมและไฮไลท์เด่น" : "Featured Event"} ({currentImg + 1}/{SLIDES.length})
          </p>
          <h3 className="font-display text-lg sm:text-xl font-bold text-slate-100 mt-0.5 truncate">
            {lang === "th" ? activeSlide.th : activeSlide.en}
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setCurrentImg(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentImg === idx ? "w-6 bg-amber-400" : "w-2 bg-slate-600 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-900/90 hover:bg-amber-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-amber-400 transition-colors font-bold text-sm"
            aria-label="Next slide"
          >
            &#10132;
          </button>
        </div>
      </div>
    </div>
  )
}


