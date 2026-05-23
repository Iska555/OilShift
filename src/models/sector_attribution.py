"""
Sector Attribution Analysis — XGBoost + SHAP.
Target: non-oil GDP growth (gdp_growth_pct from quarterly panel).
Features: sectoral VA shares from World Bank annual series.
Output: SHAP values per year showing which sectors drove or lagged growth.
"""

import logging
from pathlib import Path

import numpy as np
import pandas as pd

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

try:
    import xgboost as xgb
    import shap
except ImportError:
    raise ImportError("pip install xgboost shap")

from sklearn.model_selection import cross_val_score
from sklearn.metrics import mean_absolute_percentage_error

PROCESSED_DIR = Path("data/processed")

FEATURE_COLS = [
    "industry_va_pct_gdp",
    "services_va_pct_gdp",
    "agriculture_va_pct_gdp",
    "gross_capital_formation_pct",
    "trade_pct_gdp",
    "unemployment_rate",
    "brent_annual_avg_usd",
]

TARGET_COL = "gdp_growth_pct"


def load_data() -> pd.DataFrame:
    path = PROCESSED_DIR / "annual_validation.csv"
    if not path.exists():
        raise FileNotFoundError(f"Run preprocessor.py first: {path}")
    df = pd.read_csv(path).sort_values("year").reset_index(drop=True)
    logger.info(f"Annual validation loaded: {df.shape}")
    return df


def prepare_features(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series, pd.Index]:
    available_features = [c for c in FEATURE_COLS if c in df.columns]
    missing = set(FEATURE_COLS) - set(available_features)
    if missing:
        logger.warning(f"Features not available: {missing}")

    subset = df[["year"] + available_features + [TARGET_COL]].dropna()
    logger.info(f"Clean samples for attribution: {len(subset)} years "
                f"({int(subset.year.min())}-{int(subset.year.max())})")

    X = subset[available_features]
    y = subset[TARGET_COL]
    years = subset["year"]
    return X, y, years


def train_xgboost(X: pd.DataFrame, y: pd.Series) -> xgb.XGBRegressor:
    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=3,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        reg_alpha=0.1,
        reg_lambda=1.0,
        random_state=42,
        verbosity=0,
    )

    # Cross-validation on small dataset — use leave-one-out style (cv=5)
    cv_scores = cross_val_score(model, X, y, cv=5, scoring="neg_mean_absolute_error")
    cv_mae = -cv_scores.mean()
    logger.info(f"XGBoost CV MAE: {cv_mae:.2f} percentage points")

    model.fit(X, y)

    train_pred = model.predict(X)
    train_mape = mean_absolute_percentage_error(y, train_pred) * 100
    logger.info(f"XGBoost train MAPE: {train_mape:.2f}%")

    return model


def compute_shap_values(
    model: xgb.XGBRegressor,
    X: pd.DataFrame,
    years: pd.Series,
) -> pd.DataFrame:
    explainer   = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)

    shap_df = pd.DataFrame(shap_values, columns=X.columns)
    shap_df.insert(0, "year", years.values)
    shap_df["predicted_growth"] = model.predict(X)

    return shap_df


def build_sector_rankings(shap_df: pd.DataFrame, feature_cols: list[str]) -> pd.DataFrame:
    """
    For each year: rank sectors by absolute SHAP contribution.
    Positive SHAP = sector drove growth.
    Negative SHAP = sector subtracted from growth.
    """
    rows = []
    for _, row in shap_df.iterrows():
        for feature in feature_cols:
            if feature in row:
                rows.append({
                    "year":        int(row["year"]),
                    "sector":      feature,
                    "shap_value":  row[feature],
                    "direction":   "positive" if row[feature] > 0 else "negative",
                })

    rankings = pd.DataFrame(rows)

    # Add human-readable sector label
    SECTOR_LABELS = {
        "industry_va_pct_gdp":          "Industry",
        "services_va_pct_gdp":          "Services",
        "agriculture_va_pct_gdp":       "Agriculture",
        "gross_capital_formation_pct":  "Investment",
        "trade_pct_gdp":                "Trade",
        "unemployment_rate":            "Labor Market",
        "brent_annual_avg_usd":         "Oil Price",
    }
    rankings["sector_label"] = rankings["sector"].map(SECTOR_LABELS).fillna(rankings["sector"])
    rankings = rankings.sort_values(["year", "shap_value"], ascending=[True, False])
    return rankings


def compute_mean_absolute_importance(shap_df: pd.DataFrame, feature_cols: list[str]) -> pd.DataFrame:
    importance = pd.DataFrame({
        "sector": feature_cols,
        "mean_abs_shap": [shap_df[col].abs().mean() for col in feature_cols],
    }).sort_values("mean_abs_shap", ascending=False).reset_index(drop=True)

    logger.info("\nOverall sector importance (mean |SHAP|):")
    for _, row in importance.iterrows():
        logger.info(f"  {row['sector']:35s}: {row['mean_abs_shap']:.3f}")

    return importance


def run_sector_attribution() -> dict:
    df = load_data()
    X, y, years = prepare_features(df)
    available_features = list(X.columns)

    model     = train_xgboost(X, y)
    shap_df   = compute_shap_values(model, X, years)
    rankings  = build_sector_rankings(shap_df, available_features)
    importance = compute_mean_absolute_importance(shap_df, available_features)

    # Save outputs
    shap_df.to_csv(PROCESSED_DIR / "sector_shap_values.csv", index=False)
    rankings.to_csv(PROCESSED_DIR / "sector_rankings.csv", index=False)
    importance.to_csv(PROCESSED_DIR / "sector_importance.csv", index=False)

    logger.info(f"\nSaved sector_shap_values.csv | {shap_df.shape}")
    logger.info(f"Saved sector_rankings.csv    | {rankings.shape}")
    logger.info(f"Saved sector_importance.csv  | {importance.shape}")

    # Top/bottom contributor per year — summary for frontend
    summary_rows = []
    for year in sorted(shap_df["year"].unique()):
        year_data = rankings[rankings["year"] == year]
        top    = year_data.iloc[0]
        bottom = year_data.iloc[-1]
        summary_rows.append({
            "year":             int(year),
            "top_sector":       top["sector_label"],
            "top_shap":         round(top["shap_value"], 3),
            "bottom_sector":    bottom["sector_label"],
            "bottom_shap":      round(bottom["shap_value"], 3),
            "predicted_growth": round(
                shap_df[shap_df["year"] == year]["predicted_growth"].iloc[0], 2
            ),
        })

    summary = pd.DataFrame(summary_rows)
    summary.to_csv(PROCESSED_DIR / "sector_attribution_summary.csv", index=False)

    logger.info("\n=== SECTOR ATTRIBUTION SUMMARY (recent years) ===")
    logger.info(summary.tail(10).to_string(index=False))

    return {
        "model":      model,
        "shap_df":    shap_df,
        "rankings":   rankings,
        "importance": importance,
        "summary":    summary,
    }


if __name__ == "__main__":
    run_sector_attribution()