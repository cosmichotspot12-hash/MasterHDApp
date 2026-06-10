'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { kannadaTranslations } from '@/lib/kannada-translations'

const LANGUAGE_KEY = 'hd-language'

function translateDocument(lang: string) {
  document.documentElement.lang = lang === 'kn' ? 'kn' : 'en'
  document.documentElement.dataset.lang = lang

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n
    if (!key) return

    if (!element.dataset.i18nEn) {
      element.dataset.i18nEn = element.textContent || ''
    }

    element.textContent = lang === 'kn' && kannadaTranslations[key]
      ? kannadaTranslations[key]
      : element.dataset.i18nEn
  })

  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-i18n-placeholder]').forEach((element) => {
    const key = element.dataset.i18nPlaceholder
    if (!key) return

    if (!element.dataset.i18nPlaceholderEn) {
      element.dataset.i18nPlaceholderEn = element.placeholder || ''
    }

    element.placeholder = lang === 'kn' && kannadaTranslations[key]
      ? kannadaTranslations[key]
      : element.dataset.i18nPlaceholderEn
  })
}

export function setSiteLanguage(lang: 'en' | 'kn') {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LANGUAGE_KEY, lang)
  translateDocument(lang)
  window.dispatchEvent(new CustomEvent('hd-language-change', { detail: lang }))
}

export function getSiteLanguage() {
  if (typeof window === 'undefined') return 'en'
  return window.localStorage.getItem(LANGUAGE_KEY) === 'kn' ? 'kn' : 'en'
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const apply = () => translateDocument(getSiteLanguage())
    apply()
    const timer = window.setTimeout(apply, 60)
    window.addEventListener('hd-language-change', apply)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('hd-language-change', apply)
    }
  }, [pathname])

  return children
}
