document.addEventListener('DOMContentLoaded', function() {
  const startScreen = document.getElementById('start-screen');
  const questionScreen = document.getElementById('question-screen');
  const returnButton = document.getElementById("return");
  const returnQuestionButton = document.getElementById("returnQuestion");


  returnButton.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = "index.html";
  });

  returnQuestionButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  startScreen.addEventListener('click', function(e) {
    if (e.target.closest('.arrow')) return;
    startScreen.classList.remove('active');
    startScreen.style.opacity = '0';
    
    setTimeout(() => {
      startScreen.style.display = 'none';
      questionScreen.style.display = 'flex';
      setTimeout(() => {
        questionScreen.classList.add('active');
        questionScreen.style.opacity = '1';
      }, 50);
    }, 500);
  });

  const buttons = document.querySelectorAll('.button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Выбран ответ:', this.textContent);
    });
  });

  const phone = document.querySelector('.phone');
  phone.addEventListener('click', function(e) {
    if (startScreen.classList.contains('active') && !e.target.closest('.arrow')) {
      startScreen.click();
    }
  });
});