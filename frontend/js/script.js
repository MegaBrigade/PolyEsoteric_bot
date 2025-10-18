const button = document.getElementById('buttonG');
const response = document.getElementById('greetingMes');

button.addEventListener('click', async () => {
  response.textContent = 'Отправляю запрос во вселенную...';

  try {
    const res = await fetch('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Хочу узнать свой гороскоп' })
    });

    const data = await res.json();
    response.textContent = `Звезды говорят: ${data.reply}`;
  } catch (err) {
    console.error(err);
    response.classList.remove('hidden');
    response.textContent = 'Будущее туманно...';
  }
});