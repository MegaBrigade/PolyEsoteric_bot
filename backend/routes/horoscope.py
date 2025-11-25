from fastapi import APIRouter
from pydantic import BaseModel
from translate import Translator
import requests

router = APIRouter()

class ButtonRequest(BaseModel):
    user_id: int
    input: str

class ButtonResponse(BaseModel):
    content: str

from fastapi import APIRouter
import requests

router = APIRouter()

@router.get("/horoscope", response_model=dict)
async def get_horoscope():
    zodiac_name = "aries"
    url = f"https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign={zodiac_name}&day=TODAY"

    try:
        response = requests.get(url)
        response.raise_for_status()
        horoscope_data = response.json()

        horoscope_text = horoscope_data["data"].get("horoscope_data", "Гороскоп пока недоступен")
        translator = Translator(to_lang="ru")
        translated_text = translator.translate(horoscope_text)
        content = translated_text
    except requests.exceptions.HTTPError as http_err:
        content = f"Ошибка HTTP: {http_err}"
    except requests.exceptions.RequestException as req_err:
        content = f"Ошибка запроса: {req_err}"
    except Exception as e:
        content = f"Ошибка при получении гороскопа: {str(e)}"

    return {"content": content}

