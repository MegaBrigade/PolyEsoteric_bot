const button = document.getElementById("buttonG");
const tarotButton = document.getElementById("buttonCard");
const magesButton = document.getElementById("buttonT");
const titleElement = document.getElementById("title");

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
    const name = getTelegramDisplayName();
    titleElement.textContent = `Приветствуем тебя, ${name}!`;
}

document.addEventListener('DOMContentLoaded', () => {
    updateDate();

    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();

        console.log('Telegram WebApp version:', Telegram.WebApp.version);
        console.log('InitDataUnsafe:', Telegram.WebApp.initDataUnsafe);

        setGreeting();
    } else {
        titleElement.textContent = 'Приветствуем тебя, странник!';
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
