/* =========================================================
   КЛИНОК · barbershop — интерактив без библиотек
   ========================================================= */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- 1. ПРЕЛОАДЕР ---------- */
(() => {
  const pre = $('#preloader'), bar = $('#preBar'), num = $('#preNum');
  if (!pre) return;

  /* ждём только критичные картинки: те, что видны на первом экране */
  const critical = $$('.hero img, .header img');
  let ready = critical.filter(i => i.complete).length;
  critical.forEach(img => {
    if (img.complete) return;
    const done = () => ready++;
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  });
  let pageDone = document.readyState === 'complete';
  addEventListener('load', () => { pageDone = true; });

  const t0 = performance.now();
  let shown = 0;
  const tick = () => {
    const el = performance.now() - t0;
    const timed = clamp(el / 1300, 0, 1) * 94;
    const imgs = critical.length ? (ready / critical.length) * 94 : 94;
    const target = (pageDone && ready >= critical.length) ? 100 : Math.min(timed, Math.max(imgs, timed * 0.5));
    shown = lerp(shown, target, 0.14);
    bar.style.width = shown + '%';
    num.textContent = Math.round(shown);
    if (shown > 99 || el > 3200) return finish();
    requestAnimationFrame(tick);
  };
  const finish = () => {
    bar.style.width = '100%'; num.textContent = '100';
    pre.classList.add('is-done');
    document.body.classList.remove('is-locked');
    setTimeout(() => { pre.classList.add('is-gone'); startIntro(); }, 620);
  };
  document.body.classList.add('is-locked');
  requestAnimationFrame(tick);
})();

/* ---------- 2. РАЗБИВКА ЗАГОЛОВКОВ ---------- */
$$('[data-split]').forEach(el => {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  words.forEach((w, i) => {
    const ln = document.createElement('span'); ln.className = 'ln';
    const ch = document.createElement('span'); ch.className = 'ch';
    ch.textContent = w;
    ch.style.transitionDelay = (i * 55) + 'ms';
    ln.appendChild(ch); el.appendChild(ln);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
});

function startIntro() {
  const hero = $('.hero__title');
  if (hero) hero.classList.add('is-in');
  $$('.hero [data-reveal]').forEach(el => el.classList.add('is-in'));
}

/* ---------- 3. ПОЯВЛЕНИЕ ПРИ СКРОЛЛЕ ---------- */
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const d = +(el.dataset.revealDelay || 0);
      setTimeout(() => el.classList.add('is-in'), d);
      io.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal], [data-split]').forEach(el => io.observe(el));
})();

/* ---------- 4. СЧЁТЧИКИ ---------- */
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseFloat(el.dataset.count);
      const dec = +(el.dataset.decimals || 0);
      const suf = el.dataset.suffix || '';
      const dur = 1500; const t0 = performance.now();
      const run = (t) => {
        const p = clamp((t - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const v = end * eased;
        el.textContent = (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('ru-RU')) + (p === 1 ? suf : '');
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => io.observe(el));
})();

/* ---------- 5. ШАПКА, ПРОГРЕСС, НАВЕРХ ---------- */
(() => {
  const header = $('#header'), prog = $('#scrollProgress'), totop = $('#totop');
  const links = $$('.nav a[data-link]');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  let last = 0;
  const onScroll = () => {
    const y = scrollY;
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    header.classList.toggle('is-stuck', y > 40);
    header.classList.toggle('is-hidden', y > 420 && y > last && !$('#menu').classList.contains('is-open'));
    totop.classList.toggle('is-on', y > 900);
    last = y;
    let current = null;
    sections.forEach(s => { if (s.getBoundingClientRect().top <= innerHeight * 0.35) current = s.id; });
    links.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === '#' + current));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  totop.addEventListener('click', () => scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' }));
})();

/* ---------- 6. МОБИЛЬНОЕ МЕНЮ ---------- */
(() => {
  const burger = $('#burger'), menu = $('#menu');
  const links = $$('.menu__list a');
  const toggle = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
    links.forEach((a, i) => a.style.transitionDelay = open ? (120 + i * 60) + 'ms' : '0ms');
  };
  burger.addEventListener('click', () => toggle(!menu.classList.contains('is-open')));
  links.forEach(a => a.addEventListener('click', () => toggle(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
})();

/* ---------- 7. КУРСОР, ЛАМПА, МАГНИТ ---------- */
if (FINE && !REDUCED) {
  const cur = $('#cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('.cursor__label');
  const lamp = $('#lamp');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, lx = mx, ly = my;

  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    cur.classList.add('is-on');
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  }, { passive: true });

  const loop = () => {
    rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    label.style.transform = `translate(${rx}px, ${ry}px)`;
    lx = lerp(lx, mx, 0.06); ly = lerp(ly, my, 0.06);
    lamp.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const hoverables = 'a, button, [data-cursor], .tile, .card, input, label, .quote';
  document.addEventListener('pointerover', e => {
    const t = e.target.closest(hoverables);
    if (!t) return;
    cur.classList.add('is-hover');
    const txt = t.closest('[data-cursor]')?.dataset.cursor || '';
    label.textContent = txt;
  });
  document.addEventListener('pointerout', e => {
    if (e.target.closest(hoverables)) { cur.classList.remove('is-hover'); label.textContent = ''; }
  });

  /* магнитные кнопки */
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  /* объёмный наклон */
  $$('[data-tilt]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1100px) rotateX(${-py * 5}deg) rotateY(${px * 6}deg) translateZ(0)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  /* подсветка карточек услуг */
  $$('[data-spot]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}

/* ---------- 8. ПАРАЛЛАКС ---------- */
if (!REDUCED) {
  const items = $$('[data-parallax]').map(el => ({ el, k: parseFloat(el.dataset.parallax) }));
  let ticking = false;
  const apply = () => {
    const vh = innerHeight;
    items.forEach(({ el, k }) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translate3d(0, ${(p * k * 180).toFixed(2)}px, 0)`;
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }, { passive: true });
  apply();
}

/* ---------- 9. БЕГУЩАЯ СТРОКА ---------- */
/* Движение целиком на CSS-анимации (.ticker__row): она живёт на композиторе,
   поэтому не зависит ни от скролла, ни от загруженности главного потока. */

/* ---------- 10. ПРЕВЬЮ В ПРАЙСЕ ---------- */
if (FINE) {
  const box = $('#pricePreview'), img = box?.querySelector('img');
  $$('.pricelist__rows li').forEach(li => {
    li.addEventListener('pointerenter', () => { img.src = li.dataset.preview; box.classList.add('is-on'); });
    li.addEventListener('pointerleave', () => box.classList.remove('is-on'));
    li.addEventListener('pointermove', e => {
      box.style.left = (e.clientX + 150) + 'px';
      box.style.top = e.clientY + 'px';
    });
  });
}

/* ---------- 11. ГАЛЕРЕЯ: ФИЛЬТРЫ + ЛАЙТБОКС ---------- */
(() => {
  const tiles = $$('.tile');
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    const f = chip.dataset.filter;
    tiles.forEach((t, i) => {
      const show = f === 'all' || t.dataset.cat === f;
      t.style.transitionDelay = (i * 25) + 'ms';
      t.classList.toggle('is-hidden', !show);
    });
  }));

  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  let idx = 0;
  const visible = () => tiles.filter(t => !t.classList.contains('is-hidden'));
  const show = (i) => {
    const list = visible();
    if (!list.length) return;
    idx = (i + list.length) % list.length;
    const t = list[idx];
    lbImg.src = t.querySelector('img').src;
    lbImg.alt = t.querySelector('img').alt;
    lbCap.textContent = t.querySelector('figcaption span').textContent + ' · ' + t.querySelector('figcaption em').textContent;
  };
  const open = (t) => {
    show(visible().indexOf(t));
    lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
  };
  const close = () => {
    lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  };
  tiles.forEach(t => t.addEventListener('click', () => open(t)));
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => show(idx - 1));
  $('#lbNext').addEventListener('click', () => show(idx + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();

/* ---------- 12. КАТАЛОГ ФОРМ ---------- */
(() => {
  const DATA = [
    { t: 'Кроп', img: 'assets/img/work-fade.jpg', len: '3–5 см', care: 'раз в 3 недели',
      d: 'Короткая рваная чёлка и плотная текстура сверху. Прощает жёсткий волос и высокий лоб, отрастает ровно, укладывается матовой пастой за минуту.' },
    { t: 'Андеркат', img: 'assets/img/work-neck.jpg', len: '8–12 см', care: 'раз в 4 недели',
      d: 'Резкий контраст выбритых боков и длинной массы сверху. Работает на прямом густом волосе и требует честной укладки каждое утро.' },
    { t: 'Помпадур', img: 'assets/img/work-scissors.jpg', len: '10–14 см', care: 'раз в 5 недель',
      d: 'Объём, поднятый от лба назад. Классика сороковых в современной посадке: мягкий переход по бокам, фиксация помадой средней силы.' },
    { t: 'Бокс', img: 'assets/img/work-barber.jpg', len: '1–3 см', care: 'раз в 2 недели',
      d: 'Минимум длины, максимум формы черепа. Никакой укладки: достаточно полотенца. Требует регулярности — иначе рассыпается на второй месяц.' }
  ];
  const stage = $('.forms__stage'), img = $('#formImg'), desc = $('.forms__desc');
  const title = $('#formTitle'), text = $('#formText'), len = $('#formLen'), care = $('#formCare'), idxEl = $('#formIdx');
  if (!stage) return;

  const CHARS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ#/%*';
  const scramble = (el, final) => {
    if (REDUCED) { el.textContent = final; return; }
    let frame = 0;
    const steps = final.split('').map((_, i) => ({ start: i * 2, end: i * 2 + 8 }));
    const run = () => {
      let out = '', done = 0;
      final.split('').forEach((c, i) => {
        const s = steps[i];
        if (frame >= s.end) { out += c; done++; }
        else if (frame >= s.start) out += CHARS[Math.floor(Math.random() * CHARS.length)];
        else out += ' ';
      });
      el.textContent = out;
      frame++;
      if (done < final.length) requestAnimationFrame(run);
    };
    run();
  };

  $$('#formsList button').forEach(btn => btn.addEventListener('click', () => {
    const i = +btn.dataset.form;
    const d = DATA[i];
    $$('#formsList button').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    stage.classList.add('is-swap'); desc.classList.add('is-swap');
    setTimeout(() => {
      img.src = d.img; img.alt = 'Пример формы: ' + d.t;
      text.textContent = d.d; len.textContent = d.len; care.textContent = d.care;
      idxEl.textContent = String(i + 1).padStart(2, '0');
      scramble(title, d.t);
      stage.classList.remove('is-swap'); desc.classList.remove('is-swap');
    }, 380);
  }));
})();

/* ---------- 13. СЛАЙДЕР ОТЗЫВОВ ---------- */
(() => {
  const slider = $('#slider'), track = $('#track'), dotsBox = $('#dots');
  if (!track) return;
  const slides = $$('.quote', track);
  let index = 0, timer = null;

  const perView = () => {
    const w = track.getBoundingClientRect().width;
    const sw = slides[0].getBoundingClientRect().width + 20;
    return Math.max(1, Math.round(w / sw));
  };
  const maxIndex = () => Math.max(0, slides.length - perView());

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', 'Отзыв ' + (i + 1));
    b.addEventListener('click', () => go(i));
    dotsBox.appendChild(b);
  });
  const dots = $$('button', dotsBox);

  function go(i) {
    index = clamp(i, 0, maxIndex());
    const step = slides[0].getBoundingClientRect().width + 20;
    track.style.transform = `translate3d(${-index * step}px,0,0)`;
    dots.forEach((d, k) => d.classList.toggle('is-active', k === index));
  }
  $('#revNext').addEventListener('click', () => go(index >= maxIndex() ? 0 : index + 1));
  $('#revPrev').addEventListener('click', () => go(index <= 0 ? maxIndex() : index - 1));

  /* перетаскивание */
  let down = false, startX = 0, startIdx = 0;
  slider.addEventListener('pointerdown', e => {
    down = true; startX = e.clientX; startIdx = index;
    slider.classList.add('is-drag'); slider.setPointerCapture(e.pointerId);
  });
  slider.addEventListener('pointermove', e => {
    if (!down) return;
    const step = slides[0].getBoundingClientRect().width + 20;
    const shift = Math.round((startX - e.clientX) / (step * 0.45));
    if (shift !== 0) { go(startIdx + shift); }
  });
  const up = () => { down = false; slider.classList.remove('is-drag'); };
  slider.addEventListener('pointerup', up);
  slider.addEventListener('pointercancel', up);

  const auto = () => { timer = setInterval(() => go(index >= maxIndex() ? 0 : index + 1), 5200); };
  const stop = () => clearInterval(timer);
  if (!REDUCED) { auto(); slider.addEventListener('pointerenter', stop); slider.addEventListener('pointerleave', auto); }
  addEventListener('resize', () => go(index));
  go(0);
})();

/* ---------- 14. ЗАПИСЬ ---------- */
(() => {
  const form = $('#bookForm');
  if (!form) return;
  const steps = $$('.step', form);
  const marks = $$('.form__steps span', form);
  const prev = $('#prevStep'), next = $('#nextStep'), submit = $('#submitBtn');
  const dateInput = $('#dateInput'), phone = $('#phone'), summary = $('#summary');
  let cur = 0;

  /* дата: сегодня по умолчанию, прошлое недоступно */
  const today = new Date();
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  dateInput.min = iso(today);
  dateInput.value = iso(new Date(today.getTime() + 864e5));

  /* слоты времени */
  $$('[data-slot]').forEach(b => b.addEventListener('click', () => {
    $$('[data-slot]').forEach(x => x.classList.remove('is-active'));
    b.classList.add('is-active');
  }));

  /* маска телефона: белорусский формат +375 (29) 123-45-67 */
  phone.addEventListener('input', () => {
    let d = phone.value.replace(/\D/g, '');
    while (d.startsWith('375')) d = d.slice(3);  // код страны, если его вводят вручную
    if (d.startsWith('80')) d = d.slice(2);       // междугородний префикс 8-0XX
    d = d.slice(0, 9);                            // код оператора (2) + номер (7)
    if (!d) { phone.value = ''; return; }
    let out = '+375 (' + d.slice(0, 2);
    if (d.length >= 3) out += ') ' + d.slice(2, 5);
    if (d.length >= 6) out += '-' + d.slice(5, 7);
    if (d.length >= 8) out += '-' + d.slice(7, 9);
    phone.value = out;
  });

  const show = (i) => {
    cur = clamp(i, 0, steps.length - 1);
    steps.forEach((s, k) => s.classList.toggle('is-active', k === cur));
    marks.forEach((m, k) => {
      m.classList.toggle('is-active', k === cur);
      m.classList.toggle('is-done', k < cur);
    });
    prev.disabled = cur === 0;
    next.hidden = cur === steps.length - 1;
    submit.hidden = cur !== steps.length - 1;
    if (cur === steps.length - 1) fillSummary();
  };

  const data = () => ({
    service: form.querySelector('[name=service]:checked').value,
    barber: form.querySelector('[name=barber]:checked').value,
    date: dateInput.value,
    time: $('[data-slot].is-active')?.textContent || '16:30',
    name: form.name?.value || '',
  });

  function fillSummary() {
    const d = data();
    const human = new Date(d.date + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    summary.innerHTML = `<b>${d.service}</b> · мастер <b>${d.barber}</b><br>${human}, <b>${d.time}</b> · улица Октябрьская, 16а`;
  }

  const validStep = () => {
    if (cur !== steps.length - 1) return true;
    let ok = true;
    [form.querySelector('[name=name]'), phone].forEach(inp => {
      const wrap = inp.closest('.field');
      const bad = inp.name === 'phone' ? inp.value.replace(/\D/g, '').length !== 12 : inp.value.trim().length < 2;
      wrap.classList.toggle('is-error', bad);
      wrap.dataset.error = inp.name === 'phone' ? 'Введите полный номер' : 'Укажите имя';
      if (bad) ok = false;
    });
    return ok;
  };

  next.addEventListener('click', () => show(cur + 1));
  prev.addEventListener('click', () => show(cur - 1));
  dateInput.addEventListener('change', fillSummary);

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validStep()) return;
    const d = data();
    const human = new Date(d.date + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    $('#modalText').innerHTML =
      `${d.name ? d.name + ', ж' : 'Ж'}дём вас ${human} в ${d.time}.<br>${d.service}, мастер — ${d.barber}.<br>
       <span style="opacity:.6">Это демо вымышленного бренда: заявка никуда не отправлена.</span>`;
    const modal = $('#modal');
    modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false');
  });

  const modal = $('#modal');
  const closeModal = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); };
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  show(0);
})();

/* ---------- 15. ПЛАВНЫЕ ПЕРЕХОДЫ ПО ЯКОРЯМ ---------- */
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  const t = $(id);
  if (!t) return;
  e.preventDefault();
  const y = t.getBoundingClientRect().top + scrollY - 70;
  scrollTo({ top: y, behavior: REDUCED ? 'auto' : 'smooth' });
}));

})();
