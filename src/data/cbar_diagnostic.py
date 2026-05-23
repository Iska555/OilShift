"""
CBAR XLS link hunter — scans all 1221 anchors.
"""
import requests
from bs4 import BeautifulSoup

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "az,en-US;q=0.9,en;q=0.8",
}
URL = "https://www.cbar.az/page-40/statistical-bulletin?language=az"

def diagnose():
    resp = requests.get(URL, headers=HEADERS, timeout=30)
    soup = BeautifulSoup(resp.text, "html.parser")
    all_links = soup.find_all("a", href=True)
    print(f"Total anchors: {len(all_links)}")

    # Pass 1: anything with .xls in href
    xls_links = [a for a in all_links if ".xls" in a["href"].lower()]
    print(f"\nAnchors with .xls in href: {len(xls_links)}")
    for a in xls_links[:10]:
        print(f"  {a['href']} | text: {a.get_text(strip=True)[:60]}")

    # Pass 2: anchors containing an <img> (icon-based download buttons)
    icon_links = [a for a in all_links if a.find("img")]
    print(f"\nAnchors with img child (icon buttons): {len(icon_links)}")
    for a in icon_links[:10]:
        img = a.find("img")
        print(f"  href: {a['href']} | img src: {img.get('src','')[:80]} | text: {a.get_text(strip=True)[:40]}")

    # Pass 3: anchors with download-like keywords in href
    dl_links = [a for a in all_links if any(
        kw in a["href"].lower() for kw in ["download", "asset", "upload", "file", "bulletin", "bulleeten", "statistic"]
    )]
    print(f"\nAnchors with download-pattern hrefs: {len(dl_links)}")
    for a in dl_links[:15]:
        print(f"  {a['href']} | text: {a.get_text(strip=True)[:60]}")

    # Pass 4: dump all unique href patterns (first path segment)
    from collections import Counter
    from urllib.parse import urlparse
    segments = Counter()
    for a in all_links:
        path = urlparse(a["href"]).path
        first_seg = "/" + path.strip("/").split("/")[0] if path.strip("/") else "/"
        segments[first_seg] += 1
    print(f"\nTop 20 href path prefixes:")
    for seg, count in segments.most_common(20):
        print(f"  {seg}: {count}")

if __name__ == "__main__":
    diagnose()