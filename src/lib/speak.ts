// 한국어 발음 재생. 시범판은 휴대폰 내장 TTS를 쓴다(오프라인 동작, 별도 서버 없음).
export function speak(text: string) {
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ko-KR'
    u.rate = 0.95
    synth.speak(u)
  } catch {
    // TTS를 지원하지 않는 환경은 조용히 무시한다
  }
}
