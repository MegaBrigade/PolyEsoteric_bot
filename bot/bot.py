from dotenv import load_dotenv
import os
import telebot

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")

bot = telebot.TeleBot(BOT_TOKEN)  # ← добавлено!

@bot.message_handler(commands=['start'])
def start(message):
    markup = telebot.types.ReplyKeyboardMarkup(resize_keyboard=True)
    web_app = telebot.types.WebAppInfo(url="https://habr.com/ru/articles/886864/")
    btn = telebot.types.KeyboardButton(text="Открыть мини-приложение", web_app=web_app)
    markup.add(btn)
    bot.send_message(message.chat.id, "Привет! Нажми кнопку ниже", reply_markup=markup)

bot.infinity_polling()
