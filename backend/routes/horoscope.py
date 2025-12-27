from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import requests

from backend.database import get_supabase

router = APIRouter()

class HoroscopeRequest(BaseModel):
    birth_date: str

class HoroscopeResponse(BaseModel):
    prediction: str
    image_url: str

def get_zodiac_sign(birth_date):
    day = birth_date.day
    month = birth_date.month
    if (month == 3 and day >= 21) or (month == 4 and day <= 19):
        return "aries"
    elif (month == 4 and day >= 20) or (month == 5 and day <= 20):
        return "taurus"
    elif (month == 5 and day >= 21) or (month == 6 and day <= 20):
        return "gemini"
    elif (month == 6 and day >= 21) or (month == 7 and day <= 22):
        return "cancer"
    elif (month == 7 and day >= 23) or (month == 8 and day <= 22):
        return "leo"
    elif (month == 8 and day >= 23) or (month == 9 and day <= 22):
        return "virgo"
    elif (month == 9 and day >= 23) or (month == 10 and day <= 22):
        return "libra"
    elif (month == 10 and day >= 23) or (month == 11 and day <= 21):
        return "scorpio"
    elif (month == 11 and day >= 22) or (month == 12 and day <= 21):
        return "sagittarius"
    elif (month == 12 and day >= 22) or (month == 1 and day <= 19):
        return "capricorn"
    elif (month == 1 and day >= 20) or (month == 2 and day <= 18):
        return "aquarius"
    else:
        return "pisces"

@router.post("/horoscope", response_model=HoroscopeResponse)
def get_horoscope(data: HoroscopeRequest):
    birth_date = datetime.strptime(data.birth_date, "%d-%m-%Y").date()
    zodiac = get_zodiac_sign(birth_date)
    api_url = f"https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign={zodiac}&day=TODAY"

    try:
        response = requests.get(api_url, timeout=10)
        response.raise_for_status()
        horoscope_data = response.json()
        prediction = horoscope_data["data"].get("horoscope_data", "Предсказание недоступно")
    except Exception:
        raise HTTPException(status_code=502, detail="Ошибка при получении гороскопа")

    supabase = get_supabase()
    result = supabase.table("zodiac_signs").select("file_path").eq("name", zodiac).single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Изображение знака не найдено")
    image_url = result.data["file_path"]

    return HoroscopeResponse(prediction=prediction, image_url=image_url)