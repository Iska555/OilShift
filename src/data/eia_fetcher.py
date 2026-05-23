"""
EIA Brent crude oil price fetcher — monthly, 1987-present.
Used to construct $60/$80/$100 forward oil price scenarios.
"""

import logging
from io import StringIO
from pathlib import Path

import pandas as pd
import requests

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

# EIA open data API v2 — no key required for this series
EIA_URL = (
    "https://api.eia.gov/v2/petroleum/pri/spt/data/"
    "?api_key=DEMO_KEY"
    "&frequency=monthly"
    "&data[0]=value"
    "&facets[series][]=RBRTE"
    "&sort[0][column]=period"
    "&sort[0][direction]=asc"
    "&offset=0"
    "&length=5000"
)
EIA_CSV_URL = (
    "https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx"
    "?n=PET&s=RBRTE&f=M"
)

OUTPUT_DIR = Path("data/raw/eia")
OUTPUT_FILE = OUTPUT_DIR / "brent_crude_monthly.csv"


def fetch_via_api() -> pd.DataFrame:
    logger.info("Attempting EIA API v2...")
    resp = requests.get(EIA_URL, timeout=30)
    resp.raise_for_status()
    payload = resp.json()

    records = payload.get("response", {}).get("data", [])
    if not records:
        raise ValueError("EIA API returned no records")

    df = pd.DataFrame(records)[["period", "value"]].copy()
    df.columns = ["date", "brent_usd_bbl"]
    df["date"] = pd.to_datetime(df["date"], format="%Y-%m")
    df["brent_usd_bbl"] = pd.to_numeric(df["brent_usd_bbl"], errors="coerce")
    df = df.dropna().sort_values("date").reset_index(drop=True)
    logger.info(f"EIA API: {len(df)} monthly observations")
    return df


def fetch_via_csv() -> pd.DataFrame:
    logger.info("Falling back to EIA CSV download...")
    resp = requests.get(EIA_CSV_URL, timeout=30)
    resp.raise_for_status()

    # EIA CSV has a multi-row header; data starts after "Date" row
    lines = resp.text.splitlines()
    start = next(
        (i for i, line in enumerate(lines) if line.strip().startswith("Date")),
        None
    )
    if start is None:
        raise ValueError("Could not locate header row in EIA CSV")

    data_str = "\n".join(lines[start:])
    df = pd.read_csv(StringIO(data_str))
    df.columns = ["date", "brent_usd_bbl"]
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df["brent_usd_bbl"] = pd.to_numeric(df["brent_usd_bbl"], errors="coerce")
    df = df.dropna().sort_values("date").reset_index(drop=True)
    logger.info(f"EIA CSV: {len(df)} monthly observations")
    return df


def build_scenarios(df: pd.DataFrame) -> pd.DataFrame:
    """
    Append forward scenario columns to historical series.
    Scenarios run from last observed date + 1 month to 2040-01.
    """
    last_date = df["date"].max()
    future_dates = pd.date_range(
        start=last_date + pd.DateOffset(months=1),
        end="2040-01-01",
        freq="MS"
    )
    scenarios = pd.DataFrame({
        "date": future_dates,
        "brent_usd_bbl": None,
        "scenario_bear_60": 60.0,
        "scenario_base_80": 80.0,
        "scenario_bull_100": 100.0,
    })
    df["scenario_bear_60"] = None
    df["scenario_base_80"] = None
    df["scenario_bull_100"] = None

    combined = pd.concat([df, scenarios], ignore_index=True)
    logger.info(f"Scenarios appended. Total rows: {len(combined)}")
    return combined


def fetch_brent(include_scenarios: bool = True) -> pd.DataFrame:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    try:
        df = fetch_via_api()
    except Exception as e:
        logger.warning(f"API fetch failed ({e}), trying CSV fallback")
        df = fetch_via_csv()

    if include_scenarios:
        df = build_scenarios(df)

    df.to_csv(OUTPUT_FILE, index=False)
    logger.info(f"Saved -> {OUTPUT_FILE} | shape: {df.shape}")
    return df


if __name__ == "__main__":
    df = fetch_brent()
    print(df[df["brent_usd_bbl"].notna()].tail())
    print(df[df["scenario_base_80"].notna()].head())