'use client';
import { useAppStore } from '@/lib/store';
import { translations, resolveLang, type UIStrings } from './translations';

/**
 * Returns a `t` function scoped to the current user language.
 * Falls back to Hindi → English → key name.
 */
export function useTranslation() {
  const { userProfile } = useAppStore();
  const lang = resolveLang(userProfile?.language);
  const strings: UIStrings = translations[lang] ?? translations['hi'];

  function t<K extends keyof UIStrings>(key: K, fallback?: string): string {
    return (strings[key] as string) ?? (translations['hi'][key] as string) ?? fallback ?? String(key);
  }

  /** RTL direction flag (for Urdu / Sindhi / Kashmiri) */
  const isRTL = strings.dir === 'rtl';

  return { t, lang, isRTL };
}
