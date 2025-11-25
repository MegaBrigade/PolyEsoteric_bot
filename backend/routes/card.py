from fastapi import APIRouter
from pydantic import BaseModel
import requests

router = APIRouter()

class TarotResponse(BaseModel):
    name: str
    description: str
    image_url: str

@router.post("/card", response_model=TarotResponse)
async def get_random_tarot():
    url = "https://tarot-api.dev/api/v1/random"
    try:
        response = requests.get(url)
        response.raise_for_status()

        card_data = response.json()

        name = card_data.get("name", "Неизвестная карта")
        description = card_data.get("description", "Описание недоступно")
        image_url = card_data.get("image", "")

        return TarotResponse(name=name, description=description, image_url=image_url)

    except requests.exceptions.RequestException as e:
        return {"message": f"Ошибка при получении данных с API: {str(e)}"}
