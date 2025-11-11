const returnButton = document.getElementById("return");
const mainCard = document.querySelector(".main-card");
const cardsContainer = document.querySelector(".cards");
const title = document.getElementById("title");

const resultScreen = document.querySelector(".result-screen");
const cardName = document.getElementById("cardName");
const cardImage = document.getElementById("cardImage");
const cardDescription = document.getElementById("cardDescription");
const backButton = document.getElementById("backButton");

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
    await getDailyCard();
  }
});

backButton.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  cardsContainer.classList.remove("open");
  title.textContent = "Нажми, чтобы открыть карту!";
  isOpen = false;
});

async function getDailyCard() {
  try {
    const response = await fetch('/api/card', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) throw new Error("Ошибка сервера");

    const data = await response.json();

    cardName.textContent = data.name;
    cardDescription.textContent = data.meaning;
    cardImage.src = "assets/card.svg";

    resultScreen.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    title.textContent = "У карт нет совета для тебя сегодня!";
  }
}