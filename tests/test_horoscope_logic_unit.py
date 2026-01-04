from datetime import date
from backend.routes.horoscope import get_zodiac_sign

def test_aries():
    assert get_zodiac_sign(date(2020, 3, 21)) == "aries"

def test_taurus():
    assert get_zodiac_sign(date(2020, 5, 1)) == "taurus"

def test_gemini():
    assert get_zodiac_sign(date(2020, 6, 15)) == "gemini"

def test_pisces():
    assert get_zodiac_sign(date(2020, 3, 20)) == "pisces"
