from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

cards = ["Колесо фортуны", "Солнце", "Луна", "Маг"]

class ButtonRequest(BaseModel):
    user_id: int

class ButtonResponse(BaseModel):
    content: str

@router.post("/card", response_model=ButtonResponse)
async def get_card(data: ButtonRequest):
    card = random.choice(cards)
    return {"content": f"Ваша карта дня: {card}"}
