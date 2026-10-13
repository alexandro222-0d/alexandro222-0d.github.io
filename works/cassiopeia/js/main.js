/* ============================================================
   Cassiopeia Coffee — main.js
   ============================================================ */
(function () {
  'use strict';

  /* ---------- НАСТРОЙКИ (меняйте здесь) ---------- */
  var CONFIG = {
    // Видео для hero. Положите файл в assets/video/ и укажите имя.
    heroVideo: '', // видео для первого экрана не записано: показываем фото-постер
    // Ссылка на виджет Яндекс.Карт (см. README)
    yandexMap: 'https://yandex.ru/map-widget/v1/?ll=27.561831%2C53.902284&z=16&pt=27.561831,53.902284,pm2rdm'
  };

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. HERO-ВИДЕО (с мягким фолбэком на постер)
     ============================================================ */
  (function initHeroVideo() {
    var video = document.getElementById('heroVideo');
    if (!video || !CONFIG.heroVideo) return;

    var source = document.createElement('source');
    source.src = CONFIG.heroVideo;
    source.type = 'video/mp4';
    video.appendChild(source);
    video.load();

    // Если файла нет — остаётся poster, видео просто прячем.
    source.addEventListener('error', function () {
      video.removeAttribute('autoplay');
      var poster = video.getAttribute('poster');
      if (poster) video.style.background = "url('" + poster + "') center/cover no-repeat";
    });

    var play = video.play();
    if (play && play.catch) play.catch(function () { /* автоплей заблокирован — ок */ });
  })();

  /* ============================================================
     2. ШАПКА: фон при скролле + мобильное меню
     ============================================================ */
  (function initHeader() {
    var header = document.getElementById('header');
    var burger = document.getElementById('burger');
    var nav = document.getElementById('nav');

    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav__link')) {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  })();

  /* ============================================================
     3. FADE-IN ПРИ СКРОЛЛЕ
     ============================================================ */
  (function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    // Ступенчатая задержка для соседних элементов одной сетки
    var groups = {};
    items.forEach(function (el) {
      var key = el.parentNode.className || 'x';
      groups[key] = groups[key] || 0;
      el.style.setProperty('--d', Math.min(groups[key] * 90, 540) + 'ms');
      groups[key]++;
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { io.observe(el); });
  })();

  /* ============================================================
     4. ПАРАЛЛАКС (блок «О нас»)
     ============================================================ */
  (function initParallax() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!nodes.length || reduceMotion || window.matchMedia('(max-width: 820px)').matches) return;

    var ticking = false;

    var update = function () {
      var vh = window.innerHeight;
      nodes.forEach(function (node) {
        var rect = node.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        var speed = parseFloat(node.getAttribute('data-parallax')) || 0.1;
        // -1 … 1 относительно центра экрана
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        var shift = -progress * rect.height * speed;
        var img = node.querySelector('img');
        if (img) img.style.transform = 'translate3d(0,' + shift.toFixed(2) + 'px,0) scale(1.12)';
      });
      ticking = false;
    };

    var onScroll = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  })();

  /* ============================================================
     5. КАСТОМНЫЙ КУРСОР — КОФЕЙНОЕ ЗЕРНО
     ============================================================ */
  (function initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var cursor = document.querySelector('.cursor');
    var bean = cursor.querySelector('.cursor__bean');
    var dot = cursor.querySelector('.cursor__dot');

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var bx = mx, by = my;     // позиция зерна (с задержкой)
    var angle = 0, lastX = mx;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.classList.add('is-active');
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });

    document.addEventListener('mouseleave', function () { cursor.classList.remove('is-active'); });
    document.addEventListener('mouseenter', function () { cursor.classList.add('is-active'); });

    (function loop() {
      bx += (mx - bx) * 0.16;
      by += (my - by) * 0.16;

      // лёгкий наклон зерна по направлению движения
      var vx = mx - lastX;
      lastX = mx;
      angle += ((vx * 1.2) - angle) * 0.1;
      angle = Math.max(-26, Math.min(26, angle));

      bean.style.transform = 'translate(' + bx + 'px,' + by + 'px) translate(-50%,-50%) rotate(' + angle.toFixed(2) + 'deg)';
      requestAnimationFrame(loop);
    })();

    // состояния над интерактивными элементами
    var hoverSel = 'a, button, [data-cursor="hover"]';
    var zoomSel = '[data-cursor="zoom"]';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(zoomSel)) cursor.classList.add('is-zoom');
      else if (e.target.closest(hoverSel)) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(zoomSel)) cursor.classList.remove('is-zoom');
      if (e.target.closest(hoverSel)) cursor.classList.remove('is-hover');
    });

    // клик — короткое «сжатие»
    document.addEventListener('mousedown', function () { bean.style.opacity = '.6'; });
    document.addEventListener('mouseup', function () { bean.style.opacity = '1'; });
  })();

  /* ============================================================
     6. ЛАЙТБОКС ГАЛЕРЕИ
     ============================================================ */
  (function initLightbox() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.masonry__item'));
    if (!items.length) return;

    var box = document.getElementById('lightbox');
    var img = document.getElementById('lbImg');
    var counter = document.getElementById('lbCounter');
    var index = 0;

    var sources = items.map(function (fig) {
      var el = fig.querySelector('img');
      // full — путь к полноразмерной версии, если задан data-full
      return { src: fig.getAttribute('data-full') || el.getAttribute('src'), alt: el.getAttribute('alt') || '' };
    });

    function show(i) {
      index = (i + sources.length) % sources.length;
      img.src = sources[index].src;
      img.alt = sources[index].alt;
      counter.textContent = (index + 1) + ' / ' + sources.length;
    }

    function open(i) {
      show(i);
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    items.forEach(function (fig, i) {
      fig.addEventListener('click', function () { open(i); });
    });

    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); show(index - 1); });
    document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); show(index + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });

    // свайпы на тач-устройствах
    var startX = null;
    box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) show(dx > 0 ? index - 1 : index + 1);
      startX = null;
    });
  })();

  /* ============================================================
     7. КАРТА (подгружается по клику — быстрее и без лишних кук)
     ============================================================ */
  (function initMap() {
    var btn = document.getElementById('mapBtn');
    var map = document.getElementById('map');
    if (!btn || !map) return;

    btn.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = CONFIG.yandexMap;
      frame.setAttribute('loading', 'lazy');
      frame.setAttribute('allowfullscreen', '');
      frame.setAttribute('title', 'Карта проезда к Cassiopeia Coffee');
      map.innerHTML = '';
      map.appendChild(frame);
    });
  })();

  /* ============================================================
     8. МЕЛОЧИ
     ============================================================ */
  document.getElementById('year').textContent = new Date().getFullYear();

})();
