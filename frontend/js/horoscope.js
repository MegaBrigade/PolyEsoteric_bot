
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
        
        // Преобразуем дату из формата YYYY-MM-DD в DD-MM-YYYY
        const [year, month, day] = birthDate.split('-');
        const formattedDate = `${day}-${month}-${year}`;
        
        console.log('Форматированная дата для бэкенда:', formattedDate);
        
        const response = await fetch(`${BACKEND_URL}/api/horoscope`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                birth_date: formattedDate
            })
        });

        console.log('Статус ответа:', response.status);
        
        if (response.status === 404) {
            throw new Error('404: Картинка знака зодиака не найдена');
        }
        
        if (response.status === 502) {
            throw new Error('502: Сервис гороскопов временно недоступен');
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Данные получены от бэкенда:', data);

        const zodiacSign = getZodiacSignByDate(birthDate);
        
        return {
            zodiac_sign: zodiacSign,
            horoscope_text: data.prediction,
            slide_id: `${zodiacSign}_daily`,
            image_url: data.image_url
        };
        
    } catch (error) {
        console.error('Ошибка при запросу к бэкенду:', error);
        throw error;
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
        let errorMessage = 'Извините, произошла ошибка при загрузке гороскопа. Пожалуйста, попробуйте позже.';
        let zodiacSign = 'unknown';
        
        if (error.message.includes('404')) {
            errorMessage = 'Знак зодиака не найден в базе данных. Пожалуйста, проверьте введенную дату.';
            zodiacSign = 'error';
        } else if (error.message.includes('502')) {
            errorMessage = 'Сервис гороскопов временно недоступен. Попробуйте позже.';
            zodiacSign = 'error';
        }
        
        showResult({
            zodiac_sign: zodiacSign,
            horoscope_text: errorMessage,
            slide_id: 'error',
            image_url: null
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
        const imageUrl = horoscopeData.image_url;
        
        const zodiacSignElement = document.getElementById('zodiacSign');
        const zodiacDescriptionElement = document.getElementById('zodiacDescription');
        const resultElement = document.getElementById('result');
        const zodiacNameElement = document.querySelector('.name-horoscope');
        const imageContainer = document.querySelector('.image svg image');
        
        if (zodiacSignElement && zodiacDescriptionElement && resultElement) {
            zodiacDescriptionElement.textContent = horoscopeText;
            if (zodiacNameElement) {
                zodiacNameElement.textContent = getZodiacSignName(zodiacSign);
            }
            if (imageUrl && imageContainer) {
                imageContainer.setAttribute('href', imageUrl);
                imageContainer.setAttribute('xlink:href', imageUrl);
            }
            
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
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
    
    return 'unknown';
}

function getZodiacSignName(englishName) {
    const signNames = {
        'aries': 'Овен',
        'taurus': 'Телец',
        'gemini': 'Близнецы',
        'cancer': 'Рак',
        'leo': 'Лев',
        'virgo': 'Дева',
        'libra': 'Весы',
        'scorpio': 'Скорпион',
        'sagittarius': 'Стрелец',
        'capricorn': 'Козерог',
        'aquarius': 'Водолей',
        'pisces': 'Рыбы',
        'unknown': 'Неизвестный знак',
        'error': 'Ошибка'
    };
    return signNames[englishName] || 'Неизвестный знак';
}

function showFallbackResult() {
    try {
        const zodiacSignElement = document.getElementById('zodiacSign');
        const zodiacDescriptionElement = document.getElementById('zodiacDescription');
        const resultElement = document.getElementById('result');
        const zodiacNameElement = document.querySelector('.name-horoscope');
        
        if (zodiacSignElement && zodiacDescriptionElement && resultElement) {
            zodiacDescriptionElement.textContent = 'Извините, произошла ошибка при загрузке гороскопа. Пожалуйста, попробуйте позже.';
            
            if (zodiacNameElement) {
                zodiacNameElement.textContent = 'Ошибка';
            }
            
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
