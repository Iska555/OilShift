'use client'

import { useState, useEffect, useRef } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { useLanguage } from '@/context/LanguageContext'
import { t, interpolate } from '@/lib/i18n'
import SpecPanel from '@/components/SpecPanel'
import TermPill from '@/components/TermPill'

const MIN_YEAR = 1991
const MAX_YEAR = 2024

const SECTOR_DISPLAY: Record<string, string> = {
  agriculture_va_pct_gdp: 'Agriculture',
  services_va_pct_gdp: 'Services',
  industry_va_pct_gdp: 'Industry',
  unemployment_rate: 'Labor Market',
  gross_capital_formation_pct: 'Investment',
  trade_pct_gdp: 'Trade',
  brent_annual_avg_usd: 'Oil Price',
}

const displayName = (s: string): string => SECTOR_DISPLAY[s] ?? s

const INTERPRETATIONS_EN: Record<string, string> = {
  Agriculture: 'Consistent non-oil stabilizer',
  Services: 'Oil boom amplifier, 2005–2008',
  'Labor Market': 'Structural employment drag',
  Industry: 'Post-boom mean reversion',
  Investment: 'Cyclical, low average impact',
  Trade: 'Minor, stable contribution',
  'Oil Price': 'External shock transmission',
}

const INTERPRETATIONS_AZ: Record<string, string> = {
  Agriculture: 'Davamlı qeyri-neft sabitləşdiricisi',
  Services: 'Neft bumu gücləndiricisi, 2005–2008',
  'Labor Market': 'Struktur məşğulluq əyləci',
  Industry: 'Bum sonrası orta dəyərə qayıdış',
  Investment: 'Dövri, aşağı ortalama təsir',
  Trade: 'Kiçik, sabit töhfə',
  'Oil Price': 'Xarici şok ötürücüsü',
}

const SHAP_EN = "SHAP (SHapley Additive exPlanations) — a method from cooperative game theory that assigns each sector a fair share of the credit (or blame) for that year's GDP growth prediction."
const SHAP_AZ = "SHAP — kooperativ oyun nəzəriyyəsindən götürülmüş metod olub hər sektora həmin ilin ÜDM artım proqnozunda ədalətli pay (müsbət və ya mənfi) təyin edir."
const XGBOOST_EN = "XGBoost — a gradient boosting algorithm that builds an ensemble of decision trees, each correcting the errors of the previous one. Chosen for its accuracy on small tabular datasets (34 observations)."
const XGBOOST_AZ = "XGBoost — hər biri əvvəlkinin xətalarını düzəldən qərar ağacları ansamblu quran gradient artırma alqoritmi. Kiçik cədvəl məlumat bazalarında (34 müşahidə) yüksək dəqiqliyi ilə seçilmişdir."

type ShapRow = {
  sector: string
  shap_value: number
  [key: string]: unknown
}

type ImportanceRow = {
  sector: string
  mean_abs_shap?: number | null
  mean_shap?: number | null
  value?: number | null
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

type SparklinePoint = {
  year: number
  growth: number | null
}

type ChartEventData = {
  activePayload?: Array<{ payload?: SparklinePoint }>
} | null

interface Props {
  importanceData: ImportanceRow[]
  sectorSummary: SectorSummaryRow[]
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let current = 0
    const step = target / (800 / 16)
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setVal(target)
        clearInterval(timer)
      } else {
        setVal(current)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <>{val.toFixed(1)}{suffix}</>
}

export default function SHAPWaterfall({ importanceData, sectorSummary }: Props) {
  const { lang } = useLanguage()
  const [selectedYear, setSelectedYear] = useState(2010)
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)
  const [shapData, setShapData] = useState<ShapRow[]>([])
  const [loadingShap, setLoadingShap] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const unit = lang === 'az' ? t(lang, 'sectors.pp') : t(lang, 'sectors.pp')

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setLoadingShap(true)
      fetch(`http://localhost:8000/api/sectors/shap/${selectedYear}`)
        .then(r => (r.ok ? r.json() : []))
        .then((rows: ShapRow[]) =>
          setShapData(
            [...rows]
              .sort((a, b) => b.shap_value - a.shap_value)
              .map(r => ({ ...r, sector: displayName(r.sector) }))
          )
        )
        .catch(() => setShapData([]))
        .finally(() => setLoadingShap(false))
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [selectedYear])

  const summaryRow = sectorSummary.find(r => r.year === selectedYear)

  const insightText = summaryRow
    ? interpolate(t(lang, 'sectors.insight'), {
        year: String(selectedYear),
        top: displayName(summaryRow.top_sector),
        topVal: Math.abs(summaryRow.top_shap).toFixed(2),
        bottom: displayName(summaryRow.bottom_sector),
        bottomVal: Math.abs(summaryRow.bottom_shap).toFixed(2),
      })
    : null

  const chartTitle = interpolate(t(lang, 'sectors.waterfall.title'), {
    year: String(selectedYear),
  })

  const sparklineData: SparklinePoint[] = [...sectorSummary]
    .sort((a, b) => a.year - b.year)
    .map(r => ({ year: r.year, growth: r.predicted_growth }))

  const topSectorCounts = sectorSummary.reduce<Record<string, number>>((acc, r) => {
    const name = displayName(r.top_sector)
    acc[name] = (acc[name] ?? 0) + 1
    return acc
  }, {})
  const dominantSector =
    Object.entries(topSectorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
  const dominantSectorYears = topSectorCounts[dominantSector] ?? 0

  const fillPct = ((selectedYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100

  const INTERPRETATIONS = lang === 'az' ? INTERPRETATIONS_AZ : INTERPRETATIONS_EN

  return (
    <div>
      {/* Sparkline */}
      {sparklineData.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-[#B0B0B0] mb-1 uppercase tracking-[0.1em]">
            {t(lang, 'sectors.scrubber.hint')}
          </p>
          <div style={{ height: 80, cursor: 'pointer' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={sparklineData}
                margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                onClick={(data: unknown) => {
                  const d = data as ChartEventData
                  const yr = d?.activePayload?.[0]?.payload?.year
                  if (yr != null) setSelectedYear(yr)
                }}
                onMouseMove={(data: unknown) => {
                  const d = data as ChartEventData
                  const yr = d?.activePayload?.[0]?.payload?.year
                  if (yr != null) setHoveredYear(yr)
                }}
                onMouseLeave={() => setHoveredYear(null)}
              >
                <XAxis dataKey="year" hide />
                <YAxis hide />
                <ReferenceLine x={selectedYear} stroke="#1A1A1A" strokeWidth={1} strokeDasharray="2 2" />
                {hoveredYear != null && hoveredYear !== selectedYear && (
                  <ReferenceLine x={hoveredYear} stroke="#B0B0B0" strokeWidth={1} />
                )}
                <Line
                  type="monotone"
                  dataKey="growth"
                  stroke="#1A1A1A"
                  strokeWidth={1}
                  dot={false}
                  isAnimationActive={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Historical context tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E5E5E5', marginBottom: 16 }}>
        <button
          onClick={() => setSelectedYear(2006)}
          className={`mr-6 pb-2 text-sm border-b-2 -mb-px ${
            selectedYear >= 2005 && selectedYear <= 2008
              ? 'border-[#1A1A1A] text-[#1A1A1A]'
              : 'border-transparent text-[#6B6B6B]'
          }`}
        >
          {t(lang, 'sectors.tab.oilBoom')}
        </button>
        <button
          onClick={() => setSelectedYear(2016)}
          className={`mr-6 pb-2 text-sm border-b-2 -mb-px ${
            selectedYear >= 2014 && selectedYear <= 2020
              ? 'border-[#1A1A1A] text-[#1A1A1A]'
              : 'border-transparent text-[#6B6B6B]'
          }`}
        >
          {t(lang, 'sectors.tab.postCrisis')}
        </button>
      </div>

      {/* Timeline scrubber */}
      <div className="mb-8">
        <p
          style={{
            fontSize: 48,
            fontWeight: 700,
            textAlign: 'center',
            color: '#1A1A1A',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            marginBottom: 16,
          }}
        >
          {selectedYear}
        </p>
        <div style={{ position: 'relative', height: 6, background: '#E5E5E5', borderRadius: 999 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: 6,
              background: '#1A1A1A',
              borderRadius: 999,
              width: `${fillPct}%`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#fff',
              border: '1.5px solid #1A1A1A',
              transform: 'translateY(-50%)',
              left: `calc(${fillPct}% - 10px)`,
              pointerEvents: 'none',
              boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            }}
          />
          <input
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR}
            step={1}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span className="text-xs text-[#B0B0B0]">{MIN_YEAR}</span>
          <span className="text-xs text-[#B0B0B0]">{MAX_YEAR}</span>
        </div>
      </div>

      {/* 3 sector dominance callout boxes */}
      {summaryRow && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="border border-[#E5E5E5] p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B] mb-2">
              {t(lang, 'sectors.callout.topDriver')}
            </p>
            <p className="text-base font-semibold text-[#1A6B3C] leading-tight mb-1">
              {displayName(summaryRow.top_sector)}
            </p>
            <p className="text-xs text-[#1A1A1A] tabular-nums font-mono">
              +{Math.abs(summaryRow.top_shap).toFixed(2)}{unit}
            </p>
          </div>
          <div className="border border-[#E5E5E5] p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B] mb-2">
              {t(lang, 'sectors.callout.topDrag')}
            </p>
            <p className="text-base font-semibold text-[#8B1A1A] leading-tight mb-1">
              {displayName(summaryRow.bottom_sector)}
            </p>
            <p className="text-xs text-[#1A1A1A] tabular-nums font-mono">
              −{Math.abs(summaryRow.bottom_shap).toFixed(2)}{unit}
            </p>
          </div>
          <div className="border border-[#E5E5E5] p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B] mb-2">
              {t(lang, 'sectors.callout.dominantSector')}
            </p>
            <p className="text-base font-semibold text-[#1A1A1A] leading-tight mb-1">
              {dominantSector}
            </p>
            <p className="text-xs text-[#6B6B6B]">
              {dominantSectorYears} {t(lang, 'sectors.callout.years')}
            </p>
          </div>
        </div>
      )}

      {/* Waterfall chart */}
      <div className="mb-2">
        <p className="text-xs uppercase tracking-[0.12em] text-[#6B6B6B] mb-4 flex items-center gap-1">
          {chartTitle}
          <TermPill enText={SHAP_EN} azText={SHAP_AZ} />
        </p>
        <div style={{ height: Math.max(shapData.length, 5) * 44 + 24 }}>
          {loadingShap ? (
            <div className="h-full flex items-center justify-center text-xs text-[#6B6B6B]">—</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                key={selectedYear}
                layout="vertical"
                data={shapData}
                margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
                barSize={32}
              >
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#6B6B6B' }}
                />
                <YAxis
                  type="category"
                  dataKey="sector"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#1A1A1A' }}
                  width={120}
                />
                <ReferenceLine x={0} stroke="#1A1A1A" strokeWidth={1} />
                <Bar
                  dataKey="shap_value"
                  label={{
                    position: 'right',
                    fontSize: 11,
                    fill: '#6B6B6B',
                    fontFamily: 'monospace',
                    formatter: (v: unknown) =>
                      typeof v === 'number'
                        ? `${v >= 0 ? '+' : ''}${v.toFixed(2)}${unit}`
                        : String(v ?? ''),
                  }}
                  animationDuration={500}
                  animationEasing="ease-out"
                >
                  {shapData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.shap_value >= 0 ? '#1A6B3C' : '#8B1A1A'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* pp note */}
      <p className="text-xs text-[#B0B0B0] mb-4 leading-relaxed">
        {t(lang, 'sectors.ppNote')}
      </p>

      {/* Auto-insight */}
      {insightText && (
        <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6 border-l-2 border-[#E5E5E5] pl-4">
          {insightText}
        </p>
      )}

      {/* Sector story */}
      <section className="grid grid-cols-3 gap-4 mb-10">
        <div className="border-l-4 border-[#1A6B3C] pl-4 py-1">
          <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums mb-1">
            +<CountUp target={11.6} suffix={unit} />
          </p>
          <p className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-2">
            {t(lang, 'sectors.story.services.title')}
          </p>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            {t(lang, 'sectors.story.services.text')}
          </p>
        </div>
        <div className="border-l-4 border-[#1A1A1A] pl-4 py-1">
          <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums mb-1">
            <CountUp target={11} />yrs
          </p>
          <p className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-2">
            {t(lang, 'sectors.story.agriculture.title')}
          </p>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            {t(lang, 'sectors.story.agriculture.text')}
          </p>
        </div>
        <div className="border-l-4 border-[#8B1A1A] pl-4 py-1">
          <p className="text-2xl font-bold text-[#1A1A1A] tabular-nums mb-1">
            −<CountUp target={3.4} suffix={unit} />
          </p>
          <p className="text-xs font-semibold text-[#1A1A1A] uppercase tracking-widest mb-2">
            {t(lang, 'sectors.story.labor.title')}
          </p>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            {t(lang, 'sectors.story.labor.text')}
          </p>
        </div>
      </section>

      {/* Explainer */}
      <div className="mb-10">
        <SpecPanel
          label="WHAT ARE SHAP VALUES + MODEL SPECIFICATION"
          labelAz="SHAP DƏYƏRLƏRİ + MODEL SPESİFİKASİYASI"
        >
          <p className="text-[#6B6B6B]">{t(lang, 'explainer.shap.body')}</p>
        </SpecPanel>
      </div>

      {/* Importance table */}
      {importanceData.length > 0 && (
        <section className="border-t border-[#E5E5E5] pt-8">
          <p className="text-xs uppercase tracking-[0.15em] text-[#6B6B6B] mb-1 flex items-center gap-1">
            {t(lang, 'sectors.table.title')}
            <TermPill enText={SHAP_EN} azText={SHAP_AZ} />
            <TermPill enText={XGBOOST_EN} azText={XGBOOST_AZ} />
          </p>
          <p className="text-xs text-[#6B6B6B] mb-6">{t(lang, 'sectors.table.subtitle')}</p>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                {(['sectors.table.col.sector', 'sectors.table.col.meanShap', 'sectors.table.col.interpretation'] as const).map(col => (
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
              {importanceData.map((row, i) => {
                const name = displayName(row.sector)
                const rawVal = row.mean_abs_shap ?? row.mean_shap ?? row.value ?? null
                return (
                  <tr
                    key={row.sector}
                    className={`border-b border-[#E5E5E5] ${i % 2 === 1 ? 'bg-[#F8F8F6]' : 'bg-white'}`}
                  >
                    <td className="px-4 py-3 text-[#1A1A1A]">{name}</td>
                    <td className="px-4 py-3 tabular-nums text-[#1A1A1A] font-mono text-xs">
                      {rawVal != null ? `${Number(rawVal).toFixed(2)}${unit}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-[#6B6B6B] text-xs">
                      {INTERPRETATIONS[name] ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
