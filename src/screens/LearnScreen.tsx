// 학습 탭. 콘텐츠 우선 원칙에 따라 가장 먼저 완성하는 화면.
// 한글 과 · 문법 과(여러 과 목록) · 단어장(유닛별 플래시카드)을 JSON에서 읽어 보여준다.
import { useEffect, useState } from 'react'
import {
  getGrammar,
  getHangul,
  getVocabulary,
  type Grammar,
  type Hangul,
  type Lesson,
  type Vocabulary,
} from '../lib/content'
import { useI18n } from '../lib/i18n'
import Flashcard, { type Word } from '../components/Flashcard'
import { ChevronRight } from '../components/icons'

interface Props {
  onOpenLesson: (lesson: Lesson, jamo?: Hangul['jamo']) => void
  startWordKo?: string // 홈에서 특정 단어로 들어올 때
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-8 text-[13.5px] font-bold uppercase tracking-wide text-ink-3 first:mt-1.5">
      {children}
    </div>
  )
}

function LessonRow({ title, sub, free, onClick }: { title: string; sub: string; free: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-line-2 py-3.5 text-left last:border-b-0"
    >
      <div className="min-w-0 flex-1">
        <div className="text-[14.5px] font-semibold tracking-tight text-ink">{title}</div>
        <div className="mt-0.5 text-xs font-medium text-ink-3">{sub}</div>
      </div>
      <span className="flex-shrink-0 rounded-full bg-green-tint px-2 py-1 text-[10px] font-bold tracking-wide text-green">
        {free}
      </span>
      <ChevronRight size={17} className="flex-shrink-0 text-ink-3" />
    </button>
  )
}

export default function LearnScreen({ onOpenLesson, startWordKo }: Props) {
  const { pick } = useI18n()
  const [hangul, setHangul] = useState<Hangul | null>(null)
  const [grammar, setGrammar] = useState<Grammar | null>(null)
  const [vocabUnits, setVocabUnits] = useState<Vocabulary['units']>([])
  const [error, setError] = useState<string | null>(null)
  const [jump, setJump] = useState<string | undefined>(startWordKo)

  // 콘텐츠 파일은 언어 무관(안에 ko/id 둘 다 있음)이라 한 번만 불러온다.
  useEffect(() => {
    Promise.all([getHangul(), getGrammar(), getVocabulary()])
      .then(([h, g, v]) => {
        setHangul(h)
        setGrammar(g)
        setVocabUnits(v.units)
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  // 홈에서 넘어온 단어로 점프 동기화
  useEffect(() => {
    if (startWordKo) setJump(startWordKo)
  }, [startWordKo])

  if (error) {
    return (
      <div className="mt-6 rounded-card border border-red bg-red-tint p-4 text-sm text-red">{error}</div>
    )
  }
  if (!hangul || !grammar) {
    return <p className="mt-6 text-sm text-ink-3">{pick({ ko: '불러오는 중…', id: 'Memuat…' })}</p>
  }

  const free = pick({ ko: '무료', id: 'GRATIS' })
  // 표시 시점에 언어를 반영(언어 전환 시 유닛 라벨도 갱신됨).
  const words: Word[] = vocabUnits.flatMap((u) =>
    u.words.map((w) => ({ ko: w.ko, id_meaning: w.id_meaning, romaja: w.romaja, unit: pick(u.title) })),
  )
  const unitChips = vocabUnits.map((u) => ({ title: pick(u.title), firstKo: u.words[0]?.ko ?? '' }))

  return (
    <div>
      <Eyebrow>{pick({ ko: '한글', id: 'Hangul' })}</Eyebrow>
      <div className="rounded-card border border-line bg-white px-[18px] py-1">
        {hangul.lessons.map((l) => (
          <LessonRow
            key={l.id}
            title={pick(l.title)}
            sub={pick(l.category)}
            free={free}
            onClick={() => onOpenLesson(l, hangul.jamo)}
          />
        ))}
      </div>

      <Eyebrow>{pick({ ko: '문법', id: 'Tata bahasa' })}</Eyebrow>
      <div className="rounded-card border border-line bg-white px-[18px] py-1">
        {grammar.lessons.map((l) => (
          <LessonRow
            key={l.id}
            title={pick(l.title)}
            sub={pick(l.category)}
            free={free}
            onClick={() => onOpenLesson(l)}
          />
        ))}
      </div>

      <Eyebrow>{pick({ ko: '단어장', id: 'Kosakata' })}</Eyebrow>
      {/* 유닛 바로가기 칩 (가로 스크롤) */}
      <div className="mb-2.5 flex gap-2 overflow-x-auto pb-1">
        {unitChips.map((u) => (
          <button
            key={u.firstKo}
            onClick={() => setJump(u.firstKo)}
            className="flex-shrink-0 rounded-full border border-line bg-white px-3 py-1.5 text-[12.5px] font-semibold text-ink-2"
          >
            {u.title}
          </button>
        ))}
      </div>
      <Flashcard words={words} initialWordKo={jump} />
    </div>
  )
}
