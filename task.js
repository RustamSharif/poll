document.addEventListener('DOMContentLoaded', () => {
  const pollTitle = document.getElementById('poll__title');
  const pollAnswers = document.getElementById('poll__answers');
  let pollId;

  // Получаем данные опроса
  fetch('https://students.netoservices.ru/nestjs-backend/poll')
    .then(response => response.json())
    .then(data => {
      pollId = data.id;
      pollTitle.textContent = data.data.title;

      // Создаем кнопки с вариантами ответов
      data.data.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'poll__answer';
        button.textContent = answer;

        // Добавляем обработчик голосования
        button.addEventListener('click', () => {
          // Сначала показываем сообщение
          alert('Спасибо, ваш голос засчитан!');

          // Отправляем результат голосования
          fetch('https://students.netoservices.ru/nestjs-backend/poll', {
            method: 'POST',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded'
            },
            body: `vote=${pollId}&answer=${index}`
          })
            .then(response => response.json())
            .then(results => {
              // Очищаем предыдущие ответы
              pollAnswers.innerHTML = '';

              // Показываем результаты
              const total = results.stat.reduce((sum, item) => sum + item.votes, 0);
              results.stat.forEach(item => {
                const percent = ((item.votes / total) * 100).toFixed(2);
                pollAnswers.innerHTML += `<div>${item.answer}: ${item.votes} голосов (${percent}%)</div>`;
              });
            });
        });

        pollAnswers.appendChild(button);
      });
    });
});