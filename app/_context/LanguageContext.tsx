"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "th" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "th",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("th");

  useEffect(() => {
    const saved = localStorage.getItem("mu_lang") as Language | null;
    if (saved === "th" || saved === "en") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("mu_lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function TranslatedText({ th, en }: { th: string; en: string }) {
  const { lang } = useLanguage();
  return <>{lang === "th" ? th : en}</>;
}

