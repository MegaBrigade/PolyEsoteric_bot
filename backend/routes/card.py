import random
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.database import get_supabase

router = APIRouter()

TAROT_CARDS = [
    "fool",
    "magician",
    "high_priestess",
    "empress",
    "emperor",
    "hierophant",
    "lovers",
    "chariot",
    "strength",
    "hermit",
    "fortune",
    "justice",
    "hanged_man",
    "death",
    "temperance",
    "devil",
    "tower",
    "star",
    "moon",
    "sun",
    "world",
]

class TarotResponse(BaseModel):
    description: str
    image_url: str

@router.get("/card", response_model=TarotResponse)
def get_card_of_the_day():
    card_name = random.choice(TAROT_CARDS)
    supabase = get_supabase()
    result = (
        supabase
        .table("tarot_cards")
        .select("description, file_path")
        .eq("name", card_name)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=404,
            detail="Карта не найдена в базе данных"
        )

    card = result.data

    return TarotResponse(
        description=card["description"],
        image_url=card["file_path"],
    )