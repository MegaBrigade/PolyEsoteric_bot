document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }

    const telegramUserId = tg?.initDataUnsafe?.user?.id || 'guest';

    const DAILY_CARD_KEY = `daily_tarot_card_${telegramUserId}`;
    
    const deckView = document.getElementById('deck-view');
    const resultView = document.getElementById('result-view');

    const returnButton = document.getElementById("return-btn");

    const deckCardBtn = document.getElementById("deck-card-btn");
    const cardsContainer = document.getElementById("cards-container");
    const titleElement = document.getElementById("title");

    const resultCardImage = document.getElementById('result-card-image');
    const resultMeaningText = document.getElementById('card-meaning-text');
    const resultCardDisplay = document.querySelector('.result-card-display');
    const panel = document.querySelector('.panel');

    let isDeckOpen = false;
    const API_URL = 'https://polyesoteric-bot.onrender.com/api/card';

    function getTodayKey() {
        const now = new Date();
        const year  = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day   = String(now.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
    
    function saveDailyCard(cardData) {
        localStorage.setItem(DAILY_CARD_KEY, JSON.stringify({
            date: getTodayKey(),
            data: cardData
        }));
    }

    function loadSavedDailyCard() {
        const raw = localStorage.getItem(DAILY_CARD_KEY);
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw);
            if (parsed.date === getTodayKey()) {
                return parsed.data;
            }
        } catch {
            return null;
        }
        return null;
    }

    function resetResultAnimations() {
        panel.classList.remove('slide-up', 'slide-down');
        resultCardDisplay.classList.remove('reveal', 'hide');
        resultMeaningText.classList.remove('fade-in');

        panel.style.opacity = '';
        panel.style.transform = '';
        resultCardDisplay.style.opacity = '';
        resultCardDisplay.style.transform = '';
        resultMeaningText.style.opacity = '';
        resultMeaningText.style.transform = '';
    }

    function renderCard(data, animated = true) {
        if (data.description) {
            resultMeaningText.textContent = data.description;
        } else if (data.text) {
            resultMeaningText.textContent = data.text;
        } else {
            resultMeaningText.textContent = "Карта скрыта туманом...";
        }

        if (data.image_url) {
            resultCardImage.setAttribute('href', data.image_url);
        }

        if (!animated) {
            panel.style.opacity = '1';
            resultCardDisplay.style.opacity = '1';
            resultMeaningText.style.opacity = '1';
            return;
        }

        setTimeout(() => {
            resultCardDisplay.classList.add('reveal');

            setTimeout(() => {
                panel.classList.add('slide-up');
            }, 200);

            setTimeout(() => {
                resultMeaningText.classList.add('fade-in');
            }, 500);
        }, 100);
    }

    async function loadDailyCard() {
        resetResultAnimations();

        panel.style.opacity = '0';
        resultCardDisplay.style.opacity = '0';
        resultMeaningText.style.opacity = '0';

        const savedCard = loadSavedDailyCard();

        if (savedCard) {
            renderCard(savedCard, false);
            return;
        }

        resultMeaningText.textContent = "Перемешиваем колоду...";
        resultCardImage.setAttribute('href', 'assets/card.svg');

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const data = await response.json();
            saveDailyCard(data);
            renderCard(data, true);

        } catch (error) {
            console.error(error);
            resultMeaningText.textContent = "Не удалось вытянуть карту. Попробуйте позже.";
        }
    }

    deckCardBtn.addEventListener("click", () => {
        if (!isDeckOpen) {
            cardsContainer.classList.add("open");
            titleElement.textContent = "Готов узнать, что ждет тебя сегодня?";
            isDeckOpen = true;
        } else {
            deckCardBtn.classList.add("zooming");

            setTimeout(() => {
                deckView.classList.add('hidden');
                resultView.classList.remove('hidden');
                loadDailyCard();
                deckCardBtn.classList.remove("zooming");
            }, 500);
        }
    });

    returnButton.addEventListener("click", () => {
        if (!resultView.classList.contains('hidden')) {
            resultView.classList.add('hidden');
            deckView.classList.remove('hidden');

            cardsContainer.classList.remove("open");
            titleElement.textContent = "Нажми, чтобы открыть карту!";
            isDeckOpen = false;

            resetResultAnimations();
            resultMeaningText.textContent = "Значение карты";
            resultCardImage.setAttribute('href', 'assets/card.svg');
        } else {
            window.location.href = "index.html";
        }
    });
});
