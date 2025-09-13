from fastapi import FastAPI, status, Depends, HTTPException
from backend import models
from dotenv import load_dotenv
from backend.relaxation import run_nl_search
from sqlalchemy.orm import Session
from typing import Annotated
from backend.userdb import engine, SessionLocal
from backend import auth
from backend.auth import get_current_user

load_dotenv()
app = FastAPI(title="Car GraphRAG API")

app.include_router(auth.router)

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, db:db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed")
    return {"User": user}

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
