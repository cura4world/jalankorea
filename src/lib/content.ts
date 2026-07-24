// 콘텐츠 로더.
// JSON은 public/content/ 에 있고 빌드 시 앱 안에 함께 포장된다.
// 서버 호출이 아니므로 오프라인에서도 작동한다.

const base = import.meta.env.BASE_URL

export type Lang = 'ko' | 'id'

async function load<T>(path: string): Promise<T> {
  const res = await fetch(`${base}content/${path}`)
  if (!res.ok) throw new Error(`콘텐츠를 불러오지 못했습니다: ${path}`)
  return res.json()
}

export const getUiStrings = () => load<UiStrings>('ui_strings.json')
export const getVocabulary = (lang = 'id') => load<Vocabulary>(`${lang}/vocabulary.json`)
export const getQuestions = (lang = 'id') => load<Questions>(`${lang}/exam_questions.json`)
export const getArticles = (lang = 'id') => load<Articles>(`${lang}/articles.json`)
export const getHangul = (lang = 'id') => load<unknown>(`${lang}/lessons_hangul.json`)
export const getGrammar = (lang = 'id') => load<unknown>(`${lang}/lessons_grammar.json`)

export interface UiStrings {
  _meta: Record<string, unknown>
  strings: Record<string, { ko: string; id: string }>
}
export interface Vocabulary {
  _meta: Record<string, unknown>
  units: Array<{
    unit: number
    title: { ko: string; id: string }
    status: string
    words: Array<{ id: string; ko: string; id_meaning: string; romaja: string; audio: string | null }>
  }>
}
export interface Questions {
  _meta: Record<string, unknown>
  questions: Array<Record<string, unknown>>
}
export interface Articles {
  _meta: Record<string, unknown>
  articles: Array<Record<string, unknown>>
}
