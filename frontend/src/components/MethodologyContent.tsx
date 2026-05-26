'use client'

import { useLanguage } from '@/context/LanguageContext'
import SpecPanel from '@/components/SpecPanel'
import FAQAccordion from '@/components/FAQAccordion'

function SectionLabel({ en, az }: { en: string; az: string }) {
  const { lang } = useLanguage()
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-widest text-[#6B6B6B]">
        {lang === 'az' ? az : en}
      </p>
      <div className="mt-3 border-b border-[#E5E5E5]" />
    </div>
  )
}

type SpecRow = { label: string; value: string }

function SpecTable({ rows }: { rows: SpecRow[] }) {
  return (
    <table className="w-full text-sm border-collapse">
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-[#F0F0F0]">
            <td className="py-2 pr-6 text-[#6B6B6B] w-48 align-top">{row.label}</td>
            <td className="py-2 text-[#1A1A1A] font-mono text-xs align-top">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function MethodologyContent() {
  const { lang } = useLanguage()
  const az = lang === 'az'

  return (
    <main className="max-w-[1200px] mx-auto px-6 py-16">

      {/* Page Header */}
      <div className="flex items-start justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-[#6B6B6B] mb-3">
            {az ? 'METODOLOGİYA VƏ TEXNİKİ SPESİFİKASİYA' : 'METHODOLOGY & TECHNICAL SPECIFICATION'}
          </p>
          <h1 className="text-4xl font-bold text-[#1A1A1A] tracking-tight mb-4">
            {az ? 'Bu Platforma Necə İşləyir' : 'How This Platform Works'}
          </h1>
          <p className="text-base text-[#6B6B6B] leading-relaxed">
            {az
              ? 'Machine Learning xəttinin (pipeline), məlumat mənbələrinin, model spesifikasiyalarının və layihənin "Azərbaycanın Milli Süni İntellekt Strategiyası 2025–2028" ilə uyğunluğunun tam texniki təsviri.'
              : "Full technical documentation of the machine learning pipeline, data sources, model specifications, and alignment with Azerbaijan's National AI Strategy 2025–2028."}
          </p>
        </div>
        <div className="shrink-0">
          <span className="inline-block bg-[#1A1A1A] text-white text-xs font-medium px-3 py-1.5 rounded-full tracking-wide whitespace-nowrap">
            National AI Strategy 2025–2028
          </span>
        </div>
      </div>

      {/* Section 1 — Data Sources */}
      <section className="mb-16">
        <SectionLabel en="01 — DATA SOURCES" az="01 — MƏLUMAT MƏNBƏLƏRİ" />
        <div className="grid grid-cols-2 gap-4">

          {/* Card 1 */}
          <div className="border border-[#E5E5E5] bg-white p-6">
            <span className="inline-block bg-[#1A1A1A] text-white text-[10px] uppercase tracking-widest px-2 py-0.5 mb-3">
              {az ? 'ƏSAS TƏLİM MƏLUMATI' : 'PRIMARY TRAINING DATA'}
            </span>
            <p className="text-base font-semibold text-[#1A1A1A]">{az ? 'Dövlət Statistika Komitəsi' : 'State Statistics Committee'}</p>
            <p className="text-xs font-mono text-[#6B6B6B] mt-1">stat.gov.az</p>
            <p className="text-sm text-[#6B6B6B] mt-3 leading-relaxed">
              {az
                ? 'ÜDM (neft/qeyri-neft bölgüsü), sənaye istehsalı, pərakəndə ticarət dövriyyəsi, büdcə gəlirləri və strateji valyuta ehtiyatlarını əhatə edən aylıq makroiqtisadi bülletenlər. 2025-ci ilin yanvarından 2026-cı ilin aprelinə qədər HTTP vasitəsilə toplanmış 10 tarixi "snapshot" (kəsik).'
                : 'Monthly macroeconomic bulletins covering GDP (oil/non-oil split), industrial output, retail trade turnover, budget revenues, and strategic foreign reserves. 10 historical snapshots scraped via HTTP, January 2025 – April 2026.'}
            </p>
            <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex gap-6">
              <span className="text-xs font-mono text-[#6B6B6B]">{az ? '10 snapshot' : '10 snapshots'}</span>
              <span className="text-xs font-mono text-[#6B6B6B]">{az ? '18 indikator' : '18 indicators'}</span>
              <span className="text-xs font-mono text-[#6B6B6B]">{az ? 'HTML cədvəlləri' : 'HTML tables'}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="border border-[#E5E5E5] bg-white p-6">
            <span className="inline-block border border-[#1A1A1A] text-[#1A1A1A] text-[10px] uppercase tracking-widest px-2 py-0.5 mb-3">
              {az ? 'DOĞRULAMA TƏBƏQƏSİ' : 'VALIDATION LAYER'}
            </span>
            <p className="text-base font-semibold text-[#1A1A1A]">{az ? 'Dünya Bankı Açıq Məlumat API-ı' : 'World Bank Open Data API'}</p>
            <p className="text-xs font-mono text-[#6B6B6B] mt-1">api.worldbank.org/v2/country/AZ</p>
            <p className="text-sm text-[#6B6B6B] mt-3 leading-relaxed">
              {az
                ? '1990–2024-cü illəri əhatə edən 9 makroiqtisadi indikator. Uzunmüddətli trayektoriyanın bütövlüyünü təsdiqləyən validasiya qatı və Cubic Spline interpolyasiyası vasitəsilə rüblük panelin qurulması üçün mənbə kimi istifadə olunur. API tələb olunmur.'
                : '9 annual macroeconomic indicators spanning 1990–2024. Used as the validation layer confirming long-run trajectory integrity, and as the source for quarterly panel construction via cubic spline interpolation. No API key required.'}
            </p>
            <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex gap-6">
              <span className="text-xs font-mono text-[#6B6B6B]">{az ? '35 illik müşahidə' : '35 annual obs'}</span>
              <span className="text-xs font-mono text-[#6B6B6B]">{az ? '9 indikator' : '9 indicators'}</span>
              <span className="text-xs font-mono text-[#6B6B6B]">REST JSON API</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="border border-[#E5E5E5] bg-white p-6">
            <span className="inline-block border border-[#E5E5E5] text-[#6B6B6B] text-[10px] uppercase tracking-widest px-2 py-0.5 mb-3">
              {az ? 'SSENARI DAXİLOLMALARI' : 'SCENARIO INPUTS'}
            </span>
            <p className="text-base font-semibold text-[#1A1A1A]">{az ? 'ABŞ Enerji İnformasiya Administrasiyası' : 'U.S. Energy Information Admin.'}</p>
            <p className="text-xs font-mono text-[#6B6B6B] mt-1">api.eia.gov/v2/petroleum</p>
            <p className="text-sm text-[#6B6B6B] mt-3 leading-relaxed">
              {az
                ? '1987-ci ildən bu günə qədər aylıq Brent nefti spot qiymətləri — 450+ müşahidə. Divergensiya simulyasiyasında əsas hərəkətverici qüvvədir. $60, $80 və $100/barel qiymətlərində qurulmuş üç gələcək ssenari.'
                : 'Monthly Brent crude spot prices from 1987 to present — 450+ observations. The primary exogenous driver in the divergence simulation. Three forward scenarios constructed at $60, $80, and $100/barrel.'}
            </p>
            <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex gap-6">
              <span className="text-xs font-mono text-[#6B6B6B]">{az ? '450+ aylıq müşahidə' : '450+ monthly obs'}</span>
              <span className="text-xs font-mono text-[#6B6B6B]">1987–2026</span>
              <span className="text-xs font-mono text-[#6B6B6B]">CSV + API</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="border border-[#E5E5E5] bg-[#F8F8F6] p-6">
            <span className="inline-block border border-[#E5E5E5] bg-[#F8F8F6] text-[#6B6B6B] text-[10px] uppercase tracking-widest px-2 py-0.5 mb-3">
              {az ? 'NÖVBƏTİ MƏRHƏLƏ' : 'NEXT PHASE'}
            </span>
            <p className="text-base font-semibold text-[#1A1A1A]">{az ? 'Azərbaycan Mərkəzi Bankı' : 'Central Bank of Azerbaijan'}</p>
            <p className="text-xs font-mono text-[#6B6B6B] mt-1">cbar.az/page-40/statistical-bulletin</p>
            <p className="text-sm text-[#6B6B6B] mt-3 leading-relaxed">
              {az
                ? '2022–2026-cı illəri əhatə edən, yüklənmiş və lokal olaraq keşlənmiş 43 aylıq XLSX bülleteni. USD/AZN məzənnələrini, pul bazasını, bank kreditlərinin həcmini və depozitləri özündə cəmləşdirir. Pipeline qurulub və hazırdır — LSTM təlim məlumatları kimi inteqrasiyası növbəti inkişaf mərhələsidir.'
                : '43 monthly XLSX bulletins downloaded and cached locally, covering 2022–2026. Contains USD/AZN exchange rates, monetary base, bank credit volumes, and deposits. Pipeline built and ready — integration as LSTM training data is the next development phase.'}
            </p>
            <div className="mt-4 pt-3 border-t border-[#E5E5E5] flex gap-6">
              <span className="text-xs font-mono text-[#6B6B6B]">{az ? '43 bülleten' : '43 bulletins'}</span>
              <span className="text-xs font-mono text-[#6B6B6B]">2022–2026</span>
              <span className="text-xs font-mono text-[#6B6B6B]">XLSX</span>
            </div>
          </div>

        </div>
      </section>

      {/* Section 2 — ML Models */}
      <section className="mb-16">
        <SectionLabel en="02 — MACHINE LEARNING ARCHITECTURE" az="02 — MACHINE LEARNING ARXİTEKTURASI" />

        <div className="space-y-2">
          <SpecPanel
            label="MODEL A — Quarterly GDP Forecaster · ARIMA 0.15% MAPE"
            labelAz="MODEL A — Rüblük ÜDM Proqnozlaşdırıcısı · ARIMA 0.15% MAPE"
          >
            <SpecTable rows={[
              { label: 'Architecture', value: '2-layer stacked LSTM (32→16 units) + Dropout(0.2) + Dense(1)' },
              { label: 'Input window', value: '4 quarters (1-year lookback)' },
              { label: 'Training obs', value: '108 quarters — 80/20 split' },
              { label: 'Test set', value: '28 quarters (2017Q1–2024Q4)' },
              { label: 'Features', value: 'GDP index, Brent, industry share, services share, investment share' },
              { label: 'Scaler', value: 'StandardScaler — fit on train only, no data leakage' },
              { label: 'Baseline', value: 'ARIMA(2,1,0) — rolling one-step forecast' },
              { label: 'LSTM MAPE', value: '5.38% (test set)' },
              { label: 'ARIMA MAPE', value: '0.15% (test set)' },
              { label: 'Result', value: 'ARIMA wins on interpolated data — expected, documented transparently' },
              { label: 'Next phase', value: 'CBAR monthly series (43 bulletins) as training data' },
            ]} />
          </SpecPanel>

          <SpecPanel
            label="MODEL B — Oil/Non-Oil Divergence Simulator · 1,000 Monte Carlo paths"
            labelAz="MODEL B — Neft/Qeyri-Neft Ayrışma Simulyatoru · 1,000 Monte Karlo yolu"
          >
            <SpecTable rows={[
              { label: 'Method', value: 'Monte Carlo simulation, 1,000 stochastic paths' },
              { label: 'Oil model', value: 'Base share × (1 + elasticity × ΔBrent) × structural decline' },
              { label: 'Structural decline', value: '−2.5%/year (SOCAR post-peak depletion)' },
              { label: 'Calibrated elasticity', value: '0.256 — OLS regression on 35yr World Bank data' },
              { label: 'Non-oil drift', value: '4.5%/year mean, 2.5% std (Azerbaijan 2030 trajectory)' },
              { label: 'Horizon', value: '25 years quarterly (2025–2050, 100 steps)' },
              { label: 'Confidence bands', value: 'p10, p50, p90 percentiles across all paths' },
              { label: 'Baseline (2026)', value: 'Oil: 30.4% · Non-oil: 69.6%' },
              { label: 'Bear ($60/bbl)', value: 'Oil < 20% by 2029 — 100% probability' },
              { label: 'Base ($80/bbl)', value: 'Oil < 20% by 2033 — 100% probability' },
              { label: 'Bull ($100/bbl)', value: 'Oil < 20% beyond 2045 — <1% probability' },
            ]} />
          </SpecPanel>

          <SpecPanel
            label="MODEL C — Structural Break Detection · 4/4 shocks validated"
            labelAz="MODEL C — Struktur Fasilə Aşkarlaması · 4/4 sarsıntı təsdiqləndi"
          >
            <SpecTable rows={[
              { label: 'Library', value: 'ruptures (Python) — PELT algorithm' },
              { label: 'Cost function', value: 'RBF (Radial Basis Function)' },
              { label: 'Penalty', value: 'Auto-tuned: 1→2→3→5→8→15, accept 2–8 breaks' },
              { label: 'Series analyzed', value: '6 (GDP growth, CPI, industry, oil share, non-oil share, Brent)' },
              { label: 'Total breaks', value: '24 detected across all series' },
              { label: 'Validation set', value: '4 known shocks: 1994, 2008, 2015, 2020' },
              { label: 'Tolerance', value: '±2 years from known event date' },
              { label: 'Validation result', value: '4/4 (100%) — all shocks detected' },
              { label: 'Notable', value: '2004: 5 simultaneous series breaks — ACG oil boom onset' },
            ]} />
          </SpecPanel>

          <SpecPanel
            label="MODEL D — Sector Attribution · 7 sectors · 34 years"
            labelAz="MODEL D — Sektor Atribusiyası · 7 sektor · 34 il"
          >
            <SpecTable rows={[
              { label: 'Library', value: 'xgboost + shap (Python)' },
              { label: 'Model', value: 'XGBoostRegressor' },
              { label: 'Hyperparameters', value: 'n_estimators=200, max_depth=3, lr=0.05, subsample=0.8' },
              { label: 'Regularization', value: 'L1=0.1, L2=1.0' },
              { label: 'Target', value: 'Annual GDP growth rate (%)' },
              { label: 'Features', value: 'Agriculture, Services, Industry, Investment, Trade, Labor Market, Oil Price' },
              { label: 'Training samples', value: '34 year-observations (1991–2024)' },
              { label: 'Cross-validation', value: '5-fold CV, MAE reported' },
              { label: 'SHAP explainer', value: 'TreeExplainer (exact values, not approximate)' },
              { label: 'Output', value: 'Per-year per-sector marginal contribution (percentage points)' },
            ]} />
          </SpecPanel>
        </div>
      </section>

      {/* Section 3 — National AI Strategy */}
      <section className="mb-16">
        <SectionLabel en="03 — NATIONAL AI STRATEGY 2025–2028" az="03 — MİLLİ SÜNİ İNTELLEKT STRATEGİYASI 2025–2028" />
        <div className="bg-[#F8F8F6] border border-[#E5E5E5] p-10">
          <p className="text-xs uppercase tracking-widest text-[#6B6B6B] mb-1">
            {az
              ? 'Bu platforma Prezident Fərmanı (19 mart 2025) ilə təsdiq edilmiş dörd strateji prioriteti birbaşa həyata keçirir.'
              : 'Presidential Decree, 19 March 2025. This platform directly implements four strategic priorities.'}
          </p>
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 mt-2">
            {az ? 'Birbaşa Həyata Keçirilən Dörd Strateji Prioritet' : 'Four Strategic Priorities Directly Implemented'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                num: '01',
                titleEn: 'DATA INFRASTRUCTURE (Priority 6.1.2)',
                titleAz: 'MƏLUMAT İNFRASTRUKTURU (Prioritet 6.1.2)',
                en: "Section 6.1.2 mandates development of national computing infrastructure and open state datasets for AI applications. This platform operationalizes that mandate: all model inputs are sourced exclusively from official state registries (stat.gov.az, World Bank Open Data), processed through a reproducible ML pipeline, and served via open API endpoints.",
                az: "6.1.2-ci bənd süni intellekt tətbiqləri üçün milli hesablama infrastrukturunun və açıq dövlət məlumat toplusunun inkişafını nəzərdə tutur. Bu platforma həmin mandatı bilavasitə reallaşdırır: bütün model giriş məlumatlarını (inputları) yalnız rəsmi dövlət reyestrlərindən (stat.gov.az, Dünya Bankı Açıq Məlumatları) alır, təkrarlana bilən ML arxitekturası vasitəsilə emal edir və açıq API vasitəsilə təqdim edir.",
              },
              {
                num: '02',
                titleEn: 'AI IN PRIORITY SECTORS (Priority 6.1.4 / Action Plan 8.4.1)',
                titleAz: 'PRİORİTET SEKTORLARDA SÜNİ İNTELLEKT (Prioritet 6.1.4 / Fəaliyyət Planı 8.4.1)',
                en: "Action Plan Section 8.4.1 specifies pilot AI projects in priority economic sectors. This platform delivers that directly: XGBoost + SHAP attribution models identify which sectors — agriculture, services, trade, industry — are driving or suppressing GDP growth each year, providing decision-relevant intelligence for sector-level economic policy.",
                az: "Fəaliyyət Planının 8.4.1-ci bəndi prioritet iqtisadi sektorlarda süni intellekt pilot layihələrinin icrasını tələb edir. Bu platforma həmin hədəfi birbaşa yerinə yetirir: XGBoost + SHAP atributsiya modelləri hər il ÜDM artımını hansı sektorların (kənd təsərrüfatı, xidmətlər, ticarət, sənaye) stimullaşdırdığını və ya ləngitdiyini müəyyən edərək, iqtisadi siyasət qərarlarının qəbulu üçün əsaslı analitik baza təqdim edir.",
              },
              {
                num: '03',
                titleEn: 'RESEARCH & INNOVATION (Priority 6.1.3)',
                titleAz: 'TƏDQİQAT VƏ İNNOVASİYA (Prioritet 6.1.3)',
                en: "Section 6.1.3 targets development of local AI research capacity: 500 AI engineers by 2027, AI Academy establishment, and applied research output tied to national data. This platform is a prototype of that applied research output — reproducible, documented, and built entirely on Azerbaijani economic data rather than imported benchmarks.",
                az: "6.1.3-cü bənd yerli süni intellekt tədqiqat potensialının inkişafını hədəfləyir: 2027-ci ilə qədər 500 süni intellekt mühəndisinin yetişdirilməsi, Süni İntellekt Akademiyasının yaradılması və milli məlumatlara əsaslanan tətbiqi tədqiqatlar. Bu platforma məhz belə tətbiqi tədqiqatların prototipidir — xarici şablonlara deyil, tamamilə Azərbaycanın makroiqtisadi statistikasına əsaslanaraq qurulmuş, şəffaf və təkrarlana bilən sistemdir.",
              },
              {
                num: '04',
                titleEn: 'AZERBAIJAN 2030',
                titleAz: 'AZƏRBAYCAN 2030',
                en: "Presidential Decree No. 2469 (2 February 2021) mandates making the non-oil economy the center of development. The divergence model directly tracks this mandate: every projection is expressed against IMF fiscal sustainability thresholds (20%, 15%, 10%) to operationalize when oil dependency reaches structurally critical levels under each price scenario.",
                az: "2469 nömrəli Prezident Sərəncamı (2 fevral 2021-ci il) qeyri-neft iqtisadiyyatını inkişafın mərkəzinə çevirməyi prioritet elan edir. Divergensiya (struktur keçid) modeli bu mandatı birbaşa izləyir: hər bir proqnoz BVF-nin fiskal dayanıqlılıq hədlərinə (20%, 15%, 10%) istinadən ifadə edilir. Məqsəd, müxtəlif qiymət ssenariləri altında neftdən asılılığın struktur baxımından kritik səviyyəyə çatdığı anı kəmiyyətcə ölçmək və proqnozlaşdırmaqdır.",
              }
            ].map((card) => (
              <div key={card.num} className="relative bg-white border border-[#E5E5E5] p-6 overflow-hidden">
                <span className="absolute top-3 right-4 text-5xl font-thin text-[#E5E5E5] select-none leading-none">
                  {card.num}
                </span>
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] mb-2">
                  {az ? card.titleAz : card.titleEn}
                </p>
                <p className="text-sm text-[#6B6B6B] leading-relaxed relative z-10">
                  {az ? card.az : card.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Technical Stack */}
      <section className="mb-16">
        <SectionLabel en="04 — TECHNICAL STACK" az="04 — TEXNİKİ YIĞIM" />
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] mb-4">
              {az ? 'Backend və ML Boru Kəməri' : 'Backend & ML Pipeline'}
            </p>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Python 3.11', ''],
                  ['TensorFlow 2.x', 'LSTM modeling'],
                  ['XGBoost', 'Gradient boosted regression'],
                  ['SHAP', 'Model explainability'],
                  ['ruptures', 'PELT changepoint detection'],
                  ['FastAPI', 'REST API layer'],
                  ['pandas / numpy', 'Data pipeline'],
                  ['scipy', 'Cubic spline interpolation'],
                  ['requests / BeautifulSoup', 'Scraping'],
                  ['Fly.io', 'Deployment'],
                ].map(([pkg, role], i) => (
                  <tr key={i} className={`border-b border-[#F0F0F0] ${i % 2 === 1 ? 'bg-[#F8F8F6]' : ''}`}>
                    <td className="py-2 px-3 font-mono text-xs text-[#1A1A1A]">{pkg}</td>
                    <td className="py-2 px-3 text-xs text-[#6B6B6B]">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1A1A1A] mb-4">
              Frontend
            </p>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Next.js 16', 'App Router, Server Components'],
                  ['TypeScript', 'Strict mode'],
                  ['Tailwind CSS v4', 'Utility styling'],
                  ['Recharts', 'All data visualization'],
                  ['Vercel', 'Deployment'],
                ].map(([pkg, role], i) => (
                  <tr key={i} className={`border-b border-[#F0F0F0] ${i % 2 === 1 ? 'bg-[#F8F8F6]' : ''}`}>
                    <td className="py-2 px-3 font-mono text-xs text-[#1A1A1A]">{pkg}</td>
                    <td className="py-2 px-3 text-xs text-[#6B6B6B]">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 5 — FAQ */}
      <section className="mb-16">
        <SectionLabel en="05 — FREQUENTLY ASKED QUESTIONS" az="05 — TEZ-TEZ VERİLƏN SUALLAR" />
        <FAQAccordion />
      </section>

    </main>
  )
}
