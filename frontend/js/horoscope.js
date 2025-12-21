const BACKEND_URL = 'https://poly-esoteric-backend.onrender.com';
function goBackToIndex(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    console.log('Нажата стрелка, переход на index.html');
    window.location.href = "index.html";
}

function setupArrowListeners() {
    const arrows = document.querySelectorAll('.arrow');
    console.log('Найдено стрелок:', arrows.length);
    
    arrows.forEach(arrow => {
        arrow.removeEventListener('click', goBackToIndex);
        arrow.addEventListener('click', goBackToIndex);
        console.log('Обработчик добавлен для стрелки');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, настраиваем стрелки...');

    setupArrowListeners();
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                setupArrowListeners();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    initializePage();
});

async function getHoroscopeFromBackend(birthDate, userId) {
    try {
        console.log('Отправка запроса к бэкенду...');
    
        const response = await fetch(`${BACKEND_URL}/api/horoscope`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('Статус ответа:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Данные получены от бэкенду:', data);

        const zodiacSign = 'aries';
        
        return {
            zodiac_sign: zodiacSign,
            horoscope_text: data.content,
            slide_id: `${zodiacSign}_daily`
        };
        
    } catch (error) {
        console.error('Ошибка при запросе к бэкенду:', error);

        const zodiacSign = 'aries';
        const horoscopeText = "Сегодня у Овнов прекрасный день! Энергия Марса наполняет вас силой. Идеальное время для новых начинаний.";
        
        return {
            zodiac_sign: zodiacSign,
            horoscope_text: horoscopeText,
            slide_id: `${zodiacSign}_daily`
        };
    }
}

async function fetchHoroscopeWithLoading(birthDate, userId) {
    const loader = document.getElementById('loader');
    const content = document.querySelector('.content');
    
    try {
        content.style.display = 'none';
        loader.style.display = 'flex';
        
        console.log('Начало получения гороскопа...');
        const horoscopeData = await getHoroscopeFromBackend(birthDate, userId);

        await new Promise(resolve => setTimeout(resolve, 1000));
        loader.style.display = 'none';
        showResult(horoscopeData);
        
    } catch (error) {
        console.error('Ошибка:', error);
        loader.style.display = 'none';
        
        showResult({
            zodiac_sign: 'aries',
            horoscope_text: 'Извините, произошла ошибка при загрузке гороскопа. Пожалуйста, попробуйте позже.',
            slide_id: 'error'
        });
    }
}

function initializePage() {
    const form = document.getElementById('birthdayForm');
    const birthdateInput = document.getElementById('birthdateInput');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!birthdateInput.value) {
                alert('Пожалуйста, введите дату рождения');
                return;
            }

            const userInfo = getTelegramUserInfo();
            await fetchHoroscopeWithLoading(birthdateInput.value, userInfo.userId);
        });

        birthdateInput.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        });

        const today = new Date().toISOString().split('T')[0];
        birthdateInput.max = today;
    }
    
    initializeTelegram();
    console.log('Страница гороскопа загружена и готова');
}

function showResult(horoscopeData) {
    try {
        console.log('Получены данные для отображения:', horoscopeData);
        
        const zodiacSign = horoscopeData.zodiac_sign;
        const horoscopeText = horoscopeData.horoscope_text;
        
        const zodiacSignElement = document.getElementById('zodiacSign');
        const zodiacDescriptionElement = document.getElementById('zodiacDescription');
        const resultElement = document.getElementById('result');
        
        if (zodiacSignElement && zodiacDescriptionElement && resultElement) {
            zodiacDescriptionElement.textContent = horoscopeText;
            resultElement.style.display = 'flex';
            setTimeout(setupArrowListeners, 100);
        }
        
    } catch (error) {
        console.error('Ошибка отображения:', error);
        showFallbackResult();
    }
}


function getZodiacSignByDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    return 'unknown';
}

function getZodiacSignName(englishName) {
    const signNames = {
        'aries': 'Овен',
        'taurus': 'Телец',
    };
    return signNames[englishName] || 'Неизвестный знак';
}

function showFallbackResult() {
    try {
        const zodiacSignElement = document.getElementById('zodiacSign');
        const zodiacDescriptionElement = document.getElementById('zodiacDescription');
        const resultElement = document.getElementById('result');
        
        if (zodiacSignElement && zodiacDescriptionElement && resultElement) {
            zodiacSignElement.textContent = '';
            zodiacDescriptionElement.textContent = 'Сегодня звезды благоприятствуют новым начинаниям. Смело беритесь за сложные задачи!';
            resultElement.style.display = 'flex';
        
            setTimeout(setupArrowListeners, 100);
        }
    } catch (error) {
        console.error('Ошибка fallback:', error);
    }
}

function goBack() {
    const resultElement = document.getElementById('result');
    const loaderElement = document.getElementById('loader');
    const contentElement = document.querySelector('.content');
    
    if (resultElement && resultElement.style.display === 'flex') {
        resultElement.style.display = 'none';
        if (contentElement) contentElement.style.display = 'block';
    } else if (loaderElement && loaderElement.style.display === 'flex') {
        loaderElement.style.display = 'none';
        if (contentElement) contentElement.style.display = 'block';
    } else {
        goBackToIndex();
    }
}

function initializeTelegram() {
    if (window.Telegram && Telegram.WebApp) {
        console.log('Telegram Web App initialized');
        Telegram.WebApp.expand();
        
        try {
            Telegram.WebApp.BackButton.show();
            Telegram.WebApp.BackButton.onClick(() => {
                window.location.href = 'index.html';
            });
        } catch (error) {
            console.log('BackButton не поддерживается');
        }
    }
}

function getTelegramUserInfo() {
    try {
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
            const user = Telegram.WebApp.initDataUnsafe.user;
            if (user) {
                return {
                    username: user.username,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    userId: user.id,
                    exists: true
                };
            }
        }
    } catch (error) {
        console.error('Error getting Telegram user info:', error);
    }

    return { 
        exists: false,
        firstName: 'Странник',
        username: 'guest',
        userId: Math.floor(Math.random() * 1000000)
    };
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.arrow')) {
        console.log('Клик по стрелке через делегирование');
        goBackToIndex(e);
    }
});