import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ForecastContent from '@/components/ForecastContent'

type QuarterRow = {
  period: string
  actual: number | null
  lstm_pred: number | null
  arima_pred: number | null
  [key: string]: unknown
}

async function getQuarterly(): Promise<QuarterRow[]> {
  try {
    const res = await fetch('http://localhost:8000/api/forecast/quarterly', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    return (await res.json()) as QuarterRow[]
  } catch {
    return []
  }
}

export default async function ForecastPage() {
  const quarterlyData = await getQuarterly()

  return (
    <>
      <Nav />
      <ForecastContent quarterlyData={quarterlyData} />
      <Footer />
    </>
  )
}
