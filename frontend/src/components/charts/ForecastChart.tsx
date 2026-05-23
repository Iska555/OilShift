'use client'

import { useEffect, useRef } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceArea,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'

type QuarterRow = {
  period: string
  actual: number | null
  lstm_pred: number | null
  arima_pred: number | null
  [key: string]: unknown
}

type ChartPoint = {
  period: string
  actual: number | null
  lstm_pred: number | null
  arima_pred: number | null
}

interface Props {
  quarterlyData: QuarterRow[]
}

type TooltipEntry = { dataKey?: string; value?: unknown }
interface TooltipContentProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipContentProps) {
  const { lang } = useLanguage()
  if (!active || !payload?.length) return null

  const find = (key: string) => {
    const entry = payload.find(p => p.dataKey === key)
    return typeof entry?.value === 'number' ? entry.value : null
  }
  const fmt = (v: number | null) => (v != null ? v.toFixed(2) : '—')
  const rows: Array<{ label: string; value: number | null; dot: React.CSSProperties }> = [
    {
      label: t(lang, 'forecast.legend.actual'),
      value: find('actual'),
      dot: { width: 8, height: 8, borderRadius: '50%', background: '#1A1A1A', display: 'inline-block', flexShrink: 0 },
    },
    {
      label: 'ARIMA',
      value: find('arima_pred'),
      dot: { width: 12, height: 0, borderBottom: '2px dashed #B0B0B0', display: 'inline-block', flexShrink: 0 },
    },
    {
      label: 'LSTM',
      value: find('lstm_pred'),
      dot: { width: 12, height: 0, borderBottom: '2px dashed #6B6B6B', display: 'inline-block', flexShrink: 0 },
    },
  ]

  return (
    <div style={{ background: '#fff', border: '1px solid #E5E5E5', padding: '12px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', minWidth: 190 }}>
      <p style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>{label}</p>
      <div style={{ borderTop: '1px solid #E5E5E5', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {rows.map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B6B6B', fontSize: 11 }}>
              <span style={row.dot} />
              {row.label}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#1A1A1A' }}>{fmt(row.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ForecastChart({ quarterlyData }: Props) {
  const { lang } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  const chartData: ChartPoint[] = quarterlyData.map(r => ({
    period: r.period,
    actual: r.actual,
    lstm_pred: r.lstm_pred,
    arima_pred: r.arima_pred,
  }))

  // Line draw animation — DOM order: actual(0ms), lstm(600ms), arima(300ms)
  useEffect(() => {
    if (!containerRef.current || !chartData.length) return
    const delays = [0, 600, 300]
    const timer = setTimeout(() => {
      const paths = containerRef.current?.querySelectorAll('.recharts-line-curve')
      paths?.forEach((node, i) => {
        const path = node as SVGPathElement
        const length = path.getTotalLength()
        path.style.strokeDasharray = String(length)
        path.style.strokeDashoffset = String(length)
        path.style.transition = 'none'
        const delay = delays[i] ?? 0
        setTimeout(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              path.style.transition = 'stroke-dashoffset 1.8s ease-out'
              path.style.strokeDashoffset = '0'
            })
          })
        }, delay)
      })
    }, 100)
    return () => clearTimeout(timer)
  }, [chartData.length])

  return (
    <div>
      {/* Chart */}
      <div ref={containerRef} style={{ height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: '#6B6B6B' }}
              interval={3}
              angle={-30}
              textAnchor="end"
              height={40}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#6B6B6B' }}
              width={50}
            />
            <ReferenceLine y={0} stroke="#E5E5E5" strokeWidth={1} />
            <ReferenceArea x1="2020Q1" x2="2020Q4" fill="#F8F8F6" fillOpacity={1} />
            <Tooltip
              cursor={{ stroke: '#E5E5E5', strokeWidth: 1 }}
              content={<CustomTooltip />}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#6B6B6B', paddingTop: 8 }}
              formatter={(value: string) => {
                if (value === 'actual') return t(lang, 'forecast.legend.actual')
                if (value === 'lstm_pred') return 'LSTM'
                if (value === 'arima_pred') return 'ARIMA'
                return value
              }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#1A1A1A"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="lstm_pred"
              stroke="#6B6B6B"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="arima_pred"
              stroke="#B0B0B0"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 2-column callout */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="border border-[#E5E5E5] p-5">
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B] mb-2">ARIMA(2,1,0)</p>
          <p className="text-3xl font-semibold text-[#1A6B3C] tabular-nums mb-1">0.15%</p>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            {t(lang, 'forecast.callout.arima')}
          </p>
        </div>
        <div className="border border-[#E5E5E5] p-5">
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B] mb-2">LSTM</p>
          <p className="text-3xl font-semibold text-[#8B1A1A] tabular-nums mb-1">5.38%</p>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            {t(lang, 'forecast.callout.lstm')}
          </p>
        </div>
      </div>
    </div>
  )
}
