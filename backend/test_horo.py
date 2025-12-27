import os
from datetime import datetime
from dotenv import load_dotenv
from database import get_supabase  # убедись, что путь к database.py верный

# Загружаем переменные окружения
load_dotenv()

# Твои настройки
PROJECT_ID = "wjgwfemvxxrgnyfutvqf"
BASE_STORAGE_URL = f"https://{PROJECT_ID}.supabase.co/storage/v1/object/public/assets/"


def get_zodiac_sign(birth_date):
    day, month = birth_date.day, birth_date.month
    if (month == 3 and day >= 21) or (month == 4 and day <= 19): return "aries"
    if (month == 4 and day >= 20) or (month == 5 and day <= 20): return "taurus"
    if (month == 5 and day >= 21) or (month == 6 and day <= 20): return "gemini"
    if (month == 6 and day >= 21) or (month == 7 and day <= 22): return "cancer"
    if (month == 7 and day >= 23) or (month == 8 and day <= 22): return "leo"
    if (month == 8 and day >= 23) or (month == 9 and day <= 22): return "virgo"
    if (month == 9 and day >= 23) or (month == 10 and day <= 22): return "libra"
    if (month == 10 and day >= 23) or (month == 11 and day <= 21): return "scorpio"
    if (month == 11 and day >= 22) or (month == 12 and day <= 21): return "sagittarius"
    if (month == 12 and day >= 22) or (month == 1 and day <= 19): return "capricorn"
    if (month == 1 and day >= 20) or (month == 2 and day <= 18): return "aquarius"
    return "pisces"


def test_logic():
    # 1. Тестируем определение знака
    test_date = datetime.strptime("27-12-2000", "%d-%m-%Y").date()
    zodiac = get_zodiac_sign(test_date)
    print(f"✅ Знак зодиака для 27-12: {zodiac}")

    # 2. Тестируем запрос к Supabase
    try:
        supabase = get_supabase()
        result = supabase.table("zodiac_signs").select("file_path").eq("name", zodiac).single().execute()

        if result.data:
            file_name = result.data["file_path"]
            full_url = f"{BASE_STORAGE_URL}{file_name}"
            print(f"✅ Путь из базы: {file_name}")
            print(f"✅ Полная ссылка: {full_url}")
        else:
            print("❌ Ошибка: Знак не найден в таблице zodiac_signs")
    except Exception as e:
        print(f"❌ Произошла ошибка при работе с БД: {e}")


if __name__ == "__main__":
    test_logic()