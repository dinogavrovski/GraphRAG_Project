from fastapi import FastAPI
from dotenv import load_dotenv
from backend.relaxation import run_nl_search

load_dotenv()
app = FastAPI(title="Car GraphRAG API")


@app.post("/search")
def search(query: str):
    results, cypher_query = run_nl_search(query)
    return {"query": cypher_query, "results": results}


@app.get("/")
def root():
    return {"message": "Hello World"}
