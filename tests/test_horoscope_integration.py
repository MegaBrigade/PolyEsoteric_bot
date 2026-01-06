import pytest
from unittest.mock import Mock


class TestHoroscopeIntegration:

    def test_get_horoscope_success(
        self,
        test_client,
        mock_supabase_fixture,
        mock_requests_fixture,
        mock_translator_fixture,
    ):
        birth_date = "15-05-1990"

        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {
            "data": {"horoscope_data": "Today is a good day."}
        }
        mock_requests_fixture.get.return_value = mock_response

        mock_translator_fixture.translate.return_value = "Сегодня хороший день."

        execute_mock = Mock()
        execute_mock.data = [{"file_path": "/images/taurus.svg"}]

        current_chain = mock_supabase_fixture.table.return_value
        current_chain.execute.return_value = execute_mock

        response = test_client.post(
            "/api/horoscope",
            json={"birth_date": birth_date},
            headers={"Content-Type": "application/json"},
        )

        assert response.status_code == 200
        data = response.json()

        assert "prediction" in data
        assert "image_url" in data
        assert data["prediction"] == "Сегодня хороший день."
        assert data["image_url"] == "/images/taurus.svg"

    def test_get_horoscope_external_api_failure(
        self,
        test_client,
        mock_supabase_fixture,
        mock_requests_fixture,
    ):

        mock_response = Mock()
        mock_response.status_code = 500
        mock_response.raise_for_status.side_effect = Exception("API Error")
        mock_requests_fixture.get.return_value = mock_response

        execute_mock = Mock()
        execute_mock.data = [{"file_path": "/images/taurus.svg"}]

        current_chain = mock_supabase_fixture.table.return_value
        current_chain.execute.return_value = execute_mock

        response = test_client.post(
            "/api/horoscope",
            json={"birth_date": "15-05-1990"},
            headers={"Content-Type": "application/json"},
        )

        assert response.status_code == 502

    def test_get_horoscope_no_zodiac_image(
        self,
        test_client,
        mock_supabase_fixture,
        mock_requests_fixture,
        mock_translator_fixture,
    ):

        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"data": {"horoscope_data": "Test"}}
        mock_requests_fixture.get.return_value = mock_response
        mock_translator_fixture.translate.return_value = "Тест"

        execute_mock = Mock()
        execute_mock.data = []

        current_chain = mock_supabase_fixture.table.return_value
        current_chain.execute.return_value = execute_mock

        response = test_client.post(
            "/api/horoscope",
            json={"birth_date": "15-05-1990"},
            headers={"Content-Type": "application/json"},
        )

        assert response.status_code == 404

    def test_get_horoscope_missing_birth_date(self, test_client):

        response = test_client.post(
            "/api/horoscope",
            json={},
            headers={"Content-Type": "application/json"},
        )

        assert response.status_code == 422

    def test_ping_endpoint(self, test_client):

        response = test_client.get("/ping")

        assert response.status_code == 200
        assert response.json() == {"status": "ok"}
