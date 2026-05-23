'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type FAQItem = {
  qEn: string
  qAz: string
  aEn: string
  aAz: string
}

const FAQS: FAQItem[] = [
  {
    qEn: 'Why does ARIMA outperform LSTM in the forecast?',
    qAz: 'Proqnozda ARIMA niyə LSTM-i üstələyir?',
    aEn: 'The quarterly GDP series is derived from cubic spline interpolation of 35 annual World Bank data points. This produces an artificially smooth curve — ideal for linear models like ARIMA, but too smooth for LSTM to find non-linear patterns. This is documented transparently. When CBAR\'s 43 monthly bulletins replace the interpolated data, LSTM\'s advantage over ARIMA on non-linear oil price shocks will emerge.',
    aAz: 'Rüblük ÜDM sırası 35 illik Dünya Bankı məlumatının kub spline interpolyasiyasından əldə edilir. Bu, xətti ARIMA modeli üçün əlverişli, lakin LSTM-in qeyri-xətti nümunə aşkarlaması üçün həddən artıq hamar əyri yaradır. CBAR-ın 43 aylıq bülleteni əsas məlumat kimi inteqrasiya edildikdə LSTM-in üstünlüyü üzə çıxacaq.',
  },
  {
    qEn: 'How was the oil-Brent elasticity of 0.256 calculated?',
    qAz: '0.256 neft-Brent elastikliyi necə hesablanıb?',
    aEn: 'Using OLS (Ordinary Least Squares) regression on 35 years of World Bank data. Annual changes in Azerbaijan\'s oil GDP share were regressed against annual changes in Brent crude prices (1990–2024). The coefficient of 0.256 means a 10% rise in Brent corresponds to a 2.56% increase in oil\'s GDP share, all else equal. The value was clipped to [0.05, 0.60] for model stability.',
    aAz: '1990–2024-cü illər üzrə Dünya Bankı məlumatlarına əsasən adi ən kiçik kvadratlar (OLS) reqressiyası tətbiq edilmişdir. Azərbaycanın neft ÜDM payındakı illik dəyişikliklər Brent qiymət dəyişikliklərinə reqressiya edilmişdir. 0.256 əmsalı o deməkdir ki, Brent-in 10% artması — digər şərtlər sabit qaldıqda — neft ÜDM payını 2.56% artırır.',
  },
  {
    qEn: 'What does the ±2 year tolerance mean for anomaly validation?',
    qAz: 'Anomaliya doğrulamasında ±2 il tolerantlığı nə deməkdir?',
    aEn: 'Annual data has inherent limitations in pinpointing the exact year of a shock. The ±2 year window reflects that a shock in late 2007 (e.g. oil price peak) may show up in 2008 data, and its macroeconomic consequences may persist into 2009. A break detected anywhere in the window [shock year −2, shock year +2] is counted as validated. This is standard practice in econometric changepoint literature.',
    aAz: 'İllik məlumatların şokun dəqiq ilini müəyyən etməkdə məhdudiyyətləri mövcuddur. 2007-ci ilin sonundakı şok 2008-ci il məlumatlarında əks oluna bilər, makroiqtisadi nəticələr isə 2009-cu ilə qədər davam edə bilər. ±2 il pəncərəsindəki fasilə "təsdiqlənmiş" sayılır — bu, ekonometrik dəyişiklik nöqtəsi ədəbiyyatında standart yanaşmadır.',
  },
  {
    qEn: 'Why is the 2004 break the most significant in the dataset?',
    qAz: '2004-cü il fasiləsi niyə ən əhəmiyyətlidir?',
    aEn: 'In 2004, the ACG (Azeri-Chirag-Gunashli) oil field consortium began full production, triggering a simultaneous structural break across 5 of the 6 series analyzed — GDP growth, CPI, industry share, oil share, and non-oil share all shifted at once. This is the largest concurrent multi-series break in the dataset and represents the most significant structural transformation in Azerbaijan\'s post-independence economic history.',
    aAz: '2004-cü ildə ACG (Azəri-Çıraq-Günəşli) konsorsiumu tam istehsala başladı və 6 sıradan 5-ində — ÜDM artımı, İQİ, sənaye payı, neft payı və qeyri-neft payı — eyni anda struktur fasilə yarandı. Bu, məlumat bazasındakı ən böyük paralel çox-sıralı fasilədir və Azərbaycanın müstəqillik sonrası iqtisadi tarixinin ən mühüm struktur çevrilişini təmsil edir.',
  },
  {
    qEn: "What is the platform's next development phase?",
    qAz: 'Platformanın növbəti inkişaf mərhələsi nədir?',
    aEn: 'Three priorities: (1) integrating CBAR\'s 43 monthly bulletins as LSTM training data to replace cubic spline quarterly approximation; (2) adding IMF World Economic Outlook data for oil revenue fiscal modeling; (3) deploying a live data refresh pipeline that automatically scrapes stat.gov.az when new monthly bulletins are published.',
    aAz: 'Üç prioritet müəyyən edilmişdir: (1) kub spline interpolyasiyasını əvəz etmək üçün CBAR-ın 43 aylıq bülleteni LSTM təlim məlumatı kimi inteqrasiya ediləcək; (2) fiskal modelləşdirmə üçün BMF Dünya İqtisadi Perspektivi məlumatları əlavə olunacaq; (3) stat.gov.az-da yeni bülleten nəşr olunduqda avtomatik yenilənən canlı məlumat boru kəməri yerləşdiriləcək.',
  },
]

export default function FAQAccordion() {
  const { lang } = useLanguage()
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div>
      {FAQS.map((faq, i) => {
        const isOpen = openIdx === i
        return (
          <div key={i} className="border-b border-[#E5E5E5]">
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-sm font-medium text-[#1A1A1A] pr-4">
                {lang === 'az' ? faq.qAz : faq.qEn}
              </span>
              <span
                className="text-[#6B6B6B] text-base shrink-0 select-none"
                style={{
                  display: 'inline-block',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms',
                }}
              >
                +
              </span>
            </button>
            <div
              style={{
                maxHeight: isOpen ? 600 : 0,
                overflow: 'hidden',
                transition: 'max-height 300ms ease',
              }}
            >
              <p className="text-sm text-[#6B6B6B] leading-relaxed pb-4">
                {lang === 'az' ? faq.aAz : faq.aEn}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
