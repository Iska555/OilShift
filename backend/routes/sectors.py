from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
import pandas as pd
import numpy as np

router = APIRouter()
DATA   = Path("../data/processed")

def _clean(obj):
    """Recursively replace NaN/inf with None for JSON compliance."""
    if isinstance(obj, list):
        return [_clean(i) for i in obj]
    if isinstance(obj, dict):
        return {k: _clean(v) for k, v in obj.items()}
    if isinstance(obj, float) and (np.isnan(obj) or np.isinf(obj)):
        return None
    return obj

@router.get("/importance")
def get_sector_importance():
    path = DATA / "sector_importance.csv"
    if not path.exists():
        raise HTTPException(503, "Sector attribution not yet run")
    df = pd.read_csv(path)
    return JSONResponse(content=_clean(df.to_dict(orient="records")))

@router.get("/shap/{year}")
def get_shap_by_year(year: int):
    path = DATA / "sector_rankings.csv"
    if not path.exists():
        raise HTTPException(503, "SHAP values not found")
    df = pd.read_csv(path)
    year_df = df[df["year"] == year]
    if year_df.empty:
        raise HTTPException(404, f"No data for year {year}")
    return JSONResponse(content=_clean(year_df.to_dict(orient="records")))

@router.get("/summary")
def get_attribution_summary():
    path = DATA / "sector_attribution_summary.csv"
    if not path.exists():
        raise HTTPException(503, "Attribution summary not found")
    df = pd.read_csv(path)
    return JSONResponse(content=_clean(df.to_dict(orient="records")))