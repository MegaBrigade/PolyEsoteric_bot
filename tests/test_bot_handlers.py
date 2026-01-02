from unittest.mock import MagicMock
import backend.bot.bot as bot_module

def create_mock_message(text):
    message = MagicMock()
    message.text = text
    message.chat.id = 123
    return message

def test_github_button_sends_message():
    mock_bot = MagicMock()
    bot_module.bot = mock_bot

    message = create_mock_message("Github")
    bot_module.handle_messages(message)

    mock_bot.send_message.assert_called_once()
    args, _ = mock_bot.send_message.call_args
    assert "github" in args[1].lower()

def test_random_number_message():
    mock_bot = MagicMock()
    bot_module.bot = mock_bot

    message = create_mock_message("Случайное число")
    bot_module.handle_messages(message)

    mock_bot.send_message.assert_called_once()
    args, _ = mock_bot.send_message.call_args
    assert "Ваше случайное число" in args[1]

def test_guides_message_sent():
    mock_bot = MagicMock()
    bot_module.bot = mock_bot

    message = create_mock_message("Книги о магии")
    bot_module.handle_messages(message)

    mock_bot.send_message.assert_called_once()
