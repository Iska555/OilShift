from fastapi import APIRouter, HTTPException
from pathlib import Path
import pandas as pd

router = APIRouter()
DATA   = Path("../data/processed")


@router.get("/quarterly")
def get_quarterly_forecast():
    path = DATA / "lstm_results.csv"
    if not path.exists():
        raise HTTPException(503, "LSTM results not yet computed")
    df = pd.read_csv(path)
    return df.to_dict(orient="records")


@router.get("/panel")
def get_quarterly_panel():
    path = DATA / "quarterly_panel.csv"
    if not path.exists():
        raise HTTPException(503, "Quarterly panel not found")
    df = pd.read_csv(path)[["period", "gdp_growth_pct", "brent_usd_bbl"]].dropna()
    return df.to_dict(orient="records")