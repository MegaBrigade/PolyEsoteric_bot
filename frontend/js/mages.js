document.addEventListener('DOMContentLoaded', function() {
  // Элементы экранов
  const startScreen = document.getElementById('start-screen');
  const questionScreen = document.getElementById('question-screen');
  
  // Обработчик клика на начальный экран
  startScreen.addEventListener('click', function() {
    // Скрываем начальный экран
    startScreen.classList.remove('active');
    startScreen.style.opacity = '0';
    
    // Показываем экран с вопросом через небольшую задержку для анимации
    setTimeout(() => {
      startScreen.style.display = 'none';
      questionScreen.style.display = 'flex';
      setTimeout(() => {
        questionScreen.classList.add('active');
        questionScreen.style.opacity = '1';
      }, 50);
    }, 500);
  });

  // Обработчики для выбора ответов
  const options = document.querySelectorAll('.option');
  options.forEach(option => {
    option.addEventListener('click', function() {
      // Убираем выделение у всех вариантов
      options.forEach(opt => opt.classList.remove('selected'));
      // Выделяем выбранный вариант
      this.classList.add('selected');
    });
  });

  // Обработчик кнопки "Далее"
  const nextBtn = document.querySelector('.next-btn');
  nextBtn.addEventListener('click', function() {
    // Здесь будет логика перехода к следующему вопросу
    console.log('Переход к следующему вопросу');
  });

  // Альтернативный вариант: сделать весь начальный экран кликабельным
  const phone = document.querySelector('.phone');
  phone.addEventListener('click', function(e) {
    // Проверяем, что клик был именно по начальному экрану
    if (startScreen.classList.contains('active')) {
      startScreen.click();
    }
  });
});