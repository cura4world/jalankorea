import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// VITE_BASE는 배포 워크플로우가 넘긴다.
//   웹 미리보기: /저장소이름/   (GitHub Pages 하위 경로)
//   앱 내장:     ./            (WebView 상대경로)
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
