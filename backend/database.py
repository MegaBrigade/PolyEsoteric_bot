import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

_supabase: Client | None = None

def get_supabase() -> Client:
    global _supabase

    if _supabase is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")

        if not url or not key:
            raise RuntimeError("SUPABASE_URL или SUPABASE_KEY не заданы")

        _supabase = create_client(url, key)

    return _supabase
