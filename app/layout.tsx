import './globals.css'
import type { Metadata } from 'next'
import Navbar from './_components/(navbar)/Navbar'
import SecondaryNav from './_components/(navbar)/SecondaryNav'
import Footer from './_components/(footer)/Footer'
import Section1 from './_components/(sections)/(section1NewsAndUserPanel)/Section1'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ServerStatistics from './_components/(sections)/(Section2MainAndRankings)/ServerStatistics'
import TopPlayers from './_components/(sections)/(Section2MainAndRankings)/TopPlayers'
import TopGuilds from './_components/(sections)/(Section2MainAndRankings)/TopGuilds'
import { LanguageProvider } from './_context/LanguageContext'

export const metadata: Metadata = {
  title: 'Mu Origisns S6E3',
  description: 'Mu Origisns S6E3 — เว็บไซต์หลัก เซิร์ฟเวอร์มิวออนไลน์ Season 6 Episode 3 จัดอันดับ จัดการตัวละคร และข่าวสาร',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className="dark">
      <body className="font-sans min-h-screen m-0 flex flex-col items-center w-full bg-[#090D16] text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
        <LanguageProvider>
          {/* Hero Background Image with Measured Scrim */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-x-0 top-0 h-[620px] bg-[url('~/public/img/bg-header.jpg')] bg-top bg-cover bg-no-repeat opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#090D16]/50 via-[#090D16]/90 to-[#090D16]" />
          </div>

          <Navbar />

          <main className="relative z-10 w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-6 pb-16 flex flex-col gap-8">
            <SecondaryNav />

            <div className="w-full rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md p-6 sm:p-8 flex flex-col gap-10">
              <Section1 />

              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-slate-800/80 pt-8">
                <div className="lg:col-span-8 w-full min-w-0">
                  {children}
                </div>
                <aside className="lg:col-span-4 w-full flex flex-col gap-6">
                  <ServerStatistics />
                  <TopPlayers />
                  <TopGuilds />
                </aside>
              </div>
            </div>
          </main>

          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover
            theme="dark"
          />
        </LanguageProvider>
      </body>
    </html>
  )
}

