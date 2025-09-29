# src/scripts/scraper_save_eligibility.py
import sys
import json
import re
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import requests

# -----------------------------
# Selenium helper functions
# -----------------------------
def safe_text(driver, selector, timeout=5):
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, selector))
        )
        return element.text.strip()
    except:
        return ""

def safe_text_list(driver, selector, timeout=5):
    try:
        WebDriverWait(driver, timeout).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, selector))
        )
        elements = driver.find_elements(By.CSS_SELECTOR, selector)
        return [el.text.strip() for el in elements if el.text.strip()]
    except:
        return []

# -----------------------------
# Parse eligibility text
# -----------------------------
def parse_eligibility_text(text: str) -> dict:
    eligibility = {}
    if not text:
        return eligibility

    text_lower = text.lower()

    # --- Age ---
    age_match = re.search(r'(\d+)\s*(?:to|-)\s*(\d+)\s*years', text_lower)
    if age_match:
        eligibility['minAge'] = int(age_match.group(1))
        eligibility['maxAge'] = int(age_match.group(2))

    # --- Gender ---
    if 'male' in text_lower:
        eligibility['gender'] = 'male'
    elif 'female' in text_lower:
        eligibility['gender'] = 'female'

    # --- Caste / Category ---
    caste_map = ['sc', 'st', 'obc', 'vjnt', 'ews']
    for caste in caste_map:
        if caste in text_lower:
            eligibility['casteCategory'] = caste
            break

    # --- Occupation ---
    occupations = ['student', 'farmer', 'unemployed', 'entrepreneur']
    for occ in occupations:
        if occ in text_lower:
            eligibility['occupation'] = occ
            break

    # --- Education ---
    edu_keywords = ['diploma', 'b.tech', 'engineering', 'iti', 'graduate', 'postgraduate', 'technical']
    eligibility['education'] = [kw for kw in edu_keywords if kw in text_lower]

    # --- State / Residence ---
    states = ['tamil nadu', 'kerala', 'andhra pradesh', 'goa', 'puducherry']
    eligibility['state'] = [s for s in states if s in text_lower]

    return eligibility

# -----------------------------
# Scrape scheme details
# -----------------------------
def scrape_scheme_details(url) -> dict:
    """Scrape scheme details from rules.myscheme.in page."""
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(url)

    raw_eligibility_text = safe_text(driver, "#eligibility .markdown-options")

    scheme_data = {
        "link": url,
        "state": safe_text(driver, "h3.text-raven.text-base"),
        "ministry": safe_text(driver, "h3.text-raven"),
        "tags": safe_text_list(driver, "div[role='button'][title]"),
        "details": safe_text(driver, "#details .markdown-options"),
        "benefits": safe_text(driver, "#benefits .markdown-options"),
        "application_process": safe_text(driver, "#application-process .markdown-options"),
        "documents_required": safe_text(driver, "#documents-required .markdown-options"),
        "faqs": safe_text_list(driver, "#faqs .markdown-options"),
        "sources_and_resources": safe_text_list(driver, "#sources .markdown-options"),
        "eligible": [parse_eligibility_text(raw_eligibility_text)]
    }

    driver.quit()
    return scheme_data

# -----------------------------
# Save scheme to API
# -----------------------------
def save_scheme_to_api(scheme: dict, api_url: str):
    """Send scraped scheme to Next.js API."""
    response = requests.post(api_url, json=scheme)
    if response.status_code == 200:
        print(f"✅ Scheme saved successfully: {scheme.get('link')}")
    else:
        print(f"❌ Failed to save scheme: {scheme.get('link')}")
        print(response.status_code, response.text)

# -----------------------------
# Main execution
# -----------------------------
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python scraper_save_eligibility.py <scheme_url> <api_url>")
        sys.exit(1)

    scheme_url = sys.argv[1]
    api_url = sys.argv[2]

    try:
        scheme_data = scrape_scheme_details(scheme_url)
        save_scheme_to_api(scheme_data, api_url)
    except Exception as e:
        print(json.dumps({"error": str(e)}))
