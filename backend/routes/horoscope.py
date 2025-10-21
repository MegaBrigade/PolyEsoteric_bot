from fastapi import APIRouter
from pydantic import BaseModel
import datetime

router = APIRouter()

class ButtonRequest(BaseModel):
    user_id: int
    input: str = ""

class ButtonResponse(BaseModel):
    content: str

@router.post("/horoscope", response_model=ButtonResponse)
async def get_horoscope(data: ButtonRequest):
    today = datetime.date.today().strftime("%d.%m.%Y")
    content = f"Гороскоп на {today}: удача на вашей стороне"
    return {"content": content}
