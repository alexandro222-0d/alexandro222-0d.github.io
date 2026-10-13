/* ============================================================
   Главная: слайдер и лента новинок
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- слайдер ---------- */
  var track = $('#slidTrack');
  if (track) {
    var slides = $$('.slide', track), i = 0, timer = null;
    var dots = $('#slidDots');

    dots.innerHTML = slides.map(function (_, n) {
      return '<button type="button" aria-label="Слайд ' + (n + 1) + '"' + (n ? '' : ' class="is-on"') + '></button>';
    }).join('');

    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-i * 100) + '%)';
      $$('button', dots).forEach(function (b, k) { b.classList.toggle('is-on', k === i); });
    }
    function play() {
      if (reduced) return;
      stop();
      timer = setInterval(function () { go(i + 1); }, 6000);
    }
    function stop() { if (timer) clearInterval(timer); }

    $('#slidNext').addEventListener('click', function () { go(i + 1); play(); });
    $('#slidPrev').addEventListener('click', function () { go(i - 1); play(); });
    dots.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      go($$('button', dots).indexOf(b)); play();
    });

    /* свайп на телефоне */
    var x0 = null;
    track.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var d = e.changedTouches[0].clientX - x0;
      if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1));
      x0 = null; play();
    }, { passive: true });

    $('#slider').addEventListener('mouseenter', stop);
    $('#slider').addEventListener('mouseleave', play);
    go(0); play();
  }

  /* ---------- новинки на главной ---------- */
  var grid = $('#homeGrid');
  if (grid && window.PRODUCTS) {
    var list = window.PRODUCTS.filter(function (p) { return p.cat === 'novinki'; }).slice(0, 4);
    grid.innerHTML = list.map(function (p) {
      var price = p.price ? String(p.price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' р.' : 'По запросу';
      return '' +
        '<article class="pcard">' +
          '<a class="pcard__img media par" href="product.html?id=' + p.id + '">' +
            '<img src="img/' + p.img[0] + '" alt="' + p.name + '" loading="lazy">' +
          '</a>' +
          '<div class="pcard__body">' +
            '<a class="pcard__name" href="product.html?id=' + p.id + '">' + p.name + '</a>' +
            '<div class="pcard__row"><span class="pcard__price">' + price + '</span>' +
            '<span class="pcard__art">' + p.art + '</span></div>' +
            '<button class="pbtn" type="button" data-add="' + p.id + '">В заявку</button>' +
          '</div>' +
        '</article>';
    }).join('');
  }
})();
