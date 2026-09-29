/* Лаборатория «Высота Солнца и время» — полуденная высота Солнца по широте и дате, полярный день и ночь; местное время по долготе и поясное время. */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  KL.labs = KL.labs || {};

  /* ---------- Данные ---------- */
  /* Координаты городов (градусы, северная широта и восточная долгота — плюс) и официальное поясное время
     (для зарубежных городов — стандартное, «зимнее», без перехода на летнее время). */
  var CITIES = [
    { n: 'Москва', lat: 55.75, lon: 37.62, utc: 3 },
    { n: 'Санкт-Петербург', lat: 59.94, lon: 30.31, utc: 3 },
    { n: 'Калининград', lat: 54.71, lon: 20.51, utc: 2 },
    { n: 'Мурманск', lat: 68.97, lon: 33.08, utc: 3 },
    { n: 'Сочи', lat: 43.59, lon: 39.72, utc: 3 },
    { n: 'Екатеринбург', lat: 56.84, lon: 60.61, utc: 5 },
    { n: 'Новосибирск', lat: 55.03, lon: 82.92, utc: 7 },
    { n: 'Норильск', lat: 69.35, lon: 88.2, utc: 7 },
    { n: 'Иркутск', lat: 52.29, lon: 104.3, utc: 8 },
    { n: 'Якутск', lat: 62.03, lon: 129.73, utc: 9 },
    { n: 'Владивосток', lat: 43.12, lon: 131.89, utc: 10 },
    { n: 'Петропавловск-Камчатский', lat: 53.02, lon: 158.65, utc: 12 },
    { n: 'Лондон (Гринвич)', lat: 51.48, lon: 0, utc: 0 },
    { n: 'Каир', lat: 30.04, lon: 31.24, utc: 2 },
    { n: 'Сингапур', lat: 1.29, lon: 103.85, utc: 8 },
    { n: 'Нью-Йорк', lat: 40.71, lon: -74.01, utc: -5 },
    { n: 'Рио-де-Жанейро', lat: -22.91, lon: -43.17, utc: -3 },
    { n: 'Сидней', lat: -33.87, lon: 151.21, utc: 10 }
  ];
  var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  var TILT = 23.44;      /* наклон оси Земли к перпендикуляру к плоскости орбиты */
  var TILT_SCHOOL = 23.5;

  /* ---------- Вычисления ---------- */
  function fmt(x, d) {
    if (d == null) d = 2;
    if (!isFinite(x)) return '—';
    var k = Math.pow(10, d), v = Math.round(x * k) / k;
    if (v === 0) v = 0;
    var s = v.toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('.', ',').replace('-', '−');
  }
  function sgn(x, d) { var s = fmt(x, d); return (Math.round(x * 100) / 100 > 0 ? '+' : '') + s; }
  function dayOfYear(day, month) { /* month 0..11, невисокосный год */
    var n = day;
    for (var i = 0; i < month; i++) n += MDAYS[i];
    return n;
  }
  function declination(N, eps) { /* приближённая формула Купера */
    return eps * Math.sin((360 / 365) * (284 + N) * Math.PI / 180);
  }
  function sunAt(phi, delta) {
    var hMax = 90 - Math.abs(phi - delta);        /* верхняя кульминация — полдень */
    var hMin = Math.abs(phi + delta) - 90;        /* нижняя кульминация — полночь */
    return { hMax: hMax, hMin: hMin };
  }
  function latText(phi) {
    if (Math.abs(phi) < 1e-9) return '0° (экватор)';
    return fmt(Math.abs(phi)) + '° ' + (phi > 0 ? 'с. ш.' : 'ю. ш.');
  }
  function lonText(l) {
    if (Math.abs(l) < 1e-9) return '0° (Гринвич)';
    if (Math.abs(Math.abs(l) - 180) < 1e-9) return '180°';
    return fmt(Math.abs(l)) + '° ' + (l > 0 ? 'в. д.' : 'з. д.');
  }
  /* «55,75», «-33,9», «33,9 ю», «74 з. д.» → число со знаком */
  function parseCoord(raw, max, kind) {
    var s = String(raw || '').trim().toLowerCase().replace(/\s+/g, '').replace(/[−–—]/g, '-').replace(',', '.').replace(/°/g, '');
    if (!s) return { error: 'впишите число' };
    var sign = 1, m = s.match(/^(-?\d+(?:\.\d+)?)([a-zа-яё.]*)$/);
    if (!m) return { error: 'не число: пишите, например, ' + (kind === 'lat' ? '55,75 или −33,9' : '37,62 или −74') };
    var suf = m[2].replace(/\./g, '');
    if (suf) {
      var pos = kind === 'lat' ? /^(с|сш|n)$/ : /^(в|вд|e)$/;
      var neg = kind === 'lat' ? /^(ю|юш|s)$/ : /^(з|зд|w)$/;
      if (pos.test(suf)) sign = 1;
      else if (neg.test(suf)) sign = -1;
      else return { error: 'непонятное обозначение «' + m[2] + '»: ' + (kind === 'lat' ? 'с. ш. или ю. ш.' : 'в. д. или з. д.') };
      if (m[1].charAt(0) === '-') return { error: 'либо минус, либо буква полушария — не вместе' };
    }
    var v = sign * parseFloat(m[1]);
    if (Math.abs(v) > max) return { error: (kind === 'lat' ? 'широта' : 'долгота') + ' — от −' + max + ' до ' + max + '°' };
    return { v: v };
  }
  /* зона по долготе: 15° на пояс, границы поясов — через 7,5° от центральных меридианов */
  function zoneByLon(l) { var z = Math.round(l / 15); return z === 0 ? 0 : z; }
  function utcText(z) { return 'UTC' + (z === 0 ? '' : (z > 0 ? '+' : '−') + Math.abs(z)); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  /* сек от полуночи → «чч:мм» или «чч:мм:сс» + сдвиг суток */
  function clock(sec) {
    var S = Math.round(sec), day = Math.floor(S / 86400);
    S -= day * 86400;
    var h = Math.floor(S / 3600), m = Math.floor(S % 3600 / 60), s = S % 60;
    var t = pad2(h) + ':' + pad2(m) + (s ? ':' + pad2(s) : '');
    var d = day === 0 ? '' : day === 1 ? 'следующие сутки' : day === -1 ? 'предыдущие сутки' : (day > 0 ? '+' : '−') + Math.abs(day) + ' сут.';
    return { t: t, d: d };
  }
  function durText(sec) { /* длительность без знака */
    var S = Math.round(Math.abs(sec)), h = Math.floor(S / 3600), m = Math.floor(S % 3600 / 60), s = S % 60, out = [];
    if (h) out.push(h + ' ч');
    if (m) out.push(m + ' мин');
    if (s) out.push(s + ' с');
    return out.length ? out.join(' ') : '0 мин';
  }

  /* ---------- Стили ---------- */
  var CSS = [
    '.lb-sun-tabs{flex-wrap:wrap}',
    '.lb-sun-panel{display:flex;flex-direction:column;gap:14px;min-width:0}',
    '.lb-sun-panel[hidden]{display:none}',
    '.lb-sun-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px 18px;align-items:end}',
    '.lb-sun-lat{display:flex;gap:10px;align-items:center;flex-wrap:wrap}',
    '.lb-sun-lat input[type=range]{flex:1 1 150px;width:auto}',
    '.lb-sun-lat input[type=text]{width:6.5em}',
    '.lb-sun-val{font:600 14px var(--f-mono);color:var(--ink)}',
    '.lb-sun-err{font-size:13px;color:var(--red)}',
    '.lb-sun-err:empty{display:none}',
    '.lb-sun-dates{flex-wrap:wrap}',
    '.lb-sun-custom{display:flex;gap:10px;flex-wrap:wrap}',
    '.lb-sun-custom[hidden]{display:none}',
    '.lb-sun-status{font-size:14.5px;line-height:1.5;padding:10px 12px;border-radius:10px;background:var(--sheet-2);border:1px solid var(--line);color:var(--text)}',
    '.lb-sun-status b{color:var(--ink)}',
    '.lb-sun-status.day b{color:var(--warn)}',
    '.lb-sun-status.night b{color:var(--muted)}',
    '.lb-sun-pts{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}',
    '.lb-sun-pt{border:1px solid var(--line);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px;background:var(--sheet);min-width:0}',
    '.lb-sun-pt h4{margin:0;font-size:15px;color:var(--text)}',
    '.lb-sun-pt h4 span{display:inline-block;min-width:1.6em;height:1.6em;line-height:1.6em;text-align:center;border-radius:6px;background:var(--ink);color:var(--sheet);font:700 13px var(--f-mono);margin-right:6px}',
    '.lb-sun-pt select,.lb-sun-pt input{width:100%}',
    '.lb-sun-pt input[type=time]{border:1.5px solid var(--grid-strong);border-radius:8px;padding:7px 10px;background:var(--sheet);font-family:var(--f-mono);font-size:15px;color:var(--text);min-width:0}',
    '.lb-sun-pt input[type=time]:focus{outline:none;border-color:var(--ink);box-shadow:0 0 0 4px var(--ink-soft)}',
    '.lb-sun-how{font-size:14.5px;line-height:1.6;color:var(--text);padding:10px 12px;border-radius:10px;background:var(--sheet-2);border:1px solid var(--line)}',
    '.lb-sun-how p{margin:0 0 4px}',
    '.lb-sun-how p:last-child{margin:0}',
    '.lb-sun-how b{font-family:var(--f-mono)}',
    '.lb-sun-panel .readout b{font-size:16px;overflow-wrap:anywhere}',
    '.lb-sun-note p{margin:0 0 6px}',
    '.lb-sun-note p:last-child{margin:0}'
  ].join('\n');
  function injectCSS() {
    if (document.getElementById('lab-sun-css')) return;
    var st = document.createElement('style');
    st.id = 'lab-sun-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Монтирование ---------- */
  function mount(el) {
    injectCSS();
    var cityOpts = '<option value="">— свой пункт —</option>' + CITIES.map(function (c, i) { return '<option value="' + i + '">' + esc(c.n) + '</option>'; }).join('');
    var zoneOpts = '<option value="auto">по долготе</option>';
    for (var z = -12; z <= 14; z++) zoneOpts += '<option value="' + z + '">' + utcText(z) + '</option>';
    var dayOpts = '', monOpts = '';
    for (var d = 1; d <= 31; d++) dayOpts += '<option value="' + d + '">' + d + '</option>';
    MONTHS.forEach(function (m, i) { monOpts += '<option value="' + i + '">' + m + '</option>'; });

    el.innerHTML =
      '<div class="lab-row"><div class="seg lb-sun-tabs" role="group" aria-label="Раздел">' +
        '<button type="button" data-tab="h" class="on" aria-pressed="true">Высота Солнца</button>' +
        '<button type="button" data-tab="t" aria-pressed="false">Местное и поясное время</button>' +
      '</div></div>' +

      /* ----- (а) высота Солнца ----- */
      '<div class="lb-sun-panel" data-panel="h">' +
        '<div class="lb-sun-grid">' +
          '<label>Пункт<select data-r="city">' + cityOpts + '</select></label>' +
          '<label>Широта φ: <span class="lb-sun-val" data-o="lat"></span>' +
            '<span class="lb-sun-lat"><input type="range" min="-90" max="90" step="1" value="56" data-r="latR" aria-label="Широта, градусы (ползунок)">' +
            '<input type="text" value="55,75" data-r="latT" autocomplete="off" spellcheck="false" aria-label="Широта, градусы: плюс — северная, минус — южная"></span>' +
            '<span class="lb-sun-err" data-r="latE" aria-live="polite"></span></label>' +
        '</div>' +
        '<div class="lab-row"><div class="seg lb-sun-dates" role="group" aria-label="Дата">' +
          '<button type="button" data-date="jun" class="on" aria-pressed="true">22 июня</button>' +
          '<button type="button" data-date="eq" aria-pressed="false">21 марта / 23 сентября</button>' +
          '<button type="button" data-date="dec" aria-pressed="false">22 декабря</button>' +
          '<button type="button" data-date="custom" aria-pressed="false">Своя дата</button>' +
        '</div></div>' +
        '<div class="lb-sun-custom" data-r="custom" hidden>' +
          '<label>День<select data-r="day">' + dayOpts + '</select></label>' +
          '<label>Месяц<select data-r="mon">' + monOpts + '</select></label>' +
        '</div>' +
        '<label class="inline"><input type="checkbox" data-r="school"> наклон 23,5° (школьное округление вместо 23,44°)</label>' +
        '<div class="lb-sun-wrap"><canvas role="img" aria-label="Схема: Земля в разрезе по меридиану и полуденная высота Солнца над горизонтом"></canvas></div>' +
        '<div class="readout" data-r="outH"></div>' +
        '<div class="lb-sun-status" data-r="status" aria-live="polite"></div>' +
        '<div class="lab-note lb-sun-note">' +
          '<p>Полуденная высота Солнца: $h = 90^\\circ - |\\varphi - \\delta|$, где $\\varphi$ — широта (северная со знаком «+», южная — «−»), $\\delta$ — склонение Солнца, широта, над которой Солнце в этот день в зените.</p>' +
          '<p>22 июня $\\delta = +23{,}44^\\circ$ (Солнце в зените над Северным тропиком), 21 марта и 23 сентября $\\delta = 0$ (над экватором), 22 декабря $\\delta = -23{,}44^\\circ$ (над Южным тропиком). Для других дней — приближённо $\\delta \\approx 23{,}44^\\circ \\cdot \\sin\\left(\\frac{360^\\circ}{365}(284 + N)\\right)$, $N$ — номер дня в году (погрешность до 1–2°).</p>' +
          '<p>Полярный день — когда Солнце не опускается под горизонт и в полночь: $|\\varphi + \\delta| - 90^\\circ > 0$. Рефракция и размер солнечного диска не учитываются.</p>' +
        '</div>' +
      '</div>' +

      /* ----- (б) время ----- */
      '<div class="lb-sun-panel" data-panel="t" hidden>' +
        '<div class="lb-sun-pts">' +
          '<div class="lb-sun-pt"><h4><span>A</span>Пункт, где время известно</h4>' +
            '<label>Город<select data-r="cityA">' + cityOpts + '</select></label>' +
            '<label>Долгота (восточная — «+», западная — «−»)<input type="text" value="37,62" data-r="lonA" autocomplete="off" spellcheck="false"></label>' +
            '<span class="lb-sun-err" data-r="lonAE" aria-live="polite"></span>' +
            '<label>Время в пункте A<input type="time" value="12:00" data-r="timeA"></label>' +
            '<label>Часовой пояс A<select data-r="zoneA">' + zoneOpts + '</select></label>' +
          '</div>' +
          '<div class="lb-sun-pt"><h4><span>B</span>Пункт, где время ищем</h4>' +
            '<label>Город<select data-r="cityB">' + cityOpts + '</select></label>' +
            '<label>Долгота (восточная — «+», западная — «−»)<input type="text" value="82,92" data-r="lonB" autocomplete="off" spellcheck="false"></label>' +
            '<span class="lb-sun-err" data-r="lonBE" aria-live="polite"></span>' +
            '<label>Часовой пояс B<select data-r="zoneB">' + zoneOpts + '</select></label>' +
          '</div>' +
        '</div>' +
        '<div class="readout" data-r="outT"></div>' +
        '<div class="lb-sun-how" data-r="how" aria-live="polite"></div>' +
        '<div class="lab-note lb-sun-note">' +
          '<p><b>Местное (солнечное) время</b> зависит только от долготы: Земля поворачивается на 360° за 24 ч, то есть на 15° за 1 час и на 1° за 4 минуты. Восточнее — время больше, западнее — меньше. Местный полдень — момент, когда Солнце выше всего над горизонтом.</p>' +
          '<p><b>Поясное время</b> одинаково во всём часовом поясе. Теоретически поясов 24, каждый шириной 15°, центральный меридиан пояса UTC+n — это 15·n° в. д. На деле границы поясов проведены по границам стран и регионов, поэтому для городов подставлено официальное время (у зарубежных — зимнее). Выберите «по долготе», чтобы получить теоретический пояс.</p>' +
        '</div>' +
      '</div>';

    function R(n) { return el.querySelector('[data-r="' + n + '"]'); }
    var cv = el.querySelector('canvas'), ctx = cv.getContext('2d'), wrap = el.querySelector('.lb-sun-wrap');
    var st = { W: 0, H: 0, dpr: 1, phi: 55.75, date: 'jun', day: 22, mon: 5 };
    var raf = 0;

    R('city').value = '0';
    R('cityA').value = '0'; R('zoneA').value = '3';
    R('cityB').value = '6'; R('zoneB').value = '7';
    R('day').value = '22'; R('mon').value = '5';

    /* ---------- (а) Высота Солнца ---------- */
    function eps() { return R('school').checked ? TILT_SCHOOL : TILT; }
    function curDelta() {
      var e = eps();
      if (st.date === 'jun') return { d: e, txt: '22 июня', N: null };
      if (st.date === 'dec') return { d: -e, txt: '22 декабря', N: null };
      if (st.date === 'eq') return { d: 0, txt: '21 марта / 23 сентября', N: null };
      var N = dayOfYear(st.day, st.mon);
      return { d: declination(N, e), txt: st.day + ' ' + MONTHS[st.mon], N: N };
    }
    function calcH() {
      var D = curDelta(), s = sunAt(st.phi, D.d);
      R('latE').textContent = '';
      el.querySelector('[data-o="lat"]').textContent = latText(st.phi);
      var where = Math.abs(st.phi - D.d) < 1e-9 ? 'в зените' : st.phi > D.d ? 'на юге' : 'на севере';
      var shadow = s.hMax <= 0 ? '—' : s.hMax >= 90 - 1e-9 ? '0 м' : fmt(1 / Math.tan(s.hMax * Math.PI / 180)) + ' м';
      R('outH').innerHTML =
        '<div><b>' + sgn(D.d) + '°</b><span>склонение Солнца δ' + (D.N ? ' (день № ' + D.N + ')' : '') + '</span></div>' +
        '<div><b>' + fmt(s.hMax) + '°</b><span>высота Солнца в полдень</span></div>' +
        '<div><b>' + (s.hMax > 0 ? where : '—') + '</b><span>где Солнце в полдень</span></div>' +
        '<div><b>' + shadow + '</b><span>тень от шеста 1 м в полдень</span></div>' +
        '<div><b>' + fmt(s.hMin) + '°</b><span>высота Солнца в полночь</span></div>';
      var cls = '', txt;
      var e = 1e-9;
      if (Math.abs(s.hMax) <= e && Math.abs(s.hMin) <= e) { cls = 'day'; txt = '<b>Солнце весь день у горизонта:</b> оно движется вдоль горизонта, не поднимаясь и не опускаясь (полюс в день равноденствия).'; }
      else if (s.hMax < -e) { cls = 'night'; txt = '<b>Полярная ночь.</b> Даже в полдень Солнце на ' + fmt(-s.hMax) + '° ниже горизонта.'; }
      else if (Math.abs(s.hMax) <= e) { cls = 'night'; txt = '<b>Граница полярной ночи:</b> в полдень Солнце лишь касается горизонта, а весь остальной день оно под горизонтом.'; }
      else if (s.hMin > e) { cls = 'day'; txt = '<b>Полярный день.</b> Солнце не заходит: даже в полночь оно на ' + fmt(s.hMin) + '° выше горизонта.'; }
      else if (Math.abs(s.hMin) <= e) { cls = 'day'; txt = '<b>Граница полярного дня:</b> в полночь Солнце касается горизонта, но не заходит.'; }
      else {
        txt = '<b>Солнце восходит и заходит.</b> ';
        if (where === 'в зените') txt += 'В полдень Солнце в зените: лучи падают отвесно, предметы не отбрасывают тени.';
        else txt += 'В полдень Солнце ' + where + ', тени направлены ' + (where === 'на юге' ? 'на север' : 'на юг') + '.';
      }
      txt += ' <span class="muted">Расчёт: h = 90° − |' + fmt(st.phi) + '° − (' + sgn(D.d) + '°)| = 90° − ' + fmt(Math.abs(st.phi - D.d)) + '° = ' + fmt(s.hMax) + '°.</span>';
      var st2 = R('status');
      st2.className = 'lb-sun-status' + (cls ? ' ' + cls : '');
      st2.innerHTML = txt;
      schedule();
    }
    function setPhi(v, from) {
      st.phi = Math.max(-90, Math.min(90, v));
      if (from !== 'range') R('latR').value = String(Math.round(st.phi));
      if (from !== 'text') R('latT').value = fmt(st.phi).replace('−', '-');
      if (from !== 'city') {
        var ci = R('city').value;
        if (ci !== '' && Math.abs(CITIES[+ci].lat - st.phi) > 1e-9) R('city').value = '';
      }
      calcH();
    }
    R('city').addEventListener('change', function () {
      var ci = this.value;
      if (ci === '') return;
      setPhi(CITIES[+ci].lat, 'city');
    });
    R('latR').addEventListener('input', function () { setPhi(+this.value, 'range'); });
    R('latT').addEventListener('input', function () {
      var r = parseCoord(this.value, 90, 'lat');
      if (r.error) { R('latE').textContent = 'Широта: ' + r.error + '.'; return; }
      setPhi(r.v, 'text');
    });
    R('latT').addEventListener('change', function () { if (!R('latE').textContent) this.value = fmt(st.phi).replace('−', '-'); });
    el.querySelectorAll('[data-date]').forEach(function (b) {
      b.addEventListener('click', function () {
        st.date = b.getAttribute('data-date');
        el.querySelectorAll('[data-date]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        R('custom').hidden = st.date !== 'custom';
        calcH();
      });
    });
    function fixDays() {
      var m = +R('mon').value, max = MDAYS[m], sel = R('day');
      Array.prototype.forEach.call(sel.options, function (o) { o.disabled = +o.value > max; o.hidden = +o.value > max; });
      if (+sel.value > max) sel.value = String(max);
      st.day = +sel.value; st.mon = m;
    }
    R('day').addEventListener('change', function () { fixDays(); calcH(); });
    R('mon').addEventListener('change', function () { fixDays(); calcH(); });
    R('school').addEventListener('change', calcH);

    /* ---------- Рисование ---------- */
    function col(cs, n) { return cs.getPropertyValue(n).trim(); }
    function txt(s, x, y, c, al, bl) { ctx.fillStyle = c; ctx.textAlign = al || 'left'; ctx.textBaseline = bl || 'alphabetic'; ctx.fillText(s, x, y); }
    function arrowHead(x, y, ang, c, sz) {
      ctx.fillStyle = c; ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - sz * Math.cos(ang - 0.4), y - sz * Math.sin(ang - 0.4));
      ctx.lineTo(x - sz * Math.cos(ang + 0.4), y - sz * Math.sin(ang + 0.4));
      ctx.closePath(); ctx.fill();
    }
    function drawSun(x, y, r, C) {
      ctx.strokeStyle = C.warn; ctx.lineWidth = 2;
      for (var i = 0; i < 8; i++) {
        var a = i * Math.PI / 4;
        ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * (r + 3), y + Math.sin(a) * (r + 3)); ctx.lineTo(x + Math.cos(a) * (r + 8), y + Math.sin(a) * (r + 8)); ctx.stroke();
      }
      ctx.fillStyle = C.warn; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    }
    /* Земля в разрезе по полуденному меридиану; лучи идут справа налево */
    function drawGlobe(bx, by, bw, bh, C, D, font) {
      txt('Земля: разрез по меридиану', bx + 8, by + 8, C.muted, 'left', 'top');
      var R0 = Math.max(30, Math.min(bw * 0.3, (bh - 50) * 0.42));
      var cx = bx + bw * 0.42, cy = by + bh / 2 + 10, d = D.d;
      function P(lat, r) { var t = (lat - d) * Math.PI / 180; r = r || R0; return { x: cx + r * Math.cos(t), y: cy - r * Math.sin(t) }; }
      /* лучи */
      ctx.strokeStyle = C.warn; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.75;
      for (var k = -2; k <= 2; k++) {
        var yy = cy + k * R0 * 0.42, xs = bx + bw - 6;
        var xe = cx + Math.sqrt(Math.max(0, R0 * R0 - (yy - cy) * (yy - cy)));
        ctx.beginPath(); ctx.moveTo(xs, yy); ctx.lineTo(xe + 4, yy); ctx.stroke();
        arrowHead(xe + 2, yy, Math.PI, C.warn, 7);
      }
      ctx.globalAlpha = 1;
      /* шар и ночная сторона */
      ctx.fillStyle = C.sheet2; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, 7); ctx.fill();
      ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = C.text;
      ctx.beginPath(); ctx.arc(cx, cy, R0, Math.PI / 2, Math.PI * 1.5); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, 7); ctx.stroke();
      /* параллели: экватор, тропики, полярные круги */
      var e = eps();
      [[0, 1.3, []], [e, 1, [3, 3]], [-e, 1, [3, 3]], [90 - e, 1, [1, 3]], [-(90 - e), 1, [1, 3]]].forEach(function (p) {
        /* концы хорды: точка широты φ (угол φ − δ) и её отражение относительно оси (угол 180° − φ − δ), P() сам вычитает δ */
        var a = P(p[0]), b = P(180 - p[0]);
        ctx.strokeStyle = C.ink; ctx.globalAlpha = p[0] === 0 ? 0.7 : 0.4; ctx.lineWidth = p[1]; ctx.setLineDash(p[2]);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      ctx.setLineDash([]); ctx.globalAlpha = 1;
      /* ось */
      var np = P(90, R0 + 14), sp = P(-90, R0 + 14);
      ctx.strokeStyle = C.text; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(sp.x, sp.y); ctx.lineTo(np.x, np.y); ctx.stroke();
      ctx.font = '600 12px ' + font;
      var npl = P(90, R0 + 24), spl = P(-90, R0 + 24);
      txt('С', npl.x, npl.y, C.text, 'center', 'middle');
      txt('Ю', spl.x, spl.y, C.text, 'center', 'middle');
      var eqL = P(180); /* левый конец экватора: угол 180° − δ */
      ctx.font = '11px ' + font;
      txt('экватор', eqL.x - 4, eqL.y, C.muted, 'right', 'middle');
      /* наблюдатель */
      var o = P(st.phi), t = (st.phi - d) * Math.PI / 180;
      var tx = -Math.sin(t), ty = -Math.cos(t); /* касательная (в экранных координатах) */
      ctx.strokeStyle = C.red; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(o.x - tx * 26, o.y - ty * 26); ctx.lineTo(o.x + tx * 26, o.y + ty * 26); ctx.stroke();
      if (Math.cos(t) > 1e-6) {
        /* луч, приходящий в точку наблюдателя */
        ctx.strokeStyle = C.warn; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(bx + bw - 6, o.y); ctx.lineTo(o.x + 3, o.y); ctx.stroke();
        arrowHead(o.x + 1, o.y, Math.PI, C.warn, 8);
      }
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(o.x, o.y, 4.5, 0, 7); ctx.fill();
      ctx.font = '600 12px ' + font;
      var lx = o.x + Math.cos(t) * 12, ly = o.y - Math.sin(t) * 12;
      txt('φ', lx + (Math.cos(t) >= 0 ? 2 : -2), ly - 6, C.red, Math.cos(t) >= 0 ? 'left' : 'right', 'bottom');
      ctx.font = '11px ' + font;
      txt('день', cx + R0 * 0.55, cy + R0 + 16, C.muted, 'center', 'top');
      txt('ночь', cx - R0 * 0.55, cy + R0 + 16, C.muted, 'center', 'top');
    }
    /* Полуденное небо над наблюдателем: слева север, справа юг */
    function drawSky(bx, by, bw, bh, C, D, font, mono) {
      var s = sunAt(st.phi, D.d), h = s.hMax;
      txt('Полдень: вид сбоку', bx + 8, by + 8, C.muted, 'left', 'top');
      var gy = by + bh - 30, ox = bx + bw / 2;
      var Rs = Math.max(40, Math.min(bw * 0.4, bh - 76));
      /* небосвод */
      ctx.strokeStyle = C.line; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.arc(ox, gy, Rs, Math.PI, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
      /* зенит */
      ctx.strokeStyle = C.line; ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox, gy - Rs - 6); ctx.stroke();
      ctx.font = '11px ' + font; txt('зенит', ox, gy - Rs - 8, C.muted, 'center', 'bottom');
      /* земля */
      ctx.fillStyle = C.sheet2; ctx.fillRect(bx + 6, gy, bw - 12, by + bh - gy - 4);
      ctx.strokeStyle = C.text; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx + 6, gy); ctx.lineTo(bx + bw - 6, gy); ctx.stroke();
      ctx.font = '600 12px ' + font;
      txt('С', bx + 12, gy + 6, C.text, 'left', 'top');
      txt('Ю', bx + bw - 12, gy + 6, C.text, 'right', 'top');
      txt('горизонт', ox, gy + 8, C.muted, 'center', 'top');
      /* положение Солнца: угол от направления на юг (0) через зенит (90) к северу (180) */
      var south = st.phi >= D.d;
      var ang = south ? h : 180 - h; /* h может быть отрицательной */
      var ar = ang * Math.PI / 180;
      var sx = ox + Rs * Math.cos(ar), sy = gy - Rs * Math.sin(ar);
      if (h > 0) {
        /* луч к наблюдателю */
        ctx.strokeStyle = C.warn; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ox, gy); ctx.stroke();
        arrowHead(ox, gy, Math.atan2(gy - sy, ox - sx), C.warn, 9);
        /* дуга угла h */
        var ra = Math.min(46, Rs * 0.45);
        ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8;
        ctx.beginPath();
        if (south) ctx.arc(ox, gy, ra, -ar, 0); else ctx.arc(ox, gy, ra, Math.PI, Math.PI + (Math.PI - ar));
        ctx.stroke();
        var mid = south ? ar / 2 : Math.PI - (Math.PI - ar) / 2;
        var lab = 'h = ' + fmt(h, 1) + '°';
        ctx.font = '700 13px ' + mono;
        var lw = ctx.measureText(lab).width;
        var lx = ox + (ra + 8) * Math.cos(mid) + (south ? 0 : -lw), ly = gy - (ra + 8) * Math.sin(mid);
        if (h > 70) { lx = south ? ox + 8 : ox - lw - 8; ly = gy - ra - 14; }
        ctx.fillStyle = C.sheet; ctx.globalAlpha = 0.85; ctx.fillRect(lx - 3, ly - 10, lw + 6, 18); ctx.globalAlpha = 1;
        txt(lab, lx, ly, C.ink, 'left', 'middle');
        /* шест и тень */
        var pole = Math.min(26, Rs * 0.28), sh = pole / Math.tan(h * Math.PI / 180);
        ctx.strokeStyle = C.text; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox, gy - pole); ctx.stroke();
        if (h < 89.95) {
          var maxSh = bw / 2 - 14, dir = south ? -1 : 1;
          ctx.strokeStyle = C.muted; ctx.globalAlpha = 0.7; ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(ox, gy + 1); ctx.lineTo(ox + dir * Math.min(sh, maxSh), gy + 1); ctx.stroke();
          ctx.globalAlpha = 1;
        }
        drawSun(sx, sy, 9, C);
      } else {
        /* Солнце под горизонтом */
        ctx.save(); ctx.globalAlpha = 0.45;
        drawSun(ox + (south ? 1 : -1) * Rs * 0.8, gy + (h < 0 ? 13 : 0), 8, C);
        ctx.restore();
        ctx.strokeStyle = C.text; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(ox, gy); ctx.lineTo(ox, gy - Math.min(26, Rs * 0.28)); ctx.stroke();
        ctx.font = '600 12px ' + font;
        txt(h === 0 ? 'Солнце на горизонте' : 'Солнце под горизонтом', ox, gy - Rs * 0.55, C.muted, 'center', 'middle');
      }
      /* наблюдатель */
      ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(ox, gy, 4, 0, 7); ctx.fill();
    }
    function draw() {
      raf = 0;
      if (!st.W) return;
      var cs = getComputedStyle(document.documentElement);
      var C = {
        ink: col(cs, '--ink'), red: col(cs, '--red'), warn: col(cs, '--warn'), text: col(cs, '--text'), muted: col(cs, '--muted'),
        line: col(cs, '--grid-strong'), sheet: col(cs, '--sheet'), sheet2: col(cs, '--sheet-2')
      };
      var font = col(cs, '--f-body') || 'sans-serif', mono = col(cs, '--f-mono') || 'monospace';
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      ctx.clearRect(0, 0, st.W, st.H);
      ctx.font = '12px ' + font;
      var D = curDelta();
      if (st.W >= 560) {
        drawGlobe(0, 0, st.W / 2, st.H, C, D, font);
        ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(st.W / 2 + 0.5, 12); ctx.lineTo(st.W / 2 + 0.5, st.H - 12); ctx.stroke();
        ctx.font = '12px ' + font;
        drawSky(st.W / 2, 0, st.W / 2, st.H, C, D, font, mono);
      } else {
        var h1 = Math.round(st.H * 0.5);
        drawGlobe(0, 0, st.W, h1, C, D, font);
        ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(12, h1 + 0.5); ctx.lineTo(st.W - 12, h1 + 0.5); ctx.stroke();
        ctx.font = '12px ' + font;
        drawSky(0, h1, st.W, st.H - h1, C, D, font, mono);
      }
    }
    function schedule() { if (!raf && st.W) raf = requestAnimationFrame(draw); }

    /* ---------- (б) Время ---------- */
    function readLon(which) {
      var r = parseCoord(R('lon' + which).value, 180, 'lon');
      R('lon' + which + 'E').textContent = r.error ? 'Долгота: ' + r.error + '.' : '';
      return r;
    }
    function calcT() {
      var a = readLon('A'), b = readLon('B'), tv = R('timeA').value;
      var out = R('outT'), how = R('how');
      if (a.error || b.error) { out.innerHTML = ''; how.textContent = 'Исправьте долготу — тогда появится ответ.'; return; }
      var m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(tv || '');
      if (!m) { out.innerHTML = ''; how.textContent = 'Укажите время в пункте A (часы и минуты).'; return; }
      var tA = (+m[1]) * 3600 + (+m[2]) * 60 + (+(m[3] || 0));
      var dl = b.v - a.v;
      var dSec = dl * 240; /* 4 мин = 240 с на градус */
      var loc = clock(tA + dSec);
      var zAauto = R('zoneA').value === 'auto', zBauto = R('zoneB').value === 'auto';
      var zA = zAauto ? zoneByLon(a.v) : +R('zoneA').value;
      var zB = zBauto ? zoneByLon(b.v) : +R('zoneB').value;
      var dz = zB - zA, zt = clock(tA + dz * 3600);
      var dirTxt = Math.abs(dl) < 1e-9 ? 'на одном меридиане' : 'B ' + (dl > 0 ? 'восточнее' : 'западнее') + ' A на ' + fmt(Math.abs(dl)) + '°';
      out.innerHTML =
        '<div><b>' + fmt(Math.abs(dl)) + '°</b><span>разница долгот (' + esc(dirTxt.replace(/ на [\d,]+°$/, '')) + ')</span></div>' +
        '<div><b>' + (dSec === 0 ? '0 мин' : (dSec > 0 ? '+' : '−') + durText(dSec)) + '</b><span>разница местного времени</span></div>' +
        '<div><b>' + loc.t + '</b><span>местное время в B' + (loc.d ? ', ' + loc.d : '') + '</span></div>' +
        '<div><b>' + utcText(zA) + ' → ' + utcText(zB) + '</b><span>пояса A и B' + (zAauto || zBauto ? ' (по долготе: 15° = 1 ч)' : '') + '</span></div>' +
        '<div><b>' + (dz > 0 ? '+' : dz < 0 ? '−' : '') + Math.abs(dz) + ' ч</b><span>разница поясного времени</span></div>' +
        '<div><b>' + zt.t + '</b><span>поясное время в B' + (zt.d ? ', ' + zt.d : '') + '</span></div>';
      var hh = pad2(+m[1]) + ':' + m[2];
      how.innerHTML =
        '<p><b>Местное время.</b> ' + esc(dirTxt) + '. ' + (Math.abs(dl) < 1e-9 ? 'Местное время одинаково.' :
          'Разница: ' + fmt(Math.abs(dl)) + '° × 4 мин = ' + fmt(Math.abs(dl) * 4) + ' мин = ' + durText(dSec) + '. ' +
          (dl > 0 ? 'Восточнее — прибавляем' : 'Западнее — вычитаем') + ': ' + hh + ' ' + (dl > 0 ? '+' : '−') + ' ' + durText(dSec) + ' = <b>' + loc.t + '</b>' + (loc.d ? ' (' + loc.d + ')' : '') + '.') + '</p>' +
        '<p><b>Поясное время.</b> ' + (dz === 0 ? 'Пункты в одном часовом поясе — время одинаковое: <b>' + zt.t + '</b>.' :
          utcText(zB) + ' − (' + utcText(zA) + ') = ' + (dz > 0 ? '+' : '−') + Math.abs(dz) + ' ч, поэтому ' + hh + ' ' + (dz > 0 ? '+' : '−') + ' ' + Math.abs(dz) + ' ч = <b>' + zt.t + '</b>' + (zt.d ? ' (' + zt.d + ')' : '') + '.') + '</p>';
    }
    function bindPoint(w) {
      R('city' + w).addEventListener('change', function () {
        if (this.value === '') return;
        var c = CITIES[+this.value];
        R('lon' + w).value = fmt(c.lon).replace('−', '-');
        R('zone' + w).value = String(c.utc);
        calcT();
      });
      R('lon' + w).addEventListener('input', function () {
        var ci = R('city' + w).value;
        if (ci !== '') {
          var r = parseCoord(this.value, 180, 'lon');
          if (r.error || Math.abs(r.v - CITIES[+ci].lon) > 1e-9) { R('city' + w).value = ''; R('zone' + w).value = 'auto'; }
        }
        calcT();
      });
      R('zone' + w).addEventListener('change', calcT);
    }
    bindPoint('A'); bindPoint('B');
    R('timeA').addEventListener('input', calcT);
    R('timeA').addEventListener('change', calcT);

    /* ---------- Вкладки ---------- */
    el.querySelectorAll('[data-tab]').forEach(function (b) {
      b.addEventListener('click', function () {
        var tab = b.getAttribute('data-tab');
        el.querySelectorAll('[data-tab]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        el.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== tab; });
        if (tab === 'h') { st.W = 0; resize(); }
      });
    });

    /* ---------- Размер и тема ---------- */
    function resize() {
      var W = Math.round(wrap.clientWidth);
      if (!W) return;
      var H = W >= 560 ? Math.round(Math.max(280, Math.min(380, W * 0.42))) : Math.round(Math.max(420, Math.min(560, W * 1.35)));
      var dpr = window.devicePixelRatio || 1;
      if (W === st.W && H === st.H && dpr === st.dpr) return;
      st.W = W; st.H = H; st.dpr = dpr;
      cv.style.height = H + 'px';
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      draw();
    }
    var ro = new ResizeObserver(function () {
      if (!el.isConnected && st.W) { cleanup(); return; }
      resize();
    });
    ro.observe(wrap);
    function onTheme() { if (!el.isConnected) { cleanup(); return; } schedule(); }
    window.addEventListener('kl-theme', onTheme);
    function cleanup() {
      ro.disconnect();
      window.removeEventListener('kl-theme', onTheme);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    fixDays();
    setPhi(55.75, 'city');
    calcT();
  }

  KL.labs.sun = {
    title: 'Высота Солнца и время',
    icon: 'h☉',
    desc: 'Полуденная высота Солнца по широте и дате, полярный день, местное и поясное время',
    long: 'Выберите широту и дату — лаборатория посчитает полуденную высоту Солнца по формуле h = 90° − |φ − δ|, покажет схему и подскажет, где полярный день. Во второй вкладке — местное время по долготе (1° = 4 минуты) и поясное время.',
    subjectName: 'География',
    mount: mount,
    core: { declination: declination, sunAt: sunAt, dayOfYear: dayOfYear, zoneByLon: zoneByLon, clock: clock, durText: durText, parseCoord: parseCoord, fmt: fmt }
  };
})();
