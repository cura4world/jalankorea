// 앱 뼈대: 상단 헤더(제목 + 언어전환) · 화면 · 하단 탭 4개 · 레슨 오버레이.
// v9 설계 원칙: 하단 탭은 분류(홈/학습/시험/한국생활), 이모지 금지, 딥 블루 절제.
import { useState } from 'react'
import type { Hangul, Lesson } from './lib/content'
import { useI18n } from './lib/i18n'
import { markLessonOpened } from './lib/progress'
import HomeScreen from './screens/HomeScreen'
import LearnScreen from './screens/LearnScreen'
import Placeholder from './screens/Placeholder'
import LessonViewer from './components/LessonViewer'
import { ExamIcon, GlobeIcon, HomeIcon, LearnIcon, LifeIcon, MeIcon } from './components/icons'

type Tab = 'home' | 'learn' | 'exam' | 'life' | 'me'

const TABS: Array<{ id: Tab; icon: typeof HomeIcon; label: { ko: string; id: string } }> = [
  { id: 'home', icon: HomeIcon, label: { ko: '홈', id: 'Beranda' } },
  { id: 'learn', icon: LearnIcon, label: { ko: '학습', id: 'Belajar' } },
  { id: 'exam', icon: ExamIcon, label: { ko: '시험', id: 'Ujian' } },
  { id: 'life', icon: LifeIcon, label: { ko: '한국생활', id: 'Hidup di Korea' } },
  { id: 'me', icon: MeIcon, label: { ko: '내정보', id: 'Saya' } },
]

export default function App() {
  const { lang, toggle, pick } = useI18n()
  const [tab, setTab] = useState<Tab>('home')
  const [lesson, setLesson] = useState<{ lesson: Lesson; jamo?: Hangul['jamo'] } | null>(null)
  const [startWordKo, setStartWordKo] = useState<string | undefined>()

  const openLesson = (l: Lesson, jamo?: Hangul['jamo']) => {
    markLessonOpened(l.id)
    setLesson({ lesson: l, jamo })
  }

  // 홈의 "오늘의 한국어" → 학습 탭 단어장을 그 단어로 연다.
  const openWord = (ko: string) => {
    setStartWordKo(ko)
    setTab('learn')
  }

  const current = TABS.find((x) => x.id === tab)!

  return (
    <div className="relative mx-auto flex h-full max-w-[420px] flex-col overflow-hidden bg-page">
      {/* 상단 헤더 */}
      <header className="z-10 flex flex-shrink-0 items-center justify-between px-5 pb-3 pt-4">
        <h1 className="text-[21px] font-bold tracking-tight text-ink">{pick(current.label)}</h1>
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink-2"
        >
          <GlobeIcon size={13} />
          <span>{lang === 'id' ? 'ID' : 'KO'}</span>
        </button>
      </header>

      {/* 화면 본문 */}
      <main className="flex-1 overflow-y-auto px-5 pb-24">
        {tab === 'home' && <HomeScreen onOpenLesson={openLesson} onOpenWord={openWord} />}
        {tab === 'learn' && <LearnScreen onOpenLesson={openLesson} startWordKo={startWordKo} />}
        {tab === 'exam' && (
          <Placeholder
            title={{ ko: '시험', id: 'Ujian' }}
            note={{
              ko: '모의고사와 문제 풀이는 다음 단계에서 연결합니다.',
              id: 'Simulasi ujian dan latihan soal akan ditambahkan pada tahap berikutnya.',
            }}
          />
        )}
        {tab === 'life' && (
          <Placeholder
            title={{ ko: '한국생활', id: 'Hidup di Korea' }}
            note={{
              ko: '급여 계산기와 생활 정보는 다음 단계에서 연결합니다.',
              id: 'Kalkulator gaji dan info kehidupan akan ditambahkan pada tahap berikutnya.',
            }}
          />
        )}
        {tab === 'me' && (
          <Placeholder
            title={{ ko: '내정보', id: 'Saya' }}
            note={{
              ko: '학습 진도와 설정은 다음 단계에서 연결합니다.',
              id: 'Progres belajar dan pengaturan akan ditambahkan pada tahap berikutnya.',
            }}
          />
        )}
      </main>

      {/* 하단 탭 */}
      <nav className="absolute inset-x-0 bottom-0 z-20 flex border-t border-line bg-white/95 px-1 pb-2 pt-2 backdrop-blur">
        {TABS.map((x) => {
          const Icon = x.icon
          const on = x.id === tab
          return (
            <button
              key={x.id}
              onClick={() => setTab(x.id)}
              className={`flex flex-1 flex-col items-center gap-1 py-1 text-[11px] font-semibold ${on ? 'text-blue' : 'text-ink-3'}`}
            >
              <Icon size={22} />
              <span>{pick(x.label)}</span>
            </button>
          )
        })}
      </nav>

      {/* 레슨 오버레이 (한글·문법 공용) */}
      {lesson && (
        <LessonViewer lesson={lesson.lesson} jamo={lesson.jamo} onClose={() => setLesson(null)} />
      )}
    </div>
  )
}
