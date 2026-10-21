"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import Slider from "../../../../public/img/slider-img-1.jpg"
import Slider2 from "../../../../public/img/slider-img-2.jpg"
import { useLanguage } from "@/app/_context/LanguageContext"

export default function Banners() {
  const [imgArray] = useState([Slider, Slider2])
  const [currentImg, setCurrentImg] = useState(0)
  const { lang } = useLanguage();

  //change banner image after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (imgArray.length === prev + 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [imgArray.length])

  function onClick() {
    if (imgArray.length === currentImg + 1) {
      setCurrentImg(0);
    } else {
      setCurrentImg(currentImg + 1);
    }
  }

  return (
    <div className="w-full h-full min-h-[320px] sm:min-h-[360px] rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 relative group">
      <Image
        className="w-full h-full object-cover object-top transition-opacity duration-300"
        src={imgArray[currentImg]}
        alt="Mu Origisns S6E3 showcase banner"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none" />

      <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-amber-400 tracking-wider">
            {lang === "th" ? "กิจกรรมและไฮไลท์เด่น" : "Featured Event"}
          </p>
          <h3 className="font-display text-lg sm:text-xl font-bold text-slate-100 mt-0.5">
            {currentImg === 0
              ? lang === "th"
                ? "ศึกชิงปราสาท Castle Siege และรางวัลประจำสัปดาห์"
                : "Castle Siege Warfare & Weekly Rewards"
              : lang === "th"
              ? "สำรวจดินแดนแห่งทวีปใน Mu Origisns S6E3"
              : "Explore New Mu Origisns S6E3 Realms"}
          </h3>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            {imgArray.map((_, idx) => (
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

