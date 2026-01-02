const button = document.getElementById("buttonG");
const tarotButton = document.getElementById("buttonCard");
const magesButton = document.getElementById("buttonT");

function updateDate() {
    const dateElement = document.querySelector('.date p');
    if (!dateElement) return;

    const now = new Date();
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    dateElement.textContent = `${months[now.getMonth()]}, ${now.getDate()}`;
}

function getTelegramDisplayName() {
    if (!window.Telegram || !Telegram.WebApp) {
        return 'странник';
    }

    const user = Telegram.WebApp.initDataUnsafe?.user;

    if (!user) {
        return 'странник';
    }

    return user.username || user.first_name || 'странник';
}

function setGreeting() {
    const titleElement = document.getElementById('title');
    if (!titleElement) return;

    const name = getTelegramDisplayName();
    titleElement.textContent = `Приветствуем тебя, ${name}!`;
}

function initializeTelegramWebApp() {
    if (!window.Telegram || !Telegram.WebApp) return;

    Telegram.WebApp.ready();
    Telegram.WebApp.expand();

    console.log('Telegram user:', Telegram.WebApp.initDataUnsafe?.user);

    setGreeting();
}

document.addEventListener('DOMContentLoaded', () => {
    updateDate();

    if (window.Telegram && Telegram.WebApp) {
        initializeTelegramWebApp();
    } else {
        const titleElement = document.getElementById('title');
        if (titleElement) {
            titleElement.textContent = 'Приветствуем тебя, странник!';
        }
    }
});

button?.addEventListener('click', () => {
    window.location.href = 'horoscope.html';
});

tarotButton?.addEventListener('click', () => {
    window.location.href = 'tarot.html';
});

magesButton?.addEventListener('click', () => {
    window.location.href = 'test.html';
});
