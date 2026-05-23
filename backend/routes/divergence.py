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


@router.get("/summary")
def get_divergence_summary():
    path = DATA / "divergence_summary.csv"
    if not path.exists():
        raise HTTPException(503, "Divergence model not yet computed")
    df = pd.read_csv(path)
    return JSONResponse(content=_clean(df.to_dict(orient="records")))


@router.get("/curves/{scenario}")
def get_divergence_curves(scenario: str):
    valid = {"bear_60", "base_80", "bull_100"}
    if scenario not in valid:
        raise HTTPException(400, f"scenario must be one of {valid}")

    oil_path    = DATA / f"divergence_{scenario}_oil_share.csv"
    nonoil_path = DATA / f"divergence_{scenario}_nonoil_share.csv"

    if not oil_path.exists():
        raise HTTPException(503, f"Curves not found for scenario: {scenario}")

    oil    = pd.read_csv(oil_path)
    nonoil = pd.read_csv(nonoil_path)

    return JSONResponse(content=_clean({
        "scenario": scenario,
        "oil":      oil.to_dict(orient="records"),
        "nonoil":   nonoil.to_dict(orient="records"),
    }))