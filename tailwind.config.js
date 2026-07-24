/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 시범 앱 v9에서 확정된 색. 딥 블루 하나로 절제하고
        // 정답 초록·오답 빨강만 예외로 둔다.
        blue:  { DEFAULT: '#12457F', tint: '#EDF2F9' },
        green: { DEFAULT: '#1F7A54', tint: '#E9F5EF' },
        red:   { DEFAULT: '#C2303C', tint: '#FBECEC' },
        ink:   { DEFAULT: '#16181D', 2: '#4A5159', 3: '#858D96' },
        line:  { DEFAULT: '#E4E7EB', 2: '#EFF1F4' },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
