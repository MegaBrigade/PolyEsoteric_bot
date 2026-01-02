document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
        tg.ready();
        tg.expand();
    }

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

    function resetResultAnimations() {
        panel.classList.remove('slide-up', 'slide-down');
        resultCardDisplay.classList.remove('reveal', 'hide');
        resultMeaningText.classList.remove('fade-in');
        
        panel.style.transform = '';
        panel.style.opacity = '';
        resultCardDisplay.style.transform = '';
        resultCardDisplay.style.opacity = '';
        resultMeaningText.style.opacity = '';
        resultMeaningText.style.transform = '';
    }

    async function loadDailyCard() {
        try {
            resultMeaningText.textContent = "Перемешиваем колоду...";
            resultCardImage.setAttribute('href', 'assets/card.svg');
            
            resetResultAnimations();
            
            panel.style.opacity = '0';
            resultCardDisplay.style.opacity = '0';
            resultMeaningText.style.opacity = '0';
            
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }

            const data = await response.json();
            console.log('Получена карта:', data);

            if (data.description) {
                resultMeaningText.textContent = data.description;
            } else if (data.text) {
                resultMeaningText.textContent = data.text;
            } else {
                resultMeaningText.textContent = "Карта выпала, но значение скрыто туманом...";
            }
            
            if (data.image_url) {
                resultCardImage.setAttribute('href', data.image_url);
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

        } catch (error) {
            console.error('Ошибка:', error);
            resultMeaningText.textContent = "Не удалось вытянуть карту. Попробуйте позже.";
            
            setTimeout(() => {
                resultCardDisplay.classList.add('reveal');
                setTimeout(() => {
                    panel.classList.add('slide-up');
                    setTimeout(() => {
                        resultMeaningText.classList.add('fade-in');
                    }, 300);
                }, 200);
            }, 100);
        }
    }

    deckCardBtn.addEventListener("click", async () => {
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
        panel.classList.remove('slide-up');
        panel.classList.add('slide-down');
        
        resultCardDisplay.classList.remove('reveal');
        resultCardDisplay.classList.add('hide');
        
        resultMeaningText.classList.remove('fade-in');
        
        setTimeout(() => {
            resultView.classList.add('hidden');
            deckView.classList.remove('hidden');
            
            cardsContainer.classList.remove("open");
            titleElement.textContent = "Нажми, чтобы открыть карту!";
            isDeckOpen = false;
            
            resetResultAnimations();
            
            resultMeaningText.textContent = "Значение карты";
            resultCardImage.setAttribute('href', 'assets/card.svg');
        }, 400);
        
      } else {
          window.location.href = "index.html";
      }
    });
});