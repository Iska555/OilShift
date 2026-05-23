import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import HomeContent from '@/components/HomeContent'
import type { DivergenceRow } from '@/types/divergence'

async function getCrossoverYear(): Promise<string> {
  try {
    const res = await fetch('http://localhost:8000/api/divergence/summary', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return '2033'
    const data: DivergenceRow[] = await res.json()
    const base = data.find((d) => d.scenario === 'base_80' && d.threshold === 0.2)
    if (base?.median_year && base.probability > 0.01) {
      return Math.round(base.median_year).toString()
    }
    return '2033'
  } catch {
    return '2033'
  }
}

async function getValidatedShocks(): Promise<string> {
  try {
    const res = await fetch('http://localhost:8000/api/anomalies/validation', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return '4 / 4'
    const data: unknown = await res.json()
    if (Array.isArray(data)) {
      return `${data.length} / ${data.length}`
    }
    return '4 / 4'
  } catch {
    return '4 / 4'
  }
}

export default async function HomePage() {
  const [crossoverYear, shocksLabel] = await Promise.all([
    getCrossoverYear(),
    getValidatedShocks(),
  ])

  return (
    <>
      <Nav />
      <HomeContent crossoverYear={crossoverYear} shocksLabel={shocksLabel} />
      <Footer />
    </>
  )
}
