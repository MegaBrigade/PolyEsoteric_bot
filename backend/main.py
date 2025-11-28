from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client
import os

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ SUPABASE_URL или SUPABASE_KEY не найдены в .env")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="PolyEsoteric Backend")

@app.get("/test_db")
def test_db():
    try:
        res = supabase.table("test_table").select("*").execute()
        return {"status": "connected", "data": res.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routes import horoscope, card
app.include_router(horoscope.router, prefix="/api")
app.include_router(card.router, prefix="/api")

@app.get("/ping")
def ping():
    return {"status": "ok"}
