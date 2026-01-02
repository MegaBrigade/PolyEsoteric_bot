const button = document.getElementById("buttonG");
const response = document.getElementById("title");
const tarotButton = document.getElementById("buttonCard");
const magesButton = document.getElementById("buttonT");

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
        const userName = userInfo.firstName || userInfo.username || 'странник';
        const greetings = [
            `Услышь зов судьбы, ${userName}`,
            `${userName}, судьба готовит тебе небольшой подарок!`,
            `Привет, ${userName}! Луна сегодня красивая, правда?`,
            `${userName}, давай узнаем твое будущее!`,
            `Судьба шепчет тебе, ${userName}...`
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    return 'Приветствуем тебя, странник!';
}

function initializeTelegramWebApp() {
    if (window.Telegram && Telegram.WebApp) {
        console.log('Telegram Web App initialized');
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        
        // Обновляем приветствие после инициализации Telegram
        const titleElement = document.getElementById('title');
        if (titleElement) {
            titleElement.textContent = createPersonalizedGreeting();
        }
    }
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
        initializeTelegramWebApp();
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

tarotButton.addEventListener('click', async () => {
    window.location.href = 'tarot.html';
});

magesButton.addEventListener('click', async () => {
    window.location.href = 'test.html';
});