from fastapi import FastAPI
from dotenv import load_dotenv
from backend.relaxation import run_nl_search

load_dotenv()
app = FastAPI(title="Car GraphRAG API")


@app.post("/search")
def search(query: str):
    """
    :param: query: User's search query
    :return: Returns the search result of the GraphRAG model

    Translates a natural language search query into Cypher, executes it on the Neo4j database,
    and returns both exact and similar matches.
    """
    results, cypher_query = run_nl_search(query)
    return {"query": cypher_query, "results": results}


@app.get("/")
def root():
    return {"message": "Hello World"}
