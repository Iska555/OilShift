'use client'

import { useLanguage } from '@/context/LanguageContext'
import { t } from '@/lib/i18n'
import ForecastChart from '@/components/charts/ForecastChart'
import SpecPanel from '@/components/SpecPanel'

type QuarterRow = {
  period: string
  actual: number | null
  lstm_pred: number | null
  arima_pred: number | null
  [key: string]: unknown
}

interface Props {
  quarterlyData: QuarterRow[]
}

export default function ForecastContent({ quarterlyData }: Props) {
  const { lang } = useLanguage()

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-12">
      {/* Page header */}
      <section className="flex items-start justify-between mb-12 pb-10 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1A1A1A] mb-3 leading-tight">
            {t(lang, 'forecast.title')}
          </h1>
          <p className="text-sm text-[#6B6B6B] max-w-xl leading-relaxed">
            {t(lang, 'forecast.subtitle')}
          </p>
        </div>
        <div className="text-right text-xs text-[#6B6B6B] whitespace-nowrap shrink-0 ml-8 mt-1">
          <p>LSTM · ARIMA(2,1,0)</p>
          <p className="mt-0.5 text-[#B0B0B0]">World Bank quarterly</p>
        </div>
      </section>

      {/* Headline metrics */}
      <section className="grid grid-cols-4 border border-[#E5E5E5] divide-x divide-[#E5E5E5] mb-8">
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">0.15%</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'forecast.metric.arimaMape.label')}
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">5.38%</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'forecast.metric.lstmMape.label')}
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">28</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'forecast.metric.testQuarters.label')}
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="text-3xl font-semibold text-[#1A1A1A] tabular-nums mb-1">136</p>
          <p className="text-xs uppercase tracking-[0.1em] text-[#6B6B6B]">
            {t(lang, 'forecast.metric.totalObs.label')}
          </p>
        </div>
      </section>

      {/* Honest interpretation banner */}
      <div className="bg-[#F8F8F6] border-l-4 border-[#1A1A1A] px-5 py-4 mb-8">
        <p className="text-sm text-[#1A1A1A] leading-relaxed">
          {t(lang, 'forecast.banner')}
        </p>
      </div>

      {/* Chart */}
      <section className="mb-10">
        <ForecastChart quarterlyData={quarterlyData} />
      </section>

      {/* Explainer */}
      <div className="mb-12">
        <SpecPanel
          label="WHY ARIMA WINS HERE + MODEL SPECIFICATION"
          labelAz="ARIMA NİYƏ ÜSTÜNDÜR + MODEL SPESİFİKASİYASI"
        >
          <p className="text-[#6B6B6B]">{t(lang, 'explainer.arimaWins.body')}</p>
        </SpecPanel>
      </div>
    </main>
  )
}
