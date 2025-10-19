from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="PolyEsoteric Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://poly-esoteric-bot.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

app.mount("/css", StaticFiles(directory=FRONTEND_DIR / "css"), name="css")
app.mount("/js", StaticFiles(directory=FRONTEND_DIR / "js"), name="js")
app.mount("/assets", StaticFiles(directory=FRONTEND_DIR / "assets"), name="assets")

@app.get("/ping")
def ping():
    return {"status": "ok", "message": "Server is running!"}

@app.post("/api/test")
async def test_api(request: Request):
    data = await request.json()
    user_message = data.get("message", "Ничего не прислали 😅")
    print(f"Сообщение от фронта: {user_message}")

    if "гороскоп" in user_message.lower():
        reply = "Сегодня тебя ждёт удача 💫"
    elif "карта" in user_message.lower():
        reply = "Твоя карта дня — Колесо фортуны 🔮"
    else:
        reply = "Вселенная молчит 🌌"

    return {"reply": reply}

@app.get("/")
def serve_index():
    index_path = FRONTEND_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    return JSONResponse(content={"error": "index.html not found"}, status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
