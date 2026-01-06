from unittest.mock import patch
from types import SimpleNamespace
from backend.routes.card import get_card_of_the_day


def test_get_card_success():
    fake_card = SimpleNamespace(
        data=[
            {
                "description": "Значение карты",
                "file_path": "https://example.com/card.png"
            }
        ]
    )

    with patch("backend.routes.card.random.choice") as mock_choice, \
         patch("backend.routes.card.get_supabase") as mock_supabase:

        mock_choice.return_value = "fool"

        mock_supabase.return_value \
            .table.return_value \
            .select.return_value \
            .eq.return_value \
            .limit.return_value \
            .execute.return_value = fake_card

        response = get_card_of_the_day()

        assert response.description == "Значение карты"
        assert response.image_url == "https://example.com/card.png"
