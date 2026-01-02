from dotenv import load_dotenv
import os
import telebot
import random

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
bot = telebot.TeleBot(BOT_TOKEN)

welcom_message = """
Приветствую, странник!✨
Ты ступил на путь тайн. Этот бот — твой проводник в мире карт Таро, звёздных предсказаний и древних знаний.
Нажми на кнопку внизу, чтобы начать путешествие. Пусть нити судьбы приведут тебя к ответам 🔮
"""

books_message = """
⭐️Справочники по эзотерике и магии:

    📎 <u>Андрей Костенко</u>
Таро Уэйта как система. Теория и практика
    📎 <u>Эдуард Леванов</u>
Таро для начинающих. Практический курс
    📎 <u>Александр Александров</u>
Большая книга нумерологии. Цифровой анализ
    📎 <u>Александр Колесников</u>
Астрология. Самоучитель
"""

def get_random_number():
    return random.randint(1, 100)

def get_github_message():
    return "Наш [GitHub](https://github.com/MegaBrigade/PolyEsoteric_bot/tree/main) всегда открыт для искателей 🌌"

def get_guides_message():
    return books_message

@bot.message_handler(commands=['start'])
def start(message):
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=3)

    markup.add(
        telebot.types.KeyboardButton(text="Github"),
        telebot.types.KeyboardButton(text="Случайное число"),
        telebot.types.KeyboardButton(text="Книги о магии"),
    )

    bot.send_message(
        message.chat.id,
        welcom_message,
        reply_markup=markup,
        parse_mode='HTML'
    )

@bot.message_handler(func=lambda message: True)
def handle_messages(message):
    chat_id = message.chat.id

    if message.text == "Github":
        bot.send_message(
            chat_id,
            get_github_message(),
            parse_mode='Markdown',
            disable_web_page_preview=True
        )

    elif message.text == "Случайное число":
        number = get_random_number()
        bot.send_message(chat_id, f"Ваше случайное число: {number}")

    elif message.text == "Книги о магии":
        bot.send_message(
            chat_id,
            get_guides_message(),
            parse_mode='HTML'
        )

def run_bot():
    print("Telegram bot started")
    bot.infinity_polling(skip_pending=True)
