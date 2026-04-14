'use client';
import { useLang } from '@/lib/language';

export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 transition-colors"
      aria-label="Toggle language"
    >
      {lang === 'en' ? '🇵🇰 اردو' : '🇬🇧 English'}
    </button>
  );
}
