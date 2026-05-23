"""
World Bank API fetcher for Azerbaijan macroeconomic indicators.
Validation layer only — annual frequency, not LSTM training data.
"""

import logging
import time
from pathlib import Path
from typing import Optional

import pandas as pd
import requests

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

BASE_URL = "https://api.worldbank.org/v2/country/AZ/indicator"

INDICATORS = {
    "NY.GDP.MKTP.KD.ZG": "gdp_growth_pct",
    "NY.GDP.PCAP.CD":     "gdp_per_capita_usd",
    "FP.CPI.TOTL.ZG":    "cpi_inflation_pct",
    "NE.TRD.GNFS.ZS":    "trade_pct_gdp",
    "NV.IND.TOTL.ZS":    "industry_va_pct_gdp",
    "NV.SRV.TOTL.ZS":    "services_va_pct_gdp",
    "NV.AGR.TOTL.ZS":    "agriculture_va_pct_gdp",
    "NE.GDI.TOTL.ZS":    "gross_capital_formation_pct",
    "SL.UEM.TOTL.ZS":    "unemployment_rate",
}

OUTPUT_DIR = Path("data/raw/worldbank")


def fetch_indicator(
    indicator_code: str,
    start_year: int = 1990,
    end_year: int = 2024,
    retries: int = 3,
) -> Optional[pd.DataFrame]:
    url = f"{BASE_URL}/{indicator_code}"
    params = {
        "format": "json",
        "date": f"{start_year}:{end_year}",
        "per_page": 100,
    }

    for attempt in range(1, retries + 1):
        try:
            logger.info(f"Fetching {indicator_code} (attempt {attempt})")
            resp = requests.get(url, params=params, timeout=30)
            resp.raise_for_status()
            payload = resp.json()

            if not isinstance(payload, list) or len(payload) < 2:
                logger.error(f"Unexpected response structure for {indicator_code}")
                return None

            records = payload[1]
            if not records:
                logger.warning(f"No data returned for {indicator_code}")
                return None

            df = pd.DataFrame([
                {
                    "year": int(r["date"]),
                    "value": r["value"],
                }
                for r in records
                if r.get("value") is not None
            ])

            df = df.sort_values("year").reset_index(drop=True)
            logger.info(f"  -> {len(df)} observations ({df.year.min()}-{df.year.max()})")
            return df

        except requests.RequestException as e:
            logger.warning(f"Request failed: {e}")
            if attempt < retries:
                time.sleep(2 ** attempt)
            else:
                logger.error(f"All retries exhausted for {indicator_code}")
                return None


def fetch_all(start_year: int = 1990, end_year: int = 2024) -> pd.DataFrame:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    frames = {}

    for code, name in INDICATORS.items():
        df = fetch_indicator(code, start_year, end_year)
        if df is not None:
            df = df.rename(columns={"value": name})
            df.to_csv(OUTPUT_DIR / f"{name}.csv", index=False)
            frames[name] = df.set_index("year")[name]
        time.sleep(0.5)  # polite to the API

    if not frames:
        raise RuntimeError("Zero indicators fetched. Check connectivity.")

    merged = pd.DataFrame(frames).rename_axis("year").reset_index()
    out_path = OUTPUT_DIR / "azerbaijan_worldbank_annual.csv"
    merged.to_csv(out_path, index=False)
    logger.info(f"Merged dataset saved -> {out_path} | shape: {merged.shape}")
    return merged


if __name__ == "__main__":
    df = fetch_all()
    print(df.tail())