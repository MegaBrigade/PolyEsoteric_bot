import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import horoscope, card
import threading

from bot.bot import run_bot
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL или SUPABASE_KEY не найдены в .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


app = FastAPI(title="PolyEsoteric Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test_db")
def test_db():
    try:
        res = supabase.table("test_table").select("*").execute()
        return {
            "status": "connected",
            "message": "Связь с Supabase установлена!",
            "data": res.data
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.get("/add_test")
def add_test(user_name: str = "Новый пользователь"):
    try:
        new_row = {"name": user_name}
        res = supabase.table("test_table").insert(new_row).execute()

        return {
            "status": "success",
            "message": "Данные добавлены в базу!",
            "data": res.data
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

from routes import horoscope, card
app.include_router(horoscope.router, prefix="/api")
app.include_router(card.router, prefix="/api")

@app.on_event("startup")
def start_bot():
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    bot_thread.start()

@app.get("/ping")
def ping():
    return {"status": "ok"}