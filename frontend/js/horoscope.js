const BACKEND_URL = 'https://poly-esoteric-backend.onrender.com';
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
        console.log('Данные получены от бэкенда:', data);

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

async function sendUserDataToBackend(userData) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Данные пользователя отправлены:', result);
        return result;
        
    } catch (error) {
        console.error('Ошибка отправки данных:', error);
        throw error;
    }
}

class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    async get(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`);
        if (!response.ok) throw new Error(`GET failed: ${response.status}`);
        return response.json();
    }

    async post(endpoint, data) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`POST failed: ${response.status}`);
        return response.json();
    }
    async put(endpoint, data) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`PUT failed: ${response.status}`);
        return response.json();
    }
    async delete(endpoint) {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`DELETE failed: ${response.status}`);
        return response.json();
    }
}
const api = new ApiClient(BACKEND_URL);
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

function showResult(horoscopeData) {
    try {
        console.log('Получены данные для отображения:', horoscopeData);
        
        const zodiacSign = horoscopeData.zodiac_sign;
        const horoscopeText = horoscopeData.horoscope_text;
        
        const zodiacSignElement = document.getElementById('zodiacSign');
        const zodiacDescriptionElement = document.getElementById('zodiacDescription');
        const resultElement = document.getElementById('result');
        
        if (zodiacSignElement && zodiacDescriptionElement && resultElement) {
            zodiacSignElement.textContent = getZodiacSignName(zodiacSign);
            zodiacDescriptionElement.textContent = horoscopeText;
            resultElement.style.display = 'flex';
            
            const resultTitle = document.querySelector('.result-title');
            if (resultTitle) {
                resultTitle.textContent = 'Ваш гороскоп на сегодня';
            }
        }
        
    } catch (error) {
        console.error('Ошибка отображения:', error);
        showFallbackResult();
    }
}

function showFallbackResult() {
    try {
        const zodiacSignElement = document.getElementById('zodiacSign');
        const zodiacDescriptionElement = document.getElementById('zodiacDescription');
        const resultElement = document.getElementById('result');
        
        if (zodiacSignElement && zodiacDescriptionElement && resultElement) {
            zodiacSignElement.textContent = 'Овен';
            zodiacDescriptionElement.textContent = 'Сегодня звезды благоприятствуют новым начинаниям. Смело беритесь за сложные задачи!';
            resultElement.style.display = 'flex';
        }
    } catch (error) {
        console.error('Ошибка fallback:', error);
    }
}

function goBack() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('loader').style.display = 'none';
    document.querySelector('.content').style.display = 'block';
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
            createCustomBackButton();
        }
    }
}

function createCustomBackButton() {
    const existingBackButton = document.querySelector('.custom-back-button');
    if (!existingBackButton) {
        const backButton = document.createElement('button');
        backButton.className = 'custom-back-button';
        backButton.innerHTML = '← Назад';
        backButton.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: rgba(255,255,255,0.2);
            border: 2px solid #CFE7FF;
            color: #CFE7FF;
            padding: 10px 15px;
            border-radius: 20px;
            font-family: "Geologica", sans-serif;
            font-weight: 700;
            cursor: pointer;
            backdrop-filter: blur(10px);
        `;
        backButton.onclick = () => {
            window.location.href = 'index.html';
        };
        document.body.appendChild(backButton);
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
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('birthdayForm');
    const birthdateInput = document.getElementById('birthdateInput');
    const returnButton = document.getElementById("return");
    
    initializeTelegram();
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

    returnButton.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = "index.html";
    });

    const today = new Date().toISOString().split('T')[0];
    birthdateInput.max = today;
    
    console.log('Страница гороскопа загружена и готова');
});

const ApiUtils = {

    checkResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    },

    handleError(error) {
        console.error('Network error:', error);
        throw error;
    },

    fetchWithTimeout(url, options = {}, timeout = 5000) {
        return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    }
};