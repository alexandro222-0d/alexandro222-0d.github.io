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

  /* ================= Ribbons (WebGL) ================= */
  // One long ribbon snakes down the whole page in document coordinates.
  // The canvas sits *in* the document (not fixed) and is taller than the screen,
  // so native scrolling moves it with the content; it is re-anchored only near its edge.
  // All strand motion runs in the vertex shader on the GPU: the CPU uploads geometry
  // once per anchor and then only sets a time uniform each frame.
  const hero = document.querySelector(".hero");
  const cv = document.getElementById("ribbons");
  let W = 0, H = 0, PH = 0, CH = 0, dpr = 1, strands = 80, particles = [];
  let way = [], docH = 0, spread = 200, bufTop = -1;
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  let shownOpacity = -1;

  const gl = cv.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  if (!gl) cv.hidden = true;

  const FS_RAMP = `
    precision mediump float;
    uniform vec2 uView;
    varying vec2 vP;
    vec3 ramp() {
      float t = clamp((vP.x / uView.x + 1.0 - vP.y / uView.y) * 0.5, 0.0, 1.0);
      vec3 teal = vec3(0.37, 0.83, 0.77), lime = vec3(0.78, 0.96, 0.35), hi = vec3(0.84, 0.98, 0.47);
      vec3 c = mix(teal, lime, smoothstep(0.0, 0.35, t));
      c = mix(c, hi, smoothstep(0.35, 0.7, t));
      return mix(c, teal, smoothstep(0.75, 1.0, t));
    }`;
  const VS_HEAD = `
    uniform float uTime; uniform float uSpread; uniform vec2 uRes; uniform vec2 uMouse;
    varying vec2 vP;
    vec4 clip(vec2 p) { return vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0); }
    float envAt(float g) { return 0.68 + 0.32 * sin(g * 1.3 + 0.4); }
    // signed bend limit: offsets toward the inside of a curve ease off before they cross its centre
    float bend(float off, float lim) {
      if (lim > 0.0 && off > 0.0) return lim * (1.0 - exp(-off / lim));
      if (lim < 0.0 && off < 0.0) return lim * (1.0 - exp(off / lim));
      return off;
    }`;

  const LINE_VS = VS_HEAD + `
    attribute vec2 aPos; attribute vec2 aNor; attribute vec4 aMeta; // g, u, alpha, strand
    attribute float aLim;
    uniform float uNudge; // second pass shifted ~1px along the normal makes each strand thicker
    varying float vA;
    void main() {
      float g = aMeta.x, u = aMeta.y;
      float env = envAt(g);
      float tw = sin(g * 2.2 - uTime * 0.42 + u * 1.2) * 0.85 + sin(g * 4.7 + uTime * 0.6 + aMeta.w * 0.07) * 0.15;
      tw = tw * 0.8 + 0.3; // keeps the twist but never collapses the ribbon to a thread
      float off = bend(env * (u * uSpread * tw + sin(g * 1.7 + u * 9.0 + uTime * 0.3) * 6.0), aLim) + uNudge;
      vec2 p = aPos + aNor * off + uMouse;
      vP = p; vA = aMeta.z;
      gl_Position = clip(p);
    }`;
  const LINE_FS = FS_RAMP + `
    varying float vA;
    void main() { gl_FragColor = vec4(ramp() * vA, vA); }`;

  // soft halo under the strands replaces the old blurred copy
  const HALO_VS = VS_HEAD + `
    attribute vec2 aPos; attribute vec2 aNor; attribute vec2 aGS; // g, side (-1..1)
    attribute float aLim;
    varying float vSide; varying float vEnv;
    void main() {
      float g = aGS.x;
      float env = envAt(g);
      float tw = sin(g * 2.2 - uTime * 0.42) * 0.8 + 0.3;
      float w = uSpread * env * (abs(tw) * 0.6 + 0.14) + 46.0;
      vec2 p = aPos + aNor * bend(aGS.y * w, aLim * 1.15) + uMouse;
      vP = p; vSide = aGS.y; vEnv = env;
      gl_Position = clip(p);
    }`;
  const HALO_FS = FS_RAMP + `
    varying float vSide; varying float vEnv;
    void main() {
      float a = pow(1.0 - abs(vSide), 2.0) * 0.2 * vEnv;
      gl_FragColor = vec4(ramp() * a, a);
    }`;

  const DOT_VS = `
    uniform vec2 uRes; uniform float uDpr;
    attribute vec4 aDot; // x, y, alpha, radius
    varying float vA;
    void main() {
      vA = aDot.z;
      gl_PointSize = aDot.w * 2.0 * uDpr + 1.0;
      gl_Position = vec4(aDot.x / uRes.x * 2.0 - 1.0, 1.0 - aDot.y / uRes.y * 2.0, 0.0, 1.0);
    }`;
  const DOT_FS = `
    precision mediump float;
    varying float vA;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      float a = vA * smoothstep(0.5, 0.15, d);
      gl_FragColor = vec4(vec3(0.87, 1.0, 0.59) * a, a);
    }`;

  function program(vs, fs) {
    const mk = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, mk(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const loc = (n) => gl.getUniformLocation(p, n);
    const att = (n) => gl.getAttribLocation(p, n);
    return { p, loc, att };
  }

  let P = null; // programs + buffers
  function initGL() {
    if (!gl) return false;
    try {
      P = {
        line: program(LINE_VS, LINE_FS),
        halo: program(HALO_VS, HALO_FS),
        dot: program(DOT_VS, DOT_FS),
        lineBuf: gl.createBuffer(), haloBuf: gl.createBuffer(), dotBuf: gl.createBuffer(),
        nPts: 0
      };
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE); // additive, like canvas "lighter"
      return true;
    } catch (e) {
      cv.hidden = true; P = null;
      return false;
    }
  }

  function buildPath() {
    docH = document.documentElement.scrollHeight;
    const mobile = W < 960;
    let s = 11;
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    // enters from the top right, coils through the hero, then swings side to side down the page
    way = mobile
      ? [[1.3 * W, 0.42 * PH], [0.62 * W, 0.82 * PH], [0.16 * W, 1.18 * PH]] // below the headline on phones
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
    spread = Math.min(W, PH) * (mobile ? 0.42 : 0.36);
    const nSeg = way.length - 1;
    const want = Math.min(260, nSeg * (mobile ? 10 : 20));
    while (particles.length < want) {
      particles.push({ g: r() * nSeg, u: r() - 0.5, v: 0.0007 + r() * 0.0018, r: r() * 1.6 + 0.8, ph: r() * Math.PI * 2 });
    }
    particles.length = want;
    particles.forEach((q) => { q.g %= nSeg; });
    bufTop = -1; // force geometry rebuild
  }

  function sizeCanvas() {
    CH = Math.ceil(PH * 1.5);
    cv.width = Math.round(W * dpr); cv.height = Math.round(CH * dpr);
    cv.style.height = CH + "px";
    if (gl) gl.viewport(0, 0, cv.width, cv.height);
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
      const mobile = W < 700;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 2 : 1.5);
      strands = mobile ? 64 : 110;
      sizeCanvas();
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

  // sample the segments crossing the canvas once per anchor and upload them
  function buildGeometry() {
    if (!P) return;
    const top = bufTop - spread * 1.6, bottom = bufTop + CH + spread * 1.6;
    const pts = [];
    for (let i = 0; i < way.length - 1; i++) {
      const y0 = Math.min(way[i][1], way[i + 1][1]), y1 = Math.max(way[i][1], way[i + 1][1]);
      if (y1 < top || y0 > bottom) continue;
      const len = Math.hypot(way[i + 1][0] - way[i][0], way[i + 1][1] - way[i][1]);
      const steps = Math.max(16, Math.ceil(len / 8));
      for (let k = (pts.length ? 1 : 0); k <= steps; k++) {
        const t = k / steps;
        const p = at(i, t);
        pts.push(p[0], p[1] - bufTop, p[2], p[3], i + t);
      }
    }
    const n = pts.length / 5;
    P.nPts = n;
    if (!n) return;

    // radius of curvature per point → signed limit (+ when the inside of the bend is along +normal)
    const lim = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      const a = Math.max(0, k - 2) * 5, b = Math.min(n - 1, k + 2) * 5, c = k * 5;
      const ta = [pts[a + 3], -pts[a + 2]], tb = [pts[b + 3], -pts[b + 2]];
      const dTx = tb[0] - ta[0], dTy = tb[1] - ta[1];
      const ds = Math.hypot(pts[b] - pts[a], pts[b + 1] - pts[a + 1]) || 1;
      const kappa = Math.hypot(dTx, dTy) / ds;
      const R = kappa > 1e-6 ? 1 / kappa : 1e5;
      const inner = pts[c + 2] * dTx + pts[c + 3] * dTy >= 0 ? 1 : -1;
      lim[k] = inner * Math.min(R * 0.85, 1e5);
    }
    // soften: each point takes the tightest limit nearby so the squeeze eases in
    const soft = new Float32Array(n);
    for (let k = 0; k < n; k++) {
      let best = lim[k];
      for (let j = Math.max(0, k - 6); j <= Math.min(n - 1, k + 6); j++) {
        if (Math.sign(lim[j]) === Math.sign(lim[k]) && Math.abs(lim[j]) < Math.abs(best)) best = lim[j];
      }
      soft[k] = best;
    }

    // strands: x, y, nx, ny, g, u, alpha, index
    const line = new Float32Array(strands * n * 9);
    const lift = Math.min(2, 0.6 + 0.4 * dpr); // device-pixel lines are thinner on dense screens
    let o = 0;
    for (let i = 0; i < strands; i++) {
      const u = i / (strands - 1) - 0.5;
      const edge = Math.abs(u) * 2;
      const alpha = (0.05 + 0.32 * Math.pow(1 - edge, 2) + 0.1 * Math.pow(edge, 6)) * lift * (84 / strands) ** 0.5;
      const idx = i * (84 / strands);
      for (let k = 0; k < n; k++) {
        const q = k * 5;
        line[o++] = pts[q]; line[o++] = pts[q + 1]; line[o++] = pts[q + 2]; line[o++] = pts[q + 3];
        line[o++] = pts[q + 4]; line[o++] = u; line[o++] = alpha; line[o++] = idx; line[o++] = soft[k];
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, P.lineBuf);
    gl.bufferData(gl.ARRAY_BUFFER, line, gl.STATIC_DRAW);

    // halo strip: x, y, nx, ny, g, side
    const halo = new Float32Array(n * 2 * 7);
    o = 0;
    for (let k = 0; k < n; k++) {
      const q = k * 5;
      for (const side of [-1, 1]) {
        halo[o++] = pts[q]; halo[o++] = pts[q + 1]; halo[o++] = pts[q + 2]; halo[o++] = pts[q + 3];
        halo[o++] = pts[q + 4]; halo[o++] = side; halo[o++] = soft[k];
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, P.haloBuf);
    gl.bufferData(gl.ARRAY_BUFFER, halo, gl.STATIC_DRAW);
  }

  function needsAnchor(sy) {
    const margin = H * 0.1;
    const maxTop = Math.max(0, docH - CH);
    return bufTop < 0 ||
      (sy < bufTop + margin && bufTop > 0) ||
      (sy + H > bufTop + CH - margin && bufTop < maxTop);
  }

  function anchor(sy) {
    if (!needsAnchor(sy)) return;
    const maxTop = Math.max(0, docH - CH);
    bufTop = Math.round(Math.min(maxTop, Math.max(0, sy - (CH - H) / 2)));
    cv.style.transform = `translate3d(0, ${bufTop}px, 0)`;
    buildGeometry();
  }

  function updateOpacity(sy) {
    // full strength over the hero, quieter behind reading content
    const fade = Math.min(1, sy / Math.max(1, hero.offsetHeight * 0.8));
    const op = +(1 - 0.4 * fade).toFixed(2);
    if (op !== shownOpacity) { shownOpacity = op; cv.style.opacity = op; }
  }

  function setCommon(prog, time, mx, my) {
    gl.useProgram(prog.p);
    gl.uniform2f(prog.loc("uRes"), W, CH);
    gl.uniform2f(prog.loc("uView"), W, CH);
    const lt = prog.loc("uTime"); if (lt) gl.uniform1f(lt, time);
    const ls = prog.loc("uSpread"); if (ls) gl.uniform1f(ls, spread);
    const lm = prog.loc("uMouse"); if (lm) gl.uniform2f(lm, mx, my);
  }
  function attr(prog, name, size, stride, offset) {
    const a = prog.att(name);
    if (a < 0) return;
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, size, gl.FLOAT, false, stride * 4, offset * 4);
  }
  function disableAttrs() { for (let i = 0; i < 5; i++) gl.disableVertexAttribArray(i); }

  let dotData = new Float32Array(0);
  function draw(time) {
    if (!P) return;
    if (Math.abs(document.documentElement.scrollHeight - docH) > 4) buildPath();
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    anchor(window.scrollY);
    const mx = (mouse.x - 0.5) * 36, my = (mouse.y - 0.5) * 24;

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const n = P.nPts;
    if (!n) return;

    // halo
    setCommon(P.halo, time, mx, my);
    gl.bindBuffer(gl.ARRAY_BUFFER, P.haloBuf);
    attr(P.halo, "aPos", 2, 7, 0); attr(P.halo, "aNor", 2, 7, 2); attr(P.halo, "aGS", 2, 7, 4); attr(P.halo, "aLim", 1, 7, 6);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n * 2);
    disableAttrs();

    // strands
    setCommon(P.line, time, mx, my);
    gl.bindBuffer(gl.ARRAY_BUFFER, P.lineBuf);
    attr(P.line, "aPos", 2, 9, 0); attr(P.line, "aNor", 2, 9, 2); attr(P.line, "aMeta", 4, 9, 4); attr(P.line, "aLim", 1, 9, 8);
    const nudge = P.line.loc("uNudge");
    for (const d of [0, 1.1]) {
      gl.uniform1f(nudge, d);
      for (let i = 0; i < strands; i++) gl.drawArrays(gl.LINE_STRIP, i * n, n);
    }
    disableAttrs();

    // particles riding the ribbon (few, so the CPU places them)
    const nSeg = way.length - 1;
    const top = bufTop - spread, bottom = bufTop + CH + spread;
    if (dotData.length < particles.length * 4) dotData = new Float32Array(particles.length * 4);
    let c = 0;
    for (const p of particles) {
      if (!reduceMotion) p.g = (p.g + p.v) % nSeg;
      const i = Math.floor(p.g);
      if (Math.max(way[i][1], way[i + 1][1]) < top || Math.min(way[i][1], way[i + 1][1]) > bottom) continue;
      const [x, y, nx, ny] = at(i, p.g - i);
      const env = 0.68 + 0.32 * Math.sin(p.g * 1.3 + 0.4);
      const off = p.u * spread * env * (Math.sin(p.g * 2.2 - time * 0.42 + p.u * 1.2) * 0.8 + 0.3) * 1.2;
      const py = y + ny * off - bufTop + my;
      if (py < -10 || py > CH + 10) continue;
      dotData[c++] = x + nx * off + mx; dotData[c++] = py;
      dotData[c++] = (0.35 + 0.65 * Math.abs(Math.sin(time * 1.4 + p.ph))) * env;
      dotData[c++] = p.r;
    }
    if (c) {
      gl.useProgram(P.dot.p);
      gl.uniform2f(P.dot.loc("uRes"), W, CH);
      gl.uniform1f(P.dot.loc("uDpr"), dpr);
      gl.bindBuffer(gl.ARRAY_BUFFER, P.dotBuf);
      gl.bufferData(gl.ARRAY_BUFFER, dotData.subarray(0, c), gl.DYNAMIC_DRAW);
      attr(P.dot, "aDot", 4, 4, 0);
      gl.drawArrays(gl.POINTS, 0, c / 4);
      disableAttrs();
    }
  }

  cv.addEventListener("webglcontextlost", (e) => { e.preventDefault(); P = null; });
  cv.addEventListener("webglcontextrestored", () => { if (initGL()) { gl.viewport(0, 0, cv.width, cv.height); bufTop = -1; } });

  /* ---- smooth wheel scrolling (Lenis); touch keeps native momentum ---- */
  let lenis = null;
  if (!reduceMotion && typeof window.Lenis === "function") {
    try {
      lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1 });
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
    lenis.scrollTo(id === "#top" ? 0 : el, { offset: navOffset(), duration: 1.2 });
  });

  let heroVisible = true, raf = 0, startT = performance.now();
  function loop(now) {
    if (lenis) lenis.raf(now);
    updateOpacity(window.scrollY);
    draw((now - startT) / 1000);
    raf = !document.hidden ? requestAnimationFrame(loop) : 0;
  }
  function kick() { if (!raf && !document.hidden && !reduceMotion) raf = requestAnimationFrame(loop); }

  initGL();
  resize(true);
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);
  updateOpacity(window.scrollY);
  if (reduceMotion) {
    draw(4);
    window.addEventListener("scroll", () => { updateOpacity(window.scrollY); draw(4); }, { passive: true });
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
