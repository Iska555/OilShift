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

@router.get("/breaks")
def get_structural_breaks():
    path = DATA / "anomaly_consolidated.csv"
    if not path.exists():
        raise HTTPException(503, "Anomaly detection not yet run")
    df = pd.read_csv(path)
    return JSONResponse(content=_clean(df.to_dict(orient="records")))

@router.get("/validation")
def get_shock_validation():
    path = DATA / "anomaly_validation.csv"
    if not path.exists():
        raise HTTPException(503, "Anomaly validation not found")
    df = pd.read_csv(path)
    return JSONResponse(content=_clean(df.to_dict(orient="records")))