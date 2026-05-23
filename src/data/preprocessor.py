"""
Preprocessor — merges all raw sources into analysis-ready datasets.
Outputs:
  - data/processed/monthly_panel.csv       (LSTM training data)
  - data/processed/quarterly_panel.csv     (LSTM training data — non-oil GDP)
  - data/processed/annual_validation.csv   (World Bank macro sanity layer)
  - data/processed/oil_divergence_base.csv (Divergence model inputs)
"""

import logging
import re
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

RAW_DIR = Path("data/raw")
PROCESSED_DIR = Path("data/processed")


# ---------------------------------------------------------------------------
# Loaders
# ---------------------------------------------------------------------------

def load_worldbank() -> pd.DataFrame:
    path = RAW_DIR / "worldbank" / "azerbaijan_worldbank_annual.csv"
    if not path.exists():
        raise FileNotFoundError(f"Run worldbank_fetcher.py first: {path}")
    df = pd.read_csv(path)
    df["year"] = df["year"].astype(int)
    logger.info(f"World Bank loaded: {df.shape}")
    return df


def load_brent() -> pd.DataFrame:
    path = RAW_DIR / "eia" / "brent_crude_monthly.csv"
    if not path.exists():
        raise FileNotFoundError(f"Run eia_fetcher.py first: {path}")
    df = pd.read_csv(path, parse_dates=["date"])
    logger.info(f"Brent loaded: {df.shape}")
    return df


def load_macroeconomy_snapshots() -> pd.DataFrame:
    path = RAW_DIR / "statgov" / "macroeconomy_snapshots.csv"
    if not path.exists():
        raise FileNotFoundError(f"Execute statgov_scraper.py engine first: {path}")
    df = pd.read_csv(path)
    
    # Force add standard fixed AZN/USD exchange peg column safely for model reference
    df["usd_azn_rate"] = 1.7000
    logger.info(f"Macroeconomy snapshots loaded with structural fx-peg: {df.shape}")
    return df


# ---------------------------------------------------------------------------
# De-cumulation Engine
# ---------------------------------------------------------------------------

def decumulate_series(df: pd.DataFrame, column_name: str) -> pd.Series:
    """
    Transforms Year-To-Date (YTD) cumulative series into pure standalone monthly values.
    Resets operation at the beginning of each calendar year boundary (January node).
    """
    if column_name not in df.columns:
        return pd.Series(index=df.index, dtype=float)
    
    raw_values = df[column_name].values
    months = df["month"].values
    decumulated = np.zeros_like(raw_values, dtype=float)
    
    for i in range(len(raw_values)):
        if months[i] == 1 or i == 0:
            # January contains no previous delta history for the year
            decumulated[i] = raw_values[i]
        else:
            # Standalone value = Current Cumulative Snapshot - Prior Month Cumulative Snapshot
            delta = raw_values[i] - raw_values[i - 1]
            decumulated[i] = max(delta, 0.0)  # Guard against mathematical noise
            
    return pd.Series(decumulated, index=df.index)


# ---------------------------------------------------------------------------
# GDP oil/non-oil decomposition
# ---------------------------------------------------------------------------

def decompose_oil_nonoil(wb: pd.DataFrame, brent: pd.DataFrame) -> pd.DataFrame:
    df = wb.copy()
    df = df.sort_values("year")

    # Oil sector proxy: industry value added (AZ industry is ~85% hydrocarbons)
    df["oil_gdp_share_pct"] = df["industry_va_pct_gdp"]
    df["nonoil_gdp_share_pct"] = (
        df["services_va_pct_gdp"].fillna(0) +
        df["agriculture_va_pct_gdp"].fillna(0)
    )

    # Annual average Brent price
    brent_annual = (
        brent[brent["brent_usd_bbl"].notna()]
        .assign(year=lambda x: x["date"].dt.year)
        .groupby("year")["brent_usd_bbl"]
        .mean()
        .reset_index()
        .rename(columns={"brent_usd_bbl": "brent_annual_avg_usd"})
    )
    df = df.merge(brent_annual, on="year", how="left")

    logger.info(f"Oil/non-oil decomposition: {df.shape}")
    return df


# ---------------------------------------------------------------------------
# Monthly panel builder
# ---------------------------------------------------------------------------

def build_monthly_panel(snapshots: pd.DataFrame, brent: pd.DataFrame) -> pd.DataFrame:
    """
    Constructs a monthly panel using wide scraped data and EIA Brent Crude.
    Executes raw YTD de-cumulation prior to alignment.
    """
    df = snapshots.copy()
    
    # Deconstruct period string index
    df[["year", "month"]] = df["period"].str.split("-", expand=True).astype(int)
    df = df.sort_values("period").reset_index(drop=True)
    
    # Run the de-cumulation logic over every raw absolute indicator
    abs_cols = [col for col in df.columns if col.endswith("_abs")]
    for col in abs_cols:
        clean_name = col.replace("_abs", "_clean")
        df[clean_name] = decumulate_series(df, col)

    # Map Brent timeline into a monthly period tracking matrix
    brent_m = brent[brent["brent_usd_bbl"].notna()][["date", "brent_usd_bbl"]].copy()
    brent_m["period"] = brent_m["date"].dt.to_period("M").astype(str)
    brent_m = brent_m[["period", "brent_usd_bbl"]]

    # Synchronize tracking matrices
    merged = pd.merge(brent_m, df, on="period", how="outer")
    merged = merged.sort_values("period").reset_index(drop=True)
    
    # Secure structural fixed FX parameter
    merged["usd_azn_rate"] = 1.7000

    # Linearly interpolate feature metrics to optimize matrix for LSTM window sizing
    numeric_cols = merged.select_dtypes(include=np.number).columns.tolist()
    merged[numeric_cols] = merged[numeric_cols].interpolate(method="linear").bfill()
    merged = merged.dropna(subset=numeric_cols, how="all")

    logger.info(f"Monthly panel generated: {merged.shape} | {merged['period'].min()} to {merged['period'].max()}")
    return merged


# ---------------------------------------------------------------------------
# Quarterly panel builder (LSTM Model A primary input)
# ---------------------------------------------------------------------------

def build_quarterly_panel(monthly_df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregates the monthly training data into a clean quarterly frequency.
    Ensures that features like real sector clean flows are summed correctly,
    while averages/rates are grouped by mean.
    """
    df = monthly_df.copy()
    df["quarter"] = pd.to_datetime(df["period"] + "-01").dt.to_period("Q").astype(str)
    
    # Separate columns by structural operational requirements
    sum_cols = [c for c in df.columns if "_clean" in c]
    mean_cols = ["brent_usd_bbl", "usd_azn_rate"]
    
    # Process grouping aggregations
    agg_rules = {c: "sum" for c in sum_cols}
    for c in mean_cols:
        if c in df.columns:
            agg_rules[c] = "mean"
            
    q_df = df.groupby("quarter").agg(agg_rules).reset_index().rename(columns={"quarter": "period"})
    logger.info(f"Quarterly panel generated via aggregation: {q_df.shape}")
    return q_df


# ---------------------------------------------------------------------------
# Feature engineering
# ---------------------------------------------------------------------------

def engineer_features(df: pd.DataFrame, freq: str = "M") -> pd.DataFrame:
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    exclude = ["year", "month", "usd_azn_rate"]
    numeric_cols = [c for c in numeric_cols if c not in exclude]

    lags = [1, 2, 3] if freq == "M" else [1, 2]
    window = 3
    new_cols: dict[str, pd.Series] = {}

    for col in numeric_cols:
        for lag in lags:
            new_cols[f"{col}_lag{lag}"] = df[col].shift(lag)
        new_cols[f"{col}_roll{window}_mean"] = df[col].rolling(window).mean()
        new_cols[f"{col}_roll{window}_std"]  = df[col].rolling(window).std().fillna(0)

    # Single concat — eliminates fragmentation and column-by-column insertion
    df = pd.concat([df, pd.DataFrame(new_cols, index=df.index)], axis=1)
    df = df.bfill()

    logger.info(f"Feature engineering complete ({freq}). Columns: {df.shape[1]}")
    return df


def scale_for_lstm(df: pd.DataFrame, exclude_cols: list[str] = None) -> tuple[pd.DataFrame, dict]:
    exclude_cols = exclude_cols or ["period", "date", "year", "source", "freq", "month"]
    numeric_cols = [
        c for c in df.select_dtypes(include=np.number).columns
        if c not in exclude_cols
    ]

    scalers = {}
    df_scaled = df.copy()
    for col in numeric_cols:
        col_data = df[col].dropna().values.reshape(-1, 1)
        if len(col_data) < 2:
            continue
        scaler = StandardScaler()
        scaler.fit(col_data)
        mask = df[col].notna()
        df_scaled.loc[mask, col] = scaler.transform(
            df.loc[mask, col].values.reshape(-1, 1)
        ).flatten()
        scalers[col] = scaler

    logger.info(f"Scaled {len(scalers)} columns for LSTM training")
    return df_scaled, scalers


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def run_pipeline() -> dict[str, pd.DataFrame]:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Load pristine raw layers
    wb = load_worldbank()
    brent = load_brent()
    macro_snapshots = load_macroeconomy_snapshots()
    
    # 2. Build out panel horizons
    wb_decomp = decompose_oil_nonoil(wb, brent)
    monthly = build_monthly_panel(macro_snapshots, brent)
    quarterly_wb = build_quarterly_gdp_from_worldbank(wb)

    # Merge Brent quarterly onto it
    brent_q = (
    brent[brent["brent_usd_bbl"].notna()]
        .assign(period=lambda x: x["date"].dt.to_period("Q").astype(str))
        .groupby("period")["brent_usd_bbl"].mean()
        .reset_index()
    )
    quarterly = quarterly_wb.merge(brent_q, on="period", how="left")
    quarterly["brent_usd_bbl"] = quarterly["brent_usd_bbl"].interpolate("linear")

    # 3. Apply advanced feature transformation algorithms
    monthly_fe = engineer_features(monthly.copy(), freq="M")
    quarterly_fe = engineer_features(quarterly.copy(), freq="Q")

    # 4. Package target files for local processing
    outputs = {
        "monthly_panel":        monthly_fe,
        "quarterly_panel":      quarterly_fe,
        "annual_validation":    wb_decomp,
        "oil_divergence_base":  wb_decomp[["year", "oil_gdp_share_pct", "nonoil_gdp_share_pct", "brent_annual_avg_usd"]],
    }

    for name, df_out in outputs.items():
        out = PROCESSED_DIR / f"{name}.csv"
        df_out.to_csv(out, index=False)
        logger.info(f"Saved -> {out} | Shapes: {df_out.shape}")

    return outputs

def build_quarterly_gdp_from_worldbank(wb: pd.DataFrame) -> pd.DataFrame:
    """
    Interpolates World Bank annual GDP series to quarterly frequency.
    Cubic spline on ~35 annual obs -> ~140 quarterly obs.
    Legitimate for LSTM training given no other quarterly source.
    """
    from scipy.interpolate import CubicSpline

    df = wb[["year", "gdp_growth_pct", "industry_va_pct_gdp",
             "services_va_pct_gdp", "agriculture_va_pct_gdp",
             "gross_capital_formation_pct"]].dropna(subset=["gdp_growth_pct"])
    df = df.sort_values("year").reset_index(drop=True)

    # Anchor each annual value to Q2 (mid-year)
    annual_quarters = df["year"].astype(str) + "Q2"
    annual_periods = pd.PeriodIndex(annual_quarters, freq="Q")
    annual_numeric = annual_periods.asi8  # integer representation for spline

    # Build quarterly index from first to last year
    q_index = pd.period_range(
        start=f"{df['year'].min()}Q1",
        end=f"{df['year'].max()}Q4",
        freq="Q"
    )
    q_numeric = q_index.asi8

    result = pd.DataFrame({"period": q_index.astype(str)})

    for col in ["gdp_growth_pct", "industry_va_pct_gdp",
                "services_va_pct_gdp", "agriculture_va_pct_gdp",
                "gross_capital_formation_pct"]:
        series = df[col].values
        cs = CubicSpline(annual_numeric, series)
        result[col] = cs(q_numeric)

    logger.info(f"WB quarterly interpolated: {result.shape}")
    return result


if __name__ == "__main__":
    results = run_pipeline()
    for k, v in results.items():
        print(f"\n--- {k} ---")
        print(v.head(3))
        print(f"Shape: {v.shape}")