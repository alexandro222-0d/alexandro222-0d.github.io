/* ============================================================
   Каталог: все товары в одном месте.

   Чтобы добавить модель — скопируйте любой блок и поменяйте поля.
   cat   — раздел: shuby | dublenki | zhilety | polushubki | palto | novinki
   art   — артикул, попадает в текст заявки
   price — цена в рублях; 0 означает «по запросу»
   sizes — размеры через запятую
   img   — файлы из папки img, первый показывается в списке
   ============================================================ */
window.PRODUCTS = [
  { id: 1,  cat: 'shuby',      art: 'SH-101', name: 'Шуба из норки',          price: 4900, sizes: [42,44,46,48], img: ['p-1.jpg','look-3.jpg'],  note: 'Норка, поперечный крой, длина 90 см' },
  { id: 2,  cat: 'shuby',      art: 'SH-102', name: 'Шуба длинная',           price: 6400, sizes: [44,46,48,50], img: ['p-4.jpg','cat-1.jpg'],   note: 'Длина до щиколотки, пояс в комплекте' },
  { id: 3,  cat: 'shuby',      art: 'SH-103', name: 'Шуба с капюшоном',       price: 5200, sizes: [42,44,46],    img: ['cat-1.jpg','p-1.jpg'],   note: 'Капюшон с отделкой, потайные карманы' },
  { id: 4,  cat: 'shuby',      art: 'SH-104', name: 'Шуба поперечка',         price: 4100, sizes: [46,48,50,52], img: ['look-3.jpg','p-4.jpg'],  note: 'Лёгкая, свободный силуэт' },

  { id: 5,  cat: 'dublenki',   art: 'DB-201', name: 'Дублёнка с капюшоном',   price: 3200, sizes: [42,44,46,48], img: ['d-1.jpg','d-2.jpg'],     note: 'Овчина, капюшон отстёгивается' },
  { id: 6,  cat: 'dublenki',   art: 'DB-202', name: 'Дублёнка классическая',  price: 2900, sizes: [44,46,48],    img: ['d-2.jpg','d-3.jpg'],     note: 'Прямой крой, воротник-стойка' },
  { id: 7,  cat: 'dublenki',   art: 'DB-203', name: 'Дублёнка укороченная',   price: 2400, sizes: [42,44,46,48], img: ['d-3.jpg','d-4.jpg'],     note: 'Длина до бедра, косая молния' },
  { id: 8,  cat: 'dublenki',   art: 'DB-204', name: 'Дублёнка с поясом',      price: 3600, sizes: [44,46,48,50], img: ['d-4.jpg','d-1.jpg'],     note: 'Пояс из натуральной кожи' },

  { id: 9,  cat: 'zhilety',    art: 'ZH-301', name: 'Жилет из лисы',          price: 1850, sizes: [42,44,46],    img: ['p-3.jpg','look-1.jpg'],  note: 'Лиса, длина 60 см' },
  { id: 10, cat: 'zhilety',    art: 'ZH-302', name: 'Жилет короткий',         price: 1450, sizes: [42,44,46,48], img: ['p-6.jpg','cat-3.jpg'],   note: 'Под пояс, без застёжки' },
  { id: 11, cat: 'zhilety',    art: 'ZH-303', name: 'Жилет удлинённый',       price: 2100, sizes: [44,46,48],    img: ['cat-3.jpg','p-3.jpg'],   note: 'Длина до колена' },
  { id: 12, cat: 'zhilety',    art: 'ZH-304', name: 'Жилет с капюшоном',      price: 1990, sizes: [42,44,46,48], img: ['look-1.jpg','p-6.jpg'],  note: 'Капюшон с меховой отделкой' },

  { id: 13, cat: 'polushubki', art: 'PS-401', name: 'Полушубок из мутона',    price: 2600, sizes: [44,46,48,50], img: ['ps-1.jpg','ps-2.jpg'],   note: 'Мутон, длина 75 см' },
  { id: 14, cat: 'polushubki', art: 'PS-402', name: 'Полушубок свободный',    price: 3100, sizes: [46,48,50],    img: ['ps-2.jpg','ps-3.jpg'],   note: 'Объёмный силуэт, широкий рукав' },
  { id: 15, cat: 'polushubki', art: 'PS-403', name: 'Полушубок с воротником', price: 2850, sizes: [42,44,46,48], img: ['ps-3.jpg','ps-4.jpg'],   note: 'Отложной воротник' },
  { id: 16, cat: 'polushubki', art: 'PS-404', name: 'Полушубок из норки',     price: 4300, sizes: [44,46,48],    img: ['ps-4.jpg','ps-1.jpg'],   note: 'Норка, приталенный крой' },

  { id: 17, cat: 'palto',      art: 'PL-501', name: 'Пальто с мехом',         price: 1700, sizes: [42,44,46,48], img: ['p-2.jpg','look-4.jpg'],  note: 'Шерсть 70%, меховой воротник' },
  { id: 18, cat: 'palto',      art: 'PL-502', name: 'Пальто прямое',          price: 1350, sizes: [44,46,48,50], img: ['p-5.jpg','cat-2.jpg'],   note: 'Классика, длина ниже колена' },
  { id: 19, cat: 'palto',      art: 'PL-503', name: 'Пальто с поясом',        price: 1550, sizes: [42,44,46],    img: ['cat-2.jpg','p-2.jpg'],   note: 'Запáх, широкий пояс' },
  { id: 20, cat: 'palto',      art: 'PL-504', name: 'Пальто длинное',         price: 1900, sizes: [46,48,50],    img: ['look-4.jpg','p-5.jpg'],  note: 'Длина макси, боковые разрезы' },

  { id: 21, cat: 'novinki',    art: 'NV-601', name: 'Дублёнка на вешалке',    price: 3400, sizes: [44,46,48],    img: ['nv-1.jpg','nv-2.jpg'],   note: 'Новое поступление' },
  { id: 22, cat: 'novinki',    art: 'NV-602', name: 'Дублёнка с отворотом',   price: 3700, sizes: [42,44,46,48], img: ['nv-2.jpg','nv-3.jpg'],   note: 'Новое поступление' },
  { id: 23, cat: 'novinki',    art: 'NV-603', name: 'Куртка на овчине',       price: 2800, sizes: [44,46,48,50], img: ['nv-3.jpg','nv-4.jpg'],   note: 'Новое поступление' },
  { id: 24, cat: 'novinki',    art: 'NV-604', name: 'Косуха на меху',         price: 2450, sizes: [42,44,46],    img: ['nv-4.jpg','nv-1.jpg'],   note: 'Новое поступление' }
];

window.CATS = [
  { key: 'shuby',      name: 'Шубы' },
  { key: 'dublenki',   name: 'Дублёнки' },
  { key: 'zhilety',    name: 'Жилеты' },
  { key: 'polushubki', name: 'Полушубки' },
  { key: 'palto',      name: 'Пальто' },
  { key: 'novinki',    name: 'Новинки' }
];

/* Куда уходит заявка. Подставьте рабочий номер — и заявки будут
   открываться в мессенджере с готовым текстом. */
window.SHOP = {
  name:    'NORDWOOL',
  phone:   '+375290000000',
  address: 'ул. Примерная, 1',
  hours:   '10:00 — 19:00, сб и вс до 17:00'
};
