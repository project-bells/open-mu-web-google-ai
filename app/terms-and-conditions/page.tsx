"use client"

import { useLanguage } from "@/app/_context/LanguageContext";

export default function TermsAndConditions() {
  const { lang } = useLanguage();

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="border-b border-slate-800/80 pb-4">
        <h1 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
          {lang === "th" ? "ข้อกำหนดและเงื่อนไขการใช้งาน" : "Terms and Conditions"}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th"
            ? "ข้อตกลงผู้ใช้งาน นโยบายความเป็นส่วนตัว และกฎระเบียบของเซิร์ฟเวอร์ Mu Origisns S6E3"
            : "User agreement, privacy policy, and server rules for Mu Origisns S6E3"}
        </p>
      </div>

      {lang === "th" ? (
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 sm:p-8 flex flex-col gap-4 text-sm text-slate-300 leading-relaxed">
          <p>
            ยินดีต้อนรับสู่ <strong>Mu Origisns S6E3</strong>! ข้อกำหนดและเงื่อนไขฉบับนี้ระบุถึงกฎระเบียบและแนวทางในการใช้งานเว็บไซต์และเซิร์ฟเวอร์ของ Mu Origisns S6E3
          </p>
          <p>
            การเข้าใช้งานเว็บไซต์นี้ถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขทั้งหมด หากคุณไม่ตกลงที่จะปฏิบัติตามข้อกำหนดที่ระบุไว้ในหน้านี้ กรุณางดใช้งานเว็บไซต์ Mu Origisns S6E3
          </p>
          <h2 className="font-display text-base font-bold text-amber-400 mt-2">การใช้งานคุกกี้ (Cookies)</h2>
          <p>
            เว็บไซต์ของเรามีการใช้งานคุกกี้เพื่อจดจำสถานะการเข้าสู่ระบบและการตั้งค่าภาษาของผู้ใช้งาน การเข้าใช้งาน Mu Origisns S6E3 ถือว่าคุณยินยอมให้ใช้คุกกี้ตามนโยบายความเป็นส่วนตัวของเรา
          </p>
          <h2 className="font-display text-base font-bold text-amber-400 mt-2">สิทธิ์การใช้งานและข้อห้าม (License &amp; Rules)</h2>
          <p>
            คุณสามารถเข้าใช้งานเว็บไซต์และบริการของ Mu Origisns S6E3 เพื่อความบันเทิงส่วนบุคคลภายใต้ข้อกำหนดดังต่อไปนี้ โดยห้ามกระทำการใดๆ ดังนี้:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1 text-slate-300">
            <li>นำข้อมูลหรือเนื้อหาจาก Mu Origisns S6E3 ไปเผยแพร่ซ้ำโดยไม่ได้รับอนุญาต</li>
            <li>ใช้โปรแกรมช่วยเล่น บอท หรือแสวงหาผลประโยชน์จากช่องโหว่ของระบบ</li>
            <li>คัดลอก ดัดแปลง หรือทำซ้ำส่วนหนึ่งส่วนใดของเว็บไซต์</li>
            <li>ก่อกวนหรือสร้างความเสียหายต่อผู้เล่นคนอื่นและระบบเซิร์ฟเวอร์</li>
          </ul>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 sm:p-8 flex flex-col gap-4 text-sm text-slate-300 leading-relaxed">
          <p>
            Welcome to <strong>Mu Origisns S6E3</strong>! These terms and conditions outline the rules and regulations for the use of Mu Origisns S6E3&apos;s Website.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use Mu Origisns S6E3 if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <h2 className="font-display text-base font-bold text-amber-400 mt-2">Cookies</h2>
          <p>
            We employ the use of cookies. By accessing Mu Origisns S6E3, you agreed to use cookies in agreement with the Privacy Policy. Most interactive websites use cookies to let us retrieve the user&apos;s details for each visit.
          </p>
          <h2 className="font-display text-base font-bold text-amber-400 mt-2">License</h2>
          <p>
            Unless otherwise stated, Mu Origisns S6E3 and/or its licensors own the intellectual property rights for all custom web material on Mu Origisns S6E3. All intellectual property rights are reserved. You may access this from Mu Origisns S6E3 for your own personal use subjected to restrictions set in these terms and conditions:
          </p>
          <ul className="list-disc pl-5 flex flex-col gap-1 text-slate-300">
            <li>Do not republish material from Mu Origisns S6E3</li>
            <li>Do not sell, rent or sub-license material from Mu Origisns S6E3</li>
            <li>Do not reproduce, duplicate or copy material from Mu Origisns S6E3</li>
            <li>Do not redistribute content from Mu Origisns S6E3</li>
          </ul>
        </div>
      )}
    </div>
  )
}

