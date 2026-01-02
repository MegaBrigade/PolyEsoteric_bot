from backend.bot.bot import (
    get_random_number,
    get_guides_message,
    get_github_message
)

def test_random_number_in_range():
    number = get_random_number()
    assert 1 <= number <= 100

def test_guides_message_contains_keywords():
    msg = get_guides_message()
    assert "Таро" in msg
    assert "Астрология" in msg

def test_github_message_contains_link():
    msg = get_github_message()
    assert "github.com" in msg.lower()
