# Azerbaijan Economic Divergence Intelligence Platform

![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)
![National AI Strategy 2025-2028](https://img.shields.io/badge/National%20AI%20Strategy-2025--2028-1A1A1A?style=flat-square)

A production-grade AI research platform that applies machine learning to Azerbaijan's official macroeconomic statistics, projecting the structural transition from oil-dependent to diversified GDP across three Brent price scenarios through 2050. Built in direct alignment with the Presidential Decree on Azerbaijan's National AI Strategy 2025–2028 (19 March 2025), the platform treats `stat.gov.az`, the World Bank Open Data API, and the U.S. Energy Information Administration as first-class ML infrastructure — not supplementary sources.

## Platform Overview

The platform answers a single high-stakes policy question: *when does Azerbaijan's oil GDP share fall below 20%?* It approaches this through four independent ML models — a Monte Carlo divergence simulator, an LSTM/ARIMA GDP forecaster, a PELT structural break detector, and an XGBoost sector attribution model with SHAP explainability — each calibrated to January–April 2026 official data from the State Statistics Committee.

All models run against real data. Results are pre-computed and served as JSON via a FastAPI backend; the Next.js frontend renders them at request time with full bilingual support (English / Azerbaijani). The platform is designed for institutional audiences: government analysts, AI specialists, and international development economists evaluating Azerbaijan's non-oil diversification trajectory.

The retrospective validation result — 4/4 known economic shocks detected without prior date knowledge — establishes the methodology's credibility. The headline finding — oil GDP share falls below the 20% policy threshold by 2033 under the base case — is expressed in the exact KPI terms used in Azerbaijan's 2030 national strategy.

## Live Platform

| Resource | URL |
|----------|-----|
| Platform | https://az-econ-intelligence.vercel.app |
| API docs (Swagger) | https://az-econ-api.onrender.com/docs |

## Key Findings

| Finding | Value | Confidence |
|---------|-------|------------|
| Base case oil GDP crossover | 2033 | 100% (1,000 Monte Carlo paths) |
| Bear case crossover ($60/bbl) | 2029 | 100% |
| Bull case crossover ($100/bbl) | Post-2045 | <1% probability |
| Historical shocks validated | 4 / 4 | ±2 year tolerance |
| Oil-Brent elasticity | 0.256 | Calibrated 1990–2024 OLS |
| Current oil GDP share | 30.4% | stat.gov.az Jan–Apr 2026 |

## ML Architecture

| Model | Method | Target | Key Metric |
|-------|--------|--------|------------|
| A — GDP Forecaster | 2-layer LSTM + ARIMA(2,1,0) baseline | Quarterly GDP index | ARIMA MAPE 0.15% · LSTM 5.38% |
| B — Divergence Simulator | Monte Carlo, 1,000 paths | Oil/non-oil GDP share 2025–2050 | 3 Brent scenarios · p10/p50/p90 bands |
| C — Break Detector | PELT algorithm (ruptures) | Structural breaks in 6 macro series | 4/4 shocks validated retrospectively |
| D — Sector Attribution | XGBoost + SHAP TreeExplainer | Annual GDP growth rate | 7 sectors · 34 years · marginal pp contribution |

## Data Sources

| Source | URL | Type | Coverage |
|--------|-----|------|----------|
| State Statistics Committee | stat.gov.az | HTML bulletins (scraped) | 10 snapshots · 18 indicators · Jan 2025 – Apr 2026 |
| World Bank Open Data | api.worldbank.org/v2/country/AZ | REST JSON API | 9 annual indicators · 1990–2024 |
| U.S. EIA | api.eia.gov/v2/petroleum | CSV + API | Brent monthly · 1987–2026 · 450+ obs |
| Central Bank of Azerbaijan | cbar.az/page-40/statistical-bulletin | XLSX (cached) | 43 monthly bulletins · 2022–2026 · next phase |

## Repository Structure

```
Azerbaijan-Economic-AI/
├── data/
│   ├── raw/                    # Source files (excluded from git — re-fetched by scripts)
│   └── processed/              # Pre-computed ML outputs served by the API
│       ├── divergence_summary.csv
│       ├── lstm_results.csv
│       ├── anomaly_consolidated.csv
│       ├── sector_attribution_summary.csv
│       └── oil_divergence_base.csv
├── src/
│   ├── data/                   # Data acquisition and preprocessing scripts
│   │   ├── worldbank_fetcher.py
│   │   ├── eia_fetcher.py
│   │   ├── statgov_scraper.py
│   │   └── preprocessor.py
│   └── models/                 # ML model training scripts (do not modify without cause)
│       ├── divergence_simulator.py
│       ├── anomaly_detector.py
│       ├── sector_attribution.py
│       └── lstm_forecaster.py
├── backend/
│   ├── main.py                 # FastAPI app — serves data/processed/ as JSON
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/                # Next.js App Router pages
    │   │   ├── page.tsx                    # / — Overview
    │   │   ├── divergence/page.tsx         # /divergence
    │   │   ├── forecast/page.tsx           # /forecast
    │   │   ├── anomalies/page.tsx          # /anomalies
    │   │   ├── sectors/page.tsx            # /sectors
    │   │   └── methodology/page.tsx        # /methodology
    │   ├── components/         # React components
    │   │   ├── charts/         # Recharts chart components
    │   │   └── ...
    │   ├── context/
    │   │   └── LanguageContext.tsx         # EN/AZ bilingual state
    │   └── lib/
    │       └── i18n.ts                     # Translation dictionary
    └── package.json
```

## Quickstart

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm 9+

### 1. Clone and set up Python environment

```bash
git clone https://github.com/your-org/azerbaijan-economic-ai.git
cd azerbaijan-economic-ai

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 2. Fetch and preprocess data

```bash
# Fetch from primary sources (requires internet; EIA API key optional for historical data)
python src/data/worldbank_fetcher.py
python src/data/eia_fetcher.py
python src/data/statgov_scraper.py

# Build the unified panel
python src/data/preprocessor.py
```

### 3. Train models

```bash
python src/models/divergence_simulator.py
python src/models/anomaly_detector.py
python src/models/sector_attribution.py
python src/models/lstm_forecaster.py
```

Outputs are written to `data/processed/`. The repository ships with pre-computed outputs so this step can be skipped for frontend development.

### 4. Run the backend

```bash
cd backend
uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Platform available at `http://localhost:3000`.

### Environment variables

No environment variables are required for local development. The frontend hardcodes `http://localhost:8000` as the API base URL for local use.

## API Reference

All endpoints return `application/json`. NaN and Inf values are normalized to `null`.

| Method | Path | Description | Response shape |
|--------|------|-------------|----------------|
| GET | `/api/divergence/summary` | Crossover years and probabilities per scenario and threshold | `[{scenario, threshold, median_year, probability}]` |
| GET | `/api/divergence/curves/{scenario}` | Oil/non-oil share paths for `bear_60`, `base_80`, or `bull_100` | `[{year, oil_gdp_share_pct, nonoil_gdp_share_pct}]` |
| GET | `/api/forecast/quarterly` | LSTM vs ARIMA predictions for all quarters | `[{period, actual, lstm_pred, arima_pred}]` |
| GET | `/api/forecast/panel` | Raw quarterly GDP index and Brent price | `[{period, gdp_index, brent}]` |
| GET | `/api/anomalies/breaks` | Structural break years with series count and magnitude | `[{break_year, series_count, mean_magnitude}]` |
| GET | `/api/anomalies/validation` | 4/4 shock validation results with detection details | `[{shock_year, detected_year, series, validated}]` |
| GET | `/api/sectors/importance` | Mean absolute SHAP value per sector across full history | `[{sector, mean_shap}]` |
| GET | `/api/sectors/shap/{year}` | Per-sector SHAP value for a given year (1991–2024) | `[{sector, shap_value}]` |
| GET | `/api/sectors/summary` | Top and bottom sector per year with predicted growth | `[{year, top_sector, top_shap, bottom_sector, bottom_shap, predicted_growth}]` |

## National AI Strategy Alignment

**Presidential Decree, 19 March 2025** — Azerbaijan National AI Strategy 2025–2028

| Strategy Priority | Platform Implementation |
|------------------|------------------------|
| Priority 1 — Economic competitiveness and non-oil diversification | Headline KPI is the exact 20% oil GDP threshold named in Azerbaijan 2030 |
| Priority 2 — Production-grade AI on official state data | stat.gov.az and opendata.az treated as primary ML infrastructure |
| Priority 3 — Pilot project mechanism | Deployed, live intelligence system built on official Azerbaijani statistics |
| Priority 4 — Azerbaijan 2030 alignment | All projections expressed in the government's own policy-threshold terms (20%, 15%, 10%) |

## Technical Stack

| Layer | Backend & ML | Frontend |
|-------|-------------|---------|
| Language | Python 3.11 | TypeScript (strict) |
| Framework | FastAPI | Next.js 16 (App Router) |
| ML | TensorFlow 2.x, XGBoost, ruptures | — |
| Explainability | SHAP (TreeExplainer) | — |
| Data | pandas, numpy, scipy | — |
| Visualization | — | Recharts |
| Styling | — | Tailwind CSS v4 |
| Deployment | Render | Vercel |

## Roadmap

1. **CBAR monthly integration** — Replace cubic spline quarterly approximation with CBAR's 43 real monthly bulletins as LSTM training data. Pipeline is built; integration is the immediate next phase.

2. **IMF World Economic Outlook** — Add IMF WEO oil revenue fiscal modeling to project sovereign budget sustainability scenarios alongside the GDP share divergence model.

3. **Live data refresh pipeline** — Automated scraper that monitors `stat.gov.az` for new monthly bulletins and triggers a backend recompute, converting the platform from a snapshot system to a continuously updated intelligence feed.

## License

MIT
