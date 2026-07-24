import type { CapacitorConfig } from '@capacitor/cli'

// 출시용(기본): server 항목이 절대 들어가지 않는다.
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

// 개발용 셸: 환경변수 JK_MODE=dev 로 sync 할 때만 외부 URL을 로드한다.
// (개발 중 화면을 고칠 때마다 APK를 새로 만들지 않고, 앱을 다시 열면 최신 웹이 보이게)
// 이 분기는 출시 빌드(JK_MODE 미설정)에서는 실행되지 않으므로 server가 포함되지 않는다.
if (process.env.JK_MODE === 'dev') {
  config.server = {
    url: 'https://cura4world.github.io/jalankorea/',
    cleartext: false,
  }
}

export default config
