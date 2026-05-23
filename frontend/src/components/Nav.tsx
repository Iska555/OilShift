'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'
import type { TranslationKey } from '@/lib/i18n'

const NAV_LINKS: { key: TranslationKey; href: string }[] = [
  { key: 'nav.overview', href: '/' },
  { key: 'nav.divergence', href: '/divergence' },
  { key: 'nav.forecast', href: '/forecast' },
  { key: 'nav.anomalies', href: '/anomalies' },
  { key: 'nav.sectors', href: '/sectors' },
  { key: 'nav.methodology', href: '/methodology' },
]

export default function Nav() {
  const { lang, setLang } = useLanguage()

  return (
    <nav className="bg-white border-b border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1A1A1A] tracking-tight shrink-0">
          Azerbaijan Economic Intelligence
        </span>

        <div className="flex items-center gap-8">
          {NAV_LINKS.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A]"
            >
              {t(lang, key)}
            </Link>
          ))}

          {/* Language toggle */}
          <div className="flex items-center ml-2">
            <button
              onClick={() => setLang('en')}
              className={`text-xs px-1 pb-0.5 ${
                lang === 'en'
                  ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
                  : 'text-[#6B6B6B] font-normal'
              }`}
              style={{ transition: 'color 150ms' }}
            >
              <span className="flex items-center gap-1.5">
                <Image src="/flag-en.png" alt="EN" width={20} height={14} className="inline-block" />
                EN
              </span>
            </button>
            <div className="w-px h-3 bg-[#E5E5E5] mx-1.5" />
            <button
              onClick={() => setLang('az')}
              className={`text-xs px-1 pb-0.5 ${
                lang === 'az'
                  ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
                  : 'text-[#6B6B6B] font-normal'
              }`}
              style={{ transition: 'color 150ms' }}
            >
              <span className="flex items-center gap-1.5">
                <Image src="/flag-az.png" alt="AZ" width={20} height={14} className="inline-block" />
                AZ
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
