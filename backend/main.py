from fastapi import FastAPI
from backend.database import get_driver
from backend.config import NEO4J_DATABASE
app = FastAPI(title="Car GraphRAG API")

driver = get_driver()

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
