'use client'

import { useState, useEffect, useRef } from 'react'
import { API_BASE } from '@/lib/api'
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
import { t, interpolate, type Lang } from '@/lib/i18n'
import SpecPanel from '@/components/SpecPanel'

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

const SECTOR_DISPLAY_AZ: Record<string, string> = {
  agriculture_va_pct_gdp: 'Kənd Təsərrüfatı',
  services_va_pct_gdp: 'İstehlak Xidmətləri',
  industry_va_pct_gdp: 'Sənaye',
  unemployment_rate: 'Əmək Bazarı',
  gross_capital_formation_pct: 'İnvestisiya',
  trade_pct_gdp: 'Ticarət',
  brent_annual_avg_usd: 'Neft Qiyməti',
}

// Fallback for summary-endpoint responses that return EN display names
// instead of internal feature keys (e.g. "Agriculture" vs "agriculture_va_pct_gdp")
const SECTOR_EN_TO_AZ: Record<string, string> = {
  'Industry': 'Sənaye',
  'Labor Market': 'Əmək Bazarı',
  'Agriculture': 'Kənd Təsərrüfatı',
  'Services': 'Xidmətlər',
  'Trade': 'Ticarət',
  'Investment': 'İnvestisiya',
  'Consumer Services': 'İstehlak Xidmətləri',
  'Oil Price': 'Neft Qiyməti',
}

function displayNameForLang(s: string, lang: Lang): string {
  if (lang === 'az') return SECTOR_DISPLAY_AZ[s] ?? SECTOR_EN_TO_AZ[s] ?? SECTOR_DISPLAY[s] ?? s
  return SECTOR_DISPLAY[s] ?? s
}

const INTERPRETATIONS_EN: Record<string, string> = {
  agriculture_va_pct_gdp: 'Consistent non-oil stabilizer',
  services_va_pct_gdp: 'Oil boom amplifier, 2005–2008',
  unemployment_rate: 'Structural employment drag',
  industry_va_pct_gdp: 'Post-boom mean reversion',
  gross_capital_formation_pct: 'Cyclical, low average impact',
  trade_pct_gdp: 'Minor, stable contribution',
  brent_annual_avg_usd: 'External shock transmission',
}

const INTERPRETATIONS_AZ: Record<string, string> = {
  agriculture_va_pct_gdp: 'Davamlı qeyri-neft stabilizatoru',
  services_va_pct_gdp: '2005–2008 neft yüksəliş katalizatoru',
  unemployment_rate: 'Struktur məşğulluq geriləməsi',
  industry_va_pct_gdp: 'Yüksəlişdən sonra ortalama dəyərə qayıdış',
  gross_capital_formation_pct: 'Dövrlü, aşağı ortalama təsir',
  trade_pct_gdp: 'Kiçik, dayanıqlı töhfə',
  brent_annual_avg_usd: 'Xarici şokların ötürücüsü',
}

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
  const [isMobile, setIsMobile] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const unit = t(lang, 'sectors.pp')

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setLoadingShap(true)
      fetch(`${API_BASE}/api/sectors/shap/${selectedYear}`)
        .then(r => (r.ok ? r.json() : []))
        .then((rows: ShapRow[]) =>
          setShapData([...rows].sort((a, b) => b.shap_value - a.shap_value))
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
    ? lang === 'az'
      ? (() => {
          const suffix = azOrdinalSuffix(selectedYear)
          const topName = displayNameForLang(summaryRow.top_sector, 'az')
          const bottomName = displayNameForLang(summaryRow.bottom_sector, 'az')
          const topVal = Math.abs(summaryRow.top_shap).toFixed(2)
          const bottomVal = Math.abs(summaryRow.bottom_shap).toFixed(2)
          return `${selectedYear}-${suffix} ildə ÜDM artımına ən çox töhfə verən sektor ${topName} olub (+${topVal} f.b.), ${bottomName} sektoru isə böyüməni ${bottomVal} f.b. zəiflədib.`
        })()
      : interpolate(t(lang, 'sectors.insight'), {
          year: String(selectedYear),
          top: displayNameForLang(summaryRow.top_sector, lang),
          topVal: Math.abs(summaryRow.top_shap).toFixed(2),
          bottom: displayNameForLang(summaryRow.bottom_sector, lang),
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
    acc[r.top_sector] = (acc[r.top_sector] ?? 0) + 1
    return acc
  }, {})
  const dominantSectorKey =
    Object.entries(topSectorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''
  const dominantSector = dominantSectorKey ? displayNameForLang(dominantSectorKey, lang) : '—'
  const dominantSectorYears = dominantSectorKey ? (topSectorCounts[dominantSectorKey] ?? 0) : 0

  const fillPct = ((selectedYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100

  const INTERPRETATIONS = lang === 'az' ? INTERPRETATIONS_AZ : INTERPRETATIONS_EN

  function azOrdinalSuffix(year: number): string {
    const last1 = year % 10
    const last2 = year % 100
    if (last1 === 0) return last2 === 20 ? 'ci' : 'cu'
    const map: Record<number, string> = {
      1: 'ci', 2: 'ci', 3: 'cü', 4: 'cü',
      5: 'ci', 6: 'cı', 7: 'ci', 8: 'ci', 9: 'cu',
    }
    return map[last1] ?? 'ci'
  }

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="border border-[#E5E5E5] p-4">
            <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B] mb-2">
              {t(lang, 'sectors.callout.topDriver')}
            </p>
            <p className="text-base font-semibold text-[#1A6B3C] leading-tight mb-1">
              {displayNameForLang(summaryRow.top_sector, lang)}
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
              {displayNameForLang(summaryRow.bottom_sector, lang)}
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

      {/* Terminology panel — directly above waterfall chart */}
      <div className="mb-6">
        <SpecPanel
          label="XGBOOST + SHAP — MODEL TERMINOLOGY"
          labelAz="XGBOOST + SHAP — MODEL TERMİNOLOGİYASI"
          defaultOpen={false}
        >
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] mb-2">XGBoost</p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {lang === 'az'
                  ? 'Hər biri özündən əvvəlkinin səhvlərini düzəldən qərar ağacları (decision trees) ansamblı yaradan gradient boosting alqoritmidir. Kiçik cədvəl formatlı verilənlərdə (34 illik müşahidə) yüksək dəqiqliyinə görə seçilmişdir.'
                  : 'A gradient boosting algorithm that builds an ensemble of decision trees, each correcting errors of the previous. Chosen for accuracy on small tabular datasets (34 annual observations).'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] mb-2">SHAP</p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {lang === 'az'
                  ? 'SHapley Additive exPlanations — kooperativ oyunlar nəzəriyyəsinə (Game Theory) əsaslanaraq, həmin ilki ÜDM artımı proqnozunda hər bir sektorun cəmi artıma olan marjinal töhfəsini dəqiq şəkildə bölüşdürür.'
                  : "SHapley Additive exPlanations — assigns each sector a fair marginal contribution to that year's GDP growth prediction, derived from cooperative game theory."}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] mb-2">
                {lang === 'az' ? 'f.b. (Faiz Bəndi)' : 'pp (Percentage Points)'}
              </p>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {lang === 'az'
                  ? 'f.b. = faiz bəndi. +1 f.b. SHAP dəyəri, müvafiq sektorun həmin il ÜDM artımına modelin baza xəttindən əlavə 1 faiz bəndi töhfə verdiyini bildirir.'
                  : "pp = percentage points. A +1pp SHAP value means that sector added 1 percentage point to GDP growth that year above the model baseline."}
              </p>
            </div>
          </div>
        </SpecPanel>
      </div>

      {/* Waterfall chart */}
      <div className="mb-2">
        <p className="text-xs uppercase tracking-[0.12em] text-[#6B6B6B] mb-4">
          {chartTitle}
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
                margin={{ top: 0, right: isMobile ? 36 : 48, left: 0, bottom: 0 }}
                barSize={isMobile ? 22 : 32}
              >
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: '#6B6B6B' }}
                />
                <YAxis
                  type="category"
                  dataKey="sector"
                  tickFormatter={(v) => displayNameForLang(String(v), lang)}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: isMobile ? 10 : 12, fill: '#1A1A1A' }}
                  width={isMobile ? 100 : 140}
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
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
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

      {/* Importance table */}
      {importanceData.length > 0 && (
        <section className="border-t border-[#E5E5E5] pt-8">
          <p className="text-xs uppercase tracking-[0.15em] text-[#6B6B6B] mb-1">
            {t(lang, 'sectors.table.title')}
          </p>
          <p className="text-xs text-[#6B6B6B] mb-6">{t(lang, 'sectors.table.subtitle')}</p>
          <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[360px]">
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
                const rawVal = row.mean_abs_shap ?? row.mean_shap ?? row.value ?? null
                return (
                  <tr
                    key={row.sector}
                    className={`border-b border-[#E5E5E5] ${i % 2 === 1 ? 'bg-[#F8F8F6]' : 'bg-white'}`}
                  >
                    <td className="px-4 py-3 text-[#1A1A1A]">{displayNameForLang(row.sector, lang)}</td>
                    <td className="px-4 py-3 tabular-nums text-[#1A1A1A] font-mono text-xs">
                      {rawVal != null ? `${Number(rawVal).toFixed(2)}${unit}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-[#6B6B6B] text-xs">
                      {INTERPRETATIONS[row.sector] ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </section>
      )}
    </div>
  )
}
