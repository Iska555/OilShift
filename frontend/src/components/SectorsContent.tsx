'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'
import SHAPWaterfall from '@/components/charts/SHAPWaterfall'

type ImportanceRow = {
  sector: string
  mean_shap: number
  [key: string]: unknown
}

type SectorSummaryRow = {
  year: number
  top_sector: string
  top_shap: number
  bottom_sector: string
  bottom_shap: number
  predicted_growth: number
  [key: string]: unknown
}

interface Props {
  importanceData: ImportanceRow[]
  sectorSummary: SectorSummaryRow[]
}

export default function SectorsContent({ importanceData, sectorSummary }: Props) {
  const { lang } = useLanguage()

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Page header */}
      <section className="flex items-start justify-between mb-12 pb-10 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1A1A1A] mb-3 leading-tight">
            {t(lang, 'sectors.title')}
          </h1>
          <p className="text-sm text-[#6B6B6B] max-w-xl leading-relaxed">
            {t(lang, 'sectors.subtitle')}
          </p>
        </div>
        <div className="text-right text-xs text-[#6B6B6B] whitespace-nowrap shrink-0 ml-8 mt-1">
          <p>XGBoost + SHAP</p>
          <p className="mt-0.5 text-[#B0B0B0]">1991–2024</p>
        </div>
      </section>

      {/* Headline metrics */}
      <section className="grid grid-cols-4 border border-[#E5E5E5] divide-x divide-[#E5E5E5] mb-10">
        <div className="px-6 py-5">
          <p className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {t(lang, 'sectors.metric.topDriver.value')}
          </p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'sectors.metric.topDriver.label')}
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {t(lang, 'sectors.metric.peakContrib.value')}
          </p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'sectors.metric.peakContrib.label')}
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-2xl font-semibold text-[#1A1A1A] mb-1">
            {t(lang, 'sectors.metric.drag.value')}
          </p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'sectors.metric.drag.label')}
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">5</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'sectors.metric.count.label')}
          </p>
        </div>
      </section>

      {/* Waterfall + year selector + table */}
      <section>
        <SHAPWaterfall
          importanceData={importanceData}
          sectorSummary={sectorSummary}
        />
      </section>
    </main>
  )
}
