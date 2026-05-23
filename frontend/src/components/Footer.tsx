'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'

export default function Footer() {
  const { lang } = useLanguage()

  return (
    <footer className="border-t border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6 py-6 text-center">
        <p className="text-xs text-[#6B6B6B]">{t(lang, 'footer.text')}</p>
      </div>
    </footer>
  )
}
