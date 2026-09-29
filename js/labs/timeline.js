/* Лаборатория «Хронология истории России» — игры «Расставь по порядку», «Что раньше?» и «Угадай век» на базе общеизвестных школьных дат IX–XXI вв. */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  KL.labs = KL.labs || {};

  /* ================= База событий =================
     [год, событие]. Только общеизвестные даты школьного курса, каждая сверена по учебникам и справочникам. */
  var RAW = [
    /* Древняя Русь */
    [862, 'Призвание варягов: Рюрик в Новгороде'],
    [882, 'Поход Олега на Киев, объединение Новгорода и Киева'],
    [907, 'Поход Олега на Константинополь (Царьград)'],
    [945, 'Гибель князя Игоря в земле древлян'],
    [988, 'Крещение Руси при князе Владимире'],
    [1019, 'Начало княжения Ярослава Мудрого в Киеве'],
    [1097, 'Любечский съезд князей'],
    [1113, 'Начало княжения Владимира Мономаха в Киеве'],
    [1132, 'Смерть Мстислава Великого, начало политической раздробленности'],
    [1147, 'Первое упоминание Москвы в летописи'],
    [1185, 'Поход князя Игоря Святославича на половцев («Слово о полку Игореве»)'],
    [1223, 'Битва на реке Калке'],
    /* Русские земли XIII–XV вв. */
    [1237, 'Начало нашествия Батыя на Северо-Восточную Русь (взятие Рязани)'],
    [1238, 'Битва на реке Сить'],
    [1240, 'Невская битва'],
    [1242, 'Ледовое побоище'],
    [1327, 'Восстание в Твери против ордынцев'],
    [1380, 'Куликовская битва'],
    [1382, 'Разорение Москвы ханом Тохтамышем'],
    [1462, 'Начало правления Ивана III'],
    [1478, 'Присоединение Новгорода к Московскому государству'],
    [1480, 'Стояние на реке Угре, конец ордынского ига'],
    [1497, 'Судебник Ивана III'],
    /* XVI–XVII вв. */
    [1510, 'Присоединение Пскова к Московскому государству'],
    [1514, 'Присоединение Смоленска'],
    [1547, 'Венчание Ивана IV на царство'],
    [1549, 'Созыв первого Земского собора'],
    [1550, 'Судебник Ивана IV'],
    [1552, 'Взятие Казани'],
    [1556, 'Присоединение Астраханского ханства'],
    [1558, 'Начало Ливонской войны'],
    [1565, 'Введение опричнины'],
    [1589, 'Учреждение патриаршества в России'],
    [1598, 'Пресечение династии Рюриковичей, избрание Бориса Годунова'],
    [1612, 'Освобождение Москвы ополчением Минина и Пожарского'],
    [1613, 'Земский собор избрал на царство Михаила Романова'],
    [1648, 'Соляной бунт в Москве'],
    [1649, 'Соборное уложение'],
    [1654, 'Переяславская рада'],
    [1662, 'Медный бунт'],
    [1682, 'Отмена местничества'],
    [1689, 'Нерчинский договор с Китаем'],
    [1697, 'Начало Великого посольства Петра I'],
    /* XVIII в. */
    [1700, 'Начало Северной войны, поражение под Нарвой'],
    [1703, 'Основание Санкт-Петербурга'],
    [1709, 'Полтавская битва'],
    [1711, 'Учреждение Правительствующего сената'],
    [1714, 'Гангутское морское сражение'],
    [1721, 'Ништадтский мир, провозглашение России империей'],
    [1722, 'Табель о рангах'],
    [1725, 'Смерть Петра I'],
    [1755, 'Основание Московского университета'],
    [1762, 'Манифест о вольности дворянства'],
    [1767, 'Созыв Уложенной комиссии Екатерины II'],
    [1773, 'Начало восстания под предводительством Е. И. Пугачёва'],
    [1783, 'Присоединение Крыма к России'],
    [1785, 'Жалованные грамоты дворянству и городам'],
    /* XIX — начало XX в. */
    [1803, 'Указ о вольных хлебопашцах'],
    [1810, 'Учреждение Государственного совета'],
    [1812, 'Бородинское сражение'],
    [1825, 'Восстание декабристов на Сенатской площади'],
    [1837, 'Открытие первой железной дороги: Петербург — Царское Село'],
    [1853, 'Начало Крымской войны'],
    [1861, 'Отмена крепостного права'],
    [1864, 'Земская и судебная реформы'],
    [1874, 'Введение всесословной воинской повинности'],
    [1881, 'Убийство Александра II народовольцами'],
    [1891, 'Начало строительства Транссибирской магистрали'],
    [1897, 'Первая всеобщая перепись населения Российской империи'],
    [1904, 'Начало Русско-японской войны'],
    [1905, 'Кровавое воскресенье, начало Первой российской революции'],
    [1906, 'Начало работы I Государственной думы'],
    [1907, 'Третьеиюньский переворот, роспуск II Государственной думы'],
    [1914, 'Вступление России в Первую мировую войну'],
    /* Советский период */
    [1917, 'Октябрьская революция, приход большевиков к власти'],
    [1918, 'Брестский мир'],
    [1921, 'Переход к новой экономической политике (нэп)'],
    [1922, 'Образование СССР'],
    [1928, 'Начало первой пятилетки'],
    [1929, '«Год великого перелома», начало сплошной коллективизации'],
    [1936, 'Принятие Конституции СССР («сталинской»)'],
    [1939, 'Договор о ненападении между СССР и Германией'],
    [1941, 'Нападение Германии на СССР, начало Великой Отечественной войны'],
    [1943, 'Курская битва'],
    [1945, 'Победа в Великой Отечественной войне'],
    [1949, 'Испытание первой советской атомной бомбы'],
    [1953, 'Смерть И. В. Сталина'],
    [1956, 'XX съезд КПСС, доклад Н. С. Хрущёва о культе личности'],
    [1957, 'Запуск первого искусственного спутника Земли'],
    [1961, 'Полёт Ю. А. Гагарина в космос'],
    [1962, 'Карибский кризис'],
    [1964, 'Отставка Н. С. Хрущёва, приход к власти Л. И. Брежнева'],
    [1965, 'Экономическая реформа А. Н. Косыгина'],
    [1977, 'Принятие Конституции СССР («брежневской»)'],
    [1979, 'Ввод советских войск в Афганистан'],
    [1980, 'Олимпийские игры в Москве'],
    [1985, 'Избрание М. С. Горбачёва генеральным секретарём ЦК КПСС'],
    [1986, 'Авария на Чернобыльской АЭС'],
    [1991, 'Распад СССР'],
    /* Современная Россия */
    [1993, 'Принятие Конституции Российской Федерации'],
    [1998, 'Дефолт, финансовый кризис в России'],
    [2000, 'Избрание В. В. Путина Президентом России'],
    [2008, 'Избрание Д. А. Медведева Президентом России'],
    [2014, 'Зимние Олимпийские игры в Сочи'],
    [2020, 'Общероссийское голосование о поправках к Конституции']
  ];
  var ERAS = [
    ['all', 'Все эпохи', 0, 9999],
    ['anc', 'Древняя Русь (862–1236)', 0, 1236],
    ['mid', 'Русские земли XIII–XV вв.', 1237, 1499],
    ['msk', 'Московское царство XVI–XVII вв.', 1500, 1699],
    ['x18', 'Эпоха Петра I и XVIII в. (1700–1800)', 1700, 1800],
    ['x19', 'XIX — начало XX в. (до 1917)', 1801, 1916],
    ['ussr', 'Советский период (1917–1991)', 1917, 1991],
    ['rf', 'Современная Россия (с 1992)', 1992, 9999]
  ];
  var EVENTS = RAW.map(function (e, i) { return { id: i, year: e[0], text: e[1] }; });
  var KEY = 'kletka.lab.timeline';
  var ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

  /* ================= Утилиты ================= */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function rnd(n) { return Math.floor(Math.random() * n); }
  /* Век по строгому правилу: XVIII век — 1701–1800 гг. */
  function century(y) { return Math.floor((y - 1) / 100) + 1; }
  /* Выбрать n событий с разными годами. */
  function pickDistinct(list, n) {
    var used = {}, out = [];
    shuffle(list).forEach(function (e) { if (out.length < n && !used[e.year]) { used[e.year] = 1; out.push(e); } });
    return out;
  }
  function load() {
    try { var d = JSON.parse(localStorage.getItem(KEY) || '{}'); return d && typeof d === 'object' ? d : {}; }
    catch (e) { return {}; }
  }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* хранилище недоступно */ } }

  /* ================= Стили ================= */
  var CSS = [
    '.lb-tl{display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.lb-tl-top{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:flex-end}',
    '.lb-tl .seg{flex-wrap:wrap}',
    '.lb-tl .seg button{cursor:pointer}',
    '.lb-tl .seg button:focus-visible,.lb-tl-list button:focus-visible,.lb-tl-opt:focus-visible{outline:2px solid var(--ink);outline-offset:2px}',
    '.lb-tl-card{border:1px solid var(--line);border-radius:10px;padding:14px 12px;display:flex;flex-direction:column;gap:12px;min-height:260px;',
    'background:var(--sheet);background-image:repeating-linear-gradient(transparent 0 23px,var(--grid) 23px 24px)}',
    '.lb-tl-q{font-size:15.5px;line-height:1.45;margin:0}',
    '.lb-tl-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
    '.lb-tl-item{display:flex;align-items:center;gap:8px;padding:8px 8px 8px 6px;border:1.5px solid var(--line);border-radius:10px;background:var(--sheet);',
    'box-shadow:var(--shadow-sm);user-select:none;-webkit-user-select:none;transition:border-color .15s,background .15s}',
    '.lb-tl-item.drag{border-color:var(--ink);background:var(--ink-soft);box-shadow:var(--shadow);position:relative;z-index:2}',
    '.lb-tl-grip{flex:none;width:28px;align-self:stretch;display:grid;place-items:center;color:var(--muted);cursor:grab;touch-action:none;font:700 16px var(--f-mono);border-radius:6px}',
    '.lb-tl-grip:hover{background:var(--sheet-2);color:var(--ink)}',
    '.lb-tl-item.drag .lb-tl-grip{cursor:grabbing}',
    '.lb-tl-num{flex:none;font:700 14px var(--f-mono);color:var(--ink);width:18px;text-align:center}',
    '.lb-tl-txt{flex:1;min-width:0;font-size:15px;line-height:1.35;overflow-wrap:anywhere}',
    '.lb-tl-yr{display:block;font:700 13px var(--f-mono);margin-top:2px}',
    '.lb-tl-mv{flex:none;display:flex;flex-direction:column;gap:3px}',
    '.lb-tl-mv button{width:34px;height:28px;border:1px solid var(--line);border-radius:7px;background:var(--sheet-2);color:var(--text);cursor:pointer;font-size:14px;line-height:1;padding:0;touch-action:manipulation}',
    '.lb-tl-mv button:hover:not([disabled]){border-color:var(--ink);color:var(--ink)}',
    '.lb-tl-mv button[disabled]{opacity:.35;cursor:default}',
    '.lb-tl-item.ok{border-color:var(--ok);background:var(--ok-soft)}',
    '.lb-tl-item.bad{border-color:var(--red);background:var(--red-soft)}',
    '.lb-tl-item.ok .lb-tl-yr{color:var(--ok)}.lb-tl-item.bad .lb-tl-yr{color:var(--red)}',
    '.lb-tl-opts{display:grid;gap:8px}',
    '.lb-tl-opts.two{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}',
    '.lb-tl-opts.four{grid-template-columns:repeat(auto-fit,minmax(110px,1fr))}',
    '.lb-tl-opt{border:1.5px solid var(--line);border-radius:10px;background:var(--sheet);color:var(--text);padding:12px;font:600 15px var(--f-body);',
    'text-align:left;cursor:pointer;min-height:48px;line-height:1.35;box-shadow:var(--shadow-sm);touch-action:manipulation;overflow-wrap:anywhere}',
    '.lb-tl-opts.four .lb-tl-opt{text-align:center;font:700 20px var(--f-mono)}',
    '.lb-tl-opt:hover:not([disabled]){border-color:var(--ink)}',
    '.lb-tl-opt[disabled]{cursor:default}',
    '.lb-tl-opt .k{font:600 12px var(--f-mono);color:var(--muted);margin-right:6px}',
    '.lb-tl-opt.ok{border-color:var(--ok);background:var(--ok-soft)}',
    '.lb-tl-opt.bad{border-color:var(--red);background:var(--red-soft)}',
    '.lb-tl-ev{font:600 18px/1.4 var(--f-body);text-align:center;padding:6px 4px;overflow-wrap:anywhere}',
    '.lb-tl-fb{min-height:3em;font-size:15px;line-height:1.5;text-align:center}',
    '.lb-tl-fb .res{font:700 22px var(--f-hand);margin-right:6px}',
    '.lb-tl-fb .ok{color:var(--ok)}.lb-tl-fb .bad{color:var(--red)}',
    '.lb-tl-act{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}',
    '.lb-tl-keys{font-size:12.5px;color:var(--muted);text-align:center;margin:0}',
    '.lb-tl-keys kbd{font:600 11.5px var(--f-mono);border:1px solid var(--line);border-bottom-width:2px;border-radius:4px;padding:0 4px;background:var(--sheet-2)}'
  ].join('\n');
  function injectCss() {
    if (document.getElementById('lab-timeline-css')) return;
    var st = document.createElement('style');
    st.id = 'lab-timeline-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ================= Интерфейс ================= */
  function mount(el) {
    injectCss();
    var root = document.createElement('div');
    root.className = 'lb-tl';
    root.innerHTML =
      '<div class="lb-tl-top">' +
        '<div class="seg" role="group" aria-label="Режим игры">' +
          '<button type="button" data-mode="order" class="on" aria-pressed="true">Расставь по порядку</button>' +
          '<button type="button" data-mode="pair" aria-pressed="false">Что раньше?</button>' +
          '<button type="button" data-mode="age" aria-pressed="false">Угадай век</button>' +
        '</div>' +
        '<label>Эпоха<select data-f="era">' + ERAS.map(function (e) { return '<option value="' + e[0] + '">' + esc(e[1]) + '</option>'; }).join('') + '</select></label>' +
      '</div>' +
      '<div class="score-row">' +
        '<span>Верно: <b data-o="ok">0</b></span><span>Ошибок: <b data-o="bad">0</b></span>' +
        '<span>Серия: <b data-o="streak">0</b></span><span>Рекорд: <b data-o="best">0</b></span>' +
      '</div>' +
      '<div class="lb-tl-card" data-o="card"></div>' +
      '<p class="lab-note">В базе ' + EVENTS.length + ' событий с IX по XXI век — только твёрдые школьные даты. Век считается по правилу: XVIII век — это 1701–1800 гг., поэтому 1700 год относится к XVII веку.</p>';
    el.appendChild(root);

    function o(n) { return root.querySelector('[data-o="' + n + '"]'); }
    var card = o('card'), selEra = root.querySelector('[data-f="era"]');
    var S = { mode: 'order', ok: 0, bad: 0, streak: 0, done: false, items: null, pair: null, age: null };
    var best = load().best || 0;

    function pool() {
      var e = ERAS.filter(function (x) { return x[0] === selEra.value; })[0] || ERAS[0];
      return EVENTS.filter(function (ev) { return ev.year >= e[2] && ev.year <= e[3]; });
    }
    function score() {
      o('ok').textContent = S.ok; o('bad').textContent = S.bad;
      o('streak').textContent = S.streak; o('best').textContent = best;
    }
    function hit(ok) {
      if (ok) {
        S.ok++; S.streak++;
        if (S.streak > best) { best = S.streak; var d = load(); d.best = best; save(d); }
      } else { S.bad++; S.streak = 0; }
      score();
    }
    function focusFirst(sel) { var b = card.querySelector(sel); if (b && root.contains(document.activeElement)) b.focus(); }

    /* ---------- Режим 1: расставь по порядку ---------- */
    function startOrder() {
      var src = pickDistinct(pool(), 4);
      if (src.length < 4) src = pickDistinct(EVENTS, 4);
      var items = shuffle(src), tries = 0;
      while (tries++ < 10 && items.every(function (e, i) { return i === 0 || items[i - 1].year < e.year; })) items = shuffle(src);
      S.items = items; S.done = false;
      card.innerHTML =
        '<p class="lb-tl-q">Расположите события в хронологическом порядке — от самого раннего к самому позднему. Перетащите карточку за «⋮⋮» или используйте стрелки.</p>' +
        '<ol class="lb-tl-list" aria-label="События"></ol>' +
        '<div class="lb-tl-fb" aria-live="polite"></div>' +
        '<div class="lb-tl-act"><button type="button" class="btn primary" data-act="check">Проверить</button></div>' +
        '<p class="lb-tl-keys"><kbd>Enter</kbd> — проверить и дальше</p>';
      renderList();
    }
    function renderList(focusSel) {
      var ol = card.querySelector('.lb-tl-list');
      var sorted = S.items.slice().sort(function (a, b) { return a.year - b.year; });
      ol.innerHTML = S.items.map(function (e, i) {
        var st = S.done ? (sorted[i] === e ? ' ok' : ' bad') : '';
        return '<li class="lb-tl-item' + st + '" data-id="' + e.id + '">' +
          (S.done ? '' : '<span class="lb-tl-grip" aria-hidden="true" title="Перетащить">⋮⋮</span>') +
          '<span class="lb-tl-num" aria-hidden="true">' + (i + 1) + '</span>' +
          '<span class="lb-tl-txt">' + esc(e.text) + (S.done ? '<span class="lb-tl-yr">' + e.year + ' г.</span>' : '') + '</span>' +
          (S.done ? '' : '<span class="lb-tl-mv">' +
            '<button type="button" data-mv="-1" aria-label="Поднять выше: ' + esc(e.text) + '"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button type="button" data-mv="1" aria-label="Опустить ниже: ' + esc(e.text) + '"' + (i === S.items.length - 1 ? ' disabled' : '') + '>↓</button>' +
          '</span>') +
        '</li>';
      }).join('');
      if (focusSel) { var f = ol.querySelector(focusSel); if (f) f.focus(); }
    }
    function move(id, d) {
      var i = -1;
      S.items.forEach(function (e, k) { if (e.id === id) i = k; });
      var j = i + d;
      if (i < 0 || j < 0 || j >= S.items.length) return;
      var t = S.items[i]; S.items[i] = S.items[j]; S.items[j] = t;
      var sel = '[data-id="' + id + '"] [data-mv="' + d + '"]';
      if (j === 0 || j === S.items.length - 1) sel = '[data-id="' + id + '"] [data-mv="' + (-d) + '"]';
      renderList(sel);
    }
    function checkOrder() {
      if (S.done) return;
      S.done = true;
      var ok = S.items.every(function (e, i) { return i === 0 || S.items[i - 1].year < e.year; });
      hit(ok);
      renderList();
      var sorted = S.items.slice().sort(function (a, b) { return a.year - b.year; });
      card.querySelector('.lb-tl-fb').innerHTML = ok
        ? '<span class="res ok">Верно!</span> Все события на своих местах.'
        : '<span class="res bad">Не совсем.</span> Правильный порядок: ' + sorted.map(function (e) { return '<b class="mono">' + e.year + '</b>'; }).join(' → ') + '.';
      var b = card.querySelector('[data-act="check"]');
      b.textContent = 'Новые события'; b.dataset.act = 'next'; b.focus();
    }

    /* Перетаскивание указателем (мышь, палец, перо): карточка меняется местами с соседями по мере движения. */
    var drag = null;
    card.addEventListener('pointerdown', function (e) {
      if (S.mode !== 'order' || S.done || e.button > 0) return;
      var li = e.target.closest('.lb-tl-item');
      if (!li || e.target.closest('button')) return;
      if (e.pointerType !== 'mouse' && !e.target.closest('.lb-tl-grip')) return; /* на сенсоре тянем только за ручку, чтобы не мешать прокрутке */
      e.preventDefault();
      drag = { li: li, id: +li.dataset.id, pid: e.pointerId };
      li.classList.add('drag');
      try { li.setPointerCapture(e.pointerId); } catch (er) { /* нет захвата */ }
    });
    card.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.pid) return;
      e.preventDefault();
      var li = drag.li, prev = li.previousElementSibling, next = li.nextElementSibling;
      if (prev) { var rp = prev.getBoundingClientRect(); if (e.clientY < rp.top + rp.height / 2) { li.parentNode.insertBefore(li, prev); return; } }
      if (next) { var rn = next.getBoundingClientRect(); if (e.clientY > rn.top + rn.height / 2) li.parentNode.insertBefore(next, li); }
    });
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.pid)) return;
      var ids = Array.prototype.map.call(card.querySelectorAll('.lb-tl-item'), function (x) { return +x.dataset.id; });
      var byId = {};
      S.items.forEach(function (it) { byId[it.id] = it; });
      S.items = ids.map(function (id) { return byId[id]; });
      drag = null;
      renderList();
    }
    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);
    card.addEventListener('lostpointercapture', endDrag);

    /* ---------- Режим 2: что раньше ---------- */
    function startPair() {
      var p = pool();
      var two = pickDistinct(p, 2);
      if (two.length < 2) two = pickDistinct(EVENTS, 2);
      S.pair = two; S.done = false;
      card.innerHTML =
        '<p class="lb-tl-q">Какое событие произошло <b>раньше</b>?</p>' +
        '<div class="lb-tl-opts two">' + two.map(function (e, i) {
          return '<button type="button" class="lb-tl-opt" data-pick="' + i + '"><span class="k">' + (i + 1) + '</span>' + esc(e.text) + '<span class="lb-tl-yr" hidden></span></button>';
        }).join('') + '</div>' +
        '<div class="lb-tl-fb" aria-live="polite"></div>' +
        '<div class="lb-tl-act"><button type="button" class="btn primary" data-act="next" hidden>Дальше</button></div>' +
        '<p class="lb-tl-keys"><kbd>1</kbd> <kbd>2</kbd> — выбор, <kbd>Enter</kbd> — дальше</p>';
    }
    function answerPair(i) {
      if (S.done) return;
      S.done = true;
      var a = S.pair, early = a[0].year < a[1].year ? 0 : 1, ok = i === early;
      hit(ok);
      var bs = card.querySelectorAll('.lb-tl-opt');
      for (var k = 0; k < bs.length; k++) {
        bs[k].disabled = true;
        var y = bs[k].querySelector('.lb-tl-yr');
        y.hidden = false; y.textContent = a[k].year + ' г.';
        if (k === early) bs[k].classList.add('ok'); else if (k === i) bs[k].classList.add('bad');
      }
      var gap = Math.abs(a[0].year - a[1].year);
      card.querySelector('.lb-tl-fb').innerHTML = (ok ? '<span class="res ok">Верно!</span>' : '<span class="res bad">Нет.</span>') +
        ' Раньше: «' + esc(a[early].text) + '» (' + a[early].year + ' г.). Разница — ' + gap + ' ' + yearsWord(gap) + '.';
      var b = card.querySelector('[data-act="next"]'); b.hidden = false; b.focus();
    }
    function yearsWord(n) {
      var m10 = n % 10, m100 = n % 100;
      if (m10 === 1 && m100 !== 11) return 'год';
      if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'года';
      return 'лет';
    }

    /* ---------- Режим 3: угадай век ---------- */
    function startAge() {
      var p = pool().filter(function (e) { return e.year % 100 !== 0; });
      if (!p.length) p = EVENTS.filter(function (e) { return e.year % 100 !== 0; });
      var ev = p[rnd(p.length)], c = century(ev.year);
      /* Четыре соседних века, в пределах IX–XXI. */
      var lo = Math.max(9, Math.min(c - rnd(4), 21 - 3));
      var opts = [lo, lo + 1, lo + 2, lo + 3];
      S.age = { ev: ev, c: c, opts: opts }; S.done = false;
      card.innerHTML =
        '<p class="lb-tl-q">В каком веке произошло событие?</p>' +
        '<div class="lb-tl-ev">' + esc(ev.text) + '</div>' +
        '<div class="lb-tl-opts four" role="group" aria-label="Варианты века">' + opts.map(function (v, i) {
          return '<button type="button" class="lb-tl-opt" data-pick="' + i + '" aria-label="' + ROMAN[v] + ' век">' + ROMAN[v] + '</button>';
        }).join('') + '</div>' +
        '<div class="lb-tl-fb" aria-live="polite"></div>' +
        '<div class="lb-tl-act"><button type="button" class="btn primary" data-act="next" hidden>Дальше</button></div>' +
        '<p class="lb-tl-keys"><kbd>1</kbd>–<kbd>4</kbd> — выбор, <kbd>Enter</kbd> — дальше</p>';
    }
    function answerAge(i) {
      if (S.done) return;
      S.done = true;
      var a = S.age, ok = a.opts[i] === a.c;
      hit(ok);
      var bs = card.querySelectorAll('.lb-tl-opt');
      for (var k = 0; k < bs.length; k++) {
        bs[k].disabled = true;
        if (a.opts[k] === a.c) bs[k].classList.add('ok'); else if (k === i) bs[k].classList.add('bad');
      }
      var c = a.c;
      card.querySelector('.lb-tl-fb').innerHTML = (ok ? '<span class="res ok">Верно!</span>' : '<span class="res bad">Нет.</span>') +
        ' ' + a.ev.year + ' г. — ' + ROMAN[c] + ' век (' + ((c - 1) * 100 + 1) + '–' + (c * 100) + ' гг.).';
      var b = card.querySelector('[data-act="next"]'); b.hidden = false; b.focus();
    }

    /* ---------- Общее ---------- */
    function start(focus) {
      if (S.mode === 'order') startOrder();
      else if (S.mode === 'pair') startPair();
      else startAge();
      if (focus) focusFirst(S.mode === 'order' ? '.lb-tl-mv button:not([disabled])' : '.lb-tl-opt');
    }
    root.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t || !root.contains(t)) return;
      if (t.dataset.mode) {
        if (t.dataset.mode === S.mode) return;
        S.mode = t.dataset.mode;
        var bs = root.querySelectorAll('[data-mode]');
        for (var i = 0; i < bs.length; i++) {
          var on = bs[i].dataset.mode === S.mode;
          bs[i].classList.toggle('on', on);
          bs[i].setAttribute('aria-pressed', on ? 'true' : 'false');
        }
        start();
        return;
      }
      if (t.dataset.mv) { move(+t.closest('.lb-tl-item').dataset.id, +t.dataset.mv); return; }
      if (t.dataset.pick != null) { if (S.mode === 'pair') answerPair(+t.dataset.pick); else answerAge(+t.dataset.pick); return; }
      if (t.dataset.act === 'check') checkOrder();
      else if (t.dataset.act === 'next') start(true);
    });
    selEra.addEventListener('change', function () { start(); });
    root.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var tg = e.target;
      if (tg.tagName === 'SELECT' || tg.tagName === 'INPUT' || tg.closest('.lb-tl-top')) return;
      var d = /^[1-4]$/.test(e.key) ? +e.key : 0;
      if (d && !S.done && (S.mode === 'pair' && d <= 2 || S.mode === 'age')) {
        e.preventDefault();
        if (S.mode === 'pair') answerPair(d - 1); else answerAge(d - 1);
        return;
      }
      if (e.key === 'Enter' && tg.tagName !== 'BUTTON') {
        if (S.mode === 'order' && !S.done) { e.preventDefault(); checkOrder(); }
        else if (S.done) { e.preventDefault(); start(true); }
      }
    });

    score();
    start();
  }

  KL.labs.timeline = {
    title: 'Хронология истории России',
    icon: '1613',
    desc: 'Расставьте события по порядку, выберите, что было раньше, угадайте век',
    long: 'Игры на знание дат истории России с IX по XXI век: расставьте четыре события в хронологическом порядке, выберите более раннее событие из двух или определите век. Можно тренироваться по отдельным эпохам.',
    subjectName: 'История',
    mount: mount,
    _events: EVENTS,
    _century: century
  };
})();
