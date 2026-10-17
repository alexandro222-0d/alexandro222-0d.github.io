(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // hero entrance: on for ~1.6s, then removed so the end state never depends on the animation
  if (!reduceMotion && !document.hidden) {
    document.documentElement.classList.add("intro");
    setTimeout(() => document.documentElement.classList.remove("intro"), 1700);
  }

  /* ================= i18n ================= */
  const dict = {
    ru: {
      "meta.title": "Pulse — автопилот для селлеров",
      skip: "Перейти к содержанию",
      "nav.product": "Продукт", "nav.how": "Как это работает", "nav.week": "Неделя", "nav.pricing": "Цены",
      "nav.status": "все системы в норме",
      "cta.start": "Начать бесплатно", "cta.watch": "Смотреть сценарий, 2 минуты",
      "hero.pill": "открытая бета / 4 площадки подключены",
      "hero.h1a": "Рутина больше", "hero.h1b": "не ваша.",
      "hero.lead": "Pulse следит за остатками, ценами и отзывами на всех маркетплейсах и зовёт вас, только когда нужно решение.",
      "hero.fine": "14 дней бесплатно / без карты / без звонков менеджера",
      "flow.aria": "Пример сценария", "flow.name": "сценарий:", "flow.meta": "5 шагов · 2 ветки", "flow.running": "работает",
      "flow.n0": "Новый заказ",
      "flow.n1": "Остаток < 10 шт", "flow.n1s": "черновик заказа поставщику",
      "flow.n2": "Спрос растёт", "flow.n2s": "цена +4% в пределах коридора",
      "flow.n3": "Спросить вас", "flow.n3s": "Telegram · ждёт 2 ч",
      "flow.recent": "последние запуски",
      "tiles.aria": "Интеграции", "tiles.ym": "я.маркет", "tiles.ms": "мойсклад", "tiles.more": "ещё 38",
      "glue.pill": "что забирает pulse",
      "glue.h2a": "Половина торговли —", "glue.h2b": "перекладывание.",
      "glue.p": "Выгрузить заказы, сверить остатки, ответить на отзыв, поправить цену. Pulse берёт перекладывание на себя и оставляет вам решения.",
      "stock.a": "Худи oversize, графит", "stock.ad": "3 дн",
      "stock.b": "Кружка 350 мл", "stock.bd": "11 дн",
      "stock.c": "Термос 0,5 л", "stock.cd": "26 дн",
      "card1.h": "Знает, когда товар закончится",
      "card1.p": "Считает скорость продаж на каждой площадке и готовит заказ поставщику до того, как карточка уйдёт в ноль.",
      "price.ours": "ваша цена", "price.rival": "конкурент", "price.band": "коридор",
      "card2.h": "Держит цену в коридоре",
      "card2.p": "Следит за конкурентами и двигает цену только внутри границ, которые задали вы. Ни рублём ниже минимума.",
      "review.in": "Пришло быстро, но коробка помята.", "review.tag": "черновик pulse",
      "review.out": "Спасибо, что написали! Мы уже передали складу — следующие заказы упакуем в двойной картон.",
      "card3.h": "Отвечает на отзывы вашим тоном",
      "card3.p": "Готовит ответ за минуту после отзыва. Позитив уходит сам, негатив ждёт вашего «отправить».",
      "how.pill": "запуск за вечер", "how.h2a": "Три шага до", "how.h2b": "первого запуска.",
      "how.s1h": "Подключите кабинеты", "how.s1p": "Вставьте API-ключи площадок и склада. Pulse подтянет товары, остатки и историю продаж за 90 дней.", "how.s1t": "~ 3 минуты",
      "how.s2h": "Выберите сценарии", "how.s2p": "12 готовых сценариев: остатки, цены, отзывы, возвраты. Границы и исключения задаёте вы.", "how.s2t": "~ 15 минут",
      "how.s3h": "Решайте только исключения", "how.s3p": "Всё обычное Pulse делает сам. Необычное приходит в Telegram с кнопками «да» и «нет».", "how.s3t": "дальше — без вас",
      "week.pill": "неделя одного магазина", "week.h2a": "Работает, пока вы", "week.h2b": "спите.",
      "week.p": "Каждая черта — час. Чем ярче, тем больше действий Pulse сделал сам. Выберите день, чтобы увидеть, сколько раз он всё-таки позвал человека.",
      "week.aria": "Дни недели",
      "price.pill": "один тариф",
      "pricing.h2a": "Без процентов", "pricing.h2b": "с ваших продаж.",
      "pricing.num": "119 BYN", "pricing.per": "/ месяц за магазин",
      "pricing.i1": "Все площадки и склады", "pricing.i2": "Без лимита на товары и сценарии",
      "pricing.i3": "Уведомления в Telegram", "pricing.i4": "Отмена в один клик",
      "pricing.cta": "Начать 14 дней бесплатно", "pricing.fine": "карта не нужна",
      "foot.aria": "Подвал", "foot.note": "© 2026 Pulse · концепт для портфолио",
      days: ["пн", "вт", "ср", "чт", "пт", "сб", "вс"],
      daysLong: ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
      actions: ["действие без вас", "действия без вас", "действий без вас"], asks: ["вопрос вам", "вопроса вам", "вопросов вам"],
      notes: [
        "пик заказов после выходных",
        "3 конкурента сменили цены",
        "приёмка поставки на складе",
        "ответы на 48 отзывов",
        "распродажа: 31 изменение цены",
        "вы ни разу не открыли кабинет",
        "недельный отчёт ушёл в Telegram"
      ],
      log: {
        stock: ["Худи oversize: черновик заказа на 120 шт", "Кружка 350 мл: заказ поставщику готов"],
        price: ["Термос 0,5 л: 52,90 → 54,90 BYN", "Худи: цена удержана у минимума"],
        ask: ["Вопрос вам: поставщик просит предоплату", "Вопрос вам: возврат на 290 BYN"]
      },
      sec: "с"
    },
    en: {
      "meta.title": "Pulse — autopilot for marketplace sellers",
      skip: "Skip to content",
      "nav.product": "Product", "nav.how": "How it works", "nav.week": "Week", "nav.pricing": "Pricing",
      "nav.status": "all systems normal",
      "cta.start": "Start free", "cta.watch": "Watch a run, 2 minutes",
      "hero.pill": "open beta / 4 marketplaces connected",
      "hero.h1a": "The busywork isn’t", "hero.h1b": "yours anymore.",
      "hero.lead": "Pulse watches stock, prices and reviews across every marketplace and only pings you when a decision is needed.",
      "hero.fine": "free for 14 days / no card / no sales call",
      "flow.aria": "Example flow", "flow.name": "flow:", "flow.meta": "5 steps · 2 branches", "flow.running": "running",
      "flow.n0": "New order",
      "flow.n1": "Stock < 10 units", "flow.n1s": "drafts a supplier order",
      "flow.n2": "Demand is rising", "flow.n2s": "price +4% within your range",
      "flow.n3": "Ask you", "flow.n3s": "Telegram · waits 2 h",
      "flow.recent": "recent runs",
      "tiles.aria": "Integrations", "tiles.ym": "yandex market", "tiles.ms": "moysklad", "tiles.more": "38 more",
      "glue.pill": "what pulse takes over",
      "glue.h2a": "Half of selling is", "glue.h2b": "copy-paste.",
      "glue.p": "Export orders, match stock, answer a review, nudge a price. Pulse takes the shuffling and leaves you the decisions.",
      "stock.a": "Oversize hoodie, graphite", "stock.ad": "3 d",
      "stock.b": "Mug 350 ml", "stock.bd": "11 d",
      "stock.c": "Thermos 0.5 L", "stock.cd": "26 d",
      "card1.h": "Knows when you’ll sell out",
      "card1.p": "Tracks sales velocity on each marketplace and drafts the supplier order before a listing hits zero.",
      "price.ours": "your price", "price.rival": "competitor", "price.band": "range",
      "card2.h": "Keeps prices in range",
      "card2.p": "Watches competitors and moves your price only inside the limits you set. Never a kopeck below your floor.",
      "review.in": "Arrived fast, but the box was crushed.", "review.tag": "pulse draft",
      "review.out": "Thanks for letting us know! We’ve told the warehouse — next orders ship double-boxed.",
      "card3.h": "Answers reviews in your voice",
      "card3.p": "Drafts a reply a minute after each review. Praise goes out on its own, complaints wait for your “send”.",
      "how.pill": "set up in an evening", "how.h2a": "Three steps to", "how.h2b": "your first run.",
      "how.s1h": "Connect your stores", "how.s1p": "Paste API keys for your marketplaces and warehouse. Pulse pulls products, stock and 90 days of sales.", "how.s1t": "~ 3 minutes",
      "how.s2h": "Pick your flows", "how.s2p": "12 ready-made flows: stock, prices, reviews, returns. You set the limits and exceptions.", "how.s2t": "~ 15 minutes",
      "how.s3h": "Decide only the exceptions", "how.s3p": "Pulse handles the routine. Anything unusual lands in Telegram with “yes” and “no” buttons.", "how.s3t": "then it runs without you",
      "week.pill": "one store, one week", "week.h2a": "It runs while you", "week.h2b": "sleep.",
      "week.p": "Each mark is an hour. The brighter it is, the more Pulse did on its own. Pick a day to see how often it still needed a person.",
      "week.aria": "Days of the week",
      "price.pill": "one plan",
      "pricing.h2a": "No cut of", "pricing.h2b": "your sales.",
      "pricing.num": "119 BYN", "pricing.per": "/ month per store",
      "pricing.i1": "Every marketplace and warehouse", "pricing.i2": "Unlimited products and flows",
      "pricing.i3": "Telegram notifications", "pricing.i4": "Cancel in one click",
      "pricing.cta": "Start 14 days free", "pricing.fine": "no card needed",
      "foot.aria": "Footer", "foot.note": "© 2026 Pulse · portfolio concept",
      days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      daysLong: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      actions: ["action on its own", "actions on its own"], asks: ["question for you", "questions for you"],
      notes: [
        "post-weekend order spike",
        "3 competitors changed prices",
        "supplier delivery checked in",
        "48 reviews answered",
        "sale day: 31 price changes",
        "you never opened the dashboard",
        "weekly report sent to Telegram"
      ],
      log: {
        stock: ["Oversize hoodie: drafted order for 120 units", "Mug 350 ml: supplier order ready"],
        price: ["Thermos 0.5 L: 52.90 → 54.90 BYN", "Hoodie: price held at floor"],
        ask: ["Question for you: supplier wants prepayment", "Question for you: 290 BYN return"]
      },
      sec: "s"
    }
  };

  let lang = "ru";
  try {
    const saved = localStorage.getItem("pulse-lang");
    if (saved === "ru" || saved === "en") lang = saved;
    else if (!/^(ru|be|uk|kk)/i.test(navigator.language || "")) lang = "en";
  } catch (e) { /* storage unavailable */ }

  const t = (k) => dict[lang][k];
  const langListeners = [];

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = t(el.dataset.i18n);
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.i18nAria));
    });
    document.querySelectorAll(".lang button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    langListeners.forEach((fn) => fn());
  }

  document.querySelectorAll(".lang button").forEach((b) => {
    b.addEventListener("click", () => {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang;
      try { localStorage.setItem("pulse-lang", lang); } catch (e) { /* ignore */ }
      applyLang();
    });
  });

  /* ================= Nav ================= */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ================= Reveal ================= */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.remove("pending");
        e.target.classList.add("in-view");
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal").forEach((el) => {
    if (!reduceMotion && el.getBoundingClientRect().top > window.innerHeight) el.classList.add("pending");
    revealIO.observe(el);
  });

  /* ================= Ribbons ================= */
  // One long ribbon snakes down the whole page in document coordinates.
  // The canvas sits *in* the document (not fixed) and is taller than the screen,
  // so native scrolling moves it together with the content without a frame of lag.
  // It is only re-anchored when the viewport nears its edge.
  const hero = document.querySelector(".hero");
  const cv = document.getElementById("ribbons");
  const gcv = document.getElementById("ribbons-glow");
  const ctx = cv.getContext("2d");
  const gctx = gcv.getContext("2d");
  const GLOW = 4; // glow canvas is 1/GLOW resolution; upscaling makes it soft for free
  let W = 0, H = 0, PH = 0, CH = 0, dpr = 1, strands = 80, particles = [];
  let way = [], docH = 0, spread = 200, bufTop = -1;
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  let shownOpacity = -1;

  function buildPath() {
    docH = document.documentElement.scrollHeight;
    const mobile = W < 960;
    let s = 11;
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    // enters from the top right, coils through the hero, then swings side to side down the page
    way = mobile
      ? [[1.2 * W, -0.1 * PH], [0.7 * W, 0.45 * PH], [0.2 * W, 0.85 * PH]]
      : [[1.15 * W, -0.06 * PH], [0.74 * W, 0.26 * PH], [0.42 * W, 0.72 * PH]];
    let y = way[way.length - 1][1];
    let right = true;
    const step = (mobile ? 0.62 : 0.78) * PH;
    while (y < docH + PH) {
      y += step * (0.85 + r() * 0.3);
      const x = right ? (mobile ? 0.86 : 0.8) + r() * 0.08 : (mobile ? 0.14 : 0.2) - r() * 0.08;
      way.push([x * W, y]);
      right = !right;
    }
    spread = Math.min(W, PH) * (mobile ? 0.3 : 0.24);
    const nSeg = way.length - 1;
    const want = Math.min(420, nSeg * (mobile ? 10 : 22));
    while (particles.length < want) {
      particles.push({ g: r() * nSeg, u: r() - 0.5, v: 0.0006 + r() * 0.0016, r: r() * 1.4 + 0.3, ph: r() * Math.PI * 2 });
    }
    particles.length = want;
    particles.forEach((q) => { q.g %= nSeg; });
  }

  function sizeCanvases() {
    CH = Math.ceil(PH * 1.7);
    cv.width = Math.round(W * dpr); cv.height = Math.round(CH * dpr);
    gcv.width = Math.round(W / GLOW); gcv.height = Math.round(CH / GLOW);
    cv.style.height = gcv.style.height = CH + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bufTop = -1;
  }

  function resize(force) {
    const w = window.innerWidth, h = window.innerHeight;
    const widthChanged = w !== W;
    H = h;
    // phone toolbars change the height while scrolling; only a width change reshapes the ribbon
    if (widthChanged || force || h > PH * 1.15) {
      W = w;
      PH = widthChanged ? h : Math.max(h, PH);
      dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.25 : 1.5);
      strands = W < 700 ? 44 : 80;
      sizeCanvases();
      buildPath();
    }
  }

  // Catmull-Rom point + unit normal on segment i at t
  function at(i, t) {
    const n = way.length - 1;
    const P0 = way[Math.max(0, i - 1)], P1 = way[i], P2 = way[Math.min(n, i + 1)], P3 = way[Math.min(n, i + 2)];
    const t2 = t * t, t3 = t2 * t;
    const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
    const df = (a, b, c, d) => 0.5 * ((-a + c) + 2 * (2 * a - 5 * b + 4 * c - d) * t + 3 * (-a + 3 * b - 3 * c + d) * t2);
    const x = f(P0[0], P1[0], P2[0], P3[0]), y = f(P0[1], P1[1], P2[1], P3[1]);
    const tx = df(P0[0], P1[0], P2[0], P3[0]), ty = df(P0[1], P1[1], P2[1], P3[1]);
    const l = Math.hypot(tx, ty) || 1;
    return [x, y, -ty / l, tx / l];
  }

  const envAt = (g) => 0.55 + 0.45 * Math.sin(g * 1.3 + 0.4);

  function anchor(sy) {
    const margin = H * 0.12;
    const maxTop = Math.max(0, docH - CH);
    const needs = bufTop < 0 ||
      (sy < bufTop + margin && bufTop > 0) ||
      (sy + H > bufTop + CH - margin && bufTop < maxTop);
    if (!needs) return;
    bufTop = Math.round(Math.min(maxTop, Math.max(0, sy - (CH - H) / 2)));
    cv.style.transform = gcv.style.transform = `translate3d(0, ${bufTop}px, 0)`;
  }

  const pts = [];
  function draw(time) {
    if (Math.abs(document.documentElement.scrollHeight - docH) > 4) buildPath();
    mouse.x += (mouse.tx - mouse.x) * 0.035;
    mouse.y += (mouse.ty - mouse.y) * 0.035;
    const sy = window.scrollY;
    anchor(sy);
    const mx = (mouse.x - 0.5) * 36, my = (mouse.y - 0.5) * 24;

    // full strength over the hero, quieter behind reading content
    const fade = Math.min(1, sy / Math.max(1, hero.offsetHeight * 0.8));
    const op = +(1 - 0.4 * fade).toFixed(2);
    if (op !== shownOpacity) {
      shownOpacity = op;
      cv.style.opacity = op;
      gcv.style.opacity = (0.85 * op).toFixed(2);
    }
    ctx.clearRect(0, 0, W, CH);
    ctx.globalCompositeOperation = "lighter";

    // sample only the segments that cross the canvas
    const top = bufTop - spread * 1.6, bottom = bufTop + CH + spread * 1.6;
    pts.length = 0;
    for (let i = 0; i < way.length - 1; i++) {
      const y0 = Math.min(way[i][1], way[i + 1][1]), y1 = Math.max(way[i][1], way[i + 1][1]);
      if (y1 < top || y0 > bottom) continue;
      const len = Math.hypot(way[i + 1][0] - way[i][0], way[i + 1][1] - way[i][1]);
      const steps = Math.max(12, Math.ceil(len / 14));
      for (let k = 0; k <= steps; k++) {
        const t = k / steps;
        const p = at(i, t);
        p.push(i + t);
        pts.push(p);
      }
    }

    if (pts.length) {
      const grad = ctx.createLinearGradient(0, CH, W, 0);
      grad.addColorStop(0, "rgba(95,212,196,1)");
      grad.addColorStop(0.35, "rgba(200,246,90,1)");
      grad.addColorStop(0.7, "rgba(214,250,120,1)");
      grad.addColorStop(1, "rgba(95,212,196,1)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;

      for (let i = 0; i < strands; i++) {
        const u = i / (strands - 1) - 0.5;
        const edge = Math.abs(u) * 2;
        ctx.globalAlpha = 0.05 + 0.32 * Math.pow(1 - edge, 2) + 0.1 * Math.pow(edge, 6);
        ctx.beginPath();
        for (let k = 0; k < pts.length; k++) {
          const p = pts[k], g = p[4];
          const env = envAt(g);
          const twist = Math.sin(g * 2.2 - time * 0.42 + u * 1.2) * 0.85 + Math.sin(g * 4.7 + time * 0.6 + i * 0.07) * 0.15;
          const off = u * spread * env * twist + Math.sin(g * 1.7 + u * 9 + time * 0.3) * 6 * env;
          const px = p[0] + p[2] * off + mx, py = p[1] + p[3] * off - bufTop + my;
          k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }

    // particles riding the ribbon
    ctx.fillStyle = "rgb(222,255,150)";
    const nSeg = way.length - 1;
    for (const q of particles) {
      if (!reduceMotion) q.g = (q.g + q.v) % nSeg;
      const i = Math.floor(q.g);
      const y0 = Math.min(way[i][1], way[i + 1][1]), y1 = Math.max(way[i][1], way[i + 1][1]);
      if (y1 < top || y0 > bottom) continue;
      const [x, y, nx, ny] = at(i, q.g - i);
      const env = envAt(q.g);
      const twist = Math.sin(q.g * 2.2 - time * 0.42 + q.u * 1.2);
      const off = q.u * spread * env * twist * 1.25;
      const py = y + ny * off - bufTop + my;
      if (py < -10 || py > CH + 10) continue;
      ctx.globalAlpha = (0.35 + 0.65 * Math.abs(Math.sin(time * 1.4 + q.ph))) * env;
      ctx.beginPath();
      ctx.arc(x + nx * off + mx, py, q.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";

    gctx.clearRect(0, 0, gcv.width, gcv.height);
    gctx.filter = "blur(2px)";
    gctx.drawImage(cv, 0, 0, gcv.width, gcv.height);
    gctx.filter = "none";
  }

  /* ---- smooth wheel scrolling (Lenis); touch keeps native momentum ---- */
  let lenis = null;
  if (!reduceMotion && typeof window.Lenis === "function") {
    try {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: (x) => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
        smoothWheel: true,
        wheelMultiplier: 0.9
      });
    } catch (e) { lenis = null; }
  }
  const navOffset = () => -(document.getElementById("nav").offsetHeight + 8);
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || !lenis || a.classList.contains("skip")) return;
    const id = a.getAttribute("href");
    const el = id.length > 1 && document.getElementById(id.slice(1));
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(id === "#top" ? 0 : el, { offset: navOffset() });
  });

  let heroVisible = true, raf = 0, t0 = performance.now();
  function loop(now) {
    if (lenis) lenis.raf(now);
    draw((now - t0) / 1000);
    raf = !document.hidden ? requestAnimationFrame(loop) : 0;
  }
  function kick() { if (!raf && !document.hidden && !reduceMotion) raf = requestAnimationFrame(loop); }

  resize(true);
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);
  if (reduceMotion) {
    draw(4);
    window.addEventListener("scroll", () => draw(4), { passive: true });
  } else {
    draw(0); // first frame right away, even if the tab starts in the background
    document.addEventListener("visibilitychange", kick);
    kick();
  }
  let resizeT = 0;
  window.addEventListener("resize", () => {
    resize(false);
    clearTimeout(resizeT);
    resizeT = setTimeout(layoutFlow, 120);
    if (reduceMotion) draw(4);
  });
  window.addEventListener("pointermove", (e) => {
    mouse.tx = e.clientX / Math.max(1, W);
    mouse.ty = e.clientY / Math.max(1, H);
  }, { passive: true });

  /* ================= Flow panel ================= */
  const flowCanvas = document.querySelector(".flow-canvas");
  const svg = document.getElementById("flow-edges");
  const nodes = {};
  document.querySelectorAll(".node").forEach((n) => { nodes[n.dataset.node] = n; });
  const edges = { e1: ["n0", "n1"], e2: ["n0", "n2"], e3: ["n1", "n3"], e4: ["n2", "n3"] };

  function layoutFlow() {
    const c = flowCanvas.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${c.width} ${c.height}`);
    svg.removeAttribute("preserveAspectRatio");
    for (const [id, [a, b]] of Object.entries(edges)) {
      const ra = nodes[a].getBoundingClientRect(), rb = nodes[b].getBoundingClientRect();
      const x1 = ra.right - c.left, y1 = ra.top + ra.height / 2 - c.top;
      const x2 = rb.left - c.left, y2 = rb.top + rb.height / 2 - c.top;
      const mx = (x1 + x2) / 2;
      document.getElementById(id).setAttribute("d", `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`);
    }
  }

  function travel(pathId, ms) {
    return new Promise((res) => {
      const path = document.getElementById(pathId);
      const len = path.getTotalLength();
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("r", "3");
      svg.appendChild(dot);
      const start = performance.now();
      (function step(now) {
        const k = Math.min(1, (now - start) / ms);
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const pt = path.getPointAtLength(len * e);
        dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
        if (k < 1) requestAnimationFrame(step); else { dot.remove(); res(); }
      })(start);
    });
  }

  function hit(id) {
    const n = nodes[id];
    n.classList.add("hit");
    setTimeout(() => n.classList.remove("hit"), 650);
  }

  // log
  const logEl = document.getElementById("log");
  const entries = [];
  let clock = 14 * 3600 + 2 * 60 + 11;
  const fmt = (s) => [Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, "0")).join(":");

  function pushLog(kind) {
    clock += 7 + Math.floor(Math.random() * 40);
    entries.unshift({ kind, idx: Math.floor(Math.random() * 2), time: clock, dur: (0.4 + Math.random() * 1.6) });
    entries.length = Math.min(entries.length, 4);
    renderLog(true);
  }
  function renderLog(animateFirst) {
    const L = dict[lang];
    logEl.innerHTML = "";
    entries.forEach((en, i) => {
      const li = document.createElement("li");
      if (en.kind === "ask") li.className = "ask";
      if (!animateFirst || i > 0) li.style.animation = "none";
      const dur = en.dur.toFixed(1);
      li.innerHTML = `<span class="t"></span><span class="m"></span><span class="d"></span>`;
      li.children[0].textContent = fmt(en.time);
      li.children[1].textContent = L.log[en.kind][en.idx];
      li.children[2].textContent = (lang === "ru" ? dur.replace(".", ",") : dur) + " " + L.sec;
      logEl.appendChild(li);
    });
  }
  langListeners.push(() => { renderLog(false); requestAnimationFrame(layoutFlow); });

  pushLog("price"); pushLog("stock"); pushLog("price");

  let runN = 0;
  async function run() {
    runN++;
    const askRun = runN % 4 === 0;
    const branch = askRun ? "both" : (runN % 2 ? "stock" : "price");
    hit("n0");
    if (branch === "both") {
      await Promise.all([travel("e1", 900), travel("e2", 900)]);
      hit("n1"); hit("n2");
      await Promise.all([travel("e3", 900), travel("e4", 900)]);
      hit("n3");
      pushLog("ask");
    } else if (branch === "stock") {
      await travel("e1", 900); hit("n1"); pushLog("stock");
    } else {
      await travel("e2", 900); hit("n2"); pushLog("price");
    }
  }

  function startFlow() {
    layoutFlow();
    if (reduceMotion) return;
    let busy = false;
    setInterval(async () => {
      if (busy || document.hidden || !heroVisible) return;
      busy = true;
      try { await run(); } finally { busy = false; }
    }, 2600);
  }

  /* ================= Week heatmap ================= */
  const daysEl = document.getElementById("heat-days");
  const gridEl = document.getElementById("heat-grid");
  const sumEl = document.getElementById("heat-summary");
  const actions = [312, 268, 241, 287, 356, 214, 189];
  const asks = { 0: [10, 15, 19], 1: [11], 2: [9, 16], 3: [12, 22], 4: [8, 11, 14, 20], 5: [13, 18], 6: [] };
  let selDay = 5;

  // deterministic noise so the chart is stable between reloads
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  for (let d = 0; d < 7; d++) {
    const col = document.createElement("div");
    col.className = "heat-col";
    const f = actions[d] / 356;
    for (let h = 0; h < 24; h++) {
      const day = Math.exp(-Math.pow((h - 13) / 4.6, 2));
      const eve = 0.55 * Math.exp(-Math.pow((h - 21) / 1.8, 2));
      const night = 0.12;
      const v = Math.min(1, (night + day + eve) * f * (0.7 + rnd() * 0.5));
      const cell = document.createElement("i");
      cell.style.setProperty("--o", (0.08 + 0.9 * v).toFixed(2));
      cell.style.transitionDelay = `${(d * 24 + h) * 4}ms`;
      if (asks[d].includes(h)) { cell.className = "ask"; cell.style.setProperty("--o", "1"); }
      col.appendChild(cell);
    }
    col.addEventListener("click", () => selectDay(d));
    gridEl.appendChild(col);
  }

  function renderDays() {
    const L = dict[lang];
    daysEl.innerHTML = "";
    L.days.forEach((name, d) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.id = `day-${d}`;
      b.textContent = name;
      b.setAttribute("aria-selected", String(d === selDay));
      b.setAttribute("aria-label", L.daysLong[d]);
      b.tabIndex = d === selDay ? 0 : -1;
      b.addEventListener("click", () => selectDay(d));
      b.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          selectDay((selDay + (e.key === "ArrowRight" ? 1 : 6)) % 7, true);
        }
      });
      daysEl.appendChild(b);
    });
  }

  // ru: [1, 2–4, 5+]; en: [1, other]
  function plural(n, forms) {
    if (forms.length === 2) return forms[n === 1 ? 0 : 1];
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return forms[0];
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return forms[1];
    return forms[2];
  }

  function renderSummary() {
    const L = dict[lang];
    const n = asks[selDay].length;
    sumEl.innerHTML = `
      <span><span class="big"></span><span class="lbl"></span></span>
      <span><span class="big amber"></span><span class="lbl"></span></span>
      <span class="note"></span>`;
    const parts = sumEl.querySelectorAll(".big, .lbl, .note");
    parts[0].textContent = actions[selDay].toLocaleString(lang);
    parts[1].textContent = plural(actions[selDay], L.actions);
    parts[2].textContent = n;
    parts[3].textContent = plural(n, L.asks);
    parts[4].textContent = `${L.daysLong[selDay].toLowerCase()} · ${L.notes[selDay]}`;
  }

  function selectDay(d, focus) {
    selDay = d;
    renderDays();
    gridEl.querySelectorAll(".heat-col").forEach((c, i) => c.classList.toggle("sel", i === d));
    renderSummary();
    if (focus) document.getElementById(`day-${d}`).focus();
  }
  langListeners.push(() => selectDay(selDay));

  /* ================= Boot ================= */
  applyLang();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(startFlow);
  else startFlow();
})();
