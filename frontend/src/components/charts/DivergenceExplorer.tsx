'use client'

import { useState, useEffect, useMemo } from 'react'
import { API_BASE } from '@/lib/api'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
} from 'recharts'
import { useLanguage } from '@/context/LanguageContext'
import { t, interpolate } from '@/lib/i18n'
import type { CurveData } from '@/types/divergence'

const MIN = 40
const MAX = 120
const BASE_YEAR = 2033
const TICK_PRICES = [40, 60, 80, 100, 120]

interface AllCurves {
  bear: CurveData
  base: CurveData
  bull: CurveData
}

interface ChartPoint {
  year: number
  p10: number | null
  p50: number | null
  p90: number | null
}

function toAnnualMap(
  curve: CurveData
): Map<number, { p10: number | null; p50: number | null; p90: number | null }> {
  const m = new Map<number, { p10: number | null; p50: number | null; p90: number | null }>()
  for (const pt of curve.oil) {
    const year = parseInt(pt.period.slice(0, 4), 10)
    m.set(year, {
      p10: pt.p10 != null ? +(pt.p10 * 100).toFixed(2) : null,
      p50: pt.p50 != null ? +(pt.p50 * 100).toFixed(2) : null,
      p90: pt.p90 != null ? +(pt.p90 * 100).toFixed(2) : null,
    })
  }
  return m
}

function lerp(a: number | null, b: number | null, w: number): number | null {
  if (a == null || b == null) return a ?? b
  return +(a * (1 - w) + b * w).toFixed(2)
}

function buildChartData(curves: AllCurves, price: number): ChartPoint[] {
  const bearMap = toAnnualMap(curves.bear)
  const baseMap = toAnnualMap(curves.base)
  const bullMap = toAnnualMap(curves.bull)

  const years = Array.from(
    new Set([...bearMap.keys(), ...baseMap.keys(), ...bullMap.keys()])
  ).sort((a, b) => a - b)

  return years.map((year) => {
    const bear = bearMap.get(year) ?? { p10: null, p50: null, p90: null }
    const base = baseMap.get(year) ?? { p10: null, p50: null, p90: null }
    const bull = bullMap.get(year) ?? { p10: null, p50: null, p90: null }

    function interp(
      bv: number | null,
      bsv: number | null,
      buv: number | null
    ): number | null {
      if (price <= 60) return bv
      if (price >= 100) return buv
      if (price < 80) return lerp(bv, bsv, (price - 60) / 20)
      return lerp(bsv, buv, (price - 80) / 20)
    }

    return {
      year,
      p10: interp(bear.p10, base.p10, bull.p10),
      p50: interp(bear.p50, base.p50, bull.p50),
      p90: interp(bear.p90, base.p90, bull.p90),
    }
  })
}

function firstCrossBelow20(data: ChartPoint[], band: 'p10' | 'p50' | 'p90'): number | null {
  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1][band]
    const curr = data[i][band]
    if (prev != null && curr != null && prev >= 20 && curr < 20) {
      return data[i].year
    }
  }
  return null
}

function findCrossoverDot(
  data: ChartPoint[],
  band: 'p10' | 'p50' | 'p90'
): { year: number; value: number } | null {
  for (let i = 1; i < data.length; i++) {
    const v0 = data[i - 1][band]
    const v1 = data[i][band]
    if (v0 != null && v1 != null && v0 >= 20 && v1 < 20) {
      const dotIndex = Math.abs(v0 - 20) < Math.abs(v1 - 20) ? i - 1 : i
      return { year: data[dotIndex].year, value: data[dotIndex][band] as number }
    }
  }
  return null
}

interface TooltipEntry {
  name: string
  value: number | null
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: number
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#E5E5E5] px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-[#1A1A1A] mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between gap-6 text-[#6B6B6B]">
          <span>{entry.name}</span>
          <span className="text-[#1A1A1A] tabular-nums">
            {entry.value != null ? `${entry.value.toFixed(1)}%` : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function DivergenceExplorer() {
  const { lang } = useLanguage()
  const [brentPrice, setBrentPrice] = useState(80)
  const [isDragging, setIsDragging] = useState(false)
  const [allCurves, setAllCurves] = useState<AllCurves | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [bearRes, baseRes, bullRes] = await Promise.all([
          fetch(`${API_BASE}/api/divergence/curves/bear_60`),
          fetch(`${API_BASE}/api/divergence/curves/base_80`),
          fetch(`${API_BASE}/api/divergence/curves/bull_100`),
        ])
        if (!bearRes.ok || !baseRes.ok || !bullRes.ok) throw new Error('fetch failed')
        const bear = (await bearRes.json()) as CurveData
        const base = (await baseRes.json()) as CurveData
        const bull = (await bullRes.json()) as CurveData
        if (!cancelled) setAllCurves({ bear, base, bull })
      } catch {
        if (!cancelled) setLoadError(true)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const chartData = useMemo<ChartPoint[]>(() => {
    if (!allCurves) return []
    return buildChartData(allCurves, brentPrice)
  }, [allCurves, brentPrice])

  const crossoverDot = useMemo(() => findCrossoverDot(chartData, 'p50'), [chartData])
  const crossoverYear = crossoverDot?.year ?? null
  const ciEarlyYear = useMemo(() => firstCrossBelow20(chartData, 'p10'), [chartData])
  const ciLateYear = useMemo(() => firstCrossBelow20(chartData, 'p90'), [chartData])

  const displayYear = crossoverYear?.toString() ?? t(lang, 'explorer.postYear')

  const insightText = useMemo(() => {
    if (brentPrice > 100) return t(lang, 'slider.insight.bull')
    if (brentPrice < 60) {
      const yearsAhead =
        crossoverYear != null ? Math.max(0, BASE_YEAR - crossoverYear) : 0
      return interpolate(t(lang, 'slider.insight.bear'), {
        price: brentPrice.toString(),
        year: displayYear,
        years_ahead: yearsAhead.toString(),
      })
    }
    return interpolate(t(lang, 'slider.insight.base'), {
      price: brentPrice.toString(),
      year: displayYear,
    })
  }, [brentPrice, crossoverYear, displayYear, lang])

  const fillPct = ((brentPrice - MIN) / (MAX - MIN)) * 100

  const xAxisTicks = useMemo(
    () => chartData.map((d) => d.year).filter((y) => y % 5 === 0),
    [chartData]
  )

  const chartTitle = `${t(lang, 'explorer.chartTitle')} — ${displayYear} ${t(lang, 'explorer.projection')}`
  const policyTargetLabel = t(lang, 'explorer.policyTarget')
  const baselineLabel = t(lang, 'explorer.baseline')

  const insightBorderColor =
    brentPrice < 60 ? '#8B1A1A' : brentPrice > 100 ? '#1A6B3C' : '#E5E5E5'

  return (
    <div>
      {/* Slider section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:gap-12 gap-6 mb-6">
          {/* Price + slider */}
          <div className="flex-1 min-w-0">
            <div className="text-center mb-6">
              <p className="text-[56px] font-light text-[#1A1A1A] leading-none tabular-nums">
                ${brentPrice}
              </p>
              <p className="text-xs text-[#6B6B6B] mt-1">{t(lang, 'slider.perBarrel')}</p>
            </div>

            <div className="relative h-6 flex items-center">
              <div
                className="absolute inset-x-0 h-[6px] rounded-full"
                style={{
                  background: `linear-gradient(to right,
                    rgba(139,26,26,0.2) 0%,
                    rgba(139,26,26,0.4) 25%,
                    #E5E5E5 25%,
                    #E5E5E5 50%,
                    rgba(26,107,60,0.2) 50%,
                    rgba(26,107,60,0.4) 100%)`,
                }}
              />
              <div
                className="absolute left-0 h-[6px] rounded-full bg-[#1A1A1A]"
                style={{ width: `${fillPct}%` }}
              />
              <div
                className="absolute top-1/2 pointer-events-none"
                style={{
                  left: `calc(${fillPct}% - 14px)`,
                  transform: isDragging
                    ? 'translateY(-50%) scale(1.15)'
                    : 'translateY(-50%) scale(1)',
                  transition: 'transform 150ms',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1.5px solid #1A1A1A',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              />
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={1}
                value={brentPrice}
                onChange={(e) => setBrentPrice(Number(e.target.value))}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                style={{ zIndex: 1 }}
              />
            </div>

            <div className="relative mt-2 h-5">
              {TICK_PRICES.map((tp) => {
                const pct = ((tp - MIN) / (MAX - MIN)) * 100
                return (
                  <div
                    key={tp}
                    className="absolute flex flex-col items-center"
                    style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                  >
                    <div className="w-px h-2 bg-[#E5E5E5]" />
                    <p className="text-[10px] text-[#B0B0B0] mt-0.5 tabular-nums">${tp}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Crossover year */}
          <div className="w-full md:w-56 md:shrink-0 md:pt-2">
            <p className="text-xs text-[#6B6B6B] leading-relaxed mb-3">
              {t(lang, 'slider.fallsBelow20')}
            </p>
            <p className="text-[72px] font-bold text-[#1A1A1A] leading-none tabular-nums">
              {displayYear}
            </p>
            {ciEarlyYear != null && ciLateYear != null && (
              <p className="text-xs text-[#6B6B6B] mt-2 tabular-nums">
                {t(lang, 'slider.ci')} {ciEarlyYear} – {ciLateYear}
              </p>
            )}
          </div>
        </div>

        {/* Insight */}
        <div
          className="border border-[#E5E5E5] bg-white p-4 text-sm text-[#6B6B6B] leading-relaxed"
          style={{
            borderLeftWidth: 4,
            borderLeftColor: insightBorderColor,
          }}
        >
          {insightText}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full overflow-hidden">
        <p className="text-xs font-semibold text-[#1A1A1A] tracking-tight mb-4">
          {chartTitle}
        </p>

        {!allCurves && !loadError && (
          <div className="h-[420px] flex flex-col justify-center gap-5 px-10">
            <div className="h-[3px] bg-[#F0F0F0] w-3/4" />
            <div className="h-[3px] bg-[#F0F0F0] w-1/2" />
            <div className="h-[3px] bg-[#F0F0F0] w-2/3" />
          </div>
        )}

        {loadError && (
          <div className="h-[420px] flex items-center justify-center text-xs text-[#6B6B6B]">
            —
          </div>
        )}

        {allCurves && (
          <ResponsiveContainer width="100%" height={isMobile ? 280 : 420}>
            <LineChart
              key={Math.round(brentPrice / 5) * 5}
              data={chartData}
              margin={{ top: 24, right: isMobile ? 8 : 140, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="year"
                ticks={xAxisTicks}
                tick={{ fontSize: 11, fill: '#6B6B6B' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 35]}
                ticks={[0, 5, 10, 15, 20, 25, 30, 35]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 11, fill: '#6B6B6B' }}
                tickLine={false}
                axisLine={false}
                width={42}
              />
              <Tooltip content={<ChartTooltip />} />

              {/* 20% policy threshold */}
              <ReferenceLine
                y={20}
                stroke="#1A1A1A"
                strokeDasharray="4 2"
                label={isMobile ? undefined : {
                  value: policyTargetLabel,
                  position: 'insideTopRight',
                  fontSize: 10,
                  fill: '#1A1A1A',
                  offset: 6,
                }}
              />

              {/* 2026 baseline */}
              <ReferenceLine
                y={30.4}
                stroke="#B0B0B0"
                strokeDasharray="4 2"
                label={isMobile ? undefined : {
                  value: baselineLabel,
                  position: 'insideTopRight',
                  fontSize: 10,
                  fill: '#B0B0B0',
                  offset: 6,
                }}
              />

              {/* Vertical line at crossover with year label at bottom */}
              {crossoverYear != null && (
                <ReferenceLine
                  x={crossoverYear}
                  stroke="#1A1A1A"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{
                    value: crossoverYear.toString(),
                    position: 'insideBottomRight',
                    fontSize: 10,
                    fill: '#1A1A1A',
                    offset: 4,
                  }}
                />
              )}

              {/* Crossover dot with pulse ring — placed at actual p50 value */}
              {crossoverDot != null && (
                <ReferenceDot
                  x={crossoverDot.year}
                  y={crossoverDot.value}
                  r={0}
                  fill="none"
                  stroke="none"
                  shape={(shapeProps: unknown) => {
                    const p = shapeProps as { cx?: number; cy?: number }
                    if (p.cx == null || p.cy == null) return <g />
                    return (
                      <g>
                        <circle cx={p.cx} cy={p.cy} r={12} fill="none" stroke="#1A1A1A" strokeWidth={1} className="pulse-ring" />
                        <circle cx={p.cx} cy={p.cy} r={5} fill="white" stroke="#1A1A1A" strokeWidth={2} />
                      </g>
                    )
                  }}
                />
              )}

              {/* P10 / P90 confidence bands */}
              <Line
                dataKey="p90"
                stroke="#CCCCCC"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="P90"
                connectNulls
                animationDuration={600}
                animationEasing="ease-out"
                animationBegin={0}
              />
              <Line
                dataKey="p50"
                stroke="#1A1A1A"
                strokeWidth={2.5}
                dot={false}
                name="P50"
                connectNulls
                animationDuration={600}
                animationEasing="ease-out"
                animationBegin={0}
              />
              <Line
                dataKey="p10"
                stroke="#CCCCCC"
                strokeWidth={1}
                strokeDasharray="3 3"
                dot={false}
                name="P10"
                connectNulls
                animationDuration={600}
                animationEasing="ease-out"
                animationBegin={0}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
