const button = document.getElementById("buttonG");
const response = document.getElementById("title");

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
    response.textContent = 'Хрустальный шар говорит, что будущее туманно';
  }
});