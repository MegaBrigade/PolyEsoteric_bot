from unittest.mock import patch
from types import SimpleNamespace
from backend.routes.horoscope import get_horoscope, HoroscopeRequest


def test_get_horoscope_success():
    fake_api_response = {
        "data": {
            "horoscope_data": "Today is a good day"
        }
    }

    fake_supabase_response = SimpleNamespace(
        data=[
            {"file_path": "https://example.com/aries.png"}
        ]
    )

    with patch("backend.routes.horoscope.requests.get") as mock_get, \
         patch("backend.routes.horoscope.GoogleTranslator") as mock_translator, \
         patch("backend.routes.horoscope.get_supabase") as mock_supabase:

        mock_get.return_value.json.return_value = fake_api_response
        mock_get.return_value.raise_for_status.return_value = None

        mock_translator.return_value.translate.return_value = "Сегодня хороший день"

        mock_supabase.return_value \
            .table.return_value \
            .select.return_value \
            .eq.return_value \
            .limit.return_value \
            .execute.return_value = fake_supabase_response

        data = HoroscopeRequest(birth_date="21-03-2000")
        response = get_horoscope(data)

        assert response.prediction == "Сегодня хороший день"
        assert response.image_url == "https://example.com/aries.png"
