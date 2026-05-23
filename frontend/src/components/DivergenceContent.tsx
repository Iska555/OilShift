'use client'

import { ArrowDown } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { t, interpolate } from '@/lib/i18n'
import DivergenceExplorer from '@/components/charts/DivergenceExplorer'
import SpecPanel from '@/components/SpecPanel'

export interface TableRow {
  scenario: string
  label: string
  brent: string
  year25: string
  year20: string
  year15: string
  probability: string
  isBase: boolean
}

interface Props {
  tableRows: TableRow[]
  crossoverYear: string
}

const SCENARIO_LABEL_KEYS: Record<
  string,
  'divergence.scenario.bear' | 'divergence.scenario.base' | 'divergence.scenario.bull'
> = {
  bear_60: 'divergence.scenario.bear',
  base_80: 'divergence.scenario.base',
  bull_100: 'divergence.scenario.bull',
}

const SCENARIO_BRENT_KEYS: Record<
  string,
  'divergence.brent.bear' | 'divergence.brent.base' | 'divergence.brent.bull'
> = {
  bear_60: 'divergence.brent.bear',
  base_80: 'divergence.brent.base',
  bull_100: 'divergence.brent.bull',
}

const TABLE_COLS = [
  'divergence.table.col.scenario',
  'divergence.table.col.brent',
  'divergence.table.col.oil25',
  'divergence.table.col.oil20',
  'divergence.table.col.oil15',
  'divergence.table.col.probability',
] as const

export default function DivergenceContent({ tableRows, crossoverYear }: Props) {
  const { lang } = useLanguage()

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">

      {/* Page header */}
      <section className="flex items-start justify-between mb-12 pb-10 border-b border-[#E5E5E5]">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-[#6B6B6B] mb-3">
            {t(lang, 'divergence.pageLabel')}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1A1A1A] mb-3 leading-tight">
            {t(lang, 'divergence.title')}
          </h1>
          <p className="text-sm text-[#6B6B6B] max-w-xl leading-relaxed">
            {interpolate(t(lang, 'divergence.subtitle'), { year: crossoverYear })}
          </p>
        </div>
        <div className="text-right text-xs text-[#6B6B6B] whitespace-nowrap shrink-0 ml-8 mt-1">
          <p>Updated May 2026</p>
          <p className="mt-0.5 text-[#B0B0B0]">stat.gov.az · World Bank · EIA</p>
        </div>
      </section>

      {/* Headline metrics */}
      <section className="grid grid-cols-4 border border-[#E5E5E5] divide-x divide-[#E5E5E5] mb-12">
        <div className="px-6 py-5">
          <div className="flex items-baseline gap-1.5 mb-1">
            <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums">30.4%</p>
            <ArrowDown size={13} className="text-[#8B1A1A]" strokeWidth={2.5} />
          </div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'divergence.metric.oilShareToday')}
          </p>
          <p className="text-xs text-[#B0B0B0] mt-0.5">Jan–Apr 2026 · stat.gov.az</p>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-baseline gap-1.5 mb-1">
            <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums">−2.5%/yr</p>
            <ArrowDown size={13} className="text-[#8B1A1A]" strokeWidth={2.5} />
          </div>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'divergence.metric.productionDecline')}
          </p>
          <p className="text-xs text-[#B0B0B0] mt-0.5">SOCAR post-peak trend</p>
        </div>
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">{crossoverYear}</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'divergence.metric.baseCaseBelow20')}
          </p>
          <p className="text-xs text-[#B0B0B0] mt-0.5">$80 / bbl · 100% probability</p>
        </div>
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">0.256</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'divergence.metric.elasticity')}
          </p>
          <p className="text-xs text-[#B0B0B0] mt-0.5">Calibrated 1990–2024</p>
        </div>
      </section>

      {/* Unified explorer section */}
      <section className="mb-12 pb-12 border-b border-[#E5E5E5]">
        <DivergenceExplorer />
        <div className="mt-6">
          <SpecPanel
            label="READING THIS CHART + MODEL CALIBRATION"
            labelAz="CƏDVƏLİ NECƏ OXUMALI + MODELİN KALİBRASİYASI"
          >
            <p className="font-medium text-[#1A1A1A] mb-2 text-xs uppercase tracking-widest">
              {t(lang, 'explainer.readingChart.title')}
            </p>
            <p className="text-[#6B6B6B] mb-5">{t(lang, 'explainer.readingChart.body')}</p>
            <p className="font-medium text-[#1A1A1A] mb-2 text-xs uppercase tracking-widest">
              {t(lang, 'explainer.modelCalibration.title')}
            </p>
            <p className="text-[#6B6B6B]">{t(lang, 'explainer.modelCalibration.body')}</p>
          </SpecPanel>
        </div>
      </section>

      {/* Scenario comparison table */}
      <section className="mb-12">
        <p className="text-xs uppercase tracking-[0.15em] text-[#6B6B6B] mb-1">
          {t(lang, 'divergence.comparison.title')}
        </p>
        <p className="text-xs text-[#6B6B6B] mb-6">
          {t(lang, 'divergence.comparison.subtitle')}
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#E5E5E5]">
              {TABLE_COLS.map((col) => (
                <th
                  key={col}
                  className="text-left text-xs uppercase tracking-[0.1em] text-[#6B6B6B] px-4 py-3 font-normal"
                >
                  {t(lang, col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, i) => {
              const labelKey = SCENARIO_LABEL_KEYS[row.scenario]
              const brentKey = SCENARIO_BRENT_KEYS[row.scenario]
              const label = labelKey ? t(lang, labelKey) : row.label
              const brent = brentKey ? t(lang, brentKey) : row.brent

              return (
                <tr
                  key={row.scenario}
                  className={`border-b border-[#E5E5E5] ${i % 2 === 1 ? 'bg-[#F8F8F6]' : 'bg-white'}`}
                >
                  <td className={`px-4 py-3 text-[#1A1A1A] ${row.isBase ? 'font-medium' : ''}`}>{label}</td>
                  <td className={`px-4 py-3 tabular-nums ${row.isBase ? 'font-medium text-[#1A1A1A]' : 'text-[#6B6B6B]'}`}>{brent}</td>
                  <td className={`px-4 py-3 tabular-nums ${row.isBase ? 'font-medium text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>{row.year25}</td>
                  <td className={`px-4 py-3 tabular-nums ${row.isBase ? 'font-medium text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>{row.year20}</td>
                  <td className={`px-4 py-3 tabular-nums ${row.isBase ? 'font-medium text-[#1A1A1A]' : 'text-[#1A1A1A]'}`}>{row.year15}</td>
                  <td className={`px-4 py-3 tabular-nums ${row.isBase ? 'font-medium text-[#1A1A1A]' : 'text-[#6B6B6B]'}`}>{row.probability}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="text-xs text-[#6B6B6B] mt-3">
          {t(lang, 'divergence.table.caption')}
        </p>
      </section>

      {/* Methodology note */}
      <section className="border-t border-[#E5E5E5] pt-8 mb-12">
        <p className="text-xs uppercase tracking-[0.15em] text-[#6B6B6B] mb-6">
          {t(lang, 'explainer.methodologyNote')}
        </p>
        <div className="max-w-2xl">
          <SpecPanel
            label="METHODOLOGY + MODEL SPECIFICATION"
            labelAz="METODOLOJİ QEYD + MODEL SPESİFİKASİYASI"
            defaultOpen={true}
          >
            <p className="text-[#6B6B6B]">{t(lang, 'divergence.methodology.combined')}</p>
          </SpecPanel>
        </div>
      </section>

    </main>
  )
}
