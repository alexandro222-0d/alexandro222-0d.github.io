/* ============================================================
   Подпись автора на демо-проекте.

   Подставьте свои данные — и на каждой странице появится
   аккуратная плашка «Сделать такой же сайт», а на странице
   проекта — рабочие кнопки для связи.

   tg     — ник в Telegram без собаки, например 'ivanov'
   viber  — номер в международном формате, только цифры
   name   — как вас представить
   ============================================================ */
window.AUTHOR = {
  name:  'Ваше имя',
  tg:    '',                    /* например: 'ivanov'  */
  viber: '',                    /* например: '375290000000' */
  price: '1000 руб.',
  term:  '5–7 дней'
};

(function () {
  'use strict';
  var A = window.AUTHOR || {};

  /* плашка на всех страницах, кроме страницы проекта */
  if (!document.body || document.body.getAttribute('data-page') === 'case') return;

  var box = document.createElement('a');
  box.className = 'authorbar';
  box.href = 'case.html';
  box.innerHTML = '<b>Демо-проект</b><span>Хочу такой сайт →</span>';
  document.body.appendChild(box);
})();
