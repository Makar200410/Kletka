/* Лаборатория «Системы счисления» — перевод целых чисел между системами 2–36 без потери точности (BigInt), разбор перевода и счётчики цифр для задач ЕГЭ. */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  KL.labs = KL.labs || {};

  var DIG = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var MAX_BITS = 100000;     /* предел размера результата (~30 000 десятичных цифр) */
  var MAX_ROWS = 64;         /* предел строк в таблице деления */
  var MAX_TERMS = 32;        /* предел слагаемых в развёрнутой записи */
  var NAMES = { 2: 'двоичная', 8: 'восьмеричная', 10: 'десятичная', 16: 'шестнадцатеричная' };
  var HAS_BIGINT = typeof BigInt === 'function';
  var B0 = HAS_BIGINT ? BigInt(0) : 0, B1 = HAS_BIGINT ? BigInt(1) : 1;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function digitRange(b) {
    if (b <= 10) return '0–' + (b - 1);
    if (b === 11) return '0–9 и A';
    return '0–9 и A–' + DIG.charAt(b - 1);
  }
  function sub(b) { return '<sub>' + b + '</sub>'; }
  var CYR = { 'А': 'A', 'В': 'B', 'С': 'C', 'Е': 'E', 'Н': 'H', 'К': 'K', 'М': 'M', 'О': 'O', 'Р': 'P', 'Т': 'T', 'Х': 'X', 'У': 'Y', 'З': '3' };

  /* ---------- Разбор числа ---------- */
  function clean(raw) {
    return String(raw == null ? '' : raw).replace(/[\s_'’]/g, '').replace(/[−–—]/g, '-').toUpperCase()
      .replace(/[АВСЕНКМОРТХУ]/g, function (c) { return CYR[c]; });
  }
  function parseInBase(s, b) {
    /* s — уже очищенная строка из цифр (без знака) */
    if (b === 10) return BigInt(s);
    if (b === 16) return BigInt('0x' + s);
    if (b === 8) return BigInt('0o' + s);
    if (b === 2) return BigInt('0b' + s);
    var B = BigInt(b), v = B0;
    for (var i = 0; i < s.length; i++) v = v * B + BigInt(DIG.indexOf(s.charAt(i)));
    return v;
  }
  function checkDigits(s, b) {
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i), d = DIG.indexOf(c);
      if (d < 0) return 'символ «' + c + '» — не цифра. В системе с основанием ' + b + ' допустимы цифры ' + digitRange(b);
      if (d >= b) return 'цифра «' + c + '»' + (d >= 10 ? ' (= ' + d + ')' : '') + ' не бывает в системе с основанием ' + b + ': допустимы только ' + digitRange(b);
    }
    return '';
  }
  /* возведение в степень без оператора ** (ES5-синтаксис): быстрое, через квадраты */
  function bpow(base, e) {
    var r = B1, B2 = BigInt(2);
    while (e > B0) {
      if (e % B2 === B1) r = r * base;
      e = e / B2;
      if (e > B0) base = base * base;
    }
    return r;
  }
  function bitLen(x) { if (x < B0) x = -x; return x === B0 ? 0 : x.toString(2).length; }

  /* Выражение в десятичной системе: + − * ^ (или **) и скобки */
  function evalExpr(src) {
    var toks = [], i = 0, s = src.replace(/[−–—]/g, '-');
    while (i < s.length) {
      var c = s.charAt(i);
      if (/\s/.test(c)) { i++; continue; }
      if (/\d/.test(c)) {
        var j = i;
        while (j < s.length && /\d/.test(s.charAt(j))) j++;
        toks.push(s.slice(i, j)); i = j; continue;
      }
      if (c === '*' && s.charAt(i + 1) === '*') { toks.push('**'); i += 2; continue; }
      if ('-+*×·^()/:'.indexOf(c) >= 0) { toks.push(c); i++; continue; }
      return { error: 'непонятный символ «' + c + '» в выражении' };
    }
    var p = 0;
    function peek() { return toks[p]; }
    function next() { return toks[p++]; }
    function fail(msg) { throw new Error(msg); }
    function checkSize(v) { if (bitLen(v) > MAX_BITS) fail('результат слишком большой (больше ' + MAX_BITS + ' двоичных разрядов)'); return v; }
    function primary() {
      var t = next();
      if (t == null) fail('выражение оборвалось — не хватает числа');
      if (t === '(') { var v = sum(); if (next() !== ')') fail('не хватает закрывающей скобки'); return v; }
      if (t === '-') return -power();
      if (t === '+') return power();
      if (/^\d+$/.test(t)) return BigInt(t);
      if (t === ')') fail('лишняя закрывающая скобка');
      fail('после «' + (toks[p - 2] || '') + '» ожидалось число, а стоит «' + t + '»');
    }
    function power() {
      var base = primary();
      if (peek() === '^' || peek() === '**') {
        next();
        var e = power();
        if (e < B0) fail('отрицательная степень даёт дробь — поддерживаются только целые числа');
        var bl = bitLen(base);
        if (bl > 1 && e > BigInt(MAX_BITS)) fail('степень слишком большая');
        if (bl > 1 && (bl - 1) * Number(e) > MAX_BITS) fail('результат слишком большой (больше ' + MAX_BITS + ' двоичных разрядов)');
        return checkSize(bpow(base, e));
      }
      return base;
    }
    function prod() {
      var v = power();
      while (peek() === '*' || peek() === '×' || peek() === '·' || peek() === '/' || peek() === ':') {
        var op = next();
        if (op === '/' || op === ':') fail('деление не поддерживается: результат должен быть целым');
        v = checkSize(v * power());
      }
      return v;
    }
    function sum() {
      var v = prod();
      while (peek() === '+' || peek() === '-') {
        var op = next(), r = prod();
        v = op === '+' ? v + r : v - r;
      }
      return v;
    }
    try {
      if (!toks.length) return { error: 'пустое поле' };
      var v = sum();
      if (p < toks.length) return { error: toks[p] === ')' ? 'лишняя закрывающая скобка' : 'непонятно, что делать с «' + toks[p] + '» — пропущен знак действия?' };
      return { v: v };
    } catch (e) { return { error: e.message }; }
  }

  function parseInput(raw, b) {
    var orig = String(raw == null ? '' : raw);
    if (!orig.trim()) return { error: 'Впишите число.' };
    if (/[₀-₉]/.test(orig)) return { error: 'Нижний индекс писать не нужно: основание выберите в списке «Из системы», а в поле оставьте только цифры.' };
    var s = clean(orig);
    if (/[.,]/.test(s) && /^-?[0-9A-Z]*[.,][0-9A-Z]*$/.test(s)) return { error: 'Дробные числа здесь не переводятся — только целые.' };
    var neg = false;
    if (s.charAt(0) === '-' && /^-[0-9A-Z]+$/.test(s)) { neg = true; s = s.slice(1); }
    else if (s.charAt(0) === '+' && /^\+[0-9A-Z]+$/.test(s)) s = s.slice(1);
    /* префиксы 0x / 0b / 0o */
    var pm = /^0([XBO])([0-9A-Z]+)$/.exec(s);
    if (pm && !(b > 11 && pm[1] === 'B') && !(b > 24 && pm[1] === 'O') && !(b > 33 && pm[1] === 'X')) {
      var pb = { X: 16, B: 2, O: 8 }[pm[1]];
      if (pb !== b) return { error: 'Префикс 0' + pm[1].toLowerCase() + ' означает систему с основанием ' + pb + ', а выбрано ' + b + '. Выберите основание ' + pb + ' или уберите префикс.' };
      s = pm[2];
    }
    if (/^[0-9A-Z]+$/.test(s)) {
      var err = checkDigits(s, b);
      if (err) return { error: err.charAt(0).toUpperCase() + err.slice(1) + '.' };
      if (s.length * Math.log(b) / Math.LN2 > MAX_BITS + 64) return { error: 'Слишком длинное число: не больше ' + MAX_BITS + ' двоичных разрядов.' };
      var v = parseInBase(s, b);
      return { v: neg ? -v : v, digits: s, neg: neg };
    }
    /* выражение */
    if (/[-+*×·^()\/:]/.test(s)) {
      if (b !== 10) return { error: 'Выражения (4^2020 + 2^17 − 15 и т. п.) можно вводить только в десятичной системе — выберите «Из системы: 10».' };
      if (/[A-Z]/.test(s)) return { error: 'В десятичном выражении могут быть только цифры, знаки + − * ^ и скобки.' };
      var r = evalExpr(s);
      if (r.error) return { error: 'Ошибка в выражении: ' + r.error + '.' };
      return { v: r.v, expr: true };
    }
    var bad = s.match(/[^0-9A-Z]/);
    return { error: 'Символ «' + (bad ? bad[0] : '?') + '» здесь не нужен: вводите цифры ' + digitRange(b) + '.' };
  }

  /* ---------- Счётчики ---------- */
  function countChar(str, ch) { var n = 0; for (var i = 0; i < str.length; i++) if (str.charAt(i) === ch) n++; return n; }
  function digitSum(str) { var s = 0; for (var i = 0; i < str.length; i++) s += DIG.indexOf(str.charAt(i)); return s; }
  function isPow2(b) { return (b & (b - 1)) === 0; }
  function log2i(b) { var k = 0; while ((1 << k) < b) k++; return k; }

  /* ---------- Стили ---------- */
  var CSS = [
    '.lb-ns-in{display:grid;grid-template-columns:minmax(0,2.2fr) minmax(0,1fr) auto minmax(0,1fr);gap:10px;align-items:end}',
    '.lb-ns-in input,.lb-ns-in select{width:100%}',
    '.lb-ns-swap{align-self:end;height:40px}',
    '@media (max-width:620px){.lb-ns-in{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)}.lb-ns-in .lb-ns-num{grid-column:1/-1}}',
    '.lb-ns-ex{display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
    '.lb-ns-ex span{font-size:13px;color:var(--muted);margin-right:2px}',
    '.lb-ns-err{font-size:14.5px;line-height:1.5;color:var(--red);background:var(--red-soft);border-radius:10px;padding:10px 12px}',
    '.lb-ns-err:empty{display:none}',
    '.lb-ns-main{border:1.5px solid color-mix(in srgb,var(--ink) 40%,var(--line));background:var(--ink-soft);border-radius:12px;padding:12px 14px;min-width:0}',
    '.lb-ns-main small{display:block;font-size:12.5px;color:var(--muted);margin-bottom:4px}',
    '.lb-ns-val{font:700 20px/1.35 var(--f-mono);color:var(--ink);overflow-wrap:anywhere;word-break:break-all;max-height:10.5em;overflow-y:auto}',
    '.lb-ns-val sub{font-size:.6em;color:var(--muted);font-weight:600}',
    '.lb-ns-all{display:flex;flex-direction:column;border:1px solid var(--line);border-radius:10px;overflow:hidden}',
    '.lb-ns-all div{display:grid;grid-template-columns:7.5em minmax(0,1fr);gap:10px;padding:8px 12px;border-bottom:1px solid var(--line);align-items:baseline}',
    '.lb-ns-all div:last-child{border-bottom:0}',
    '.lb-ns-all div.hl{background:color-mix(in srgb,var(--ink) 5%,transparent)}',
    '.lb-ns-all span{font-size:13px;color:var(--muted)}',
    '.lb-ns-all code{font:600 15px/1.4 var(--f-mono);color:var(--text);overflow-wrap:anywhere;word-break:break-all;max-height:6em;overflow-y:auto;display:block}',
    '@media (max-width:420px){.lb-ns-all div{grid-template-columns:1fr;gap:2px}}',
    '.lb-ns-cnt{display:flex;flex-wrap:wrap;gap:10px;align-items:end}',
    '.lb-ns-cnt input{width:4.5em;text-align:center;text-transform:uppercase}',
    '.lb-ns-cnt output{font:600 15px var(--f-mono);color:var(--text);padding-bottom:9px}',
    '.lb-ns-steps{border:1px solid var(--line);border-radius:12px;padding:0;background:var(--sheet)}',
    '.lb-ns-steps>summary{cursor:pointer;padding:10px 14px;font-weight:600;color:var(--ink);list-style-position:inside}',
    '.lb-ns-steps>summary:focus-visible{outline:2px solid var(--ink);outline-offset:2px;border-radius:10px}',
    '.lb-ns-sbody{padding:0 14px 14px;display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.lb-ns-sbody h4{margin:4px 0 0;font-size:14.5px;color:var(--text)}',
    '.lb-ns-sbody p{margin:0;font-size:14.5px;line-height:1.6;overflow-wrap:anywhere}',
    '.lb-ns-exp{font-family:var(--f-mono);font-size:14.5px;line-height:1.9;overflow-wrap:anywhere}',
    '.lb-ns-exp sup{font-size:.72em}',
    '.lb-ns-tbl td,.lb-ns-tbl th{font-family:var(--f-mono);font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.lb-ns-tbl th{font-family:var(--f-body)}',
    '.lb-ns-tbl td.r{color:var(--red);font-weight:700}',
    '.lb-ns-tbl tbody tr:last-child td.r{background:var(--red-soft)}',
    '.lb-ns-grp{display:flex;flex-wrap:wrap;gap:6px;font-family:var(--f-mono)}',
    '.lb-ns-grp span{display:inline-flex;flex-direction:column;align-items:center;border:1px solid var(--line);border-radius:8px;padding:4px 8px;background:var(--sheet-2);min-width:2.4em}',
    '.lb-ns-grp b{color:var(--ink);font-size:15px}',
    '.lb-ns-grp i{font-style:normal;font-size:13px;color:var(--text)}',
    '.lb-ns-note p{margin:0 0 6px}',
    '.lb-ns-note p:last-child{margin:0}'
  ].join('\n');
  function injectCSS() {
    if (document.getElementById('lab-numsys-css')) return;
    var st = document.createElement('style');
    st.id = 'lab-numsys-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ---------- Разбор перевода ---------- */
  function expandedHtml(digits, b, value) {
    var n = digits.length;
    if (n > MAX_TERMS) return '<p class="muted">Развёрнутая запись показывается для чисел до ' + MAX_TERMS + ' цифр.</p>';
    var terms = [], vals = [], hasLetters = false;
    for (var i = 0; i < n; i++) {
      var d = DIG.indexOf(digits.charAt(i)), k = n - 1 - i;
      if (d >= 10) hasLetters = true;
      terms.push(d + '·' + b + '<sup>' + k + '</sup>');
      if (d) vals.push((BigInt(d) * bpow(BigInt(b), BigInt(k))).toString());
    }
    var legend = '';
    if (hasLetters) {
      var used = {};
      digits.split('').forEach(function (c) { var d = DIG.indexOf(c); if (d >= 10) used[c] = d; });
      legend = '<p class="muted">Буквы — это цифры больше 9: ' + Object.keys(used).sort().map(function (c) { return c + ' = ' + used[c]; }).join(', ') + '.</p>';
    }
    return legend + '<p class="lb-ns-exp">' + esc(digits) + sub(b) + ' = ' + terms.join(' + ') +
      (vals.length > 1 ? ' = ' + vals.join(' + ') : '') + ' = <b>' + value.toString() + '</b>' + sub(10) + '</p>';
  }
  function divisionHtml(value, q) {
    var a = value < B0 ? -value : value;
    if (a === B0) return '<p>0 в любой системе счисления записывается как 0.</p>';
    var Q = BigInt(q), rows = [], n = a;
    while (n > B0 && rows.length <= MAX_ROWS) {
      var qq = n / Q, r = n % Q;
      rows.push([n, qq, Number(r)]);
      n = qq;
    }
    if (rows.length > MAX_ROWS) return '<p class="muted">Таблица деления показывается, если шагов не больше ' + MAX_ROWS + ' (здесь их ' + a.toString(q).length + '). Для больших чисел удобнее разложить на степени основания.</p>';
    var digs = rows.map(function (r) { return DIG.charAt(r[2]); });
    var h = '<div class="tbl-wrap"><table class="tbl lb-ns-tbl"><thead><tr><th>Делимое</th><th>: ' + q + ' = частное</th><th>Остаток</th>' + (q > 10 ? '<th>Цифра</th>' : '') + '</tr></thead><tbody>';
    rows.forEach(function (r) {
      h += '<tr><td>' + r[0].toString() + '</td><td>' + r[1].toString() + '</td><td class="r">' + r[2] + '</td>' + (q > 10 ? '<td class="r">' + DIG.charAt(r[2]) + '</td>' : '') + '</tr>';
    });
    h += '</tbody></table></div>';
    h += '<p>Делим, пока частное не станет 0. Остатки читаем <b>снизу вверх</b>: ' + digs.slice().reverse().join(' ') + ' → <b>' + a.toString(q).toUpperCase() + '</b>' + sub(q) + '.</p>';
    return h;
  }
  function groupsHtml(digits, from, to) {
    /* быстрый перевод между основаниями 2, 4, 8, 16, 32 через двоичную запись */
    var kf = log2i(from), kt = log2i(to);
    if (digits.length > 40) return '';
    var h = '', bin = '';
    if (from !== 2) {
      h += '<p>Каждую цифру записываем ' + kf + ' двоичными разрядами (' + from + ' = 2<sup>' + kf + '</sup>):</p><div class="lb-ns-grp">';
      digits.split('').forEach(function (c) {
        var g = DIG.indexOf(c).toString(2);
        while (g.length < kf) g = '0' + g;
        bin += g;
        h += '<span><b>' + esc(c) + '</b><i>' + g + '</i></span>';
      });
      h += '</div>';
      bin = bin.replace(/^0+(?=.)/, '');
      h += '<p>Двоичная запись: <b class="mono">' + bin + '</b>' + sub(2) + '.</p>';
    } else bin = digits.replace(/^0+(?=.)/, '');
    if (to !== 2) {
      var pad = bin;
      while (pad.length % kt) pad = '0' + pad;
      h += '<p>Разбиваем двоичную запись <b>справа налево</b> на группы по ' + kt + ' (' + to + ' = 2<sup>' + kt + '</sup>)' + (pad.length > bin.length ? ', слева дописываем нули' : '') + ':</p><div class="lb-ns-grp">';
      var out = '';
      for (var i = 0; i < pad.length; i += kt) {
        var g2 = pad.substr(i, kt), d = DIG.charAt(parseInt(g2, 2));
        out += d;
        h += '<span><i>' + g2 + '</i><b>' + d + '</b></span>';
      }
      h += '</div><p>Ответ: <b class="mono">' + out + '</b>' + sub(to) + '.</p>';
    }
    return h;
  }

  /* ---------- Монтирование ---------- */
  function mount(el) {
    injectCSS();
    if (!HAS_BIGINT) {
      el.innerHTML = '<p class="lab-note">Этому браузеру не хватает поддержки больших целых чисел (BigInt). Обновите браузер, чтобы пользоваться лабораторией.</p>';
      return;
    }
    var opts = '';
    for (var b = 2; b <= 36; b++) opts += '<option value="' + b + '">' + b + (NAMES[b] ? ' — ' + NAMES[b] : '') + '</option>';
    el.innerHTML =
      '<div class="lb-ns-in">' +
        '<label class="lb-ns-num">Число или выражение<input type="text" data-r="num" value="45" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="например 45, 1011, FF или 4^20 + 2^5"></label>' +
        '<label>Из системы<select data-r="from">' + opts + '</select></label>' +
        '<button type="button" class="btn sm lb-ns-swap" data-r="swap" aria-label="Поменять системы местами" title="Поменять местами">⇄</button>' +
        '<label>В систему<select data-r="to">' + opts + '</select></label>' +
      '</div>' +
      '<div class="lb-ns-ex"><span>Примеры:</span>' +
        '<button type="button" class="chip" data-ex="45|10|2">45₁₀ → 2</button>' +
        '<button type="button" class="chip" data-ex="101101|2|10">101101₂ → 10</button>' +
        '<button type="button" class="chip" data-ex="2FA|16|8">2FA₁₆ → 8</button>' +
        '<button type="button" class="chip" data-ex="255|10|16">255₁₀ → 16</button>' +
        '<button type="button" class="chip" data-ex="4^2020 + 2^2017 - 15|10|2">4²⁰²⁰ + 2²⁰¹⁷ − 15 → 2</button>' +
        '<button type="button" class="chip" data-ex="3*729^5 + 2*81^7 - 27|10|9">3·729⁵ + 2·81⁷ − 27 → 9</button>' +
      '</div>' +
      '<div class="lb-ns-err" data-r="err" role="alert"></div>' +
      '<div data-r="res">' +
        '<div class="lb-ns-main"><small data-r="mainCap"></small><div class="lb-ns-val" data-r="main" aria-live="polite"></div></div>' +
      '</div>' +
      '<div class="lb-ns-all" data-r="all" aria-label="Число в разных системах"></div>' +
      '<div class="readout" data-r="cnt"></div>' +
      '<div class="lb-ns-cnt">' +
        '<label>Сколько раз встречается цифра<input type="text" maxlength="1" value="0" data-r="dig" autocomplete="off" spellcheck="false"></label>' +
        '<output data-r="digOut" aria-live="polite"></output>' +
      '</div>' +
      '<details class="lb-ns-steps" data-r="stepsBox" open><summary>Как переводить: разбор по шагам</summary><div class="lb-ns-sbody" data-r="steps"></div></details>' +
      '<div class="lab-note lb-ns-note">' +
        '<p><b>В десятичную:</b> $a_{n}a_{n-1}\\dots a_1a_0 = a_n\\cdot q^n + \\dots + a_1\\cdot q + a_0$. <b>Из десятичной:</b> делим на $q$ с остатком, пока частное не станет 0, остатки читаем снизу вверх. Между системами 2, 4, 8, 16, 32 удобно переводить группами двоичных разрядов (триады для 8, тетрады для 16).</p>' +
        '<p>Для задач ЕГЭ № 14 в десятичной системе можно ввести выражение со степенями: <span class="mono">4^2020 + 2^2017 − 15</span>. Помните: $2^n$ в двоичной записи — единица и $n$ нулей, а $2^n - 1$ — это $n$ единиц.</p>' +
      '</div>';

    function R(n) { return el.querySelector('[data-r="' + n + '"]'); }
    var inN = R('num'), inF = R('from'), inT = R('to'), inD = R('dig');
    inF.value = '10'; inT.value = '2';
    var cur = null;

    function showError(msg) {
      R('err').textContent = msg;
      R('res').hidden = true; R('all').hidden = true; R('cnt').hidden = true;
      el.querySelector('.lb-ns-cnt').hidden = true; R('stepsBox').hidden = true;
      cur = null;
    }
    function calc() {
      var from = +inF.value, to = +inT.value;
      var p = parseInput(inN.value, from);
      if (p.error) { showError(p.error); return; }
      R('err').textContent = '';
      R('res').hidden = false; R('all').hidden = false; R('cnt').hidden = false;
      el.querySelector('.lb-ns-cnt').hidden = false; R('stepsBox').hidden = false;
      var v = p.v, neg = v < B0, a = neg ? -v : v, sign = neg ? '−' : '';
      var outStr = a.toString(to).toUpperCase();
      cur = { v: v, a: a, to: to, from: from, out: outStr };
      var srcTxt = p.expr ? 'Значение выражения' : esc(sign + p.digits) + sub(from);
      R('mainCap').innerHTML = (p.expr ? 'Значение выражения ' : 'Число ') + 'в системе с основанием ' + to + (NAMES[to] ? ' (' + NAMES[to] + ')' : '');
      R('main').innerHTML = (p.expr ? '' : srcTxt + ' = ') + sign + outStr + sub(to);

      /* в разных системах */
      var bases = [2, 8, 10, 16];
      if (bases.indexOf(from) < 0) bases.push(from);
      if (bases.indexOf(to) < 0) bases.push(to);
      bases.sort(function (x, y) { return x - y; });
      R('all').innerHTML = bases.map(function (q) {
        return '<div' + (q === to ? ' class="hl"' : '') + '><span>' + (NAMES[q] ? NAMES[q].charAt(0).toUpperCase() + NAMES[q].slice(1) : 'Основание ' + q) + ' (' + q + ')</span><code>' + sign + a.toString(q).toUpperCase() + '</code></div>';
      }).join('');

      /* счётчики */
      var bin = a.toString(2);
      var ones = countChar(bin, '1');
      R('cnt').innerHTML =
        '<div><b>' + ones + '</b><span>единиц в двоичной записи</span></div>' +
        '<div><b>' + (bin.length - ones) + '</b><span>нулей в двоичной записи</span></div>' +
        '<div><b>' + bin.length + '</b><span>цифр в двоичной записи</span></div>' +
        (to !== 2 ? '<div><b>' + outStr.length + '</b><span>цифр в записи по основанию ' + to + '</span></div>' : '') +
        '<div><b>' + digitSum(outStr) + '</b><span>сумма цифр в записи по основанию ' + to + ' (в десятичной)</span></div>' +
        (to !== 10 ? '<div><b>' + a.toString(10).length + '</b><span>цифр в десятичной записи</span></div>' : '') +
        (neg ? '<div><b>модуль</b><span>у отрицательного числа считаем цифры без знака «−»</span></div>' : '');
      countDigit();

      /* шаги */
      var h = '';
      if (from === to) {
        h = '<p>Основания совпадают — переводить нечего. Выберите другую систему в списке «В систему».</p>';
      } else {
        var dec = a;
        if (p.expr) {
          h += '<p>Сначала вычисляем выражение точно (без округления): получаем число из ' + a.toString(10).length + ' десятичных цифр.</p>';
          if (to === 2 || isPow2(to)) h += '<p>Подсказка для ЕГЭ: $2^n$ в двоичной записи — это 1 и $n$ нулей; сумма различных степеней двойки даёт столько единиц, сколько слагаемых; $2^n - 2^m$ при $n > m$ — это $n - m$ единиц и затем $m$ нулей.</p>';
        } else if (from !== 10) {
          h += '<h4>Шаг 1. Из системы с основанием ' + from + ' в десятичную</h4>' + expandedHtml(p.digits, from, dec);
        }
        if (to !== 10) {
          h += '<h4>' + (from !== 10 && !p.expr ? 'Шаг 2. ' : '') + 'Из десятичной в систему с основанием ' + to + ' — деление с остатком</h4>' + divisionHtml(dec, to);
        }
        if (!p.expr && from !== 10 && to !== 10 && isPow2(from) && isPow2(to)) {
          var g = groupsHtml(p.digits, from, to);
          if (g) h += '<h4>Быстрый способ: через двоичную запись</h4>' + g;
        }
        if (neg) h += '<p class="muted">Знак «−» просто переносится в ответ: переводится модуль числа.</p>';
      }
      R('steps').innerHTML = h;
      if (KL.app && KL.app.renderMath) KL.app.renderMath(R('steps'));
    }
    function countDigit() {
      if (!cur) return;
      var c = clean(inD.value).charAt(0), out = R('digOut');
      if (!c) { out.textContent = 'впишите цифру'; return; }
      var d = DIG.indexOf(c);
      if (d < 0 || d >= cur.to) { out.textContent = 'в системе с основанием ' + cur.to + ' нет цифры «' + c + '» (есть ' + digitRange(cur.to) + ')'; return; }
      var n = countChar(cur.out, c);
      out.textContent = '→ ' + n + ' раз(а) в записи по основанию ' + cur.to;
    }

    inN.addEventListener('input', calc);
    inF.addEventListener('change', calc);
    inT.addEventListener('change', calc);
    inD.addEventListener('input', countDigit);
    R('swap').addEventListener('click', function () {
      var f = inF.value, t = inT.value;
      /* подставляем результат, чтобы после обмена число осталось тем же */
      if (cur) inN.value = (cur.v < B0 ? '-' : '') + cur.out;
      inF.value = t; inT.value = f;
      calc();
    });
    el.querySelectorAll('[data-ex]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.getAttribute('data-ex').split('|');
        inN.value = p[0]; inF.value = p[1]; inT.value = p[2];
        calc();
      });
    });
    calc();
  }

  KL.labs.numsys = {
    title: 'Системы счисления',
    icon: '1010',
    desc: 'Перевод чисел между системами 2–36 с разбором, счётчики единиц и цифр для ЕГЭ',
    long: 'Переводите целые числа любой длины между системами счисления с основаниями от 2 до 36. Лаборатория покажет развёрнутую запись, таблицу деления с остатком, быстрый перевод через двоичную запись и посчитает единицы, нули и нужные цифры — как в задании 14 ЕГЭ.',
    subjectName: 'Информатика',
    mount: mount,
    core: { parseInput: parseInput, evalExpr: evalExpr, countChar: countChar, digitSum: digitSum }
  };
})();
