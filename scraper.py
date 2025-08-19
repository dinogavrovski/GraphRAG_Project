import requests
from bs4 import BeautifulSoup
import csv
import time
import re

BASE_URL = "http://reklama5.com/Search?city=&cat=24&q=&sell=0&sell=1&buy=0&buy=1&trade=0&trade=1&includeOld=0&includeOld=1&includeNew=0&includeNew=1&cargoReady=0&DDVIncluded=0&private=0&company=0&page={}&SortByPrice=0&zz=1&pageView=1"
DETAIL_BASE = "http://reklama5.com"

headers = {"User-Agent": "Mozilla/5.0"}

csv_file = open("cars_reklama5.csv", "w", newline="", encoding="utf-8")
writer = None

def clean_phone(phone: str):
    if not phone:
        return ""

    phone = re.sub(r"[^\d+]", " ", phone)

    parts = phone.split()
    if not parts:
        return ""

    phone = parts[0]

    if phone.startswith("+389"):
        phone = "0" + phone[4:]
    elif phone.startswith("389"):
        phone = "0" + phone[3:]

    phone = re.sub(r"\D", "", phone) if not phone.startswith("+") else phone

    if re.fullmatch(r"07\d{7}", phone):
        return phone

    if phone.startswith("+"):
        return phone

    return phone

def get_ad_details(session, ad_url):
    try:
        response = session.get(ad_url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")


        attributes = {}

        keys = soup.select("div.row.mt-3 div.col-5 p")
        values = soup.select("div.row.mt-3 div.col-7 p")

        for key_div, val_div in zip(keys, values):
            key = key_div.get_text(strip=True).replace(":", "")
            value = val_div.get_text(strip=True)
            attributes[key] = value


        seller_tag = soup.select_one("div.card-body h5.my-0")
        attributes["Seller"] = seller_tag.get_text(strip=True) if seller_tag else ""


        phone_tag = soup.select_one("div.card-body h6")
        phone = phone_tag.get_text(strip=True) if phone_tag else ""
        attributes["Phone"] = clean_phone(phone)

        for key, value in attributes.items():
            if value == "The rest":
                attributes[key] = "Other"
            if value == "Hedgeback":
                attributes[key] = "Hatchback"
            if value == "Petrol / Gas":
                attributes[key] = "Gasoline"
            if value == "SUVs - SUVs":
                attributes[key] = "SUV"

        attributes["Link"] = ad_url

        return attributes

    except Exception as e:
        print(f"Error scraping {ad_url}: {e}")
        return {}

with requests.Session() as session:
    session.headers.update(headers)

    for page in range(1, 101):
        print(f"Scraping page {page}...")
        url = BASE_URL.format(page)
        response = session.get(url)
        soup = BeautifulSoup(response.text, "html.parser")

        ads = soup.find_all("div", class_="row ad-top-div")

        for ad in ads:
            img_div = ad.find("div", class_="ad-image-div")
            nested_div = img_div.find("div", class_="ad-image") if img_div else None
            img_url = ""
            if nested_div:
                style = nested_div.get("style", "")
                if "url(" in style:
                    start = style.find("url(") + 4
                    end = style.find(")", start)
                    img_url = style[start:end].strip("'\"")

            link_tag = ad.find("a", href=True)
            ad_url = DETAIL_BASE + link_tag["href"] if link_tag else ""

            ad_data = {}
            if ad_url:
                ad_data = get_ad_details(session, ad_url)
                ad_data["Image_URL"] = img_url
                time.sleep(0.3)

            if writer is None and ad_data:
                writer = csv.DictWriter(csv_file, fieldnames=ad_data.keys())
                writer.writeheader()

            if writer and ad_data:
                writer.writerow(ad_data)

        time.sleep(0.3)

csv_file.close()
print("Scraping finished! Data saved to cars_reklama5.csv")
