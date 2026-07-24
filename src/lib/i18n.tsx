// 언어 상태(ko/id)와 UI 문자열을 앱 전체에 제공한다.
// 대상 사용자가 인도네시아어권이라 기본값은 'id'.
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getUiStrings, type Bilingual, type Lang } from './content'

interface I18nValue {
  lang: Lang
  toggle: () => void
  t: (key: string) => string // ui_strings 키 → 현재 언어 문자열
  pick: (b?: Bilingual) => string // 콘텐츠의 {ko,id} → 현재 언어
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('id')
  const [strings, setStrings] = useState<Record<string, Bilingual>>({})

  useEffect(() => {
    getUiStrings()
      .then((u) => setStrings(u.strings as Record<string, Bilingual>))
      .catch(() => {}) // 문자열을 못 읽어도 키 자체를 폴백으로 보여준다
  }, [])

  const value: I18nValue = {
    lang,
    toggle: () => setLang((l) => (l === 'id' ? 'ko' : 'id')),
    t: (key) => strings[key]?.[lang] ?? key,
    pick: (b) => (b ? b[lang] : ''),
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n은 I18nProvider 안에서만 쓸 수 있습니다')
  return ctx
}
