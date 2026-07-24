// 레슨 전체화면 뷰어. 한글 과와 문법 과가 같은 본문 블록 구조를 쓰므로 공용.
// 콘텐츠 JSON의 body[] 블록을 종류별로 렌더한다.
import type { Hangul, Jamo, Lesson } from '../lib/content'
import { useI18n } from '../lib/i18n'
import { speak } from '../lib/speak'
import { CloseIcon, SpeakerIcon } from './icons'

interface Props {
  lesson: Lesson
  jamo?: Hangul['jamo']
  onClose: () => void
}

// 본문 문단의 <b> 강조는 우리 콘텐츠에서 온 신뢰된 값이라 그대로 렌더한다.
function Rich({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}

function JamoGrid({ items }: { items: Jamo[] }) {
  return (
    <div className="mt-3 grid grid-cols-5 gap-2">
      {items.map((j) => (
        <button
          key={j.char}
          onClick={() => speak(j.char)}
          className="rounded-xl border border-line bg-white py-3 text-center transition-transform active:scale-95 active:border-blue"
        >
          <div className="text-[22px] font-bold text-ink">{j.char}</div>
          <div className="mt-0.5 text-[10px] font-medium text-ink-3">{j.romaja}</div>
        </button>
      ))}
    </div>
  )
}

export default function LessonViewer({ lesson, jamo, onClose }: Props) {
  const { pick } = useI18n()

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-page">
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-line bg-white px-5 py-3.5">
        <button onClick={onClose} className="flex p-0.5 text-ink-3" aria-label="닫기">
          <CloseIcon size={22} />
        </button>
        <span className="text-xs font-bold uppercase tracking-wide text-ink-3">
          {pick(lesson.category)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-12 pt-6">
        <h1 className="text-[23px] font-bold leading-tight tracking-tight text-ink">
          {pick(lesson.title)}
        </h1>
        <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-2">{pick(lesson.lede)}</p>

        {lesson.body.map((block, i) => (
          <section key={i} className="mt-7">
            {block.h && <h3 className="mb-2.5 text-base font-bold tracking-tight text-ink">{pick(block.h)}</h3>}

            {block.p && (
              <p className="text-[14.5px] leading-loose text-ink-2">
                <Rich html={pick(block.p)} />
              </p>
            )}

            {block.jamo === 'cons' && jamo && <JamoGrid items={jamo.consonants} />}
            {block.jamo === 'vows' && jamo && <JamoGrid items={jamo.vowels} />}
            {block.jamo === 'comp' && jamo?.compound_vowels && <JamoGrid items={jamo.compound_vowels} />}

            {block.phrases && (
              <div className="mt-2 space-y-2.5">
                {block.phrases.map(([ko, meaning], k) => (
                  <div key={k} className="rounded-2xl border border-line bg-white px-4 py-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-base font-semibold tracking-tight text-ink">{ko}</div>
                        <div className="mt-1.5 text-[13.5px] font-medium text-blue">{meaning}</div>
                      </div>
                      <button
                        onClick={() => speak(ko)}
                        className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-blue-tint px-2.5 py-1.5 text-[11.5px] font-semibold text-blue"
                        aria-label="발음 듣기"
                      >
                        <SpeakerIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {block.box && (
              <div className="rounded-2xl border border-line bg-white p-4">
                <div className="mb-2 text-[11.5px] font-bold uppercase tracking-wide text-blue">
                  {pick(block.box)}
                </div>
                {block.bp && <p className="text-sm leading-relaxed text-ink-2">{pick(block.bp)}</p>}
              </div>
            )}

            {block.warn && (
              <div className="rounded-2xl border border-[#F0DFB4] bg-[#FFF8E8] p-4">
                <div className="mb-2 text-[11.5px] font-bold uppercase tracking-wide text-[#9A6B08]">
                  {pick(block.warn)}
                </div>
                {block.wp && <p className="text-sm leading-relaxed text-[#6B4E10]">{pick(block.wp)}</p>}
              </div>
            )}
          </section>
        ))}

        <div className="mt-7 border-t border-line pt-4 text-xs leading-relaxed text-ink-3">
          {pick(lesson.source_line)}
        </div>
      </div>
    </div>
  )
}
