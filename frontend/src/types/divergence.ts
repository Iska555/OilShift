export interface DivergenceRow {
  scenario: string
  brent_price: number
  threshold: number
  median_year: number | null
  p10_year: number | null
  p90_year: number | null
  probability: number
}

export interface CurvePoint {
  period: string
  p10: number | null
  p50: number | null
  p90: number | null
}

export interface CurveData {
  scenario: string
  oil: CurvePoint[]
  nonoil: CurvePoint[]
}
