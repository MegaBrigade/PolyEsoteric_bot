from dotenv import load_dotenv
import os
import telebot

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
bot = telebot.TeleBot(BOT_TOKEN)

welcom_msg = "Приветствую, странник!✨\n" \
             "Ты ступил на путь тайн. Этот бот — твой проводник в мире карт Таро, " \
             "звёздных предсказаний и древних знаний.\n" \
             "Нажми на кнопку внизу, чтобы начать путешествие. Пусть нити судьбы приведут тебя к ответам 🔮\n\n" \
             "А если хочешь заглянуть в самое сердце магии — наш GitHub всегда открыт для искателей 🌌"

@bot.message_handler(commands=['start'])
def start(message):
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    web_app = telebot.types.WebAppInfo(url="https://poly-esoteric-bot.vercel.app/")
    btn = telebot.types.KeyboardButton(text="Открыть мини-приложение", web_app=web_app)
    markup.add(btn)
    bot.send_message(message.chat.id, welcom_msg, reply_markup=markup)

if __name__ == "__main__":
    print("Бот запущен...")
    bot.infinity_polling()
