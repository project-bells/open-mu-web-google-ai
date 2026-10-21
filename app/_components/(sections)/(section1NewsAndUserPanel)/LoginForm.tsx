"use client"

import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify"
import { useLanguage } from "@/app/_context/LanguageContext"

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { lang } = useLanguage();

  const router = useRouter();

  function sUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value)
  }
  function sPassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  //try to login
  async function login(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const signInData = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false
    })
    if (signInData?.error) {
      toast.error(lang === "th" ? "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" : "Invalid Username or Password");
    } else {
      router.refresh();
      toast.success((lang === "th" ? "ยินดีต้อนรับกลับมา " : "Welcome back ") + username)
    }
  }

  return (
    <form className="flex flex-col w-full gap-4 text-slate-100">
      <div>
        <h3 className="font-display text-xl font-bold text-slate-100">
          {lang === "th" ? "เข้าสู่ระบบบัญชี" : "Account Login"}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {lang === "th" ? "เข้าสู่ระบบเพื่อจัดการตัวละครและอัพสเตตัส" : "Sign in to manage characters and stats"}
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-1">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "ชื่อผู้ใช้ (Username)" : "Username"}
          </label>
          <input
            type="text"
            minLength={4}
            placeholder={lang === "th" ? "กรอกชื่อผู้ใช้" : "Enter username"}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
            onChange={sUsername}
            value={username}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            {lang === "th" ? "รหัสผ่าน (Password)" : "Password"}
          </label>
          <input
            type="password"
            minLength={4}
            placeholder={lang === "th" ? "กรอกรหัสผ่าน" : "Enter password"}
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/90 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 invalid:border-red-500 transition-colors"
            onChange={sPassword}
            value={password}
          />
        </div>
      </div>

      <button
        className="mt-2 w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-md shadow-amber-500/10"
        onClick={login}
      >
        {lang === "th" ? "เข้าสู่ระบบ" : "Sign In"}
      </button>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        <Link href="/recoverpassword" className="hover:text-amber-400 transition-colors">
          {lang === "th" ? "ลืมรหัสผ่าน?" : "Lost password?"}
        </Link>
        <Link href="/register" className="font-bold text-amber-400 hover:text-amber-300 transition-colors">
          {lang === "th" ? "สมัครสมาชิกใหม่" : "Register Account"}
        </Link>
      </div>
    </form>
  )
}

