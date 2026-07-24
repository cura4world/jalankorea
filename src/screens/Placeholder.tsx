// 아직 구현하지 않은 탭의 임시 화면. 다음 조각에서 실제 내용으로 교체된다.
import { useI18n } from '../lib/i18n'
import type { Bilingual } from '../lib/content'

export default function Placeholder({ title, note }: { title: Bilingual; note: Bilingual }) {
  const { pick } = useI18n()
  return (
    <div className="mt-1.5">
      <h1 className="text-[26px] font-bold tracking-tight text-ink">{pick(title)}</h1>
      <div className="mt-4 rounded-card border border-line bg-white p-5">
        <div className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-blue">
          {pick({ ko: '준비 중', id: 'Segera hadir' })}
        </div>
        <p className="text-sm leading-relaxed text-ink-2">{pick(note)}</p>
      </div>
    </div>
  )
}
