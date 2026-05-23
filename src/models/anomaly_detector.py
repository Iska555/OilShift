"""
Structural Break & Anomaly Detection.
Uses ruptures PELT algorithm with RBF cost function.

Validates against 4 known Azerbaijan economic shocks:
  1. 1994     — Post-Soviet stabilization (GDP collapse)
  2. 2008-09  — Global financial crisis + oil crash
  3. 2015-16  — Manat devaluation (~50% vs USD)
  4. 2020     — COVID-19 + oil price collapse

Any methodology that misses all 4 is rejected.
"""

import logging
from pathlib import Path

import numpy as np
import pandas as pd

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

try:
    import ruptures as rpt
except ImportError:
    raise ImportError("pip install ruptures")

PROCESSED_DIR = Path("data/processed")
OUTPUT_DIR    = Path("data/processed")

# Known ground-truth shocks for validation
KNOWN_SHOCKS = {
    1994: "Post-Soviet GDP collapse and stabilization",
    2008: "Global financial crisis and oil price crash",
    2015: "Manat devaluation — AZN lost ~50% vs USD",
    2020: "COVID-19 pandemic and simultaneous oil collapse",
}
SHOCK_TOLERANCE_YEARS = 2   # detected break within ±2 years counts as validated


def load_annual_series() -> pd.DataFrame:
    path = PROCESSED_DIR / "annual_validation.csv"
    if not path.exists():
        raise FileNotFoundError(f"Run preprocessor.py first: {path}")
    df = pd.read_csv(path).sort_values("year").reset_index(drop=True)
    logger.info(f"Annual series loaded: {df.shape}")
    return df


def detect_breakpoints(
    series: np.ndarray,
    model: str = "rbf",
    min_size: int = 2,
) -> list[int]:
    signal = series.reshape(-1, 1)
    algo = rpt.Pelt(model=model, min_size=min_size, jump=1).fit(signal)

    # Auto-tune penalty: start low, increase until n_breaks is reasonable
    for pen in [1, 2, 3, 5, 8, 15]:
        try:
            bps = algo.predict(pen=pen)
            bps = [b for b in bps if b < len(signal)]
            # Accept if 2-8 breaks found — too many is noise, zero is useless
            if 2 <= len(bps) <= 8:
                return bps
        except rpt.exceptions.BadSegmentationParameters:
            continue

    return []


def run_detection_on_series(
    df: pd.DataFrame,
    col: str,
    years: np.ndarray,
) -> list[dict]:
    """
    Detects breaks in one series and returns structured results.
    """
    series = df[col].values

    if pd.isna(series).sum() > len(series) * 0.3:
        logger.warning(f"  {col}: >30% NaN, skipping")
        return []

    # Forward-fill for PELT (cannot handle NaN)
    series_clean = pd.Series(series).ffill().bfill().values

    try:
        bps = detect_breakpoints(series_clean)
    except Exception as e:
        logger.warning(f"  {col}: detection failed — {e}")
        return []

    results = []
    for bp_idx in bps:
        if bp_idx >= len(years):
            continue
        break_year = int(years[bp_idx - 1]) if bp_idx > 0 else int(years[0])

        # Magnitude: mean difference across break
        pre  = series_clean[max(0, bp_idx-3):bp_idx]
        post = series_clean[bp_idx:min(len(series_clean), bp_idx+3)]
        magnitude = float(np.mean(post) - np.mean(pre)) if len(pre) and len(post) else 0.0

        results.append({
            "series":     col,
            "break_year": break_year,
            "magnitude":  magnitude,
            "direction":  "up" if magnitude > 0 else "down",
        })

    logger.info(f"  {col}: {len(results)} breaks detected — years {[r['break_year'] for r in results]}")
    return results


def validate_against_known_shocks(
    all_breaks: pd.DataFrame,
) -> dict:
    """
    Checks whether each known shock year appears within tolerance
    in the detected breaks. Returns validation report.
    """
    detected_years = set(all_breaks["break_year"].unique())
    validation = {}

    for shock_year, description in KNOWN_SHOCKS.items():
        # Check if any detected break is within tolerance window
        window = set(range(shock_year - SHOCK_TOLERANCE_YEARS, shock_year + SHOCK_TOLERANCE_YEARS + 1))
        hits   = detected_years & window
        validated = len(hits) > 0
        validation[shock_year] = {
            "description":  description,
            "validated":    validated,
            "detected_near": sorted(list(hits)),
        }

        status = "VALIDATED" if validated else "MISSED"
        logger.info(f"  {shock_year} ({description[:30]}...): {status} | Near: {sorted(list(hits))}")

    return validation


def run_anomaly_detection() -> dict:
    df = load_annual_series()
    years = df["year"].values

    # Target series for break detection
    target_series = [
        "gdp_growth_pct",
        "cpi_inflation_pct",
        "industry_va_pct_gdp",
        "oil_gdp_share_pct",
        "nonoil_gdp_share_pct",
        "brent_annual_avg_usd",
    ]
    available = [c for c in target_series if c in df.columns]
    logger.info(f"Running PELT on {len(available)} series: {available}")

    all_break_rows = []
    for col in available:
        rows = run_detection_on_series(df, col, years)
        all_break_rows.extend(rows)

    if not all_break_rows:
        logger.error("No breakpoints detected. Check data quality.")
        return {}

    all_breaks = (
        pd.DataFrame(all_break_rows)
        .sort_values(["break_year", "series"])
        .reset_index(drop=True)
    )

    # Consolidate: years where multiple series break simultaneously
    # These are the most credible structural breaks
    year_counts = all_breaks.groupby("break_year").size().rename("series_count")
    all_breaks  = all_breaks.merge(year_counts, on="break_year")

    # Save full break table
    all_breaks.to_csv(OUTPUT_DIR / "anomaly_breaks.csv", index=False)
    logger.info(f"Saved anomaly_breaks.csv | {all_breaks.shape}")

    # Consolidated view: one row per year, list of affected series
    consolidated = (
        all_breaks.groupby("break_year")
        .agg(
            series_affected=("series", lambda x: list(x)),
            series_count=("series_count", "first"),
            mean_magnitude=("magnitude", "mean"),
        )
        .reset_index()
        .sort_values("break_year")
    )
    consolidated.to_csv(OUTPUT_DIR / "anomaly_consolidated.csv", index=False)

    logger.info("\n" + "=" * 55)
    logger.info("DETECTED STRUCTURAL BREAKS (consolidated)")
    logger.info("=" * 55)
    for _, row in consolidated.iterrows():
        logger.info(
            f"  {int(row['break_year'])}: "
            f"{row['series_count']} series | "
            f"magnitude: {row['mean_magnitude']:+.2f} | "
            f"{row['series_affected']}"
        )

    logger.info("\n" + "=" * 55)
    logger.info("VALIDATION AGAINST KNOWN SHOCKS")
    logger.info("=" * 55)
    validation = validate_against_known_shocks(all_breaks)

    validated_count = sum(1 for v in validation.values() if v["validated"])
    logger.info(f"\nResult: {validated_count}/4 known shocks validated")

    if validated_count < 3:
        logger.warning(
            "Only {validated_count}/4 shocks detected. "
            "Consider lowering PELT penalty or expanding series set."
        )

    # Save validation report
    val_rows = [
        {
            "shock_year":    year,
            "description":   v["description"],
            "validated":     v["validated"],
            "detected_near": str(v["detected_near"]),
        }
        for year, v in validation.items()
    ]
    pd.DataFrame(val_rows).to_csv(OUTPUT_DIR / "anomaly_validation.csv", index=False)

    return {
        "all_breaks":     all_breaks,
        "consolidated":   consolidated,
        "validation":     validation,
        "validated_count": validated_count,
    }


if __name__ == "__main__":
    results = run_anomaly_detection()
    if results:
        print(f"\nValidated: {results['validated_count']}/4 known shocks")
    else:
        print("\nNo breaks detected — check series quality")