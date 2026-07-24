// 홈 탭. v9 기준: 눌리지 않는 요소를 두지 않는다(모든 카드가 동작).
// 오늘의 한국어 · 이어서 하기 · 바로가기 그리드 3열.
import { useEffect, useMemo, useState } from 'react'
import {
  getGrammar,
  getHangul,
  getVocabulary,
  type Grammar,
  type Hangul,
  type Lesson,
} from '../lib/content'
import { useI18n } from '../lib/i18n'
import { speak } from '../lib/speak'
import { getLastLesson, formatSince } from '../lib/progress'
import { ChevronRight, SpeakerIcon } from '../components/icons'
import type { Word } from '../components/Flashcard'

interface Props {
  onOpenLesson: (lesson: Lesson, jamo?: Hangul['jamo']) => void
  onOpenWord: (ko: string) => void
}

// 오늘 날짜 기준으로 매일 같은 순서로 단어가 바뀐다(연중 며칠째 % 단어수).
function dayIndex(count: number): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const doy = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return count > 0 ? doy % count : 0
}

// 레슨 분량으로 대략적인 소요 시간(분) 추정. 예문·문단 수 기반.
function estimateMinutes(lesson: Lesson): number {
  let n = 0
  for (const b of lesson.body) n += (b.phrases?.length ?? 0) + (b.p ? 1 : 0) + (b.jamo ? 3 : 0)
  return Math.max(3, Math.round(n * 1.2))
}

export default function HomeScreen({ onOpenLesson, onOpenWord }: Props) {
  const { lang, pick } = useI18n()
  const [words, setWords] = useState<Word[]>([])
  const [hangul, setHangul] = useState<Hangul | null>(null)
  const [grammar, setGrammar] = useState<Grammar | null>(null)

  useEffect(() => {
    Promise.all([getVocabulary(), getHangul(), getGrammar()])
      .then(([v, h, g]) => {
        setWords(v.units.flatMap((u) => u.words))
        setHangul(h)
        setGrammar(g)
      })
      .catch(() => {})
  }, [])

  // 날짜 문구는 언어에 맞춰 형식이 바뀐다(ko: 7월 24일 금요일 / id: Jumat, 24 Juli).
  const dateLabel = useMemo(() => {
    const locale = lang === 'ko' ? 'ko-KR' : 'id-ID'
    const opts: Intl.DateTimeFormatOptions =
      lang === 'ko'
        ? { month: 'long', day: 'numeric', weekday: 'long' }
        : { weekday: 'long', day: 'numeric', month: 'long' }
    try {
      return new Intl.DateTimeFormat(locale, opts).format(new Date())
    } catch {
      return ''
    }
  }, [lang])

  const today = words.length ? words[dayIndex(words.length)] : null

  // 이어서 하기: 실제 마지막 학습 과, 없으면 첫 과(문법 1과)부터.
  const lessonById = (id: string): { lesson: Lesson; jamo?: Hangul['jamo'] } | null => {
    const g = grammar?.lessons.find((l) => l.id === id)
    if (g) return { lesson: g }
    const h = hangul?.lessons.find((l) => l.id === id)
    if (h) return { lesson: h, jamo: hangul?.jamo }
    return null
  }
  const last = getLastLesson()
  const resume =
    (last && lessonById(last.id)) ||
    (grammar ? { lesson: grammar.lessons[0] } : null)

  const hangulLesson = hangul?.lessons[0]
  const grammarLesson = grammar?.lessons[0]

  return (
    <div className="pt-1.5">
      {/* 오늘의 한국어 */}
      {today && (
        <button
          onClick={() => {
            speak(today.ko)
            onOpenWord(today.ko)
          }}
          className="w-full rounded-card border border-line bg-white px-[18px] py-4 text-left transition-transform active:scale-[.985]"
        >
          <div className="text-[12.5px] font-semibold tracking-wide text-ink-3">
            {dateLabel} · {pick({ ko: '오늘의 한국어', id: 'Bahasa Korea hari ini' })}
          </div>
          <div className="mt-2 flex items-end justify-between gap-2.5">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2.5">
                <span className="text-[26px] font-bold tracking-tight text-blue">{today.ko}</span>
                <span className="text-[13px] font-medium text-ink-3">{today.romaja}</span>
              </div>
              <div className="mt-1 text-sm font-medium text-ink-2">{today.id_meaning}</div>
            </div>
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-tint text-blue">
              <SpeakerIcon size={16} />
            </span>
          </div>
        </button>
      )}

      {/* 이어서 하기 */}
      {resume && (
        <button
          onClick={() => onOpenLesson(resume.lesson, resume.jamo)}
          className="mt-2.5 w-full overflow-hidden rounded-card bg-gradient-to-br from-blue to-blue-2 px-5 py-5 text-left text-white transition-transform active:scale-[.985]"
        >
          <div className="text-[12.5px] font-semibold uppercase tracking-wide text-white/75">
            {last
              ? pick({ ko: '이어서 하기', id: 'Lanjutkan' })
              : pick({ ko: '학습 시작', id: 'Mulai belajar' })}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2.5">
            <span className="text-[19px] font-bold leading-snug tracking-tight">
              {pick(resume.lesson.category)} · {pick(resume.lesson.title)}
            </span>
            <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-white/20 px-3.5 py-2 text-[13.5px] font-bold">
              {pick({ ko: '계속', id: 'Lanjut' })}
              <ChevronRight size={15} />
            </span>
          </div>
          <div className="mt-2 text-[12.5px] font-medium text-white/80">
            {pick({ ko: '약', id: 'Sekitar' })} {estimateMinutes(resume.lesson)}
            {pick({ ko: '분', id: ' menit' })}
            {last && ` · ${pick({ ko: '마지막 학습', id: 'Terakhir belajar' })} ${formatSince(last.at, lang)}`}
          </div>
        </button>
      )}

      {/* 바로가기 3열 (구체적 활동만, 탭 이름 복제 금지) */}
      <div className="mb-2.5 mt-8 text-[13.5px] font-bold uppercase tracking-wide text-ink-3">
        {pick({ ko: '바로 가기', id: 'Akses cepat' })}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {hangulLesson && (
          <button
            onClick={() => onOpenLesson(hangulLesson, hangul?.jamo)}
            className="rounded-2xl border border-line bg-white px-1 py-3.5 text-center transition-transform active:scale-95"
          >
            <div className="mb-1.5 text-lg font-extrabold text-blue">가</div>
            <div className="text-[11.5px] font-semibold leading-tight tracking-tight text-ink">
              {pick({ ko: '한글 자모', id: 'Hangul' })}
            </div>
          </button>
        )}
        {grammarLesson && (
          <button
            onClick={() => onOpenLesson(grammarLesson)}
            className="rounded-2xl border border-line bg-white px-1 py-3.5 text-center transition-transform active:scale-95"
          >
            <div className="mb-1.5 text-lg font-extrabold text-blue">고</div>
            <div className="text-[11.5px] font-semibold leading-tight tracking-tight text-ink">
              {pick({ ko: '문법 1과', id: 'Tata bahasa' })}
            </div>
          </button>
        )}
        {today && (
          <button
            onClick={() => onOpenWord(today.ko)}
            className="rounded-2xl border border-line bg-white px-1 py-3.5 text-center transition-transform active:scale-95"
          >
            <div className="mb-1.5 text-lg font-extrabold text-blue">단</div>
            <div className="text-[11.5px] font-semibold leading-tight tracking-tight text-ink">
              {pick({ ko: '단어장', id: 'Kosakata' })}
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
