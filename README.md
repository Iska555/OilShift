# OilShift — Azerbaijan Economic Divergence Intelligence Platform

[![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)](https://tensorflow.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![National AI Strategy](https://img.shields.io/badge/National%20AI%20Strategy-2025–2028-1A1A1A?style=flat-square)](https://president.az)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-oilshift.vercel.app-0A0A0A?style=flat-square&logo=vercel&logoColor=white)](https://oilshift.vercel.app)

> **Four machine learning models. Thirty-five years of official statistics. One policy-critical question: when does Azerbaijan's oil economy become a historical footnote?**

---

## Why This Matters

Azerbaijan's dependence on hydrocarbon revenue is structural, not cyclical. At 30.4% of GDP as of January–April 2026 (State Statistics Committee), oil and gas underpin the country's fiscal position, trade balance, and sovereign wealth accumulation. But the field depletion curve is locked in. SOCAR's post-peak production decline runs at −2.5% per year — a trajectory independent of Brent price, immune to OPEC decisions, and compounding across decades. Even sustained $100/barrel oil cannot reverse it. The question is no longer whether Azerbaijan's oil economy shrinks. The question is when, how fast, and what grows in its place.

The government has stated this explicitly. *Azerbaijan 2030: National Development Priorities* identifies non-oil GDP diversification as the decade's primary economic objective. The Presidential Decree of 19 March 2025 — establishing the National AI Strategy 2025–2028 — mandates production-grade machine learning applied to official state datasets for economic governance decisions. OilShift is a direct operational response to that mandate: a deployed intelligence platform built on Azerbaijan's own statistics, answering the exact policy questions the strategy names.

This platform addresses three questions uniquely suited to machine learning. **When** does oil GDP share cross the 20% fiscal independence threshold, and how does that timeline shift under different Brent price regimes? **Which sectors** drove or suppressed non-oil growth in each year since independence — and which are structurally positioned to lead the transition? And **where** were the structural breaks in Azerbaijan's macroeconomic history — the years when patterns shifted irreversibly — before any human labeled them?

---

## Try It Now

| Resource | URL |
|----------|-----|
| **Live Platform** | [oilshift.vercel.app](https://oilshift.vercel.app) |
| **Backend API (Swagger)** | [oilshift-backend.fly.dev/docs](https://oilshift-backend.fly.dev/docs) |

**Six analytical pages:**

| Page | What It Shows |
|------|---------------|
| **Overview** | Headline findings, key statistics, and entry points to all four analytical modules |
| **Divergence** | Monte Carlo oil/non-oil GDP share projections, 2025–2050, across three Brent price scenarios with p10/p50/p90 confidence bands and interactive Brent slider |
| **Forecast** | LSTM vs. ARIMA quarterly GDP forecast comparison — model outputs, error metrics, and transparent methodology documentation |
| **Anomaly Detection** | PELT structural break identification across 6 macroeconomic series; all 4 known economic shocks validated retrospectively without prior date input |
| **Sector Attribution** | XGBoost + SHAP sector-level GDP growth contribution by year, 1991–2024, with interactive year scrubber and importance ranking |
| **Methodology** | Full technical specification — model architectures, data sources, calibration parameters, and National AI Strategy 2025–2028 alignment |

The platform is fully bilingual in **English and Azerbaijani**, with formal state-level academic terminology throughout.

---

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [ML Pipeline — Four Models](#ml-pipeline--four-models)
   - [Model A — Quarterly GDP Forecaster](#model-a--quarterly-gdp-forecaster)
   - [Model B — Monte Carlo Divergence Simulator](#model-b--monte-carlo-divergence-simulator)
   - [Model C — PELT Structural Break Detector](#model-c--pelt-structural-break-detector)
   - [Model D — XGBoost + SHAP Sector Attribution](#model-d--xgboost--shap-sector-attribution)
3. [System Architecture](#system-architecture)
4. [Tech Stack](#tech-stack)
5. [Data Sources](#data-sources)
6. [Key Findings](#key-findings)
7. [Policy Alignment](#policy-alignment)
8. [Installation](#installation)
9. [Acknowledgments](#acknowledgments)
10. [Contact](#contact)

---

## Platform Overview

OilShift is a sovereign economic intelligence platform built for government analysts, policy researchers, and institutional economists working on Azerbaijan's structural transition away from hydrocarbon dependence. It operationalizes four machine learning models against official Azerbaijani and international statistics — serving results through a bilingual interactive interface designed for institutional decision-makers, not data scientists.

Every output is framed in policy-relevant terms: crossover years expressed against IMF fiscal thresholds, sector contributions measured in percentage points of GDP growth, and shock detection reported in calendar years with historical event context. The platform is designed to be read by a ministry analyst in Baku and understood immediately, without statistical training.

**Alignment with Presidential Decree on National AI Strategy 2025–2028 (19 March 2025):**

| Strategy Priority | Platform Implementation |
|-------------------|-------------------------|
| **Priority Area 1 — Economic Competitiveness** | The platform's headline KPI — oil GDP share crossing the 20% IMF fiscal independence threshold — directly operationalizes Azerbaijan 2030's mandate to make the non-oil economy the center of development. Every projection is expressed in IMF fiscal benchmark terms. |
| **Priority Area 2 — Data-Driven Governance** | stat.gov.az, World Bank Open Data, and EIA are treated as first-class ML infrastructure. A fully automated scraping and preprocessing pipeline ingests official state statistics directly. |
| **Pilot Project Mechanism** | A deployed, live intelligence tool built on official Azerbaijani state statistics — the exact deliverable the Action Plan's pilot track specifies. |
| **Azerbaijan 2030 Alignment** | The divergence model tracks Azerbaijan 2030's mandate for non-oil economic centrality, using the 20%, 15%, and 10% IMF fiscal sustainability thresholds as operationalized benchmarks. |

---

## ML Pipeline — Four Models

### Model A — Quarterly GDP Forecaster

**Objective:** Benchmark LSTM deep learning against ARIMA econometric forecasting on quarterly GDP, establishing predictive baselines ahead of CBAR monthly data integration.

**Architecture:** 2-layer stacked LSTM (32 → 16 units) + Dropout(0.2) + Dense(1), benchmarked against ARIMA(2,1,0) rolling one-step forecast. StandardScaler fit on training set only — no data leakage. 80/20 train/test split.

**Training data:** 108 quarters derived from cubic spline interpolation of 35 annual World Bank observations (1990–2024). Features: GDP index, Brent crude price, industry share, services share, investment share. Test set: 28 quarters (2017Q1–2024Q4).

| Model | Test MAPE | Test Period |
|-------|-----------|-------------|
| ARIMA(2,1,0) — rolling one-step | **0.15%** | 28 quarters |
| LSTM (2-layer stacked) | 5.38% | 28 quarters |

**Why ARIMA wins — and why this is the correct methodological result:** The quarterly series is produced by cubic spline interpolation of 35 annual data points. This creates an artificially smooth curve with dominant linear autocorrelation — precisely the conditions under which ARIMA is theoretically optimal. LSTM networks require non-linear variation to outperform linear models; interpolated annual data contains none. This outcome is documented transparently as a property of the data generation process, not a model failure.

**Next phase:** Integration of 43 CBAR monthly bulletins (2022–2026) as training data will introduce the non-linear oil price transmission dynamics LSTM is designed to capture. The ingestion pipeline is built and validated.

---

### Model B — Monte Carlo Divergence Simulator

**Objective:** Project the forward trajectory of Azerbaijan's oil and non-oil GDP shares under three Brent price scenarios, quantifying the probability and timing of crossing the 20% IMF fiscal independence threshold.

**Method:** 1,000 stochastic paths per Brent price scenario, projected quarterly from 2025 to 2050 (100 time steps). Oil share dynamics follow a calibrated multiplicative process; non-oil share evolves via a mean-reverting diffusion calibrated to the State Program on National Economy (2019–2025).

**Oil share model:**
```
oil_share(t+1) = oil_share(t) × (1 + ε × ΔBrent) × (1 + δ)
```
where ε = oil-Brent elasticity, δ = structural production decline (fixed).

**Calibrated parameters:**

| Parameter | Value | Calibration Source |
|-----------|-------|--------------------|
| Oil-Brent price elasticity (ε) | **0.256** | OLS regression, World Bank data 1990–2024 |
| Structural production decline (δ) | **−2.5% / yr** | SOCAR historical output, post-peak period 2010–2024 |
| Non-oil sector annual drift | 4.5% mean, σ = 2.5% | State Program on National Economy targets + realized outturns |
| 2026 baseline — oil GDP share | **30.4%** | State Statistics Committee, Jan–Apr 2026 |
| Confidence bands reported | p10, p50, p90 | Across all 1,000 Monte Carlo paths |

**Results:**

| Scenario | Brent Assumption | Oil GDP < 20% | Probability Before 2050 |
|----------|-----------------|---------------|------------------------|
| Bear | $60 / bbl (sustained) | **2029** | 100% |
| Base | $80 / bbl (sustained) | **2033** | 100% |
| Bull | $100 / bbl (sustained) | Post-2045 | < 1% |

**On the 20% threshold:** Below this level, Azerbaijan's sovereign fiscal position achieves structural independence from hydrocarbon revenue under IMF fiscal sustainability benchmarks, operationalizing the Azerbaijan 2030 mandate to make the non-oil economy the center of development. The model also reports crossover years at the 25% and 15% thresholds.

---

### Model C — PELT Structural Break Detector

**Objective:** Identify years of irreversible structural change in Azerbaijan's macroeconomic regime — without prior knowledge of when shocks occurred — and validate against the four known major economic events of the post-independence period.

**Algorithm:** PELT (Pruned Exact Linear Time), implemented via the `ruptures` Python library. Cost function: RBF (Radial Basis Function). Penalty auto-tuned across the range [1, 15] to accept 2–8 breaks per series.

**Applied to 6 macroeconomic series:** GDP growth rate, Consumer Price Index, industrial output share, oil GDP share, non-oil GDP share, Brent crude annual average. Spanning 35 years: 1990–2024.

**Validation protocol:** No shock dates were provided to the model. A break detected within ±2 years of a known historical event is classified as validated. The ±2 year window reflects the lag between a shock's occurrence and its statistical signature in annual data.

**Results — 4 / 4 validated (100%):**

| Shock | Year | Event | Detection | Validation |
|-------|------|-------|-----------|------------|
| Post-Soviet Collapse | 1994 | GDP contraction of 21%; command economy disintegration | GDP growth + CPI simultaneous break | ✓ |
| Global Financial Crisis | 2008 | Brent collapse from $145 to $35/bbl in six months | Dominant break in Brent series | ✓ |
| Manat Devaluation | 2015 | AZN lost ~50% of value against USD in two steps | Detected one year early (2014) via Brent series | ✓ |
| COVID-19 + Oil Collapse | 2020 | Pandemic shock concurrent with Brent collapse to $20/bbl | Exact 2020 break in Brent series | ✓ |

**Notable finding — 2004:** Five of six series register simultaneous structural breaks in 2004. This marks the onset of full production from the ACG (Azeri-Chirag-Gunashli) oil consortium — the largest concurrent multi-series break in the dataset, and the most significant structural transformation in Azerbaijan's post-independence economic history. Detected without labeling.

The 2015 Manat devaluation — detected one year in advance via the Brent price series — demonstrates the model's capacity to function as a leading indicator of domestic macro stress.

---

### Model D — XGBoost + SHAP Sector Attribution

**Objective:** Decompose Azerbaijan's annual GDP growth rate into sector-level marginal contributions, year by year from 1991 to 2024, using gradient-boosted regression with game-theoretic explainability.

**Architecture:** XGBoostRegressor — n_estimators=200, max_depth=3, learning_rate=0.05, subsample=0.8, L1=0.1, L2=1.0. Target: annual GDP growth rate (%). Cross-validation: 5-fold CV. SHAP values computed via TreeExplainer (exact, not approximate).

**7 sectors modeled across 34 year-observations (1991–2024):**

| Sector | Attribution Pattern |
|--------|---------------------|
| Agriculture | Dominant non-oil stabilizer; top growth driver for 11 consecutive years post-2010 |
| Services | Peak contributor during the 2005–2008 oil boom; amplifies demand-side revenue transmission |
| Industry | Post-boom mean reversion; moderate long-run average contribution |
| Labor Market | Persistent structural drag 2010–2019; peak suppression −3.4pp in 2016 (post-devaluation structural unemployment) |
| Investment | Cyclical, low average impact; highly correlated with oil revenue cycles |
| Trade | Minor, stable contribution across the full period |
| Oil Price (Brent) | External shock transmission mechanism — amplifies volatility into domestic sector outcomes |

**SHAP interpretation:** Each sector's SHAP value for a given year represents its marginal contribution to predicted GDP growth in percentage points. Values are additive — they sum to total predicted growth. Positive SHAP means the sector pushed growth above the model baseline; negative means it suppressed it. This enables direct policy attribution: which sectors are building the non-oil economy, and which are dragging it.

**Output:** Per-year, per-sector SHAP values served as JSON; rendered as a horizontal waterfall chart with interactive year scrubber covering 1991–2024. Sector labels, interpretations, and all narrative text fully translated into formal Azerbaijani.

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER                               │
│                  oilshift.vercel.app  ·  EN / AZ                     │
└──────────────────────────────┬───────────────────────────────────────┘
                               │  HTTPS
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS 16 FRONTEND                             │
│   App Router  ·  Server Components  ·  TypeScript (strict)           │
│   Tailwind CSS v4  ·  Recharts  ·  next-intl (bilingual AZ/EN)       │
│   Deployed: Vercel Edge Network — global CDN                         │
└──────────────────────────────┬───────────────────────────────────────┘
                               │  REST/JSON
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       FASTAPI BACKEND                                │
│   Python 3.11  ·  Read-only runtime  ·  NaN/Inf → null sanitization  │
│   Deployed: Fly.io — always-on, no cold starts                       │
│                                                                      │
│   /api/divergence/summary         crossover years by scenario        │
│   /api/divergence/curves/{s}      oil/non-oil path arrays            │
│   /api/forecast/quarterly         LSTM vs ARIMA predictions          │
│   /api/anomalies/breaks           structural break years             │
│   /api/anomalies/validation       4/4 shock validation detail        │
│   /api/sectors/importance         mean |SHAP| per sector             │
│   /api/sectors/shap/{year}        per-sector SHAP for given year     │
│   /api/sectors/summary            top/bottom sector by year          │
└──────────────────────────────┬───────────────────────────────────────┘
                               │  file reads
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    PRE-COMPUTED ML OUTPUTS                           │
│                     data/processed/  (CSV, static)                   │
│                                                                      │
│   divergence_summary.csv          lstm_results.csv                   │
│   oil_divergence_base.csv         anomaly_consolidated.csv           │
│   sector_attribution_summary.csv                                     │
└──────────────────────────────┬───────────────────────────────────────┘
                               │  generated offline by
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      ML TRAINING PIPELINE                            │
│                         src/models/                                  │
│                                                                      │
│   Model A ── TensorFlow LSTM  ·  statsmodels ARIMA                   │
│   Model B ── Monte Carlo (numpy · scipy)                             │
│   Model C ── PELT changepoint detection (ruptures)                   │
│   Model D ── XGBoost + SHAP (xgboost · shap)                         │
└──────────────────────────────┬───────────────────────────────────────┘
                               │  ingests from
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                          DATA SOURCES                                │
│                                                                      │
│   stat.gov.az    10 monthly bulletins  ·  HTTP scraping              │
│   World Bank     9 annual indicators   ·  REST JSON API              │
│   EIA            Brent spot prices     ·  API v2 + CSV               │
│   CBAR (AMB)     43 XLSX bulletins     ·  cached locally             │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 16 (App Router, Server Components), TypeScript (strict mode), Tailwind CSS v4, Recharts, Framer Motion, next-intl (AZ/EN bilingual) |
| **Backend** | FastAPI, Python 3.11, Uvicorn |
| **ML / Data Science** | TensorFlow 2.x (LSTM), XGBoost, SHAP (TreeExplainer), ruptures (PELT), statsmodels (ARIMA), pandas, numpy, scipy |
| **Data Pipeline** | requests, BeautifulSoup4 (HTML scraping), openpyxl (XLSX parsing), scipy (cubic spline interpolation) |
| **Frontend Deployment** | Vercel — Edge Network, global CDN, automatic preview deployments per branch |
| **Backend Deployment** | Fly.io — Fly Machines, always-on, no cold starts, single-region (fra) |

---

## Data Sources

| Source | Indicators | Volume | Access |
|--------|------------|--------|--------|
| **State Statistics Committee** — stat.gov.az | GDP (oil/non-oil split), industrial output, retail trade turnover, budget revenues, strategic foreign reserves | 10 snapshots, Jan 2025 – Apr 2026 | HTTP scraping, HTML tables |
| **World Bank Open Data** — api.worldbank.org | 9 annual macroeconomic indicators for Azerbaijan (AZ) | 35 annual observations, 1990–2024 | REST JSON API — no key required |
| **U.S. Energy Information Administration** — api.eia.gov | Monthly Brent crude spot prices | 450+ observations, 1987–present | EIA API v2 + CSV export |
| **Central Bank of Azerbaijan** — cbar.az (CBAR / AMB) | USD/AZN exchange rates, monetary base, bank credit volumes, deposit volumes | 43 monthly XLSX bulletins, 2022–2026 | XLSX download, cached locally |

**CBAR status:** All 43 bulletins are downloaded, parsed, and cached. The data pipeline is validated and ready. Integration as LSTM training data — replacing the cubic spline quarterly approximation — is the immediate next development phase and is expected to materially improve forecast performance on oil price shock regimes.

---

## Key Findings

- **The 2033 Threshold.** Under the base case scenario ($80/bbl Brent, sustained), Azerbaijan's oil GDP share crosses below the 20% IMF fiscal independence threshold by **2033**. The result is supported by 100% of 1,000 Monte Carlo simulation paths. The structural driver is SOCAR field depletion at −2.5%/year — a process independent of price — compounding against non-oil sector growth of ~4.5%/year.

- **Non-Oil Growth Architecture.** Agriculture anchored non-oil GDP stability for 11 consecutive years across the post-crisis period, demonstrating that the most durable growth drivers in Azerbaijan are domestic and oil-price independent. Services amplified growth during the 2005–2008 oil boom but showed limited structural persistence. The Labor Market was a persistent structural drag from 2010–2019, peaking at −3.4 percentage points of GDP growth suppression in 2016 during the post-devaluation adjustment — the single largest drag event in the 34-year dataset.

- **Retrospective Shock Detection.** All four major economic discontinuities in Azerbaijan's post-independence history — the 1994 post-Soviet collapse, the 2008 global financial crisis, the 2015 Manat devaluation, and the 2020 COVID-19 and oil price shock — were identified retrospectively by the PELT algorithm within a ±2 year window, with zero prior date input. The 2015 devaluation was detected one year in advance via the Brent price series, establishing the model's capacity as a leading indicator of domestic macro stress.

---

## Policy Alignment

| Framework | Relevance to OilShift |
|-----------|----------------------|
| **Azerbaijan 2030: National Development Priorities** | Platform headline output — oil GDP share falling below 20% — directly tracks Azerbaijan 2030's mandate for non-oil economic development, using the 25%, 20%, and 15% IMF fiscal sustainability thresholds as operationalized benchmarks. |
| **Presidential Decree on National AI Strategy 2025–2028** (19 March 2025) | Platform directly implements Priority Areas 1 (economic AI application) and 2 (data-driven governance on official state datasets), fulfilling the Action Plan's pilot project specification at production deployment level. |
| **IMF Fiscal Sustainability Benchmarks** | The 20% oil GDP threshold is calibrated to the IMF's structural fiscal independence criterion for hydrocarbon-dependent sovereigns — the level at which Azerbaijan's budget becomes structurally independent of oil revenue volatility. |
| **SOCAR Production Curve** | The structural decline parameter (−2.5%/yr) is modeled directly from SOCAR's post-peak historical output (2010–2024), making divergence projections grounded in observed field depletion rather than assumed price paths. |

---

## Installation

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm 9+

### Backend

```bash
# Clone the repository
git clone https://github.com/[username]/oilshift.git
cd oilshift

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the API server (pre-computed outputs ship with the repo)
cd backend
uvicorn main:app --reload --port 8000
```

API available at `http://localhost:8000`. Interactive documentation at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
# Create .env.local and set:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Platform available at `http://localhost:3000`.

> The repository ships with pre-computed ML outputs in `data/processed/`. Model retraining is not required for local development or frontend work.

---

## Acknowledgments

- **World Bank Open Data** — Annual macroeconomic indicators for Azerbaijan, 1990–2024. [data.worldbank.org](https://data.worldbank.org)
- **State Statistics Committee of the Republic of Azerbaijan** — Monthly macroeconomic bulletins, 2025–2026. [stat.gov.az](https://stat.gov.az)
- **U.S. Energy Information Administration** — Brent crude spot price history, 1987–present. [eia.gov](https://eia.gov)
- **Central Bank of the Republic of Azerbaijan (CBAR / AMB)** — Monthly statistical bulletins, 2022–2026. [cbar.az](https://cbar.az)

---

## Contact

**Ismayil Huseynov**  
[ismayil.huseynov.usa@gmail.com](mailto:ismayil.huseynov.usa@gmail.com)
