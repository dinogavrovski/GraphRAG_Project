from fastapi import FastAPI, Body
from dotenv import load_dotenv
from backend.relaxation import run_nl_search
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI(title="Car GraphRAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/search")
def search(query: str = Body(...)):
    """
    :param: query: User's search query
    :return: Returns the search result of the GraphRAG model

    Translates a natural language search query into Cypher, executes it on the Neo4j database,
    and returns both exact and similar matches.
    """
    results, cypher_query = run_nl_search(query)
    print({"query": cypher_query, "results": results})
    return {"query": cypher_query, "results": results}


@app.get("/")
def root():
    return {"message": "Hello World"}
