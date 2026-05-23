"""
Pipeline Asset Health Check.
Verifies structure and paths of all raw tables before preprocessing.
"""
from pathlib import Path
import pandas as pd

RAW_DIR = Path("data/raw")

files = {
    "World Bank": RAW_DIR / "worldbank" / "azerbaijan_worldbank_annual.csv",
    "EIA Brent": RAW_DIR / "eia" / "brent_crude_monthly.csv",
    "StatGov": RAW_DIR / "statgov" / "macroeconomy_snapshots.csv"
}

for name, path in files.items():
    print(f"\n=== Checking Asset: {name} ===")
    if not path.exists():
        print(f"❌ FILE NOT FOUND AT: {path}")
        continue
    df = pd.read_csv(path)
    print(f"✅ Found! Shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()[:5]}...")
    if "period" in df.columns:
        print(f"Period sample: {df['period'].tolist()[:3]}")
    if "date" in df.columns:
        print(f"Date sample: {df['date'].tolist()[:3]}")