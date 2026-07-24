# 구축 지시서 (Claude Code용)

이 문서는 Claude Code에 그대로 전달하기 위한 것이다.
설정 파일은 이미 만들어져 검증을 마쳤다. 처음부터 만들지 말고 있는 것을 쓴다.

## 이미 검증된 것

- `npm install` → `npm run build` 통과 확인
- 두 배포 모드가 각각 올바른 경로를 내는 것 확인
  (`VITE_BASE=/저장소이름/` → `/저장소이름/assets/...`, `VITE_BASE=./` → `./assets/...`)
- 콘텐츠 JSON 6개가 `dist/content/`로 복사되는 것 확인
- 워크플로우 YAML 2개 문법 검증 통과
- 디자인 토큰(딥 블루, Pretendard, 모션 줄이기)이 CSS에 반영되는 것 확인

## 이 프로젝트의 전제

- **서버를 두지 않는다.** 콘텐츠는 앱에 내장되고 오프라인에서 작동한다.
- **외부 URL을 로드하지 않는다.** `capacitor.config.ts`에 `server` 항목을 추가하지 말 것.
  웹뷰로 외부 사이트를 띄우는 구조는 구글 플레이 "최소한의 기능" 정책에 걸려 반려될 수 있고,
  오프라인 작동과 인앱결제도 불가능해진다.
- 사용자는 코딩을 하지 않는다. 코드 자체를 설명하지 말고
  "가능한가 / 유지비가 드는가" 수준으로 보고한다.
- 한국어로 소통한다.

## 1단계 — 설치와 첫 빌드

```
npm install
npm run build
```

빌드가 통과하면 `npm run dev`로 로컬에서 열어 "설치 확인" 화면과
단어 12개, "안전모 / helm keselamatan"이 보이는지 확인한다.
이 화면은 콘텐츠 연결을 눈으로 보기 위한 임시 화면이며 나중에 교체된다.

## 2단계 — 깃허브 연결

저장소는 `cura4world/jalankorea` (비공개)로 이미 만들어져 있고,
이전에 웹으로 올린 파일이 들어 있다. 이 폴더의 내용으로 덮어쓴다.

로컬에 Git이 설정돼 있지 않으면 먼저 확인하고,
없으면 설치와 인증(Personal Access Token 또는 GitHub CLI) 방법을
초보자 기준으로 안내한다. 사용자는 명령줄에 익숙하지 않다.

푸시 후 저장소 Settings → Pages에서 Source를 "GitHub Actions"로 설정해야
`deploy.yml`이 동작한다. 이 설정은 웹에서 사람이 직접 해야 하므로 안내할 것.

배포되면 주소는 `https://cura4world.github.io/jalankorea/` 가 된다.
폰 브라우저로 열어 확인한다.

## 3단계 — Capacitor 안드로이드 추가

```
npx cap add android
```

`android/` 폴더가 생성된다. 그다음 서명 설정을 넣는다.

`android/app/build.gradle`의 `android { }` 블록 안에 추가:

```gradle
signingConfigs {
    release {
        storeFile file("release.keystore")
        storePassword System.getenv("KEYSTORE_PASSWORD")
        keyAlias System.getenv("KEY_ALIAS")
        keyPassword System.getenv("KEY_PASSWORD")
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
    }
}
```

같은 파일 `defaultConfig` 안의 `versionCode`를 아래처럼 바꾼다.
고정값이면 재설치 시 "앱이 설치되지 않음" 오류가 난다.

```gradle
versionCode project.hasProperty('versionCode') ? project.versionCode.toInteger() : 1
```

`android/app/src/main/AndroidManifest.xml`에 인터넷 권한이 있는지 확인한다.
콘텐츠는 내장이지만 나중에 시험 일정 갱신에 필요하다.
권한은 나중에 추가하면 APK 재빌드와 전원 재설치가 필요하므로 지금 넣어둔다.

## 4단계 — 키스토어 (사용자가 직접)

키스토어는 앱 서명 파일이며 **잃어버리면 앱 업데이트가 영원히 불가능해진다.**
Claude Code가 만들지 말고, 사용자가 직접 만들도록 아래를 안내한다.

```
keytool -genkey -v -keystore jalankorea.keystore -alias jalankorea \
  -keyalg RSA -keysize 2048 -validity 10000
```

만든 뒤:
1. 파일을 안전한 곳에 백업 (클라우드 + 외장 저장소 두 곳)
2. 비밀번호를 따로 기록
3. **저장소에 올리지 않는다** (`.gitignore`에 이미 포함돼 있다)

GitHub Secrets 등록 (저장소 Settings → Secrets and variables → Actions):

| 이름 | 값 |
| --- | --- |
| `KEYSTORE_BASE64` | 키스토어를 base64로 변환한 문자열 |
| `KEYSTORE_PASSWORD` | 키스토어 비밀번호 |
| `KEY_ALIAS` | `jalankorea` |
| `KEY_PASSWORD` | 키 비밀번호 |

base64 변환 (윈도우 PowerShell):
```
[Convert]::ToBase64String([IO.File]::ReadAllBytes("jalankorea.keystore")) | Set-Clipboard
```

## 5단계 — 안드로이드 빌드 확인

GitHub Actions 탭에서 "Build Android"를 수동 실행한다.
성공하면 artifacts에서 APK를 받아 폰에 설치해 열리는지 확인한다.

여기까지 되면 이후로는 코드만 고치면
- 웹 미리보기: push하면 자동 반영
- 앱: 태그를 밀면(`git tag v0.1.0 && git push --tags`) 새 APK/AAB 생성

## 6단계 이후 — 화면 구현

`docs/JalanKorea_v9_시범앱.html`이 시각 기준이다.
이 HTML을 React로 옮기되, 콘텐츠는 하드코딩하지 말고
`src/lib/content.ts`의 로더로 JSON에서 읽는다.

**작업 순서는 학습 콘텐츠 우선이다.** 시험이나 한국생활보다
한글·문법·단어장을 먼저 완성한다. 학습 콘텐츠는 저작권 제약이 없는
자체 제작 영역이라 외부 답변을 기다릴 필요가 없고, 분량이 가장 크다.

v9에서 확정된 설계 원칙:
- 홈에 눌리지 않는 요소를 두지 않는다
- 하단 탭은 분류, 홈 그리드는 지름길 (탭 이름 복제 금지)
- 이모지 금지, 선 아이콘 1.8px 통일
- 딥 블루 하나로 절제, 정답 초록·오답 빨강만 예외
- 인도네시아어가 한국어보다 30~40% 길다. 긴 쪽 기준으로 깨지지 않게 할 것

## 작업 방식

- 파일을 채팅에 출력하지 말고 직접 수정한다. 사용자가 붙여넣을 일이 없어야 한다.
- 수정 후 `npm run build`로 검증한 뒤 커밋한다.
- 커밋 메시지는 무엇을 왜 바꿨는지 한국어 한 줄.
- push 후 Actions 빌드 성공을 확인하고, 실패하면 로그를 읽어 원인까지 찾아 고친다.
- 큰 변경은 시작 전에 설명하고 확인을 받는다. 작은 수정은 바로 하고 결과만 알린다.
