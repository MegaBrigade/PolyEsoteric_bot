import sys
import os
import random

# Добавляем путь, чтобы Python видел database.py из папки backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import get_supabase

# Константы для формирования ссылки
PROJECT_ID = "wjgwfemvxxrgnyfutvqf"
BASE_STORAGE_URL = f"https://{PROJECT_ID}.supabase.co/storage/v1/object/public/assets/"


def test_card_logic():
    print("--- Тестирование получения карты дня ---")

    try:
        supabase = get_supabase()

        # 1. Проверяем, что в таблице вообще есть данные
        result = supabase.table("tarot_cards").select("*").execute()

        if not result.data or len(result.data) == 0:
            print("❌ Ошибка: Таблица tarot_cards пуста!")
            return

        # 2. Имитируем логику случайного выбора
        random_card = random.choice(result.data)
        print(f"✅ Случайно выбрана карта: {random_card['name']}")

        # 3. Проверяем формирование ссылки
        file_name = random_card.get("file_path")
        if not file_name:
            print("❌ Ошибка: У карты отсутствует file_path")
            return

        full_url = f"{BASE_STORAGE_URL}{file_name}"
        print(f"✅ Описание: {random_card.get('description', 'Нет описания')[:50]}...")
        print(f"✅ Имя файла: {file_name}")
        print(f"✅ Полная ссылка: {full_url}")

    except Exception as e:
        print(f"❌ Произошла ошибка: {e}")


if __name__ == "__main__":
    test_card_logic()