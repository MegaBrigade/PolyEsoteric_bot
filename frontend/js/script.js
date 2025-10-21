const button = document.getElementById("buttonG");
const response = document.getElementById("title");
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
document.addEventListener('DOMContentLoaded', updateDate);
button.addEventListener('click', async () => {
  response.textContent = 'Посылаю запрос во вселенную...';

  try {
    const res = await fetch('/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Хочу узнать свой гороскоп' })
    });

    const data = await res.json();
    response.textContent = `${data.reply}`;
  } catch (err) {
    console.error(err);
    response.classList.remove('hidden');
    response.textContent = 'Твое будущее туманно...';
  }
});