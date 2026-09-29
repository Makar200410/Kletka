/* Лаборатория «Графики функций»: семейства с параметрами, свои функции с нулями и пересечениями, тренажёр «Угадай параметры». */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  KL.labs = KL.labs || {};

  /* ================= Числа ================= */
  function rnd(v, d) {
    var p = Math.pow(10, d);
    var r = Math.round(Number((Math.abs(v) * p).toPrecision(15))) / p;
    return v < 0 && r !== 0 ? -r : r;
  }
  function fmt(v, d) {
    if (typeof v !== 'number' || !isFinite(v)) return '—';
    if (d == null) d = 3;
    if (Math.abs(v) >= 1e12) return v.toExponential(3).replace('.', ',').replace('-', '−').replace('e+', '·10^');
    var r = rnd(v, d);
    var s = Math.abs(r).toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    var parts = s.split('.');
    if (parts[0].length > 4) parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (r < 0 ? '−' : '') + parts[0] + (parts[1] ? ',' + parts[1] : '');
  }
  function isApprox(v, d) { return Math.abs(v - rnd(v, d)) > 1e-9 * Math.max(1, Math.abs(v)); }
  function eq(v, d) { if (d == null) d = 3; return (isApprox(v, d) ? '≈ ' : '= ') + fmt(v, d); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  /* v в долях π (шаг π/12), иначе обычное число */
  function piFrac(v) {
    var n = Math.round(v / Math.PI * 12);
    if (Math.abs(n * Math.PI / 12 - v) > 1e-9) return fmt(v);
    if (n === 0) return '0';
    var g = gcd(n, 12), a = n / g, b = 12 / g;
    return (a < 0 ? '−' : '') + (Math.abs(a) === 1 ? '' : Math.abs(a)) + 'π' + (b === 1 ? '' : '/' + b);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pt(x, y, d) { return '(' + fmt(x, d) + '; ' + fmt(y, d) + ')'; }

  /* ================= Разбор формул (без eval) ================= */
  function cot(x) { return Math.cos(x) / Math.sin(x); }
  var FN = {
    sin: Math.sin, cos: Math.cos, tg: Math.tan, tan: Math.tan, ctg: cot, cot: cot,
    arcsin: Math.asin, arccos: Math.acos, arctg: Math.atan, arctan: Math.atan,
    sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, exp: Math.exp,
    ln: Math.log, lg: Math.log10, log: Math.log10
  };
  var WORDS = Object.keys(FN).concat(['pi', 'x', 'e']).sort(function (a, b) { return b.length - a.length; });
  var OPN = { '+': '+', '-': '−', '*': '·', '/': '/', '^': '^' };

  function perr(msg) { var e = new Error(msg); e.parse = true; throw e; }

  function normalize(src) {
    return String(src)
      .replace(/[хХ]/g, 'x')
      .replace(/^\s*(?:[yYуУ]|[fFgG]\s*\(\s*x\s*\))\s*=\s*/, '')
      .replace(/[−–—‒]/g, '-')
      .replace(/[×·∙⋅]/g, '*')
      .replace(/[÷:]/g, '/')
      .replace(/²/g, '^2').replace(/³/g, '^3')
      .replace(/[[{]/g, '(').replace(/[\]}]/g, ')')
      .replace(/π/g, ' pi ');
  }

  function tokenize(src) {
    var s = normalize(src), out = [], i = 0, m;
    while (i < s.length) {
      var c = s.charAt(i);
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.,]/.test(c)) {
        m = /^\d*(?:[.,]\d*)?/.exec(s.slice(i));
        var txt = m[0];
        if (!/\d/.test(txt)) perr(c === ',' ? 'Лишняя запятая. Десятичную дробь пишите так: 2,5 или 2.5' : 'Лишняя точка');
        if (/[.,]$/.test(txt)) perr('В числе «' + txt + '» после запятой нужна цифра');
        var nx = s.charAt(i + txt.length);
        if (nx === '.' || nx === ',') perr('Лишняя запятая или точка после числа «' + txt + '»');
        out.push({ t: 'num', v: parseFloat(txt.replace(',', '.')) });
        i += txt.length;
        continue;
      }
      if (/[a-zA-Z_]/.test(c)) {
        var low = s.slice(i).toLowerCase(), w = null;
        for (var k = 0; k < WORDS.length; k++) if (low.indexOf(WORDS[k]) === 0) { w = WORDS[k]; break; }
        if (!w) {
          var run = /^[a-zA-Z_]+/.exec(s.slice(i))[0];
          perr('Неизвестное обозначение «' + run + '». Переменная — только x, функции: sin, cos, tg, sqrt, ln, log, abs…');
        }
        i += w.length;
        if (w === 'log' && (s.charAt(i) === '_' || /[0-9]/.test(s.charAt(i)))) {
          if (s.charAt(i) === '_') i++;
          out.push({ t: 'log' });
          continue;
        }
        if (w === 'x') out.push({ t: 'x' });
        else if (w === 'pi') out.push({ t: 'num', v: Math.PI });
        else if (w === 'e') out.push({ t: 'num', v: Math.E });
        else out.push({ t: 'fn', v: w });
        continue;
      }
      if ('+-*/^'.indexOf(c) >= 0) {
        if (c === '*' && s.charAt(i + 1) === '*') { out.push({ t: 'op', v: '^' }); i += 2; continue; }
        out.push({ t: 'op', v: c }); i++; continue;
      }
      if (c === '(' || c === ')' || c === '|') { out.push({ t: c }); i++; continue; }
      if (c === '√') { out.push({ t: 'fn', v: 'sqrt', sym: '√' }); i++; continue; }
      if (c === '∛') { out.push({ t: 'fn', v: 'cbrt', sym: '∛' }); i++; continue; }
      if (c === '=') perr('Знак «=» не нужен: введите только правую часть, например x^2 − 1');
      if (/[а-яё]/i.test(c)) perr('Русская буква «' + c + '» — переключите раскладку: переменная x и функции пишутся латиницей');
      perr('Непонятный символ «' + c + '»');
    }
    return out;
  }

  function parse(src) {
    var toks = tokenize(src), p = 0, absDepth = 0;
    if (!toks.length) perr('Пустое поле: введите функцию, например x^2 − 4x + 3');
    function peek() { return toks[p]; }
    function isOp(tk, ops) { return tk && tk.t === 'op' && ops.indexOf(tk.v) >= 0; }
    function startsFactor(tk, allowAbs) {
      if (!tk) return false;
      return tk.t === 'num' || tk.t === 'x' || tk.t === 'fn' || tk.t === 'log' || tk.t === '(' || (tk.t === '|' && allowAbs);
    }
    function expr() {
      var n = term();
      while (isOp(peek(), '+-')) { var op = toks[p++].v; n = { k: op, a: n, b: term(op) }; }
      return n;
    }
    function term(after) {
      var n = unary(after);
      for (;;) {
        var tk = peek();
        if (isOp(tk, '*/')) { p++; n = { k: tk.v, a: n, b: unary(tk.v) }; }
        else if (startsFactor(tk, absDepth === 0)) n = { k: '*', a: n, b: power() };
        else return n;
      }
    }
    function unary(after) {
      var tk = peek();
      if (isOp(tk, '+-')) { p++; var u = unary(tk.v); return tk.v === '-' ? { k: 'neg', a: u } : u; }
      return power(after);
    }
    function power(after) {
      var b = primary(after);
      if (isOp(peek(), '^')) { p++; return { k: '^', a: b, b: unary('^') }; }
      return b;
    }
    function fnArg(name, sym) {
      var nx = peek();
      if (!nx || !(startsFactor(nx, true) || isOp(nx, '+-'))) perr('После «' + name + '» нужен аргумент, например ' + name + '(x)');
      if (nx.t === '(') return primary();
      if (sym) return unary();
      var a = unary();
      while (peek() && (peek().t === 'num' || peek().t === 'x' || peek().t === '(')) a = { k: '*', a: a, b: power() };
      return a;
    }
    function primary(after) {
      var tk = toks[p];
      if (!tk) {
        if (after) perr('После «' + OPN[after] + '» не хватает числа, x или скобки');
        perr(absDepth ? 'Модуль не закрыт: нужна вторая черта «|»' : 'Выражение оборвалось');
      }
      if (tk.t === 'num') { p++; return { k: 'num', v: tk.v }; }
      if (tk.t === 'x') { p++; return { k: 'x' }; }
      if (tk.t === '(') {
        p++;
        if (peek() && peek().t === ')') perr('Пустые скобки «()»');
        var save = absDepth; absDepth = 0;
        var e = expr();
        absDepth = save;
        if (!peek() || peek().t !== ')') perr(peek() && peek().t === '|' ? 'Скобка и модуль перепутаны: сначала закройте «(»' : 'Не хватает закрывающей скобки «)»');
        p++;
        return e;
      }
      if (tk.t === '|') {
        p++;
        absDepth++;
        var e2 = expr();
        absDepth--;
        if (!peek() || peek().t !== '|') perr(peek() && peek().t === ')' ? 'Модуль и скобка перепутаны: сначала закройте «|»' : 'Модуль не закрыт: нужна вторая черта «|»');
        p++;
        return { k: 'abs', a: e2 };
      }
      if (tk.t === 'fn' || tk.t === 'log') {
        p++;
        var name = tk.t === 'log' ? 'log' : (tk.sym || tk.v), base = null, pw = null;
        if (tk.t === 'log') {
          if (!peek() || !(peek().t === 'num' || peek().t === '(')) perr('Укажите основание логарифма, например log_2(x)');
          base = peek().t === 'num' ? { k: 'num', v: toks[p++].v } : primary();
        }
        if (!tk.sym && isOp(peek(), '^')) {
          p++;
          if (!peek() || peek().t !== 'num') perr('После «' + name + '^» ожидается число, например ' + name + '^2(x)');
          pw = { k: 'num', v: toks[p++].v };
        }
        var node = { k: 'fn', f: tk.t === 'log' ? null : tk.v, base: base, a: fnArg(name, tk.sym) };
        return pw ? { k: '^', a: node, b: pw } : node;
      }
      if (tk.t === ')') perr(after ? 'После «' + OPN[after] + '» не хватает выражения' : 'Лишняя закрывающая скобка «)» или пустое место перед ней');
      if (tk.t === '|') perr('Пустой модуль «| |»');
      if (tk.t === 'op') perr(after ? 'Два знака подряд: «' + OPN[after] + '» и «' + OPN[tk.v] + '»' : 'Выражение не может начинаться со знака «' + OPN[tk.v] + '»');
      perr('Непонятный фрагмент выражения');
    }
    var tree = expr();
    if (p < toks.length) {
      var r = toks[p];
      if (r.t === ')') perr('Лишняя закрывающая скобка «)»');
      if (r.t === '|') perr('Лишняя черта модуля «|»');
      perr('Непонятный фрагмент выражения');
    }
    return tree;
  }

  /* Степень: для отрицательного основания и дробного показателя p/q с нечётным q — вещественный корень */
  function rpow(a, b) {
    if (a < 0 && Math.floor(b) !== b && isFinite(b)) {
      for (var q = 2; q <= 15; q++) {
        var pq = b * q, n = Math.round(pq);
        if (Math.abs(pq - n) < 1e-9) {
          if (q % 2 === 0) return NaN;
          var r = Math.pow(-a, b);
          return n % 2 ? -r : r;
        }
      }
      return NaN;
    }
    return Math.pow(a, b);
  }

  function compile(n) {
    var A, B;
    switch (n.k) {
      case 'num': var v = n.v; return function () { return v; };
      case 'x': return function (x) { return x; };
      case 'neg': A = compile(n.a); return function (x) { return -A(x); };
      case 'abs': A = compile(n.a); return function (x) { return Math.abs(A(x)); };
      case '+': A = compile(n.a); B = compile(n.b); return function (x) { return A(x) + B(x); };
      case '-': A = compile(n.a); B = compile(n.b); return function (x) { return A(x) - B(x); };
      case '*': A = compile(n.a); B = compile(n.b); return function (x) { return A(x) * B(x); };
      case '/': A = compile(n.a); B = compile(n.b); return function (x) { return A(x) / B(x); };
      case '^': A = compile(n.a); B = compile(n.b); return function (x) { return rpow(A(x), B(x)); };
      case 'fn':
        A = compile(n.a);
        if (!n.f) {
          B = compile(n.base);
          return function (x) { var b = B(x); if (!(b > 0) || b === 1) return NaN; return Math.log(A(x)) / Math.log(b); };
        }
        var F = FN[n.f];
        return function (x) { return F(A(x)); };
    }
    throw new Error('узел ' + n.k);
  }
  function hasX(n) {
    if (!n) return false;
    if (n.k === 'x') return true;
    return hasX(n.a) || hasX(n.b) || hasX(n.base);
  }
  /* Разбор строки: {f} или {error} */
  function makeFn(src) {
    try { var t = parse(src); return { f: compile(t), tree: t, usesX: hasX(t) }; }
    catch (e) { if (e.parse) return { error: e.message }; throw e; }
  }
  /* Число из поля ответа: «−0,5», «1/2», «3» */
  function parseNumber(src) {
    var r = makeFn(String(src || '').trim());
    if (r.error || r.usesX) return null;
    var v = r.f(0);
    return isFinite(v) ? v : null;
  }

  /* ================= Нули и пересечения ================= */
  function findRoots(h, a, b, n) {
    n = n || 2000;
    var dx = (b - a) / n, xs = [], ys = [], out = [], i;
    for (i = 0; i <= n; i++) { var x = a + i * dx; xs.push(x); ys.push(h(x)); }
    function fin(v) { return typeof v === 'number' && isFinite(v); }
    function bisect(lo, hi, slo) {
      for (var k = 0; k < 200; k++) {
        var mid = (lo + hi) / 2;
        if (mid === lo || mid === hi) break;
        var sm = h(mid);
        if (sm === 0) return mid;
        if ((sm < 0) === (slo < 0)) lo = mid; else hi = mid;
      }
      var hl = Math.abs(h(lo)), hh = Math.abs(h(hi));
      var tol = 1e-7;
      if (Math.min(hl, hh) > tol || !fin(hl) || !fin(hh) || Math.max(hl, hh) > 1e-3) return null;
      return hl <= hh ? lo : hi;
    }
    function edge(lo, hi) {
      /* граница области определения между lo (не определена) и hi (определена) — по возрастанию или убыванию */
      for (var k = 0; k < 80; k++) {
        var mid = (lo + hi) / 2;
        if (mid === lo || mid === hi) break;
        if (fin(h(mid))) hi = mid; else lo = mid;
      }
      return fin(h(hi)) && Math.abs(h(hi)) < 1e-6 ? hi : null;
    }
    for (i = 0; i < n; i++) {
      var y0 = ys[i], y1 = ys[i + 1];
      var f0 = fin(y0), f1 = fin(y1);
      if (f0 && y0 === 0) { out.push(xs[i]); continue; }
      if (f0 && f1) {
        if (y1 !== 0 && (y0 < 0) !== (y1 < 0)) { var r = bisect(xs[i], xs[i + 1], y0); if (r !== null) out.push(r); }
      } else if (f0 !== f1) {
        var e = f1 ? edge(xs[i], xs[i + 1]) : edge(xs[i + 1], xs[i]);
        if (e !== null) out.push(e);
      }
    }
    if (fin(ys[n]) && ys[n] === 0) out.push(xs[n]);
    /* касание без смены знака: локальный минимум |h| около нуля */
    for (i = 1; i < n; i++) {
      var a0 = ys[i - 1], a1 = ys[i], a2 = ys[i + 1];
      if (!fin(a0) || !fin(a1) || !fin(a2) || a1 === 0) continue;
      if ((a0 < 0) !== (a1 < 0) || (a1 < 0) !== (a2 < 0) || a2 === 0 || a0 === 0) continue;
      if (Math.abs(a1) > Math.abs(a0) || Math.abs(a1) > Math.abs(a2)) continue;
      var lo = xs[i - 1], hi = xs[i + 1], gr = (Math.sqrt(5) - 1) / 2;
      for (var k = 0; k < 120; k++) {
        var c1 = hi - gr * (hi - lo), c2 = lo + gr * (hi - lo);
        var v1 = Math.abs(h(c1)), v2 = Math.abs(h(c2));
        if (!(v1 >= v2)) hi = c2; else lo = c1;
      }
      var xm = (lo + hi) / 2;
      if (Math.abs(h(xm)) < 1e-9) out.push(xm);
    }
    out.sort(function (p, q) { return p - q; });
    var res = [];
    out.forEach(function (x) {
      if (Math.abs(x - Math.round(x)) < 1e-9) x = Math.round(x);
      if (!res.length || Math.abs(x - res[res.length - 1]) > Math.max(dx * 0.75, 1e-9)) res.push(x);
    });
    return res;
  }

  /* ================= Семейства функций ================= */
  function V(s) { return '<i>' + s + '</i>'; }
  var X = V('x');
  /* Сумма членов с правильными знаками: [{c: число, b: html}] */
  function sum(terms, d) {
    var s = '';
    terms.forEach(function (t) {
      if (!t.c) return;
      var neg = t.c < 0, abs = Math.abs(t.c);
      var body = t.b ? ((abs === 1 ? '' : fmt(abs, d == null ? 2 : d) + (t.dot ? '·' : '')) + t.b) : fmt(abs, d == null ? 2 : d);
      if (!s) s = (neg ? '−' : '') + body;
      else s += (neg ? ' − ' : ' + ') + body;
    });
    return s || '0';
  }
  function shift(m) { return sum([{ c: 1, b: X }, { c: -m }]); }
  function frac(a, b) { return '<span class="lb-gr-fr"><span>' + a + '</span><span>' + b + '</span></span>'; }
  function sqrtH(inner) { return '<span class="lb-gr-sq">√<span>' + inner + '</span></span>'; }
  function brk(s) { return /[+−]/.test(s.replace(/^−/, '')) ? '(' + s + ')' : s; }

  var FAM = {
    lin: {
      name: 'Линейная y = kx + b',
      params: [{ k: 'k', min: -5, max: 5, step: 0.1, v: 0.5 }, { k: 'b', min: -10, max: 10, step: 0.5, v: 2 }],
      f: function (p) { return function (x) { return p.k * x + p.b; }; },
      html: function (p) { return sum([{ c: p.k, b: X }, { c: p.b }]); },
      info: function (p) {
        var r = [[fmt(p.k, 2), 'угловой коэффициент k'], [p.k > 0 ? 'возрастает' : p.k < 0 ? 'убывает' : 'постоянна', 'функция']];
        r.push([pt(0, p.b), 'пересечение с Oy']);
        if (p.k !== 0) r.push([pt(-p.b / p.k, 0), 'пересечение с Ox' + (isApprox(-p.b / p.k, 3) ? ' (≈)' : '')]);
        else r.push([p.b === 0 ? 'вся ось' : 'нет', 'пересечение с Ox']);
        r.push([fmt(Math.atan(p.k) * 180 / Math.PI, 1) + '°', 'угол с осью Ox']);
        return r;
      },
      marks: function (p) {
        var pts = [{ x: 0, y: p.b, t: 'пересечение с Oy' }];
        if (p.k !== 0) pts.push({ x: -p.b / p.k, y: 0, t: 'пересечение с Ox' });
        return { pts: pts, lines: [] };
      }
    },
    quad: {
      name: 'Квадратичная y = ax² + bx + c',
      params: [{ k: 'a', min: -3, max: 3, step: 0.1, v: 1 }, { k: 'b', min: -10, max: 10, step: 0.5, v: -2 }, { k: 'c', min: -10, max: 10, step: 0.5, v: -3 }],
      f: function (p) { return function (x) { return (p.a * x + p.b) * x + p.c; }; },
      html: function (p) { return sum([{ c: p.a, b: X + '²' }, { c: p.b, b: X }, { c: p.c }]); },
      info: function (p) {
        var a = p.a, b = p.b, c = p.c;
        if (a === 0) return [['a = 0', 'это не парабола, а прямая y = bx + c']].concat(FAM.lin.info({ k: b, b: c }).slice(2, 4));
        var x0 = -b / (2 * a), y0 = c - b * b / (4 * a), D = b * b - 4 * a * c;
        var r = [[pt(x0, y0), 'вершина (x₀; y₀)'], [fmt(D, 3), 'дискриминант D = b² − 4ac']];
        if (D > 1e-12) {
          var s = Math.sqrt(D), r1 = (-b - s) / (2 * a), r2 = (-b + s) / (2 * a);
          if (r1 > r2) { var t = r1; r1 = r2; r2 = t; }
          r.push([fmt(r1) + '; ' + fmt(r2), 'корни x₁, x₂' + (isApprox(r1, 3) || isApprox(r2, 3) ? ' (≈)' : '')]);
        } else if (Math.abs(D) <= 1e-12) r.push([fmt(x0), 'один корень (D = 0)']);
        else r.push(['нет', 'корней (D < 0)']);
        r.push([a > 0 ? 'вверх' : 'вниз', 'ветви (знак a)']);
        r.push(['x = ' + fmt(x0), 'ось симметрии']);
        r.push([pt(0, c), 'пересечение с Oy']);
        r.push([a > 0 ? 'y ≥ ' + fmt(y0) : 'y ≤ ' + fmt(y0), 'множество значений']);
        return r;
      },
      marks: function (p) {
        if (p.a === 0) return FAM.lin.marks({ k: p.b, b: p.c });
        var x0 = -p.b / (2 * p.a), y0 = p.c - p.b * p.b / (4 * p.a), D = p.b * p.b - 4 * p.a * p.c;
        var pts = [{ x: x0, y: y0, t: 'вершина' }, { x: 0, y: p.c, t: 'пересечение с Oy' }];
        if (D > 1e-12) {
          var s = Math.sqrt(D);
          pts.push({ x: (-p.b - s) / (2 * p.a), y: 0, t: 'корень' }, { x: (-p.b + s) / (2 * p.a), y: 0, t: 'корень' });
        }
        return { pts: pts, lines: [{ x: x0, kind: 'sym' }] };
      }
    },
    hyp: {
      name: 'Гипербола y = k/(x − a) + b',
      params: [{ k: 'k', min: -10, max: 10, step: 0.5, v: 2 }, { k: 'a', min: -8, max: 8, step: 0.5, v: 1 }, { k: 'b', min: -8, max: 8, step: 0.5, v: -1 }],
      f: function (p) { return function (x) { return p.k / (x - p.a) + p.b; }; },
      html: function (p) {
        if (p.k === 0) return fmt(p.b, 2);
        return (p.k < 0 ? '−' : '') + frac(fmt(Math.abs(p.k), 2), shift(p.a)) + (p.b ? (p.b > 0 ? ' + ' : ' − ') + fmt(Math.abs(p.b), 2) : '');
      },
      info: function (p) {
        if (p.k === 0) return [['k = 0', 'это не гипербола: y = b при x ≠ a']];
        var r = [['x = ' + fmt(p.a), 'вертикальная асимптота'], ['y = ' + fmt(p.b), 'горизонтальная асимптота'],
          ['x ≠ ' + fmt(p.a), 'область определения'], ['y ≠ ' + fmt(p.b), 'множество значений'],
          [p.k > 0 ? 'I и III' : 'II и IV', 'четверти ветвей (от асимптот)']];
        r.push([p.a !== 0 ? pt(0, p.b - p.k / p.a) : 'нет', 'пересечение с Oy']);
        r.push([p.b !== 0 ? pt(p.a - p.k / p.b, 0) : 'нет', 'пересечение с Ox']);
        return r;
      },
      marks: function (p) {
        if (p.k === 0) return { pts: [], lines: [{ x: p.a, kind: 'asym' }] };
        var pts = [];
        if (p.a !== 0) pts.push({ x: 0, y: p.b - p.k / p.a, t: 'пересечение с Oy' });
        if (p.b !== 0) pts.push({ x: p.a - p.k / p.b, y: 0, t: 'пересечение с Ox' });
        pts.push({ x: p.a + 1, y: p.b + p.k, t: 'точка x = a + 1' });
        return { pts: pts, lines: [{ x: p.a, kind: 'asym' }, { y: p.b, kind: 'asym' }] };
      }
    },
    root: {
      name: 'Корень y = a√(x − m) + n',
      params: [{ k: 'a', min: -4, max: 4, step: 0.1, v: 1 }, { k: 'm', min: -8, max: 8, step: 0.5, v: -2 }, { k: 'n', min: -8, max: 8, step: 0.5, v: -1 }],
      f: function (p) { return function (x) { return p.a * Math.sqrt(x - p.m) + p.n; }; },
      html: function (p) { return sum([{ c: p.a, b: sqrtH(shift(p.m)) }, { c: p.n }]); },
      info: function (p) {
        var r = [[pt(p.m, p.n), 'начальная точка (m; n)'], ['x ≥ ' + fmt(p.m), 'область определения'],
          [p.a > 0 ? 'y ≥ ' + fmt(p.n) : p.a < 0 ? 'y ≤ ' + fmt(p.n) : 'y = ' + fmt(p.n), 'множество значений'],
          [p.a > 0 ? 'возрастает' : p.a < 0 ? 'убывает' : 'постоянна', 'функция']];
        var z = p.a !== 0 ? -p.n / p.a : NaN;
        r.push([z >= 0 ? pt(p.m + z * z, 0) : (p.a === 0 && p.n === 0 ? 'вся ветвь' : 'нет'), 'пересечение с Ox']);
        return r;
      },
      marks: function (p) {
        var pts = [{ x: p.m, y: p.n, t: 'начало графика' }, { x: p.m + 1, y: p.n + p.a, t: 'x = m + 1' }, { x: p.m + 4, y: p.n + 2 * p.a, t: 'x = m + 4' }];
        return { pts: pts, lines: [] };
      }
    },
    abs: {
      name: 'Модуль y = a|x − m| + n',
      params: [{ k: 'a', min: -4, max: 4, step: 0.1, v: 1 }, { k: 'm', min: -8, max: 8, step: 0.5, v: 1 }, { k: 'n', min: -8, max: 8, step: 0.5, v: -2 }],
      f: function (p) { return function (x) { return p.a * Math.abs(x - p.m) + p.n; }; },
      html: function (p) { return sum([{ c: p.a, b: '|' + shift(p.m) + '|' }, { c: p.n }]); },
      info: function (p) {
        var r = [[pt(p.m, p.n), 'вершина «галочки» (m; n)'],
          [p.a > 0 ? 'y ≥ ' + fmt(p.n) : p.a < 0 ? 'y ≤ ' + fmt(p.n) : 'y = ' + fmt(p.n), 'множество значений'],
          ['x = ' + fmt(p.m), 'ось симметрии']];
        var z = p.a !== 0 ? -p.n / p.a : NaN;
        r.push([z > 0 ? fmt(p.m - z) + '; ' + fmt(p.m + z) : z === 0 ? fmt(p.m) : 'нет', 'нули функции']);
        return r;
      },
      marks: function (p) {
        var pts = [{ x: p.m, y: p.n, t: 'вершина' }], z = p.a !== 0 ? -p.n / p.a : NaN;
        if (z > 0) pts.push({ x: p.m - z, y: 0, t: 'нуль' }, { x: p.m + z, y: 0, t: 'нуль' });
        return { pts: pts, lines: [{ x: p.m, kind: 'sym' }] };
      }
    },
    exp: {
      name: 'Показательная y = aˣ⁻ᵐ + n',
      params: [{ k: 'a', min: 0.1, max: 5, step: 0.1, v: 2 }, { k: 'm', min: -8, max: 8, step: 0.5, v: 0 }, { k: 'n', min: -8, max: 8, step: 0.5, v: -1 }],
      f: function (p) { return function (x) { return Math.pow(p.a, x - p.m) + p.n; }; },
      html: function (p) { return fmt(p.a, 2) + '<sup>' + shift(p.m) + '</sup>' + (p.n ? (p.n > 0 ? ' + ' : ' − ') + fmt(Math.abs(p.n), 2) : ''); },
      info: function (p) {
        if (p.a === 1) return [['a = 1', 'основание 1: получается прямая y = 1 + n']];
        var r = [['y = ' + fmt(p.n), 'горизонтальная асимптота'], ['y > ' + fmt(p.n), 'множество значений'],
          [p.a > 1 ? 'возрастает' : 'убывает', p.a > 1 ? 'функция (a > 1)' : 'функция (0 < a < 1)'],
          [pt(p.m, 1 + p.n), 'точка при x = m']];
        r.push([p.n < 0 ? pt(p.m + Math.log(-p.n) / Math.log(p.a), 0) : 'нет', 'пересечение с Ox']);
        return r;
      },
      marks: function (p) {
        if (p.a === 1) return { pts: [], lines: [] };
        var pts = [{ x: p.m, y: 1 + p.n, t: 'x = m' }, { x: p.m + 1, y: p.a + p.n, t: 'x = m + 1' }];
        if (p.n < 0) pts.push({ x: p.m + Math.log(-p.n) / Math.log(p.a), y: 0, t: 'пересечение с Ox' });
        return { pts: pts, lines: [{ y: p.n, kind: 'asym' }] };
      }
    },
    log: {
      name: 'Логарифмическая y = logₐ(x − m) + n',
      params: [{ k: 'a', min: 0.1, max: 5, step: 0.1, v: 2 }, { k: 'm', min: -8, max: 8, step: 0.5, v: -1 }, { k: 'n', min: -8, max: 8, step: 0.5, v: 0 }],
      f: function (p) { return function (x) { return p.a === 1 ? NaN : Math.log(x - p.m) / Math.log(p.a) + p.n; }; },
      html: function (p) { return 'log<sub>' + fmt(p.a, 2) + '</sub>(' + shift(p.m) + ')' + (p.n ? (p.n > 0 ? ' + ' : ' − ') + fmt(Math.abs(p.n), 2) : ''); },
      info: function (p) {
        if (p.a === 1) return [['a = 1', 'основание логарифма не может быть равно 1']];
        return [['x = ' + fmt(p.m), 'вертикальная асимптота'], ['x > ' + fmt(p.m), 'область определения'],
          [p.a > 1 ? 'возрастает' : 'убывает', p.a > 1 ? 'функция (a > 1)' : 'функция (0 < a < 1)'],
          [pt(p.m + 1, p.n), 'точка при x = m + 1'], [pt(p.m + Math.pow(p.a, -p.n), 0), 'пересечение с Ox']];
      },
      marks: function (p) {
        if (p.a === 1) return { pts: [], lines: [] };
        return { pts: [{ x: p.m + 1, y: p.n, t: 'x = m + 1' }, { x: p.m + p.a, y: p.n + 1, t: 'x = m + a' }, { x: p.m + Math.pow(p.a, -p.n), y: 0, t: 'пересечение с Ox' }], lines: [{ x: p.m, kind: 'asym' }] };
      }
    },
    sin: {
      name: 'Синусоида y = a·sin(bx + c) + d',
      pi: true,
      params: [{ k: 'a', min: -4, max: 4, step: 0.5, v: 2 }, { k: 'b', min: 0.25, max: 4, step: 0.25, v: 1 }, { k: 'c', min: -12, max: 12, step: 1, v: 0, pi: true }, { k: 'd', min: -5, max: 5, step: 0.5, v: 0 }],
      f: function (p) { var c = p.c * Math.PI / 12; return function (x) { return p.a * Math.sin(p.b * x + c) + p.d; }; },
      html: function (p) {
        var c = p.c * Math.PI / 12;
        var inner = sum([{ c: p.b, b: X }]) + (p.c ? (p.c > 0 ? ' + ' : ' − ') + piFrac(Math.abs(c)) : '');
        return sum([{ c: p.a, b: 'sin(' + inner + ')', dot: true }, { c: p.d }]);
      },
      info: function (p) {
        var A = Math.abs(p.a);
        return [[fmt(A, 2), 'амплитуда |a|'], [piFrac(2 * Math.PI / p.b), 'период T = 2π/b'],
          ['[' + fmt(p.d - A, 2) + '; ' + fmt(p.d + A, 2) + ']', 'множество значений'],
          [piFrac(p.c * Math.PI / 12), 'сдвиг фазы c'], ['y = ' + fmt(p.d, 2), 'средняя линия']];
      },
      marks: function (p) {
        var c = p.c * Math.PI / 12;
        return { pts: [{ x: 0, y: p.a * Math.sin(c) + p.d, t: 'пересечение с Oy' }], lines: p.a ? [{ y: p.d, kind: 'sym' }] : [] };
      }
    }
  };
  var FAM_ORDER = ['lin', 'quad', 'hyp', 'root', 'abs', 'exp', 'log', 'sin'];

  /* ================= «Угадай параметры» ================= */
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function intPoints(f, maxN, extra) {
    var out = extra ? extra.slice() : [];
    for (var x = -8; x <= 8; x++) {
      var y = f(x);
      if (!isFinite(y) || Math.abs(y) > 7 || Math.abs(y - Math.round(y)) > 1e-9) continue;
      y = Math.round(y);
      if (out.some(function (q) { return q.x === x; })) continue;
      out.push({ x: x, y: y });
    }
    if (out.length <= maxN) return out;
    /* выбираем разнесённые точки, сохраняя обязательные */
    var keep = extra ? extra.slice() : [], rest = out.slice(keep.length);
    rest.sort(function (p, q) { return Math.abs(p.x) + Math.abs(p.y) - Math.abs(q.x) - Math.abs(q.y); });
    while (keep.length < maxN && rest.length) {
      var best = 0, bd = -1;
      rest.forEach(function (q, i) {
        var d = keep.length ? Math.min.apply(null, keep.map(function (k) { return Math.abs(k.x - q.x); })) : 10 - Math.abs(q.x);
        if (d > bd) { bd = d; best = i; }
      });
      keep.push(rest.splice(best, 1)[0]);
    }
    return keep;
  }
  function sgn(v, s) { return v < 0 ? ' − ' + s : ' + ' + s; }
  var GUESS = {
    lin: function () {
      var k = pick([-3, -2, -1, -0.5, 0.5, 1, 2, 3]), b = rint(-4, 4);
      var f = function (x) { return k * x + b; };
      return { tpl: 'y = ' + V('k') + X + ' + ' + V('b'), keys: ['k', 'b'], ans: { k: k, b: b }, f: f, pts: intPoints(f, 3, [{ x: 0, y: b }]),
        how: 'Прямая пересекает ось Oy в точке ' + pt(0, b) + ', значит b = ' + fmt(b) + '. Угловой коэффициент k = Δy/Δx: при сдвиге на 1 вправо y меняется на ' + fmt(k) + ', значит k = ' + fmt(k) + '.' };
    },
    quad: function () {
      var a = pick([-2, -1, -0.5, 0.5, 1, 2]), p = rint(-3, 3), q = rint(-4, 4);
      if (a > 0 && q > 2) q = -q; if (a < 0 && q < -2) q = -q;
      var b = -2 * a * p, c = a * p * p + q, f = function (x) { return a * (x - p) * (x - p) + q; };
      return { tpl: 'y = ' + V('a') + X + '² + ' + V('b') + X + ' + ' + V('c'), keys: ['a', 'b', 'c'], ans: { a: a, b: b, c: c }, f: f, pts: intPoints(f, 3, [{ x: p, y: q }]),
        how: 'Вершина ' + pt(p, q) + '. Шаг на 1 от вершины меняет y на a, поэтому a = ' + fmt(a) + '. Тогда y = ' + fmt(a) + '(x' + sgn(-p, fmt(Math.abs(p))) + ')²' + sgn(q, fmt(Math.abs(q))) + ', раскрываем скобки: b = −2a·x₀ = ' + fmt(b) + ', c = a·x₀² + y₀ = ' + fmt(c) + '.' };
    },
    hyp0: function () {
      var k = pick([-8, -6, -4, -3, -2, -1, 1, 2, 3, 4, 6, 8]), f = function (x) { return k / x; };
      return { tpl: 'y = ' + frac(V('k'), X), keys: ['k'], ans: { k: k }, f: f, pts: intPoints(f, 3),
        how: 'Для любой точки гиперболы y = k/x верно k = x·y. Например, для точки ' + pt(1, k) + ': k = ' + fmt(k) + '.' };
    },
    hyp: function () {
      var k = pick([-6, -4, -3, -2, -1, 1, 2, 3, 4, 6]), a = rint(-3, 3), b = rint(-3, 3);
      var f = function (x) { return k / (x + a) + b; };
      return { tpl: 'f(' + X + ') = ' + frac(V('k'), X + ' + ' + V('a')) + ' + ' + V('b'), keys: ['k', 'a', 'b'], ans: { k: k, a: a, b: b }, f: f, pts: intPoints(f, 3, [{ x: 1 - a, y: k + b }]),
        how: 'Асимптоты: x = ' + fmt(-a) + ' (значит a = ' + fmt(a) + ') и y = ' + fmt(b) + ' (значит b = ' + fmt(b) + '). Точка ' + pt(1 - a, k + b) + ' даёт k = (x + a)(y − b) = ' + fmt(k) + '.' };
    },
    log: function () {
      var a = pick([2, 3, 0.5]), b = rint(-3, 3);
      var f = function (x) { return Math.log(x + b) / Math.log(a); };
      return { tpl: 'f(' + X + ') = log<sub>' + V('a') + '</sub>(' + X + ' + ' + V('b') + ')', keys: ['a', 'b'], ans: { a: a, b: b }, f: f, pts: intPoints(f, 3, [{ x: 1 - b, y: 0 }]),
        how: 'Логарифм равен 0, когда аргумент равен 1: x + b = 1 в точке x = ' + fmt(1 - b) + ', значит b = ' + fmt(b) + '. Логарифм равен 1, когда аргумент равен основанию: f(' + fmt(a - b) + ') = 1, значит a = ' + fmt(a) + '.' };
    },
    exp: function () {
      var a = pick([2, 3, 0.5]), b = rint(-3, 3);
      var f = function (x) { return Math.pow(a, x + b); };
      return { tpl: 'f(' + X + ') = ' + V('a') + '<sup>' + X + ' + ' + V('b') + '</sup>', keys: ['a', 'b'], ans: { a: a, b: b }, f: f, pts: intPoints(f, 3, [{ x: -b, y: 1 }]),
        how: 'Степень равна 1 при нулевом показателе: f(' + fmt(-b) + ') = 1, значит b = ' + fmt(b) + '. Шаг на 1 вправо умножает значение на a: f(' + fmt(1 - b) + ') = ' + fmt(a) + ', значит a = ' + fmt(a) + '.' };
    },
    root: function () {
      var k = pick([-2, -1, 1, 2, 3]), a = rint(-4, 3);
      var f = function (x) { return k * Math.sqrt(x + a); };
      return { tpl: 'f(' + X + ') = ' + V('k') + sqrtH(X + ' + ' + V('a')), keys: ['k', 'a'], ans: { k: k, a: a }, f: f, pts: intPoints(f, 3, [{ x: -a, y: 0 }, { x: 4 - a, y: 2 * k }]),
        how: 'График начинается в точке ' + pt(-a, 0) + ': x + a = 0, значит a = ' + fmt(a) + '. В точке x = ' + fmt(4 - a) + ' корень равен 2, а f = ' + fmt(2 * k) + ', значит k = ' + fmt(k) + '.' };
    }
  };
  var GUESS_SET = { oge: ['lin', 'quad', 'hyp0'], ege: ['hyp', 'log', 'exp', 'root', 'quad', 'lin'] };

  /* ================= Стили ================= */
  var CSS = [
    '.lb-gr-seg{flex-wrap:wrap;max-width:100%}',
    '.lb-gr-params{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px 16px}',
    '.lb-gr-params label{gap:2px}',
    '.lb-gr-params input[type=range]{width:100%}',
    '.lb-gr-pn{font:600 14px var(--f-mono);color:var(--text)}',
    '.lb-gr-pn output{color:var(--ink)}',
    '.lb-gr-formula{font:21px/1.5 "Cambria Math","Times New Roman",serif;color:var(--text);min-height:44px;display:flex;align-items:center;flex-wrap:wrap;gap:2px 6px;overflow-wrap:anywhere;padding:4px 10px;border-radius:8px;background:var(--sheet-2)}',
    '.lb-gr-formula sup{font-size:.68em}',
    '.lb-gr-formula sub{font-size:.68em}',
    '.lb-gr-fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;font-size:.86em;line-height:1.15;margin:0 3px}',
    '.lb-gr-fr>span:first-child{border-bottom:1.3px solid currentColor;padding:0 4px 1px}',
    '.lb-gr-fr>span:last-child{padding:1px 4px 0}',
    '.lb-gr-sq{white-space:nowrap}',
    '.lb-gr-sq>span{border-top:1.3px solid currentColor;padding:0 2px;margin-left:1px}',
    '.lb-gr-sw{display:inline-block;width:18px;height:3px;border-radius:2px;vertical-align:middle;margin-right:6px}',
    '.lb-gr-wrap{position:relative}',
    '.lb-gr-wrap canvas{cursor:crosshair}',
    '.lb-gr-wrap canvas.drag{cursor:grabbing}',
    '.lb-gr-hint{position:absolute;left:50%;top:10px;transform:translateX(-50%);background:var(--text);color:var(--sheet);font-size:13px;padding:5px 10px;border-radius:8px;pointer-events:none;max-width:90%;text-align:center}',
    '.lb-gr-tools{gap:8px}',
    '.lb-gr-tools .btn{min-width:38px}',
    '.lb-gr-pos{font:13px var(--f-mono);color:var(--muted);min-height:1.2em}',
    '.lb-gr-fx{display:grid;grid-template-columns:1fr;gap:10px}',
    '.lb-gr-fx input[type=text]{width:100%}',
    '.lb-gr-err{color:var(--red);font-size:13.5px;min-height:0}',
    '.lb-gr-pts{display:flex;flex-direction:column;gap:8px;font-size:14px}',
    '.lb-gr-pts b{font-weight:600;color:var(--text)}',
    '.lb-gr-pts .chip{font-family:var(--f-mono);font-weight:500}',
    '.lb-gr-plist{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}',
    '.lb-gr-task{font-size:15px;line-height:1.5;color:var(--text)}',
    '.lb-gr-ans{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end}',
    '.lb-gr-ans label{width:92px}',
    '.lb-gr-ans input{width:100%}',
    '.lb-gr-ans input.ok{border-color:var(--ok)!important}',
    '.lb-gr-ans input.bad{border-color:var(--red)!important}',
    '.lb-gr-res{font-size:14.5px;line-height:1.5}',
    '.lb-gr-res.ok{color:var(--ok)}',
    '.lb-gr-res.bad{color:var(--red)}',
    '.lb-gr-res .how{color:var(--text);display:block;margin-top:4px}',
    '.lb-gr-note code{font-family:var(--f-mono);font-size:.92em;background:var(--sheet-2);padding:0 4px;border-radius:4px;color:var(--text)}',
    '@media (max-width:520px){.lb-gr-formula{font-size:18px}.lb-gr-params{grid-template-columns:1fr 1fr}}'
  ].join('\n');
  function injectCSS() {
    if (document.getElementById('lab-graph-css')) return;
    var st = document.createElement('style');
    st.id = 'lab-graph-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ================= Монтирование ================= */
  function mount(el) {
    injectCSS();
    var famVals = {};
    FAM_ORDER.forEach(function (k) { var o = {}; FAM[k].params.forEach(function (p) { o[p.k] = p.v; }); famVals[k] = o; });
    var st = {
      mode: 'fam', fam: 'quad', pi: false,
      view: null, touched: false, W: 0, H: 0, dpr: 1,
      hover: null, fsrc: 'x^2 - 4|x| + 3', gsrc: '1', F: null, G: null,
      exam: 'oge', task: null, solved: 0, tries: 0, answered: false,
      rootsKey: '', roots: null
    };

    el.innerHTML =
      '<div class="lab-row"><div class="seg lb-gr-seg" role="group" aria-label="Режим">' +
        '<button type="button" data-mode="fam" class="on" aria-pressed="true">Семейства</button>' +
        '<button type="button" data-mode="custom" aria-pressed="false">Своя функция</button>' +
        '<button type="button" data-mode="guess" aria-pressed="false">Угадай параметры</button>' +
      '</div></div>' +
      '<div data-panel="fam">' +
        '<div class="lab-row" style="margin-bottom:10px"><label style="flex:1 1 220px">Семейство функций<select data-r="fam"></select></label></div>' +
        '<div class="lb-gr-params" data-r="params"></div>' +
      '</div>' +
      '<div data-panel="custom" hidden>' +
        '<div class="lb-gr-fx">' +
          '<label><span><span class="lb-gr-sw" data-sw="f"></span>f(x) =</span><input type="text" data-r="f" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" placeholder="например x^2 − 4|x| + 3"><span class="lb-gr-err" data-r="ferr" aria-live="polite"></span></label>' +
          '<label><span><span class="lb-gr-sw" data-sw="g"></span>g(x) = <span class="muted">(необязательно)</span></span><input type="text" data-r="g" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="например 1 или 2x − 1"><span class="lb-gr-err" data-r="gerr" aria-live="polite"></span></label>' +
        '</div>' +
        '<div class="lab-row" style="margin-top:10px"><label style="flex:1 1 220px">Примеры<select data-r="ex">' +
          '<option value="">— выберите —</option>' +
          '<option value="x^2 - 4|x| + 3|1">x² − 4|x| + 3 и y = 1 (ОГЭ 22)</option>' +
          '<option value="(x^2 - 1)/(x - 1)|">(x² − 1)/(x − 1) — выколотая точка</option>' +
          '<option value="1/x|x">гипербола 1/x и прямая y = x</option>' +
          '<option value="sqrt(x + 4)|x + 2">√(x + 4) и x + 2</option>' +
          '<option value="2^x|x + 2">2ˣ и x + 2</option>' +
          '<option value="log_2(x)|3 - x">log₂x и 3 − x</option>' +
          '<option value="sin x|0,5">sin x и y = 0,5</option>' +
          '<option value="tg x|">тангенс — разрывы</option>' +
          '<option value="|x - 1| + |x + 2||5">|x − 1| + |x + 2| и y = 5</option>' +
        '</select></label></div>' +
      '</div>' +
      '<div data-panel="guess" hidden>' +
        '<div class="lab-row"><div class="seg lb-gr-seg" role="group" aria-label="Экзамен"><button type="button" data-exam="oge" class="on" aria-pressed="true">ОГЭ, задание 11</button><button type="button" data-exam="ege" aria-pressed="false">ЕГЭ, задание 11</button></div>' +
        '<button type="button" class="btn sm" data-r="new">Новое задание</button></div>' +
        '<p class="lb-gr-task" data-r="task" style="margin-top:10px"></p>' +
      '</div>' +
      '<div class="lb-gr-formula" data-r="formula" aria-live="polite"></div>' +
      '<div class="lb-gr-wrap"><canvas tabindex="0" role="img" aria-label="График функции"></canvas><div class="lb-gr-hint" hidden></div></div>' +
      '<div class="lab-row lb-gr-tools">' +
        '<button type="button" class="btn sm" data-z="out" aria-label="Уменьшить масштаб">−</button>' +
        '<button type="button" class="btn sm" data-z="in" aria-label="Увеличить масштаб">+</button>' +
        '<button type="button" class="btn sm" data-z="reset">Сбросить вид</button>' +
        '<label class="inline"><input type="checkbox" data-r="pi"> деления оси x в долях π</label>' +
        '<span class="lb-gr-pos" data-r="pos"></span>' +
      '</div>' +
      '<div data-out="fam"><div class="readout" data-r="info"></div></div>' +
      '<div data-out="custom" hidden><div class="lb-gr-pts" data-r="pts"></div></div>' +
      '<div data-out="guess" hidden>' +
        '<div class="lb-gr-ans" data-r="ans"></div>' +
        '<div class="lab-row" style="margin-top:10px"><button type="button" class="btn sm primary" data-r="check">Проверить</button><button type="button" class="btn sm ghost" data-r="show">Показать решение</button><span class="score-row" data-r="score" style="justify-content:flex-start"></span></div>' +
        '<p class="lb-gr-res" data-r="res" aria-live="polite" style="margin-top:8px"></p>' +
      '</div>' +
      '<p class="lab-note lb-gr-note" data-r="note"></p>';

    function q(s) { return el.querySelector(s); }
    function R(n) { return el.querySelector('[data-r="' + n + '"]'); }
    var cv = q('canvas'), ctx = cv.getContext('2d'), wrap = q('.lb-gr-wrap'), hintEl = q('.lb-gr-hint');

    /* ---------- Вид ---------- */
    function defaultView() {
      var u = Math.min(st.W / 20, st.H / 14);
      return { cx: 0, cy: 0, u: Math.max(8, u) };
    }
    function resetView() { st.view = defaultView(); st.touched = false; schedule(); }
    function X2px(x) { return st.W / 2 + (x - st.view.cx) * st.view.u; }
    function Y2px(y) { return st.H / 2 - (y - st.view.cy) * st.view.u; }
    function px2X(px) { return st.view.cx + (px - st.W / 2) / st.view.u; }
    function px2Y(py) { return st.view.cy - (py - st.H / 2) / st.view.u; }
    function zoomAt(k, px, py) {
      var v = st.view, nu = Math.min(4000, Math.max(2, v.u * k));
      if (px == null) { px = st.W / 2; py = st.H / 2; }
      var wx = px2X(px), wy = px2Y(py);
      v.u = nu;
      v.cx = wx - (px - st.W / 2) / nu;
      v.cy = wy + (py - st.H / 2) / nu;
      st.touched = true;
      schedule();
    }

    /* ---------- Текущая сцена ---------- */
    function scene() {
      var cs = getComputedStyle(document.documentElement);
      var ink = cs.getPropertyValue('--ink').trim(), red = cs.getPropertyValue('--red').trim();
      var sc = { curves: [], lines: [], pts: [] };
      if (st.mode === 'fam') {
        var F = FAM[st.fam], p = famVals[st.fam];
        sc.curves.push({ f: F.f(p), color: ink, name: 'y' });
        var m = F.marks(p);
        m.lines.forEach(function (l) { sc.lines.push(l); });
        m.pts.forEach(function (q2) { if (isFinite(q2.x) && isFinite(q2.y)) sc.pts.push({ x: q2.x, y: q2.y, t: q2.t, color: ink }); });
      } else if (st.mode === 'custom') {
        if (st.F) sc.curves.push({ f: st.F, color: ink, name: 'f' });
        if (st.G) sc.curves.push({ f: st.G, color: red, name: 'g' });
        var rs = customRoots();
        if (rs) rs.all.forEach(function (q2) { sc.pts.push(q2); });
      } else if (st.task) {
        sc.curves.push({ f: st.task.f, color: ink, name: 'y' });
        st.task.pts.forEach(function (q2) { sc.pts.push({ x: q2.x, y: q2.y, t: 'точка графика', color: ink, solid: true }); });
      }
      return sc;
    }
    function customRoots() {
      if (!st.F && !st.G) return null;
      var xl = px2X(0), xr = px2X(st.W);
      var key = st.fsrc + '|' + st.gsrc + '|' + xl.toFixed(6) + '|' + xr.toFixed(6) + '|' + (!!st.F) + (!!st.G);
      if (key === st.rootsKey) return st.roots;
      var cs = getComputedStyle(document.documentElement);
      var ink = cs.getPropertyValue('--ink').trim(), red = cs.getPropertyValue('--red').trim(), ok = cs.getPropertyValue('--ok').trim();
      var r = { f0: [], g0: [], fg: [], all: [], many: {} };
      var F = st.F, G = st.G;
      function lim(list, name) { if (list.length > 40) { r.many[name] = true; return list.slice(0, 40); } return list; }
      if (F) {
        r.f0 = lim(findRoots(F, xl, xr), 'f0').map(function (x) { return { x: x, y: 0 }; });
        var y0 = F(0);
        if (isFinite(y0) && xl <= 0 && xr >= 0) r.fy = { x: 0, y: y0 };
      }
      if (G) r.g0 = lim(findRoots(G, xl, xr), 'g0').map(function (x) { return { x: x, y: 0 }; });
      if (F && G) {
        r.fg = lim(findRoots(function (x) { return F(x) - G(x); }, xl, xr), 'fg').map(function (x) { var a = F(x), b = G(x); return { x: x, y: isFinite(a) ? a : b }; });
      }
      r.f0.forEach(function (p) { r.all.push({ x: p.x, y: 0, t: 'нуль f', color: ink }); });
      r.g0.forEach(function (p) { r.all.push({ x: p.x, y: 0, t: 'нуль g', color: red }); });
      r.fg.forEach(function (p) { r.all.push({ x: p.x, y: p.y, t: 'пересечение f и g', color: ok, solid: true }); });
      if (r.fy) r.all.push({ x: 0, y: r.fy.y, t: 'f(0)', color: ink });
      st.rootsKey = key; st.roots = r;
      paintRoots(r, xl, xr);
      return r;
    }
    function paintRoots(r, xl, xr) {
      var box = R('pts');
      if (!box) return;
      var html = '<span class="muted">Точки ищутся на видимом участке x ∈ [' + fmt(xl, 2) + '; ' + fmt(xr, 2) + ']. Сдвиньте или уменьшите масштаб, чтобы искать дальше.</span>';
      function group(title, list, many, pr) {
        var s = '<div><b>' + title + '</b>: ';
        if (!list.length) s += '<span class="muted">нет на видимом участке</span>';
        else s += '<div class="lb-gr-plist">' + list.map(function (p) { return '<span class="chip">' + pr(p) + '</span>'; }).join('') + '</div>';
        if (many) s += '<span class="muted">Показаны первые 40 — точек очень много (возможно, графики совпадают на участке).</span>';
        return s + '</div>';
      }
      function px(p) { return 'x ' + eq(p.x); }
      if (st.F) html += group('Нули f(x)', r.f0, r.many.f0, px);
      if (st.G) html += group('Нули g(x)', r.g0, r.many.g0, px);
      if (st.F && st.G) html += group('Пересечения f и g', r.fg, r.many.fg, function (p) { return pt(p.x, p.y) + (isApprox(p.x, 3) || isApprox(p.y, 3) ? ' ≈' : ''); });
      if (r.fy) html += '<div><b>Пересечение f с осью Oy</b>: <span class="chip">' + pt(0, r.fy.y) + (isApprox(r.fy.y, 3) ? ' ≈' : '') + '</span></div>';
      if (st.F && st.G) html += '<div><b>Общих точек на экране</b>: ' + r.fg.length + '</div>';
      if (box.innerHTML !== html) box.innerHTML = html;
    }

    /* ---------- Рисование ---------- */
    function niceStep(v) {
      var p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p;
      return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
    }
    function steps() {
      var u = st.view.u, minor, major;
      if (u >= 12 && u <= 64) minor = 1; else minor = niceStep(16 / u);
      var mant = Math.round(minor / Math.pow(10, Math.floor(Math.log10(minor) + 1e-9)));
      var mults = mant === 1 ? [1, 2, 5, 10, 20, 50] : mant === 2 ? [1, 5, 10, 25, 50] : [1, 2, 10, 20, 100];
      major = minor * mults[mults.length - 1];
      for (var i = 0; i < mults.length; i++) if (minor * mults[i] * u >= 30) { major = minor * mults[i]; break; }
      return { minor: minor, major: major };
    }
    function piSteps() {
      var u = st.view.u, c = [1 / 6, 1 / 4, 1 / 3, 1 / 2, 1, 2, 4, 8, 16, 32], major = c[c.length - 1] * Math.PI;
      for (var i = 0; i < c.length; i++) if (c[i] * Math.PI * u >= 44) { major = c[i] * Math.PI; break; }
      return { major: major, minor: major / 2 };
    }
    function draw() {
      raf = 0;
      if (!st.W || !st.view) return;
      var W = st.W, H = st.H, dpr = st.dpr;
      var cs = getComputedStyle(document.documentElement);
      function cv_(n) { return cs.getPropertyValue(n).trim(); }
      var C = { sheet: cv_('--sheet'), text: cv_('--text'), muted: cv_('--muted'), line: cv_('--line'), grid: cv_('--grid-strong'), red: cv_('--red'), ink: cv_('--ink'), mono: cv_('--f-mono') || 'monospace' };
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.sheet; ctx.fillRect(0, 0, W, H);
      var xl = px2X(0), xr = px2X(W), yt = px2Y(0), yb = px2Y(H);
      var s = steps(), sx = st.pi ? piSteps() : s;
      /* сетка */
      function vlines(step, color, width) {
        ctx.beginPath();
        for (var k = Math.ceil(xl / step); k * step <= xr; k++) { var px = Math.round(X2px(k * step)) + 0.5; ctx.moveTo(px, 0); ctx.lineTo(px, H); }
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
      }
      function hlines(step, color, width) {
        ctx.beginPath();
        for (var k = Math.ceil(yb / step); k * step <= yt; k++) { var py = Math.round(Y2px(k * step)) + 0.5; ctx.moveTo(0, py); ctx.lineTo(W, py); }
        ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
      }
      ctx.globalAlpha = 0.75; vlines(sx.minor, C.grid, 1); hlines(s.minor, C.grid, 1);
      ctx.globalAlpha = 1; vlines(sx.major, C.line, 1); hlines(s.major, C.line, 1);
      /* оси */
      var ox = X2px(0), oy = Y2px(0);
      var axX = Math.min(Math.max(oy, 0), H), axY = Math.min(Math.max(ox, 0), W);
      ctx.strokeStyle = C.text; ctx.fillStyle = C.text; ctx.lineWidth = 1.4;
      if (oy >= 0 && oy <= H) {
        ctx.beginPath(); ctx.moveTo(0, Math.round(oy) + 0.5); ctx.lineTo(W, Math.round(oy) + 0.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(W, oy); ctx.lineTo(W - 9, oy - 4); ctx.lineTo(W - 9, oy + 4); ctx.closePath(); ctx.fill();
      }
      if (ox >= 0 && ox <= W) {
        ctx.beginPath(); ctx.moveTo(Math.round(ox) + 0.5, 0); ctx.lineTo(Math.round(ox) + 0.5, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox - 4, 9); ctx.lineTo(ox + 4, 9); ctx.closePath(); ctx.fill();
      }
      /* подписи делений */
      ctx.font = '11px ' + C.mono;
      ctx.lineJoin = 'round';
      function label(t, x, y, align, base) {
        ctx.textAlign = align; ctx.textBaseline = base;
        ctx.strokeStyle = C.sheet; ctx.lineWidth = 3; ctx.strokeText(t, x, y);
        ctx.fillStyle = C.muted; ctx.fillText(t, x, y);
      }
      var below = axX + 4 + 12 <= H, tx = [], k, i;
      for (k = Math.ceil(xl / sx.major); k * sx.major <= xr; k++) if (k !== 0) tx.push(k);
      var lw = 0;
      tx.forEach(function (kk) { lw = Math.max(lw, ctx.measureText(st.pi ? piFrac(kk * sx.major) : fmt(kk * sx.major, 6)).width); });
      var stride = Math.max(1, Math.ceil((lw + 8) / (sx.major * st.view.u)));
      for (i = 0; i < tx.length; i++) {
        if (tx[i] % stride) continue;
        var vx = tx[i] * sx.major, pxx = X2px(vx);
        if (pxx < 12 || pxx > W - 12) continue;
        label(st.pi ? piFrac(vx) : fmt(vx, 6), pxx, below ? axX + 4 : axX - 4, 'center', below ? 'top' : 'bottom');
      }
      var right = axY - 6 - 30 < 0;
      for (k = Math.ceil(yb / s.major); k * s.major <= yt; k++) {
        if (k === 0) continue;
        var vy = k * s.major, pyy = Y2px(vy);
        if (pyy < 10 || pyy > H - 10) continue;
        label(fmt(vy, 6), right ? axY + 6 : axY - 6, pyy, right ? 'left' : 'right', 'middle');
      }
      if (ox >= 0 && ox <= W && oy >= 0 && oy <= H) label('0', ox - 5, oy + 4, 'right', 'top');
      ctx.font = 'italic 15px "Times New Roman", serif';
      if (oy >= 0 && oy <= H) label('x', W - 6, oy - 7, 'right', 'bottom');
      if (ox >= 0 && ox <= W) label('y', ox + 8, 4, 'left', 'top');

      var sc = scene();
      /* вспомогательные линии */
      sc.lines.forEach(function (l) {
        ctx.save();
        ctx.setLineDash(l.kind === 'asym' ? [7, 5] : [3, 4]);
        ctx.strokeStyle = l.kind === 'asym' ? C.red : C.muted;
        ctx.lineWidth = l.kind === 'asym' ? 1.5 : 1.2;
        ctx.beginPath();
        if (l.x != null) { var px = X2px(l.x); ctx.moveTo(px, 0); ctx.lineTo(px, H); }
        else { var py = Y2px(l.y); ctx.moveTo(0, py); ctx.lineTo(W, py); }
        ctx.stroke();
        ctx.restore();
      });
      /* графики */
      sc.curves.forEach(function (c) { plot(c.f, c.color); });
      /* особые точки */
      sc.pts.forEach(function (p) {
        var px = X2px(p.x), py = Y2px(p.y);
        if (px < -5 || px > W + 5 || py < -5 || py > H + 5) return;
        ctx.beginPath(); ctx.arc(px, py, 4, 0, 2 * Math.PI);
        ctx.fillStyle = p.solid ? p.color : C.sheet; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = p.color; ctx.stroke();
      });
      /* наведение */
      var hv = st.hover ? traceAt(st.hover, sc) : null;
      var posEl = R('pos');
      if (hv) {
        var hx = X2px(hv.x), hy = Y2px(hv.y);
        ctx.save(); ctx.setLineDash([2, 3]); ctx.strokeStyle = C.muted; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx, Math.min(Math.max(oy, 0), H)); ctx.moveTo(hx, hy); ctx.lineTo(Math.min(Math.max(ox, 0), W), hy); ctx.stroke(); ctx.restore();
        ctx.beginPath(); ctx.arc(hx, hy, 5.5, 0, 2 * Math.PI); ctx.fillStyle = hv.color; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = C.sheet; ctx.stroke();
        var d = hv.snap ? 3 : 2, txt = pt(hv.x, hv.y, d);
        var head = hv.snap ? hv.t : (hv.name === 'y' ? '' : hv.name);
        ctx.font = '600 12.5px ' + C.mono;
        var tw = ctx.measureText(txt).width, hw = head ? ctx.measureText(head).width : 0;
        var bw = Math.max(tw, hw) + 14, bh = head ? 38 : 22;
        var bx = hx + 12, by = hy - bh - 10;
        if (bx + bw > W - 4) bx = hx - bw - 12;
        if (by < 4) by = hy + 12;
        ctx.fillStyle = C.sheet; ctx.strokeStyle = hv.color; ctx.lineWidth = 1.2;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 6); else ctx.rect(bx, by, bw, bh);
        ctx.fill(); ctx.stroke();
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        if (head) { ctx.fillStyle = C.muted; ctx.font = '11.5px ' + C.mono; ctx.fillText(head, bx + 7, by + 11); ctx.font = '600 12.5px ' + C.mono; }
        ctx.fillStyle = C.text; ctx.fillText(txt, bx + 7, by + bh - 11);
        posEl.textContent = (head ? head + ': ' : '') + 'x = ' + fmt(hv.x, d) + ', y = ' + fmt(hv.y, d);
      } else posEl.textContent = st.mode === 'guess' ? 'Наведите на отмеченную точку, чтобы увидеть её координаты' : 'Наведите на график или коснитесь его';
    }
    /* Построение с разрывами: адаптивное деление отрезков */
    function plot(f, color) {
      var W = st.W, H = st.H, pen = false, MAXD = 14;
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = color; ctx.lineWidth = 2.4; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      function fin(v) { return typeof v === 'number' && isFinite(v); }
      function cl(py) { return Math.max(-1e5, Math.min(1e5, py)); }
      function to(px, py) { if (pen) ctx.lineTo(px, cl(py)); else { ctx.moveTo(px, cl(py)); pen = true; } }
      function seg(x0, y0, x1, y1, d) {
        var f0 = fin(y0), f1 = fin(y1);
        if (!f0 && !f1) { pen = false; return; }
        var xm, ym;
        if (f0 && f1) {
          var p0 = Y2px(y0), p1 = Y2px(y1);
          if ((p0 < -H && p1 < -H) || (p0 > 2 * H && p1 > 2 * H)) { pen = false; return; }
          var dy = Math.abs(p1 - p0);
          if (dy <= 1.5 || d >= MAXD) {
            if (d >= MAXD && dy > 4) { pen = false; return; }
            if (!pen) to(X2px(x0), p0);
            to(X2px(x1), p1);
            return;
          }
        } else if (d >= 44) {
          pen = false; return;
        }
        xm = (x0 + x1) / 2; ym = f(xm);
        seg(x0, y0, xm, ym, d + 1);
        seg(xm, ym, x1, y1, d + 1);
      }
      var px0 = -2, xp = px2X(px0), yp = f(xp);
      for (var px = px0 + 1; px <= W + 2; px++) {
        var x = px2X(px), y = f(x);
        seg(xp, yp, x, y, 0);
        xp = x; yp = y;
      }
      ctx.stroke();
      ctx.restore();
    }
    function traceAt(h, sc) {
      var best = null, bd = Infinity;
      sc.pts.forEach(function (p) {
        var d = Math.hypot(X2px(p.x) - h.px, Y2px(p.y) - h.py);
        if (d < 11 && d < bd) { bd = d; best = { x: p.x, y: p.y, t: p.t, color: p.color, snap: true }; }
      });
      if (best || st.mode === 'guess') return best;
      var x = px2X(h.px);
      sc.curves.forEach(function (c) {
        var y = c.f(x);
        if (typeof y !== 'number' || !isFinite(y)) return;
        var d = Math.abs(Y2px(y) - h.py);
        if (d < bd) { bd = d; best = { x: x, y: y, color: c.color, name: c.name }; }
      });
      if (best && !h.touch && bd > 60) return null;
      return best;
    }
    var raf = 0;
    function schedule() { if (!raf) raf = requestAnimationFrame(draw); }

    /* ---------- Размер и тема ---------- */
    function resize() {
      var W = Math.round(wrap.clientWidth);
      if (!W) return;
      var H = Math.round(Math.max(260, Math.min(540, W * 0.66)));
      var dpr = window.devicePixelRatio || 1;
      if (W === st.W && H === st.H && dpr === st.dpr) return;
      var oldW = st.W;
      st.W = W; st.H = H; st.dpr = dpr;
      cv.style.height = H + 'px';
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      if (!st.view || !st.touched) st.view = defaultView();
      else if (oldW) st.view.u = Math.min(4000, Math.max(2, st.view.u * W / oldW));
      st.rootsKey = '';
      draw();
    }
    var ro = new ResizeObserver(function () {
      if (!el.isConnected && st.W) { cleanup(); return; }
      resize();
    });
    ro.observe(wrap);
    function onTheme() { if (!el.isConnected) { cleanup(); return; } st.rootsKey = ''; schedule(); }
    window.addEventListener('kl-theme', onTheme);
    function cleanup() {
      ro.disconnect();
      window.removeEventListener('kl-theme', onTheme);
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(hintT);
    }

    /* ---------- Указатель: сдвиг, щипок, наведение ---------- */
    var ptrs = {}, drag = null, hintT = 0;
    function rel(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    function ptrList() { return Object.keys(ptrs).map(function (k) { return ptrs[k]; }); }
    cv.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* не критично */ }
      var p = rel(e);
      ptrs[e.pointerId] = { x: p.x, y: p.y, sx: p.x, sy: p.y, type: e.pointerType };
      var list = ptrList();
      if (list.length === 1) drag = { mode: 'pan', cx: st.view.cx, cy: st.view.cy, x: p.x, y: p.y, moved: false };
      else if (list.length === 2) {
        var a = list[0], b = list[1];
        drag = { mode: 'pinch', d: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, u: st.view.u, wx: px2X((a.x + b.x) / 2), wy: px2Y((a.y + b.y) / 2), moved: true };
      }
    });
    cv.addEventListener('pointermove', function (e) {
      var p = rel(e);
      if (!ptrs[e.pointerId]) {
        if (e.pointerType === 'mouse') { st.hover = { px: p.x, py: p.y }; schedule(); }
        return;
      }
      ptrs[e.pointerId].x = p.x; ptrs[e.pointerId].y = p.y;
      var list = ptrList();
      if (drag && drag.mode === 'pan' && list.length === 1) {
        if (!drag.moved && Math.hypot(p.x - drag.x, p.y - drag.y) < 4) return;
        drag.moved = true; cv.classList.add('drag');
        st.view.cx = drag.cx - (p.x - drag.x) / st.view.u;
        st.view.cy = drag.cy + (p.y - drag.y) / st.view.u;
        st.touched = true;
        st.hover = e.pointerType === 'mouse' ? { px: p.x, py: p.y } : null;
        schedule();
      } else if (drag && drag.mode === 'pinch' && list.length >= 2) {
        var a = list[0], b = list[1];
        var d = Math.hypot(a.x - b.x, a.y - b.y) || 1, mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        var nu = Math.min(4000, Math.max(2, drag.u * d / drag.d));
        st.view.u = nu;
        st.view.cx = drag.wx - (mx - st.W / 2) / nu;
        st.view.cy = drag.wy + (my - st.H / 2) / nu;
        st.touched = true; st.hover = null;
        schedule();
      }
    });
    function endPtr(e) {
      var pr = ptrs[e.pointerId];
      if (!pr) return;
      delete ptrs[e.pointerId];
      cv.classList.remove('drag');
      if (drag && drag.mode === 'pan' && !drag.moved && e.type === 'pointerup') {
        st.hover = { px: pr.x, py: pr.y, touch: pr.type !== 'mouse' };
        schedule();
      }
      var list = ptrList();
      if (list.length === 1) drag = { mode: 'pan', cx: st.view.cx, cy: st.view.cy, x: list[0].x, y: list[0].y, moved: true };
      else if (!list.length) drag = null;
    }
    cv.addEventListener('pointerup', endPtr);
    cv.addEventListener('pointercancel', endPtr);
    cv.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !ptrs[e.pointerId]) { st.hover = null; schedule(); } });
    cv.addEventListener('wheel', function (e) {
      if (document.activeElement !== cv && !e.ctrlKey && !e.metaKey) {
        hintEl.textContent = 'Щёлкните по графику, чтобы масштабировать колесом мыши';
        hintEl.hidden = false;
        clearTimeout(hintT);
        hintT = setTimeout(function () { hintEl.hidden = true; }, 1600);
        return;
      }
      e.preventDefault();
      var p = rel(e), dy = e.deltaY * (e.deltaMode === 1 ? 30 : e.deltaMode === 2 ? 300 : 1);
      zoomAt(Math.exp(-dy * 0.0016), p.x, p.y);
    }, { passive: false });
    cv.addEventListener('keydown', function (e) {
      var step = 40 / st.view.u, used = true;
      if (e.key === 'ArrowLeft') st.view.cx -= step;
      else if (e.key === 'ArrowRight') st.view.cx += step;
      else if (e.key === 'ArrowUp') st.view.cy += step;
      else if (e.key === 'ArrowDown') st.view.cy -= step;
      else if (e.key === '+' || e.key === '=') { zoomAt(1.25); return e.preventDefault(); }
      else if (e.key === '-' || e.key === '_') { zoomAt(0.8); return e.preventDefault(); }
      else if (e.key === '0') { resetView(); return e.preventDefault(); }
      else used = false;
      if (used) { e.preventDefault(); st.touched = true; schedule(); }
    });
    cv.addEventListener('blur', function () { if (!Object.keys(ptrs).length) { st.hover = null; schedule(); } });
    el.querySelectorAll('[data-z]').forEach(function (b) {
      b.addEventListener('click', function () {
        var z = b.getAttribute('data-z');
        if (z === 'in') zoomAt(1.4); else if (z === 'out') zoomAt(1 / 1.4); else resetView();
      });
    });
    R('pi').addEventListener('change', function () { st.pi = R('pi').checked; schedule(); });

    /* ---------- Режим «Семейства» ---------- */
    var famSel = R('fam');
    famSel.innerHTML = FAM_ORDER.map(function (k) { return '<option value="' + k + '">' + esc(FAM[k].name) + '</option>'; }).join('');
    famSel.value = st.fam;
    function buildParams() {
      var F = FAM[st.fam], vals = famVals[st.fam];
      var box = R('params');
      box.innerHTML = F.params.map(function (p) {
        return '<label><span class="lb-gr-pn"><i style="font-family:serif;font-size:16px">' + p.k + '</i> = <output>' + (p.pi ? piFrac(vals[p.k] * Math.PI / 12) : fmt(vals[p.k], 2)) + '</output></span>' +
          '<input type="range" min="' + p.min + '" max="' + p.max + '" step="' + p.step + '" value="' + vals[p.k] + '" data-p="' + p.k + '" aria-label="Параметр ' + p.k + '"></label>';
      }).join('');
      box.querySelectorAll('input').forEach(function (inp) {
        var p = F.params.filter(function (x) { return x.k === inp.getAttribute('data-p'); })[0];
        function upd() {
          var v = rnd(parseFloat(inp.value), 4);
          vals[p.k] = v;
          var txt = p.pi ? piFrac(v * Math.PI / 12) : fmt(v, 2);
          inp.previousElementSibling.querySelector('output').textContent = txt;
          inp.setAttribute('aria-valuetext', p.k + ' = ' + txt);
          famChanged();
        }
        inp.addEventListener('input', upd);
        inp.setAttribute('aria-valuetext', p.k + ' = ' + (p.pi ? piFrac(vals[p.k] * Math.PI / 12) : fmt(vals[p.k], 2)));
      });
    }
    function famChanged() {
      var F = FAM[st.fam], p = famVals[st.fam];
      R('formula').innerHTML = '<span>' + V('y') + ' = ' + F.html(p) + '</span>';
      R('info').innerHTML = F.info(p).map(function (r) { return '<div><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span></div>'; }).join('');
      cv.setAttribute('aria-label', 'График функции y = ' + R('formula').textContent.replace(/^y = /, ''));
      schedule();
    }
    famSel.addEventListener('change', function () {
      st.fam = famSel.value;
      st.pi = !!FAM[st.fam].pi; R('pi').checked = st.pi;
      buildParams(); famChanged();
    });

    /* ---------- Режим «Своя функция» ---------- */
    var fIn = R('f'), gIn = R('g');
    fIn.value = st.fsrc; gIn.value = st.gsrc;
    function customChanged() {
      st.fsrc = fIn.value; st.gsrc = gIn.value;
      var a = fIn.value.trim() ? makeFn(fIn.value) : { error: 'Введите функцию, например x^2 − 4x + 3' };
      var b = gIn.value.trim() ? makeFn(gIn.value) : null;
      st.F = a.f || null; st.G = b && b.f ? b.f : null;
      R('ferr').textContent = a.error || '';
      R('gerr').textContent = b && b.error ? b.error : '';
      fIn.setAttribute('aria-invalid', a.error ? 'true' : 'false');
      gIn.setAttribute('aria-invalid', b && b.error ? 'true' : 'false');
      var cs = getComputedStyle(document.documentElement);
      q('[data-sw="f"]').style.background = cs.getPropertyValue('--ink');
      q('[data-sw="g"]').style.background = cs.getPropertyValue('--red');
      var leg = '';
      if (st.F) leg += '<span><span class="lb-gr-sw" style="background:var(--ink)"></span>' + V('y') + ' = ' + V('f') + '(' + X + ')</span>';
      if (st.G) leg += '<span style="margin-left:14px"><span class="lb-gr-sw" style="background:var(--red)"></span>' + V('y') + ' = ' + V('g') + '(' + X + ')</span>';
      R('formula').innerHTML = leg || '<span class="muted" style="font:14px var(--f-body)">Введите формулу функции</span>';
      cv.setAttribute('aria-label', 'График функций: f(x) = ' + fIn.value + (st.G ? ', g(x) = ' + gIn.value : ''));
      st.rootsKey = '';
      if (!st.F && !st.G) R('pts').innerHTML = '';
      schedule();
    }
    fIn.addEventListener('input', customChanged);
    gIn.addEventListener('input', customChanged);
    R('ex').addEventListener('change', function () {
      var v = R('ex').value;
      if (!v) return;
      var i = v.lastIndexOf('|');
      /* пример вида «a|b»: разделитель — последняя черта, модули внутри формулы не мешают */
      fIn.value = v.slice(0, i); gIn.value = v.slice(i + 1);
      st.pi = /sin|tg/.test(v); R('pi').checked = st.pi;
      R('ex').value = '';
      resetView();
      customChanged();
    });

    /* ---------- Режим «Угадай параметры» ---------- */
    function newTask() {
      var list = GUESS_SET[st.exam], kind, t, guard = 0;
      do {
        kind = pick(list); t = GUESS[kind]();
        guard++;
      } while ((t.pts.length < 2 || (st.task && st.task.kind === kind && JSON.stringify(st.task.ans) === JSON.stringify(t.ans))) && guard < 50);
      t.kind = kind;
      st.task = t; st.answered = false;
      var ex = st.exam === 'oge' ? 'y' : 'f(x)';
      R('task').innerHTML = 'На рисунке изображён график функции <span class="lb-gr-formula" style="display:inline-flex;min-height:0;padding:0 6px;font-size:18px;vertical-align:middle">' + t.tpl + '</span>. ' +
        'Найдите ' + t.keys.map(function (k) { return V(k); }).join(', ') + '. Отмеченные точки лежат в узлах сетки. <span class="muted">(' + ex.replace('f(x)', 'f') + ' — ' + (st.exam === 'oge' ? 'ОГЭ' : 'ЕГЭ') + ')</span>';
      R('ans').innerHTML = t.keys.map(function (k) {
        return '<label><span><i style="font-family:serif;font-size:16px">' + k + '</i> =</span><input type="text" inputmode="decimal" autocomplete="off" data-k="' + k + '" aria-label="Значение ' + k + '"></label>';
      }).join('');
      R('ans').querySelectorAll('input').forEach(function (inp) {
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); });
      });
      R('res').className = 'lb-gr-res'; R('res').innerHTML = '';
      R('formula').innerHTML = '<span>' + t.tpl + '</span>';
      cv.setAttribute('aria-label', 'График неизвестной функции вида ' + R('formula').textContent + '; отмечены точки ' + t.pts.map(function (p) { return pt(p.x, p.y); }).join(', '));
      st.hover = null;
      resetView();
      paintScore();
    }
    function paintScore() { R('score').innerHTML = '<span>Верно: <b>' + st.solved + '</b> из <b>' + st.tries + '</b></span>'; }
    function check() {
      var t = st.task; if (!t) return;
      var all = true, empty = false;
      R('ans').querySelectorAll('input').forEach(function (inp) {
        var k = inp.getAttribute('data-k'), v = parseNumber(inp.value);
        if (!inp.value.trim()) empty = true;
        var ok = v !== null && Math.abs(v - t.ans[k]) < 1e-6;
        inp.classList.toggle('ok', ok); inp.classList.toggle('bad', !ok);
        if (!ok) all = false;
      });
      var res = R('res');
      if (empty) { res.className = 'lb-gr-res bad'; res.textContent = 'Заполните все поля. Дроби можно писать как 0,5 или 1/2.'; return; }
      if (!st.answered) { st.tries++; if (all) st.solved++; }
      st.answered = true;
      paintScore();
      if (all) { res.className = 'lb-gr-res ok'; res.innerHTML = 'Верно! <span class="how">' + t.how + '</span>'; }
      else { res.className = 'lb-gr-res bad'; res.innerHTML = 'Есть ошибка. Подсказка: наведите курсор на отмеченные точки — их координаты целые — и подставьте их в формулу.'; }
    }
    R('check').addEventListener('click', check);
    R('show').addEventListener('click', function () {
      var t = st.task; if (!t) return;
      if (!st.answered) { st.tries++; st.answered = true; paintScore(); }
      R('ans').querySelectorAll('input').forEach(function (inp) { inp.value = fmt(t.ans[inp.getAttribute('data-k')], 3); inp.classList.remove('bad', 'ok'); });
      R('res').className = 'lb-gr-res'; R('res').innerHTML = '<span class="how">' + t.how + '</span>';
    });
    R('new').addEventListener('click', newTask);
    el.querySelectorAll('[data-exam]').forEach(function (b) {
      b.addEventListener('click', function () {
        st.exam = b.getAttribute('data-exam');
        el.querySelectorAll('[data-exam]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
        newTask();
      });
    });

    /* ---------- Переключение режимов ---------- */
    var NOTES = {
      fam: 'Двигайте ползунки и следите, как меняется график. Пунктиром показаны асимптоты (красным) и оси симметрии. Точки на графике — вершины, нули и пересечения с осями; наведите на них курсор. График можно двигать мышью или пальцем, масштаб — кнопками, колесом мыши (после щелчка по графику) или двумя пальцами.',
      custom: 'Как писать: <code>x^2</code> — степень, <code>2x</code> и <code>3(x+1)</code> — умножение без знака, <code>|x − 1|</code> — модуль, <code>sqrt(x)</code> или <code>√x</code> — корень, <code>sin x</code>, <code>cos</code>, <code>tg</code>, <code>ln x</code>, <code>log(x)</code> — десятичный логарифм, <code>log_2(x)</code> — по основанию 2, <code>exp(x)</code>, числа <code>pi</code> и <code>e</code>, дроби через запятую: <code>0,5</code>. Нули и точки пересечения ищутся на видимой части графика; в точках разрыва ложные корни отбрасываются.',
      guess: 'Как в задании 11: найдите на графике точки с целыми координатами (они отмечены), подставьте их в формулу и решите получившиеся уравнения. Ответ можно вводить десятичной дробью (0,5) или обыкновенной (1/2).'
    };
    function setMode(m) {
      st.mode = m; st.hover = null;
      el.querySelectorAll('[data-mode]').forEach(function (b) { var on = b.getAttribute('data-mode') === m; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      el.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== m; });
      el.querySelectorAll('[data-out]').forEach(function (p) { p.hidden = p.getAttribute('data-out') !== m; });
      R('note').innerHTML = NOTES[m];
      q('.lb-gr-tools label.inline').hidden = m === 'guess';
      if (m === 'fam') { st.pi = !!FAM[st.fam].pi; R('pi').checked = st.pi; famChanged(); }
      else if (m === 'custom') { st.pi = /sin|cos|tg|tan/.test(st.fsrc + st.gsrc); R('pi').checked = st.pi; customChanged(); }
      else { st.pi = false; R('pi').checked = false; if (!st.task) newTask(); else { R('formula').innerHTML = '<span>' + st.task.tpl + '</span>'; } }
      if (st.W) { if (m === 'guess') resetView(); schedule(); }
    }
    el.querySelectorAll('[data-mode]').forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); }); });

    buildParams();
    setMode('fam');
  }

  KL.labs.graph = {
    title: 'Графики функций',
    icon: 'f(x)',
    desc: 'Параметры семейств функций, свои графики с нулями и пересечениями, угадай формулу',
    long: 'Двигайте ползунки коэффициентов и смотрите, как меняются парабола, гипербола, корень, модуль, показательная, логарифмическая функции и синусоида. Постройте свои функции, найдите их нули и точки пересечения, потренируйтесь определять коэффициенты по графику, как в задании 11 ОГЭ и ЕГЭ.',
    subjectName: 'Математика',
    mount: mount,
    core: { parse: parse, makeFn: makeFn, parseNumber: parseNumber, findRoots: findRoots, fmt: fmt, piFrac: piFrac, rpow: rpow, FAM: FAM, GUESS: GUESS }
  };
})();
