'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'
import type { TranslationKey } from '@/lib/i18n'

interface Props {
  titleKey: TranslationKey
  bodyKey: TranslationKey
  defaultOpen?: boolean
}

export default function ExplainerToggle({ titleKey, bodyKey, defaultOpen = false }: Props) {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`inline-flex items-center gap-1 px-[10px] py-1 rounded-full text-xs border transition-all duration-150 select-none ${
            open
              ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
              : 'bg-[#F8F8F6] text-[#6B6B6B] border-[#E5E5E5] hover:bg-[#EFEFEF] hover:text-[#1A1A1A] hover:border-[#CCCCCC]'
          }`}
        >
          {t(lang, 'explainer.triggerLabel')}
          <ChevronDown
            size={12}
            className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <div
        className="overflow-hidden"
        style={{
          maxHeight: open ? 500 : 0,
          transition: 'max-height 300ms ease',
        }}
      >
        <div className="bg-[#FAFAFA] border-l-[3px] border-[#1A1A1A] px-5 py-4 mt-2">
          <p className="text-xs uppercase tracking-[0.12em] text-[#6B6B6B] mb-2">
            {t(lang, titleKey)}
          </p>
          <p className="text-sm text-[#1A1A1A] leading-[1.7]" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
            {t(lang, bodyKey)}
          </p>
        </div>
      </div>
    </div>
  )
}
