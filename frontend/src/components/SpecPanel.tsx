'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

interface Props {
  label: string
  labelAz: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function SpecPanel({ label, labelAz, children, defaultOpen = false }: Props) {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(defaultOpen)
  const displayLabel = lang === 'az' ? labelAz : label

  return (
    <div className="w-full border border-[#E5E5E5]">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-[14px] text-left select-none"
      >
        <span
          className="text-xs tracking-widest text-[#6B6B6B]"
          style={{ fontVariant: 'small-caps' }}
        >
          {displayLabel}
        </span>
        <span
          className="text-[#6B6B6B] text-sm ml-4"
          style={{
            display: 'inline-block',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms',
          }}
        >
          ↓
        </span>
      </button>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? 1000 : 0,
          transition: 'max-height 400ms ease',
          borderTop: open ? '1px solid #E5E5E5' : 'none',
        }}
      >
        <div
          className="px-5 py-5 text-sm leading-relaxed text-[#1A1A1A]"
          style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
