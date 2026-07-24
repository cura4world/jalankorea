// 선 아이콘 모음. v9 기준: 선 굵기 1.8px, 채움 없음, 둥근 끝. 이모지 금지.
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Base({ size = 22, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const HomeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 10.2l9-7 9 7V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </Base>
)

export const LearnIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
  </Base>
)

export const ExamIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 11l3 3 8-8" />
    <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9" />
  </Base>
)

export const LifeIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-6h6v6" />
  </Base>
)

export const SpeakerIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M11 5L6 9H2v6h4l5 4z" />
    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
  </Base>
)

export const ChevronRight = (p: IconProps) => (
  <Base {...p}>
    <path d="M9 18l6-6-6-6" />
  </Base>
)

export const ChevronLeft = (p: IconProps) => (
  <Base {...p}>
    <path d="M15 18l-6-6 6-6" />
  </Base>
)

export const CloseIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Base>
)

export const GlobeIcon = (p: IconProps) => (
  <Base {...p} strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" />
  </Base>
)
