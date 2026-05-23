'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'
import type { TranslationKey } from '@/lib/i18n'
import ExplainerToggle from '@/components/ExplainerToggle'

interface Props {
  crossoverYear: string
  shocksLabel: string
}

interface ModuleCard {
  titleKey: TranslationKey
  descKey: TranslationKey
  href: string
}

const MODULE_CARDS: ModuleCard[] = [
  { titleKey: 'home.card.divergence.title', descKey: 'home.card.divergence.desc', href: '/divergence' },
  { titleKey: 'home.card.forecast.title',   descKey: 'home.card.forecast.desc',   href: '/forecast' },
  { titleKey: 'home.card.anomalies.title',  descKey: 'home.card.anomalies.desc',  href: '/anomalies' },
]

export default function HomeContent({ crossoverYear, shocksLabel }: Props) {
  const { lang } = useLanguage()

  return (
    <main>
      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-6 pt-20 pb-16 border-b border-[#E5E5E5]">
        <p className="text-xs uppercase tracking-[0.15em] text-[#6B6B6B] mb-5">
          {t(lang, 'home.eyebrow')}
        </p>

        {lang === 'az' ? (
          <h1 className="text-5xl tracking-tight text-[#1A1A1A] mb-5 max-w-2xl leading-[1.15]">
            <span className="font-normal">{t(lang, 'home.h1.az.p1')} </span>
            <span className="font-bold">{t(lang, 'home.h1.az.p2')}</span>
          </h1>
        ) : (
          <h1 className="text-5xl font-semibold tracking-tight text-[#1A1A1A] mb-5 max-w-2xl leading-[1.1]">
            {t(lang, 'home.h1')}
          </h1>
        )}

        <p className="text-base text-[#6B6B6B] max-w-xl leading-relaxed mb-14">
          {t(lang, 'home.subtitle')}
        </p>

        {/* Stat callouts with explainers */}
        <div className="grid grid-cols-3 border border-[#E5E5E5] divide-x divide-[#E5E5E5]">
          <div className="px-8 py-6 flex flex-col overflow-visible">
            <div>
              <p className="text-5xl font-semibold text-[#1A1A1A] mb-1.5">30.4%</p>
              <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
                {t(lang, 'home.stat.oilShare')}
              </p>
            </div>
            <div className="mt-4">
              <ExplainerToggle
                titleKey="explainer.oilGdpShare.title"
                bodyKey="explainer.oilGdpShare.body"
              />
            </div>
          </div>
          <div className="px-8 py-6 flex flex-col overflow-visible">
            <div>
              <p className="text-5xl font-semibold text-[#1A1A1A] mb-1.5">{crossoverYear}</p>
              <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
                {t(lang, 'home.stat.crossoverYear')}
              </p>
            </div>
            <div className="mt-4">
              <ExplainerToggle
                titleKey="explainer.crossoverYear.title"
                bodyKey="explainer.crossoverYear.body"
              />
            </div>
          </div>
          <div className="px-8 py-6 flex flex-col overflow-visible">
            <div>
              <p className="text-5xl font-semibold text-[#1A1A1A] mb-1.5">{shocksLabel}</p>
              <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
                {t(lang, 'home.stat.shocksValidated')}
              </p>
            </div>
            <div className="mt-4">
              <ExplainerToggle
                titleKey="explainer.shockValidation.title"
                bodyKey="explainer.shockValidation.body"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Module cards */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 border-b border-[#E5E5E5]">
        <div className="grid grid-cols-3 gap-6">
          {MODULE_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="border border-[#E5E5E5] p-8 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-base font-semibold text-[#1A1A1A] mb-3">
                  {t(lang, card.titleKey)}
                </h2>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  {t(lang, card.descKey)}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm text-[#6B6B6B]">
                <span>{t(lang, 'home.card.viewAnalysis')}</span>
                <ArrowRight size={14} strokeWidth={1.5} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Key finding */}
      <section className="border-y border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="flex gap-16">
            <div style={{ flex: '0 0 60%' }}>
              <p className="text-xs uppercase tracking-[0.15em] text-[#6B6B6B] mb-5">
                {t(lang, 'home.finding.headline')}
              </p>
              <p className="text-2xl font-light text-[#1A1A1A] leading-relaxed">
                {t(lang, 'home.finding.pullquote')}
              </p>
            </div>
            <div style={{ flex: '0 0 40%' }}>
              {[
                { val: '2033', labelKey: 'home.finding.stat1.label' as const },
                { val: '100%', labelKey: 'home.finding.stat2.label' as const },
                { val: '−2.5%/yr', labelKey: 'home.finding.stat3.label' as const },
              ].map((s) => (
                <div key={s.val} className="border-t border-[#E5E5E5] py-4">
                  <p className="text-3xl font-bold text-[#1A1A1A] tabular-nums mb-1">{s.val}</p>
                  <p className="text-xs text-[#6B6B6B]">{t(lang, s.labelKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
