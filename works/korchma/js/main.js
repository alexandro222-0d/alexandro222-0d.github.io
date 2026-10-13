(function () {
  "use strict";

  const PHONE = "375447911903"; // для WhatsApp, без «+»

  // ---------- Мобильное меню ----------
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");

  function setNav(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }

  toggle.addEventListener("click", () => setNav(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setNav(false);
  });

  // ---------- Год в футере ----------
  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- Меню ресторана ----------
  const menus = window.MENUS || [];
  const switchEl = document.querySelector(".menu-switch");
  const tabsEl = document.querySelector(".menu-tabs");
  const listEl = document.querySelector(".menu-list");
  const catNoteEl = document.querySelector(".menu__catnote");
  let currentMenu = 0;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function formatPrice(price) {
    return price.toFixed(2).replace(".", ",");
  }

  // «230/30» → «230/30 г», «1,5 л» и «от 1,5 кг» оставляем как есть
  function formatWeight(w) {
    return /^[\d/]+$/.test(w) ? w + " г" : w;
  }

  function renderCategory(index) {
    const cat = menus[currentMenu].categories[index];
    listEl.innerHTML = cat.items
      .map(([name, weight, price, desc, unit]) => `
        <div class="menu-item">
          <div class="menu-item__main">
            <span class="menu-item__name">${esc(name)}</span>
            ${desc ? `<span class="menu-item__desc">${esc(desc)}</span>` : ""}
          </div>
          <span class="menu-item__weight">${esc(formatWeight(weight))}</span>
          <span class="menu-item__price">${formatPrice(price)}<small> BYN${unit ? " " + esc(unit) : ""}</small></span>
        </div>`)
      .join("");
    catNoteEl.textContent = cat.note || "";
    catNoteEl.hidden = !cat.note;
    tabsEl.querySelectorAll("button").forEach((btn, i) => {
      btn.setAttribute("aria-selected", String(i === index));
    });
  }

  function renderMenu(index) {
    currentMenu = index;
    tabsEl.innerHTML = menus[index].categories
      .map((cat, i) => `<button type="button" role="tab" data-index="${i}">${esc(cat.category)}</button>`)
      .join("");
    tabsEl.scrollLeft = 0;
    switchEl.querySelectorAll("button").forEach((btn, i) => {
      btn.setAttribute("aria-pressed", String(i === index));
    });
    renderCategory(0);
  }

  if (menus.length) {
    switchEl.innerHTML = menus
      .map((m, i) => `<button type="button" data-menu="${i}">${esc(m.title)}</button>`)
      .join("");
    switchEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) renderMenu(Number(btn.dataset.menu));
    });
    tabsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) renderCategory(Number(btn.dataset.index));
    });
    renderMenu(0);

    // ссылки «Банкетное меню» и т.п. в других разделах
    document.querySelectorAll("[data-open-menu]").forEach((link) => {
      link.addEventListener("click", () => {
        const i = menus.findIndex((m) => m.id === link.dataset.openMenu);
        if (i >= 0) renderMenu(i);
      });
    });
  }

  // ---------- Бронирование ----------
  const form = document.getElementById("bookingForm");
  const serviceSelect = document.getElementById("f-service");
  const errorEl = document.getElementById("formError");

  // Кнопки «Забронировать баню» и т.п. сразу выбирают услугу в форме
  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      serviceSelect.value = link.dataset.service;
    });
  });

  // Нельзя выбрать прошедшую дату
  const dateInput = document.getElementById("f-date");
  dateInput.min = new Date().toISOString().slice(0, 10);

  function formatDate(value) {
    if (!value) return "";
    const [y, m, d] = value.split("-");
    return `${d}.${m}.${y}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();

    form.elements.name.setAttribute("aria-invalid", String(!name));
    form.elements.phone.setAttribute("aria-invalid", String(phone.replace(/\D/g, "").length < 7));

    if (!name || phone.replace(/\D/g, "").length < 7) {
      errorEl.textContent = "Укажите имя и телефон — мы перезвоним, чтобы подтвердить бронь.";
      errorEl.hidden = false;
      (name ? form.elements.phone : form.elements.name).focus();
      return;
    }
    errorEl.hidden = true;

    const lines = [
      "Здравствуйте! Заявка с сайта:",
      `• ${form.elements.service.value}`,
      form.elements.date.value && `• Дата: ${formatDate(form.elements.date.value)}`,
      form.elements.guests.value && `• Гостей: ${form.elements.guests.value}`,
      `• Имя: ${name}`,
      `• Телефон: ${phone}`,
      form.elements.comment.value.trim() && `• ${form.elements.comment.value.trim()}`,
    ].filter(Boolean);

    // Заявки принимаются в WhatsApp — так решила заказчица
    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank", "noopener");
  });

  // ---------- Видео домиков: играют, только когда видны на экране ----------
  const clips = document.querySelectorAll(".cottage__media video");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (clips.length && "IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.play().catch(() => {});
        else entry.target.pause();
      });
    }, { threshold: 0.4 });
    clips.forEach((v) => io.observe(v));
  } else {
    clips.forEach((v) => v.setAttribute("controls", ""));
  }

  // ---------- Просмотр фото ----------
  const lightbox = document.getElementById("lightbox");
  const lbImg = lightbox.querySelector(".lightbox__img");
  const lbCaption = lightbox.querySelector(".lightbox__caption");
  let group = [];
  let current = 0;
  let opener = null;

  function showPhoto(i) {
    current = (i + group.length) % group.length;
    const img = group[current].querySelector("img");
    lbImg.src = img.dataset.full || img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = img.alt;
  }

  function openLightbox(item) {
    group = [...item.closest(".gallery").querySelectorAll(".gallery__item")];
    opener = item;
    showPhoto(group.indexOf(item));
    lightbox.hidden = false;
    document.body.classList.add("no-scroll");
    lightbox.querySelector(".lightbox__close").focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("no-scroll");
    lbImg.removeAttribute("src");
    if (opener) opener.focus();
  }

  document.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery__item");
    if (item) openLightbox(item);
  });
  lightbox.addEventListener("click", (e) => {
    if (e.target.closest(".lightbox__nav--prev")) showPhoto(current - 1);
    else if (e.target.closest(".lightbox__nav--next")) showPhoto(current + 1);
    else if (e.target === lightbox || e.target.closest(".lightbox__close")) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPhoto(current - 1);
    if (e.key === "ArrowRight") showPhoto(current + 1);
  });

  // свайп на телефоне
  let touchX = null;
  lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showPhoto(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });
})();
