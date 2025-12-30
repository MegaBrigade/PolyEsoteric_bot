
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

async function getHoroscopeFromBackend(birthDate) {
    const [year, month, day] = birthDate.split('-');
    const formattedDate = `${day}-${month}-${year}`;
    
    console.log('Отправка запроса к бэкенду с датой:', formattedDate);
    
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

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json();
}

async function fetchHoroscopeWithLoading(birthDate) {
    const loader = document.getElementById('loader');
    const content = document.querySelector('.content');
    
    try {
        content.style.display = 'none';
        loader.style.display = 'flex';
        
        console.log('Начало получения гороскопа...');
        const horoscopeData = await getHoroscopeFromBackend(birthDate);

        await new Promise(resolve => setTimeout(resolve, 1000));
        loader.style.display = 'none';
        showResult(horoscopeData, birthDate);
        
    } catch (error) {
        console.error('Ошибка:', error);
        loader.style.display = 'none';
        
        showResult({
            prediction: 'Извините, произошла ошибка при загрузке гороскопа. Пожалуйста, попробуйте позже.',
            image_url: null
        }, birthDate);
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

            await fetchHoroscopeWithLoading(birthdateInput.value);
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

function showResult(horoscopeData, birthDate) {
    try {
        console.log('Получены данные для отображения:', horoscopeData);
        
        const zodiacSign = getZodiacSignByDate(birthDate);
        const horoscopeText = horoscopeData.prediction;
        const imageUrl = horoscopeData.image_url;
        
        const zodiacDescriptionElement = document.getElementById('zodiacDescription');
        const resultElement = document.getElementById('result');
        const zodiacNameElement = document.querySelector('.name-horoscope');
        const imageContainer = document.querySelector('.image svg image');
        
        if (zodiacDescriptionElement && resultElement) {
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
        const zodiacDescriptionElement = document.getElementById('zodiacDescription');
        const resultElement = document.getElementById('result');
        const zodiacNameElement = document.querySelector('.name-horoscope');
        
        if (zodiacDescriptionElement && resultElement) {
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

document.addEventListener('click', function(e) {
    if (e.target.closest('.arrow')) {
        console.log('Клик по стрелке через делегирование');
        goBackToIndex(e);
    }
});
