from fastapi import FastAPI, Query

from backend.database import get_driver
from backend.config import NEO4J_DATABASE
from openai import OpenAI
from dotenv import load_dotenv
import os

from backend.relaxation import search_until_match

load_dotenv()
app = FastAPI(title="Car GraphRAG API")

driver = get_driver()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.post("/search")
def natural_language_search(query: str, relax: bool = Query(False)):
    prompt = f"""
    You are a Cypher expert. Translate this request into a Cypher query for Neo4j:
    "{query}"

    The database has nodes:
    - (:Brand {{name}})
    - (:Car {{model, kilometers, car_body, color, engine_power, fuel, gearbox, image_url, year, show_class, registration, registered_to, link}})
    - (:Seller {{name}})
    Relationships:
    - (:Car)-[:BELONGS_TO]->(:Brand)
    - (:Car)-[:IS_SOLD_BY]->(:Seller)
    
    Rules:

    1. engine_power is stored as a string "XX kw / YY ks". If the user requests only "XX kw" or "YY ks", match appropriately.
    2. If the user writes a number in words, e.g., "five hundred thousand kilometers", interpret it as the correct numeric value (500000).
    3. All keys (properties) in the Cypher query must remain exactly as specified in the database schema (all lowercase).**
    4. All values in the Cypher query should have the first letter capitalized. Always normalize them so the first letter is uppercase, the rest lowercase, unless it is a number or special string (like "8.2025").
    - Examples: `"manual"` → `"Manual"`, `"diEsel"` → `"Diesel"`, `"bLack"` → `"Black"`.
    5. Ignore extra words, typos, or slightly mismatched formats; return the most relevant results.
    6. If the user mentions a car model but does not specify the brand, try to infer the brand from the model if possible. If the brand cannot be inferred, generate a Cypher query that matches the model without filtering by brand.
    7. Return Cypher only, without any Markdown formatting or backticks.
    8. If the user mentions registration in a natural way, such as "registration till", "registered until", "expires", or "valid until", map this to the database property `registered_to`. Use the same capitalization rules for values (first letter capitalized).
    9. If a property value has plural or singular variations (e.g., "Caravans" vs. "Caravan"), normalize it to the form stored in the database. Always match against the canonical stored value if possible.
    10. If the user says "car body" or "body type", map it to the property `car_body`.
    11. If the user says "fuel type" or any similar input to that one, map it to the property `fuel`.
    12. If the user says "power", "horsepower", "hp", or "kw", map it to the property `engine_power`.
    13. If the user says "gear", "transmission", or "gearbox", or if the user says "manual", "automatic" or "semi-automatic", map it to the property `gearbox`.
    14. If the user says "registration till", "registered until", "valid until", or "expires", map it to the property `registered_to`.
    15. Keep the year filter strict if provided (>= or =), but other numeric fields (like kilometers) can be relaxed.
    16. If the user specifies a numeric value for kilometers (e.g., "200000 kilometers"), do not assume exact equality. 
     Instead:
     - If they say "about", "around", or give a plain number, use a ±10% range (e.g., 200000 → c.kilometers >= 180000 AND c.kilometers <= 220000).
     - If no results are found, incrementally relax numeric ranges (±10%, ±15%, ±20%, up to ±30% max).
     - If still no results, remove less important filters like color, gearbox, fuel, car_body one by one.
     - Apply fuzzy matching for text fields last.
     - Always prioritize exact brand/model matches.
     - Return a valid Cypher query and include a comment describing what relaxation steps were applied.
     - If they say "less than" / "under", use a strict upper bound (< value).
     - If they say "more than" / "above" / "over", use a strict lower bound (> value).
     - If no explicit range word is given, default to approximate range matching.
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    cypher_query = response.choices[0].message.content.strip()
    applied_steps = []

    with driver.session(database=NEO4J_DATABASE) as session:
        result = session.run(cypher_query)
        data = [record.data() for record in result]
        if not data and relax:
            data, applied_steps = search_until_match(cypher_query, session)

    return {
        "query": cypher_query,
        "results": data,
        "relaxations": applied_steps
    }
