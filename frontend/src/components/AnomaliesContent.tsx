'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'
import AnomalyCardiogram from '@/components/charts/AnomalyCardiogram'
import SpecPanel from '@/components/SpecPanel'

const CASE_YEARS = [1994, 2008, 2015, 2020] as const

type CaseYear = (typeof CASE_YEARS)[number]

const TITLE_KEYS: Record<CaseYear, 'anomaly.case.1994.title' | 'anomaly.case.2008.title' | 'anomaly.case.2015.title' | 'anomaly.case.2020.title'> = {
  1994: 'anomaly.case.1994.title',
  2008: 'anomaly.case.2008.title',
  2015: 'anomaly.case.2015.title',
  2020: 'anomaly.case.2020.title',
}

const TEXT_KEYS: Record<CaseYear, 'anomaly.case.1994.text' | 'anomaly.case.2008.text' | 'anomaly.case.2015.text' | 'anomaly.case.2020.text'> = {
  1994: 'anomaly.case.1994.text',
  2008: 'anomaly.case.2008.text',
  2015: 'anomaly.case.2015.text',
  2020: 'anomaly.case.2020.text',
}

export default function AnomaliesContent() {
  const { lang } = useLanguage()

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Page header */}
      <section className="flex items-start justify-between mb-12 pb-10 border-b border-[#E5E5E5]">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-[#6B6B6B] mb-3">
            {t(lang, 'anomaly.eyebrow')}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1A1A1A] mb-3 leading-tight">
            {t(lang, 'anomaly.title')}
          </h1>
          <p className="text-sm text-[#6B6B6B] max-w-xl leading-relaxed">
            {t(lang, 'anomaly.subtitle')}
          </p>
        </div>
        <span className="shrink-0 ml-8 mt-1 bg-[#1A1A1A] text-white text-xs px-3 py-1 rounded-full">
          {t(lang, 'anomaly.badge')}
        </span>
      </section>

      {/* Headline metrics */}
      <section className="grid grid-cols-4 border border-[#E5E5E5] divide-x divide-[#E5E5E5] mb-8">
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">4 / 4</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'anomaly.metric.shocks.label')}
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">2020</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'anomaly.metric.recentBreak.label')}
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">5</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'anomaly.metric.series2004.label')}
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">±2 yr</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'anomaly.metric.tolerance.label')}
          </p>
        </div>
      </section>

      {/* Cardiogram */}
      <section className="mb-12 pb-12 border-b border-[#E5E5E5]">
        <p className="text-xs uppercase tracking-[0.12em] text-[#6B6B6B] mb-4">
          {t(lang, 'anomaly.chart.title')}
        </p>
        <AnomalyCardiogram />
        <p className="text-xs text-[#B0B0B0] mt-3">
          GDP growth % · annual · source: World Bank / State Statistics Committee. Pulse markers
          indicate PELT-detected structural breaks at validated shock years.
        </p>
      </section>

      {/* Case study cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {CASE_YEARS.map(year => (
          <div key={year} className="border border-[#E5E5E5] bg-white p-5">
            <p className="text-2xl font-semibold text-[#1A1A1A] tabular-nums mb-1">{year}</p>
            <p className="text-sm font-medium text-[#1A1A1A] mb-3">
              {t(lang, TITLE_KEYS[year])}
            </p>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              {t(lang, TEXT_KEYS[year])}
            </p>
          </div>
        ))}
      </section>

      {/* Explainer */}
      <div className="mb-12">
        <SpecPanel
          label="HOW ANOMALY DETECTION WORKS + PELT SPECIFICATION"
          labelAz="ANOMALİYA AŞKARLAMASI + PELT SPESİFİKASİYASI"
        >
          <p className="text-[#6B6B6B]">{t(lang, 'explainer.anomalyMethod.body')}</p>
        </SpecPanel>
      </div>
    </main>
  )
}
