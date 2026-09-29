/* Лаборатория «Таблицы истинности» — ввод логического выражения (¬ ∧ ∨ → ≡ ⊕ и ASCII-аналоги), собственный парсер, таблица и фильтр строк F = 0 / F = 1. */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  KL.labs = KL.labs || {};

  var MAX_VARS = 8;

  /* ================= Лексер =================
     Операции в порядке проверки: длинные обозначения раньше коротких («<->» раньше «<=», «!=» раньше «!»). */
  var SYMBOLS = [
    ['<->', 'eq'], ['<=>', 'eq'], ['&&', 'and'], ['||', 'or'], ['->', 'imp'], ['=>', 'imp'], ['<=', 'imp'],
    ['==', 'eq'], ['!=', 'xor'], ['/\\', 'and'], ['\\/', 'or'],
    ['¬', 'not'], ['!', 'not'], ['-', 'not'], ['~', 'not'],
    ['∧', 'and'], ['&', 'and'], ['*', 'and'], ['·', 'and'], ['⋅', 'and'],
    ['∨', 'or'], ['|', 'or'], ['+', 'or'],
    ['→', 'imp'], ['⇒', 'imp'],
    ['≡', 'eq'], ['↔', 'eq'], ['⇔', 'eq'], ['=', 'eq'],
    ['⊕', 'xor'], ['^', 'xor'], ['≠', 'xor'],
    ['(', 'lp'], [')', 'rp']
  ];
  var WORDS = { not: 'not', and: 'and', or: 'or', xor: 'xor', 'true': 'one', 'false': 'zero' };
  var SIGN = { not: '¬', and: '∧', or: '∨', imp: '→', eq: '≡', xor: '⊕' };
  var OPNAME = { not: 'отрицание', and: 'конъюнкция', or: 'дизъюнкция', imp: 'импликация', eq: 'эквивалентность', xor: 'исключающее ИЛИ' };

  function LogicError(msg, pos, len) { this.message = msg; this.pos = pos; this.len = len || 1; }

  function tokenize(s) {
    var out = [], i = 0;
    while (i < s.length) {
      var c = s.charAt(i);
      if (/\s/.test(c)) { i++; continue; }
      var m = /^[A-Za-z][A-Za-z0-9_]*/.exec(s.slice(i));
      if (m) {
        var w = m[0], lw = w.toLowerCase();
        if (WORDS.hasOwnProperty(lw)) {
          var k = WORDS[lw];
          if (k === 'one' || k === 'zero') out.push({ t: 'const', v: k === 'one' ? 1 : 0, pos: i, len: w.length, src: w });
          else out.push({ t: k, pos: i, len: w.length, src: w });
        } else out.push({ t: 'var', name: w, pos: i, len: w.length, src: w });
        i += w.length;
        continue;
      }
      if (c === '0' || c === '1') {
        if (/[0-9]/.test(s.charAt(i + 1))) throw new LogicError('Константа может быть только 0 или 1', i, 2);
        out.push({ t: 'const', v: +c, pos: i, len: 1, src: c });
        i++;
        continue;
      }
      if (/[2-9]/.test(c)) throw new LogicError('Константа может быть только 0 или 1', i, 1);
      var found = null;
      for (var j = 0; j < SYMBOLS.length; j++) {
        if (s.substr(i, SYMBOLS[j][0].length) === SYMBOLS[j][0]) { found = SYMBOLS[j]; break; }
      }
      if (!found) throw new LogicError('Непонятный символ «' + c + '»', i, 1);
      out.push({ t: found[1], pos: i, len: found[0].length, src: found[0] });
      i += found[0].length;
    }
    out.push({ t: 'end', pos: s.length, len: 1, src: '' });
    return out;
  }

  /* ================= Парсер (рекурсивный спуск) =================
     Приоритет, как в ЕГЭ: ¬, затем ∧, затем ∨, затем →, затем ≡ и ⊕ (один уровень).
     Операции одного уровня выполняются слева направо: a → b → c = (a → b) → c. */
  function parse(src) {
    var toks = tokenize(src), p = 0;
    function peek() { return toks[p]; }
    function describe(t) {
      if (t.t === 'end') return 'конец выражения';
      if (t.t === 'rp') return 'закрывающая скобка';
      if (t.t === 'lp') return 'открывающая скобка';
      if (SIGN[t.t]) return 'знак «' + t.src + '» (' + OPNAME[t.t] + ')';
      return '«' + t.src + '»';
    }
    function level(ops, next) {
      return function () {
        var a = next();
        while (ops.indexOf(peek().t) >= 0) {
          var op = toks[p++];
          var b = next();
          a = { t: 'bin', op: op.t, a: a, b: b };
        }
        return a;
      };
    }
    function unary() {
      var t = peek();
      if (t.t === 'not') { p++; return { t: 'not', a: unary() }; }
      return primary();
    }
    function primary() {
      var t = peek();
      if (t.t === 'var') { p++; return { t: 'var', name: t.name }; }
      if (t.t === 'const') { p++; return { t: 'const', v: t.v }; }
      if (t.t === 'lp') {
        p++;
        if (peek().t === 'rp') throw new LogicError('Пустые скобки', peek().pos, 1);
        var e = top();
        if (peek().t !== 'rp') {
          var q = peek();
          if (q.t === 'end') throw new LogicError('Не хватает закрывающей скобки «)» для скобки на позиции ' + (t.pos + 1), t.pos, 1);
          throw new LogicError('Ожидалась «)» или знак операции, а встретилось ' + describe(q), q.pos, q.len);
        }
        p++;
        return e;
      }
      if (t.t === 'end') throw new LogicError('Выражение обрывается: после знака операции нужен операнд', t.pos, 1);
      if (t.t === 'rp') throw new LogicError('Лишняя закрывающая скобка или пропущен операнд', t.pos, 1);
      throw new LogicError('Здесь нужна переменная, 0/1 или «(», а встретился ' + describe(t), t.pos, t.len);
    }
    var andL = level(['and'], unary);
    var orL = level(['or'], andL);
    var impL = level(['imp'], orL);
    var top = level(['eq', 'xor'], impL);
    if (toks.length === 1) throw new LogicError('Введите выражение', 0, 1);
    var tree = top();
    var rest = peek();
    if (rest.t !== 'end') {
      if (rest.t === 'rp') throw new LogicError('Лишняя закрывающая скобка', rest.pos, 1);
      throw new LogicError('Пропущен знак операции перед ' + describe(rest), rest.pos, rest.len);
    }
    return tree;
  }

  /* ================= Вычисление и печать ================= */
  function evalNode(n, env) {
    switch (n.t) {
      case 'var': return env[n.name];
      case 'const': return n.v;
      case 'not': return evalNode(n.a, env) ? 0 : 1;
      default:
        var a = evalNode(n.a, env), b = evalNode(n.b, env);
        switch (n.op) {
          case 'and': return a & b;
          case 'or': return a | b;
          case 'imp': return (!a || b) ? 1 : 0;
          case 'eq': return a === b ? 1 : 0;
          case 'xor': return a !== b ? 1 : 0;
        }
    }
    return 0;
  }
  /* Печать со всеми скобками вокруг вложенных двуместных операций — видно, в каком порядке считает компьютер. */
  function show(n, inner) {
    if (n.t === 'var') return n.name;
    if (n.t === 'const') return String(n.v);
    if (n.t === 'not') return '¬' + show(n.a, true);
    var s = show(n.a, true) + ' ' + SIGN[n.op] + ' ' + show(n.b, true);
    return inner ? '(' + s + ')' : s;
  }
  function collectVars(n, acc) {
    if (n.t === 'var') { if (acc.indexOf(n.name) < 0) acc.push(n.name); }
    else if (n.t === 'not') collectVars(n.a, acc);
    else if (n.t === 'bin') { collectVars(n.a, acc); collectVars(n.b, acc); }
    return acc;
  }
  /* Порядок столбцов: x, y, z, w — как в заданиях ЕГЭ, остальные по алфавиту. */
  function varRank(v) { var i = ['x', 'y', 'z', 'w'].indexOf(v); return i < 0 ? 4 : i; }
  function sortVars(list) {
    return list.slice().sort(function (a, b) {
      var ra = varRank(a), rb = varRank(b);
      if (ra !== rb) return ra - rb;
      var la = a.toLowerCase(), lb = b.toLowerCase();
      if (la !== lb) return la < lb ? -1 : 1;
      return a < b ? -1 : a > b ? 1 : 0;
    });
  }
  /* Промежуточные подвыражения (без переменных и самого F) в порядке вычисления. */
  function subexprs(n, acc, seen) {
    if (n.t === 'var' || n.t === 'const') return acc;
    if (n.t === 'not') subexprs(n.a, acc, seen);
    else { subexprs(n.a, acc, seen); subexprs(n.b, acc, seen); }
    var s = show(n, false);
    if (!seen[s]) { seen[s] = 1; acc.push({ node: n, text: s }); }
    return acc;
  }

  function build(src) {
    var tree = parse(src);
    var vars = sortVars(collectVars(tree, []));
    if (vars.length > MAX_VARS) throw new LogicError('Слишком много переменных: ' + vars.length + ' (не больше ' + MAX_VARS + ')', 0, src.length);
    var subs = subexprs(tree, [], {});
    subs.pop(); /* последнее — само выражение F */
    var rows = [], n = vars.length, total = Math.pow(2, n);
    for (var m = 0; m < total; m++) {
      var env = {}, bits = [];
      for (var k = 0; k < n; k++) {
        var bit = (m >> (n - 1 - k)) & 1;
        env[vars[k]] = bit;
        bits.push(bit);
      }
      rows.push({ bits: bits, mid: subs.map(function (s) { return evalNode(s.node, env); }), f: evalNode(tree, env) });
    }
    return { tree: tree, vars: vars, subs: subs, rows: rows, text: show(tree, false) };
  }

  /* ================= Утилиты ================= */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  var EXAMPLES = [
    { label: 'ЕГЭ, задание 2', expr: '((x → y) ∧ (y → w)) ∨ (z ≡ (x ∨ y))', note: 'Типичная функция задания 2 ЕГЭ от четырёх переменных x, y, z, w.' },
    { label: 'ЕГЭ: ¬ и ≡', expr: '(x ∧ ¬y) ∨ (y ≡ z) ∨ ¬w', note: 'Отрицание относится только к ближайшей переменной; ≡ в скобках считается раньше ∨.' },
    { label: 'Приоритет', expr: '¬x ∨ y ∧ z', note: 'Без скобок сначала ¬, потом ∧, потом ∨: ¬x ∨ (y ∧ z).' },
    { label: 'Импликация', expr: 'x → y', note: 'Импликация ложна только в строке x = 1, y = 0.' }
  ];
  var INSERTS = [
    ['¬', 'Вставить отрицание ¬'], ['∧', 'Вставить конъюнкцию ∧ (И)'], ['∨', 'Вставить дизъюнкцию ∨ (ИЛИ)'],
    ['→', 'Вставить импликацию →'], ['≡', 'Вставить эквивалентность ≡'], ['⊕', 'Вставить исключающее ИЛИ ⊕'],
    ['(', 'Вставить открывающую скобку'], [')', 'Вставить закрывающую скобку'],
    ['x', 'Вставить переменную x'], ['y', 'Вставить переменную y'], ['z', 'Вставить переменную z'], ['w', 'Вставить переменную w']
  ];

  /* ================= Стили ================= */
  var CSS = [
    '.lb-tt{display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.lb-tt-in{width:100%;font-size:17px !important;padding:10px 12px !important}',
    '.lb-tt-in.bad{border-color:var(--red) !important}',
    '.lb-tt-keys{display:flex;flex-wrap:wrap;gap:6px}',
    '.lb-tt-keys button{min-width:40px;min-height:40px;border:1px solid var(--line);border-radius:8px;background:var(--sheet-2);color:var(--text);',
    'font:600 17px var(--f-mono);cursor:pointer;padding:0 8px;touch-action:manipulation}',
    '.lb-tt-keys button:hover{border-color:var(--ink);color:var(--ink)}',
    '.lb-tt-keys button:focus-visible,.lb-tt .seg button:focus-visible{outline:2px solid var(--ink);outline-offset:2px}',
    '.lb-tt-keys .op{color:var(--ink)}',
    '.lb-tt-keys .sep{width:1px;background:var(--line);margin:4px 2px}',
    '.lb-tt-ex{display:flex;flex-wrap:wrap;gap:6px;align-items:center}',
    '.lb-tt-ex .muted{font-size:13.5px}',
    '.lb-tt-msg{font-size:14.5px;line-height:1.5;min-height:1.5em}',
    '.lb-tt-msg.err{color:var(--red)}',
    '.lb-tt-msg .lb-tt-parsed{font-family:var(--f-mono);color:var(--text);overflow-wrap:anywhere}',
    '.lb-tt-caret{font:15px var(--f-mono);white-space:pre-wrap;word-break:break-all;background:var(--red-soft);border-radius:8px;padding:6px 10px;margin-top:4px;color:var(--text)}',
    '.lb-tt-caret mark{background:var(--red);color:var(--sheet);border-radius:3px;padding:0 1px}',
    '.lb-tt-bar{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}',
    '.lb-tt-bar .grow{flex:1}',
    '.lb-tt .seg button{cursor:pointer}',
    '.lb-tt-count{font-size:14px;color:var(--muted)}',
    '.lb-tt-count b{color:var(--text);font-family:var(--f-mono)}',
    '.lb-tt-wrap{overflow-x:auto;max-width:100%;border:1px solid var(--line);border-radius:10px;max-height:560px;overflow-y:auto}',
    '.lb-tt-tbl{border-collapse:collapse;width:auto;min-width:100%;font-family:var(--f-mono);font-variant-numeric:tabular-nums;font-size:15px;background:var(--sheet)}',
    '.lb-tt-tbl th,.lb-tt-tbl td{border-bottom:1px solid var(--line);border-right:1px solid var(--line);padding:5px 10px;text-align:center;white-space:nowrap}',
    '.lb-tt-tbl th{background:var(--sheet-2);font-weight:700;position:sticky;top:0;z-index:1}',
    '.lb-tt-tbl tr>:last-child{border-right:0}',
    '.lb-tt-tbl td.n,.lb-tt-tbl th.n{color:var(--muted);font-size:12.5px}',
    '.lb-tt-tbl th.mid{font-weight:500;color:var(--muted);font-size:13px}',
    '.lb-tt-tbl td.mid{color:var(--muted)}',
    '.lb-tt-tbl th.f{color:var(--ink)}',
    '.lb-tt-tbl td.f{font-weight:700;border-left:2px solid var(--grid-strong)}',
    '.lb-tt-tbl th.f{border-left:2px solid var(--grid-strong)}',
    '.lb-tt-tbl td.f1{color:var(--ok);background:var(--ok-soft)}',
    '.lb-tt-tbl td.f0{color:var(--red)}',
    '.lb-tt-tbl tbody tr:hover td{background:color-mix(in srgb,var(--ink) 5%,transparent)}',
    '.lb-tt-tbl tbody tr:hover td.f1{background:var(--ok-soft)}',
    '.lb-tt-empty{padding:18px;text-align:center;color:var(--muted)}',
    '.lb-tt details{font-size:14px;color:var(--muted)}',
    '.lb-tt details summary{cursor:pointer;color:var(--ink);font-weight:600}',
    '.lb-tt details ul{margin:6px 0 0;padding-left:18px;line-height:1.7}',
    '.lb-tt details code{font-family:var(--f-mono);color:var(--text);background:var(--sheet-2);padding:0 4px;border-radius:4px}'
  ].join('\n');
  function injectCss() {
    if (document.getElementById('lab-truth-css')) return;
    var st = document.createElement('style');
    st.id = 'lab-truth-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ================= Интерфейс ================= */
  function mount(el) {
    injectCss();
    var root = document.createElement('div');
    root.className = 'lb-tt';
    var keys = INSERTS.map(function (k, i) {
      return (i === 8 ? '<span class="sep" aria-hidden="true"></span>' : '') +
        '<button type="button" data-ins="' + esc(k[0]) + '" class="' + (i < 6 ? 'op' : '') + '" aria-label="' + esc(k[1]) + '" title="' + esc(k[1]) + '">' + esc(k[0]) + '</button>';
    }).join('');
    root.innerHTML =
      '<label>Логическое выражение F' +
        '<input type="text" class="lb-tt-in" data-o="in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" ' +
        'placeholder="например, (x → y) ≡ ¬z">' +
      '</label>' +
      '<div class="lb-tt-keys" role="group" aria-label="Вставка символов">' + keys + '</div>' +
      '<div class="lb-tt-ex"><span class="muted">Примеры:</span>' + EXAMPLES.map(function (e, i) {
        return '<button type="button" class="chip" data-ex="' + i + '" title="' + esc(e.expr) + '">' + esc(e.label) + '</button>';
      }).join('') + '</div>' +
      '<div class="lb-tt-msg" data-o="msg" aria-live="polite"></div>' +
      '<div class="lb-tt-bar">' +
        '<div class="seg" role="group" aria-label="Какие строки показать">' +
          '<button type="button" data-flt="all" class="on" aria-pressed="true">Все</button>' +
          '<button type="button" data-flt="1" aria-pressed="false">F = 1</button>' +
          '<button type="button" data-flt="0" aria-pressed="false">F = 0</button>' +
        '</div>' +
        '<label class="inline"><input type="checkbox" data-o="mid"> <span>Промежуточные столбцы</span></label>' +
        '<span class="grow"></span>' +
        '<span class="lb-tt-count" data-o="count" aria-live="polite"></span>' +
      '</div>' +
      '<div class="lb-tt-wrap" data-o="wrap" tabindex="0" role="region" aria-label="Таблица истинности"></div>' +
      '<details><summary>Какие обозначения понимает тренажёр</summary><ul>' +
        '<li>Переменные — латинские буквы: <code>x y z w</code>, <code>a b c d</code>, <code>A B</code>, <code>x1</code>; константы <code>0</code> и <code>1</code>.</li>' +
        '<li>¬ — <code>not</code>, <code>!</code>, <code>-</code>, <code>~</code></li>' +
        '<li>∧ — <code>and</code>, <code>&amp;</code>, <code>&amp;&amp;</code>, <code>*</code></li>' +
        '<li>∨ — <code>or</code>, <code>|</code>, <code>||</code>, <code>+</code></li>' +
        '<li>→ — <code>-&gt;</code>, <code>=&gt;</code>, <code>&lt;=</code> (как в Python)</li>' +
        '<li>≡ — <code>==</code>, <code>=</code>, <code>&lt;-&gt;</code>, <code>&lt;=&gt;</code></li>' +
        '<li>⊕ — <code>xor</code>, <code>^</code>, <code>!=</code></li>' +
        '<li>Порядок действий: скобки, ¬, ∧, ∨, →, затем ≡ и ⊕. Одинаковые операции без скобок выполняются слева направо.</li>' +
      '</ul></details>';
    el.appendChild(root);

    function o(name) { return root.querySelector('[data-o="' + name + '"]'); }
    var inp = o('in'), msg = o('msg'), wrap = o('wrap'), count = o('count'), chkMid = o('mid');
    var S = { filter: 'all', res: null, note: '' };

    function renderTable() {
      var r = S.res;
      if (!r) { wrap.innerHTML = '<div class="lb-tt-empty">Таблица появится, когда выражение будет записано без ошибок.</div>'; count.textContent = ''; return; }
      var mid = chkMid.checked && r.subs.length > 0;
      var ones = 0;
      r.rows.forEach(function (row) { ones += row.f; });
      var shown = r.rows.filter(function (row) { return S.filter === 'all' || String(row.f) === S.filter; });
      var head = '<tr><th class="n" scope="col" title="Номер набора в двоичном коде">№</th>' +
        r.vars.map(function (v) { return '<th scope="col">' + esc(v) + '</th>'; }).join('') +
        (mid ? r.subs.map(function (s) { return '<th scope="col" class="mid">' + esc(s.text) + '</th>'; }).join('') : '') +
        '<th scope="col" class="f">F</th></tr>';
      var body = shown.map(function (row) {
        var num = parseInt(row.bits.join('') || '0', 2);
        return '<tr><td class="n">' + num + '</td>' + row.bits.map(function (b) { return '<td>' + b + '</td>'; }).join('') +
          (mid ? row.mid.map(function (b) { return '<td class="mid">' + b + '</td>'; }).join('') : '') +
          '<td class="f f' + row.f + '">' + row.f + '</td></tr>';
      }).join('');
      wrap.innerHTML = '<table class="lb-tt-tbl"><thead>' + head + '</thead><tbody>' + body + '</tbody></table>' +
        (shown.length ? '' : '<div class="lb-tt-empty">' + (S.filter === '1' ? 'Функция тождественно ложна: F = 1 нет ни в одной строке.' : 'Функция тождественно истинна: F = 0 нет ни в одной строке.') + '</div>');
      var total = r.rows.length;
      count.innerHTML = 'Показано <b>' + shown.length + '</b> из <b>' + total + '</b> · F = 1: <b>' + ones + '</b> · F = 0: <b>' + (total - ones) + '</b>';
    }

    function update() {
      var src = inp.value;
      if (!src.trim()) {
        S.res = null;
        inp.classList.remove('bad');
        inp.removeAttribute('aria-invalid');
        msg.className = 'lb-tt-msg';
        msg.innerHTML = '<span class="muted">Введите выражение или выберите пример.</span>';
        renderTable();
        return;
      }
      try {
        S.res = build(src);
        inp.classList.remove('bad');
        inp.removeAttribute('aria-invalid');
        msg.className = 'lb-tt-msg';
        var n = S.res.vars.length;
        msg.innerHTML = 'Порядок действий: <span class="lb-tt-parsed">F = ' + esc(S.res.text) + '</span>' +
          '<br><span class="muted">' + (n ? n + ' ' + plural(n, 'переменная', 'переменные', 'переменных') + ' → ' + S.res.rows.length + ' ' + plural(S.res.rows.length, 'строка', 'строки', 'строк') + ' (2' + supN(n) + ')' : 'Переменных нет — одна строка') + '.' +
          (S.note ? ' ' + esc(S.note) : '') + '</span>';
      } catch (e) {
        if (!(e instanceof LogicError)) throw e;
        S.res = null;
        inp.classList.add('bad');
        inp.setAttribute('aria-invalid', 'true');
        msg.className = 'lb-tt-msg err';
        var pos = Math.min(e.pos, src.length), len = e.len;
        var before = src.slice(0, pos), bad = src.slice(pos, pos + len) || ' ', after = src.slice(pos + len);
        msg.innerHTML = '<b>Ошибка в позиции ' + (pos + 1) + ':</b> ' + esc(e.message) + '.' +
          '<div class="lb-tt-caret" aria-hidden="true">' + esc(before) + '<mark>' + esc(bad) + '</mark>' + esc(after) + '</div>';
      }
      renderTable();
    }
    function supN(n) { return String(n).replace(/\d/g, function (d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'.charAt(+d); }); }

    function insert(text) {
      var a = inp.selectionStart, b = inp.selectionEnd;
      if (a == null || document.activeElement !== inp && S.lastSel) { a = S.lastSel[0]; b = S.lastSel[1]; }
      if (a == null) { a = b = inp.value.length; }
      var v = inp.value;
      var pad = /[∧∨→≡⊕]/.test(text);
      var ins = pad ? (a > 0 && v.charAt(a - 1) !== ' ' ? ' ' : '') + text + ' ' : text;
      inp.value = v.slice(0, a) + ins + v.slice(b);
      var c = a + ins.length;
      S.lastSel = [c, c];
      S.note = '';
      update();
      inp.focus();
      try { inp.setSelectionRange(c, c); } catch (e) { /* поле без выделения */ }
    }
    function rememberSel() { S.lastSel = [inp.selectionStart, inp.selectionEnd]; }

    inp.addEventListener('input', function () { S.note = ''; rememberSel(); update(); });
    inp.addEventListener('keyup', rememberSel);
    inp.addEventListener('click', rememberSel);
    inp.addEventListener('blur', rememberSel);
    chkMid.addEventListener('change', renderTable);
    root.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t || !root.contains(t)) return;
      if (t.dataset.ins != null) { insert(t.dataset.ins); return; }
      if (t.dataset.ex != null) {
        var ex = EXAMPLES[+t.dataset.ex];
        inp.value = ex.expr;
        S.note = ex.note;
        S.lastSel = [ex.expr.length, ex.expr.length];
        update();
        return;
      }
      if (t.dataset.flt) {
        S.filter = t.dataset.flt;
        var bs = root.querySelectorAll('[data-flt]');
        for (var i = 0; i < bs.length; i++) {
          var on = bs[i].dataset.flt === S.filter;
          bs[i].classList.toggle('on', on);
          bs[i].setAttribute('aria-pressed', on ? 'true' : 'false');
        }
        renderTable();
      }
    });

    inp.value = EXAMPLES[0].expr;
    S.note = EXAMPLES[0].note;
    update();
  }

  KL.labs.truth = {
    title: 'Таблицы истинности',
    icon: 'x∧y',
    desc: 'Введите логическое выражение — получите таблицу истинности с фильтром F = 0 / F = 1',
    long: 'Запишите формулу с операциями ¬, ∧, ∨, →, ≡, ⊕ (можно and, or, not, ->, ==). Тренажёр покажет порядок действий, построит таблицу для всех наборов переменных и оставит только строки, где F = 1 или F = 0, — как в задании 2 ЕГЭ.',
    subjectName: 'Информатика',
    mount: mount,
    _parse: parse,
    _build: build,
    _show: show
  };
})();
