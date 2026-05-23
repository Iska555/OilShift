import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SectorsContent from '@/components/SectorsContent'

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

async function getImportance(): Promise<ImportanceRow[]> {
  try {
    const res = await fetch('http://localhost:8000/api/sectors/importance', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return (await res.json()) as ImportanceRow[]
  } catch {
    return []
  }
}

async function getSectorSummary(): Promise<SectorSummaryRow[]> {
  try {
    const res = await fetch('http://localhost:8000/api/sectors/summary', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return (await res.json()) as SectorSummaryRow[]
  } catch {
    return []
  }
}

export default async function SectorsPage() {
  const [importanceData, sectorSummary] = await Promise.all([
    getImportance(),
    getSectorSummary(),
  ])

  return (
    <>
      <Nav />
      <SectorsContent
        importanceData={importanceData}
        sectorSummary={sectorSummary}
      />
      <Footer />
    </>
  )
}
