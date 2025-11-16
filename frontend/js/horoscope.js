async function getHoroscopeFromBackend(birthDate, userId) {
    try {
        const response = await fetch('https://your-backend-url.onrender.com/api/horoscope', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                birth_date: birthDate
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching horoscope:', error);
        throw error;
    }
}

function showResult(horoscopeData) {
    const zodiacSign = horoscopeData.zodiac_sign;
    const horoscopeText = horoscopeData.horoscope_text;
    const slideId = horoscopeData.slide_id;
    document.getElementById('zodiacSign').textContent = getZodiacSignName(zodiacSign);
    document.getElementById('zodiacDescription').textContent = horoscopeText;
    document.getElementById('result').style.display = 'flex';
    const resultTitle = document.querySelector('.result-title');
    if (resultTitle) {
        resultTitle.textContent = 'Вывод результата';
    }
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
        'unknown': 'Неизвестно'
    };
    return signNames[englishName] || 'Неизвестный знак';
}

function goBack() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('loader').style.display = 'none';
    document.querySelector('.content').style.display = 'block';
}

function initializeTelegram() {
    if (window.Telegram && Telegram.WebApp) {
        console.log('Telegram Web App initialized in horoscope');
        Telegram.WebApp.expand();
        Telegram.WebApp.BackButton.show();
        Telegram.WebApp.BackButton.onClick(() => {
            window.location.href = 'index.html';
        });
    }
}

function getTelegramUserInfo() {
    try {
        if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
            const user = Telegram.WebApp.initDataUnsafe.user;
            
            if (user) {
                console.log('Telegram User Data:', user);
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

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('birthdayForm');
    const loader = document.getElementById('loader');
    const content = document.querySelector('.content');
    const birthdateInput = document.getElementById('birthdateInput');
    initializeTelegram();
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await processForm();
    });
    birthdateInput.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            await processForm();
        }
    });

    async function processForm() {
        if (!birthdateInput.value) {
            alert('Пожалуйста, введите дату рождения');
            return;
        }
        content.style.display = 'none';
        loader.style.display = 'flex';

        try {
            const userInfo = getTelegramUserInfo();
            const userId = userInfo.userId || Math.floor(Math.random() * 1000000);
            const horoscopeData = await getHoroscopeFromBackend(birthdateInput.value, userId);
            
            loader.style.display = 'none';
            showResult(horoscopeData);
            
        } catch (error) {
            console.error('Error:', error);
            loader.style.display = 'none';
            
            showResult({
                zodiac_sign: 'error',
                horoscope_text: 'Произошла ошибка при получении гороскопа. Пожалуйста, попробуйте позже.',
                slide_id: 'zodiac_error'
            });
        }
    }

    const today = new Date().toISOString().split('T')[0];
    birthdateInput.max = today;
    
    console.log('Страница гороскопа загружена');
});