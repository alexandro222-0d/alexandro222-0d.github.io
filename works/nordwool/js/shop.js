/* ============================================================
   Магазин: каталог, карточка товара, заявка в мессенджер.
   Данные берутся из js/products.js
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var P = window.PRODUCTS || [], CATS = window.CATS || [], SHOP = window.SHOP || {};

  function money(v) {
    return v ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' р.' : 'По запросу';
  }
  function param(name) {
    return new URLSearchParams(location.search).get(name);
  }
  function catName(key) {
    for (var i = 0; i < CATS.length; i++) if (CATS[i].key === key) return CATS[i].name;
    return '';
  }

  /* ---------- заявка ---------- */
  function orderText(items) {
    var lines = ['Здравствуйте! Интересует:'];
    items.forEach(function (it) {
      lines.push('— ' + it.name + ', артикул ' + it.art +
                 (it.size ? ', размер ' + it.size : '') + ', ' + money(it.price));
    });
    lines.push('Подскажите, есть ли в наличии?');
    return lines.join('\n');
  }
  function orderLinks(items) {
    var t = encodeURIComponent(orderText(items));
    var num = (SHOP.phone || '').replace(/\D/g, '');
    return {
      viber: 'viber://chat?number=%2B' + num + '&text=' + t,
      wa:    'https://wa.me/' + num + '?text=' + t,
      tg:    'https://t.me/share/url?url=&text=' + t,
      tel:   'tel:' + SHOP.phone
    };
  }

  /* ---------- корзина (в памяти браузера) ---------- */
  var CART_KEY = 'nat_cart';
  function cartRead() {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function cartWrite(v) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(v)); } catch (e) {}
    paintCart();
  }
  function cartAdd(item) {
    var c = cartRead();
    c.push(item);
    cartWrite(c);
    flash(item.name + ' — в заявке');
  }
  function paintCart() {
    var n = cartRead().length;
    $$('.cart-count').forEach(function (el) {
      el.textContent = n ? n : '';
      el.classList.toggle('is-on', !!n);
    });
  }

  var flashBox = null;
  function flash(text) {
    if (!flashBox) {
      flashBox = document.createElement('div');
      flashBox.className = 'flash';
      document.body.appendChild(flashBox);
    }
    flashBox.textContent = text;
    flashBox.classList.add('is-on');
    clearTimeout(flashBox._t);
    flashBox._t = setTimeout(function () { flashBox.classList.remove('is-on'); }, 2200);
  }

  /* ---------- карточка в списке ---------- */
  function cardHTML(p) {
    return '' +
      '<article class="pcard reveal">' +
        '<a class="pcard__img media par" href="product.html?id=' + p.id + '">' +
          '<img src="img/' + p.img[0] + '" alt="' + p.name + '" loading="lazy">' +
        '</a>' +
        '<div class="pcard__body">' +
          '<a class="pcard__name" href="product.html?id=' + p.id + '">' + p.name + '</a>' +
          '<div class="pcard__row">' +
            '<span class="pcard__price">' + money(p.price) + '</span>' +
            '<span class="pcard__art">' + p.art + '</span>' +
          '</div>' +
          '<div class="pcard__sizes">' + p.sizes.map(function (s) {
              return '<i>' + s + '</i>'; }).join('') + '</div>' +
          '<button class="pbtn" type="button" data-add="' + p.id + '">В заявку</button>' +
        '</div>' +
      '</article>';
  }

  /* ---------- страница каталога ---------- */
  function buildCatalog() {
    var wrap = $('#catalog');
    if (!wrap) return;

    var cat = param('cat') || 'all';
    var size = 'all';

    var navHTML = '<a href="catalog.html" class="' + (cat === 'all' ? 'is-on' : '') + '">Все</a>' +
      CATS.map(function (c) {
        return '<a href="catalog.html?cat=' + c.key + '" class="' + (cat === c.key ? 'is-on' : '') + '">' + c.name + '</a>';
      }).join('');
    $('#catNav').innerHTML = navHTML;
    $('#catHead').textContent = cat === 'all' ? 'Весь каталог' : catName(cat);

    var sizes = [];
    P.forEach(function (p) { p.sizes.forEach(function (s) { if (sizes.indexOf(s) < 0) sizes.push(s); }); });
    sizes.sort(function (a, b) { return a - b; });
    $('#sizeFilter').innerHTML = '<button type="button" class="is-on" data-size="all">Любой</button>' +
      sizes.map(function (s) { return '<button type="button" data-size="' + s + '">' + s + '</button>'; }).join('');

    function render() {
      var list = P.filter(function (p) {
        return (cat === 'all' || p.cat === cat) && (size === 'all' || p.sizes.indexOf(+size) > -1);
      });
      $('#grid').innerHTML = list.map(cardHTML).join('');
      $('#found').textContent = list.length
        ? 'Найдено моделей: ' + list.length
        : 'В этом размере пока ничего нет — напишите нам, подберём под вас.';
      $$('.reveal', $('#grid')).forEach(function (el) { el.classList.add('is-in'); });
    }
    render();

    $('#sizeFilter').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      size = b.getAttribute('data-size');
      $$('#sizeFilter button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
      render();
    });
  }

  /* ---------- страница товара ---------- */
  function buildProduct() {
    var wrap = $('#product');
    if (!wrap) return;
    var id = +param('id');
    var p = P.filter(function (x) { return x.id === id; })[0];
    if (!p) { wrap.innerHTML = '<p class="pempty">Модель не найдена. <a href="catalog.html">Весь каталог</a></p>'; return; }

    document.title = p.name + ' — ' + (SHOP.name || '');
    var size = p.sizes[0];

    wrap.innerHTML = '' +
      '<div class="pdetail">' +
        '<div class="pdetail__gallery">' +
          p.img.map(function (f, i) {
            return '<figure class="media par' + (i ? ' is-small' : '') + '" data-zoom><img src="img/' + f + '" alt="' + p.name + '"></figure>';
          }).join('') +
        '</div>' +
        '<div class="pdetail__info">' +
          '<a class="pback" href="catalog.html?cat=' + p.cat + '">← ' + catName(p.cat) + '</a>' +
          '<h1>' + p.name + '</h1>' +
          '<p class="pdetail__price">' + money(p.price) + '</p>' +
          '<p class="pdetail__note">' + (p.note || '') + '</p>' +
          '<div class="pdetail__block"><span class="plabel">Размер</span>' +
            '<div class="psizes" id="psizes">' + p.sizes.map(function (s, i) {
              return '<button type="button" class="' + (i ? '' : 'is-on') + '" data-size="' + s + '">' + s + '</button>';
            }).join('') + '</div>' +
          '</div>' +
          '<div class="pdetail__block"><span class="plabel">Артикул</span><b>' + p.art + '</b></div>' +
          '<div class="pactions">' +
            '<button class="pbtn pbtn--big" type="button" id="toCart">Добавить в заявку</button>' +
            '<a class="pbtn pbtn--ghost" id="toViber" href="#">Написать в Viber</a>' +
          '</div>' +
          '<p class="pdetail__hint">Заявка ни к чему не обязывает: уточним наличие и пригласим на примерку.</p>' +
        '</div>' +
      '</div>';

    function links() {
      return orderLinks([{ name: p.name, art: p.art, price: p.price, size: size }]);
    }
    $('#toViber').setAttribute('href', links().viber);

    $('#psizes').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      size = b.getAttribute('data-size');
      $$('#psizes button').forEach(function (x) { x.classList.toggle('is-on', x === b); });
      $('#toViber').setAttribute('href', links().viber);
    });
    $('#toCart').addEventListener('click', function () {
      cartAdd({ id: p.id, name: p.name, art: p.art, price: p.price, size: size });
    });
  }

  /* ---------- страница заявки ---------- */
  function buildCart() {
    var wrap = $('#cartPage');
    if (!wrap) return;

    function render() {
      var c = cartRead();
      if (!c.length) {
        wrap.innerHTML = '<p class="pempty">В заявке пока пусто. <a href="catalog.html">Перейти в каталог</a></p>';
        return;
      }
      var sum = c.reduce(function (a, b) { return a + (b.price || 0); }, 0);
      var L = orderLinks(c);
      wrap.innerHTML = '' +
        '<ul class="clist">' + c.map(function (it, i) {
          return '<li><span class="clist__n">' + it.name + '</span>' +
                 '<span class="clist__m">' + it.art + ' · размер ' + it.size + '</span>' +
                 '<span class="clist__p">' + money(it.price) + '</span>' +
                 '<button type="button" class="clist__x" data-del="' + i + '" aria-label="Убрать">×</button></li>';
        }).join('') + '</ul>' +
        '<div class="ctotal"><span>Итого</span><b>' + money(sum) + '</b></div>' +
        '<div class="pactions">' +
          '<a class="pbtn pbtn--big" href="' + L.viber + '">Отправить в Viber</a>' +
          '<a class="pbtn pbtn--ghost" href="' + L.wa + '" target="_blank" rel="noopener">WhatsApp</a>' +
          '<a class="pbtn pbtn--ghost" href="' + L.tel + '">Позвонить</a>' +
        '</div>' +
        '<p class="pdetail__hint">Нажмите «Отправить» — откроется мессенджер с готовым списком. Останется нажать «отправить» там.</p>';
    }
    render();
    wrap.addEventListener('click', function (e) {
      var b = e.target.closest('[data-del]'); if (!b) return;
      var c = cartRead(); c.splice(+b.getAttribute('data-del'), 1); cartWrite(c); render();
    });
  }

  /* ---------- общее ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    var p = P.filter(function (x) { return x.id === +b.getAttribute('data-add'); })[0];
    if (p) cartAdd({ id: p.id, name: p.name, art: p.art, price: p.price, size: p.sizes[0] });
  });

  buildCatalog();
  buildProduct();
  buildCart();
  paintCart();
})();
