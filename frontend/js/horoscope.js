
// Функция для определения знака зодиака
function getZodiacSign(day, month) {
    const signs = [
        { name: "Козерог", start: [12, 22], end: [1, 19], description: "Вы амбициозны и дисциплинированы!" },
        { name: "Водолей", start: [1, 20], end: [2, 18], description: "Вы инновационны и гуманитарны!" },
        { name: "Рыбы", start: [2, 19], end: [3, 20], description: "Вы интуитивны и сострадательны!" },
        { name: "Овен", start: [3, 21], end: [4, 19], description: "Вы энергичны и полны энтузиазма!" },
        { name: "Телец", start: [4, 20], end: [5, 20], description: "Вы надежны и практичны!" },
        { name: "Близнецы", start: [5, 21], end: [6, 20], description: "Вы общительны и любознательны!" },
        { name: "Рак", start: [6, 21], end: [7, 22], description: "Вы заботливы и эмоциональны!" },
        { name: "Лев", start: [7, 23], end: [8, 22], description: "Вы уверены в себе и щедры!" },
        { name: "Дева", start: [8, 23], end: [9, 22], description: "Вы аналитичны и внимательны к деталям!" },
        { name: "Весы", start: [9, 23], end: [10, 22], description: "Вы дипломатичны и стремитесь к гармонии!" },
        { name: "Скорпион", start: [10, 23], end: [11, 21], description: "Вы страстны и решительны!" },
        { name: "Стрелец", start: [11, 22], end: [12, 21], description: "Вы авантюрны и философски настроены!" }
    ];

    for (let sign of signs) {
        const [startMonth, startDay] = sign.start;
        const [endMonth, endDay] = sign.end;
        
        if ((month === startMonth && day >= startDay) || 
            (month === endMonth && day <= endDay) ||
            (startMonth > endMonth && ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)))) {
            return sign;
        }
    }
    return { name: "Не определен", description: "Проверьте введенную дату" };
}

// Функция для отображения результата
function showResult(sign) {
    document.getElementById('zodiacSign').textContent = sign.name;
    document.getElementById('zodiacDescription').textContent = sign.description;
    document.getElementById('result').style.display = 'flex';
}

// Функция для возврата назад
function goBack() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('loader').style.display = 'none';
    document.querySelector('.content').style.display = 'block';
}

// Обработчик формы
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('birthdayForm');
    const loader = document.getElementById('loader');
    const content = document.querySelector('.content');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const birthdateInput = document.getElementById('birthdateInput');
        if (!birthdateInput.value) {
            alert('Пожалуйста, введите дату рождения');
            return;
        }

        // Показываем загрузку
        content.style.display = 'none';
        loader.style.display = 'flex';

        // Имитируем загрузку (в реальном приложении здесь может быть запрос к API)
        setTimeout(() => {
            const birthDate = new Date(birthdateInput.value);
            const day = birthDate.getDate();
            const month = birthDate.getMonth() + 1;
            
            const zodiacSign = getZodiacSign(day, month);
            
            // Скрываем загрузку и показываем результат
            loader.style.display = 'none';
            showResult(zodiacSign);
        }, 2000);
    });

    // Установка максимальной датой сегодняшний день
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('birthdateInput').max = today;
    
    console.log('Страница гороскопа загружена');
});

// Тестовые данные Telegram (оставьте без изменений)
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