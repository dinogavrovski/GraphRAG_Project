from fastapi import FastAPI
from backend.routes import cars

app = FastAPI(title="Car GraphRAG API")

# Register routes
app.include_router(cars.router, prefix="/cars", tags=["Cars"])

@app.get("/")
def root():
    return {"message": "🚗 Car GraphRAG API is running"}
