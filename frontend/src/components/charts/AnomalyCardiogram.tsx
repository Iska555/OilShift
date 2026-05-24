'use client'

import { useState, useEffect, useRef } from 'react'
import { API_BASE } from '@/lib/api'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useLanguage } from '@/context/LanguageContext'

const ANOMALY_YEARS = [1994, 2008, 2015, 2020]

const ANOMALY_META: Record<number, { en: string; az: string }> = {
  1994: { en: 'Post-Soviet Stabilization', az: 'Sovet İttifaqı Sonrası İqtisadi Böhran' },
  2008: { en: 'Global Financial Crisis', az: 'Qlobal Maliyyə Böhranı' },
  2015: { en: 'Manat Devaluation', az: 'Azərbaycan Manatının Devalvasiyası' },
  2020: { en: 'COVID-19 + Oil Collapse', az: 'COVID-19 Pandemiyası və Neft Şoku' },
}

const ANOMALY_BRENT: Record<number, number> = {
  1994: 17,
  2008: 97,
  2015: 54,
  2020: 42,
}

const ANOMALY_SERIES: Record<number, number> = {
  1994: 2,
  2008: 2,
  2015: 1,
  2020: 1,
}

const ANOMALY_MAGNITUDE: Record<number, number> = {
  1994: 21,
  2008: 15,
  2015: 10,
  2020: 17,
}

const MAX_MAGNITUDE = 21

type ChartPoint = {
  year: number
  value: number | null
}

type PanelRow = {
  period?: string
  year?: number
  gdp_growth_pct?: number | null
  gdp_index?: number | null
  [key: string]: unknown
}

function buildChartData(rows: PanelRow[]): ChartPoint[] {
  if (!rows.length) return []

  const first = rows[0]
  const hasGrowth = first.gdp_growth_pct !== undefined

  if (hasGrowth && first.year !== undefined) {
    return rows
      .filter((r): r is PanelRow & { year: number } => typeof r.year === 'number')
      .map(r => ({ year: r.year, value: r.gdp_growth_pct ?? null }))
      .sort((a, b) => a.year - b.year)
  }

  const yearMap = new Map<number, number | null>()
  for (const row of rows) {
    let yr: number | undefined
    if (typeof row.year === 'number') yr = row.year
    else if (typeof row.period === 'string') yr = parseInt(row.period.slice(0, 4), 10)
    if (yr === undefined || isNaN(yr)) continue
    yearMap.set(yr, hasGrowth ? (row.gdp_growth_pct ?? null) : (row.gdp_index ?? null))
  }

  const sorted = Array.from(yearMap.entries()).sort(([a], [b]) => a - b)

  if (!hasGrowth) {
    return sorted.map(([year, idx], i) => ({
      year,
      value:
        i === 0 || sorted[i - 1][1] == null || idx == null
          ? null
          : +((idx / sorted[i - 1][1]! - 1) * 100).toFixed(2),
    }))
  }

  return sorted.map(([year, value]) => ({ year, value }))
}

type DotRenderProps = {
  cx?: number
  cy?: number
  payload?: ChartPoint
  index?: number
  [key: string]: unknown
}

function renderAnomalyDot(props: DotRenderProps): React.ReactElement {
  const { cx, cy, payload } = props
  if (!payload || cx == null || cy == null || !ANOMALY_YEARS.includes(payload.year)) {
    return <g key={`nd-${payload?.year ?? Math.random()}`} />
  }
  return (
    <g key={`dot-${payload.year}`}>
      <circle
        cx={cx}
        cy={cy}
        r={10}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth={1}
        className="pulse-ring-2"
      />
      <circle
        cx={cx}
        cy={cy}
        r={8}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth={1}
        className="pulse-ring"
      />
      <circle cx={cx} cy={cy} r={3} fill="#1A1A1A" />
    </g>
  )
}

// Defined at module level so Recharts can clone it and inject active/payload/label
function AnomalyTooltipContent({
  active,
  payload,
  lang = 'en',
}: {
  active?: boolean
  payload?: Array<{ payload?: ChartPoint; value?: unknown; [key: string]: unknown }>
  lang?: 'en' | 'az'
}) {
  if (!active || !payload?.length) return null

  const point = payload[0]?.payload
  if (!point) return null

  const year = point.year
  const gdpGrowth = typeof point.value === 'number' ? point.value : null
  const isAnomaly = ANOMALY_YEARS.includes(year)
  const meta = ANOMALY_META[year]
  const brent = ANOMALY_BRENT[year]
  const seriesCount = ANOMALY_SERIES[year]
  const magnitude = ANOMALY_MAGNITUDE[year]

  const growthStr =
    gdpGrowth == null
      ? '—'
      : `${gdpGrowth > 0 ? '+' : ''}${gdpGrowth.toFixed(1)}%`

  const barWidth = magnitude != null ? Math.round((magnitude / MAX_MAGNITUDE) * 120) : 0

  return (
    <div
      style={{
        minWidth: 220,
        background: '#FFFFFF',
        border: '1px solid #E5E5E5',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        padding: 16,
      }}
    >
      <p
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#1A1A1A',
          lineHeight: 1,
          marginBottom: 4,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {year}
      </p>

      {isAnomaly && meta && (
        <p style={{ fontSize: 11, color: '#1A1A1A', marginBottom: 10, fontWeight: 500 }}>
          {lang === 'az' ? meta.az : meta.en}
        </p>
      )}

      <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 8, marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: '#6B6B6B' }}>GDP Growth</span>
          <span
            style={{
              fontSize: 11,
              color: gdpGrowth != null && gdpGrowth < 0 ? '#8B1A1A' : '#1A6B3C',
              fontWeight: 600,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {growthStr}
          </span>
        </div>

        {isAnomaly && brent != null && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: '#6B6B6B' }}>Brent at shock</span>
            <span style={{ fontSize: 11, color: '#1A1A1A', fontVariantNumeric: 'tabular-nums' }}>
              ${brent}/bbl
            </span>
          </div>
        )}

        {isAnomaly && seriesCount != null && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: '#6B6B6B' }}>Detected in</span>
            <span style={{ fontSize: 11, color: '#1A1A1A' }}>
              {seriesCount} series
            </span>
          </div>
        )}

        {isAnomaly && magnitude != null && (
          <div>
            <p
              style={{
                fontSize: 10,
                color: '#B0B0B0',
                marginBottom: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Shock magnitude
            </p>
            <div style={{ height: 4, background: '#F0F0F0' }}>
              <div
                style={{
                  height: 4,
                  width: barWidth,
                  background: '#1A1A1A',
                  maxWidth: 120,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnomalyCardiogram() {
  const { lang } = useLanguage()
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/forecast/panel`)
      .then(r => (r.ok ? r.json() : []))
      .then((rows: PanelRow[]) => setChartData(buildChartData(rows)))
      .catch(() => setChartData([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!containerRef.current || !chartData.length) return
    const timer = setTimeout(() => {
      const path = containerRef.current?.querySelector(
        '.recharts-line-curve'
      ) as SVGPathElement | null
      if (!path) return
      const length = path.getTotalLength()
      path.style.strokeDasharray = String(length)
      path.style.strokeDashoffset = String(length)
      path.style.transition = 'none'
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          path.style.transition = 'stroke-dashoffset 2s ease-out'
          path.style.strokeDashoffset = '0'
        })
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [chartData])

  if (loading) {
    return (
      <div style={{ height: 320 }} className="flex items-center justify-center text-xs text-[#6B6B6B]">
        —
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: '#6B6B6B' }}
            tickFormatter={(v: number) => (v % 5 === 0 ? String(v) : '')}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: '#6B6B6B' }}
            tickFormatter={(v: number) => `${v}%`}
            width={44}
          />
          <ReferenceLine y={0} stroke="#E5E5E5" strokeWidth={1} />
          <Tooltip
            cursor={{ stroke: '#E5E5E5', strokeWidth: 1 }}
            content={<AnomalyTooltipContent lang={lang} />}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#1A1A1A"
            strokeWidth={1.5}
            dot={renderAnomalyDot}
            activeDot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
