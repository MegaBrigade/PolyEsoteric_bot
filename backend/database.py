import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("❌ Ошибка: SUPABASE_URL или SUPABASE_KEY не найдены в .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def add_check_record():
    try:
        data = {"name": "Запись из database.py"}
        res = supabase.table("test_table").insert(data).execute()
        print("✅ Успех! Запись добавлена в базу данных.")
        print(f"Данные из базы: {res.data}")
    except Exception as e:
        print(f"❌ Произошла ошибка при добавлении: {e}")

if __name__ == "__main__":
    add_check_record()