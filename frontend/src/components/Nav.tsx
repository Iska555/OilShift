'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

function LangToggle({ onSelect }: { onSelect?: () => void }) {
  const { lang, setLang } = useLanguage()
  return (
    <div className="flex items-center">
      <button
        onClick={() => { setLang('en'); onSelect?.() }}
        className={`text-xs px-1 pb-0.5 ${lang === 'en'
          ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
          : 'text-[#6B6B6B] font-normal'}`}
      >
        <span className="flex items-center gap-1.5">
          <Image src="/flag-en.png" alt="EN" width={20} height={14} className="inline-block" />
          EN
        </span>
      </button>
      <div className="w-px h-3 bg-[#E5E5E5] mx-1.5" />
      <button
        onClick={() => { setLang('az'); onSelect?.() }}
        className={`text-xs px-1 pb-0.5 ${lang === 'az'
          ? 'text-[#1A1A1A] font-semibold border-b-2 border-[#1A1A1A]'
          : 'text-[#6B6B6B] font-normal'}`}
      >
        <span className="flex items-center gap-1.5">
          <Image src="/flag-az.png" alt="AZ" width={20} height={14} className="inline-block" />
          AZ
        </span>
      </button>
    </div>
  )
}

export default function Nav() {
  const { lang } = useLanguage()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-[#E5E5E5] relative z-50">
      <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1A1A1A] tracking-tight shrink-0">
          OilShift
        </span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ key, href }) => (
            <Link key={key} href={href} className="text-sm text-[#6B6B6B] hover:text-[#1A1A1A]">
              {t(lang, key)}
            </Link>
          ))}
          <div className="ml-2">
            <LangToggle />
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-[1.5px] bg-[#1A1A1A] origin-center transition-transform duration-200 ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-[#1A1A1A] transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-[1.5px] bg-[#1A1A1A] origin-center transition-transform duration-200 ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 md:hidden"
              style={{ top: 56, zIndex: 40 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute top-full left-0 right-0 bg-white border-b border-[#E5E5E5] md:hidden shadow-sm"
              style={{ zIndex: 41 }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <div className="max-w-[1200px] mx-auto px-6 py-2">
                {NAV_LINKS.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    className="block text-sm text-[#6B6B6B] hover:text-[#1A1A1A] py-3 border-b border-[#E5E5E5] last:border-0"
                    onClick={() => setOpen(false)}
                  >
                    {t(lang, key)}
                  </Link>
                ))}
                <div className="py-4">
                  <LangToggle onSelect={() => setOpen(false)} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
