from fastapi import APIRouter, Depends
from backend.database import get_driver

router = APIRouter()

@router.get("/brands")
def get_all_brands():
    driver = get_driver()
    with driver.session() as session:
        result = session.run("MATCH (b:Brand) RETURN b.name AS name")
        return [record["name"] for record in result]
