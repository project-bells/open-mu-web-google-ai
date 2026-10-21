"use client"

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify"
import { useLanguage } from "@/app/_context/LanguageContext";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("")
    const [isDisabled, setIsDisabled] = useState(true);
    const { lang } = useLanguage();

    //calls the register api
    const onSubmit = async (e: React.MouseEvent<HTMLElement>) => {  
        e.preventDefault();
        if(password != repeatPassword){
            toast.error(lang === "th" ? "รหัสผ่านทั้งสองช่องไม่ตรงกัน" : "The passwords must coincide")
            return;
        }
        const response = await fetch("/api/account/register", {
        method: "POST",
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({LoginName: username, EMail: email, Password: password, RepeatPassword: repeatPassword})
        }).then( resp => resp.text()).then(text => JSON.parse(text));
        
        if(response.user === null){
            toast.error(response.message);
        } else {
            toast.success(response.message);
            setEmail("");
            setUsername("");
            setPassword("");
            setRepeatPassword("");
        }
    }

  return (
    <div className="flex flex-col w-full">
      <div className="border-b border-slate-800/80 pb-4 mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-100 tracking-wide">
          {lang === "th" ? "สมัครสมาชิกใหม่" : "Account Registration"}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th"
            ? "สร้างบัญชี Mu Origisns S6E3 เพื่อเข้าร่วมการผจญภัย"
            : "Create your Mu Origisns S6E3 account to enter the realm"}
        </p>
      </div>

      <form className="max-w-md w-full rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "ชื่อผู้ใช้ (4–10 ตัวอักษร)" : "Username (4–10 characters)"}
          </label>
          <input
            type="text"
            placeholder={lang === "th" ? "กรอกชื่อผู้ใช้" : "Enter username"}
            minLength={4}
            maxLength={10}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "อีเมล (Email Address)" : "Email Address"}
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            minLength={5}
            maxLength={30}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "รหัสผ่าน (8–20 ตัวอักษร)" : "Password (8–20 characters)"}
          </label>
          <input
            type="password"
            placeholder={lang === "th" ? "กรอกรหัสผ่าน" : "Enter password"}
            minLength={8}
            maxLength={20}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "ยืนยันรหัสผ่านอีกครั้ง" : "Repeat Password"}
          </label>
          <input
            type="password"
            placeholder={lang === "th" ? "กรอกรหัสผ่านอีกครั้ง" : "Confirm password"}
            minLength={8}
            maxLength={20}
            onChange={(e) => setRepeatPassword(e.target.value)}
            value={repeatPassword}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
          />
        </div>

        <label htmlFor="terms" className="flex items-center gap-2.5 text-xs text-slate-300 mt-1 cursor-pointer">
          <input
            onClick={() => setIsDisabled(!isDisabled)}
            type="checkbox"
            id="terms"
            name="terms"
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
          />
          <span>
            {lang === "th" ? "ฉันยอมรับ " : "I accept the "}
            <Link href="/terms-and-conditions" className="text-amber-400 hover:underline">
              {lang === "th" ? "ข้อกำหนดและเงื่อนไขการใช้งาน" : "Terms and Conditions"}
            </Link>
          </span>
        </label>

        <button
          disabled={isDisabled}
          onClick={onSubmit}
          className="mt-2 w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-sm transition-colors"
        >
          {lang === "th" ? "ยืนยันการสมัครสมาชิก" : "Register Account"}
        </button>
      </form>
    </div>
  )
}

