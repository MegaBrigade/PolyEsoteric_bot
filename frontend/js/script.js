const button = document.getElementById("buttonG");
const response = document.getElementById("title");

// === ТЕСТОВЫЕ ДАННЫЕ ===
if (!window.Telegram) {
    console.log('🔧 Загружаем тестовые данные Telegram...');
    window.Telegram = {
        WebApp: {
            initData: 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22%D0%98%D0%B2%D0%B0%D0%BD%22%2C%22last_name%22%3A%22%D0%9F%D0%B5%D1%82%D1%80%D0%BE%D0%B2%22%2C%22username%22%3A%22ivan_petrov%22%2C%22language_code%22%3A%22ru%22%7D',
            initDataUnsafe: {
                user: {
                    id: 123456789,
                    first_name: 'Иван',
                    last_name: 'Петров', 
                    username: 'ivan_petrov',
                    language_code: 'ru'
                }
            },
            version: '6.0',
            platform: 'tdesktop'
        }
    };
}
// === КОНЕЦ ТЕСТОВЫХ ДАННЫХ ===

function getTelegramUserInfo() {
    try {
        if (window.Telegram && Telegram.WebApp) {
            const initData = Telegram.WebApp.initData;
            const initDataUnsafe = Telegram.WebApp.initDataUnsafe;
            
            console.log('InitData:', initData);
            console.log('InitDataUnsafe:', initDataUnsafe);
            
            if (initDataUnsafe && initDataUnsafe.user) {
                const user = initDataUnsafe.user;
                return {
                    username: user.username,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    userId: user.id,
                    exists: true
                };
            }
            
            if (initData) {
                const params = new URLSearchParams(initData);
                const userParam = params.get('user');
                if (userParam) {
                    const user = JSON.parse(decodeURIComponent(userParam));
                    return {
                        username: user.username,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        userId: user.id,
                        exists: true
                    };
                }
            }
        }
    } catch (error) {
        console.error('Error getting Telegram user info:', error);
    }
    
    return { exists: false };
}

function updateDate() {
    const dateElement = document.querySelector('.date p');
    const now = new Date();
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    const month = months[now.getMonth()];
    const day = now.getDate();
    dateElement.textContent = `${month}, ${day}`;
}

function createPersonalizedGreeting() {
    const userInfo = getTelegramUserInfo();
    
    if (userInfo.exists) {
        const userName = userInfo.username 
            ? `@${userInfo.username}` 
            : userInfo.firstName || 'странник';
        
        const greetings = [
            `Услышь зов судьбы, ${userName}`,
            `${userName}, судьба готовит тебе небольшой подарок!`,
            `Привет, ${userName}! Луна сегодня красивая, правда?`,
            `${userName}, давай узнаем твое будущее!`,
            `Судьба шепчет тебе, ${userName}...`
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    return 'Приветствую, о странник!';
}

function initializeApp() {
    updateDate();
    
    const userInfo = getTelegramUserInfo();
    console.log('Telegram User Info:', userInfo);
    
    const titleElement = document.getElementById('title');
    titleElement.textContent = createPersonalizedGreeting();
    
    const isInTelegram = !!(window.Telegram && Telegram.WebApp);
    console.log('Запущено в Telegram Web App:', isInTelegram);
    
    if (isInTelegram) {
        console.log('Версия Telegram Web App:', Telegram.WebApp.version);
        console.log('Платформа:', Telegram.WebApp.platform);
    }
}


document.addEventListener('DOMContentLoaded', initializeApp);

button.addEventListener('click', async () => {
    response.textContent = 'Посылаю запрос во вселенную...';
    window.location.href = 'horoscope.html';
    try {
        const userInfo = getTelegramUserInfo();
        
        const res = await fetch('/api/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: 'Хочу узнать свой гороскоп', 
                user_info: userInfo,
                timestamp: new Date().toISOString()
            })
        });

        const data = await res.json();
        response.textContent = `${data.reply}`;
    } catch (err) {
        console.error(err);
        response.textContent = 'Твое будущее туманно...';
    }
});