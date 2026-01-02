const button = document.getElementById("buttonG");
const tarotButton = document.getElementById("buttonCard");
const magesButton = document.getElementById("buttonT");

function updateDate() {
    const dateElement = document.querySelector('.date p');
    const now = new Date();
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    dateElement.textContent = `${months[now.getMonth()]}, ${now.getDate()}`;
}

function getTelegramDisplayName() {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
        const user = Telegram.WebApp.initDataUnsafe.user;
        return user.username || user.first_name || 'странник';
    }
    return 'странник';
}

function setGreeting() {
    const titleElement = document.getElementById('title');
    if (titleElement) {
        titleElement.textContent = `Приветствуем тебя, ${getTelegramDisplayName()}!`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    setGreeting();

    if (window.Telegram && Telegram.WebApp) {
        Telegram.WebApp.ready();
        Telegram.WebApp.expand();
        console.log('Telegram WebApp:', Telegram.WebApp.platform);
    }
});

button.addEventListener('click', () => {
    window.location.href = 'horoscope.html';
});

tarotButton.addEventListener('click', () => {
    window.location.href = 'tarot.html';
});

magesButton.addEventListener('click', () => {
    window.location.href = 'test.html';
});
