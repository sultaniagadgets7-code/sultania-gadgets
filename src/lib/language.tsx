'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Lang } from './translations';

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations.en;
}>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem('sultania_lang') as Lang;
    if (saved === 'ur' || saved === 'en') {
      setLangState(saved);
      document.documentElement.dir = saved === 'ur' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('sultania_lang', l);
    document.documentElement.dir = l === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
