export type Lang = 'en' | 'az'

export interface Translations {
  // Navigation
  'nav.overview': string
  'nav.divergence': string
  'nav.forecast': string
  'nav.anomalies': string
  'nav.sectors': string
  'nav.methodology': string
  // Homepage
  'home.eyebrow': string
  'home.h1': string
  'home.h1.az.p1': string
  'home.h1.az.p2': string
  'home.subtitle': string
  'home.stat.oilShare': string
  'home.stat.crossoverYear': string
  'home.stat.shocksValidated': string
  'home.card.divergence.title': string
  'home.card.divergence.desc': string
  'home.card.forecast.title': string
  'home.card.forecast.desc': string
  'home.card.anomalies.title': string
  'home.card.anomalies.desc': string
  'home.card.viewAnalysis': string
  'home.finding.label': string
  'home.finding.text': string
  // Divergence page
  'divergence.pageLabel': string
  'divergence.title': string
  'divergence.subtitle': string
  'divergence.metric.oilShareToday': string
  'divergence.metric.productionDecline': string
  'divergence.metric.baseCaseBelow20': string
  'divergence.metric.elasticity': string
  'divergence.tab.bear': string
  'divergence.tab.base': string
  'divergence.tab.bull': string
  'divergence.tab.bbl60': string
  'divergence.tab.bbl80': string
  'divergence.tab.bbl100': string
  'divergence.crossover.label': string
  'divergence.probability.label': string
  'divergence.probability.text': string
  'divergence.ci.text': string
  'divergence.comparison.title': string
  'divergence.comparison.subtitle': string
  'divergence.table.col.scenario': string
  'divergence.table.col.brent': string
  'divergence.table.col.oil25': string
  'divergence.table.col.oil20': string
  'divergence.table.col.oil15': string
  'divergence.table.col.probability': string
  'divergence.scenario.bear': string
  'divergence.scenario.base': string
  'divergence.scenario.bull': string
  'divergence.brent.bear': string
  'divergence.brent.base': string
  'divergence.brent.bull': string
  'divergence.table.caption': string
  'divergence.methodology.title': string
  'divergence.methodology.p1': string
  'divergence.methodology.p2': string
  'divergence.methodology.p3': string
  'divergence.methodology.combined': string
  // Brent slider / explorer
  'slider.fallsBelow20': string
  'slider.perBarrel': string
  'slider.ci': string
  'slider.insight.bear': string
  'slider.insight.base': string
  'slider.insight.bull': string
  // Explorer
  'explorer.postYear': string
  'explorer.chartTitle': string
  'explorer.projection': string
  'explorer.policyTarget': string
  'explorer.baseline': string
  // Explainer toggles
  'explainer.triggerLabel': string
  'explainer.oilGdpShare.title': string
  'explainer.oilGdpShare.body': string
  'explainer.crossoverYear.title': string
  'explainer.crossoverYear.body': string
  'explainer.shockValidation.title': string
  'explainer.shockValidation.body': string
  'explainer.readingChart.title': string
  'explainer.readingChart.body': string
  'explainer.modelCalibration.title': string
  'explainer.modelCalibration.body': string
  'explainer.whatIsThis': string
  'explainer.methodologyNote': string
  // Footer + misc
  'footer.text': string
  'loading': string
  // Anomaly page
  'anomaly.eyebrow': string
  'anomaly.title': string
  'anomaly.subtitle': string
  'anomaly.badge': string
  'anomaly.metric.shocks.label': string
  'anomaly.metric.recentBreak.label': string
  'anomaly.metric.series2004.label': string
  'anomaly.metric.tolerance.label': string
  'explainer.anomalyMethod.title': string
  'explainer.anomalyMethod.body': string
  'anomaly.case.1994.title': string
  'anomaly.case.1994.text': string
  'anomaly.case.2008.title': string
  'anomaly.case.2008.text': string
  'anomaly.case.2015.title': string
  'anomaly.case.2015.text': string
  'anomaly.case.2020.title': string
  'anomaly.case.2020.text': string
  'anomaly.chart.title': string
  // Sectors page
  'sectors.title': string
  'sectors.subtitle': string
  'sectors.metric.topDriver.value': string
  'sectors.metric.topDriver.label': string
  'sectors.metric.peakContrib.value': string
  'sectors.metric.peakContrib.label': string
  'sectors.metric.drag.value': string
  'sectors.metric.drag.label': string
  'sectors.metric.count.label': string
  'explainer.shap.title': string
  'explainer.shap.body': string
  'sectors.insight': string
  'sectors.table.title': string
  'sectors.table.col.sector': string
  'sectors.table.col.meanShap': string
  'sectors.table.col.interpretation': string
  'sectors.waterfall.title': string
  // Forecast page
  'forecast.title': string
  'forecast.subtitle': string
  'forecast.metric.arimaMape.label': string
  'forecast.metric.lstmMape.label': string
  'forecast.metric.testQuarters.label': string
  'forecast.metric.totalObs.label': string
  'forecast.banner': string
  'forecast.toggle.full': string
  'forecast.toggle.test': string
  'explainer.arimaWins.title': string
  'explainer.arimaWins.body': string
  'forecast.legend.actual': string
  'forecast.callout.arima': string
  'forecast.callout.lstm': string
  // Sectors callouts
  'sectors.callout.topDriver': string
  'sectors.callout.topDrag': string
  'sectors.callout.dominantSector': string
  'sectors.callout.years': string
  // Sectors — new Fix 3 keys
  'sectors.tab.oilBoom': string
  'sectors.tab.postCrisis': string
  'sectors.scrubber.hint': string
  'sectors.table.subtitle': string
  'sectors.story.services.title': string
  'sectors.story.services.text': string
  'sectors.story.agriculture.title': string
  'sectors.story.agriculture.text': string
  'sectors.story.labor.title': string
  'sectors.story.labor.text': string
  'sectors.pp': string
  'sectors.ppNote': string
  // Home finding — Fix 2
  'home.finding.headline': string
  'home.finding.pullquote': string
  'home.finding.stat1.label': string
  'home.finding.stat2.label': string
  'home.finding.stat3.label': string
  // Forecast chart — Fix 1
  'forecast.chart.title': string
  // Forecast model explainers
  'explainer.arima.body': string
  'explainer.lstm.body': string
}

export type TranslationKey = keyof Translations

export function interpolate(template: string, vars: Record<string, string>): string {
  // AZ grammar fix: if year value already contains "sonra" (post-2045 case, e.g.
  // "2045-dən sonra"), appending "-ci ilə qədər" produces broken output. Rewrite
  // the full verb clause in the template before normal substitution runs.
  let s = template
  if (vars.year?.includes('sonra')) {
    s = s.replace(
      /\{year\}-ci ilə qədər 20%-dən aşağı düşür[\s\S]*/,
      `${vars.year} 20%-dən aşağı düşmür — bu ssenaridə hədəf keçilmir.`
    )
  }
  return Object.entries(vars).reduce(
    (acc, [k, v]) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), v),
    s
  )
}

const en: Translations = {
  'nav.overview': 'Overview',
  'nav.divergence': 'Divergence',
  'nav.forecast': 'Forecast',
  'nav.anomalies': 'Anomalies',
  'nav.sectors': 'Sectors',
  'nav.methodology': 'Methodology',

  'home.eyebrow': 'NATIONAL AI STRATEGY 2025–2028 ALIGNMENT',
  'home.h1': "Azerbaijan's Oil Dependency, Modeled by AI",
  'home.h1.az.p1': '',
  'home.h1.az.p2': '',
  'home.subtitle': 'Machine-learning analysis of the oil-to-non-oil GDP structural transition, projecting divergence scenarios through 2050 from official statistics calibrated to January–April 2026.',
  'home.stat.oilShare': 'Current Oil GDP Share',
  'home.stat.crossoverYear': 'Base Case Crossover Year',
  'home.stat.shocksValidated': 'Historical Shocks Validated',
  'home.card.divergence.title': 'Divergence Scenarios',
  'home.card.divergence.desc': 'Three Brent price paths — bear ($60), base ($80), bull ($100) — project when oil GDP share falls below 20% of total output.',
  'home.card.forecast.title': 'GDP Forecast',
  'home.card.forecast.desc': 'ARIMA(2,1,0) and LSTM models produce quarterly GDP forecasts benchmarked against official 2026 data from stat.gov.az.',
  'home.card.anomalies.title': 'Anomaly Detection',
  'home.card.anomalies.desc': 'Structural break detection identifies all four known economic shocks — 1994, 2008, 2015, and 2020 — without prior labeling.',
  'home.card.viewAnalysis': 'View analysis',
  'home.finding.label': 'Platform Finding',
  'home.finding.text': "Under the base case scenario ($80/bbl sustained), Azerbaijan's oil GDP share falls below 20% by 2033 — driven by structural production decline and non-oil sector growth.",

  'divergence.pageLabel': 'Divergence Analysis',
  'divergence.title': 'Oil GDP Share Scenarios, 2025–2050',
  'divergence.subtitle': "Projects when Azerbaijan's oil GDP share falls below the 20% policy threshold across three Brent price paths — base case crosses in {year} at sustained $80/bbl.",
  'divergence.metric.oilShareToday': 'Oil Share Today',
  'divergence.metric.productionDecline': 'Structural Production Decline',
  'divergence.metric.baseCaseBelow20': 'Base Case Below 20%',
  'divergence.metric.elasticity': 'Oil-Brent Elasticity',
  'divergence.tab.bear': 'Bear',
  'divergence.tab.base': 'Base',
  'divergence.tab.bull': 'Bull',
  'divergence.tab.bbl60': '$60 / bbl',
  'divergence.tab.bbl80': '$80 / bbl',
  'divergence.tab.bbl100': '$100 / bbl',
  'divergence.crossover.label': 'Oil GDP Below 20% — Crossover Year',
  'divergence.probability.label': 'Scenario Probability',
  'divergence.probability.text': '{n}% of Monte Carlo paths cross below 20% before 2050',
  'divergence.ci.text': '80% confidence interval',
  'divergence.comparison.title': 'Scenario Comparison',
  'divergence.comparison.subtitle': 'Median crossover year by price scenario — year when oil GDP share falls below each threshold',
  'divergence.table.col.scenario': 'Scenario',
  'divergence.table.col.brent': 'Brent Price',
  'divergence.table.col.oil25': 'Oil < 25%',
  'divergence.table.col.oil20': 'Oil < 20%',
  'divergence.table.col.oil15': 'Oil < 15%',
  'divergence.table.col.probability': 'Probability at 20%',
  'divergence.scenario.bear': 'Bear Case',
  'divergence.scenario.base': 'Base Case',
  'divergence.scenario.bull': 'Bull Case',
  'divergence.brent.bear': '$60 / bbl',
  'divergence.brent.base': '$80 / bbl',
  'divergence.brent.bull': '$100 / bbl',
  'divergence.table.caption': 'Probability is the fraction of 1,000 Monte Carlo paths in which oil GDP share crosses below 20% before 2050. Crossover years shown only where probability exceeds 5%.',
  'divergence.methodology.title': 'Methodology + Model Specification',
  'divergence.methodology.p1': 'Scenarios are generated via Monte Carlo simulation with 1,000 paths per Brent price assumption. Each path draws from a calibrated stochastic process for oil production decline and non-oil sector growth, seeded from 2026 actuals.',
  'divergence.methodology.p2': 'Oil-Brent elasticity (0.256) is estimated via OLS regression on World Bank and State Statistics Committee data, 1990–2024. Structural production decline (−2.5%/yr) reflects SOCAR historical output from the post-peak period (2010–2024).',
  'divergence.methodology.p3': "Non-oil sector growth follows a mean-reverting process calibrated against the State Program on National Economy targets (2019–2025) and realized outturns. The 20% threshold corresponds to the level below which Azerbaijan's sovereign fiscal position becomes structurally independent of hydrocarbon revenue under IMF fiscal sustainability benchmarks.",
  'divergence.methodology.combined': "Scenarios are generated via Monte Carlo simulation with 1,000 paths per Brent price assumption. Each path draws from a calibrated stochastic process for oil production decline and non-oil sector growth, seeded from 2026 actuals. Oil-Brent elasticity (0.256) is estimated via OLS regression on World Bank and State Statistics Committee data, 1990–2024. Structural production decline (−2.5%/yr) reflects SOCAR historical output from the post-peak period (2010–2024). Non-oil sector growth follows a mean-reverting process calibrated against the State Program on National Economy targets (2019–2025) and realized outturns. The 20% threshold corresponds to the level below which Azerbaijan's sovereign fiscal position becomes structurally independent of hydrocarbon revenue under IMF fiscal sustainability benchmarks.",

  'slider.fallsBelow20': 'Falls below 20% by',
  'slider.perBarrel': 'per barrel',
  'slider.ci': '80% CI:',
  'slider.insight.bear': "At ${price}/bbl, accelerated field depletion compresses the timeline — oil's share falls below 20% by {year}, {years_ahead} years ahead of the base case.",
  'slider.insight.base': "Base case scenario. At sustained ${price}/bbl, oil GDP share crosses 20% by {year} with 100% model probability across 1,000 Monte Carlo simulations.",
  'slider.insight.bull': "Elevated prices delay the structural transition. Oil share likely remains above 20% beyond 2045 — high revenues reduce diversification urgency.",

  'explorer.postYear': 'Post-2045',
  'explorer.chartTitle': 'Oil GDP Share Trajectory',
  'explorer.projection': 'Projection',
  'explorer.policyTarget': '20% — Policy Target',
  'explorer.baseline': '2026 Baseline: 30.4%',

  'explainer.triggerLabel': 'ℹ About this',
  'explainer.oilGdpShare.title': 'WHAT IS OIL GDP SHARE?',
  'explainer.oilGdpShare.body': "This figure represents the proportion of Azerbaijan's total economic output directly attributable to the extraction and processing of oil and gas. At 30.4%, roughly one-third of all economic activity is tied to hydrocarbon revenues — a structural dependency the government's Azerbaijan 2030 strategy explicitly targets for reduction as mature fields enter natural decline.",
  'explainer.crossoverYear.title': 'HOW IS THE CROSSOVER YEAR CALCULATED?',
  'explainer.crossoverYear.body': "Using a Monte Carlo simulation of 1,000 stochastic paths, the model projects Azerbaijan's oil GDP share forward from the 2026 baseline. The 2033 figure represents the median year in which oil's share falls below the 20% policy threshold under a sustained $80/barrel Brent price — the base case calibrated to historical price sensitivity from 1990–2024 World Bank data.",
  'explainer.shockValidation.title': 'RETROSPECTIVE SHOCK VALIDATION',
  'explainer.shockValidation.body': 'The PELT changepoint detection algorithm was applied to six macroeconomic series spanning 35 years. Without being given the dates, it identified structural breaks within a ±2 year window of all four major economic shocks: the 1994 post-Soviet stabilization, the 2008 global financial crisis, the 2015 Manat devaluation, and the 2020 COVID-19 collapse. This retrospective accuracy validates the methodology.',
  'explainer.readingChart.title': 'READING THIS CHART',
  'explainer.readingChart.body': "The vertical axis shows oil's share of Azerbaijan's GDP as a percentage. The horizontal axis runs from 2025 to 2050. The dark solid line is the median projection (p50) — half of all 1,000 model simulations fall above it, half below. The dashed lines represent the 10th and 90th percentiles, forming an 80% confidence band. The horizontal reference line marks the 20% threshold derived from IMF fiscal sustainability benchmarks, operationalizing the Azerbaijan 2030 mandate to make the non-oil economy the center of development.",
  'explainer.modelCalibration.title': 'MODEL CALIBRATION',
  'explainer.modelCalibration.body': "The slider recalculates the crossover year based on a calibrated oil-price sensitivity coefficient of 0.256 — meaning a 10% change in Brent price corresponds to a 2.56% change in oil's GDP share. This elasticity was derived from OLS regression on 35 years of World Bank sectoral data. The structural production decline of −2.5%/year is modeled separately, reflecting SOCAR's post-peak depletion curve and is independent of price.",
  'explainer.whatIsThis': 'WHAT IS THIS?',
  'explainer.methodologyNote': 'METHODOLOGY NOTE',

  'footer.text': 'Azerbaijan Economic Divergence Intelligence Platform · Data: stat.gov.az, World Bank, EIA, CBAR · Built with Azerbaijan National AI Strategy 2025–2028',
  'loading': 'Loading',

  // Anomaly page
  'anomaly.eyebrow': 'ANOMALY DETECTION',
  'anomaly.title': 'Structural Break Analysis, 1990–2024',
  'anomaly.subtitle': 'PELT changepoint detection applied to six macroeconomic series. Four known shocks retrospectively validated without prior date knowledge.',
  'anomaly.badge': '4 / 4 Validated',
  'anomaly.metric.shocks.label': 'Shocks Validated',
  'anomaly.metric.recentBreak.label': 'Most Recent Break',
  'anomaly.metric.series2004.label': 'Series in 2004 Break',
  'anomaly.metric.tolerance.label': 'Detection Tolerance',
  'explainer.anomalyMethod.title': 'HOW DOES ANOMALY DETECTION WORK?',
  'explainer.anomalyMethod.body': "The PELT (Pruned Exact Linear Time) algorithm scans each macroeconomic series for points where the statistical properties — mean, variance, or trend — change abruptly. It requires no prior knowledge of when shocks occurred. A break detected within ±2 years of a known event is counted as validated. The 2004 break affecting 5 series simultaneously marks the ACG oil boom — the most structurally significant event in Azerbaijan's post-independence economic history.",
  'anomaly.case.1994.title': 'Post-Soviet Stabilization',
  'anomaly.case.1994.text': 'GDP contracted by 21% as the command economy collapsed. The break appears across GDP growth and CPI simultaneously.',
  'anomaly.case.2008.title': 'Global Financial Crisis',
  'anomaly.case.2008.text': 'Oil prices collapsed from $145 to $35/bbl in six months. GDP growth decelerated sharply. Brent series shows the dominant structural break.',
  'anomaly.case.2015.title': 'Manat Devaluation',
  'anomaly.case.2015.text': 'The Azerbaijani manat lost ~50% of its value against the USD in two steps. Detected one year early (2014) via the Brent price series — demonstrating leading indicator capability.',
  'anomaly.case.2020.title': 'COVID-19 + Oil Collapse',
  'anomaly.case.2020.text': "Simultaneous pandemic shock and oil price collapse to $20/bbl. The Brent series registers an exact 2020 break — the model's most precise detection.",
  'anomaly.chart.title': 'MACRO-SHOCK CARDIOGRAM',

  // Sectors page
  'sectors.title': 'Sector Attribution Analysis, 1991–2024',
  'sectors.subtitle': 'XGBoost regression with SHAP values identifies which sectors drove or suppressed GDP growth each year.',
  'sectors.metric.topDriver.value': 'Agriculture',
  'sectors.metric.topDriver.label': 'Top Driver 2014–2021',
  'sectors.metric.peakContrib.value': 'Services',
  'sectors.metric.peakContrib.label': 'Peak Contributor 2005–2008',
  'sectors.metric.drag.value': 'Labor Market',
  'sectors.metric.drag.label': 'Dominant Drag 2010–2019',
  'sectors.metric.count.label': 'Sectors Modeled',
  'explainer.shap.title': 'WHAT ARE SHAP VALUES?',
  'explainer.shap.body': "SHAP (SHapley Additive exPlanations) values measure each sector's marginal contribution to the model's GDP growth prediction. A positive SHAP value means the sector pushed growth above the baseline; negative means it suppressed it. The values are additive — they sum to the total predicted growth rate for that year.",
  'sectors.insight': 'In {year}, {top} was the primary growth driver (+{topVal}pp), while {bottom} subtracted {bottomVal}pp from GDP growth.',
  'sectors.table.title': 'Overall Sector Importance',
  'sectors.table.col.sector': 'Sector',
  'sectors.table.col.meanShap': 'Mean |SHAP|',
  'sectors.table.col.interpretation': 'Interpretation',
  'sectors.waterfall.title': 'SHAP Attribution — {year}',

  // Forecast page
  'forecast.title': 'GDP Growth Forecast, 1991–2024',
  'forecast.subtitle': 'LSTM deep learning model versus ARIMA econometric baseline. Out-of-sample test on 28 quarters.',
  'forecast.metric.arimaMape.label': 'ARIMA Test MAPE',
  'forecast.metric.lstmMape.label': 'LSTM Test MAPE',
  'forecast.metric.testQuarters.label': 'Test Quarters',
  'forecast.metric.totalObs.label': 'Total Observations',
  'forecast.banner': 'On this dataset, ARIMA outperforms LSTM. This is expected: the quarterly series is derived from cubic spline interpolation of 35 annual World Bank observations, producing a smooth curve that favors linear models. LSTM\'s advantage will emerge when CBAR monthly series (43 bulletins) are incorporated as training data.',
  'forecast.toggle.full': 'Full History',
  'forecast.toggle.test': 'Test Period Only',
  'explainer.arimaWins.title': 'WHY DOES ARIMA WIN HERE?',
  'explainer.arimaWins.body': "ARIMA excels on smooth, trend-following series — and the interpolated quarterly GDP index is exactly that. LSTM networks require sufficient non-linear variation to learn patterns that linear models cannot. On 35 years of annual data upscaled to quarterly by cubic spline, there is no such variation. This is a methodologically honest result, not a failure: the platform documents it transparently as part of its scientific integrity.",
  'forecast.legend.actual': 'Actual',
  'forecast.callout.arima': 'MAPE on test period. ARIMA wins on smooth interpolated data — linear autocorrelation dominates.',
  'forecast.callout.lstm': 'MAPE on test period. Expected on cubic spline data; LSTM advantage emerges with monthly CBAR series.',
  'sectors.callout.topDriver': 'Top Driver',
  'sectors.callout.topDrag': 'Biggest Drag',
  'sectors.callout.dominantSector': 'Most Frequent Top',
  'sectors.callout.years': 'years as top driver',
  'sectors.tab.oilBoom': 'Oil Boom 2005–2008',
  'sectors.tab.postCrisis': 'Post-Crisis 2014–2020',
  'sectors.scrubber.hint': 'Drag to explore year',
  'sectors.table.subtitle': 'Mean absolute SHAP value across 1991–2024',
  'sectors.story.services.title': 'SERVICES PEAK',
  'sectors.story.services.text': 'Services sector peak contribution during the 2006 oil boom, when rapid revenue growth amplified domestic demand.',
  'sectors.story.agriculture.title': 'AGRICULTURE DOMINANCE',
  'sectors.story.agriculture.text': 'Agriculture was the top growth driver for 11 consecutive years, anchoring non-oil stability through commodity shocks.',
  'sectors.story.labor.title': 'LABOR MARKET LOW',
  'sectors.story.labor.text': 'Peak labor market drag in 2016 — structural unemployment suppressed GDP growth during the post-devaluation adjustment.',
  'sectors.pp': 'pp',
  'sectors.ppNote': 'pp = percentage points — the absolute change in GDP growth rate attributed to this sector. +1pp means the sector added 1 percentage point to that year\'s GDP growth.',
  'home.finding.headline': 'PLATFORM HEADLINE FINDING',
  'home.finding.pullquote': "Under sustained $80/barrel oil prices, Azerbaijan's oil GDP share falls below the 20% policy threshold by 2033 — driven by structural field depletion at −2.5%/year and non-oil sector growth of 4.5%/year.",
  'home.finding.stat1.label': 'Base case threshold crossing',
  'home.finding.stat2.label': 'Model probability (1,000 paths)',
  'home.finding.stat3.label': 'Structural production decline',
  'forecast.chart.title': 'Quarterly GDP Index',
  'explainer.arima.body': "ARIMA (Autoregressive Integrated Moving Average) is a standard econometric baseline model for time series forecasting, identifying linear dependencies and historical trends. It achieves highest accuracy when data is stationary and smooth. On this dataset — quarterly GDP derived from cubic spline interpolation of 35 annual World Bank observations — ARIMA produces a 0.15% MAPE, outperforming LSTM because the smooth interpolated series favors linear autoregressive structure.",
  'explainer.lstm.body': "LSTM (Long Short-Term Memory) is a deep learning model capable of learning complex, non-linear patterns and long-range dependencies in time series data. It is applied where linear models fail — datasets containing abrupt structural breaks and high volatility. On smooth interpolated data, LSTM scores 5.38% MAPE. Its advantage will emerge when CBAR's 43 monthly bulletins (2022–2026) are incorporated as training data, replacing the interpolated quarterly approximation with real observed monthly values.",
}

const az: Translations = {
  'nav.overview': 'Ümumi İcmal',
  'nav.divergence': 'Diversifikasiya Təhlili',
  'nav.forecast': 'Proqnozlaşdırma',
  'nav.anomalies': 'Anomaliyalar',
  'nav.sectors': 'Sektor Analizi',
  'nav.methodology': 'Metodologiya',

  'home.eyebrow': 'MİLLİ SÜNİ İNTELLEKT STRATEGİYASI 2025–2028 ÇƏRÇƏVƏSINDƏ',
  'home.h1': 'Süni intellekt tərəfindən modelləşdirilmiş Azərbaycan Respublikasının neft sektorundan asılılığı',
  'home.h1.az.p1': 'Süni intellekt tərəfindən modelləşdirilmiş',
  'home.h1.az.p2': 'Azərbaycan Respublikasının neft sektorundan asılılığı',
  'home.subtitle': '2026-cı ilin yanvar-aprel dövrü üzrə rəsmi statistikaya əsaslanan və 2050-ci ilə qədər divergensiya ssenarilərini proqnozlaşdıran, Neftdən qeyri-neft ÜDM-ə struktur keçidinin Machine Learning əsasında təhlili.',
  'home.stat.oilShare': 'CARİ Neft-Qaz ÜDM Payı',
  'home.stat.crossoverYear': 'Əsas SSENARİ üzrə Keçid İLİ',
  'home.stat.shocksValidated': 'Modelİn keçmiş İQTİSADİ sarsıntılarla uzlaşdırılması',
  'home.card.divergence.title': 'Diversifikasiya Ssenariləri',
  'home.card.divergence.desc': 'Üç Brent qiyməti ssenarisi — pessimist (60$/barel), əsas (80$/barel), optimist (100$/barel) — neft-qaz ÜDM payının ümumi çıxışın 20%-dən aşağı düşdüyü ili proqnozlaşdırır.',
  'home.card.forecast.title': 'ÜDM Proqnozu',
  'home.card.forecast.desc': 'ARIMA(2,1,0) və LSTM modelləri rüblük ÜDM proqnozları formalaşdırır; stat.gov.az-ın 2026-cı il rəsmi məlumatları ilə müqayisə edilir.',
  'home.card.anomalies.title': 'Anomaliyaların Aşkar Edilməsi',
  'home.card.anomalies.desc': 'Struktur kəsim aşkarlanması, əvvəlcədən etiketlənmə aparılmadan dörd məlum iqtisadi sarsıntını — 1994, 2008, 2015 və 2020-ci illəri — müəyyən edir.',
  'home.card.viewAnalysis': 'Təhlilə keç',
  'home.finding.label': 'Platformanın Əsas Tapıntısı',
  'home.finding.text': 'Əsas ssenaridə (barrel başına 80 ABŞ dolları sabit qiymətlə) Azərbaycanın neft-qaz sektorunun ÜDM-dəki payı 2033-cü ilə qədər 20%-dən aşağı düşəcək — bu, struktur istehsal azalması və qeyri-neft sektorunun inkişafı ilə şərtlənir.',

  'divergence.pageLabel': 'Diversifikasiya ANALİZİ',
  'divergence.title': 'Neft-Qaz ÜDM Payı Ssenariləri, 2025–2050',
  'divergence.subtitle': 'Üç müxtəlif Brent nefti qiyməti ehtimalı üzrə neftin ÜDM-dəki payının 20%-lik strateji həddin altına düşəcəyi ili hesablayır. Davamlı $80/barel qiymətinin tətbiq edildiyi baza ssenarisində bu keçid {year}-ci ilə təsadüf edir.',
  'divergence.metric.oilShareToday': 'Hazırda Neft-Qaz Payı',
  'divergence.metric.productionDecline': 'İstehsalın Struktur Azalması',
  'divergence.metric.baseCaseBelow20': 'Əsas Ssenaridə 20%-dən Aşağı Düşmə',
  'divergence.metric.elasticity': 'Neft-Brent Elastikliyi',
  'divergence.tab.bear': 'Pessimist',
  'divergence.tab.base': 'Əsas',
  'divergence.tab.bull': 'Optimist',
  'divergence.tab.bbl60': '60$/barel',
  'divergence.tab.bbl80': '80$/barel',
  'divergence.tab.bbl100': '100$/barel',
  'divergence.crossover.label': 'Neft ÜDM 20%-dən Aşağı — Keçid İli',
  'divergence.probability.label': 'Ssenari Ehtimalı',
  'divergence.probability.text': '{n}% Monte Karlo yolunun 2050-ci ilə qədər 20%-dən aşağı düşür',
  'divergence.ci.text': 'etibar intervalı',
  'divergence.comparison.title': 'Ssenarilərin Müqayisəsi',
  'divergence.comparison.subtitle': 'Qiymət ssenarisi üzrə median keçid ili — neft-qaz ÜDM payının hər həddən aşağı düşdüyü il',
  'divergence.table.col.scenario': 'Ssenari',
  'divergence.table.col.brent': 'Brent Qiyməti',
  'divergence.table.col.oil25': 'Neft < 25%',
  'divergence.table.col.oil20': 'Neft < 20%',
  'divergence.table.col.oil15': 'Neft < 15%',
  'divergence.table.col.probability': '20%-də Ehtimal',
  'divergence.scenario.bear': 'Neqativ ssenari ($60/barel)',
  'divergence.scenario.base': 'Əsas Ssenari',
  'divergence.scenario.bull': 'Pozitiv ssenari ($100/barel)',
  'divergence.brent.bear': '60$/barel',
  'divergence.brent.base': '80$/barel',
  'divergence.brent.bull': '100$/barel',
  'divergence.table.caption': 'Ehtimal, 2050-ci ilə qədər neft-qaz ÜDM payının 20% həddini aşan 1.000 Monte Karlo yolunun nisbətini göstərir. Keçid illəri yalnız ehtimal 5%-dən çox olduqda göstərilir.',
  'divergence.methodology.title': 'Metodologiya + Model Spesifikasiyası',
  'divergence.methodology.p1': 'Ssenarilər hər Brent qiyməti fərziyyəsinə uyğun 1000 trayektoriyalı Monte Carlo simulyasiyası vasitəsilə yaradılır. Hər bir trayektoriya 2026-cı ilin faktiki məlumatlarına əsaslanan, neft hasilatının azalması və qeyri-neft sektorunun böyüməsi üçün kalibrlənmiş stoxastik prosesdən irəli gəlir.',
  'divergence.methodology.p2': 'Neft-Brent elastikliyi (0,256) Dünya Bankı və Dövlət Statistika Komitəsinin 1990–2024-cü illər üzrə məlumatları əsasında OLS reqressiyası ilə qiymətləndirilmişdir. Struktur hasilat azalması (illik −2,5%) SOCAR-ın pik dövrdən sonrakı (2010–2024) tarixi göstəricilərini əks etdirir.',
  'divergence.methodology.p3': 'Qeyri-neft sektorunun inkişafı isə Milli İqtisadiyyat üzrə Dövlət Proqramının hədəflərinə (2019–2025) və real nəticələrə uyğunlaşdırılmış "mean-reverting" (ortalamaya qayıdış) prosesini izləyir. 20%-lik hədd, BVF-nin (BVF = IMF) fiskal dayanıqlılıq meyarlarına görə Azərbaycanın suveren fiskal mövqeyinin karbohidrogen gəlirlərindən struktur olaraq müstəqil olduğu səviyyəni göstərir.',
  'divergence.methodology.combined': 'Ssenarilər hər Brent qiyməti fərziyyəsinə uyğun 1000 trayektoriyalı Monte Carlo simulyasiyası vasitəsilə yaradılır. Hər bir trayektoriya 2026-cı ilin faktiki məlumatlarına əsaslanan, neft hasilatının azalması və qeyri-neft sektorunun böyüməsi üçün kalibrlənmiş stoxastik prosesdən irəli gəlir. Neft-Brent elastikliyi (0,256) Dünya Bankı və Dövlət Statistika Komitəsinin 1990–2024-cü illər üzrə məlumatları əsasında OLS reqressiyası ilə qiymətləndirilmişdir. Struktur hasilat azalması (illik −2,5%) SOCAR-ın pik dövrdən sonrakı (2010–2024) tarixi göstəricilərini əks etdirir. Qeyri-neft sektorunun inkişafı isə Milli İqtisadiyyat üzrə Dövlət Proqramının hədəflərinə (2019–2025) və real nəticələrə uyğunlaşdırılmış "mean-reverting" (ortalamaya qayıdış) prosesini izləyir. 20%-lik hədd, BVF-nin (BVF = IMF) fiskal dayanıqlılıq meyarlarına görə Azərbaycanın suveren fiskal mövqeyinin karbohidrogen gəlirlərindən struktur olaraq müstəqil olduğu səviyyəni göstərir.',

  'slider.fallsBelow20': 'Neft payı 20%-dən aşağı düşür:',
  'slider.perBarrel': 'hər barrel üçün',
  'slider.ci': '80% Etibar İntervalı:',
  'slider.insight.bear': '{price}$/barel qiymətində yataqların sürətli tükənməsi müddəti qısaldır — neft payı {year}-ci ildə 20%-dən aşağı düşür, bu isə əsas ssenaridən {years_ahead} il əvvəldir.',
  'slider.insight.base': 'Əsas ssenari. {price}$/barel sabit qiymətlə neft-qaz ÜDM payı {year}-ci ilə qədər 20%-dən aşağı düşür — 1.000 Monte-Karlo simulyasiyasının 100%-i bunu təsdiqləyir.',
  'slider.insight.bull': 'Yüksək qiymətlər struktur keçidi gecikdirir. Neft payının 2045-ci ildən sonra da 20%-dən yuxarı qalması gözlənilir — yüksək gəlirlər diversifikasiya təciliyyətini azaldır.',

  'explorer.postYear': '2045-dən sonra',
  'explorer.chartTitle': 'Neft-Qaz ÜDM Payının Dinamikası',
  'explorer.projection': 'Proqnozu',
  'explorer.policyTarget': '20% — Siyasət Hədəfi',
  'explorer.baseline': '2026 Baza: 30.4%',

  'explainer.triggerLabel': 'ℹ Məlumat',
  'explainer.oilGdpShare.title': 'NEFT-QAZ ÜDM PAYI NƏDİR?',
  'explainer.oilGdpShare.body': 'Bu göstərici Azərbaycanın ümumi iqtisadi istehsalında birbaşa neft və qazın hasilatı və emalı ilə bağlı olan payını ifadə edir. Ümumi iqtisadi fəaliyyətin təxminən üçdə biri (30,4%) karbohidrogen gəlirlərindən asılı olması struktur asılılığı yaradır. Yetkin yataqlarda hasilatın təbii yolla azalması fonunda, "Azərbaycan 2030" strategiyası məhz bu asılılığın azaldılmasını hədəfləyir.',
  'explainer.crossoverYear.title': 'KEÇİD İLİ NECƏ HESABLANIR?',
  'explainer.crossoverYear.body': 'Model 1000 ehtimal yolunu özündə birləşdirən Monte Carlo simulyasiyası vasitəsilə 2026-cı il baza xəttinə əsasən neftin ÜDM-dəki payını proqnozlaşdırır. 2033-cü il, Brent neftinin davamlı olaraq $80/barel qiymətində qaldığı və neft payının 20%-lik strateji hədəf həddindən aşağı düşdüyü median ilini təmsil edir. Bu, 1990–2024-cü illər üzrə Dünya Bankının məlumatlarından alınan tarixi qiymət həssaslığına uyğunlaşdırılmış baza ssenarisidir.',
  'explainer.shockValidation.title': 'RETROSPEKTİV SARSINTILARIN VALİDASİYASI',
  'explainer.shockValidation.body': 'PELT dəyişiklik nöqtəsinin (changepoint) aşkarlanması alqoritmi 35 ili əhatə edən altı makroiqtisadi seriyaya tətbiq edilmişdir. Sistemə tarixi məlumatlar verilməməsinə baxmayaraq, model dörd böyük struktur şokunu (1994 post-sovet sabitləşməsi, 2008 qlobal maliyyə böhranı, 2015 manat devalvasiyası və 2020 pandemiya böhranı) ±2 il aralığında tam dəqiqliklə müəyyən etmişdir.  Bu retrospektiv dəqiqlik seçilmiş metodologiyanın etibarlılığını təsdiq edir.',
  'explainer.readingChart.title': 'QRAFİKİN İZAHLI OXUNUŞU',
  'explainer.readingChart.body': 'Şaquli ox neftin Azərbaycanın ÜDM-dəki payını faizlə, üfüqi ox isə 2025-ci ildən 2050-ci ilə qədər olan dövrü göstərir. Tünd bütöv xətt median ehtimaldır (p50) — modelin 1000 simulyasiyasının yarısı bu xəttin üstündə, yarısı isə altında yerləşir. Qırıq xətlər 80%-lik etibarlılıq intervalını formalaşdıran 10-cu və 90-cı persentilləri təmsil edir. Üfüqi istinad xətti isə BVF-nin fiskal dayanıqlılıq meyarlarından alınan 20%-lik həddi işarələyir — bu, Azərbaycan 2030-un qeyri-neft iqtisadiyyatını inkişafın mərkəzinə çevirmək mandatını rəqəmsal göstəriciyə çevirir.',
  'explainer.modelCalibration.title': 'MODELİN PARAMETRLƏŞDİRİLMƏSİ',
  'explainer.modelCalibration.body': 'Slayder neft qiymətinə həssaslıq əmsalını (0,256) əsas götürərək keçid ilini dinamik hesablayır; Brent neftinin qiymətindəki hər 10% dəyişim neftin ÜDM-dəki payında 2,56% dəyişikliklə nəticələnir. Bu göstərici Dünya Bankının 35 illik statistikası əsasında OLS reqressiyasından alınmışdır. İllik −2,5% olan struktur hasilat azalması SOCAR-ın hasilat dinamikasını ifadə edir və qiymət faktorundan tamamilə müstəqil şəkildə modelləşdirilib.',
  'explainer.whatIsThis': 'BU NƏDİR?',
  'explainer.methodologyNote': 'METODOLOJİ QEYD',

  'footer.text': 'Azərbaycan İqtisadi Analiz Platforması · Məlumat mənbələri: stat.gov.az, Dünya Bankı, ABŞ EİA, Mərkəzi Bank · Azərbaycan Milli Süni İntellekt Strategiyası 2025–2028 çərçəvəsində hazırlanmışdır',
  'loading': 'Yüklənir',

  // Anomaly page
  'anomaly.eyebrow': 'ANOMALİYA AŞKARLAMA',
  'anomaly.title': 'Struktur Dəyişiklik Təhlili, 1990–2024',
  'anomaly.subtitle': 'PELT dəyişiklik nöqtəsi aşkarlaması altı makroiqtisadi sıraya tətbiq edilmişdir. Dörd məlum sarsıntı əvvəlcədən tarix bilinmədən retrospektiv olaraq təsdiqlənmişdir.',
  'anomaly.badge': '4 / 4 Sarsıntı Təsdiqi',
  'anomaly.metric.shocks.label': 'Təsdiqlənmiş Sarsıntılar',
  'anomaly.metric.recentBreak.label': 'Ən Son Dəyişiklik',
  'anomaly.metric.series2004.label': '2004-cü il qırılmasından təsirlənən 5 seriya',
  'anomaly.metric.tolerance.label': 'Identifikasiya aralığı',
  'explainer.anomalyMethod.title': 'ANOMALİYA AŞKARLAMASI NECƏ İŞLƏYİR?',
  'explainer.anomalyMethod.body': 'PELT (Pruned Exact Linear Time) alqoritmi hər bir makroiqtisadi sıranı statistik xüsusiyyətlərin — orta, dispersiya və ya trend — kəskin şəkildə dəyişdiyi nöqtələr üçün skan edir. Alqoritm sarsıntıların nə vaxt baş verdiyini əvvəlcədən bilmir. Məlum hadisədən ±2 il ərzində aşkarlanan fasilə təsdiqlənmiş sayılır. 2004-cü ildə 5 sıranı eyni anda əhatə edən fasilə ACG neft yüksəlişini — Azərbaycanın müstəqillik sonrası iqtisadi tarixinin ən əhəmiyyətli struktur hadisəsini — qeyd edir.',
  'anomaly.case.1994.title': 'Sovet İttifaqı Sonrası İqtisadi Böhran',
  'anomaly.case.1994.text': 'Planlı iqtisadiyyatın çökməsi ilə ÜDM 21% daraldı. Struktur qırılması ÜDM artımı və İstehlak Qiymətləri İndeksində (İQİ) eyni vaxtda müşahidə olunur.',
  'anomaly.case.2008.title': 'Qlobal Maliyyə Böhranı',
  'anomaly.case.2008.text': 'Neft qiymətləri altı ay ərzində $145-dan $35/barelə çökdü. ÜDM artımı kəskin şəkildə yavaşladı. Brent seriyası dominant struktur qırılmasını aydın göstərir.',
  'anomaly.case.2015.title': 'Azərbaycan Manatının Devalvasiyası',
  'anomaly.case.2015.text': 'Azərbaycan manatı iki mərhələdə ABŞ dollarına qarşı dəyərinin ~50%-ni itirdi. Brent qiymət seriyası vasitəsilə bir il əvvəl (2014) aşkarlanması, bu metodun aparıcı indikator potensialını sübut edir.',
  'anomaly.case.2020.title': 'COVID-19 Pandemiyası və Neft Şoku',
  'anomaly.case.2020.text': 'Pandemiya şoku və neftin qiymətinin $20/barelə düşməsi eyni anda baş verdi. Brent seriyası struktur dəyişikliyini tam olaraq 2020-ci ildə qeydə alır — bu, modelin ən dəqiq identifikasiyasıdır.',
  'anomaly.chart.title': 'MAKRO-ŞOKS KARDİOQRAMI',

  // Sectors page
  'sectors.title': 'Sektor Atribusiya Təhlili, 1991–2024',
  'sectors.subtitle': 'SHAP dəyərləri ilə XGBoost reqressiya modeli hər il ÜDM artımını sürətləndirən və ya yavaşladan sektorları müəyyən edir.',
  'sectors.metric.topDriver.value': 'Kənd Təsərrüfatı',
  'sectors.metric.topDriver.label': '2014–2021 Əsas Artım Amili',
  'sectors.metric.peakContrib.value': 'İstehlak Xidmətləri',
  'sectors.metric.peakContrib.label': '2005–2008 Pik Töhfəçi',
  'sectors.metric.drag.value': 'Əmək Bazarı',
  'sectors.metric.drag.label': '2010–2019  İqtisadiyyatı Ləngidən Ən Böyük Amil',
  'sectors.metric.count.label': 'Modelləşdirilmiş Sektor',
  'explainer.shap.title': 'SHAP DƏYƏRLƏRİ NƏDİR?',
  'explainer.shap.body': 'SHAP dəyərləri hər sektorun ÜDM artımı proqnozuna marjinal töhfəsini ölçür. Müsbət SHAP dəyəri sektorun artımı baza xəttindən yuxarı itələdiyini bildirir; mənfi isə onu yavaşlatdığını. Dəyərlər additiv xarakter daşıyır — həmin ilin ümumi proqnozlaşdırılmış artım sürətinə cəmlənir.',
  'sectors.insight': '{year}-ci ildə {top} əsas artım sürücüsü oldu (+{topVal} faiz bəndi), {bottom} isə ÜDM artımından {bottomVal} faiz bəndi çıxardı.',
  'sectors.table.title': 'Ümumi Sektor Əhəmiyyəti',
  'sectors.table.col.sector': 'Sektor',
  'sectors.table.col.meanShap': 'Orta |SHAP|',
  'sectors.table.col.interpretation': 'Şərh',
  'sectors.waterfall.title': 'SHAP Atribusiyası — {year}',

  // Forecast page
  'forecast.title': 'ÜDM Artım Proqnozu, 1991–2024',
  'forecast.subtitle': 'LSTM dərin öyrənmə modeli ARIMA ekonometrik baza modeli ilə müqayisədə. 28 rüb üzrə nümunə testi.',
  'forecast.metric.arimaMape.label': 'ARIMA Test MAPE',
  'forecast.metric.lstmMape.label': 'LSTM Test MAPE',
  'forecast.metric.testQuarters.label': 'Test Rübləri',
  'forecast.metric.totalObs.label': 'Ümumi Müşahidə',
  'forecast.banner': 'Cari verilənlər bazasında ARIMA modeli LSTM-i üstələyir. Bu, gözlənilən nəticədir: rüblük sıralar Dünya Bankının 35 illik göstəricilərinin kubik splayn interpolyasiyası ilə hesablandığı üçün xətti modellərə üstünlük verən hamar bir trend əmələ gətirir. LSTM-in real üstünlüyü Mərkəzi Bankın (AMB) aylıq hesabatları (43 bülleten) təlim məlumatlarına əlavə edildikdən sonra üzə çıxacaq.',
  'forecast.toggle.full': 'Tam Tarix',
  'forecast.toggle.test': 'Yalnız Test Dövrü',
  'explainer.arimaWins.title': 'NIYƏ ARIMA BURADA QALIB GƏLİR?',
  'explainer.arimaWins.body': 'ARIMA hamar, trend izləyən sıralarda üstündür — interpolyasiya edilmiş rüblük ÜDM indeksi məhz belədir. LSTM şəbəkələri xətti modellərin öyrənə bilmədiyi nümunələri aşkar etmək üçün kifayət qədər qeyri-xətti dəyişkənlik tələb edir. İllik məlumatların kub spline ilə rüblüyə çevrilməsində belə dəyişkənlik yoxdur. Bu metodoloji cəhətdən dürüst nəticədir, uğursuzluq deyil.',
  'forecast.legend.actual': 'Faktiki',
  'forecast.callout.arima': 'Sınaq dövrü üzrə MAPE. Hamar interpolyasiya edilmiş məlumatlarda ARIMA qalib gəlir — xətti avtokorrelyasiya üstünlük təşkil edir.',
  'forecast.callout.lstm': 'Sınaq dövrü üzrə MAPE. Kubik splayn məlumatları üçün gözləniləndir; LSTM-in üstünlüyü AMB-nin aylıq məlumatları ilə üzə çıxacaq.',
  'sectors.callout.topDriver': 'Əsas Artım Amili',
  'sectors.callout.topDrag': 'İqtisadiyyatı Ləngidən Ən Böyük Amil',
  'sectors.callout.dominantSector': 'Tarixi Lider Sektor',
  'sectors.callout.years': 'il lider sektoru',
  'sectors.tab.oilBoom': 'Neft Gəlirlərinin Artımı 2005–2008',
  'sectors.tab.postCrisis': 'Böhran Sonrası Dövr 2014–2020',
  'sectors.scrubber.hint': 'İli seçmək üçün sürüşdürün',
  'sectors.table.subtitle': '1991–2024-cü illər üzrə orta mütləq SHAP dəyəri',
  'sectors.story.services.title': 'XİDMƏTLƏR SEKTORUNUN PİKİ',
  'sectors.story.services.text': '2006-cı il neft bumunu ərzində xidmətlər sektoru ən yüksək töhfəni göstərdi — sürətli gəlir artımı daxili tələbi güclü şəkildə stimullaşdırdı.',
  'sectors.story.agriculture.title': 'KƏND TƏSƏRRÜFATININ DOMINANT DÖVRÜ',
  'sectors.story.agriculture.text': 'Kənd təsərrüfatı ardıcıl 11 il ərzində əsas artım sürücüsü olaraq qeyri-neft sabitliyini möhkəmləndirdi.',
  'sectors.story.labor.title': 'ƏMƏK BAZARININ ƏN AŞAĞI GÖSTƏRİCİSİ',
  'sectors.story.labor.text': 'Əmək bazarında pik geriləmə (2016) — devalvasiyadan sonrakı uyğunlaşma dövründə struktur işsizlik ÜDM artımını yavaşlatdı.',
  'sectors.pp': 'f.b.',
  'sectors.ppNote': 'f.b. = faiz bəndi. +1 f.b. SHAP dəyəri, müvafiq sektorun həmin il ÜDM artımına modelin baza xəttindən əlavə 1 faiz bəndi töhfə verdiyini bildirir.',
  'home.finding.headline': 'PLATFORMANIN ƏSAS KƏŞFİ',
  'home.finding.pullquote': 'Davamlı olaraq barrel başına 80 ABŞ dolları sabit neft qiyməti fonunda 2033-cü ilə qədər Azərbaycanın ÜDM-də neftin payı hədəflənən 20%-lik limitdən aşağı həddə enəcəyi gözlənilir. Buna səbəb neft yataqlarının illik −2.5% həcmində struktur aşınması (tükənməsi) və qeyri-neft sektorundakı 4.5%-lik artımdır.',
  'home.finding.stat1.label': 'Baza ssenarisində hədəf xəttinin keçilməsi',
  'home.finding.stat2.label': 'Model ehtimalı (1.000 yol)',
  'home.finding.stat3.label': 'Struktur istehsal azalması',
  'forecast.chart.title': 'Rüblük ÜDM İndeksi',
  'explainer.arima.body': "ARIMA (Avtoreqressiv İnteqrə Olunmuş Hərəkətli Ortalama) zaman sıralarının proqnozlaşdırılması üçün istifadə olunan, xətti asılılıqları və tarixi trendləri müəyyən edən standart ekonometrik baza modelidir. Bu model, məlumatlar sabit və hamar (smooth) xarakter daşıdıqda ən yüksək dəqiqliyi təmin edir. Cari verilənlər bazasında — Dünya Bankının 35 illik göstəricilərinin kubik splayn interpolyasiyasından alınan rüblük ÜDM — ARIMA 0,15% MAPE göstəricisi ilə LSTM-i üstələyir, çünki hamar interpolyasiya edilmiş sıra xətti avtoreqressiv struktura üstünlük verir.",
  'explainer.lstm.body': "LSTM (Uzun Qısamüddətli Yaddaş) zaman sıralarındakı mürəkkəb, qeyri-xətti qanunauyğunluqları və uzunmüddətli asılılıqları öyrənməyə qadir olan dərin öyrənmə (deep learning) modelidir. Xətti modellərin qavraya bilmədiyi, qəfil sarsıntılar və dəyişkənliklər ehtiva edən datalarda tətbiq olunur. Hamar interpolyasiya edilmiş məlumatlarda LSTM 5,38% MAPE göstəricisi əldə edir. Onun üstünlüyü Mərkəzi Bankın 43 aylıq bülleteni (2022–2026) təlim məlumatlarına əlavə edildikdən sonra, interpolyasiya edilmiş rüblük təxminini real aylıq müşahidələrlə əvəz etdikdə üzə çıxacaq.",
}

export const dict: Record<Lang, Translations> = { en, az }

export function t(lang: Lang, key: TranslationKey): string {
  return dict[lang][key]
}
