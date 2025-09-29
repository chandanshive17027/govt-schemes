# script to scrape scheme names and links from https://rules.myscheme.in/
# and output as JSON array of objects with "name" and "link" fields
import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# --------------------------
# Configuration
# --------------------------
BASE_URL = "https://rules.myscheme.in/"

options = Options()
options.add_argument("--headless")        # Run headless
options.add_argument("--no-sandbox")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# --------------------------
# Load page
# --------------------------
driver.get(BASE_URL)
time.sleep(5)  # wait for table to load

# --------------------------
# Scroll to bottom (if table loads dynamically)
# --------------------------
last_height = driver.execute_script("return document.body.scrollHeight")
while True:
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    time.sleep(2)
    new_height = driver.execute_script("return document.body.scrollHeight")
    if new_height == last_height:
        break
    last_height = new_height

# --------------------------
# Scrape schemes from table
# --------------------------
schemes = []
rows = driver.find_elements(By.CSS_SELECTOR, "table tbody tr")

for row in rows:
    try:
        tds = row.find_elements(By.TAG_NAME, "td")
        if len(tds) < 3:
            continue

        # Scheme name is in second <td> inside nested <div>
        name_div = tds[1].find_element(By.CSS_SELECTOR, "div.col-12.col-lg-9")
        scheme_name = name_div.text.strip()

        # Scheme link is in third <td> inside <a>
        link_el = tds[2].find_element(By.TAG_NAME, "a")
        scheme_link = link_el.get_attribute("href").strip()

        schemes.append({
            "name": scheme_name,
            "link": scheme_link
        })
    except:
        # skip row if any error
        continue

driver.quit()

# --------------------------
# Output JSON only
# --------------------------
print(json.dumps(schemes, ensure_ascii=False))
