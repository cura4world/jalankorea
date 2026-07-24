// 학습 진도 저장. 서버 없이 기기 안(localStorage)에만 기록한다.
// 홈의 "이어서 하기"가 실제 마지막 학습 과와 시점을 보여주기 위한 것.
import type { Lang } from './content'

const KEY = 'jk.lastLesson'

export interface LastLesson {
  id: string // 레슨 id (예: gram1, hangul)
  at: number // 마지막으로 연 시각(ms)
}

export function markLessonOpened(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ id, at: Date.now() }))
  } catch {
    // 저장이 막힌 환경은 무시 (진도만 기록 못 할 뿐 학습은 정상)
  }
}

export function getLastLesson(): LastLesson | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LastLesson) : null
  } catch {
    return null
  }
}

// 마지막 학습 시점을 언어에 맞는 짧은 문구로. (방금 / N분 전 / 어제 / N일 전)
export function formatSince(at: number, lang: Lang): string {
  const min = Math.floor((Date.now() - at) / 60000)
  const t = {
    ko: { now: '방금', min: (n: number) => `${n}분 전`, hour: (n: number) => `${n}시간 전`, yst: '어제', day: (n: number) => `${n}일 전` },
    id: { now: 'baru saja', min: (n: number) => `${n} menit lalu`, hour: (n: number) => `${n} jam lalu`, yst: 'kemarin', day: (n: number) => `${n} hari lalu` },
  }[lang]
  if (min < 1) return t.now
  if (min < 60) return t.min(min)
  const hr = Math.floor(min / 60)
  if (hr < 24) return t.hour(hr)
  const day = Math.floor(hr / 24)
  if (day === 1) return t.yst
  return t.day(day)
}
