import type { CapacitorConfig } from '@capacitor/cli'

// server 항목을 두지 않는다.
// 외부 URL을 로드하면 오프라인에서 작동하지 않고,
// 플레이 스토어 심사에서 "웹사이트 껍데기"로 반려될 수 있다.
const config: CapacitorConfig = {
  appId: 'world.cura.jalankorea',
  appName: 'Jalan Korea',
  webDir: 'dist',
  android: {
    backgroundColor: '#FFFFFF',
  },
}

export default config
