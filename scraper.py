import requests
from bs4 import BeautifulSoup
import csv
import time

BASE_URL = "http://reklama5.mk/Search?city=&cat=24&q=&sell=0&sell=1&buy=0&buy=1&trade=0&trade=1&includeOld=0&includeOld=1&includeNew=0&includeNew=1&cargoReady=0&DDVIncluded=0&private=0&company=0&page={}&SortByPrice=0&zz=1&pageView=1"

# CSV file setup
csv_file = open("cars_reklama5.csv", "w", newline="", encoding="utf-8")
writer = csv.writer(csv_file)
writer.writerow(["Title", "Year", "Mileage", "Power", "Price", "Location", "Image_URL"])

for page in range(1, 51):  # scrape 50 pages
    print(f"Scraping page {page}...")
    url = BASE_URL.format(page)
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")

    ads = soup.find_all("div", class_="row ad-top-div")

    for ad in ads:
        # Title
        title_tag = ad.find("div", class_="ad-desc-div").find("h3")
        title = title_tag.get_text(strip=True) if title_tag else ""

        # Year / Mileage / Power
        details_tag = ad.find("div", class_="ad-desc-div").find_all("p")
        year, mileage, power = "", "", ""
        if details_tag:
            details_text = details_tag[0].get_text(" ", strip=True)
            parts = details_text.split("•")
            if len(parts) >= 3:
                year = parts[0].strip()
                mileage = parts[1].strip()
                power = parts[2].strip()

        # Price
        price_tag = ad.find("span", class_="search-ad-price")
        price = price_tag.get_text(strip=True) if price_tag else ""

        # Location
        location_tag = ad.find("span", class_="city-span")
        location = location_tag.get_text(strip=True) if location_tag else ""

        # Image URL
        img_tag = ad.find("div", class_="ad-image-div").find("img")
        image_url = img_tag["src"] if img_tag else ""

        writer.writerow([title, year, mileage, power, price, location, image_url])

    time.sleep(1)  # polite delay

csv_file.close()
print("Scraping finished! Data saved to cars_reklama5.csv")
