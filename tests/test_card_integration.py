import pytest
from unittest.mock import Mock


class TestCardIntegration:

    def test_get_card_of_the_day_success(
        self, test_client, mock_supabase_fixture, mock_random_fixture
    ):

        selected_card = "magician"
        mock_random_fixture.choice.return_value = selected_card

        execute_mock = Mock()
        execute_mock.data = [
            {
                "description": "Маг символизирует волю и творческую силу.",
                "file_path": "/cards/magician.svg",
            }
        ]

        current_chain = mock_supabase_fixture.table.return_value
        current_chain.execute.return_value = execute_mock

        response = test_client.get("/api/card")

        assert response.status_code == 200
        data = response.json()

        assert data["description"] == "Маг символизирует волю и творческую силу."
        assert data["image_url"] == "/cards/magician.svg"

        mock_random_fixture.choice.assert_called_once()
        mock_supabase_fixture.table.assert_called_once_with("tarot_cards")

    def test_get_card_of_the_day_not_found(
        self, test_client, mock_supabase_fixture, mock_random_fixture
    ):

        selected_card = "magician"
        mock_random_fixture.choice.return_value = selected_card

        execute_mock = Mock()
        execute_mock.data = []

        current_chain = mock_supabase_fixture.table.return_value
        current_chain.execute.return_value = execute_mock

        response = test_client.get("/api/card")

        assert response.status_code == 404
        assert "Карта не найдена" in response.json()["detail"]
