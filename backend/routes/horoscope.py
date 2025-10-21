from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter()

class ButtonRequest(BaseModel):
    user_id: int
    input: str

class ButtonResponse(BaseModel):
    content: str

@router.post("/horoscope", response_model=ButtonResponse)
async def get_horoscope(data: ButtonRequest):
    zodiac_name = data.input.lower()
    url = f"https://horoscope-app-api.vercel.app/daily?sign={zodiac_name}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        horoscope_data = response.json()
        horoscope_text = horoscope_data.get("horoscope", "Гороскоп пока недоступен")
        content = f"Ваш гороскоп на сегодня:\n{horoscope_text}"
    except Exception as e:
        content = f"Ошибка при получении гороскопа: {str(e)}"

    return {"content": content}
