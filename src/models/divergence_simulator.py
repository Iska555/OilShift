"""
Stochastic Oil/Non-Oil GDP Divergence Simulator.

Reframing (post-baseline check):
  Non-oil GDP already exceeds oil GDP in AZN terms (~70/30 split per stat.gov.az 2026).
  The divergence question is therefore:
    "Under each oil price scenario, when does oil GDP share fall below
     key policy thresholds: 25%, 20%, 15%, 10%?"
  This directly maps to Azerbaijan 2030 diversification targets.

Oil GDP modeled as: base_share × (1 + elasticity × brent_deviation) × trend_decay
Non-oil GDP modeled as: random walk with positive drift (diversification trajectory)
"""

import logging
from pathlib import Path

import numpy as np
import pandas as pd

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

PROCESSED_DIR = Path("data/processed")

# --- Calibration constants ---
# Source: stat.gov.az Jan-Apr 2026 snapshot
# oil-gas GDP = 12,135 / total GDP = 39,875 -> 30.4%
OIL_SHARE_BASELINE   = 0.304
NONOIL_SHARE_BASELINE = 0.696

# Oil GDP sensitivity to Brent (calibrated from historical data, fallback)
OIL_BRENT_ELASTICITY_DEFAULT = 0.30

# Non-oil growth parameters (from World Bank + Azerbaijan 2030 targets)
NONOIL_GROWTH_MEAN = 0.045   # 4.5% annual — conservative 2030 target
NONOIL_GROWTH_STD  = 0.025

# Oil sector long-run structural decline (independent of price)
# AZ oil production declining ~3-5% annually as mature fields deplete
OIL_PRODUCTION_DECLINE = -0.025  # -2.5% annual structural decline

SCENARIOS = {
    "bear_60":  60.0,
    "base_80":  80.0,
    "bull_100": 100.0,
}

BRENT_BASE = 80.0
N_SIMS     = 1000
YEARS      = 25        # project to 2050
STEPS      = YEARS * 4 # quarterly

# Policy threshold years — when oil share crosses these, record it
THRESHOLDS = [0.25, 0.20, 0.15, 0.10]


def load_divergence_base() -> pd.DataFrame:
    path = PROCESSED_DIR / "oil_divergence_base.csv"
    if not path.exists():
        raise FileNotFoundError(f"Run preprocessor.py first: {path}")
    df = pd.read_csv(path).dropna(subset=["oil_gdp_share_pct", "nonoil_gdp_share_pct"])
    logger.info(f"Divergence base loaded: {df.shape} | {df['year'].min()}-{df['year'].max()}")
    return df


def calibrate_elasticity(df: pd.DataFrame) -> float:
    df = df.sort_values("year").copy()
    df["oil_chg"]   = df["oil_gdp_share_pct"].pct_change()
    df["brent_chg"] = df["brent_annual_avg_usd"].pct_change()
    valid = df.dropna(subset=["oil_chg", "brent_chg"])

    if len(valid) < 5:
        logger.warning("Insufficient data for calibration. Using default.")
        return OIL_BRENT_ELASTICITY_DEFAULT

    X = valid["brent_chg"].values
    y = valid["oil_chg"].values
    beta = float(np.dot(X, y) / (np.dot(X, X) + 1e-9))
    beta = np.clip(beta, 0.05, 0.60)  # sanity bounds
    logger.info(f"Calibrated oil-Brent elasticity: {beta:.3f}")
    return beta


def run_scenario(
    brent_price: float,
    elasticity: float,
    seed: int = 42,
) -> dict:
    rng = np.random.default_rng(seed)
    dt  = 0.25

    brent_dev = (brent_price - BRENT_BASE) / BRENT_BASE

    # Quarterly parameters
    oil_price_effect   = elasticity * brent_dev * dt
    oil_struct_decline = OIL_PRODUCTION_DECLINE * dt
    oil_quarterly_drift = oil_price_effect + oil_struct_decline
    oil_vol = 0.012 * np.sqrt(dt)

    nonoil_drift = NONOIL_GROWTH_MEAN * dt
    nonoil_vol   = NONOIL_GROWTH_STD * np.sqrt(dt)

    # Index paths (base = 100 at t=0)
    oil_idx    = np.full((N_SIMS, STEPS), 100.0)
    nonoil_idx = np.full((N_SIMS, STEPS), 100.0)

    for t in range(1, STEPS):
        oil_shock        = rng.normal(0, oil_vol, N_SIMS)
        nonoil_shock     = rng.normal(0, nonoil_vol, N_SIMS)
        oil_idx[:, t]    = oil_idx[:, t-1]    * (1 + oil_quarterly_drift + oil_shock)
        nonoil_idx[:, t] = nonoil_idx[:, t-1] * (1 + nonoil_drift + nonoil_shock)

    # Convert index paths to GDP share paths
    # oil_share(t) = OIL_BASELINE × oil_idx(t) / [OIL_BASELINE × oil_idx(t) + NONOIL_BASELINE × nonoil_idx(t)]
    oil_gdp    = OIL_SHARE_BASELINE    * oil_idx
    nonoil_gdp = NONOIL_SHARE_BASELINE * nonoil_idx
    total_gdp  = oil_gdp + nonoil_gdp

    oil_share    = oil_gdp    / total_gdp
    nonoil_share = nonoil_gdp / total_gdp

    # Threshold crossing years
    base_year = 2025
    threshold_results = {}
    for threshold in THRESHOLDS:
        crossing_quarters = []
        for sim in range(N_SIMS):
            crossed = np.where(oil_share[sim] < threshold)[0]
            if len(crossed) > 0:
                crossing_quarters.append(crossed[0])

        if len(crossing_quarters) == 0:
            threshold_results[threshold] = {
                "median_year": None,
                "p10_year":    None,
                "p90_year":    None,
                "probability": 0.0,
            }
        else:
            arr = np.array(crossing_quarters)
            threshold_results[threshold] = {
                "median_year": round(base_year + np.median(arr) / 4, 1),
                "p10_year":    round(base_year + np.percentile(arr, 10) / 4, 1),
                "p90_year":    round(base_year + np.percentile(arr, 90) / 4, 1),
                "probability": len(crossing_quarters) / N_SIMS,
            }

    return {
        "oil_share":          oil_share,
        "nonoil_share":       nonoil_share,
        "threshold_results":  threshold_results,
        "brent_price":        brent_price,
    }


def build_curves(share_paths: np.ndarray, base_year: int = 2025) -> pd.DataFrame:
    periods = [f"{base_year + t // 4}Q{(t % 4) + 1}" for t in range(share_paths.shape[1])]
    return pd.DataFrame({
        "period": periods,
        "p10":    np.percentile(share_paths, 10, axis=0),
        "p50":    np.percentile(share_paths, 50, axis=0),
        "p90":    np.percentile(share_paths, 90, axis=0),
    })


def run_all_scenarios() -> dict:
    df          = load_divergence_base()
    elasticity  = calibrate_elasticity(df)

    logger.info(f"Baseline: oil={OIL_SHARE_BASELINE:.1%} | nonoil={NONOIL_SHARE_BASELINE:.1%}")
    logger.info(f"Structural decline: {OIL_PRODUCTION_DECLINE:.1%}/yr | Elasticity: {elasticity:.3f}")

    results      = {}
    summary_rows = []

    for name, price in SCENARIOS.items():
        logger.info(f"\nScenario: {name} (${price}/bbl)")
        result = run_scenario(price, elasticity, seed=42)
        results[name] = result

        # Save share curves
        build_curves(result["oil_share"]).to_csv(
            PROCESSED_DIR / f"divergence_{name}_oil_share.csv", index=False
        )
        build_curves(result["nonoil_share"]).to_csv(
            PROCESSED_DIR / f"divergence_{name}_nonoil_share.csv", index=False
        )

        # Log threshold crossings
        for threshold, tr in result["threshold_results"].items():
            label = f"oil<{threshold:.0%}"
            logger.info(
                f"  {label}: {tr['median_year']} "
                f"(80% CI: {tr['p10_year']}-{tr['p90_year']}) | "
                f"prob={tr['probability']:.0%}"
            )
            summary_rows.append({
                "scenario":    name,
                "brent_price": price,
                "threshold":   threshold,
                "median_year": tr["median_year"],
                "p10_year":    tr["p10_year"],
                "p90_year":    tr["p90_year"],
                "probability": tr["probability"],
            })

    summary = pd.DataFrame(summary_rows)
    summary.to_csv(PROCESSED_DIR / "divergence_summary.csv", index=False)

    logger.info("\n" + "=" * 65)
    logger.info("DIVERGENCE SUMMARY — Oil GDP Share Threshold Crossings")
    logger.info("=" * 65)
    logger.info(summary[summary["threshold"] == 0.20].to_string(index=False))

    return results


if __name__ == "__main__":
    run_all_scenarios()