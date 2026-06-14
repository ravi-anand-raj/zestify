"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { translations, languages, type LanguageCode, type TranslationKeys, type LanguageInfo } from "@/lib/translations"

interface LanguageContextValue {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: TranslationKeys
  languages: LanguageInfo[]
  currentLanguageInfo: LanguageInfo
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

interface LanguageProviderProps {
  children: React.ReactNode
  defaultLanguage?: LanguageCode
  storageKey?: string
}

export function LanguageProvider({
  children,
  defaultLanguage = "en",
  storageKey = "zestify-language",
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>(defaultLanguage)

  // Read from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as LanguageCode | null
    if (stored && translations[stored]) {
      setLanguageState(stored)
    }
  }, [storageKey])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem(storageKey, lang)
    // Update document lang attribute for accessibility
    document.documentElement.setAttribute("lang", lang)
  }

  const t = translations[language] || translations.en

  const currentLanguageInfo = languages.find(l => l.code === language) || languages[0]

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages,
        currentLanguageInfo,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
