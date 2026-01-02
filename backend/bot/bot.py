from dotenv import load_dotenv
import os
import telebot
import random

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
bot = telebot.TeleBot(BOT_TOKEN)

welcom_msg = """
Приветствую, странник!✨
Ты ступил на путь тайн. Этот бот — твой проводник в мире карт Таро, звёздных предсказаний и древних знаний.
Нажми на кнопку внизу, чтобы начать путешествие. Пусть нити судьбы приведут тебя к ответам 🔮
"""

@bot.message_handler(commands=['start'])
def start(message):
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True, row_width=3)

    btn_link = telebot.types.KeyboardButton(text="Github")
    btn_random = telebot.types.KeyboardButton(text="Случайное число")
    btn_guide = telebot.types.KeyboardButton(text="Книги о магии")

    markup.add(btn_link, btn_random, btn_guide)

    bot.send_message(message.chat.id, welcom_msg, reply_markup=markup, parse_mode='HTML')

@bot.message_handler(func=lambda message: True)
def handle_messages(message):
    if message.text == "Github":
        bot.send_message(message.chat.id,
                         "Наш [GitHub](https://github.com/MegaBrigade/PolyEsoteric_bot/tree/main) всегда открыт для искателей 🌌",
                         parse_mode='Markdown', disable_web_page_preview=True)

    elif message.text == "Случайное число":
        random_num = random.randint(1, 100)
        bot.send_message(message.chat.id, f"Ваше случайное число: {random_num}")

    elif message.text == "Книги о магии":
        guides_msg = """
⭐️Справочники по эзотерике и магии:

    📎 <u>Андрей Костенко</u>
Таро Уэйта как система. Теория и практика
    📎 <u>Эдуард Леванов</u>
Таро для начинающих. Практический курс
    📎 <u>Александр Александров</u>
Большая книга нумерологии. Цифровой анализ
    📎 <u>Александр Колесников</u>
Астрология. Самоучитель"""

        bot.send_message(message.chat.id, guides_msg, parse_mode='HTML')

def run_bot():
    print("Telegram bot started")
    bot.infinity_polling(skip_pending=True)