
document.addEventListener('DOMContentLoaded', function() {
  const startScreen = document.getElementById('start-screen');
  const questionScreen = document.getElementById('question-screen');
  const resultScreen1 = document.getElementById('result-screen-1');
  const resultScreen2 = document.getElementById('result-screen-2');
  const returnButton = document.getElementById("return");
  const returnQuestionButton = document.getElementById("returnQuestion");
  const returnResult1Button = document.getElementById("returnResult1");
  const returnResult2Button = document.getElementById("returnResult2");

const questions = [
    {
      number: "Вопрос 1",
      text: "Какой твой любимый сок?",
      options: ["Вишневый", "Ананасовый", "Мультифрукт", "Не пью"]
    },
    {
      number: "Вопрос 2", 
      text: "Твой друг внезапно начал танцевать, твои действия",
      options: ["Мне будет неловко", "Танцевать вредно", "Прекращу дружбу", "Станцую чунга-чангу"]
    },
    {
      number: "Вопрос 3",
      text: "Твой друг решил стать помидором, твои действия",
      options: ["Поддержу его", "Скажу, что он дурак", "Начну битбоксить", "Перестану общаться"]
    },
    {
      number: "Вопрос 4",
      text: "Если незнакомец попросит милостыню, что делать?",
      options: ["Поделюсь едой", "Дам 10 рублей", "Подерусь с ним", "Пройду мимо"]
    },
    {
      number: "Вопрос 5",
      text: "Какой персонаж тебе нравится из «Монстры на каникулах»",
      options: ["Мейвис", "Дэнис", "Дракула", "Ненавижу мультики"]
    },
    {
      number: "Вопрос 6",
      text: "Какую одежду ты предпочтешь для похода?",
      options: ["Без стоника не хожу", "Я вб-монстр", "Аккуратную одежду", "Пикми-лук - это я"]
    },
    {
      number: "Вопрос 7",
      text: "Как ты относишься к словам-паразитам?",
      options: ["Терпеть не могу", "Говорю только так", "Нейтрально", "Хочу избавиться"]
    },
    {
      number: "Вопрос 8",
      text: "Какой породой собак ты себя опишешь?",
      options: ["Джек Рассел", "Чихуахуа", "Доберман", "Лабрадор"]
    },
    {
      number: "Вопрос 9",
      text: "В какой обстановке ты любишь отдыхать?",
      options: ["При свете", "При темноте", "На пляже", "В лесу"]
    },
    {
      number: "Вопрос 10",
      text: "Какой шашлык ты любишь больше всего?",
      options: ["Свинячий", "Бараний", "Рыбячий", "Говяжий"]
    }
  ];

  let currentQuestionIndex = 0;
  let userAnswers = [];
  returnButton.addEventListener("click", (e) => {
    e.stopPropagation();
    window.location.href = "index.html";
  });

  returnQuestionButton.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  returnResult1Button.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  returnResult2Button.addEventListener("click", () => {
    window.location.href = "index.html";
  });

function showQuestion(index) {
  const question = questions[index];
  document.querySelector('.question-number').textContent = question.number;
  document.querySelector('.question-text').textContent = question.text;
  
  const buttons = questionScreen.querySelectorAll('.button');
  
  buttons.forEach((button, i) => {
    button.textContent = question.options[i];
    button.onclick = function(e) {
      e.preventDefault();
      handleAnswerSelect(i, question.options[i]);
    };
  });
  updateProgressBar(index);
}
  function handleAnswerSelect(optionIndex, answerText) {
    userAnswers[currentQuestionIndex] = {
      question: questions[currentQuestionIndex].text,
      answer: answerText
    };
    console.log('Выбран ответ:', answerText);
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion(currentQuestionIndex);
    } else {
      showRandomResult();
    }
  }

  function updateProgressBar(currentIndex) {
    const progressFill = document.querySelector('.progress-fill');
    const progress = ((currentIndex + 1) / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
  }

function addResultScreenHandlers(resultScreen) {
  const retryBtn = resultScreen.querySelector('.retry-btn');
  retryBtn.addEventListener('click', function(e) {
    e.preventDefault();
    restartTest();
  });
}

function showRandomResult() {
  questionScreen.classList.remove('active');
  
  const randomResult = Math.random() < 0.5 ? resultScreen1 : resultScreen2;
  
  setTimeout(() => {
    questionScreen.style.display = 'none';
    randomResult.style.display = 'flex';
    setTimeout(() => {
      randomResult.classList.add('active');
      addResultScreenHandlers(randomResult);
    }, 50);
  }, 500);
}

function restartTest() {
  const activeResult = document.querySelector('.result-screen.active');
  if (activeResult) {
    activeResult.classList.remove('active');
    
    setTimeout(() => {
      activeResult.style.display = 'none';
      currentQuestionIndex = 0;
      userAnswers = [];

      questionScreen.style.display = 'flex';
      setTimeout(() => {
        questionScreen.classList.add('active');
        showQuestion(currentQuestionIndex);
      }, 50);
    }, 500);
  }
}

 
  function adjustQuestionFontSizes() {
    const questionNumber = document.querySelector('.question-number');
    const questionText = document.querySelector('.question-text');
    const panel = document.querySelector('.panel');
    const screenHeight = window.innerHeight;
    
    if (panel) {
      const panelRect = panel.getBoundingClientRect();
      if (panelRect.bottom > screenHeight - 10) {
        const currentNumberSize = parseInt(window.getComputedStyle(questionNumber).fontSize);
        const currentTextSize = parseInt(window.getComputedStyle(questionText).fontSize);
        
        questionNumber.style.fontSize = Math.max(16, currentNumberSize - 2) + 'px';
        questionText.style.fontSize = Math.max(14, currentTextSize - 2) + 'px';
      }
    }
  }

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

        showQuestion(currentQuestionIndex);
      }, 50);
    }, 500);
  });

  const phone = document.querySelector('.phone');
  phone.addEventListener('click', function(e) {
    if (startScreen.classList.contains('active') && !e.target.closest('.arrow')) {
      startScreen.click();
    }
  });

  window.addEventListener('load', adjustQuestionFontSizes);
  window.addEventListener('resize', adjustQuestionFontSizes);
});