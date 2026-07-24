import { useEffect, useState } from 'react'
import { getUiStrings, getVocabulary, type Lang } from './lib/content'

// 설치 확인용 임시 화면.
// 콘텐츠 JSON이 실제로 읽히는지 눈으로 보기 위한 것이며,
// 실제 화면 구현이 시작되면 통째로 교체된다.
export default function App() {
  const [lang, setLang] = useState<Lang>('id')
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [sample, setSample] = useState<{ ko: string; meaning: string; romaja: string } | null>(null)

  useEffect(() => {
    Promise.all([getUiStrings(), getVocabulary()])
      .then(([, vocab]) => {
        const words = vocab.units.flatMap((u) => u.words)
        setWordCount(words.length)
        const w = words[0]
        if (w) setSample({ ko: w.ko, meaning: w.id_meaning, romaja: w.romaja })
        setReady(true)
      })
      .catch((e: Error) => setError(e.message))
  }, [])

  return (
    <div className="min-h-full bg-white px-5 py-8 font-sans text-ink">
      <p className="text-xs font-bold uppercase tracking-wider text-blue">Jalan Korea</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">설치 확인</h1>

      {error && (
        <div className="mt-6 rounded-xl border border-red bg-red-tint p-4 text-sm text-red">
          {error}
        </div>
      )}

      {!error && !ready && <p className="mt-6 text-sm text-ink-3">콘텐츠를 불러오는 중…</p>}

      {ready && (
        <>
          <div className="mt-6 rounded-xl border border-line p-4">
            <p className="text-sm text-ink-2">콘텐츠 연결됨 · 단어 {wordCount}개</p>
            {sample && (
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-blue">{sample.ko}</span>
                <span className="text-sm text-ink-3">{sample.romaja}</span>
              </div>
            )}
            {sample && <p className="mt-1 text-sm text-ink-2">{sample.meaning}</p>}
          </div>

          <button
            onClick={() => setLang(lang === 'id' ? 'ko' : 'id')}
            className="mt-4 rounded-full border border-line px-4 py-2 text-sm font-semibold text-blue"
          >
            {lang === 'id' ? '한국어' : 'Indonesia'}
          </button>
        </>
      )}
    </div>
  )
}
