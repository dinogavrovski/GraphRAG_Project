from openai import OpenAI
from backend.database import get_driver
from backend.config import NEO4J_DATABASE
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
driver = get_driver()

BASE_RULES = """
Rules:

1. engine_power is stored as a string "XX kw / YY ks". If the user requests only "XX kw" or "YY ks", match appropriately.
2. If the user writes a number in words, e.g., "five hundred thousand kilometers", interpret it as the correct numeric value (500000).
3. All keys (properties) in the Cypher query must remain exactly as specified in the database schema (all lowercase).
4. All values in the Cypher query should have the first letter capitalized. Always normalize them so the first letter is uppercase, the rest lowercase, unless it is a number or special string (like "8.2025").
   Examples: `"manual"` → `"Manual"`, `"diEsel"` → `"Diesel"`, `"bLack"` → `"Black"`.
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
15. If the user specifies a numeric value for kilometers (e.g., "200000 kilometers"), do not assume exact equality. 
   Instead:
   - if they say between x and y kilometers, use c.kilometers >= x AND c.kilometers <= y
   - If they say "about", "around", or give a plain number, use a ±10% range
   - If they say "less than" / "under", use a strict upper bound (< value)
   - If they say "more than" / "above" / "over", use a strict lower bound (> value)
   - If no explicit range word is given, default to approximate range matching.
16. Price may be an integer OR string ("By agreement"). If filtering by price, include only integer comparisons.
"""


def run_nl_search(query: str, top_n=20):
    prompt = f"""
        You are a Cypher expert. Translate this request into a Cypher query for Neo4j:
        "{query}"

        The database has nodes:
        - (:Brand {{name}})
        - (:Car {{model, kilometers, car_body, color, engine_power, fuel, gearbox, image_url, year, show_class, registration, registered_to, link, price}})
        - (:Seller {{name}})
        Relationships:
        - (:Car)-[:BELONGS_TO]->(:Brand)
        - (:Car)-[:IS_SOLD_BY]->(:Seller)


        {BASE_RULES}
        """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    cypher_query = response.choices[0].message.content.strip()

    # Run query on Neo4j
    with driver.session(database=NEO4J_DATABASE) as session:
        result = session.run(cypher_query)
        exact_matches = [record.data() for record in result]

    exact_ids = {car["c"]["id"] for car in exact_matches}

    similar_matches = []
    if len(exact_matches) < top_n:
        broaden_prompt = f"""
            You are a Cypher expert. The previous user request:
            "{query}"

            Exact query results: {len(exact_matches)}

            Follow these base rules exactly:
            {BASE_RULES}
            
            Now generate a new Cypher query to find similar cars:
            - Keep brand and model filters strict.
              MATCH (c:Car)-[:BELONGS_TO]->(:Brand {{name}})
              Do NOT replace brand with c.brand.
            - Exclude cars with IDs already in: {list(exact_ids)}
            - Broaden kilometers, year, and price ranges by ~30%.
            - Drop less important categorical filters (color, gearbox, car_body) if needed.
            - Exclude all exact match IDs listed above using proper Cypher syntax.
              Example: "WITH c WHERE NOT c.id IN [1,2,3] RETURN c"
            - Return top {top_n} results, excluding duplicates from the exact query.
            - Return Cypher only, without Markdown or backticks.
            """
        response2 = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": broaden_prompt}]
        )
        similar_cypher = response2.choices[0].message.content.strip()
        print("Similar Cypher Query:\n", similar_cypher)

        with driver.session(database=NEO4J_DATABASE) as session:
            result2 = session.run(similar_cypher)
            similar_matches = [record.data() for record in result2]

        similar_matches = [car for car in similar_matches if car["c"]["id"] not in exact_ids]

    return {
        "exact_matches": exact_matches,
        "similar_matches": similar_matches
    }, cypher_query
