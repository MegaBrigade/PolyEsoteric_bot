const returnButton = document.getElementById("return");

returnButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

document.addEventListener('DOMContentLoaded', () => {
    const cardImage = document.querySelector('.card-svg image');
    const cardMeaning = document.querySelector('.card-meaning');

    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }

    const API_URL = 'https://polyesoteric-bot.onrender.com/api/card';

    async function loadDailyCard() {
        try {
            cardMeaning.textContent = "Перемешиваем колоду...";
            
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const data = await response.json();
            console.log('Получена карта:', data);

            if (data.description) {
                cardMeaning.textContent = data.description;
            } else if (data.text) {
                cardMeaning.textContent = data.text;
            } else {
                cardMeaning.textContent = "Карта выпала, но значение скрыто туманом...";
            }

            if (data.image_url) {
                cardImage.setAttribute('href', data.image_url);
            }

        } catch (error) {
            console.error('Ошибка:', error);
            cardMeaning.textContent = "Не удалось вытянуть карту. Попробуйте позже.";
        }
    }

    loadDailyCard();
});