/* Дополнительные иллюстрации: math. Формат — раздел «Иллюстрации» в NEXT_AGENT.md. */
(function () {
  'use strict';
  var KL = window.KL, V = KL.viz, F = V.figs, h = V.h;
  var svg = h.svg, L = h.L, T = h.T, C = h.C, P = h.P, poly = h.poly, A = h.A, arc = h.arc, plot = h.plot, timeline = h.timeline, box = h.box, sector = h.sector, bell = h.bell;

  /* F['имя'] = { cap: 'подпись', svg: function () { return svg(600, 240, ...); } };
     V.addMap('id-темы', { номер_раздела: ['имя'] }); */

  /* ---------- локальные помощники ---------- */
  function r1(n) { return Math.round(n * 10) / 10; }
  /* число по-русски: минус и десятичная запятая */
  function num(n) { return String(n).replace('-', '−').replace('.', ','); }
  /* координатные оси с разным шагом по x и y; возвращает {b, sx, sy} */
  function frame(o) {
    var W = o.w, H = o.h, l = o.l || 44, rt = o.r || 30, tp = o.t || 26, bt = o.b || 34;
    var sx = function (x) { return l + (x - o.x[0]) / (o.x[1] - o.x[0]) * (W - l - rt); };
    var sy = function (y) { return H - bt - (y - o.y[0]) / (o.y[1] - o.y[0]) * (H - tp - bt); };
    var b = '', v;
    if (o.gx) for (v = o.x[0]; v <= o.x[1] + 1e-9; v += o.gx) b += L(sx(v), sy(o.y[0]), sx(v), sy(o.y[1]), 'gr');
    if (o.gy) for (v = o.y[0]; v <= o.y[1] + 1e-9; v += o.gy) b += L(sx(o.x[0]), sy(v), sx(o.x[1]), sy(v), 'gr');
    b += A(sx(o.x[0]), sy(o.y[0]), sx(o.x[1]) + 16, sy(o.y[0]), 'ax', 8) + A(sx(o.x[0]), sy(o.y[0]), sx(o.x[0]), sy(o.y[1]) - 16, 'ax', 8);
    (o.xt || []).forEach(function (v) { b += T(sx(v), sy(o.y[0]) + 16, num(v), 'tn', 'middle'); });
    (o.yt || []).forEach(function (v) { b += T(sx(o.x[0]) - 6, sy(v) + 4, num(v), 'tn', 'end'); });
    var ax = o.axes || ['x', 'y'];
    b += T(sx(o.x[1]) + 16, sy(o.y[0]) - 8, ax[0], 't ti', 'end') + T(sx(o.x[0]) + 8, sy(o.y[1]) - 8, ax[1], 't ti');
    return { b: b, sx: sx, sy: sy };
  }
  /* числовая прямая: x0..x1 — пиксели, from..to — значения */
  function nline(o) {
    var sx = function (v) { return o.x0 + (v - o.from) / (o.to - o.from) * (o.x1 - o.x0); };
    var b = A(o.x0 - 12, o.y, o.x1 + 16, o.y, 'ax', 9);
    (o.ticks || []).forEach(function (v) { b += L(sx(v), o.y - 5, sx(v), o.y + 5, 'ax') + T(sx(v), o.y + 20, num(v), 'tn', 'middle'); });
    return { b: b, sx: sx };
  }
  function ptO(x, y, c) { return C(x, y, 6, (c || 'c2') + ' fs'); }   // выколотая точка
  function ptF(x, y, c) { return C(x, y, 6, c || 'p2'); }              // закрашенная точка
  function band(x1, x2, y, f) { return box(r1(Math.min(x1, x2)), y - 5, r1(Math.abs(x2 - x1)), 10, (f || 'f2') + ' k0', 2); }
  /* путь графика функции в пикселях */
  function fpath(f, from, to, sx, sy, c) {
    var d = '';
    for (var k = 0; k <= 200; k++) { var x = from + (to - from) * k / 200; d += (k ? 'L' : 'M') + r1(sx(x)) + ' ' + r1(sy(f(x))) + ' '; }
    return P(d, c);
  }
  function seg(a, b, c) { return L(a[0], a[1], b[0], b[1], c); }
  function unit(p, q) { var dx = q[0] - p[0], dy = q[1] - p[1], n = Math.sqrt(dx * dx + dy * dy); return [dx / n, dy / n]; }
  /* значок прямого угла в вершине p между лучами p→q1 и p→q2 */
  function rmark(p, q1, q2, k, c) {
    var u = unit(p, q1), v = unit(p, q2); k = k || 10;
    return P('M' + r1(p[0] + u[0] * k) + ' ' + r1(p[1] + u[1] * k) + ' L' + r1(p[0] + (u[0] + v[0]) * k) + ' ' + r1(p[1] + (u[1] + v[1]) * k) + ' L' + r1(p[0] + v[0] * k) + ' ' + r1(p[1] + v[1] * k), c || 'c5 thin');
  }
  /* угол направления p→q в градусах (ось y вверх) */
  function ang(p, q) { return Math.atan2(p[1] - q[1], q[0] - p[0]) * 180 / Math.PI; }
  function polar(p, rad, deg) { return [p[0] + rad * Math.cos(deg * Math.PI / 180), p[1] - rad * Math.sin(deg * Math.PI / 180)]; }
  /* дуга внутреннего угла q1-p-q2; возвращает {s: разметка, mid: биссектриса в градусах} */
  function angArc(p, q1, q2, rad, c) {
    var a1 = ang(p, q1), a2 = ang(p, q2), d = ((a2 - a1) % 360 + 360) % 360;
    if (d > 180) { a1 = a2; d = 360 - d; }
    return { s: arc(p[0], p[1], rad, a1, a1 + d, c || 'c2 thin'), mid: a1 + d / 2 };
  }
  /* дуга-стрелка над прямой от x1 к x2 с подписью */
  function hop(x1, x2, y, k, c, lbl, lc) {
    var mx = (x1 + x2) / 2, ux = x2 - mx, uy = k, n = Math.sqrt(ux * ux + uy * uy);
    return P('M' + r1(x1) + ' ' + y + ' Q' + r1(mx) + ' ' + (y - k) + ' ' + r1(x2) + ' ' + y, c) + A(x2 - ux / n * 10, y - uy / n * 10, x2, y, c, 8) +
      (lbl ? T(mx, y - k / 2 - 6, lbl, 't tb ' + (lc || ''), 'middle') : '');
  }
  /* куб в косоугольной проекции: p(x, y, z), x — вправо, y — вверх, z — вглубь */
  function cubeP(ox, oy, s, dx, dy) { return function (x, y, z) { return [ox + x * s + z * dx, oy - y * s + z * dy]; }; }
  function cubeEdges(p) {
    var A0 = p(0, 0, 0), B0 = p(1, 0, 0), C0 = p(1, 0, 1), D0 = p(0, 0, 1), A1 = p(0, 1, 0), B1 = p(1, 1, 0), C1 = p(1, 1, 1), D1 = p(0, 1, 1);
    return seg(A0, B0, 'c5 thin') + seg(B0, C0, 'c5 thin') + seg(A0, A1, 'c5 thin') + seg(B0, B1, 'c5 thin') + seg(C0, C1, 'c5 thin') + seg(A1, B1, 'c5 thin') +
      seg(B1, C1, 'c5 thin') + seg(C1, D1, 'c5 thin') + seg(D1, A1, 'c5 thin') + seg(A0, D0, 'c5 thin d') + seg(D0, C0, 'c5 thin d') + seg(D0, D1, 'c5 thin d');
  }
  function cubeLabels(p) {
    return [['A', 0, 0, 0, -8, 16, 'end'], ['B', 1, 0, 0, 6, 16], ['C', 1, 0, 1, 8, 6], ['D', 0, 0, 1, 6, -6], ['A₁', 0, 1, 0, -8, 4, 'end'], ['B₁', 1, 1, 0, 6, 16], ['C₁', 1, 1, 1, 6, -6], ['D₁', 0, 1, 1, -6, -6, 'end']]
      .map(function (q) { var v = p(q[1], q[2], q[3]); return T(v[0] + q[4], v[1] + q[5], q[0], 't tb', q[6]); }).join('');
  }
  /* прямоугольник с текстом по центру */
  function cell(x, y, w, hh, s, c, tc) { return box(x, y, w, hh, c, 4) + T(x + w / 2, y + hh / 2 + 5, s, tc || 't tb', 'middle'); }

  /* ================= Вычисления (math-calc) ================= */
  F['m-calc-bar'] = { cap: 'Полоска из 12 долей: 7/12 − 1/3 = 7/12 − 4/12 = 3/12 — это ровно четверть полоски, поэтому 1/4 · 3,2 = 0,8', svg: function () {
    var x0 = 170, w = 32;
    var row = function (y, fill, cuts, lbl, sub) {
      var s = '';
      for (var i = 0; i < 12; i++) s += box(x0 + i * w, y, w, 34, 'c5 thin ' + fill(i), 1);
      cuts.forEach(function (k) { s += L(x0 + k * w, y - 4, x0 + k * w, y + 38, 'c5 wide'); });
      return s + T(20, y + 15, lbl, 't tb') + T(20, y + 31, sub, 'ts');
    };
    var b = row(20, function (i) { return i < 7 ? 'f1' : 'fs'; }, [], '7/12', 'было');
    b += row(80, function (i) { return i < 4 ? 'f2' : (i < 7 ? 'f1' : 'fs'); }, [4, 8], '1/3 = 4/12', 'вычитаем');
    b += row(140, function (i) { return i < 3 ? 'f3' : 'fs'; }, [3, 6, 9], '3/12 = 1/4', 'осталось');
    b += T(x0 + 6 * w, 212, '1/4 · 3,2 = 3,2 : 4 = 0,8', 't tb ti', 'middle');
    return svg(600, 225, b, 'Вычитание дробей на полоске');
  } };
  F['m-calc-powers'] = { cap: 'Раскладываем основания на простые множители: 6⁵ = 2⁵ · 3⁵, одинаковые множители сокращаются, остаётся 2 · 2 = 2² = 4', svg: function () {
    var x0 = 30, st = 34, b = '', i;
    var tile = function (k, y, s, f, cut) {
      var x = x0 + k * st;
      return box(x, y, 30, 30, 'c5 thin ' + f, 4) + T(x + 15, y + 21, s, 't tb', 'middle') + (cut ? L(x + 3, y + 27, x + 27, y + 3, 'c2') : '');
    };
    for (i = 0; i < 12; i++) { var keep = i === 5 || i === 6; b += tile(i, 34, i < 7 ? '2' : '3', keep ? 'f3' : (i < 7 ? 'f1' : 'f4'), !keep); }
    b += L(x0 - 4, 80, x0 + 12 * st, 80, 'c5');
    for (i = 0; i < 12; i++) if (i < 5 || i > 6) b += tile(i, 92, i < 5 ? '2' : '3', i < 5 ? 'f1' : 'f4', true);
    b += T(x0, 24, 'числитель: 2⁷ · 3⁵', 'ts') + T(x0, 146, 'знаменатель: 6⁵ = (2 · 3)⁵ = 2⁵ · 3⁵', 'ts') + T(456, 86, '= 2 · 2 = 4', 't tb tg');
    return svg(600, 160, b, 'Сокращение степеней');
  } };
  F['m-calc-root-trap'] = { cap: '√(9 + 16) ≠ √9 + √16: гипотенуза √(3² + 4²) = 5 короче пути по катетам 3 + 4 = 7', svg: function () {
    var Cc = [60, 190], Bv = [60, 70], Av = [220, 190];
    var b = poly([Cc, Bv, Av], 'f1 k0') + seg(Cc, Bv, 'c2 wide') + seg(Cc, Av, 'c2 wide') + seg(Bv, Av, 'c1 wide') + rmark(Cc, Bv, Av, 14) +
      T(46, 136, '3', 't tb tr', 'end') + T(140, 212, '4', 't tb tr', 'middle') + T(150, 122, '5', 't tb ti') +
      T(290, 70, '√(9 + 16) = √25 = 5', 't tb ti') + T(290, 100, '√9 + √16 = 3 + 4 = 7', 't tb tr') + T(290, 136, '√(a + b) ≠ √a + √b', 't tb') + T(290, 160, 'корень из суммы не равен сумме корней', 'ts');
    return svg(600, 225, b, 'Корень из суммы');
  } };
  F['m-calc-sqrt-line'] = { cap: '49 &lt; 58 &lt; 64, значит 7 &lt; √58 &lt; 8: зажимаем подкоренное число между соседними точными квадратами', svg: function () {
    var n = nline({ x0: 60, x1: 540, y: 110, from: 6, to: 9, ticks: [6, 7, 8, 9] }), sx = n.sx, b = n.b, q = Math.sqrt(58);
    [6, 7, 8, 9].forEach(function (v) { b += T(sx(v), 74, v * v, 't tb', 'middle') + L(sx(v), 80, sx(v), 102, 'gr'); });
    b += T(20, 78, 'x²', 't ti') + T(20, 134, 'x', 't ti') +
      P('M' + r1(sx(7)) + ' 52 V44 H' + r1(sx(8)) + ' V52', 'c5 thin') + T((sx(7) + sx(8)) / 2, 36, '49 &lt; 58 &lt; 64', 'ts', 'middle') +
      T(sx(q), 74, '58', 't tb tr', 'middle') + L(sx(q), 80, sx(q), 102, 'c2 thin d') + ptF(sx(q), 110) + T(sx(q), 138, '√58 ≈ 7,6', 't tb tr', 'middle') +
      T(300, 166, '7 &lt; √58 &lt; 8', 't tb', 'middle');
    return svg(600, 178, b, 'Корень на числовой прямой');
  } };

  /* ================= Текстовые задачи (math-word) ================= */
  F['m-word-motion'] = { cap: 'Навстречу скорости складываются, вдогонку вычитаются; по течению к собственной скорости прибавляется скорость реки, против течения — вычитается', svg: function () {
    var b = T(20, 26, 'навстречу', 't tb') + C(40, 56, 8, 'p1') + A(50, 56, 150, 56, 'c1') + T(100, 46, 'v₁', 't tb ti', 'middle') +
      C(370, 56, 8, 'p2') + A(360, 56, 260, 56, 'c2') + T(310, 46, 'v₂', 't tb tr', 'middle') +
      T(410, 50, 'скорость сближения', 'ts') + T(410, 70, 'v₁ + v₂', 't tb');
    b += T(20, 106, 'вдогонку', 't tb') + C(40, 136, 8, 'p1') + A(50, 136, 190, 136, 'c1') + T(120, 126, 'v₁', 't tb ti', 'middle') +
      C(250, 136, 8, 'p2') + A(260, 136, 320, 136, 'c2') + T(290, 126, 'v₂', 't tb tr', 'middle') +
      T(410, 130, 'скорость сближения', 'ts') + T(410, 150, 'v₁ − v₂', 't tb');
    b += T(20, 182, 'по реке', 't tb') + box(30, 204, 340, 36, 'f1 k0', 4) +
      A(60, 214, 180, 214, 'c3', 9) + A(340, 214, 220, 214, 'c2', 9) +
      A(80, 232, 120, 232, 'c1 thin', 7) + A(180, 232, 220, 232, 'c1 thin', 7) + A(280, 232, 320, 232, 'c1 thin', 7) + T(200, 198, 'течение u →', 'ts', 'middle') +
      T(410, 206, 'по течению: v + u', 't tb tg') + T(410, 230, 'против течения: v − u', 't tb tr');
    return svg(600, 250, b, 'Задачи на движение');
  } };
  F['m-word-work'] = { cap: 'Бассейн — 12 долей. Первая труба наполняет 1/6 = 2 доли в час, вторая — 1/12 = 1 долю; вместе 3 доли в час, весь бассейн — за 4 часа', svg: function () {
    var x0 = 60, w = 40, y = 70, b = '', i;
    for (i = 0; i < 12; i++) b += box(x0 + i * w, y, w, 44, 'c5 thin ' + (i % 3 < 2 ? 'f1' : 'f4'), 1);
    for (i = 0; i <= 4; i++) b += L(x0 + i * 3 * w, y - 8, x0 + i * 3 * w, y + 52, 'c5 wide');
    for (i = 0; i < 4; i++) { var xa = x0 + i * 3 * w; b += P('M' + (xa + 4) + ' ' + (y + 60) + ' V' + (y + 66) + ' H' + (xa + 3 * w - 4) + ' V' + (y + 60), 'c5 thin') + T(xa + 1.5 * w, y + 84, (i + 1) + '-й час', 'ts', 'middle'); }
    b += box(60, 20, 18, 18, 'c5 thin f1', 3) + T(86, 34, 'труба 1: 1/6 = 2/12 бассейна в час', 'ts') + box(340, 20, 18, 18, 'c5 thin f4', 3) + T(366, 34, 'труба 2: 1/12 в час', 'ts');
    b += T(300, 196, '1/6 + 1/12 = 3/12 = 1/4 бассейна в час → весь за 4 часа', 't tb ti', 'middle');
    return svg(600, 210, b, 'Совместная работа');
  } };
  F['m-word-mix'] = { cap: 'При смешивании складываются массы соли, а не проценты: 0,2 + 0,6 = 0,8 кг соли на 5 кг раствора — это 16%', svg: function () {
    var base = 190, k = 30, b = '';
    var jar = function (x, m, c, salt, top, lbl2) {
      var hh = m * k, sh = salt / m * hh;
      return box(x, base - hh, 100, hh, 'c5 thin fs', 3) + box(x, base - sh, 100, sh, 'c2 thin f2', 1) + T(x + 50, base - hh - 8, top, 't tb', 'middle') +
        T(x + 50, base + 20, 'раствор ' + num(m) + ' кг', 'ts', 'middle') + T(x + 50, base + 38, lbl2, 'ts tr', 'middle');
    };
    b += jar(30, 2, 'f', 0.2, '10%', 'соли 0,2 кг') + T(165, 160, '+', 't tb', 'middle') + jar(200, 3, 'f', 0.6, '20%', 'соли 0,6 кг') + T(355, 160, '=', 't tb', 'middle') +
      jar(410, 5, 'f', 0.8, '0,8 : 5 = 0,16 = 16%', 'соли 0,8 кг');
    return svg(600, 240, b, 'Смешивание растворов');
  } };

  /* ================= Проценты (math-percent) ================= */
  F['m-pct-proportion'] = { cap: 'За 100% берут то, с чем сравнивают: 10 руб. — это 25% от 40 руб., но только 20% от 50 руб.', svg: function () {
    var b = T(40, 30, 'было 40, стало 50: на сколько процентов выросла цена? 100% — это 40', 'ts') +
      box(40, 40, 320, 36, 'c1 f1', 2) + box(360, 40, 80, 36, 'c2 f2', 2) + T(200, 63, '40 руб. = 100%', 't tb', 'middle') + T(400, 63, '10 = 25%', 't tb tr', 'middle') +
      T(456, 55, 'цена выросла', 'ts') + T(456, 71, 'на 25%', 't tb tr');
    b += T(40, 110, 'на сколько процентов 40 меньше 50? 100% — это 50', 'ts') +
      box(40, 120, 400, 36, 'c1 f1', 2) + box(360, 120, 80, 36, 'c2 f2', 2) + T(200, 143, '50 руб. = 100%', 't tb', 'middle') + T(400, 143, '10 = 20%', 't tb tr', 'middle') +
      T(456, 135, '40 меньше 50', 'ts') + T(456, 151, 'на 20%', 't tb tr');
    b += T(300, 190, 'часть : целое = p : 100', 't tb ti', 'middle');
    return svg(600, 205, b, 'Процент от разных величин');
  } };
  F['m-pct-chain'] = { cap: '+20%, затем −20%: 100 → 120 → 96. Множители перемножаются: 1,2 · 0,8 = 0,96 — цена упала на 4%', svg: function () {
    var vals = [100, 120, 96], xs = [70, 260, 450], fills = ['f1', 'f3', 'f2'], b = L(40, 200, 560, 200, 'ax') + L(40, 70, 560, 70, 'c5 thin d') + T(560, 62, '100', 'tn', 'end');
    vals.forEach(function (v, i) { var hh = v * 1.3; b += box(xs[i], 200 - hh, 80, hh, 'c5 thin ' + fills[i], 3) + T(xs[i] + 40, 200 - hh + 22, v + ' руб.', 't tb', 'middle'); });
    b += A(156, 130, 252, 130, 'c3', 9) + T(204, 120, '× 1,2', 't tb tg', 'middle') + T(204, 150, '+20%', 'ts', 'middle') +
      A(346, 130, 442, 130, 'c2', 9) + T(394, 120, '× 0,8', 't tb tr', 'middle') + T(394, 150, '−20% от 120', 'ts', 'middle') +
      T(300, 226, 'итог: × 1,2 · 0,8 = × 0,96, то есть −4%', 't tb', 'middle');
    return svg(600, 240, b, 'Цепочка процентов');
  } };
  F['m-pct-compound'] = { cap: 'Вклад 100 под 10%: простые проценты добавляют по 10 каждый год (прямая), сложные умножают на 1,1 (геометрическая прогрессия) — через 5 лет 150 против 161,05', svg: function () {
    var fr = frame({ w: 560, h: 270, x: [0, 5.5], y: [90, 170], l: 50, r: 40, gx: 1, gy: 10, xt: [0, 1, 2, 3, 4, 5], yt: [90, 100, 110, 120, 130, 140, 150, 160], axes: ['n, лет', 'S'] });
    var sx = fr.sx, sy = fr.sy, b = fr.b, d1 = '', d2 = '', n;
    for (n = 0; n <= 5; n++) { d1 += (n ? 'L' : 'M') + r1(sx(n)) + ' ' + r1(sy(100 + 10 * n)) + ' '; d2 += (n ? 'L' : 'M') + r1(sx(n)) + ' ' + r1(sy(100 * Math.pow(1.1, n))) + ' '; }
    b += P(d1, 'c1') + P(d2, 'c2');
    for (n = 0; n <= 5; n++) b += C(sx(n), sy(100 + 10 * n), 4, 'p1') + C(sx(n), sy(100 * Math.pow(1.1, n)), 4, 'p2');
    b += T(sx(5) + 8, sy(161.05) + 4, '161,05', 't tb tr') + T(sx(5) + 8, sy(150) + 8, '150', 't tb ti') +
      T(sx(0.2), sy(164), 'сложные: 100 · 1,1ⁿ', 't tb tr') + T(sx(0.2), sy(154), 'простые: 100 + 10n', 't tb ti');
    return svg(560, 270, b, 'Простые и сложные проценты');
  } };
  F['m-pct-credit'] = { cap: 'Кредит под 10%: каждый год сначала долг умножают на 1,1, затем вычитают платёж x; после последнего платежа долг равен нулю', svg: function () {
    var step = function (x1, x2, y, s, c, tc, sub) { return A(x1, y + 20, x2, y + 20, c, 9) + T((x1 + x2) / 2, y + 12, s, 't tb ' + tc, 'middle') + T((x1 + x2) / 2, y + 38, sub, 'ts', 'middle'); };
    var b = T(20, 30, '1-й год', 't tb') +
      cell(20, 40, 100, 40, 'S', 'c5 thin fs') + step(122, 198, 40, '× 1,1', 'c3', 'tg', 'проценты') + cell(200, 40, 130, 40, '1,1S', 'c5 thin fs') +
      step(332, 408, 40, '− x', 'c2', 'tr', 'платёж') + cell(410, 40, 170, 40, '1,1S − x', 'c5 thin fs');
    b += P('M495 82 V102 H70 V110', 'c5 thin d') + A(70, 108, 70, 128, 'c5 thin', 7) + T(90, 122, '2-й год', 't tb');
    b += cell(20, 130, 100, 40, '1,1S − x', 'c5 thin fs') + step(122, 198, 130, '× 1,1', 'c3', 'tg', 'проценты') + cell(200, 130, 130, 40, '1,21S − 1,1x', 'c5 thin fs') +
      step(332, 408, 130, '− x', 'c2', 'tr', 'платёж') + cell(410, 130, 170, 40, '1,21S − 2,1x = 0', 'c3 f3');
    b += T(300, 210, 'долг погашен: 1,21S = 2,1x, откуда x = 1,21S / 2,1', 't tb ti', 'middle');
    return svg(600, 222, b, 'Схема погашения кредита');
  } };

  /* ================= Прогрессии (math-progressions) ================= */
  F['m-prog-arith'] = { cap: 'Арифметическая прогрессия aₙ = 4 + 2(n − 1): каждый шаг +2, поэтому точки (n; aₙ) лежат на одной прямой', svg: function () {
    var fr = frame({ w: 520, h: 290, x: [0, 7], y: [0, 16], gx: 1, gy: 2, xt: [1, 2, 3, 4, 5, 6], yt: [2, 4, 6, 8, 10, 12, 14, 16], axes: ['n', 'aₙ'] });
    var sx = fr.sx, sy = fr.sy, b = fr.b + L(sx(0.5), sy(3), sx(6.5), sy(15), 'c5 thin d');
    for (var n = 1; n <= 6; n++) {
      var a = 2 * n + 2;
      if (n < 6) b += L(sx(n), sy(a), sx(n + 1), sy(a), 'c3 thin') + L(sx(n + 1), sy(a), sx(n + 1), sy(a + 2), 'c2') + T(sx(n + 1) + 5, sy(a + 1) + 4, '+2', 'ts tr');
      b += C(sx(n), sy(a), 5, 'p1') + T(sx(n) - 8, sy(a) - 8, a, 't tb ti', 'end');
    }
    b += T(sx(0.3), sy(15), 'aₙ = 4 + 2(n − 1)', 't tb');
    return svg(520, 290, b, 'Арифметическая прогрессия на графике');
  } };
  F['m-prog-gauss'] = { cap: 'Приём Гаусса: две одинаковые «лесенки» 4, 6, …, 22 складываются в прямоугольник 10 × 26, поэтому S₁₀ = 26 · 10 / 2 = 130', svg: function () {
    var x0 = 50, w = 36, u = 6, base = 210, b = '';
    for (var n = 1; n <= 10; n++) {
      var a = 2 * n + 2, x = x0 + (n - 1) * w;
      b += box(x, base - a * u, w, a * u, 'c5 thin f1', 1) + box(x, base - 26 * u, w, (26 - a) * u, 'c5 thin f2', 1) +
        T(x + w / 2, base + 16, a, 'tn', 'middle') + T(x + w / 2, base - 26 * u - 8, 26 - a, 'tn', 'middle');
    }
    b += T(x0 - 6, base + 16, 'aₙ', 'ts ti', 'end') + T(430, 80, 'в каждом столбике', 'ts') + T(430, 100, '4 + 22 = 6 + 20 = … = 26', 'ts') +
      T(430, 136, '2S = 26 · 10 = 260', 't tb') + T(430, 164, 'S₁₀ = 130', 't tb tg') + T(430, 196, 'синие — прогрессия,', 'ts') + T(430, 212, 'красные — она же наоборот', 'ts');
    return svg(600, 232, b, 'Сумма арифметической прогрессии');
  } };
  F['m-prog-geom'] = { cap: 'Геометрическая прогрессия 2; 6; 18; 54; 162: каждый член в 3 раза больше предыдущего. От b₂ до b₅ три шага, поэтому q³ = 162 : 6 = 27', svg: function () {
    var vals = [2, 6, 18, 54, 162], b = '';
    vals.forEach(function (v, i) {
      var x = 30 + i * 112;
      b += cell(x, 60, 80, 40, v, 'c1 ' + (i === 1 || i === 4 ? 'f2' : 'f1')) + T(x + 40, 50, 'b' + ['₁', '₂', '₃', '₄', '₅'][i], 't tb ti', 'middle');
      if (i < 4) b += A(x + 82, 80, x + 110, 80, 'c3', 8) + T(x + 96, 72, '×3', 'ts tg', 'middle');
    });
    b += P('M182 108 V120 H518 V108', 'c2 thin') + T(350, 142, 'три шага: q³ = 162 : 6 = 27', 't tb tr', 'middle') + T(350, 166, 'q = 3, b₁ = 6 : 3 = 2', 't tb', 'middle');
    return svg(600, 180, b, 'Геометрическая прогрессия');
  } };
  F['m-prog-compare'] = { cap: 'Одинаковые разности соседних членов — арифметическая прогрессия (+3), одинаковые отношения — геометрическая (×2)', svg: function () {
    var row = function (y, vals, lbl, c, lc, t1, t2) {
      var s = '';
      vals.forEach(function (v, i) { s += cell(40 + i * 100, y, 60, 36, v, 'c5 thin fs'); if (i < 3) s += hop(78 + i * 100, 162 + i * 100, y - 2, 34, c, lbl, lc); });
      return s + T(430, y + 12, t1, 'ts') + T(430, y + 32, t2, 't tb ' + lc);
    };
    var b = row(60, [2, 5, 8, 11], '+3', 'c3', 'tg', 'разности равны', 'арифметическая, d = 3') + row(150, [3, 6, 12, 24], '×2', 'c2', 'tr', 'отношения равны', 'геометрическая, q = 2');
    return svg(600, 200, b, 'Как распознать прогрессию');
  } };
  F['m-prog-multiples'] = { cap: 'Двузначные числа, кратные 7: от 14 до 98 с шагом 7. Промежутков (98 − 14) : 7 = 12, а чисел на одно больше — 13', svg: function () {
    var sx = function (v) { return 40 + (v - 10) * 5.6; }, b = A(30, 100, 566, 100, 'ax', 9) + T(40, 40, 'двузначные числа, кратные 7', 'ts');
    for (var k = 0; k < 13; k++) { var v = 14 + 7 * k; b += C(sx(v), 100, 5, 'p1') + T(sx(v), 122, v, 'tn', 'middle') + T(sx(v), 84, k + 1, 'ts tr', 'middle'); }
    b += P('M' + r1(sx(14)) + ' 132 V140 H' + r1(sx(98)) + ' V132', 'c5 thin') + T(300, 160, 'чисел (98 − 14) : 7 + 1 = 13 — считаем оба конца', 't tb', 'middle');
    return svg(600, 172, b, 'Числа, кратные 7');
  } };

  /* ================= Неравенства (math-inequalities) ================= */
  F['m-ineq-linear'] = { cap: 'При делении на отрицательное число знак неравенства меняется. Нестрогий знак — точка закрашена и скобка квадратная, строгий — точка выколота и скобка круглая', svg: function () {
    var n1 = nline({ x0: 60, x1: 520, y: 74, from: -8, to: 2, ticks: [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2] }), b = n1.b;
    b += T(20, 24, '3x − 7 ≥ 5x + 1  ⇒  −2x ≥ 8  ⇒  x ≤ −4', 't tb') + T(20, 44, 'делим на −2 — знак ≥ меняется на ≤', 'ts') + T(580, 24, '(−∞; −4]', 't tb tr', 'end') +
      band(48, n1.sx(-4), 74) + ptF(n1.sx(-4), 74);
    var n2 = nline({ x0: 60, x1: 520, y: 178, from: -2, to: 6, ticks: [-2, -1, 0, 1, 2, 3, 4, 5, 6] });
    b += n2.b + T(20, 128, 'x &gt; 1', 't tb') + T(20, 148, 'строгий знак: точка выколота', 'ts') + T(580, 128, '(1; +∞)', 't tb tr', 'end') +
      band(n2.sx(1), 536, 178) + ptO(n2.sx(1), 178);
    return svg(600, 210, b, 'Линейные неравенства');
  } };
  F['m-ineq-parab'] = { cap: 'x² − x − 6 &lt; 0: парабола с ветвями вверх лежит ниже оси Ox между корнями −2 и 3 — ответ (−2; 3)', svg: function () {
    var f = function (x) { return x * x - x - 6; };
    return plot({ x: [-4, 5], y: [-7, 7], w: 440, h: 330, tick: 2, label: 'Квадратное неравенство', fns: [{ f: f, c: 'c1', label: [3.6, 6.2, 'y = x² − x − 6', 'end'] }],
      extra: function (sx, sy) {
        return fpath(f, -2, 3, sx, sy, 'c2 wide') + band(sx(-2), sx(3), sy(0)) + ptO(sx(-2), sy(0)) + ptO(sx(3), sy(0)) +
          T(sx(3) + 2, sy(0) + 16, '3', 'tn tb') + T(sx(2.3), sy(-4.9), 'y &lt; 0', 't tb tr') + T(sx(2.3), sy(-5.7), 'при −2 &lt; x &lt; 3', 't tb tr');
      } });
  } };
  F['m-ineq-frac'] = { cap: '(x − 1)(x − 3) / (x − 2) &lt; 0: нули 1, 2, 3 выколоты, справа знак «+», дальше знаки чередуются — ответ (−∞; 1) ∪ (2; 3)', svg: function () {
    var sx = function (v) { return 60 + (v + 0.5) * 96; }, y = 100;
    var b = A(40, y, 566, y, 'ax', 9) + T(562, y + 22, 'x', 't ti') + T(300, 24, '(x − 1)(x − 3) / (x − 2) &lt; 0', 't tb', 'middle') +
      band(44, sx(1), y) + band(sx(2), sx(3), y);
    var iv = [[50, sx(1), '−'], [sx(1), sx(2), '+'], [sx(2), sx(3), '−'], [sx(3), 550, '+']];
    iv.forEach(function (q) {
      var m = (q[0] + q[1]) / 2, plus = q[2] === '+';
      b += P('M' + r1(q[0]) + ' ' + y + ' Q' + r1(m) + ' ' + (y - 56) + ' ' + r1(q[1]) + ' ' + y, (plus ? 'c3' : 'c2') + ' thin') + T(m, y - 34, q[2], 't tb ' + (plus ? 'tg' : 'tr'), 'middle');
    });
    [1, 2, 3].forEach(function (v) { b += ptO(sx(v), y) + T(sx(v), y + 24, v, 't tb', 'middle'); });
    b += T(sx(2), y + 42, 'нуль знаменателя', 'ts', 'middle') + T(300, 172, 'ответ: (−∞; 1) ∪ (2; 3)', 't tb tr', 'middle');
    return svg(600, 185, b, 'Метод интервалов для дроби');
  } };
  F['m-ineq-system'] = { cap: 'Система: каждое неравенство на своей строке, ответ — общая часть: (2; 4]. Точка 2 выколота, потому что в первом неравенстве знак строгий', svg: function () {
    var sx = function (v) { return 180 + v * 60; }, b = L(sx(2), 28, sx(2), 176, 'c5 thin d') + L(sx(4), 28, sx(4), 176, 'c5 thin d');
    var row = function (y, t1, t2) { return A(172, y, 572, y, 'ax', 8) + T(20, y - 4, t1, 't tb') + T(20, y + 14, t2, 'ts'); };
    b += row(50, '2x − 1 &gt; 3', 'x &gt; 2') + band(sx(2), 568, 50, 'f1') + ptO(sx(2), 50, 'c1');
    b += row(105, 'x² − 6x + 8 ≤ 0', '2 ≤ x ≤ 4') + band(sx(2), sx(4), 105, 'f3') + ptF(sx(2), 105, 'p3') + ptF(sx(4), 105, 'p3');
    b += row(160, 'система', 'обе строки') + band(sx(2), sx(4), 160, 'f2') + ptO(sx(2), 160) + ptF(sx(4), 160);
    b += T(sx(2), 192, '2', 't tb', 'middle') + T(sx(4), 192, '4', 't tb', 'middle') + T(300, 214, 'ответ: (2; 4]', 't tb tr', 'middle');
    return svg(600, 225, b, 'Система неравенств');
  } };

  /* ================= Модуль (math-modulus) ================= */
  F['m-mod-distance'] = { cap: '|x − 3| = 5: ищем точки на расстоянии 5 от числа 3 — это −2 и 8', svg: function () {
    var ticks = [], v;
    for (v = -4; v <= 10; v++) ticks.push(v);
    var n = nline({ x0: 40, x1: 560, y: 110, from: -4, to: 10, ticks: ticks }), sx = n.sx;
    var b = n.b + T(300, 24, '|x − 3| — расстояние от точки x до точки 3', 't tb', 'middle') +
      hop(sx(3), sx(8), 102, 70, 'c2', '5', 'tr') + hop(sx(3), sx(-2), 102, 70, 'c2', '5', 'tr') +
      C(sx(3), 110, 6, 'p5') + ptF(sx(-2), 110) + ptF(sx(8), 110) +
      T(300, 160, 'x = 3 − 5 = −2  или  x = 3 + 5 = 8', 't tb tr', 'middle');
    return svg(600, 172, b, 'Модуль как расстояние');
  } };
  F['m-mod-check'] = { cap: '|x − 1| = 2x − 5: прямая пересекает «галочку» y = |x − 1| только при x = 4. Корень x = 2 — пересечение с продолжением луча y = 1 − x, он посторонний', svg: function () {
    return plot({ x: [-2, 6], y: [-3, 6], w: 420, h: 330, label: 'Уравнение с модулем', fns: [
      { f: function (x) { return Math.abs(x - 1); }, c: 'c1', label: [-1.6, 3.2, 'y = |x − 1|', 'start'] },
      { f: function (x) { return 2 * x - 5; }, c: 'c2', label: [4.2, 5.4, 'y = 2x − 5', 'end'], lc: 'tr' }
    ], extra: function (sx, sy) {
      return L(sx(1), sy(0), sx(3), sy(-2), 'c5 thin d') + C(sx(4), sy(3), 6, 'p3') + T(sx(4) + 8, sy(3) + 22, 'x = 4', 't tb tg') +
        ptO(sx(2), sy(-1)) + T(sx(2.4), sy(-2.7), 'x = 2: посторонний', 'ts tr');
    } });
  } };
  F['m-mod-sum'] = { cap: 'y = |x − 2| + |x + 3|: на отрезке [−3; 2] сумма расстояний равна 5, а значение 7 достигается при x = −4 и x = 3 — ответ (−4; 3)', svg: function () {
    return plot({ x: [-6, 5], y: [-1, 10], w: 460, h: 320, tick: 2, label: 'Сумма модулей', fns: [
      { f: function (x) { return Math.abs(x - 2) + Math.abs(x + 3); }, c: 'c1' },
      { f: function () { return 7; }, c: 'c2 thin d' }
    ], extra: function (sx, sy) {
      return band(sx(-4), sx(3), sy(0)) + ptO(sx(-4), sy(7)) + ptO(sx(3), sy(7)) + ptO(sx(-4), sy(0)) + ptO(sx(3), sy(0)) +
        T(sx(3), sy(0) + 15, '3', 'tn', 'middle') + T(sx(-0.3), sy(9.3), 'y = |x − 2| + |x + 3|', 't tb ti', 'end') +
        T(sx(-0.5), sy(5) + 18, 'на [−3; 2] сумма = 5', 'ts', 'middle') + T(sx(4.9), sy(7) - 6, 'y = 7', 't tb tr', 'end');
    } });
  } };
  F['m-mod-abs-parab'] = { cap: 'y = |x² − 4|: часть параболы под осью отражена вверх. Прямая y = a даёт 4 корня при 0 &lt; a &lt; 4, 3 корня при a = 4 и 2 корня при a &gt; 4', svg: function () {
    return plot({ x: [-4, 7], y: [-1, 7], w: 520, h: 300, tick: 2, label: 'График модуля квадратного трёхчлена', fns: [
      { f: function (x) { return x * x - 4; }, from: -2, to: 2, c: 'c5 thin d' },
      { f: function () { return 2; }, c: 'c3 thin' }, { f: function () { return 4; }, c: 'c2 thin' }, { f: function () { return 6; }, c: 'c4 thin' },
      { f: function (x) { return Math.abs(x * x - 4); }, c: 'c1' }
    ], extra: function (sx, sy) {
      var b = '';
      [Math.sqrt(6), Math.sqrt(2)].forEach(function (x) { b += C(sx(x), sy(2), 4, 'p3') + C(sx(-x), sy(2), 4, 'p3'); });
      b += C(sx(0), sy(4), 5, 'p2') + C(sx(Math.sqrt(8)), sy(4), 4, 'p2') + C(sx(-Math.sqrt(8)), sy(4), 4, 'p2') + C(sx(Math.sqrt(10)), sy(6), 4, 'p1') + C(sx(-Math.sqrt(10)), sy(6), 4, 'p1');
      return b + T(sx(0) + 8, sy(4) - 8, '(0; 4)', 'ts') + T(sx(3.9), sy(2) - 5, 'a = 2: 4 корня', 't tb tg') + T(sx(3.9), sy(4) - 5, 'a = 4: 3 корня', 't tb tr') + T(sx(3.9), sy(6) - 5, 'a = 6: 2 корня', 't tb ti');
    } });
  } };

  /* ================= Треугольник (math-triangles-centers) ================= */
  F['m-tri-centers'] = { cap: 'Слева: медианы пересекаются в точке O и делятся ею 2 : 1 от вершины. Справа: биссектриса делит сторону пропорционально прилежащим сторонам: BD : DC = 6 : 9, BD = 4, DC = 6', svg: function () {
    var Ap = [110, 30], Bp = [30, 210], Cp = [270, 210], mid = function (p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; };
    var Ma = mid(Bp, Cp), Mb = mid(Ap, Cp), Mc = mid(Ap, Bp), G = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];
    var b = poly([Ap, Bp, Cp], 'c1 f1') + seg(Ap, Ma, 'c2') + seg(Bp, Mb, 'c2 thin') + seg(Cp, Mc, 'c2 thin') +
      C(Ma[0], Ma[1], 4, 'p5') + C(Mb[0], Mb[1], 4, 'p5') + C(Mc[0], Mc[1], 4, 'p5') + C(G[0], G[1], 5, 'p2') +
      T(Ap[0], Ap[1] - 8, 'A', 't tb', 'middle') + T(Bp[0] - 6, Bp[1] + 14, 'B', 't tb', 'end') + T(Cp[0] + 6, Cp[1] + 14, 'C', 't tb') + T(Ma[0], Ma[1] + 18, 'M', 't tb', 'middle') +
      T(G[0] + 10, G[1] - 4, 'O', 't tb tr') + T((Ap[0] + G[0]) / 2 + 8, (Ap[1] + G[1]) / 2, '2', 't tb tr') + T((G[0] + Ma[0]) / 2 + 8, (G[1] + Ma[1]) / 2 + 4, '1', 't tb tr') +
      T(150, 240, 'AO : OM = 2 : 1', 't tb tr', 'middle');
    var s = 24, B2 = [330, 210], C2 = [330 + 10 * s, 210], xa = 2.75, A2 = [330 + xa * s, 210 - Math.sqrt(36 - xa * xa) * s], D2 = [330 + 4 * s, 210];
    var a1 = angArc(A2, B2, D2, 24, 'c3'), a2 = angArc(A2, D2, C2, 30, 'c3');
    b += poly([A2, B2, C2], 'c1 f4') + seg(A2, D2, 'c3') + a1.s + a2.s + C(D2[0], D2[1], 4, 'p3') +
      T(A2[0], A2[1] - 8, 'A', 't tb', 'middle') + T(B2[0] - 6, B2[1] + 14, 'B', 't tb', 'end') + T(C2[0] + 2, C2[1] + 16, 'C', 't tb', 'end') + T(D2[0], D2[1] + 18, 'D', 't tb tg', 'middle') +
      T((A2[0] + B2[0]) / 2 - 8, (A2[1] + B2[1]) / 2, '6', 't tb ti', 'end') + T((A2[0] + C2[0]) / 2 + 8, (A2[1] + C2[1]) / 2 - 4, '9', 't tb ti') +
      T((B2[0] + D2[0]) / 2, 232, '4', 't tb tr', 'middle') + T((D2[0] + C2[0]) / 2, 232, '6', 't tb tr', 'middle') + T(460, 36, 'BD : DC = AB : AC', 't tb', 'middle');
    return svg(600, 250, b, 'Медианы и биссектриса');
  } };
  F['m-tri-midline'] = { cap: 'Три средние линии делят треугольник на четыре равных треугольника, подобных исходному с k = 1/2: MN ∥ AC и MN = AC / 2', svg: function () {
    var Bp = [150, 30], Ap = [40, 210], Cp = [380, 210], M = [95, 120], N = [265, 120], K = [210, 210];
    var b = poly([Bp, M, N], 'f1 k0') + poly([M, Ap, K], 'f1 k0') + poly([N, K, Cp], 'f1 k0') + poly([M, N, K], 'f3 k0') + poly([Ap, Bp, Cp], 'c1 fn') +
      seg(M, N, 'c2 wide') + seg(M, K, 'c2 thin') + seg(N, K, 'c2 thin') + C(M[0], M[1], 4, 'p2') + C(N[0], N[1], 4, 'p2') + C(K[0], K[1], 4, 'p2') +
      T(Bp[0], Bp[1] - 8, 'B', 't tb', 'middle') + T(Ap[0] - 6, Ap[1] + 14, 'A', 't tb', 'end') + T(Cp[0] + 6, Cp[1] + 14, 'C', 't tb') +
      T(M[0] - 8, M[1], 'M', 't tb', 'end') + T(N[0] + 8, N[1], 'N', 't tb') + T(K[0], K[1] + 18, 'K', 't tb', 'middle') +
      T(410, 70, 'MN ∥ AC', 't tb') + T(410, 96, 'MN = ½ AC', 't tb tr') + T(410, 124, '4 равных треугольника', 'ts') + T(410, 144, 'S(MBN) = ¼ S(ABC)', 'ts') + T(410, 176, 'трапеция: (a + b) / 2', 'ts');
    return svg(600, 235, b, 'Средние линии треугольника');
  } };
  F['m-tri-similar'] = { cap: 'MN ∥ AC отсекает подобный треугольник BMN с k = BM : BA = 2/3. Площади относятся как k² = 4/9: S(BMN) = 16 из 36, на трапецию остаётся 20', svg: function () {
    var Bp = [200, 24], Ap = [40, 216], Cp = [420, 216], M = [200 - 160 * 2 / 3, 24 + 192 * 2 / 3], N = [200 + 220 * 2 / 3, 24 + 192 * 2 / 3];
    var b = poly([Bp, M, N], 'f1 k0') + poly([M, Ap, Cp, N], 'f4 k0') + poly([Ap, Bp, Cp], 'c1 fn') + seg(M, N, 'c2 wide') +
      T(Bp[0], Bp[1] - 8, 'B', 't tb', 'middle') + T(Ap[0] - 6, Ap[1] + 14, 'A', 't tb', 'end') + T(Cp[0] + 6, Cp[1] + 14, 'C', 't tb') +
      T(M[0] - 8, M[1] + 4, 'M', 't tb', 'end') + T(N[0] + 8, N[1] + 4, 'N', 't tb') +
      T((Bp[0] + M[0]) / 2 - 10, (Bp[1] + M[1]) / 2, '2', 't tb tr', 'end') + T((M[0] + Ap[0]) / 2 - 10, (M[1] + Ap[1]) / 2, '1', 't tb tr', 'end') +
      T(213, 116, 'S = 16', 't tb ti', 'middle') + T(230, 196, 'S = 20', 't tb', 'middle') +
      T(440, 70, 'k = 2/3', 't tb') + T(440, 98, 'S₁ : S = k² = 4/9', 't tb tr') + T(440, 126, '36 · 4/9 = 16', 't') + T(440, 154, 'трапеция AMNC:', 'ts') + T(440, 172, '36 − 16 = 20', 't');
    return svg(600, 235, b, 'Подобие и площади');
  } };
  F['m-tri-heron'] = { cap: 'Треугольник 13, 14, 15: высота к стороне 14 равна 12 и делит её на 5 и 9; S = 84, p = 21, радиус вписанной окружности r = S / p = 4', svg: function () {
    var Bp = [40, 220], Cp = [250, 220], Ap = [115, 40], H = [115, 220], I = [130, 160];
    var b = poly([Ap, Bp, Cp], 'c1 f1') + C(I[0], I[1], 60, 'c3 fn') + C(I[0], I[1], 4, 'p3') + L(I[0], I[1], I[0], 220, 'c3 thin') + T(I[0] + 6, 200, 'r = 4', 'ts tg') +
      seg(Ap, H, 'c2 d') + rmark(H, Ap, Cp, 10) + T(121, 86, 'h = 12', 't tb tr') +
      T(Ap[0], Ap[1] - 8, 'A', 't tb', 'middle') + T(Bp[0] - 6, Bp[1] + 14, 'B', 't tb', 'end') + T(Cp[0] + 6, Cp[1] + 14, 'C', 't tb') +
      T(66, 128, '13', 't tb ti', 'end') + T(192, 126, '15', 't tb ti') + T(77, 238, '5', 't tb', 'middle') + T(182, 238, '9', 't tb', 'middle') +
      T(300, 70, 'p = (13 + 14 + 15) / 2 = 21', 't') + T(300, 100, 'S = √(21 · 8 · 7 · 6) = 84', 't tb') + T(300, 130, 'h = 2S / 14 = 12', 't tb tr') + T(300, 160, 'r = S / p = 84 / 21 = 4', 't tb tg');
    return svg(600, 250, b, 'Формула Герона и вписанная окружность');
  } };

  /* ================= Окружность (math-circle-tasks) ================= */
  F['m-circ-tangent'] = { cap: 'Слева: радиус в точку касания перпендикулярен касательной, OA = √(5² + 12²) = 13, отрезки касательных равны. Справа: AT² = AB · AC, где AC — вся секущая', svg: function () {
    var O = [70, 120], R = 45, Ap = [187, 120], th = Math.acos(5 / 13);
    var Bp = [O[0] + R * Math.cos(th), O[1] - R * Math.sin(th)], Cp = [O[0] + R * Math.cos(th), O[1] + R * Math.sin(th)];
    var b = C(O[0], O[1], R, 'c5 fn') + seg(O, Ap, 'c5 thin d') + seg(O, Bp, 'c5 thin') + seg(O, Cp, 'c5 thin') + seg(Ap, Bp, 'c1') + seg(Ap, Cp, 'c1') +
      rmark(Bp, O, Ap, 8) + rmark(Cp, O, Ap, 8) + C(O[0], O[1], 3.5, 'p5') + C(Ap[0], Ap[1], 4, 'p1') +
      T(O[0] - 6, O[1] + 4, 'O', 't tb', 'end') + T(Ap[0] + 8, Ap[1] + 5, 'A', 't tb') + T(Bp[0] - 4, Bp[1] - 8, 'B', 't tb', 'end') + T(Cp[0] - 4, Cp[1] + 18, 'C', 't tb', 'end') +
      T(70, 98, '5', 't tb', 'end') + T(142, 92, '12', 't tb ti') + T(128, 136, '13', 't tb', 'middle') +
      T(140, 222, 'OA = √(5² + 12²) = 13', 'ts', 'middle') + T(140, 242, 'AB = AC, OA — биссектриса ∠A', 'ts', 'middle');
    var O2 = [470, 120], s = 16, d = Math.sqrt(52), m = Math.sqrt(16 - 6.25), A2 = [O2[0] - d * s, 120];
    var ph = Math.asin(m / d), ps = Math.asin(4 / d), u = [Math.cos(ph), Math.sin(ph)], v = [Math.cos(ps), -Math.sin(ps)];
    var B2 = [A2[0] + 4 * s * u[0], A2[1] + 4 * s * u[1]], C2 = [A2[0] + 9 * s * u[0], A2[1] + 9 * s * u[1]], T2 = [A2[0] + 6 * s * v[0], A2[1] + 6 * s * v[1]];
    b += C(O2[0], O2[1], 4 * s, 'c5 fn') + seg(O2, T2, 'c5 thin d') + rmark(T2, O2, A2, 8) + seg(A2, T2, 'c1') + seg(A2, C2, 'c2') +
      C(O2[0], O2[1], 3.5, 'p5') + C(A2[0], A2[1], 4, 'p1') + C(T2[0], T2[1], 4, 'p1') + C(B2[0], B2[1], 4, 'p2') + C(C2[0], C2[1], 4, 'p2') +
      T(A2[0] - 8, A2[1] + 5, 'A', 't tb', 'end') + T(T2[0] + 2, T2[1] - 10, 'T', 't tb') + T(B2[0] + 2, B2[1] + 20, 'B', 't tb') + T(C2[0] + 8, C2[1] + 10, 'C', 't tb') + T(O2[0] + 6, O2[1] - 6, 'O', 't tb') +
      T((A2[0] + T2[0]) / 2 - 6, (A2[1] + T2[1]) / 2 - 4, '6', 't tb ti', 'end') + T((A2[0] + B2[0]) / 2 - 4, (A2[1] + B2[1]) / 2 + 18, '4', 't tb tr', 'middle') +
      T((B2[0] + C2[0]) / 2 - 4, (B2[1] + C2[1]) / 2 + 18, '5', 't tb tr', 'middle') +
      T(470, 222, 'AT² = AB · AC', 't tb tr', 'middle') + T(470, 242, '6² = 4 · (4 + 5) = 36', 'ts', 'middle');
    return svg(600, 255, b, 'Касательные и секущая');
  } };
  F['m-circ-chords'] = { cap: 'Пересекающиеся хорды: произведения отрезков равны, AE · EB = CE · ED, то есть 4 · 9 = 6 · 6', svg: function () {
    var cx = 150, cy = 125, s = 15, e = Math.sqrt(13), uy = 2.5 / e, ux = Math.sqrt(1 - uy * uy);
    var p = function (x, y) { return [cx + s * x, cy - s * y]; };
    var E = p(0, -e), Cp = p(-6, -e), Dp = p(6, -e), Ap = p(-4 * ux, -e - 4 * uy), Bp = p(9 * ux, -e + 9 * uy);
    var b = C(cx, cy, 7 * s, 'c5 fn') + C(cx, cy, 3.5, 'p5') + seg(Ap, Bp, 'c1') + seg(Cp, Dp, 'c2') +
      [Ap, Bp, Cp, Dp].map(function (q) { return C(q[0], q[1], 4, 'p5'); }).join('') + C(E[0], E[1], 5, 'p3') +
      T(Ap[0] - 6, Ap[1] + 12, 'A', 't tb', 'end') + T(Bp[0] + 6, Bp[1] - 4, 'B', 't tb') + T(Cp[0] - 8, Cp[1] + 5, 'C', 't tb', 'end') + T(Dp[0] + 8, Dp[1] + 5, 'D', 't tb') + T(E[0] + 6, E[1] + 18, 'E', 't tb tg') +
      T((Ap[0] + E[0]) / 2 - 8, (Ap[1] + E[1]) / 2, '4', 't tb ti', 'end') + T((E[0] + Bp[0]) / 2 - 8, (E[1] + Bp[1]) / 2 - 4, '9', 't tb ti', 'end') +
      T((Cp[0] + E[0]) / 2, E[1] - 8, '6', 't tb tr', 'middle') + T((E[0] + Dp[0]) / 2, E[1] + 18, '6', 't tb tr', 'middle') +
      T(320, 96, 'AE · EB = CE · ED', 't tb') + T(320, 124, '4 · 9 = 6 · ED', 't') + T(320, 152, 'ED = 36 : 6 = 6', 't tb tg');
    return svg(600, 250, b, 'Пересекающиеся хорды');
  } };
  F['m-circ-trap'] = { cap: 'Окружность, вписанная в равнобедренную трапецию с основаниями 4 и 16: отрезки касательных 2 и 8 дают боковую сторону 10, высота 8 = 2r, r = 4', svg: function () {
    var Ap = [40, 220], Dp = [264, 220], Bp = [124, 108], Cp = [180, 108], I = [152, 164];
    var tL = [124 - 0.2 * 84, 108 + 0.2 * 112], tR = [180 + 0.2 * 84, 108 + 0.2 * 112];
    var b = poly([Ap, Bp, Cp, Dp], 'c1 f1') + C(I[0], I[1], 56, 'c3 fn') + L(152, 108, 152, 220, 'c2 thin d') + C(I[0], I[1], 4, 'p3') +
      [[152, 108], [152, 220], tL, tR].map(function (q) { return C(q[0], q[1], 4, 'p3'); }).join('') +
      T(Ap[0] - 6, Ap[1] + 14, 'A', 't tb', 'end') + T(Dp[0] + 6, Dp[1] + 14, 'D', 't tb') + T(Bp[0] - 6, Bp[1] - 6, 'B', 't tb', 'end') + T(Cp[0] + 6, Cp[1] - 6, 'C', 't tb') +
      T(138, 100, '2', 'ts tb', 'middle') + T(166, 100, '2', 'ts tb', 'middle') + T(96, 238, '8', 'ts tb', 'middle') + T(208, 238, '8', 'ts tb', 'middle') +
      T(108, 118, '2', 'ts tb', 'end') + T(66, 178, '8', 'ts tb', 'end') + T(196, 118, '2', 'ts tb') + T(238, 178, '8', 'ts tb') + T(158, 196, '2r', 'ts tr') +
      T(310, 70, 'AB + CD = BC + AD', 't tb') + T(310, 96, '10 + 10 = 4 + 16', 't') + T(310, 128, 'h = √(10² − 6²) = 8', 't tb tr') + T(310, 156, 'r = h / 2 = 4', 't tb tg') +
      T(310, 188, '6 = (16 − 4) / 2', 'ts');
    return svg(600, 250, b, 'Окружность, вписанная в трапецию');
  } };
  F['m-circ-cyclic'] = { cap: 'Слева: у вписанного четырёхугольника ∠A + ∠C = ∠B + ∠D = 180°. Справа: центр окружности, описанной около прямоугольного треугольника, — середина гипотенузы, R = c / 2', svg: function () {
    var O = [140, 125], R = 95, pt = function (deg) { return polar(O, R, deg); };
    var V4 = { A: pt(225), B: pt(125), C: pt(15), D: pt(285) }, deg = { A: 225, B: 125, C: 15, D: 285 };
    var nb = { A: ['B', 'D'], B: ['A', 'C'], C: ['B', 'D'], D: ['A', 'C'] }, val = { A: '100°', B: '75°', C: '80°', D: '105°' };
    var b = C(O[0], O[1], R, 'c5 fn') + poly([V4.A, V4.B, V4.C, V4.D], 'c1 f1');
    Object.keys(V4).forEach(function (k) {
      var q = V4[k], aa = angArc(q, V4[nb[k][0]], V4[nb[k][1]], 18, k === 'A' || k === 'C' ? 'c2' : 'c3'), lp = polar(q, 36, aa.mid), np = polar(O, R + 14, deg[k]);
      b += aa.s + T(lp[0], lp[1] + 5, val[k], 'ts tb ' + (k === 'A' || k === 'C' ? 'tr' : 'tg'), 'middle') + T(np[0], np[1] + 5, k, 't tb', 'middle');
    });
    b += T(140, 250, '100° + 80° = 75° + 105° = 180°', 'ts', 'middle');
    var O2 = [450, 125], A2 = [360, 125], B2 = [540, 125], C2 = polar(O2, 90, 60);
    b += C(O2[0], O2[1], 90, 'c5 fn') + poly([A2, B2, C2], 'c1 f4') + rmark(C2, A2, B2, 10) + C(O2[0], O2[1], 4, 'p2') + seg(O2, C2, 'c2 thin d') +
      T(A2[0] - 6, A2[1] + 5, 'A', 't tb', 'end') + T(B2[0] + 6, B2[1] + 5, 'B', 't tb') + T(C2[0] + 4, C2[1] - 8, 'C', 't tb') + T(O2[0], O2[1] + 20, 'O', 't tb tr', 'middle') +
      T(405, 118, 'R', 't tb tr', 'middle') + T(495, 118, 'R', 't tb tr', 'middle') + T(450, 250, 'гипотенуза AB — диаметр, R = c / 2', 'ts', 'middle');
    return svg(600, 260, b, 'Вписанный четырёхугольник и описанная окружность');
  } };

  /* ================= Векторы (math-vectors-coordinates) ================= */
  F['m-vec-coords'] = { cap: 'Вектор AB = (7 − 1; 10 − 2) = (6; 8) — «конец минус начало»; длина — гипотенуза: √(36 + 64) = 10; середина M(4; 6)', svg: function () {
    return plot({ x: [0, 8], y: [0, 11], w: 380, h: 420, label: 'Координаты вектора', extra: function (sx, sy) {
      return L(sx(1), sy(2), sx(7), sy(2), 'c3 d') + L(sx(7), sy(2), sx(7), sy(10), 'c2 d') + A(sx(1), sy(2), sx(7), sy(10), 'c1', 11) +
        C(sx(1), sy(2), 5, 'p1') + C(sx(4), sy(6), 5, 'p2') +
        T(sx(1) - 6, sy(2) + 18, 'A(1; 2)', 't tb') + T(sx(7) - 8, sy(10) - 4, 'B(7; 10)', 't tb', 'end') + T(sx(4) + 8, sy(6) + 16, 'M(4; 6)', 't tb tr') +
        T(sx(4), sy(2) + 18, 'Δx = 6', 't tb tg', 'middle') + T(sx(7) + 6, sy(6), 'Δy = 8', 't tb tr') +
        T(sx(0.3), sy(10.3), 'AB = √(6² + 8²) = 10', 't tb ti') + T(sx(0.3), sy(9.5), 'AB = (6; 8)', 'ts');
    } });
  } };
  F['m-vec-sum'] = { cap: 'Правило треугольника: от конца a откладываем b; сумма a + b = (2 + 1; 3 − 5) = (3; −2) — диагональ параллелограмма', svg: function () {
    return plot({ x: [-1, 5], y: [-6, 4], w: 360, h: 400, label: 'Сложение векторов', extra: function (sx, sy) {
      return L(sx(0), sy(0), sx(1), sy(-5), 'c2 thin d') + L(sx(1), sy(-5), sx(3), sy(-2), 'c1 thin d') +
        A(sx(0), sy(0), sx(2), sy(3), 'c1', 10) + A(sx(2), sy(3), sx(3), sy(-2), 'c2', 10) + A(sx(0), sy(0), sx(3), sy(-2), 'c3 wide', 12) +
        T(sx(0.8) - 10, sy(1.2), 'a', 't tb ti', 'end') + T(sx(2.6) + 8, sy(0.5), 'b', 't tb tr') + T(sx(1.5) - 6, sy(-1) + 16, 'a + b', 't tb tg', 'end') +
        T(sx(2.8), sy(3.5), 'a = (2; 3)', 't ti') + T(sx(2.8), sy(2.8), 'b = (1; −5)', 't tr') + T(sx(2.8), sy(2.1), 'a + b = (3; −2)', 't tb tg');
    } });
  } };
  F['m-vec-dot'] = { cap: 'Знак скалярного произведения показывает угол между векторами: больше нуля — острый, ноль — прямой, меньше нуля — тупой', svg: function () {
    var b = '';
    var pan = function (O, s, a, bb, txt1, txt2, cls, cx) {
      var ea = [O[0] + a[0] * s, O[1] - a[1] * s], eb = [O[0] + bb[0] * s, O[1] - bb[1] * s];
      var q = A(O[0], O[1], ea[0], ea[1], 'c1', 10) + A(O[0], O[1], eb[0], eb[1], 'c2', 10) + C(O[0], O[1], 3.5, 'p5') +
        T(ea[0] + 6, ea[1] + 4, 'a', 't tb ti') + T(eb[0] - 6, eb[1] - 4, 'b', 't tb tr', 'end') + T(cx, 190, txt1, 't tb ' + cls, 'middle') + T(cx, 210, txt2, 'ts', 'middle');
      return { s: q, ea: ea, eb: eb };
    };
    var p1 = pan([40, 150], 40, [3, 1], [1, 2], 'a · b &gt; 0: угол острый', '3 · 1 + 1 · 2 = 5', 'tg', 110);
    var p2 = pan([300, 150], 40, [2, 1], [-1, 2], 'a · b = 0: угол прямой', '2 · (−1) + 1 · 2 = 0', '', 310);
    var p3 = pan([510, 150], 60, [1, 1], [-1, 0], 'a · b &lt; 0: тупой', '1 · (−1) + 1 · 0 = −1', 'tr', 510);
    var g1 = angArc([40, 150], p1.ea, p1.eb, 30, 'c3'), g3 = angArc([510, 150], p3.ea, p3.eb, 24, 'c3'), l1 = polar([40, 150], 44, g1.mid), l3 = polar([510, 150], 38, g3.mid);
    b += p1.s + p2.s + p3.s + g1.s + T(l1[0], l1[1] + 5, '45°', 'ts tg', 'middle') + rmark([300, 150], p2.ea, p2.eb, 12, 'c3') + g3.s + T(l3[0], l3[1] + 5, '135°', 'ts tg', 'middle');
    return svg(600, 222, b, 'Скалярное произведение и угол');
  } };
  F['m-vec-sum-len'] = { cap: '|a| = 3, |b| = 4, угол 60°: a · b = 3 · 4 · ½ = 6 и |a + b|² = 9 + 16 + 2 · 6 = 37, |a + b| = √37 ≈ 6,08', svg: function () {
    var O = [40, 200], s = 45, ea = [O[0] + 3 * s, 200], eb = [O[0] + 4 * s * 0.5, 200 - 4 * s * Math.sqrt(3) / 2], es = [ea[0] + eb[0] - O[0], eb[1]];
    var b = seg(ea, es, 'c2 thin d') + seg(eb, es, 'c1 thin d') + A(O[0], O[1], ea[0], ea[1], 'c1', 10) + A(O[0], O[1], eb[0], eb[1], 'c2', 10) + A(O[0], O[1], es[0], es[1], 'c3 wide', 12) +
      arc(O[0], O[1], 30, 0, 60, 'c5 thin') + T(O[0] + 36, O[1] - 10, '60°', 'ts tb') +
      T((O[0] + ea[0]) / 2, 220, '|a| = 3', 't tb ti', 'middle') + T((O[0] + eb[0]) / 2 - 8, (O[1] + eb[1]) / 2, '|b| = 4', 't tb tr', 'end') + T(176, 124, '√37', 't tb tg') +
      T(320, 70, 'a · b = |a| · |b| · cos 60°', 't') + T(320, 96, '= 3 · 4 · ½ = 6', 't tb') + T(320, 132, '|a + b|² = 9 + 16 + 2 · 6 = 37', 't tb tg') + T(320, 158, '|a + b| = √37 ≈ 6,08', 't');
    return svg(600, 232, b, 'Длина суммы векторов');
  } };

  /* ================= Статистика (math-stat) ================= */
  F['m-stat-median'] = { cap: 'Медиана — середина упорядоченного ряда: для 1; 3; 5; 7; 8; 9 это (5 + 7) / 2 = 6. Среднее 33 / 6 = 5,5, размах 9 − 1 = 8', svg: function () {
    var b = T(40, 30, 'исходный ряд', 'ts'), raw = [3, 8, 1, 9, 5, 7], srt = [1, 3, 5, 7, 8, 9];
    raw.forEach(function (v, i) { b += cell(40 + i * 58, 40, 50, 40, v, 'c5 thin fs'); });
    b += A(190, 88, 190, 114, 'c5', 8) + T(202, 106, 'упорядочить', 'ts');
    srt.forEach(function (v, i) { b += cell(40 + i * 58, 120, 50, 40, v, 'c5 thin ' + (i === 2 || i === 3 ? 'f2' : (i === 0 || i === 5 ? 'f4' : 'fs'))); });
    b += P('M156 168 V176 H264 V168', 'c2 thin') + T(210, 194, 'медиана', 'ts tr', 'middle') +
      T(400, 70, 'n = 6 — чётное', 'ts') + T(400, 100, 'медиана = (5 + 7) / 2 = 6', 't tb tr') + T(400, 130, 'среднее = 33 / 6 = 5,5', 't tb ti') + T(400, 160, 'размах = 9 − 1 = 8', 't tb');
    return svg(600, 205, b, 'Медиана, среднее, размах');
  } };
  F['m-stat-outlier'] = { cap: 'Один выброс 100 утянул среднее к 26,5, а медиана 2,5 осталась рядом с типичными значениями 1, 2, 3', svg: function () {
    var sx = function (v) { return 40 + v * 5.2; }, b = A(30, 110, 576, 110, 'ax', 9);
    [0, 20, 40, 60, 80, 100].forEach(function (v) { b += L(sx(v), 105, sx(v), 115, 'ax') + T(sx(v), 132, v, 'tn', 'middle'); });
    [1, 2, 3, 100].forEach(function (v) { b += C(sx(v), 110, 4.5, 'p1'); });
    b += L(sx(26.5), 72, sx(26.5), 118, 'c2') + T(sx(26.5), 64, 'среднее 26,5', 't tb tr', 'middle') +
      L(sx(2.5), 88, sx(2.5), 118, 'c3') + T(48, 82, 'медиана 2,5', 't tb tg') + T(sx(100), 94, 'выброс', 'ts tr', 'middle') +
      T(300, 166, 'ряд 1; 2; 3; 100: среднее = 106 / 4 = 26,5, медиана = (2 + 3) / 2 = 2,5', 'ts', 'middle');
    return svg(600, 180, b, 'Выброс и медиана');
  } };
  F['m-stat-pie'] = { cap: 'Круговая диаграмма: весь круг 360° = 100% = 200 человек. Сектор 72° — это 72/360 = 20%, то есть 40 человек', svg: function () {
    var cx = 140, cy = 125, R = 100, b = '', a = 0;
    var parts = [[72, 'f2', 'математика', 40], [90, 'f1', 'физика', 50], [108, 'f3', 'русский язык', 60], [90, 'f4', 'другое', 50]];
    parts.forEach(function (q, i) {
      var m = (a + q[0] / 2) * Math.PI / 180;
      b += sector(cx, cy, 0, R, a, a + q[0], 'c5 thin ' + q[1]) + T(cx + 62 * Math.sin(m), cy - 62 * Math.cos(m) + 5, num(q[0] / 3.6) + '%', 't tb', 'middle');
      b += box(290, 46 + i * 34, 18, 18, 'c5 thin ' + q[1], 3) + T(316, 60 + i * 34, q[2] + ': ' + q[0] + '° → ' + num(q[0] / 3.6) + '% → ' + q[3] + ' чел.', i ? 't' : 't tb tr');
      a += q[0];
    });
    b += T(290, 206, 'число = α / 360 · N = 72 / 360 · 200 = 40', 'ts');
    return svg(600, 240, b, 'Круговая диаграмма');
  } };
  F['m-stat-speed'] = { cap: 'Половину пути (60 км) едем 1 ч со скоростью 60 км/ч, вторую половину — 1,5 ч со скоростью 40 км/ч. Средняя скорость 120 / 2,5 = 48 км/ч, а не 50', svg: function () {
    var fr = frame({ w: 560, h: 280, x: [0, 3], y: [0, 140], l: 50, gx: 0.5, gy: 20, xt: [0.5, 1, 1.5, 2, 2.5, 3], yt: [20, 40, 60, 80, 100, 120, 140], axes: ['t, ч', 's, км'] });
    var sx = fr.sx, sy = fr.sy, b = fr.b;
    b += L(sx(0), sy(60), sx(1), sy(60), 'c5 thin d') + L(sx(1), sy(0), sx(1), sy(60), 'c5 thin d') + L(sx(0), sy(120), sx(2.5), sy(120), 'c5 thin d') + L(sx(2.5), sy(0), sx(2.5), sy(120), 'c5 thin d') +
      L(sx(0), sy(0), sx(2.5), sy(120), 'c2 d') + P('M' + r1(sx(0)) + ' ' + r1(sy(0)) + ' L' + r1(sx(1)) + ' ' + r1(sy(60)) + ' L' + r1(sx(2.5)) + ' ' + r1(sy(120)), 'c1 wide') +
      C(sx(1), sy(60), 5, 'p1') + C(sx(2.5), sy(120), 5, 'p1') +
      T(sx(0.5) - 8, sy(30) - 6, '60 км/ч', 't tb ti', 'end') + T(sx(1.75) - 8, sy(90) - 8, '40 км/ч', 't tb ti', 'end') + T(sx(2.45), sy(64), 'vср = 48 км/ч', 't tb tr', 'end') +
      T(sx(0.1), sy(132), 'vср = весь путь / всё время = 120 / 2,5 = 48 км/ч', 't tb');
    return svg(560, 280, b, 'Средняя скорость');
  } };

  /* ================= Сечения (math-sections) ================= */
  F['m-sec-tri'] = { cap: 'Сечение куба плоскостью ACB₁: соединяем только точки, лежащие на одной грани. Все три стороны — диагонали граней, треугольник правильный', svg: function () {
    var p = cubeP(60, 210, 130, 55, -45), Ap = p(0, 0, 0), Cp = p(1, 0, 1), B1 = p(1, 1, 0);
    var b = poly([Ap, Cp, B1], 'f2 k0') + cubeEdges(p) + seg(Ap, B1, 'c2') + seg(B1, Cp, 'c2') + seg(Ap, Cp, 'c2 d') + cubeLabels(p) +
      T(320, 60, '1) A и B₁ — на грани ABB₁A₁', 't') + T(320, 86, '2) B₁ и C — на грани BCC₁B₁', 't') + T(320, 112, '3) A и C — на грани ABCD', 't') +
      T(320, 148, 'AB₁ = B₁C = AC = a√2', 't tb tr') + T(320, 174, 'сечение — правильный треугольник', 'ts');
    return svg(600, 235, b, 'Треугольное сечение куба');
  } };
  F['m-sec-cube2'] = { cap: 'Слева: диагональное сечение ACC₁A₁ — прямоугольник a × a√2. Справа: плоскость через середины шести рёбер даёт правильный шестиугольник', svg: function () {
    var p = cubeP(40, 205, 120, 50, -40), q = cubeP(330, 205, 120, 50, -40);
    var b = poly([p(0, 0, 0), p(1, 0, 1), p(1, 1, 1), p(0, 1, 0)], 'f1 k0') + cubeEdges(p) +
      seg(p(0, 0, 0), p(1, 0, 1), 'c1 d') + seg(p(1, 0, 1), p(1, 1, 1), 'c1') + seg(p(1, 1, 1), p(0, 1, 0), 'c1') + seg(p(0, 1, 0), p(0, 0, 0), 'c1') + cubeLabels(p);
    var hx = [q(0, 0.5, 0), q(0, 0, 0.5), q(0.5, 0, 1), q(1, 0.5, 1), q(1, 1, 0.5), q(0.5, 1, 0)], vis = [false, false, false, true, true, true];
    b += poly(hx, 'f2 k0') + cubeEdges(q);
    hx.forEach(function (v, i) { b += seg(v, hx[(i + 1) % 6], vis[i] ? 'c2' : 'c2 d') + C(v[0], v[1], 3.5, 'p2'); });
    b += cubeLabels(q) + T(125, 236, 'a × a√2, S = a²√2', 't tb ti', 'middle') + T(415, 236, 'правильный шестиугольник', 't tb tr', 'middle');
    return svg(600, 245, b, 'Сечения куба');
  } };
  F['m-sec-angle'] = { cap: 'Угол между скрещивающимися AB₁ и BC₁: заменяем AB₁ параллельной ей DC₁. Треугольник DC₁B правильный (стороны — диагонали граней), угол 60°', svg: function () {
    var p = cubeP(60, 210, 130, 55, -45), Ap = p(0, 0, 0), Bp = p(1, 0, 0), Dp = p(0, 0, 1), B1 = p(1, 1, 0), C1 = p(1, 1, 1);
    var g = angArc(C1, Dp, Bp, 24, 'c3');
    var b = poly([Dp, C1, Bp], 'f3 k0') + cubeEdges(p) + seg(Ap, B1, 'c1 wide') + seg(Bp, C1, 'c2 wide') + seg(Dp, C1, 'c1 d') + seg(Dp, Bp, 'c3 d') + g.s + cubeLabels(p) +
      T(C1[0] + 8, C1[1] + 36, '60°', 't tb tg') +
      T(320, 60, 'AB₁ ∥ DC₁', 't tb ti') + T(320, 88, '∠(AB₁; BC₁) = ∠DC₁B', 't') + T(320, 116, 'DB = BC₁ = DC₁ = a√2', 't') + T(320, 152, 'треугольник правильный → 60°', 't tb tg');
    return svg(600, 235, b, 'Угол между скрещивающимися прямыми');
  } };
  F['m-sec-tetra'] = { cap: 'Тетраэдр с прямыми углами при вершине D: DA = DB = 3, DC = 6. Расстояние от D до плоскости ABC: 1/h² = 1/9 + 1/9 + 1/36 = 1/4, h = 2', svg: function () {
    var p = function (x, y, z) { return [130 + 50 * x - 28 * z, 180 - 25 * y + 18 * z]; };
    var D = p(0, 0, 0), Ap = p(3, 0, 0), Bp = p(0, 0, 3), Cp = p(0, 6, 0), H = p(4 / 3, 4 / 3, 2 / 3);
    var rm = function (e1, e2) { var k = 0.45, a = p(e1[0] * k, e1[1] * k, e1[2] * k), c = p(e2[0] * k, e2[1] * k, e2[2] * k), m = p((e1[0] + e2[0]) * k, (e1[1] + e2[1]) * k, (e1[2] + e2[2]) * k); return P('M' + r1(a[0]) + ' ' + r1(a[1]) + ' L' + r1(m[0]) + ' ' + r1(m[1]) + ' L' + r1(c[0]) + ' ' + r1(c[1]), 'c5 thin'); };
    var b = poly([Ap, Bp, Cp], 'f1 k0') + seg(D, Ap, 'c5 thin d') + seg(D, Bp, 'c5 thin d') + seg(D, Cp, 'c5 thin d') + rm([1, 0, 0], [0, 1, 0]) + rm([0, 0, 1], [0, 1, 0]) + rm([1, 0, 0], [0, 0, 1]) +
      seg(Ap, Bp, 'c1') + seg(Bp, Cp, 'c1') + seg(Cp, Ap, 'c1') + seg(D, H, 'c2') + C(H[0], H[1], 4, 'p2') + C(D[0], D[1], 3.5, 'p5') +
      T(D[0] - 8, D[1] - 4, 'D', 't tb', 'end') + T(Ap[0] + 8, Ap[1] + 5, 'A', 't tb') + T(Bp[0] - 8, Bp[1] + 10, 'B', 't tb', 'end') + T(Cp[0], Cp[1] - 8, 'C', 't tb', 'middle') + T(H[0] + 8, H[1] - 4, 'H', 't tb tr') +
      T((D[0] + Ap[0]) / 2, D[1] + 18, '3', 't tb ti', 'middle') + T((D[0] + Bp[0]) / 2 - 8, (D[1] + Bp[1]) / 2 + 4, '3', 't tb ti', 'end') + T(D[0] - 8, (D[1] + Cp[1]) / 2, '6', 't tb ti', 'end') +
      T(160, 184, 'h', 't tb tr') +
      T(320, 70, '1/h² = 1/a² + 1/b² + 1/c²', 't tb') + T(320, 98, '= 1/9 + 1/9 + 1/36 = 9/36 = 1/4', 't') + T(320, 126, 'h = 2', 't tb tr') +
      T(320, 164, 'проверка объёмом: V = 3 · 3 · 6 / 6 = 9,', 'ts') + T(320, 182, 'S(ABC) = 3V / h = 13,5', 'ts');
    return svg(600, 250, b, 'Расстояние от точки до плоскости');
  } };

  /* ================= Делимость (math-number-theory) ================= */
  F['m-nt-tree'] = { cap: 'Дерево разложения: 72 = 2³ · 3². Делители 72 — числа вида 2ⁱ · 3ʲ (i = 0…3, j = 0…2): таблица 4 × 3 даёт 12 делителей', svg: function () {
    var nd = { r: [130, 30, '72'], a: [70, 90, '8'], b: [200, 90, '9'], c: [35, 150, '2', 1], d: [105, 150, '4'], e: [175, 150, '3', 1], f: [225, 150, '3', 1], g: [80, 210, '2', 1], h: [130, 210, '2', 1] };
    var ed = [['r', 'a'], ['r', 'b'], ['a', 'c'], ['a', 'd'], ['b', 'e'], ['b', 'f'], ['d', 'g'], ['d', 'h']], b = '';
    ed.forEach(function (e) { b += seg(nd[e[0]], nd[e[1]], 'c5 thin'); });
    Object.keys(nd).forEach(function (k) { var q = nd[k]; b += C(q[0], q[1], 17, q[3] ? 'c2 f2' : 'c1 fs') + T(q[0], q[1] + 5, q[2], 't tb', 'middle'); });
    b += T(130, 250, '72 = 2³ · 3²', 't tb tr', 'middle');
    var rows = [['×', '1', '2', '4', '8'], ['1', '1', '2', '4', '8'], ['3', '3', '6', '12', '24'], ['9', '9', '18', '36', '72']];
    rows.forEach(function (rw, i) { rw.forEach(function (v, j) { b += cell(335 + j * 50, 44 + i * 34, 50, 34, v, 'c5 thin ' + (i === 0 || j === 0 ? 'f1' : 'fs'), i === 0 || j === 0 ? 't tb ti' : 't'); }); });
    b += T(460, 30, 'делители: 2ⁱ · 3ʲ', 't tb', 'middle') + T(460, 206, '4 · 3 = 12 делителей', 't tb tr', 'middle') + T(460, 226, '(3 + 1)(2 + 1) = 12', 'ts', 'middle');
    return svg(600, 260, b, 'Разложение на простые множители');
  } };
  F['m-nt-venn'] = { cap: 'НОД — произведение общих простых множителей (2 · 3 = 6), НОК — произведение всех множителей без повтора общих (2 · 2 · 3 · 3 = 36)', svg: function () {
    var b = '<defs><clipPath id="mntclip"><circle cx="170" cy="120" r="95"/></clipPath></defs>' + C(170, 120, 95, 'f1 k0') + C(290, 120, 95, 'f3 k0') +
      '<circle cx="290" cy="120" r="95" class="f4 k0" clip-path="url(#mntclip)"/>' + C(170, 120, 95, 'c1 fn') + C(290, 120, 95, 'c3 fn') +
      T(120, 132, '2', 't big ti', 'middle') + T(230, 110, '2', 't big', 'middle') + T(230, 152, '3', 't big', 'middle') + T(340, 132, '3', 't big tg', 'middle') +
      T(110, 18, '12 = 2 · 2 · 3', 't tb ti', 'middle') + T(350, 18, '18 = 2 · 3 · 3', 't tb tg', 'middle') + T(230, 234, 'общие множители', 'ts', 'middle') +
      T(405, 80, 'НОД = 2 · 3 = 6', 't tb') + T(405, 108, 'НОК = 2 · 2 · 3 · 3 = 36', 't tb tr') + T(405, 146, 'НОД · НОК = 6 · 36 = 216', 'ts') + T(405, 166, '12 · 18 = 216', 'ts');
    return svg(600, 242, b, 'НОД и НОК через множители');
  } };
  F['m-nt-cycle'] = { cap: 'Последняя цифра 7ⁿ повторяется с периодом 4: 7, 9, 3, 1. Так как 2025 = 4 · 506 + 1, у 7²⁰²⁵ последняя цифра та же, что у 7¹, — это 7', svg: function () {
    var c0 = [150, 130], nds = [[150, 40, '7', '7¹ = 7'], [240, 130, '9', '7² = 49'], [150, 220, '3', '7³ = 343'], [60, 130, '1', '7⁴ = 2401']], b = '';
    var lp = [[188, 30, 'start'], [276, 120, 'start'], [188, 240, 'start'], [60, 178, 'middle']];
    nds.forEach(function (q, i) {
      var nx = nds[(i + 1) % 4], u = unit(q, nx), s0 = [q[0] + u[0] * 30, q[1] + u[1] * 30], s1 = [nx[0] - u[0] * 30, nx[1] - u[1] * 30], m = [(s0[0] + s1[0]) / 2, (s0[1] + s1[1]) / 2], o = unit(c0, m);
      b += A(s0[0], s0[1], s1[0], s1[1], 'c5', 9) + T(m[0] + o[0] * 16, m[1] + o[1] * 16 + 5, '×7', 'ts', 'middle');
    });
    nds.forEach(function (q, i) { b += C(q[0], q[1], 26, i === 0 ? 'c2 f2' : 'c1 f1') + T(q[0], q[1] + 10, q[2], 't big', 'middle') + T(lp[i][0], lp[i][1], q[3], 'ts', lp[i][2]); });
    b += T(340, 60, 'последние цифры 7ⁿ:', 'ts') + T(340, 84, '7, 9, 3, 1, 7, 9, 3, 1, …', 't tb') + T(340, 108, 'период 4', 'ts') +
      T(340, 148, '2025 = 4 · 506 + 1', 't tb ti') + T(340, 174, 'остаток 1 → как у 7¹', 't') + T(340, 200, 'ответ: 7', 't tb tr');
    return svg(600, 258, b, 'Цикл последних цифр');
  } };
  F['m-nt-lcm'] = { cap: 'Числа, кратные 4, 6 и 9 одновременно, — это кратные НОК(4, 6, 9) = 36. Остаток 1 от деления на все три даёт число 36 + 1 = 37', svg: function () {
    var sx = function (v) { return 110 + v * 11; }, b = '', v;
    [[4, 40, 'p1', 'кратные 4'], [6, 80, 'p3', 'кратные 6'], [9, 120, 'p2', 'кратные 9']].forEach(function (q) {
      b += L(sx(0), q[1], sx(40), q[1], 'gr') + T(14, q[1] + 4, q[3], 'ts');
      for (v = 0; v <= 40; v += q[0]) b += C(sx(v), q[1], v === 36 || v === 0 ? 5.5 : 4, q[2]);
    });
    b += L(sx(36), 26, sx(36), 166, 'c5 thin d') + A(100, 160, 572, 160, 'ax', 9);
    [0, 10, 20, 30, 40].forEach(function (v) { b += L(sx(v), 155, sx(v), 165, 'ax') + T(sx(v), 182, v, 'tn', 'middle'); });
    b += L(sx(36), 155, sx(36), 165, 'ax') + T(sx(36) - 2, 182, '36', 't tb', 'end') + ptF(sx(37), 160) + T(sx(37) + 2, 182, '37', 't tb tr') +
      T(300, 208, 'НОК(4, 6, 9) = 36, нужное число 36 + 1 = 37', 't tb tr', 'middle');
    return svg(600, 218, b, 'Общие кратные');
  } };

  /* ================= Параметр (math-parameter-intro) ================= */
  F['m-par-linear'] = { cap: 'Линейное уравнение ax = b: сначала проверяем, не равен ли нулю коэффициент при x, и только потом делим', svg: function () {
    var b = cell(230, 14, 140, 34, 'ax = b', 'c5 thin f1') +
      A(262, 50, 160, 88, 'c5', 8) + T(198, 64, 'a ≠ 0', 'ts tb', 'end') + cell(30, 90, 220, 40, 'x = b / a — один корень', 'c3 f3') +
      A(338, 50, 420, 88, 'c5', 8) + T(390, 64, 'a = 0', 'ts tb') + cell(350, 90, 160, 40, '0 · x = b', 'c5 thin fs') +
      A(410, 132, 370, 168, 'c5', 8) + T(384, 154, 'b = 0', 'ts tb', 'end') + cell(300, 170, 140, 40, 'любое x', 'c1 f1') +
      A(450, 132, 520, 168, 'c5', 8) + T(494, 150, 'b ≠ 0', 'ts tb') + cell(450, 170, 140, 40, 'корней нет', 'c2 f2') +
      T(30, 160, 'Пример: (a − 3)x = a² − 9', 't tb') + T(30, 182, 'a ≠ 3: x = a + 3', 'ts') + T(30, 202, 'a = 3: 0 · x = 0 — любое x', 'ts');
    return svg(600, 222, b, 'Разбор линейного уравнения с параметром');
  } };
  F['m-par-disc'] = { cap: 'y = x² − 6x + a: при a &lt; 9 (D &gt; 0) парабола пересекает ось дважды, при a = 9 (D = 0) касается её в точке x = 3, при a &gt; 9 (D &lt; 0) корней нет', svg: function () {
    var g = function (a) { return function (x) { return x * x - 6 * x + a; }; };
    return plot({ x: [-3, 7], y: [-5, 6], w: 480, h: 330, tick: 2, label: 'Число корней и дискриминант', fns: [{ f: g(5), c: 'c1' }, { f: g(9), c: 'c2' }, { f: g(12), c: 'c3' }],
      extra: function (sx, sy) {
        return C(sx(1), sy(0), 5, 'p1') + C(sx(5), sy(0), 5, 'p1') + C(sx(3), sy(0), 5, 'p2') +
          T(sx(-2.9), sy(-2.6), 'a = 5: 2 корня', 'ts tb ti') + T(sx(-2.9), sy(-3.4), 'a = 9: 1 корень', 'ts tb tr') + T(sx(-2.9), sy(-4.2), 'a = 12: 0 корней', 'ts tb tg');
      } });
  } };
  F['m-par-graph'] = { cap: '|x² − 6x| = a: нижняя часть параболы отражена вверх, получился «горб» с вершиной (3; 9). Ровно три корня — когда прямая y = a проходит через вершину, a = 9', svg: function () {
    var r18 = Math.sqrt(18);
    return plot({ x: [-2, 9], y: [-1, 13], w: 480, h: 340, tick: 2, label: 'Графический метод', fns: [
      { f: function () { return 5; }, c: 'c3 thin' }, { f: function () { return 9; }, c: 'c2 thin' }, { f: function () { return 12; }, c: 'c4 thin' },
      { f: function (x) { return Math.abs(x * x - 6 * x); }, c: 'c1' }
    ], extra: function (sx, sy) {
      return C(sx(3), sy(9), 5, 'p2') + C(sx(3 - r18), sy(9), 4, 'p2') + C(sx(3 + r18), sy(9), 4, 'p2') + T(sx(3), sy(9) - 10, '(3; 9)', 't tb tr', 'middle') +
        T(sx(7), sy(5) - 5, '4 корня', 'ts tb tg') + T(sx(7.45), sy(9) - 5, '3 корня', 'ts tb tr') + T(sx(7.8), sy(12) - 5, '2 корня', 'ts tb');
    } });
  } };
  F['m-par-subst'] = { cap: 'Замена t = x²: каждому t &gt; 0 соответствуют два корня x = ±√t, значению t = 0 — один корень x = 0, отрицательному t — ни одного', svg: function () {
    var r5 = Math.sqrt(5);
    return plot({ x: [-4, 5], y: [-3, 7], w: 460, h: 320, tick: 2, axes: ['x', 't'], label: 'Замена переменной', fns: [
      { f: function () { return 5; }, c: 'c3 thin' }, { f: function () { return -2; }, c: 'c2 thin d' },
      { f: function (x) { return x * x; }, c: 'c1' }
    ], extra: function (sx, sy) {
      return C(sx(r5), sy(5), 5, 'p3') + C(sx(-r5), sy(5), 5, 'p3') + C(sx(0), sy(0), 5, 'p1') +
        T(sx(2.6), sy(5) - 6, 't = 5: x = ±√5', 'ts tb tg') + T(sx(2.6), sy(0) - 6, 't = 0: x = 0', 'ts tb ti') + T(sx(2.4), sy(-2) - 6, 't = −2: нет корней', 'ts tb tr');
    } });
  } };

  /* ================= Чтение графиков (math-graph-reading) ================= */
  F['m-gr-read'] = { cap: 'Значение в точке: от x₀ = 4 вверх до графика, затем влево до оси Oy — f(4) = 5. Нули −1 и 3, наименьшее значение −4 в вершине (1; −4)', svg: function () {
    return plot({ x: [-3, 5], y: [-5, 6], w: 420, h: 340, label: 'Чтение графика', fns: [{ f: function (x) { return x * x - 2 * x - 3; }, c: 'c1', label: [3.7, 1.6, 'y = f(x)', 'start'] }],
      extra: function (sx, sy) {
        return A(sx(4), sy(0), sx(4), sy(5), 'c2 thin', 8) + A(sx(4), sy(5), sx(0), sy(5), 'c2 thin', 8) + C(sx(4), sy(5), 5, 'p2') + T(sx(0.15), sy(5.3), 'f(4) = 5', 't tb tr') +
          C(sx(-1), sy(0), 5, 'p1') + C(sx(3), sy(0), 5, 'p1') + C(sx(1), sy(-4), 5, 'p3') + T(sx(1) + 8, sy(-4) + 16, 'min = −4', 't tb tg') +
          T(sx(-2.9), sy(1), 'убывает ↘', 'ts tr') + T(sx(3.3), sy(-2), 'возрастает ↗', 'ts tg');
      } });
  } };
  F['m-gr-deriv'] = { cap: 'Дан график f′: где он выше оси — f возрастает, ниже — убывает. Смена знака «+ → −» при x = −2 — максимум f, «− → +» при x = 3 — минимум', svg: function () {
    return plot({ x: [-7, 7], y: [-3, 6], w: 480, h: 300, tick: 2, axes: ['x', 'y = f′(x)'], label: 'График производной', fns: [{ f: function (x) { return 0.15 * (x + 2) * (x - 3); }, from: -6, to: 6, c: 'c1' }],
      extra: function (sx, sy) {
        return C(sx(-2), sy(0), 5, 'p2') + C(sx(3), sy(0), 5, 'p3') + T(sx(-2), sy(0.8), 'max', 't tb tr', 'middle') + T(sx(3), sy(0.8), 'min', 't tb tg', 'middle') +
          T(sx(-4), sy(0.6), '+', 't tb tg', 'middle') + T(sx(0.5), sy(-0.5), '−', 't tb tr', 'middle') + T(sx(4.8), sy(0.6), '+', 't tb tg', 'middle') +
          T(sx(-4), sy(-2.2), 'f ↗', 't tb tg', 'middle') + T(sx(0.5), sy(-2.2), 'f ↘', 't tb tr', 'middle') + T(sx(4.8), sy(-2.2), 'f ↗', 't tb tg', 'middle');
      } });
  } };
  F['m-gr-grid'] = { cap: 'Слева — формула Пика: S = B + Γ/2 − 1 (зелёные узлы внутри, красные на границе). Справа — площадь треугольника как прямоугольник 5 × 4 минус три прямоугольных треугольника', svg: function () {
    var b = '', i, j, x, y, s1 = 32, o1 = [30, 200];
    var pg = [[2, 0], [6, 3], [4, 5], [0, 1]], q1 = function (x, y) { return [o1[0] + x * s1, o1[1] - y * s1]; };
    for (i = 0; i <= 6; i++) b += seg(q1(i, 0), q1(i, 5), 'gr');
    for (j = 0; j <= 5; j++) b += seg(q1(0, j), q1(6, j), 'gr');
    b += poly(pg.map(function (v) { return q1(v[0], v[1]); }), 'c1 f1');
    var nIn = 0, nB = 0;
    for (x = 0; x <= 6; x++) for (y = 0; y <= 5; y++) {
      var mn = Infinity;
      for (i = 0; i < 4; i++) { var a = pg[i], c = pg[(i + 1) % 4]; mn = Math.min(mn, (c[0] - a[0]) * (y - a[1]) - (c[1] - a[1]) * (x - a[0])); }
      if (mn > 0) { nIn++; b += C(q1(x, y)[0], q1(x, y)[1], 4, 'p3'); } else if (mn === 0) { nB++; b += C(q1(x, y)[0], q1(x, y)[1], 4.5, 'p2'); }
    }
    b += T(126, 224, 'B = ' + nIn + ', Γ = ' + nB, 't tb', 'middle') + T(126, 246, 'S = ' + nIn + ' + ' + nB + '/2 − 1 = ' + (nIn + nB / 2 - 1), 't tb ti', 'middle');
    var s2 = 36, o2 = [340, 200], q2 = function (x, y) { return [o2[0] + x * s2, o2[1] - y * s2]; };
    for (i = 0; i <= 5; i++) b += seg(q2(i, 0), q2(i, 4), 'gr');
    for (j = 0; j <= 4; j++) b += seg(q2(0, j), q2(5, j), 'gr');
    b += poly([q2(0, 0), q2(5, 0), q2(5, 1)], 'c4 thin f4') + poly([q2(5, 1), q2(5, 4), q2(2, 4)], 'c4 thin f4') + poly([q2(2, 4), q2(0, 4), q2(0, 0)], 'c4 thin f4') +
      poly([q2(0, 0), q2(5, 1), q2(2, 4)], 'c1 f1') + box(o2[0], o2[1] - 4 * s2, 5 * s2, 4 * s2, 'c5 thin fn', 1) +
      T(q2(3.6, 0.3)[0], q2(3.6, 0.3)[1] + 4, '2,5', 'ts tb', 'middle') + T(q2(4.1, 3)[0], q2(4.1, 3)[1] + 5, '4,5', 'ts tb', 'middle') + T(q2(0.65, 2.7)[0], q2(0.65, 2.7)[1] + 5, '4', 'ts tb', 'middle') +
      T(q2(2.4, 1.7)[0], q2(2.4, 1.7)[1] + 5, 'S', 't tb ti', 'middle') +
      T(430, 224, '5 · 4 = 20', 't tb', 'middle') + T(430, 246, 'S = 20 − 2,5 − 4,5 − 4 = 9', 't tb ti', 'middle');
    return svg(600, 255, b, 'Площади на клетчатой бумаге');
  } };
  F['m-gr-line'] = { cap: 'Прямая через (0; 3) и (2; −1): k = Δy / Δx = −4 / 2 = −2, b = 3 — точка пересечения с осью Oy. Уравнение y = −2x + 3, нуль x = 1,5', svg: function () {
    return plot({ x: [-2, 5], y: [-3, 5], w: 420, h: 320, label: 'Прямая по двум точкам', fns: [{ f: function (x) { return -2 * x + 3; }, c: 'c1' }],
      extra: function (sx, sy) {
        return L(sx(0), sy(3), sx(2), sy(3), 'c3 d') + L(sx(2), sy(3), sx(2), sy(-1), 'c2 d') + C(sx(0), sy(3), 5, 'p2') + C(sx(2), sy(-1), 5, 'p2') + C(sx(1.5), sy(0), 5, 'p3') +
          T(sx(1), sy(3) - 8, 'Δx = 2', 't tb tg', 'middle') + T(sx(2) + 6, sy(1), 'Δy = −4', 't tb tr') + T(sx(2) - 8, sy(-1) + 16, '(2; −1)', 'ts', 'end') + T(sx(1.5) + 6, sy(0) - 6, '1,5', 't tb tg') +
          T(sx(2.4), sy(4.4), 'k = −4 / 2 = −2', 't tb') + T(sx(2.4), sy(3.7), 'b = 3', 't tb');
      } });
  } };

  /* ---------- куда вставлять ---------- */
  V.addMap('math-calc', { 0: ['m-calc-bar'], 1: ['m-calc-powers'], 2: ['m-calc-root-trap'], 3: ['m-calc-sqrt-line'] });
  V.addMap('math-word', { 0: ['m-pct-chain'], 1: ['m-word-motion'], 2: ['m-word-work'], 3: ['m-word-mix'], 4: ['m-prog-compare'] });
  V.addMap('math-percent', { 0: ['m-pct-proportion'], 1: ['m-pct-chain'], 2: ['m-pct-compound'], 3: ['m-pct-credit'] });
  V.addMap('math-progressions', { 0: ['m-prog-arith', 'm-prog-gauss'], 1: ['m-prog-geom'], 2: ['m-prog-compare'], 3: ['m-prog-multiples'] });
  V.addMap('math-inequalities', { 0: ['m-ineq-linear'], 1: ['m-ineq-parab'], 2: ['m-ineq-frac'], 3: ['m-ineq-system'] });
  V.addMap('math-modulus', { 0: ['m-mod-distance'], 1: ['m-mod-check'], 2: ['m-mod-sum'], 3: ['m-mod-abs-parab'] });
  V.addMap('math-triangles-centers', { 0: ['m-tri-centers'], 1: ['m-tri-midline'], 2: ['m-tri-similar'], 3: ['m-tri-heron'] });
  V.addMap('math-circle-tasks', { 0: ['m-circ-tangent'], 1: ['m-circ-chords'], 2: ['m-circ-trap'], 3: ['m-circ-cyclic'] });
  V.addMap('math-vectors-coordinates', { 0: ['m-vec-coords'], 1: ['m-vec-sum'], 2: ['m-vec-dot'], 3: ['m-vec-sum-len'] });
  V.addMap('math-stat', { 0: ['m-stat-median'], 1: ['m-stat-outlier'], 2: ['m-stat-pie'], 3: ['m-stat-speed'] });
  V.addMap('math-sections', { 0: ['m-sec-tri'], 1: ['m-sec-cube2'], 2: ['m-sec-angle'], 3: ['m-sec-tetra'] });
  V.addMap('math-number-theory', { 0: ['m-nt-tree'], 1: ['m-nt-venn'], 2: ['m-nt-cycle'], 3: ['m-nt-lcm'] });
  V.addMap('math-parameter-intro', { 0: ['m-par-linear'], 1: ['m-par-disc'], 2: ['m-par-graph'], 3: ['m-par-subst'] });
  V.addMap('math-graph-reading', { 0: ['m-gr-read'], 1: ['m-gr-deriv'], 2: ['m-gr-grid'], 3: ['m-gr-line'] });
})();
