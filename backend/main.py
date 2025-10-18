from fastapi import FastAPI
from fastapi.responses import JSONResponse
from backend.routes import users
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Telegram Mini App Backend")

@app.get("/ping")
def ping():
    return JSONResponse(content={"status": "ok", "message": "Server is running!"})

app.include_router(users.router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
