/* ============================================================
   NORDWOOL — моушен и интерактив
   Без библиотек. Один rAF-цикл на все анимации скролла.
   ============================================================ */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hoverable = window.matchMedia('(hover:hover)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp  = function (a, b, t) { return a + (b - a) * t; };

  /* ============ 1. ЗАГРУЗЧИК ============ */
  var loader   = $('#loader'),
      loaderNum = $('#loaderNum'),
      loaderFill = $('#loaderFill');

  function finishLoader() {
    if (loader.classList.contains('is-done')) return;
    loader.classList.add('is-done');
    document.body.classList.add('is-ready');
    setTimeout(function () { loader.classList.add('is-gone'); }, 1600);
  }

  if (reduced) {
    finishLoader();
  } else {
    var pct = 0, target = 0, loaded = false;
    window.addEventListener('load', function () { loaded = true; });
    setTimeout(function () { loaded = true; }, 2600);  // страховка: медленная сеть
    setTimeout(finishLoader, 4200);                    // страховка: вкладка в фоне

    (function tick() {
      target = loaded ? 100 : Math.min(target + Math.random() * 7, 92);
      pct = lerp(pct, target, 0.08);
      var v = Math.round(pct);
      loaderNum.textContent = v < 10 ? '0' + v : String(v);
      loaderFill.style.width = v + '%';
      if (v >= 100) { setTimeout(finishLoader, 260); return; }
      requestAnimationFrame(tick);
    })();
  }

  /* ============ 2. ПЛЕЙСХОЛДЕРЫ ФОТО ============
     Нет файла — показываем «пустой кадр» с его именем.
     Положите фото в /img — подхватится само.            */
  $$('.media').forEach(function (fig) {
    var img = $('img', fig);
    if (!img) return;
    fig.setAttribute('data-ph', (img.getAttribute('src') || '').split('/').pop());
    var fail = function () { fig.classList.add('is-empty'); };
    var ok   = function () { fig.classList.remove('is-empty'); };
    if (img.complete) { (img.naturalWidth ? ok : fail)(); }
    img.addEventListener('error', fail);
    img.addEventListener('load', function () { if (img.naturalWidth) ok(); });
  });

  /* ============ 3. РАЗБОР ТЕКСТА ============ */
  $$('[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'w';
      var inner = document.createElement('i');
      inner.textContent = w;
      inner.style.setProperty('--wd', (i * 70) + 'ms');
      span.appendChild(inner);
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  var heroName = $('[data-chars]');
  if (heroName) {
    var letters = heroName.textContent.trim().split('');
    heroName.textContent = '';
    letters.forEach(function (ch, i) {
      var b = document.createElement('b');
      b.textContent = ch;
      b.style.setProperty('--i', i);
      heroName.appendChild(b);
    });
  }

  /* ============ 4. ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ============ */
  var animated = $$('.reveal, .reveal-group, [data-split]');
  var pending = animated.slice();
  var io = null;

  function reveal(el) {
    el.classList.add('is-in');
    if (io) io.unobserve(el);
    var i = pending.indexOf(el);
    if (i > -1) pending.splice(i, 1);
    if (el.classList.contains('stats__i')) countUp($('b', el));
  }

  /* подчистка: всё, что уже выше или в экране (переход по якорю,
     обновление страницы посередине, очень быстрый скролл) */
  function sweep() {
    for (var i = pending.length - 1; i >= 0; i--) {
      if (pending[i].getBoundingClientRect().top < window.innerHeight * 0.92) reveal(pending[i]);
    }
  }

  if (reduced || !('IntersectionObserver' in window)) {
    animated.forEach(function (el) { el.classList.add('is-in'); });
    pending.length = 0;
  } else {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) reveal(e.target); });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    animated.forEach(function (el) { io.observe(el); });
    window.addEventListener('hashchange', function () { setTimeout(sweep, 700); });
    setTimeout(sweep, 60);
  }

  /* счётчики */
  function countUp(el) {
    if (!el || !el.dataset.count) return;                 /* цифра статичная — не трогаем */
    if (reduced) { el.textContent = fmt(+el.dataset.count); return; }
    var to = +el.dataset.count, t0 = performance.now(), dur = 1700;
    (function run(now) {
      var p = clamp((now - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(to * e));
      if (p < 1) requestAnimationFrame(run);
    })(t0);
  }
  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* ============ 5. ЕДИНЫЙ ЦИКЛ СКРОЛЛА ============ */
  var head     = $('#head'),
      progress = $('#progress'),
      rail     = $('#rail'),
      railLinks = $$('#rail a'),
      navLinks  = $$('#nav a'),
      heroFig  = $('.hero__media'),
      strip    = $('#strip'),
      pars     = $$('.media.par'),
      darkZones = $$('[data-dark]').concat([$('.foot')]),
      sections = ['top', 'categories', 'collection', 'lookbook', 'about', 'booking']
                   .map(function (id) { return document.getElementById(id); });

  var lastY = window.scrollY, vel = 0, stripX = 0, lastT = performance.now();

  /* Бегущую строку двигаем скриптом только на десктопе: там это добавляет
     реакцию на скролл. На телефоне оставляем чистую CSS-анимацию — покадровый
     пересчёт там дрожит и тормозит прокрутку. */
  var stripLive = strip && !reduced && hoverable;
  var stripHalf = 0;
  if (stripLive) {
    var measure = function () {
      stripHalf = strip.scrollWidth / 2;
      /* CSS-анимацию выключаем только когда есть чем её заменить, иначе
         строка застынет насовсем */
      strip.style.animation = stripHalf ? 'none' : '';
    };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
  }

  function frame(now) {
    var dt = Math.min(now - lastT, 50); lastT = now;
    var y  = window.scrollY;
    var vh = window.innerHeight;
    var dy = y - lastY;
    vel = lerp(vel, dy, 0.2);

    /* прыжок по якорю / очень быстрый скролл — догоняем появление блоков */
    if (Math.abs(dy) > vh * 0.75 && pending.length) sweep();

    /* прогресс */
    var max = document.documentElement.scrollHeight - vh;
    progress.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max, 0, 1) : 0) + ')';

    /* шапка */
    head.classList.toggle('is-solid', y > vh * 0.82);
    if (!document.body.classList.contains('menu-open')) {
      head.classList.toggle('is-hidden', vel > 1.5 && y > vh);
    }

    /* герой */
    if (heroFig && !reduced && y < vh * 1.2) {
      heroFig.style.transform = 'translate3d(0,' + (y * 0.1) + 'px,0)';
    }

    /* параллакс внутри кадров */
    if (!reduced) {
      for (var i = 0; i < pars.length; i++) {
        var r = pars[i].getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;
        var p = ((r.top + r.height / 2) - vh / 2) / vh;      /* -1 … 1 */
        var img = pars[i].firstElementChild;
        if (img) img.style.setProperty('--py', (clamp(-p, -1, 1) * r.height * 0.055).toFixed(1) + 'px');
      }
    }

    /* бегущая строка: скорость и наклон зависят от скролла (только десктоп) */
    if (stripLive && stripHalf) {
      stripX -= (0.022 + Math.min(Math.abs(vel), 40) * 0.010) * dt * (vel < -0.5 ? -1 : 1);
      if (stripX <= -stripHalf) stripX += stripHalf;
      if (stripX > 0) stripX -= stripHalf;
      strip.style.transform = 'translate3d(' + stripX.toFixed(2) + 'px,0,0) skewX(' +
                              clamp(-vel * 0.05, -1.6, 1.6).toFixed(2) + 'deg)';
    }

    /* активная секция + тёмный/светлый фон под рельсом */
    var mid = y + vh / 2, active = 0;
    for (var s = 0; s < sections.length; s++) {
      if (sections[s] && sections[s].offsetTop <= mid) active = s;
    }
    railLinks.forEach(function (a, k) { a.classList.toggle('is-active', k === active); });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + (sections[active] && sections[active].id));
    });

    var onDark = darkZones.some(function (z) {
      if (!z) return false;
      var rz = z.getBoundingClientRect();
      return rz.top < vh / 2 && rz.bottom > vh / 2;
    });
    rail.classList.toggle('on-dark', onDark);
    rail.classList.toggle('on-light', !onDark);
    rail.classList.toggle('is-on', y > vh * 0.6);

    lastY = y;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ============ 6. МАГНИТНЫЕ ЭЛЕМЕНТЫ ============ */
  if (hoverable && !reduced) {
    $$('.magnetic').forEach(function (el) {
      el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var mx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        var my = (e.clientY - (r.top + r.height / 2)) * 0.34;
        el.style.transform = 'translate(' + mx.toFixed(1) + 'px,' + my.toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ============ 7. КУРСОР ============ */
  var cursor = $('#cursor'),
      cDot = $('.cursor__dot'), cRing = $('.cursor__ring'),
      mx = window.innerWidth / 2, my = window.innerHeight / 2,
      dx = mx, dy2 = my, rx = mx, ry = my;

  if (hoverable && !reduced) {
    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    (function cLoop() {
      dx = lerp(dx, mx, 0.9);  dy2 = lerp(dy2, my, 0.9);
      rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
      cDot.style.transform = 'translate3d(' + dx + 'px,' + dy2 + 'px,0)';
      cRing.style.translate = rx + 'px ' + ry + 'px';
      requestAnimationFrame(cLoop);
    })();

    /* состояние курсора */
    document.addEventListener('mouseover', function (e) {
      var media = e.target.closest('[data-zoom]');
      var link  = e.target.closest('a, button, input, label');
      cursor.classList.toggle('on-media', !!(media && !media.classList.contains('is-empty') && !$('#lb').classList.contains('is-open')));
      cursor.classList.toggle('on-link', !!link && !media);
    });
  } else if (cursor) {
    cursor.style.display = 'none';
  }

  /* курсор: ring двигаем через translate, dot — через transform */
  if (cRing) {
    cRing.style.position = 'absolute';
    cRing.style.left = '0'; cRing.style.top = '0';
  }

  /* ============ 8. ЛАЙТБОКС ============ */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount'),
      items = $$('[data-zoom]'), index = -1;

  var srcOf = function (f) { return $('img', f).getAttribute('src'); };
  var capOf = function (f) { return $('img', f).getAttribute('alt') || 'NORDWOOL'; };

  function show(i, from) {
    index = i;
    var fig = items[i];
    lb.classList.add('is-loading');
    lbImg.src = srcOf(fig);
    lbImg.alt = capOf(fig);
    lbCap.textContent = capOf(fig);
    lbCount.textContent = (i + 1) + ' / ' + items.length;
    var done = function () { lb.classList.remove('is-loading'); if (from) flip(from); };
    if (lbImg.complete && lbImg.naturalWidth) done();
    else lbImg.onload = done;
  }

  function flip(fig) {
    if (reduced) return;
    var f = $('img', fig).getBoundingClientRect();
    var stage = $('.lb__stage');
    requestAnimationFrame(function () {
      var t = lbImg.getBoundingClientRect();
      if (!t.width || !f.width) return;
      var s = f.width / t.width;
      var ox = (f.left + f.width / 2) - (t.left + t.width / 2);
      var oy = (f.top + f.height / 2) - (t.top + t.height / 2);
      stage.style.transition = 'none';
      stage.style.transform = 'translate(' + ox + 'px,' + oy + 'px) scale(' + s + ')';
      stage.style.opacity = '1';
      void stage.offsetWidth;
      stage.style.transition = '';
      stage.style.transform = '';
    });
  }

  function open(i, fig) {
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    if (cursor) cursor.classList.remove('on-media', 'on-link');
    show(i, fig);
  }
  function close() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    index = -1;
  }
  function step(d) { if (index >= 0) show((index + d + items.length) % items.length); }

  /* в лайтбоксе участвуют только видимые кадры: карточки скрытых разделов
     не должны попадать в перелистывание */
  var zoomAll = items.slice();
  function refreshItems() {
    items = zoomAll.filter(function (el) { return el.offsetParent !== null; });
  }
  zoomAll.forEach(function (fig) {
    fig.addEventListener('click', function () {
      if (fig.classList.contains('is-empty')) return;
      refreshItems();
      var i = items.indexOf(fig);
      if (i < 0) return;
      open(i, fig);
    });
  });

  $('#lbClose').addEventListener('click', close);
  $('.lb__bg').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
  $('#lbNext').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  var tx = 0;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var d = e.changedTouches[0].clientX - tx;
    if (Math.abs(d) > 60) step(d < 0 ? 1 : -1);
  }, { passive: true });

  /* ============ 8б. ЛУКБУК: ПЕРЕТАСКИВАНИЕ ЛЕНТЫ ============ */
  var railH = $('#railH');
  if (railH) {
    var down = false, startX = 0, startLeft = 0, moved = 0;

    railH.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      down = true; moved = 0;
      startX = e.clientX; startLeft = railH.scrollLeft;
      railH.classList.add('is-drag');
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var d = e.clientX - startX;
      moved = Math.max(moved, Math.abs(d));
      railH.scrollLeft = startLeft - d;
    });
    window.addEventListener('pointerup', function () {
      down = false;
      railH.classList.remove('is-drag');
    });

    /* после перетаскивания не открываем лайтбокс */
    railH.addEventListener('click', function (e) {
      if (moved > 6) { e.stopPropagation(); e.preventDefault(); }
    }, true);

    /* колесо мыши: вертикальный скролл двигает ленту, пока она не кончилась */
    railH.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      var max = railH.scrollWidth - railH.clientWidth;
      var next = railH.scrollLeft + e.deltaY;
      if (next > 0 && next < max) { railH.scrollLeft = next; e.preventDefault(); }
    }, { passive: false });
  }

  /* ============ 8в. РАЗДЕЛЫ КАТАЛОГА ============
     Плитка или кнопка над сеткой открывает свой раздел: показываются
     только его карточки. */
  var grid = $('#grid'), catTitle = $('#catTitle');
  if (grid) {
    var cards = $$('.card', grid),
        tiles = $$('.tile'),
        navBtns = $$('#catNav button');

    function setCat(cat, scroll) {
      cards.forEach(function (c) {
        var mine = c.getAttribute('data-cat') === cat;
        c.classList.toggle('is-off', !mine);
        if (mine) reveal(c);                       /* показываем без ожидания скролла */
      });
      navBtns.forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-cat') === cat); });
      tiles.forEach(function (t) { t.classList.toggle('is-on', t.getAttribute('data-cat') === cat); });

      var active = navBtns.filter(function (b) { return b.getAttribute('data-cat') === cat; })[0];
      if (active && catTitle) catTitle.textContent = active.textContent;

      refreshItems();
      if (scroll) {
        document.getElementById('collection').scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth', block: 'start'
        });
      }
    }

    tiles.forEach(function (t) {
      t.addEventListener('click', function () { setCat(t.getAttribute('data-cat'), true); });
    });
    navBtns.forEach(function (b) {
      b.addEventListener('click', function () { setCat(b.getAttribute('data-cat'), false); });
    });
  }

  /* ============ 9. МЕНЮ ============ */
  var burger = $('#burger');
  function closeMenu() { document.body.classList.remove('menu-open', 'is-locked'); }
  burger.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    document.body.classList.toggle('is-locked', open);
    head.classList.remove('is-hidden');
  });

  /* ============ 10. ФОРМА ============ */
  var form = $('#form'), phone = form.querySelector('input[name="phone"]');

  /* маска белорусского номера: +375 (29) 123-45-67 */
  phone.addEventListener('input', function () {
    var d = phone.value.replace(/\D/g, '');
    if (!d) { phone.value = ''; return; }
    if (d.indexOf('80') === 0) d = '375' + d.slice(2);        // 80 29 ... — местная запись
    if (d.indexOf('375') !== 0) d = '375' + d.slice(-9);      // ввели только код оператора и номер
    d = d.slice(0, 12);
    var out = '+375';
    if (d.length > 3) out += ' (' + d.slice(3, 5);
    if (d.length >= 6) out += ') ' + d.slice(5, 8);
    if (d.length >= 9) out += '-' + d.slice(8, 10);
    if (d.length >= 11) out += '-' + d.slice(10, 12);
    phone.value = out;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    $$('.field', form).forEach(function (f) {
      var input = $('input', f);
      var valid = input.name === 'phone'
        ? input.value.replace(/\D/g, '').length === 12
        : input.value.trim().length > 1;
      f.classList.toggle('is-error', !valid);
      if (!valid) ok = false;
    });
    if (!ok) return;

    /* Здесь подключается отправка: fetch на CRM / Telegram-бот / почту. */
    form.classList.add('is-sent');
  });

  /* ============ 11. ЯКОРИ ============ */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      closeMenu();
      t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
