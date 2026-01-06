import os
import sys
import pytest
from unittest.mock import Mock, patch, MagicMock
from fastapi.testclient import TestClient
import asyncio

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

os.environ.update(
    {
        "BOT_TOKEN": "123456:mock_bot_token",
        "SUPABASE_URL": "http://localhost:54321",
        "SUPABASE_KEY": "mock-supabase-anon-key",
    }
)

def create_supabase_mock():
    mock_client = MagicMock()

    table_mock = MagicMock()
    table_mock.select.return_value = table_mock
    table_mock.eq.return_value = table_mock
    table_mock.limit.return_value = table_mock

    mock_client.table.return_value = table_mock
    return mock_client

with patch("telebot.TeleBot"), patch("main.run_bot"):
    from main import app


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="module")
def test_client():
    with TestClient(app) as client:
        yield client


@pytest.fixture(autouse=True)
def mock_all_dependencies():
    mock_supabase = create_supabase_mock()

    with (
        patch("database.get_supabase", return_value=mock_supabase),
        patch("routes.card.get_supabase", return_value=mock_supabase),
        patch("routes.horoscope.get_supabase", return_value=mock_supabase),
        patch("routes.horoscope.requests") as mock_requests,
        patch("routes.horoscope.GoogleTranslator") as mock_translator_class,
        patch("routes.card.random") as mock_random,
    ):
        mock_translator = Mock()
        mock_translator_class.return_value = mock_translator

        yield {
            "supabase": mock_supabase,
            "requests": mock_requests,
            "translator": mock_translator,
            "random": mock_random,
        }


@pytest.fixture
def mock_supabase_fixture(mock_all_dependencies):
    return mock_all_dependencies["supabase"]


@pytest.fixture
def mock_requests_fixture(mock_all_dependencies):
    return mock_all_dependencies["requests"]


@pytest.fixture
def mock_translator_fixture(mock_all_dependencies):
    return mock_all_dependencies["translator"]


@pytest.fixture
def mock_random_fixture(mock_all_dependencies):
    return mock_all_dependencies["random"]
