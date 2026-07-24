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
export const getHangul = (lang = 'id') => load<Hangul>(`${lang}/lessons_hangul.json`)
export const getGrammar = (lang = 'id') => load<Grammar>(`${lang}/lessons_grammar.json`)

// 두 언어를 함께 담는 콘텐츠 필드. lang에 따라 골라 쓴다.
export type Bilingual = { ko: string; id: string }

export interface Jamo {
  char: string
  romaja: string
  name: string
}

// 레슨 본문 한 블록. 종류에 따라 채워지는 필드가 다르다.
export interface LessonBlock {
  h?: Bilingual // 소제목
  p?: Bilingual // 문단 (일부 <b> 강조 포함)
  jamo?: 'cons' | 'vows' | 'comp' // 자모 그리드 (자음/모음/겹모음)
  phrases?: Array<[string, string]> // [한국어 예문, 뜻]
  box?: Bilingual // 안내 상자 제목
  bp?: Bilingual // 안내 상자 본문
  warn?: Bilingual // 주의 상자 제목
  wp?: Bilingual // 주의 상자 본문
}

export interface Lesson {
  unit: number
  status: string
  id: string
  category: Bilingual
  title: Bilingual
  lede: Bilingual
  body: LessonBlock[]
  source_line: Bilingual
}

export interface Hangul {
  _meta: Record<string, unknown>
  jamo: { consonants: Jamo[]; vowels: Jamo[]; compound_vowels?: Jamo[] }
  lessons: Lesson[]
}

export interface Grammar {
  _meta: Record<string, unknown>
  lessons: Lesson[]
}

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
