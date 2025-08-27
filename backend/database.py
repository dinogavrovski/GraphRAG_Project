from neo4j import GraphDatabase
from backend.config import NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, NEO4J_DATABASE

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

try:
    with driver.session(database=NEO4J_DATABASE) as session:
        session.run("RETURN 1")
    print(f"Connected to Neo4j database")
except Exception as e:
    print(f"Failed to connect to Neo4j database:", e)
    raise e

def get_driver():
    return driver
