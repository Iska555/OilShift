import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import DivergenceContent from '@/components/DivergenceContent'
import type { TableRow } from '@/components/DivergenceContent'
import type { DivergenceRow } from '@/types/divergence'
import { API_BASE } from '@/lib/api'

async function getDivergenceSummary(): Promise<DivergenceRow[]> {
  try {
    const res = await fetch(`${API_BASE}/api/divergence/summary`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return (await res.json()) as DivergenceRow[]
  } catch {
    return []
  }
}

function formatYear(year: number | null | undefined, probability: number): string {
  if (!year || probability < 0.05) return '—'
  return Math.round(year).toString()
}

function formatProb(probability: number): string {
  if (probability >= 0.995) return '100%'
  if (probability <= 0.005) return '<1%'
  return `${Math.round(probability * 100)}%`
}

function buildTableRows(rows: DivergenceRow[]): TableRow[] {
  const scenarios = [
    { key: 'bear_60', label: 'Bear Case', brent: '$60 / bbl' },
    { key: 'base_80', label: 'Base Case', brent: '$80 / bbl' },
    { key: 'bull_100', label: 'Bull Case', brent: '$100 / bbl' },
  ]
  return scenarios.map(({ key, label, brent }) => {
    const at25 = rows.find((r) => r.scenario === key && r.threshold === 0.25)
    const at20 = rows.find((r) => r.scenario === key && r.threshold === 0.2)
    const at15 = rows.find((r) => r.scenario === key && r.threshold === 0.15)
    return {
      scenario: key,
      label,
      brent,
      year25: formatYear(at25?.median_year, at25?.probability ?? 0),
      year20: formatYear(at20?.median_year, at20?.probability ?? 0),
      year15: formatYear(at15?.median_year, at15?.probability ?? 0),
      probability: formatProb(at20?.probability ?? 0),
      isBase: key === 'base_80',
    }
  })
}

export default async function DivergencePage() {
  const summaryData = await getDivergenceSummary()
  const tableRows = buildTableRows(summaryData)

  const baseCrossover = summaryData.find((d) => d.scenario === 'base_80' && d.threshold === 0.2)
  const crossoverYear =
    baseCrossover?.median_year && baseCrossover.probability > 0.01
      ? Math.round(baseCrossover.median_year).toString()
      : '2033'

  return (
    <>
      <Nav />
      <DivergenceContent
        tableRows={tableRows}
        crossoverYear={crossoverYear}
      />
      <Footer />
    </>
  )
}
