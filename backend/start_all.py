import threading
import uvicorn
from main import app
from bot.bot import bot

def run_fastapi():
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

def run_bot():
    print("Telegram бот запускается...")
    bot.infinity_polling()

def run_bot_in_thread():
    bot_thread = threading.Thread(target=run_bot, daemon=True)
    bot_thread.start()
    return bot_thread

if __name__ == "__main__":
    print("Запуск сервера и бота...")
    bot_thread = run_bot_in_thread()
    run_fastapi()