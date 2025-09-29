# src/scripts/scraper_details.py
# Scrape all details from a scheme page on https://rules.myscheme.in/

import sys
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager


def safe_text(driver, selector, timeout=5):
    """Return text from a single element or empty string if not found."""
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, selector))
        )
        return element.text.strip()
    except:
        return ""


def safe_text_list(driver, selector, timeout=5):
    """Return list of text values from multiple elements or empty list."""
    try:
        WebDriverWait(driver, timeout).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, selector))
        )
        elements = driver.find_elements(By.CSS_SELECTOR, selector)
        return [el.text.strip() for el in elements if el.text.strip()]
    except:
        return []


def scrape_scheme_details(url):
    """Scrape scheme details from rules.myscheme.in page."""
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    driver.get(url)

    scheme = {
        "link": url,
        "state": safe_text(driver, "h3.text-raven.text-base"),
        "ministry": safe_text(driver, "h3.text-raven"),
        "tags": safe_text_list(driver, "div[role='button'][title]"),
        "details": safe_text(driver, "#details .markdown-options"),
        "benefit": safe_text(driver, "#benefits .markdown-options"),
        "eligibility": safe_text(driver, "#eligibility .markdown-options"),
        "application_process": safe_text(driver, "#application-process .markdown-options"),
        "documents_required": safe_text(driver, "#documents-required .markdown-options"),
        "faq": safe_text_list(driver, "#faqs .markdown-options"),
        "sources_and_references": safe_text_list(driver, "#sources .markdown-options"),
    }

    driver.quit()
    return scheme


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No URL provided"}))
        sys.exit(1)

    url = sys.argv[1]
    try:
        scheme_details = scrape_scheme_details(url)
        print(json.dumps(scheme_details, ensure_ascii=False, indent=4))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
