from fastapi import FastAPI
from backend.database import get_driver
from backend.config import NEO4J_DATABASE
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI(title="Car GraphRAG API")

driver = get_driver()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.post("/search")
def natural_language_search(query: str):
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
    3. **All keys (properties) in the Cypher query must remain exactly as specified in the database schema (all lowercase).**
    4. **All values in the Cypher query should have the first letter capitalized, while keeping the rest of the value as in the user input.**
    - Examples: `"manual"` → `"Manual"`, `"diesel"` → `"Diesel"`, `"black"` → `"Black"`.
    5. Ignore extra words, typos, or slightly mismatched formats; return the most relevant results.
    6. If the user mentions a car model but does not specify the brand, try to infer the brand from the model if possible. If the brand cannot be inferred, generate a Cypher query that matches the model without filtering by brand.
    7. Return Cypher only, without any Markdown formatting or backticks.
    8. If the user mentions registration in a natural way, such as "registration till", "registered until", "expires", or "valid until", map this to the database property `registered_to`. Use the same capitalization rules for values (first letter capitalized).


    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    cypher_query = response.choices[0].message.content.strip()

    with driver.session(database=NEO4J_DATABASE) as session:
        result = session.run(cypher_query)
        data = [record.data() for record in result]

    return {"query": cypher_query, "results": data}

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/brands")
def get_brands():
    with driver.session(database=NEO4J_DATABASE) as session:
        result = session.run("MATCH (b:Brand) RETURN b.name AS name LIMIT 10")
        return {"brands": [r["name"] for r in result]}

@app.get("/cars")
def get_cars():
    with driver.session(database=NEO4J_DATABASE) as session:
        result = session.run("""
            MATCH (c:Car)-[:BELONGS_TO]-(b:Brand)
            RETURN b.name AS brand, c.model AS model, c.year AS year, c.kilometers AS kilometers, c.color AS color
            LIMIT 10
        """)
        return {"cars": [{"brand": r["brand"], "model": r["model"], "year": r["year"], "color":r["color"], "kilometers": r["kilometers"]} for r in result]}
