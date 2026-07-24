// 단어장 플래시카드. 카드를 눌러 뜻을 뒤집어 보고, 이전/다음/발음으로 넘긴다.
import { useEffect, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { speak } from '../lib/speak'
import { ChevronLeft, SpeakerIcon } from './icons'

export interface Word {
  ko: string
  id_meaning: string
  romaja: string
  unit?: string // 소속 단어 유닛 제목(표시용)
}

// initialWordKo: 홈의 "오늘의 한국어"에서 특정 단어로 바로 열 때 쓴다.
export default function Flashcard({ words, initialWordKo }: { words: Word[]; initialWordKo?: string }) {
  const { t, pick } = useI18n()
  const [i, setI] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (!initialWordKo) return
    const idx = words.findIndex((w) => w.ko === initialWordKo)
    if (idx >= 0) {
      setI(idx)
      setFlipped(false)
    }
  }, [initialWordKo, words])

  if (words.length === 0) return null
  const w = words[i]

  const go = (next: number) => {
    setFlipped(false)
    setI((cur) => (cur + next + words.length) % words.length)
  }

  return (
    <div>
      <button
        onClick={() => setFlipped((f) => !f)}
        className="relative flex h-[186px] w-full flex-col items-center justify-center overflow-hidden rounded-card border border-line bg-white px-5 text-center"
      >
        {w.unit && (
          <div className="absolute top-4 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
            {w.unit}
          </div>
        )}
        {flipped ? (
          <div className="text-2xl font-semibold tracking-tight text-blue">{w.id_meaning}</div>
        ) : (
          <>
            <div className="text-[31px] font-semibold tracking-tight text-ink">{w.ko}</div>
            <div className="mt-2 text-[13px] font-medium text-ink-3">{w.romaja}</div>
          </>
        )}
        <div className="absolute bottom-4 text-[11px] font-medium text-ink-3">
          {flipped ? `${i + 1} / ${words.length}` : pick({ ko: '눌러서 뜻 보기', id: 'Ketuk untuk arti' })}
        </div>
      </button>

      <div className="mt-2.5 flex gap-2.5">
        <button
          onClick={() => go(-1)}
          className="flex flex-1 items-center justify-center rounded-xl border border-line bg-white py-3.5 text-ink transition-transform active:scale-[.985]"
          aria-label={t('bPrev')}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => speak(w.ko)}
          className="flex flex-1 items-center justify-center rounded-xl border border-line bg-white py-3.5 text-ink transition-transform active:scale-[.985]"
          aria-label="발음 듣기"
        >
          <SpeakerIcon size={16} />
        </button>
        <button
          onClick={() => go(1)}
          className="flex-[2] rounded-xl bg-blue py-3.5 text-[15.5px] font-semibold text-white transition-transform active:scale-[.985]"
        >
          {t('bNext')}
        </button>
      </div>
    </div>
  )
}
