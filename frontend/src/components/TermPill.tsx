'use client'

import { useLanguage } from '@/context/LanguageContext'

interface Props {
  enText: string
  azText: string
}

export default function TermPill({ enText, azText }: Props) {
  const { lang } = useLanguage()
  const text = lang === 'az' ? azText : enText
  return (
    <span
      className="relative inline-block group cursor-help ml-1"
      style={{ verticalAlign: 'middle' }}
    >
      <span className="inline-flex items-center justify-center w-[14px] h-[14px] rounded-full border border-[#CCCCCC] text-[9px] text-[#6B6B6B] leading-none select-none hover:border-[#1A1A1A] hover:text-[#1A1A1A]">
        ?
      </span>
      <span
        className="pointer-events-none absolute bottom-full left-0 mb-2 hidden group-hover:block"
        style={{ width: 240, zIndex: 50 }}
      >
        <span className="block bg-white border border-[#E5E5E5] p-3 text-xs text-[#6B6B6B] leading-relaxed shadow-sm">
          {text}
        </span>
      </span>
    </span>
  )
}
