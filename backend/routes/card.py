from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter()

class CardRequest(BaseModel):
    user_id: int

class CardResponse(BaseModel):
    name: str
    meaning: str

@router.post("/card", response_model=CardResponse)
async def get_random_card(data: CardRequest):
    url = "https://tarotapi.dev/api/v1/random"

    try:
        response = requests.get(url)
        response.raise_for_status()
        card_data = response.json()
        name = card_data.get("name", "Неизвестная карта")
        meaning = card_data.get("meaning_up", "Описание недоступно")
    except Exception as e:
        name = "Ошибка"
        meaning = f"Не удалось получить карту: {str(e)}"

    return {"name": name, "meaning": meaning}
