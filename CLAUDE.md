# Azerbaijan Economic Divergence Intelligence Platform

## Project Type
Full-stack AI research platform. Python ML backend + Next.js 14 frontend.
Operator: sole developer. Edit mode — propose all changes before applying.

## Stack
- Python 3.11 | FastAPI | pandas | numpy | tensorflow | xgboost | shap | ruptures
- Next.js 14 App Router | TypeScript | Tailwind CSS | Recharts
- Deploy: Vercel (frontend) + Render (backend)

## Repo Structure
```
data/processed/          ← pre-computed ML outputs, never regenerate
src/models/              ← ML models (do not modify unless explicitly asked)
backend/                 ← FastAPI, serves data/processed/ as JSON
frontend/                ← Next.js 14 app
```

## Backend Rules
- All routes return JSONResponse with _clean() applied (NaN/inf → null)
- Backend is read-only at runtime — it serves CSVs, never recomputes
- CORS open for local dev, restrict to Vercel domain in production
- Base URL: http://localhost:8000

## Key API Endpoints
- GET /api/divergence/summary          → crossover years per scenario
- GET /api/divergence/curves/{scenario} → oil/nonoil share paths (bear_60, base_80, bull_100)
- GET /api/forecast/quarterly           → LSTM vs ARIMA results
- GET /api/forecast/panel               → raw quarterly GDP + Brent
- GET /api/anomalies/breaks             → structural break years
- GET /api/anomalies/validation         → 4/4 shock validation
- GET /api/sectors/importance           → mean |SHAP| per sector
- GET /api/sectors/shap/{year}          → per-sector SHAP for a given year
- GET /api/sectors/summary              → top/bottom sector per year

## Key Data Files
- data/processed/divergence_summary.csv       → headline crossover numbers
- data/processed/lstm_results.csv             → period, actual, lstm_pred, arima_pred
- data/processed/anomaly_consolidated.csv     → break_year, series_count, mean_magnitude
- data/processed/sector_attribution_summary.csv → year, top_sector, bottom_sector, predicted_growth
- data/processed/oil_divergence_base.csv      → year, oil_gdp_share_pct, nonoil_gdp_share_pct

## Verified Data Points (from stat.gov.az Jan-Apr 2026)
- GDP total: 39,875.1M AZN | Oil-gas GDP: 12,135.0M AZN | Non oil-gas GDP: 27,740.1M AZN
- Oil share baseline: 30.4% | Non-oil share: 69.6%

## ML Results (do not fabricate, use actual outputs)
- Anomaly detection: 4/4 known shocks validated (1994, 2008, 2015, 2020)
- Divergence base case ($80/bbl): oil GDP < 20% by 2033
- Divergence bear case ($60/bbl): oil GDP < 20% by 2029
- Divergence bull case ($100/bbl): oil GDP stays elevated through 2045+
- ARIMA(2,1,0) MAPE: 0.15% | LSTM MAPE: 5.38% (expected on interpolated data)

## Frontend Design System
Reference: blackstone.com — institutional, minimal, high information density.
Not a startup dashboard. A professional research publication rendered as a web platform.
also see ui-ux design skill

### Typography
- Font stack: Inter for body, no decorative fonts
- Headings: heavy weight, tight tracking, dark on white
- Data labels: small, muted, precise — never rounded unless intentional
- No gradient text, no glow effects

### Color Palette (strict)
- Background: #FFFFFF or #F8F8F6 (off-white)
- Primary text: #1A1A1A
- Secondary text: #6B6B6B
- Accent (use sparingly): #1C1C1C or a single muted color — no neon, no purple
- Chart lines: #1A1A1A (primary), #6B6B6B (secondary), #B0B0B0 (tertiary)
- Positive/negative: deep green #1A6B3C and deep red #8B1A1A — never bright
- Borders: #E5E5E5
- Card backgrounds: #FFFFFF with subtle border, no colored backgrounds

### Charts (Recharts)
- All charts: white background, no gridline clutter (1 light horizontal grid only)
- No area fills with opacity — use clean lines
- Tooltip: white card, small text, border #E5E5E5
- Legend: text-only, small, no colored boxes unless necessary
- Axes: minimal, muted labels, no axis borders
- No animations on charts — static render
- Chart titles: left-aligned, small caps or semibold, above the chart

### Layout
- Max content width: 1200px centered
- Generous whitespace — Blackstone uses space as a design element
- Section dividers: thin 1px #E5E5E5 lines, not cards with shadows
- Navigation: clean top bar, no hamburger theatrics, text links
- No hero gradients, no particle backgrounds, no CSS animations
- Data callout numbers: large, bold, black — the number IS the design

### Components
- Stat cards: number dominant, label below in muted small text, 1px border
- Tables: clean, alternating #F8F8F6 rows, no colored headers
- Scenario toggles: text tabs with underline indicator, no pill buttons
- No skeleton loaders — show actual data or a clean dash (—)

## What NOT to Do
- No Tailwind gradient classes (bg-gradient-*, text-gradient)
- No animations (no framer-motion, no transition-all on data elements)
- No neon, purple, teal, or electric blue anywhere
- No drop shadows heavier than shadow-sm
- No emoji in UI
- No "loading spinners" — use simple text state
- Do not round numbers unless displaying to end users — preserve decimal precision in data
- Never hardcode ML results — always fetch from API

## Coding Standards
- All pages: Server Components by default, 'use client' only where needed
- API calls: fetch with error boundaries, never useEffect for initial data
- TypeScript strict — no `any`
- Tailwind only — no inline styles except truly dynamic values
- Component files: PascalCase, one component per file
- No console.log in committed code