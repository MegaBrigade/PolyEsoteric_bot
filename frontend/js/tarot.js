const returnButton = document.getElementById("return");
const mainCard = document.querySelector(".main-card");
const cardsContainer = document.querySelector(".cards");
const title = document.getElementById("title");

let isOpen = false;

returnButton.addEventListener("click", () => {
  window.location.href = "index.html";
});

mainCard.addEventListener("click", async () => {
  if (!isOpen) {
    cardsContainer.classList.add("open");
    title.textContent = "Готов узнать, что ждет тебя сегодня?";
    isOpen = true;
  } else {
    window.location.href = 'daily_card.html';
  }
});

backButton.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  cardsContainer.classList.remove("open");
  title.textContent = "Нажми, чтобы открыть карту!";
  isOpen = false;
});
