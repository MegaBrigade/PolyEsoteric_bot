from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter()

class ButtonRequest(BaseModel):
    user_id: int
    input: str

class ButtonResponse(BaseModel):
    content: str

@router.get("/horoscope", response_model=ButtonResponse)
async def get_horoscope(data: ButtonRequest):

    zodiac_name = "aries"
    url = f"https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign={zodiac_name}&day=TODAY"

    try:
        response = requests.get(url)
        response.raise_for_status()
        horoscope_data = response.json()
        horoscope_text = horoscope_data.get("horoscope", "Гороскоп пока недоступен")
        content = f"Ваш гороскоп на сегодня:\n{horoscope_text}"
    except Exception as e:
        content = f"Ошибка при получении гороскопа: {str(e)}"

    return {"content": content}
