import threading
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from bot.bot import run_bot
from routes import horoscope, card

app = FastAPI(title="PolyEsoteric Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(horoscope.router, prefix="/api")
app.include_router(card.router, prefix="/api")

@app.on_event("startup")
def start_bot():
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    bot_thread.start()

@app.get("/ping")
async def ping():
    return {
        "status": "active",
        "service": "PolyEsoteric Bot",
        "timestamp": datetime.now().isoformat()
    }