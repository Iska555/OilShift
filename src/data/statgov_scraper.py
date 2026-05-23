"""
stat.gov.az + CBAR Data Acquisition Engine.

Sources:
  1. stat.gov.az/news/macroeconomy.php  — HTML table snapshots (current + historical)
  2. uploads.cbar.az/assets/*.xlsx      — Monthly statistical bulletins (2022-present)

Outputs (all -> data/raw/statgov/):
  macroeconomy_snapshots.csv   — wide-format, one row per reporting period
  cbar_bulletin_YYYY_MM.xlsx   — raw CBAR files cached locally
  cbar_monthly_panel.csv       — parsed CBAR monetary series, long format
"""

import logging
import re
import time
from io import BytesIO
from pathlib import Path
from typing import Optional
from urllib.parse import urljoin

import pandas as pd
import requests
from bs4 import BeautifulSoup

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

RAW_DIR = Path("data/raw/statgov")
RAW_DIR.mkdir(parents=True, exist_ok=True)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

MACROECONOMY_URL = "https://www.stat.gov.az/news/macroeconomy.php?lang=en"
CBAR_BULLETIN_URL = "https://www.cbar.az/page-40/statistical-bulletin?language=az"

# Diagnostic confirmed: all XLS files are at this CDN
CBAR_ASSET_HOST = "uploads.cbar.az/assets"

# Azerbaijani month names -> int
MONTH_AZ_MAP = {
    "yanvar": 1,    "fevral": 2,   "mart": 3,     "aprel": 4,
    "may": 5,       "iyun": 6,     "iyul": 7,     "avqust": 8,
    "sentyabr": 9,  "oktyabr": 10, "noyabr": 11,  "dekabr": 12,
    # English fallbacks
    "january": 1,   "february": 2, "march": 3,    "april": 4,
    "june": 6,      "july": 7,     "august": 8,   "september": 9,
    "october": 10,  "november": 11, "december": 12,
}

# stat.gov.az canonical indicator map
INDICATOR_MAP = {
    "gross domestic product":        "gdp_total",
    "oil-gas gdp":                   "gdp_oil",
    "non oil-gas gdp":               "gdp_nonoil",
    "industrial product":            "industrial_output",
    "non oil-gas industry":          "industrial_nonoil",
    "agricultural product":          "agricultural_output",
    "transportation":                "transport_services",
    "information and communication": "ict_services",
    "retail trade turnover":         "retail_trade",
    "investments to fixed capital":  "fixed_investment",
    "non oil-gas sector":            "fixed_investment_nonoil",
    "state budget revenues":         "budget_revenue",
    "state budget expenditures":     "budget_expenditure",
    "budget surplus":                "budget_surplus",
    "strategic currency reserves":   "fx_reserves_usd",
    "external public debt":          "external_debt_usd",
    "credit investments":            "bank_credit_azn",
    "individuals deposits":          "bank_deposits_azn",
}


# ===========================================================================
# Shared helpers
# ===========================================================================

def _normalize_label(text: str) -> Optional[str]:
    text = text.lower().strip()
    for pattern, key in INDICATOR_MAP.items():
        if pattern in text:
            return key
    return None


def _parse_pct(val: str) -> Optional[float]:
    val = val.strip().replace(",", ".")
    if val in ("x", "", "-", "n/a"):
        return None
    try:
        return float(val.replace("%", "").replace("+", ""))
    except ValueError:
        return None


def _parse_value(val: str) -> Optional[float]:
    val = val.strip().replace(" ", "").replace(",", ".")
    try:
        return float(val)
    except ValueError:
        return None


# ===========================================================================
# Section 1 — stat.gov.az macroeconomy.php scraper
# ===========================================================================

def _extract_period(soup: BeautifulSoup) -> str:
    MONTH_MAP = {
        "january": 1, "february": 2, "march": 3,  "april": 4,
        "may": 5,     "june": 6,     "july": 7,   "august": 8,
        "september": 9, "october": 10, "november": 11, "december": 12,
    }
    for h in soup.find_all(["h1", "h2", "h3", "h4", "title", "b", "strong", "p"]):
        text = h.get_text(" ", strip=True).lower()
        year_match = re.search(r"\b(20\d{2})\b", text)
        if not year_match:
            continue
        year = int(year_match.group(1))
        months_found = [v for k, v in MONTH_MAP.items() if k in text]
        if months_found:
            return f"{year}-{max(months_found):02d}"
    return "unknown"


def scrape_macroeconomy_page(url: str) -> Optional[dict]:
    logger.info(f"Scraping: {url}")
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"Request failed: {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    period_str = _extract_period(soup)

    if period_str == "unknown":
        logger.warning(f"Period undetected, skipping: {url}")
        return None

    table = soup.find("table")
    if table is None:
        logger.error(f"No table found: {url}")
        return None

    record = {"period": period_str, "source_url": url}
    for row in table.find_all("tr"):
        cells = [td.get_text(strip=True) for td in row.find_all(["td", "th"])]
        if len(cells) < 2:
            continue
        canonical = _normalize_label(cells[0])
        if canonical is None:
            continue
        if len(cells) > 1:
            record[f"{canonical}_abs"] = _parse_value(cells[1])
        if len(cells) > 2:
            record[f"{canonical}_yoy_pct"] = _parse_pct(cells[2])
        if len(cells) > 3:
            record[f"{canonical}_yoy_prev_pct"] = _parse_pct(cells[3])

    logger.info(f"  [{period_str}] {len(record)} fields extracted")
    return record


def fetch_historical_links(base_url: str = MACROECONOMY_URL) -> list[str]:
    try:
        resp = requests.get(base_url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"Historical link fetch failed: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "macroeconomy" not in href.lower():
            continue
        full_url = urljoin("https://www.stat.gov.az", href)
        if full_url != base_url and full_url not in links:
            links.append(full_url)

    logger.info(f"Found {len(links)} historical report links")
    return links


def scrape_all_macroeconomy() -> pd.DataFrame:
    all_records = []

    current = scrape_macroeconomy_page(MACROECONOMY_URL)
    if current:
        all_records.append(current)

    for url in fetch_historical_links():
        record = scrape_macroeconomy_page(url)
        if record:
            all_records.append(record)
        time.sleep(0.5)

    if not all_records:
        logger.error("Zero snapshots collected.")
        return pd.DataFrame()

    df = (
        pd.DataFrame(all_records)
        .sort_values("period")
        .drop_duplicates(subset=["period"])
        .reset_index(drop=True)
    )
    out = RAW_DIR / "macroeconomy_snapshots.csv"
    df.to_csv(out, index=False)
    logger.info(f"Saved -> {out} | {df.shape}")
    return df


# ===========================================================================
# Section 2 — CBAR Statistical Bulletin downloader + parser
# ===========================================================================

def fetch_cbar_bulletin_links() -> list[dict]:
    """
    Confirmed structure (cbar_diagnostic.py):
    - All XLS links are at uploads.cbar.az/assets/*.xlsx
    - 43 links present as of May 2026
    - Anchor text format: "Sentyabr 20222.64 MB" (month + year + size, no spaces)
    """
    logger.info(f"Fetching CBAR bulletin index...")
    try:
        resp = requests.get(CBAR_BULLETIN_URL, headers=HEADERS, timeout=30)
        resp.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"CBAR page fetch failed: {e}")
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    results = []

    for a in soup.find_all("a", href=True):
        href = a["href"]

        # Filter: must be from the confirmed CDN and be an xlsx file
        if CBAR_ASSET_HOST not in href or ".xlsx" not in href.lower():
            continue

        label = a.get_text(strip=True)  # e.g. "Sentyabr 20222.64 MB"

        # Extract 4-digit year — always present in label
        year_match = re.search(r"(20\d{2})", label)
        if not year_match:
            logger.warning(f"No year in label '{label}', skipping")
            continue
        year = int(year_match.group(1))

        # Extract Azerbaijani month name from label
        label_lower = label.lower()
        month_num = None
        for m_name, m_num in MONTH_AZ_MAP.items():
            if m_name in label_lower:
                month_num = m_num
                break

        if month_num is None:
            logger.warning(f"No month match in label '{label}', skipping")
            continue

        entry = {"year": year, "month": month_num, "url": href}
        if entry not in results:
            results.append(entry)

    results.sort(key=lambda x: (x["year"], x["month"]))
    logger.info(f"Found {len(results)} CBAR XLSX links")
    return results


def _download_xlsx(url: str) -> Optional[BytesIO]:
    try:
        resp = requests.get(url, headers=HEADERS, timeout=60)
        resp.raise_for_status()
        return BytesIO(resp.content)
    except requests.RequestException as e:
        logger.warning(f"Download failed [{url}]: {e}")
        return None


def _extract_usd_azn_rate(df: pd.DataFrame) -> Optional[float]:
    """
    Scans exchange rate sheet for USD/AZN rate.
    AZN has been pegged at ~1.70 since 2017; valid range 1.50-2.00.
    """
    df_str = df.astype(str)
    for i, row in df_str.iterrows():
        row_text = " ".join(row.values).lower()
        if "usd" in row_text or "dollar" in row_text or "abd" in row_text:
            for val in df.iloc[i]:
                try:
                    num = float(str(val).replace(",", ".").replace(" ", ""))
                    if 1.50 < num < 2.00:
                        return num
                except (ValueError, TypeError):
                    continue
    return None


def _extract_monetary_indicators(df: pd.DataFrame) -> dict:
    """
    Extracts monetary aggregate values from a bulletin sheet.
    Returns dict of {series_name: value}.
    """
    TARGET_SERIES = {
        "monetary_base":  ["pul bazası", "monetary base", "pul bazasi"],
        "m2":             ["m2", "pul kütləsi m2", "pul kutlesi"],
        "bank_credit":    ["kredit qoyuluşları", "kredit qoyuluslari", "credits to economy"],
        "bank_deposits":  ["əmanətlər", "emanetler", "deposits"],
    }
    results = {}
    df_str = df.astype(str)

    for series_name, keywords in TARGET_SERIES.items():
        for i, row in df_str.iterrows():
            row_text = " ".join(row.values).lower()
            if any(kw in row_text for kw in keywords):
                # Take the last numeric value in the row (most recent period column)
                numeric_vals = []
                for val in df.iloc[i]:
                    try:
                        cleaned = str(val).replace(",", ".").replace(" ", "")
                        n = float(cleaned)
                        # Sanity: monetary aggregates in AZN million, range 100-100000
                        if 100 < n < 100_000:
                            numeric_vals.append(n)
                    except (ValueError, TypeError):
                        continue
                if numeric_vals:
                    results[series_name] = numeric_vals[-1]
                break

    return results


def parse_cbar_xlsx(buf: BytesIO, year: int, month: int) -> pd.DataFrame:
    """
    Parses one CBAR monthly statistical bulletin XLSX.
    Targets exchange rate sheet + monetary indicators sheet.
    Returns long-format DataFrame: [date, series, value]
    """
    period = f"{year}-{month:02d}"
    records = []

    try:
        xl = pd.ExcelFile(buf)
    except Exception as e:
        logger.warning(f"Cannot open XLSX [{period}]: {e}")
        return pd.DataFrame()

    logger.info(f"  [{period}] Sheets: {xl.sheet_names}")

    for sheet_name in xl.sheet_names:
        sheet_lower = sheet_name.lower()

        # Exchange rate sheet
        if any(kw in sheet_lower for kw in ["məzənnə", "mezenne", "exchange", "valyuta", "rate"]):
            try:
                df = xl.parse(sheet_name, header=None)
                rate = _extract_usd_azn_rate(df)
                if rate is not None:
                    records.append({"date": period, "series": "usd_azn_rate", "value": rate})
                    logger.info(f"  [{period}] usd_azn_rate = {rate}")
            except Exception as e:
                logger.warning(f"  Exchange rate parse failed [{sheet_name}]: {e}")

        # Monetary indicators sheet
        elif any(kw in sheet_lower for kw in ["pul", "monetary", "kredit", "credit", "bank", "maliyyə"]):
            try:
                df = xl.parse(sheet_name, header=None)
                indicators = _extract_monetary_indicators(df)
                for series_name, value in indicators.items():
                    records.append({"date": period, "series": series_name, "value": value})
                if indicators:
                    logger.info(f"  [{period}] Monetary: {list(indicators.keys())}")
            except Exception as e:
                logger.warning(f"  Monetary parse failed [{sheet_name}]: {e}")

    return pd.DataFrame(records)


def fetch_all_cbar_bulletins() -> pd.DataFrame:
    """
    Downloads all available CBAR XLSX bulletins, caches raw files,
    parses monetary series, returns merged long-format panel.
    """
    links = fetch_cbar_bulletin_links()
    if not links:
        logger.error("No CBAR links found. Check fetch_cbar_bulletin_links().")
        return pd.DataFrame()

    all_frames = []

    for entry in links:
        year, month, url = entry["year"], entry["month"], entry["url"]
        cache_path = RAW_DIR / f"cbar_bulletin_{year}_{month:02d}.xlsx"

        # Use cached file if available
        if cache_path.exists():
            logger.info(f"Cache hit: {cache_path.name}")
            buf = BytesIO(cache_path.read_bytes())
        else:
            logger.info(f"Downloading: {year}-{month:02d}")
            buf = _download_xlsx(url)
            if buf is None:
                continue
            cache_path.write_bytes(buf.getvalue())
            time.sleep(0.8)

        df = parse_cbar_xlsx(buf, year, month)
        if not df.empty:
            all_frames.append(df)

    if not all_frames:
        logger.error("No CBAR data extracted from any bulletin.")
        return pd.DataFrame()

    panel = (
        pd.concat(all_frames, ignore_index=True)
        .drop_duplicates(subset=["date", "series"])
        .sort_values(["series", "date"])
        .reset_index(drop=True)
    )

    out = RAW_DIR / "cbar_monthly_panel.csv"
    panel.to_csv(out, index=False)
    logger.info(f"CBAR panel saved -> {out} | {panel.shape}")
    logger.info(f"Series collected: {panel['series'].unique().tolist()}")
    logger.info(f"Date range: {panel['date'].min()} to {panel['date'].max()}")
    return panel


# ===========================================================================
# Master runner
# ===========================================================================

def run_pipeline() -> dict:
    macro_df = scrape_all_macroeconomy()
    cbar_df = fetch_all_cbar_bulletins()

    return {
        "macroeconomy_snapshots": macro_df,
        "cbar_monthly_panel": cbar_df,
    }


if __name__ == "__main__":
    results = run_pipeline()
    print("\n=== PIPELINE SUMMARY ===")
    for k, v in results.items():
        if v.empty:
            print(f"  {k}: EMPTY")
        else:
            print(f"  {k}: {v.shape}")
            print(v.head(3).to_string())
            print()