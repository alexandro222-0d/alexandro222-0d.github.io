(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // hero entrance: on for ~1.6s, then removed so the end state never depends on the animation
  if (!reduceMotion && !document.hidden) {
    document.documentElement.classList.add("intro");
    setTimeout(() => document.documentElement.classList.remove("intro"), 1700);
  }

  /* ================= i18n ================= */
  const dict = {
    ru: {
      "meta.title": "Helix — ДНК-тест",
      skip: "Перейти к содержанию",
      "nav.aria": "Основное", "nav.guess": "Угадай себя", "nav.stories": "Отчёт", "nav.how": "Как это работает", "nav.pricing": "Цены",
      "cta.short": "Заказать тест", "cta.order": "Заказать тест", "cta.peek": "Что я узнаю?",
      "hero.sr": "Узнай, почему ты такой, какой есть",
      "hero.h1": "Узнай, почему ты",
      rot: ["сова", "чихаешь на солнце", "не любишь кинзу", "не спишь после кофе", "быстро бегаешь", "обгораешь за 10 минут"],
      "hero.lead": "ДНК-тест, который понятно рассказывает о тебе. Сдай слюну дома — через 4 недели узнаешь, можно ли тебе молоко, когда тебе лучше спать и сколько в тебе неандертальца.",
      "gs.h2": "Угадай себя.",
      "gs.p": "Ответ на каждый вопрос уже записан в твоей ДНК. Переверни карточку — посмотри, какой ген за это отвечает.",
      flip: "перевернуть",
      cards: [
        ["Кинза пахнет тебе мылом?", "OR6A2", "обонятельный рецептор", "У части людей вариант этого гена делает кинзу «мыльной». Дело не во вкусах, а в обонянии.", "c-violet", "A"],
        ["Чихаешь, когда выходишь на солнце?", "ZEB2", "вариант рядом с этим геном", "«Солнечный чих» бывает у каждого четвёртого и передаётся по наследству.", "c-teal", "T"],
        ["Сова или жаворонок?", "PER3", "ген циркадных часов", "Варианты генов внутренних часов сдвигают твой будильник на час-другой.", "c-ink", "G"],
        ["Взрослым можно молоко?", "MCM6", "вариант рядом с геном лактазы", "Одна буква решает, переваривает ли взрослый молоко. В Европе чаще да, в Азии чаще нет.", "c-orchid", "C"],
        ["Кофе после обеда — норм?", "CYP1A2", "фермент печени", "От него зависит, выведется кофеин за 3 часа или за 8. Поэтому вечерний кофе одним мешает спать, а другим нет.", "c-sky", "A"],
        ["Спринтер или марафонец?", "ACTN3", "белок быстрых мышц", "Примерно у каждого пятого европейца этого белка нет совсем. Среди спринтеров таких почти не встречается.", "c-violet", "T"]
      ],
      "st.h2": "Отчёт, который хочется листать.",
      "st.p": "Никаких таблиц на 40 страниц. Главное о тебе — короткими карточками, а подробности, если интересно, на одно касание глубже.",
      "st.l1": "170+ фактов о тебе", "st.l2": "Новые разделы приходят бесплатно", "st.l3": "Разбор с генетиком, если найдём что-то важное",
      "st.aria": "Пример отчёта", "st.prev": "Назад", "st.next": "Дальше", "st.tag": "пример",
      slides: [
        { c: "s-teal", big: "2,1%", say: "Столько в тебе неандертальца.", note: "Больше, чем у 64% людей с тестом." },
        { c: "s-violet", big: "00:40", say: "Твой идеальный отбой.", note: "Ты сова: гены внутренних часов сдвигают твой ритм." },
        { c: "s-ink", dots: true, say: "Кинза пахнет тебе мылом.", note: "Как у 1 из 7 человек. Вариант гена OR6A2." },
        { c: "s-lav", say: "Откуда твои предки", anc: [["Восточная Европа", 61], ["Скандинавия", 18], ["Балканы", 12], ["Кавказ", 9]] },
        { c: "s-orchid", big: "R/R", say: "Тебе ближе спринт, чем марафон.", note: "Ген ACTN3: обе копии «быстрые»." }
      ],
      kicker: (i, n) => `о тебе · ${i}/${n}`,
      "how.s1": "Собери.", "how.p1": "2 мл слюны в пробирку дома. Больше ничего не нужно.",
      "how.s2": "Отправь.", "how.p2": "Курьер заберёт пробирку бесплатно в любом городе Беларуси.",
      "how.s3": "Узнай.", "how.p3": "Через 4 недели отчёт появится в приложении.",
      "pc.h2": "Один тест на всю жизнь.",
      "pc.p": "ДНК не меняется, поэтому платишь только раз. Тест можно подарить: мы пришлём подарочный набор.",
      "pc.n1": "Базовый", "pc.a1": "Еда, спорт, сон и привычки", "pc.a2": "Откуда твои предки", "pc.a3": "Сколько в тебе неандертальца", "pc.c1": "Выбрать «Базовый»",
      "pc.n2": "Полный", "pc.badge": "популярный", "pc.b1": "Всё из «Базового»", "pc.b2": "Наследственные риски для здоровья", "pc.b3": "Созвон с врачом-генетиком", "pc.c2": "Выбрать «Полный»",
      "fin.h2": "Готов узнать о себе больше?", "fin.p": "Одна пробирка, четыре недели — и ты знаешь о себе больше, чем вчера.", "fin.cta": "Заказать тест", "fin.gift": "Подарить другу",
      "fq.h2": "Ещё вопросы?",
      "fq.q1": "Это больно?", "fq.a1": "Нет. Никакой крови — только слюна. Самое сложное: полчаса до этого не есть и не пить.",
      "fq.q2": "А если узнаю что-то страшное?", "fq.a2": "Риски для здоровья открываются только в «Дотошном» и только по твоему желанию. Если найдём что-то важное, врач-генетик спокойно всё объяснит.",
      "fq.q3": "Кто увидит мою ДНК?", "fq.a3": "Только ты. Мы не продаём данные и удаляем всё по одной кнопке в приложении.",
      "fq.q4": "Насколько это точно?", "fq.a4": "Лаборатория читает ДНК с точностью выше 99%. А вот гены — это склонности, а не приговор: мы честно пишем, где связь сильная, а где так себе.",
      "foot.line": "© 2026 Helix · Минск", "foot.aria": "Подвал", "foot.note": "концепт для портфолио",
      bonds: (n) => `${n} водородные связи`
    },
    en: {
      "meta.title": "Helix — DNA test",
      skip: "Skip to content",
      "nav.aria": "Main", "nav.guess": "Guess yourself", "nav.stories": "Report", "nav.how": "How it works", "nav.pricing": "Pricing",
      "cta.short": "Get the test", "cta.order": "Get the test", "cta.peek": "What will I learn?",
      "hero.sr": "Find out why you are the way you are",
      "hero.h1": "Find out why you",
      rot: ["are a night owl", "sneeze at the sun", "hate cilantro", "can't sleep after coffee", "run so fast", "burn in 10 minutes"],
      "hero.lead": "A DNA test that explains you in plain words. Give a saliva sample at home and in 4 weeks you'll know whether milk is your friend, when you should sleep and how much Neanderthal you carry.",
      "gs.h2": "Guess yourself.",
      "gs.p": "The answer to each question is already written in your DNA. Flip a card to see which gene is behind it.",
      flip: "flip it",
      cards: [
        ["Does cilantro taste like soap?", "OR6A2", "a smell receptor", "For some people a variant of this gene makes cilantro soapy. It's not picky eating — it's your nose.", "c-violet", "A"],
        ["Do you sneeze when you step into the sun?", "ZEB2", "a variant near this gene", "The \"sun sneeze\" happens to about one in four people, and it runs in families.", "c-teal", "T"],
        ["Night owl or early bird?", "PER3", "a body-clock gene", "Clock gene variants shift your inner alarm by an hour or two.", "c-ink", "G"],
        ["Can grown-ups drink milk?", "MCM6", "a variant near the lactase gene", "One letter decides whether an adult digests milk. Mostly yes in Europe, mostly no in Asia.", "c-orchid", "C"],
        ["Coffee after lunch — fine?", "CYP1A2", "a liver enzyme", "It decides whether caffeine clears in 3 hours or 8. That's why evening coffee keeps some people awake and not others.", "c-sky", "A"],
        ["Sprinter or marathoner?", "ACTN3", "a fast-muscle protein", "About one in five Europeans makes none of it at all. You'll hardly find them among sprinters.", "c-violet", "T"]
      ],
      "st.h2": "A report you'll want to swipe.",
      "st.p": "No 40-page tables. The big things about you, in short cards — and the details one tap deeper if you're curious.",
      "st.l1": "170+ facts about you", "st.l2": "New sections arrive for free", "st.l3": "A geneticist call if we find something important",
      "st.aria": "Sample report", "st.prev": "Back", "st.next": "Next", "st.tag": "sample",
      slides: [
        { c: "s-teal", big: "2.1%", say: "That's how Neanderthal you are.", note: "More than 64% of people who took the test." },
        { c: "s-violet", big: "00:40", say: "Your ideal bedtime.", note: "You're a night owl: your clock genes shift your rhythm." },
        { c: "s-ink", dots: true, say: "Cilantro tastes like soap to you.", note: "Like 1 in 7 people. An OR6A2 variant." },
        { c: "s-lav", say: "Where your ancestors came from", anc: [["Eastern Europe", 61], ["Scandinavia", 18], ["Balkans", 12], ["Caucasus", 9]] },
        { c: "s-orchid", big: "R/R", say: "You're built more for sprints than marathons.", note: "ACTN3: both copies are the \"fast\" kind." }
      ],
      kicker: (i, n) => `about you · ${i}/${n}`,
      "how.s1": "Collect.", "how.p1": "2 ml of saliva into the tube at home. Nothing else is needed.",
      "how.s2": "Send.", "how.p2": "A courier picks it up for free in any town in Belarus.",
      "how.s3": "Find out.", "how.p3": "In 4 weeks your report appears in the app.",
      "pc.h2": "One test for life.",
      "pc.p": "Your DNA doesn't change, so you pay once. You can also gift it: we'll send a gift kit.",
      "pc.n1": "Basic", "pc.a1": "Food, fitness, sleep and habits", "pc.a2": "Where your ancestors came from", "pc.a3": "How Neanderthal you are", "pc.c1": "Choose Basic",
      "pc.n2": "Complete", "pc.badge": "most picked", "pc.b1": "Everything in Basic", "pc.b2": "Inherited health risks", "pc.b3": "A call with a geneticist", "pc.c2": "Choose Complete",
      "fin.h2": "Ready to learn more about yourself?", "fin.p": "One tube and four weeks to your first report.", "fin.cta": "Get the test", "fin.gift": "Gift it to a friend",
      "fq.h2": "More questions?",
      "fq.q1": "Does it hurt?", "fq.a1": "No. No blood, just saliva. The hardest part: no food or drink for half an hour before.",
      "fq.q2": "What if I find out something scary?", "fq.a2": "Health risks only open in Thorough, and only if you choose to see them. If we find something important, a geneticist will walk you through it calmly.",
      "fq.q3": "Who sees my DNA?", "fq.a3": "Only you. We don't sell data, and one button in the app deletes everything.",
      "fq.q4": "How accurate is it?", "fq.a4": "The lab reads DNA with over 99% accuracy. Genes are tendencies, not verdicts — we say plainly where the link is strong and where it's weak.",
      "foot.line": "© 2026 Helix · Minsk", "foot.aria": "Footer", "foot.note": "portfolio concept",
      bonds: (n) => `${n} hydrogen bonds`
    }
  };

  let lang = "ru";
  try {
    const saved = localStorage.getItem("helix-lang");
    if (saved === "ru" || saved === "en") lang = saved;
    else if (!/^(ru|be|uk|kk)/i.test(navigator.language || "")) lang = "en";
  } catch (e) { /* storage unavailable */ }

  const t = (k) => dict[lang][k];
  const langListeners = [];

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    document.querySelectorAll("[data-i18n]").forEach((n) => {
      const v = t(n.dataset.i18n);
      if (typeof v === "string") n.textContent = v;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((n) => {
      n.setAttribute("aria-label", t(n.dataset.i18nAria));
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
      try { localStorage.setItem("helix-lang", lang); } catch (e) { /* ignore */ }
      applyLang();
    });
  });

  const BASES = ["A", "T", "G", "C"];
  const tip = document.getElementById("tip");
  let tipOwner = null;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ================= Rotating word ================= */
  // One font size for every phrase (fitted to the longest one), so the pill only changes width.
  const rotEl = document.getElementById("rot");
  const rotWord = document.getElementById("rot-word");
  const COLORS = ["var(--violet)", "#16b89c", "var(--violet-deep)", "#b04fd6", "#2b8be0", "#16b89c"];
  let rotIdx = 0, rotTimer = 0, rotBusy = false;

  function measure(text) {
    const m = document.createElement("span");
    m.className = "rot-word";
    m.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap";
    m.textContent = text;
    rotEl.appendChild(m);
    const w = m.getBoundingClientRect().width;
    m.remove();
    return w;
  }
  const narrow = () => window.innerWidth < 640;
  function fitRot() {
    rotEl.style.fontSize = "";
    if (narrow()) { rotEl.style.width = ""; return; } // phones: same size as the headline, wraps like a marker
    const pad = parseFloat(getComputedStyle(rotEl).paddingLeft) * 2;
    const avail = rotEl.closest(".h1").clientWidth - 2;
    const longest = Math.max(...t("rot").map(measure));
    const scale = Math.min(1, avail / (longest + pad));
    rotEl.style.fontSize = scale < 1 ? scale.toFixed(3) + "em" : "";
    rotEl.style.width = (measure(rotWord.textContent) + parseFloat(getComputedStyle(rotEl).paddingLeft) * 2) + "px";
  }
  function setRot(i, animate) {
    rotIdx = i;
    const word = t("rot")[i];
    if (!animate) {
      rotWord.className = "rot-word";
      rotWord.textContent = word;
      rotEl.style.backgroundColor = COLORS[i % COLORS.length];
      fitRot();
      return;
    }
    rotBusy = true;
    rotWord.className = "rot-word out";
    rotWord.addEventListener("animationend", () => {
      rotWord.textContent = word;
      if (!narrow()) rotEl.style.width = (measure(word) + parseFloat(getComputedStyle(rotEl).paddingLeft) * 2) + "px";
      rotEl.style.backgroundColor = COLORS[i % COLORS.length];
      rotWord.className = "rot-word in";
      rotWord.addEventListener("animationend", () => { rotWord.className = "rot-word"; rotBusy = false; }, { once: true });
    }, { once: true });
  }
  function startRot() {
    clearInterval(rotTimer);
    if (reduceMotion) return;
    rotTimer = setInterval(() => {
      if (document.hidden || rotBusy) return;
      setRot((rotIdx + 1) % t("rot").length, true);
    }, 2800);
  }
  langListeners.push(() => setRot(rotIdx % t("rot").length, false));

  /* ================= Flip cards ================= */
  const cardsEl = document.getElementById("cards");
  const flipped = new Set();
  function renderCards() {
    cardsEl.innerHTML = "";
    t("cards").forEach(([q, gene, sub, text, color, letter], i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "card";
      b.setAttribute("aria-pressed", String(flipped.has(i)));
      b.innerHTML = `
        <span class="card-in">
          <span class="face front">
            <span class="q">${esc(q)}</span>
            <span class="hint">${esc(t("flip"))}</span>
            <span class="letter b-${letter.toLowerCase()}" aria-hidden="true">${letter}</span>
          </span>
          <span class="face back ${color}">
            <span class="gene">${esc(gene)}<small>${esc(sub)}</small></span>
            <p>${esc(text)}</p>
          </span>
        </span>`;
      b.addEventListener("click", () => {
        const on = !flipped.has(i);
        if (on) flipped.add(i); else flipped.delete(i);
        b.setAttribute("aria-pressed", String(on));
      });
      cardsEl.appendChild(b);
    });
  }
  langListeners.push(renderCards);

  /* ================= Stories ================= */
  const phone = document.getElementById("phone");
  const barsEl = document.getElementById("bars");
  const slidesEl = document.getElementById("slides");
  const DUR = 4500;
  let sIdx = 0, inView = false, hovering = false;

  function slideHTML(s, i, n) {
    let mid = "";
    if (s.big) mid = `<div class="big">${esc(s.big)}</div>`;
    if (s.dots) mid = `<div class="dots7" aria-hidden="true">${"<i></i>".repeat(3)}<i class="me"></i>${"<i></i>".repeat(3)}</div>`;
    if (s.anc) mid = `<div class="anc">${s.anc.map(([name, p]) => `<div><span>${esc(name)}</span><span>${p}%</span><i><b style="--w:${p}%"></b></i></div>`).join("")}</div>`;
    return `<div class="slide ${s.c}" role="group" aria-label="${i + 1} / ${n}">
      <span class="kicker">${esc(t("kicker")(i + 1, n))}</span>
      ${mid}
      <div><p class="say">${esc(s.say)}</p>${s.note ? `<p class="note">${esc(s.note)}</p>` : ""}</div>
    </div>`;
  }
  function renderStories() {
    const sl = t("slides");
    slidesEl.innerHTML = sl.map((s, i) => slideHTML(s, i, sl.length)).join("");
    barsEl.innerHTML = sl.map(() => "<i><b></b></i>").join("");
    barsEl.querySelectorAll("b").forEach((b) => b.addEventListener("animationend", () => go(sIdx + 1)));
    go(sIdx % sl.length, true);
  }
  function go(i, force) {
    const n = t("slides").length;
    sIdx = (i + n) % n;
    slidesEl.querySelectorAll(".slide").forEach((s, k) => s.classList.toggle("on", k === sIdx));
    barsEl.querySelectorAll("i").forEach((bar, k) => {
      bar.classList.remove("run", "done");
      if (k < sIdx) bar.classList.add("done");
      if (k === sIdx) {
        const b = bar.querySelector("b");
        b.style.animation = "none"; void b.offsetWidth; b.style.animation = "";
        if (reduceMotion) bar.classList.add("done"); else bar.classList.add("run");
      }
    });
    syncPause();
  }
  function syncPause() { phone.classList.toggle("paused", !inView || hovering || document.hidden); }
  phone.style.setProperty("--dur", DUR + "ms");
  document.getElementById("prev").addEventListener("click", () => go(sIdx - 1));
  document.getElementById("next").addEventListener("click", () => go(sIdx + 1));
  phone.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(sIdx + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(sIdx - 1); }
  });
  phone.addEventListener("mouseenter", () => { hovering = true; syncPause(); });
  phone.addEventListener("mouseleave", () => { hovering = false; syncPause(); });
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; syncPause(); }, { threshold: 0.35 }).observe(phone);
  document.addEventListener("visibilitychange", syncPause);
  langListeners.push(renderStories);

  /* ================= Nav ================= */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ================= Reveal ================= */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.remove("pending"); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  document.querySelectorAll(".reveal").forEach((n) => {
    if (!reduceMotion && n.getBoundingClientRect().top > window.innerHeight) n.classList.add("pending");
    revealIO.observe(n);
  });

  /* ================= DNA helix (WebGL) ================= */
  // A shaded 3D double helix. In the hero it is large and crosses the screen; then it
  // turns and runs down the page behind the content (document coordinates). The canvas
  // sits in the document, taller than the screen, so native scrolling moves it with the
  // content; it is re-anchored only near its edge.
  // Model: sugar-phosphate backbones as lit tubes with phosphate beads, bases as rods
  // coloured A/T/G/C, 10.5 base pairs per turn, pitch ≈ 3.4 × radius, strands offset to
  // form the major/minor grooves. It unzips around the pricing plans.
  const hero = document.querySelector(".hero");
  const band = document.getElementById("hero-band");
  const cv = document.getElementById("helix");
  const gl = cv.getContext("webgl", { antialias: true, alpha: true, depth: true, premultipliedAlpha: true, powerPreference: "high-performance" });
  if (!gl) cv.hidden = true;

  const GROOVE = 2.35;
  const BP_PHASE = (2 * Math.PI) / 10.5;
  const PITCH_K = 3.4;
  let W = 0, H = 0, PH = 0, CH = 0, dpr = 1;
  let RS = [100, 56, 0, 1]; // hero radius, body radius, transition y0, y1
  let way = [], docH = 0, bufTop = -1;
  let PX = new Float32Array(0), PY = PX, NX = PX, NY = PX, PA = PX, PP = PX, nPath = 0; // dense path, arc length, phase
  const STEP = 5;
  let zip = [1e9, 1e9, 1e9, 1e9];
  let particles = [];
  let rungs = [];
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  const pointer = { x: -1, y: -1, on: false };
  let rot = 0, hotPh = -1e9, shownOpacity = -1, time = 0;

  const HEAD = `
    uniform vec2 uRes; uniform vec2 uMouse; uniform float uTop; uniform float uRot;
    uniform vec4 uZip; uniform vec4 uRS;
    const float GROOVE = ${GROOVE.toFixed(3)};
    float rAt(float y) { return mix(uRS.x, uRS.y, smoothstep(uRS.z, uRS.w, y)); }
    float zipAt(float y) { return smoothstep(uZip.x, uZip.y, y) * (1.0 - smoothstep(uZip.z, uZip.w, y)); }
    vec4 clip(vec2 p, float depth) { return vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, -depth * 0.5, 1.0); }
    float latOf(float ph, float st, float z, float R) {
      float sep = (st < 0.5 ? -1.0 : 1.0) * R * 2.1;
      return mix(R * sin(ph), sep + 0.3 * R * sin(ph), z);
    }
    float depthOf(float ph, float z) { return mix(cos(ph), 0.4, z); }
    // simple perspective: things on the near side of the helix are drawn larger
    float persp(float depth) { return 1.0 + 0.22 * depth; }`;
  const FS_HEAD = `
    precision mediump float;
    const vec3 cA = vec3(0.243, 0.902, 0.784);
    const vec3 cT = vec3(0.37, 0.72, 1.0);
    const vec3 cG = vec3(0.545, 0.36, 1.0);
    const vec3 cC = vec3(0.88, 0.55, 1.0);
    const vec3 BG = vec3(0.043, 0.039, 0.078);
    const vec3 HAZE = vec3(0.13, 0.08, 0.26);
    vec3 fog(vec3 c, float depth) {
      float d = depth * 0.5 + 0.5;
      return mix(mix(BG, HAZE, 0.6), c, mix(0.42, 1.0, d * d)) * 1.08;
    }`;

  // backbone tubes
  const TUBE_VS = HEAD + `
    uniform float uGlow;
    attribute vec2 aPos; attribute vec2 aNor; attribute vec3 aPSS; // phase, side, strand
    varying float vDepth; varying float vSide; varying float vStrand; varying float vPh;
    void main() {
      float y = aPos.y + uTop;
      float R = rAt(y), z = zipAt(y);
      float st = aPSS.z, side = aPSS.y;
      float ph = aPSS.x + uRot + st * GROOVE;
      float lat = latOf(ph, st, z, R);
      float k = 6.2831853 / (R * ${PITCH_K.toFixed(1)});
      float dl = mix(R * k * cos(ph), 0.3 * R * k * cos(ph), z);
      float depth = depthOf(ph, z);
      vec2 T = vec2(aNor.y, -aNor.x);
      vec2 perp = normalize(aNor - dl * T);
      float p = persp(depth);
      float w = R * mix(0.045, 0.095, depth * 0.5 + 0.5) * p * (1.0 + uGlow * 3.2);
      gl_Position = clip(aPos + aNor * lat * p + perp * side * w + uMouse, depth);
      vDepth = depth; vSide = side; vStrand = st; vPh = ph;
    }`;
  const TUBE_FS = FS_HEAD + `
    uniform float uGlowF;
    varying float vDepth; varying float vSide; varying float vStrand; varying float vPh;
    void main() {
      float d = vDepth * 0.5 + 0.5;
      // colour drifts along the strand: teal ↔ sky on one, violet ↔ orchid on the other
      float shift = 0.5 + 0.5 * sin(vPh * 0.35);
      vec3 base = mix(mix(cA, cT, shift * 0.6), mix(cG, cC, shift * 0.55), vStrand);
      if (uGlowF > 0.5) {
        float a = pow(1.0 - abs(vSide), 2.4) * 0.22 * (0.4 + 0.6 * d);
        gl_FragColor = vec4(base * a, a);
        return;
      }
      float n = sqrt(max(0.0, 1.0 - vSide * vSide));
      float fres = pow(1.0 - n, 2.2);                              // bright glassy rim
      float body = 0.36 + 0.7 * n * (0.9 - 0.35 * vSide);         // soft key light from the upper left
      float spec = pow(max(0.0, 1.0 - abs(vSide + 0.38) * 3.2), 3.0) * 0.85 * d; // thin highlight streak
      vec3 col = base * body + mix(base, vec3(1.0), 0.45) * fres * 0.95 + vec3(spec);
      gl_FragColor = vec4(fog(col, vDepth), 1.0);
    }`;

  // phosphate beads on the backbones (shaded sphere sprites)
  const BEAD_VS = HEAD + `
    uniform float uDpr;
    attribute vec2 aPos; attribute vec2 aNor; attribute vec2 aPS; // phase, strand
    varying float vDepth; varying float vStrand;
    void main() {
      float y = aPos.y + uTop;
      float R = rAt(y), z = zipAt(y);
      float ph = aPS.x + uRot + aPS.y * GROOVE;
      float depth = depthOf(ph, z);
      float p = persp(depth);
      gl_Position = clip(aPos + aNor * latOf(ph, aPS.y, z, R) * p + uMouse, depth + 0.04);
      gl_PointSize = R * mix(0.12, 0.22, depth * 0.5 + 0.5) * p * uDpr;
      vDepth = depth; vStrand = aPS.y;
    }`;
  const BEAD_FS = FS_HEAD + `
    varying float vDepth; varying float vStrand;
    void main() {
      vec2 c = gl_PointCoord * 2.0 - 1.0;
      float r2 = dot(c, c);
      if (r2 > 1.0) discard;
      vec3 N = vec3(c.x, -c.y, sqrt(1.0 - r2));
      vec3 L = normalize(vec3(-0.45, 0.55, 0.7));
      float diff = max(dot(N, L), 0.0);
      float spec = pow(max(dot(N, normalize(L + vec3(0.0, 0.0, 1.0))), 0.0), 36.0);
      vec3 base = mix(cA, cG, vStrand);
      float rim = pow(1.0 - N.z, 2.0);
      vec3 col = base * (0.25 + 0.7 * diff) + mix(base, vec3(1.0), 0.5) * rim * 0.9 + spec;
      gl_FragColor = vec4(fog(col, vDepth), 1.0);
    }`;

  // base rods: each pair is two half-rods (one per base) meeting near the axis
  const ROD_VS = HEAD + `
    uniform float uHot;
    attribute vec2 aPos; attribute vec2 aNor; attribute vec4 aR; attribute float aBase; // phase, t, across, half | base 0..3
    varying float vDepth; varying float vAcross; varying float vBase; varying float vHot; varying float vT;
    void main() {
      float y = aPos.y + uTop;
      float R = rAt(y), z = zipAt(y);
      float phA = aR.x + uRot, phB = phA + GROOVE;
      float la = latOf(phA, 0.0, z, R), lb = latOf(phB, 1.0, z, R);
      float halfLen = 0.5 - 0.03 - 0.4 * z;
      float f = aR.w < 0.5 ? aR.y * halfLen : 1.0 - aR.y * halfLen;
      float depth = mix(depthOf(phA, z), depthOf(phB, z), f);
      vec2 T = vec2(aNor.y, -aNor.x);
      float p = persp(depth);
      float w = R * mix(0.028, 0.058, depth * 0.5 + 0.5) * p;
      gl_Position = clip(aPos + aNor * mix(la, lb, f) * p + T * aR.z * w + uMouse, depth - 0.03);
      vDepth = depth; vAcross = aR.z; vBase = aBase; vT = aR.y;
      vHot = 1.0 - step(0.01, abs(aR.x - uHot));
    }`;
  const ROD_FS = FS_HEAD + `
    varying float vDepth; varying float vAcross; varying float vBase; varying float vHot; varying float vT;
    void main() {
      vec3 c = vBase < 0.5 ? cA : vBase < 1.5 ? cT : vBase < 2.5 ? cG : cC;
      float n = sqrt(max(0.0, 1.0 - vAcross * vAcross));
      vec3 col = c * (0.5 + 0.65 * n) + mix(c, vec3(1.0), 0.6) * pow(vT, 3.0) * 0.55 * n; // glows toward the bond
      col = mix(col, vec3(1.0), vHot * 0.55);
      gl_FragColor = vec4(fog(col, max(vDepth, vHot)), 1.0);
    }`;

  // soft glow around the molecule
  const HALO_VS = HEAD + `
    attribute vec2 aPos; attribute vec2 aNor; attribute vec2 aPS; // phase, side
    varying float vSide; varying float vPh;
    void main() {
      float y = aPos.y + uTop;
      float w = rAt(y) * (2.6 + 2.4 * zipAt(y));
      gl_Position = clip(aPos + aNor * aPS.y * w + uMouse, 0.0);
      vSide = aPS.y; vPh = aPS.x;
    }`;
  const HALO_FS = FS_HEAD + `
    varying float vSide; varying float vPh;
    void main() {
      float a = pow(1.0 - abs(vSide), 2.0) * 0.22;
      vec3 col = mix(cA, cG, 0.5 + 0.5 * sin(vPh * 0.05));
      gl_FragColor = vec4(col * a, a);
    }`;

  const DOT_VS = `
    uniform vec2 uRes; uniform float uDpr;
    attribute vec4 aDot; attribute float aCol;
    varying float vA; varying float vC;
    void main() {
      vA = aDot.z; vC = aCol;
      gl_PointSize = aDot.w * 2.0 * uDpr + 1.0;
      gl_Position = vec4(aDot.x / uRes.x * 2.0 - 1.0, 1.0 - aDot.y / uRes.y * 2.0, 0.0, 1.0);
    }`;
  const DOT_FS = FS_HEAD + `
    varying float vA; varying float vC;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      float a = vA * (1.0 - smoothstep(0.15, 0.5, d));
      vec3 c = vC < 0.5 ? cA : vC < 1.5 ? cT : vC < 2.5 ? cG : cC;
      gl_FragColor = vec4(c * a, a);
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
    const cache = {};
    return { p, loc: (n) => (n in cache ? cache[n] : (cache[n] = gl.getUniformLocation(p, n))), att: (n) => gl.getAttribLocation(p, n) };
  }

  let G = null;
  function initGL() {
    if (!gl) return false;
    try {
      G = {
        tube: program(TUBE_VS, TUBE_FS), bead: program(BEAD_VS, BEAD_FS), rod: program(ROD_VS, ROD_FS),
        halo: program(HALO_VS, HALO_FS), dot: program(DOT_VS, DOT_FS),
        tubeBuf: gl.createBuffer(), beadBuf: gl.createBuffer(), rodBuf: gl.createBuffer(),
        haloBuf: gl.createBuffer(), dotBuf: gl.createBuffer(),
        nPts: 0, nRungs: 0
      };
      return true;
    } catch (e) {
      console.warn("Helix WebGL disabled:", e.message);
      cv.hidden = true; G = null;
      return false;
    }
  }

  function crPoint(i, tt) {
    const n = way.length - 1;
    const P0 = way[Math.max(0, i - 1)], P1 = way[i], P2 = way[Math.min(n, i + 1)], P3 = way[Math.min(n, i + 2)];
    const t2 = tt * tt, t3 = t2 * tt;
    const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * tt + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
    return [f(P0[0], P1[0], P2[0], P3[0]), f(P0[1], P1[1], P2[1], P3[1])];
  }
  const docTop = (n) => n.getBoundingClientRect().top + window.scrollY;
  const smooth = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u); };
  const rAt = (y) => RS[0] + (RS[1] - RS[0]) * smooth(RS[2], RS[3], y);
  const zipAt = (y) => smooth(zip[0], zip[1], y) * (1 - smooth(zip[2], zip[3], y));

  function buildPath() {
    docH = document.documentElement.scrollHeight;
    const mobile = W < 900;
    const bandY = docTop(band) + band.offsetHeight / 2;
    RS = mobile
      ? [Math.min(84, W * 0.22), 42, bandY + 0.3 * PH, bandY + 0.9 * PH]
      : [Math.min(175, Math.max(110, W * 0.105)), 82, bandY + 0.35 * PH, bandY + 0.95 * PH];

    let s = 7;
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const plans = document.querySelector(".plans");
    const plansTop = plans ? docTop(plans) : Infinity;
    const plansBottom = plans ? plansTop + plans.offsetHeight : Infinity;
    // across the hero, out past the right edge, then down the page along the right margin
    // so it frames the content instead of crossing it; it steps in beside the pricing
    // plans (the free space on the right) to unzip there
    way = [
      [-0.3 * W, bandY + 26], [0.18 * W, bandY - 18], [0.58 * W, bandY + 20], [1.0 * W, bandY - 8],
      [1.32 * W, bandY + 0.5 * PH]
    ];
    let y = way[way.length - 1][1];
    let k = 0;
    const step = 0.62 * PH;
    while (y < docH + PH) {
      y += step * (0.9 + r() * 0.2);
      const nearPlans = y > plansTop - 0.15 * PH && y < plansBottom + 0.35 * PH;
      const edge = (mobile ? 0.985 : 0.965) + (k % 2 ? 0.015 : -0.015);
      const x = nearPlans && !mobile ? 0.82 : edge;
      way.push([x * W, y]);
      k++;
    }

    // dense, evenly spaced samples: arc length and accumulated helix phase
    const xs = [], ys = [];
    for (let i = 0; i < way.length - 1; i++) {
      for (let k = 0; k < 32; k++) { const p = crPoint(i, k / 32); xs.push(p[0]); ys.push(p[1]); }
    }
    const last = way[way.length - 1]; xs.push(last[0]); ys.push(last[1]);
    const ox = [xs[0]], oy = [ys[0]];
    let carry = 0;
    for (let i = 1; i < xs.length; i++) {
      let ax = xs[i - 1], ay = ys[i - 1];
      const bx = xs[i], by = ys[i];
      let seg = Math.hypot(bx - ax, by - ay);
      while (carry + seg >= STEP) {
        const f = (STEP - carry) / seg;
        ax += (bx - ax) * f; ay += (by - ay) * f;
        ox.push(ax); oy.push(ay);
        seg = Math.hypot(bx - ax, by - ay);
        carry = 0;
      }
      carry += seg;
    }
    nPath = ox.length;
    PX = Float32Array.from(ox); PY = Float32Array.from(oy);
    NX = new Float32Array(nPath); NY = new Float32Array(nPath); PA = new Float32Array(nPath); PP = new Float32Array(nPath);
    let phase = 0;
    for (let i = 0; i < nPath; i++) {
      const a = Math.max(0, i - 2), b = Math.min(nPath - 1, i + 2);
      const tx = PX[b] - PX[a], ty = PY[b] - PY[a];
      const l = Math.hypot(tx, ty) || 1;
      NX[i] = -ty / l; NY[i] = tx / l;
      PA[i] = i * STEP;
      if (i) phase += (STEP * 2 * Math.PI) / (rAt(PY[i]) * PITCH_K);
      PP[i] = phase;
    }

    if (plans) zip = [plansTop - PH * 0.45, plansTop, plansBottom - PH * 0.05, plansBottom + PH * 0.4];

    particles = Array.from({ length: mobile ? 60 : 120 }, () => ({
      s: r() * PA[nPath - 1], lat: r() * 2 - 1, v: 0.12 + r() * 0.3,
      rad: r() * 1.2 + 0.6, ph: r() * Math.PI * 2, c: Math.floor(r() * 4)
    }));
    bufTop = -1;
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
    if (widthChanged || force || h > PH * 1.15) {
      W = w;
      PH = widthChanged ? h : Math.max(h, PH);
      dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 2 : 1.75);
      sizeCanvas();
      buildPath();
    }
  }

  function pathAt(s) {
    const f = Math.max(0, Math.min(nPath - 1, s / STEP)), i = Math.floor(f), j = Math.min(nPath - 1, i + 1), u = f - i;
    const nx = NX[i] + (NX[j] - NX[i]) * u, ny = NY[i] + (NY[j] - NY[i]) * u, l = Math.hypot(nx, ny) || 1;
    return [PX[i] + (PX[j] - PX[i]) * u, PY[i] + (PY[j] - PY[i]) * u, nx / l, ny / l, PP[i] + (PP[j] - PP[i]) * u];
  }

  function basePair(n) {
    let h = (n * 2654435761) >>> 0;
    h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13;
    const type = h & 1, flip = (h >>> 1) & 1;
    // base index on strand 0 / strand 1: A0 T1 G2 C3
    const a = type ? (flip ? 3 : 2) : (flip ? 1 : 0);
    const b = type ? (flip ? 2 : 3) : (flip ? 0 : 1);
    return { type, a, b };
  }

  function buildGeometry() {
    if (!G) return;
    const margin = RS[0] * 5;
    const top = bufTop - margin, bottom = bufTop + CH + margin;
    let i0 = -1, i1 = -1;
    for (let i = 0; i < nPath; i++) if (PY[i] >= top && PY[i] <= bottom) { if (i0 < 0) i0 = i; i1 = i; }
    if (i0 < 0) { G.nPts = 0; G.nRungs = 0; rungs = []; return; }
    const n = i1 - i0 + 1;
    G.nPts = n;

    const tube = new Float32Array(2 * n * 2 * 7);
    let o = 0;
    for (let st = 0; st < 2; st++) for (let i = i0; i <= i1; i++) for (const side of [-1, 1]) {
      tube[o++] = PX[i]; tube[o++] = PY[i] - bufTop; tube[o++] = NX[i]; tube[o++] = NY[i];
      tube[o++] = PP[i]; tube[o++] = side; tube[o++] = st;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, G.tubeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, tube, gl.STATIC_DRAW);

    const halo = new Float32Array(n * 2 * 6);
    o = 0;
    for (let i = i0; i <= i1; i++) for (const side of [-1, 1]) {
      halo[o++] = PX[i]; halo[o++] = PY[i] - bufTop; halo[o++] = NX[i]; halo[o++] = NY[i];
      halo[o++] = PP[i]; halo[o++] = side;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, G.haloBuf);
    gl.bufferData(gl.ARRAY_BUFFER, halo, gl.STATIC_DRAW);

    // base pairs every 2π/10.5 of phase
    const first = Math.ceil(PP[i0] / BP_PHASE), lastK = Math.floor(PP[i1] / BP_PHASE);
    const count = Math.max(0, lastK - first + 1);
    const rod = new Float32Array(count * 12 * 9);
    const bead = new Float32Array(count * 2 * 6);
    rungs = [];
    let ro = 0, bo = 0, j = i0;
    const quad = [[0, -1], [1, -1], [1, 1], [0, -1], [1, 1], [0, 1]];
    for (let k = first; k <= lastK; k++) {
      const ph = k * BP_PHASE;
      while (j < i1 && PP[j + 1] < ph) j++;
      const u = (ph - PP[j]) / Math.max(1e-6, PP[Math.min(i1, j + 1)] - PP[j]);
      const jj = Math.min(i1, j + 1);
      const x = PX[j] + (PX[jj] - PX[j]) * u, y = PY[j] + (PY[jj] - PY[j]) * u - bufTop;
      let nx = NX[j] + (NX[jj] - NX[j]) * u, ny = NY[j] + (NY[jj] - NY[j]) * u;
      const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const bp = basePair(k);
      rungs.push({ ph, x, y, nx, ny, bp });
      for (let hf = 0; hf < 2; hf++) for (const [tt, across] of quad) {
        rod[ro++] = x; rod[ro++] = y; rod[ro++] = nx; rod[ro++] = ny;
        rod[ro++] = ph; rod[ro++] = tt; rod[ro++] = across; rod[ro++] = hf; rod[ro++] = hf ? bp.b : bp.a;
      }
      for (let st = 0; st < 2; st++) {
        bead[bo++] = x; bead[bo++] = y; bead[bo++] = nx; bead[bo++] = ny; bead[bo++] = ph; bead[bo++] = st;
      }
    }
    G.nRungs = count;
    gl.bindBuffer(gl.ARRAY_BUFFER, G.rodBuf);
    gl.bufferData(gl.ARRAY_BUFFER, rod, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, G.beadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, bead, gl.STATIC_DRAW);
  }

  function needsAnchor(sy) {
    const margin = H * 0.1, maxTop = Math.max(0, docH - CH);
    return bufTop < 0 || (sy < bufTop + margin && bufTop > 0) || (sy + H > bufTop + CH - margin && bufTop < maxTop);
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
    const fade = Math.min(1, sy / Math.max(1, hero.offsetHeight * 0.9));
    const op = +(1 - 0.12 * fade).toFixed(2);
    if (op !== shownOpacity) { shownOpacity = op; cv.style.opacity = op; }
  }

  function latOf(ph, st, z, R) {
    const sep = (st < 0.5 ? -1 : 1) * R * 2.1;
    const lat = R * Math.sin(ph) * (1 - z) + (sep + 0.3 * R * Math.sin(ph)) * z;
    const depth = Math.cos(ph) * (1 - z) + 0.4 * z;
    return lat * (1 + 0.22 * depth);
  }

  function pick(mx, my) {
    if (!pointer.on || !rungs.length || tipOwner === "map") { if (tipOwner === "helix") { tip.hidden = true; tipOwner = null; } hotPh = -1e9; return; }
    const px = pointer.x - mx, py = pointer.y + window.scrollY - bufTop - my;
    let best = null, bestD = 12;
    for (const rg of rungs) {
      const R = rAt(rg.y + bufTop);
      if (Math.abs(rg.y - py) > R * 3) continue;
      const z = zipAt(rg.y + bufTop);
      if (z > 0.6) continue;
      const phA = rg.ph + rot, phB = phA + GROOVE;
      const depth = ((Math.cos(phA) + Math.cos(phB)) / 2) * (1 - z) + 0.4 * z;
      if (depth < -0.2) continue;
      const la = latOf(phA, 0, z, R), lb = latOf(phB, 1, z, R);
      const ax = rg.x + rg.nx * la, ay = rg.y + rg.ny * la, bx = rg.x + rg.nx * lb, by = rg.y + rg.ny * lb;
      const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy || 1;
      const u = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L));
      const d = Math.hypot(px - (ax + dx * u), py - (ay + dy * u));
      if (d < bestD) { bestD = d; best = rg; }
    }
    if (!best) { hotPh = -1e9; if (tipOwner === "helix") { tip.hidden = true; tipOwner = null; } return; }
    hotPh = best.ph;
    const a = BASES[best.bp.a], b = BASES[best.bp.b];
    tip.innerHTML = `<b></b> <span class="dim">·</span> <span></span>`;
    tip.children[0].innerHTML = `<span class="b-${a.toLowerCase()}">${a}</span>–<span class="b-${b.toLowerCase()}">${b}</span>`;
    tip.children[2].textContent = t("bonds")(best.bp.type ? 3 : 2);
    tip.style.left = pointer.x + "px";
    tip.style.top = pointer.y + "px";
    tip.hidden = false;
    tipOwner = "helix";
  }

  function setCommon(prog, mx, my) {
    gl.useProgram(prog.p);
    gl.uniform2f(prog.loc("uRes"), W, CH);
    gl.uniform2f(prog.loc("uMouse"), mx, my);
    gl.uniform1f(prog.loc("uTop"), bufTop);
    gl.uniform1f(prog.loc("uRot"), rot);
    gl.uniform4f(prog.loc("uZip"), zip[0], zip[1], zip[2], zip[3]);
    gl.uniform4f(prog.loc("uRS"), RS[0], RS[1], RS[2], RS[3]);
  }
  function attr(prog, name, size, stride, offset) {
    const a = prog.att(name);
    if (a < 0) return;
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, size, gl.FLOAT, false, stride * 4, offset * 4);
  }
  function disableAttrs() { for (let i = 0; i < 6; i++) gl.disableVertexAttribArray(i); }

  let dotData = new Float32Array(0);
  function draw(dt) {
    if (!G) return;
    if (Math.abs(document.documentElement.scrollHeight - docH) > 4) buildPath();
    const sy = window.scrollY;
    time += dt;
    rot = time * 0.38 + sy * 0.0028;
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    anchor(sy);
    const mx = (mouse.x - 0.5) * 24, my = (mouse.y - 0.5) * 16;
    if (canHover) pick(mx, my);

    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const n = G.nPts;
    if (!n) return;

    // glow first: additive, no depth
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    setCommon(G.halo, mx, my);
    gl.bindBuffer(gl.ARRAY_BUFFER, G.haloBuf);
    attr(G.halo, "aPos", 2, 6, 0); attr(G.halo, "aNor", 2, 6, 2); attr(G.halo, "aPS", 2, 6, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n * 2);
    disableAttrs();

    // neon bloom: the backbones drawn again wide and soft, additively
    setCommon(G.tube, mx, my);
    gl.uniform1f(G.tube.loc("uGlow"), 1);
    gl.uniform1f(G.tube.loc("uGlowF"), 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, G.tubeBuf);
    attr(G.tube, "aPos", 2, 7, 0); attr(G.tube, "aNor", 2, 7, 2); attr(G.tube, "aPSS", 3, 7, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n * 2);
    gl.drawArrays(gl.TRIANGLE_STRIP, n * 2, n * 2);
    disableAttrs();

    // the molecule: opaque, depth-tested, so the near side hides the far side
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.depthMask(true);

    if (G.nRungs) {
      setCommon(G.rod, mx, my);
      gl.uniform1f(G.rod.loc("uHot"), hotPh);
      gl.bindBuffer(gl.ARRAY_BUFFER, G.rodBuf);
      attr(G.rod, "aPos", 2, 9, 0); attr(G.rod, "aNor", 2, 9, 2); attr(G.rod, "aR", 4, 9, 4); attr(G.rod, "aBase", 1, 9, 8);
      gl.drawArrays(gl.TRIANGLES, 0, G.nRungs * 12);
      disableAttrs();
    }

    setCommon(G.tube, mx, my);
    gl.uniform1f(G.tube.loc("uGlow"), 0);
    gl.uniform1f(G.tube.loc("uGlowF"), 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, G.tubeBuf);
    attr(G.tube, "aPos", 2, 7, 0); attr(G.tube, "aNor", 2, 7, 2); attr(G.tube, "aPSS", 3, 7, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n * 2);
    gl.drawArrays(gl.TRIANGLE_STRIP, n * 2, n * 2);
    disableAttrs();

    if (G.nRungs) {
      setCommon(G.bead, mx, my);
      gl.uniform1f(G.bead.loc("uDpr"), dpr);
      gl.bindBuffer(gl.ARRAY_BUFFER, G.beadBuf);
      attr(G.bead, "aPos", 2, 6, 0); attr(G.bead, "aNor", 2, 6, 2); attr(G.bead, "aPS", 2, 6, 4);
      gl.drawArrays(gl.POINTS, 0, G.nRungs * 2);
      disableAttrs();
    }

    // drifting free nucleotides: additive, no depth
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    if (dotData.length < particles.length * 5) dotData = new Float32Array(particles.length * 5);
    let c = 0;
    const sMax = PA[nPath - 1];
    for (const p of particles) {
      if (!reduceMotion) p.s = (p.s + p.v * dt * 60) % sMax;
      const [x, y, nx, ny] = pathAt(p.s);
      const yy = y - bufTop;
      if (yy < -200 || yy > CH + 200) continue;
      const off = p.lat * rAt(y) * (2.3 + 0.5 * Math.sin(time * 0.6 + p.ph));
      dotData[c++] = x + nx * off + mx; dotData[c++] = yy + ny * off + my;
      dotData[c++] = 0.2 + 0.5 * Math.abs(Math.sin(time * 1.1 + p.ph));
      dotData[c++] = p.rad; dotData[c++] = p.c;
    }
    if (c) {
      gl.useProgram(G.dot.p);
      gl.uniform2f(G.dot.loc("uRes"), W, CH);
      gl.uniform1f(G.dot.loc("uDpr"), dpr);
      gl.bindBuffer(gl.ARRAY_BUFFER, G.dotBuf);
      gl.bufferData(gl.ARRAY_BUFFER, dotData.subarray(0, c), gl.DYNAMIC_DRAW);
      attr(G.dot, "aDot", 4, 5, 0); attr(G.dot, "aCol", 1, 5, 4);
      gl.drawArrays(gl.POINTS, 0, c / 5);
      disableAttrs();
    }
  }

  cv.addEventListener("webglcontextlost", (e) => { e.preventDefault(); G = null; });
  cv.addEventListener("webglcontextrestored", () => { if (initGL()) { gl.viewport(0, 0, cv.width, cv.height); bufTop = -1; } });

  /* ---- smooth wheel scrolling (Lenis); touch keeps native momentum ---- */
  let lenis = null;
  if (!reduceMotion && typeof window.Lenis === "function") {
    try { lenis = new window.Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1 }); } catch (e) { lenis = null; }
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || !lenis || a.classList.contains("skip")) return;
    const id = a.getAttribute("href");
    const target = id.length > 1 && document.getElementById(id.slice(1));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(id === "#top" ? 0 : target, { offset: -(nav.offsetHeight + 8), duration: 1.2 });
  });

  let raf = 0, last = performance.now();
  function loop(now) {
    if (lenis) lenis.raf(now);
    updateOpacity(window.scrollY);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    draw(dt);
    raf = !document.hidden ? requestAnimationFrame(loop) : 0;
  }
  function kick() {
    if (raf || document.hidden || reduceMotion) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  }

  /* ================= Boot ================= */
  applyLang();
  startRot();
  initGL();
  resize(true);
  updateOpacity(window.scrollY);
  if (reduceMotion) {
    draw(0);
    window.addEventListener("scroll", () => { updateOpacity(window.scrollY); draw(0); }, { passive: true });
  } else {
    draw(0);
    document.addEventListener("visibilitychange", kick);
    kick();
  }
  let rT = 0;
  window.addEventListener("resize", () => {
    resize(false);
    if (reduceMotion) draw(0);
    clearTimeout(rT);
    rT = setTimeout(fitRot, 150);
  });
  window.addEventListener("pointermove", (e) => {
    mouse.tx = e.clientX / Math.max(1, W);
    mouse.ty = e.clientY / Math.max(1, H);
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.on = e.pointerType === "mouse";
  }, { passive: true });
  document.addEventListener("pointerleave", () => { pointer.on = false; });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { buildPath(); fitRot(); });
})();
