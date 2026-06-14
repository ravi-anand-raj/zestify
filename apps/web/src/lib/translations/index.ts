import { en } from "./en"
import { hi } from "./hi"
import { ja } from "./ja"
import { ko } from "./ko"
import { es } from "./es"
import { fr } from "./fr"
import type { TranslationKeys } from "./en"

export type LanguageCode = "en" | "hi" | "ja" | "ko" | "es" | "fr"

export interface LanguageInfo {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
}

export const translations: Record<LanguageCode, TranslationKeys> = {
  en,
  hi,
  ja,
  ko,
  es,
  fr,
}

export const languages: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
]

export { en, hi, ja, ko, es, fr }
export type { TranslationKeys }
