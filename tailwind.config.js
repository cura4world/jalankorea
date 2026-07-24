/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 시범 앱 v9에서 확정된 색. 딥 블루 하나로 절제하고
        // 정답 초록·오답 빨강만 예외로 둔다.
        blue:  { DEFAULT: '#12457F', 2: '#0E3A6C', tint: '#EEF3F9' },
        green: { DEFAULT: '#1F7A54', tint: '#EDF6F1' },
        red:   { DEFAULT: '#C2303C', tint: '#FBEFF0' },
        ink:   { DEFAULT: '#131A24', 2: '#4A5563', 3: '#8C97A5' },
        line:  { DEFAULT: '#D5DDE7', 2: '#E8EDF3' },
        page:  '#E3EAF2', // 앱 바탕 (연한 블루그레이)
      },
      borderRadius: {
        card: '16px',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
