/* Иллюстрации к теории: SVG-рисунки, графики и схемы.
   KL.viz.figs[имя] = { cap: 'подпись', svg: function () { return '<svg…>' } }
   KL.viz.map[id темы] = { номер раздела: ['имя', …] } — куда движок вставит рисунки.
   В тексте теории рисунок можно поставить и вручную: <div class="viz" data-viz="имя"></div>.
   Цвета — только классы из css/app.css (раздел «Иллюстрации»), поэтому тёмная тема работает сама. */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});

  /* ---------- примитивы ---------- */
  function r(n) { return Math.round(n * 10) / 10; }
  function svg(w, h, body, label) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + (label || '') + '" xmlns="http://www.w3.org/2000/svg">' + body + '</svg>';
  }
  function L(x1, y1, x2, y2, c) { return '<line x1="' + r(x1) + '" y1="' + r(y1) + '" x2="' + r(x2) + '" y2="' + r(y2) + '" class="' + (c || 'ax') + '"/>'; }
  function T(x, y, s, c, a) { return '<text x="' + r(x) + '" y="' + r(y) + '" class="' + (c || 't') + '"' + (a ? ' text-anchor="' + a + '"' : '') + '>' + s + '</text>'; }
  function C(x, y, rad, c) { return '<circle cx="' + r(x) + '" cy="' + r(y) + '" r="' + rad + '" class="' + (c || 'p1') + '"/>'; }
  function P(d, c) { return '<path d="' + d + '" class="' + (c || 'c1') + '"/>'; }
  function poly(pts, c) { return '<polygon points="' + pts.map(function (p) { return r(p[0]) + ',' + r(p[1]); }).join(' ') + '" class="' + c + '"/>'; }
  var HEAD = { c1: 'h1', c2: 'h2', c3: 'h3', c4: 'h4', c5: 'h5', ax: 'h5' };
  /* Стрелка: линия + треугольный наконечник того же цвета */
  function A(x1, y1, x2, y2, c, size) {
    c = c || 'c1'; size = size || 9;
    var ang = Math.atan2(y2 - y1, x2 - x1), s = size;
    var bx = x2 - Math.cos(ang) * s, by = y2 - Math.sin(ang) * s;
    var h = [[x2, y2], [bx + Math.sin(ang) * s * 0.45, by - Math.cos(ang) * s * 0.45], [bx - Math.sin(ang) * s * 0.45, by + Math.cos(ang) * s * 0.45]];
    return L(x1, y1, bx, by, c.split(' ')[0] + (c.indexOf(' ') > 0 ? c.slice(c.indexOf(' ')) : '')) + poly(h, HEAD[c.split(' ')[0]] || 'h5');
  }
  /* Дуга угла с центром (cx,cy) от угла a1 до a2 (градусы, против часовой, ось y вверх) */
  function arc(cx, cy, rad, a1, a2, c) {
    var p1 = [cx + rad * Math.cos(a1 * Math.PI / 180), cy - rad * Math.sin(a1 * Math.PI / 180)];
    var p2 = [cx + rad * Math.cos(a2 * Math.PI / 180), cy - rad * Math.sin(a2 * Math.PI / 180)];
    var large = Math.abs(a2 - a1) > 180 ? 1 : 0, sweep = a2 > a1 ? 0 : 1;
    return P('M' + r(p1[0]) + ' ' + r(p1[1]) + ' A' + rad + ' ' + rad + ' 0 ' + large + ' ' + sweep + ' ' + r(p2[0]) + ' ' + r(p2[1]), c || 'c2 thin');
  }

  /* ---------- координатная плоскость ---------- */
  function plot(o) {
    var W = o.w || 380, H = o.h || 280, pad = 26;
    var sx = function (x) { return pad + (x - o.x[0]) / (o.x[1] - o.x[0]) * (W - 2 * pad); };
    var sy = function (y) { return H - pad - (y - o.y[0]) / (o.y[1] - o.y[0]) * (H - 2 * pad); };
    var b = '', st = o.step || 1, i;
    for (i = Math.ceil(o.x[0] / st) * st; i <= o.x[1]; i += st) b += L(sx(i), sy(o.y[0]), sx(i), sy(o.y[1]), 'gr');
    for (i = Math.ceil(o.y[0] / st) * st; i <= o.y[1]; i += st) b += L(sx(o.x[0]), sy(i), sx(o.x[1]), sy(i), 'gr');
    var ox = o.x[0] <= 0 && o.x[1] >= 0 ? sx(0) : sx(o.x[0]);
    var oy = o.y[0] <= 0 && o.y[1] >= 0 ? sy(0) : sy(o.y[0]);
    b += A(sx(o.x[0]) - 4, oy, sx(o.x[1]) + 12, oy, 'ax', 8) + A(ox, sy(o.y[0]) + 4, ox, sy(o.y[1]) - 12, 'ax', 8);
    var ax = o.axes || ['x', 'y'];
    b += T(sx(o.x[1]) + 10, oy + 16, ax[0], 't ti') + T(ox + 8, sy(o.y[1]) - 4, ax[1], 't ti');
    if (o.ticks !== false) {
      var tk = o.tick || st;
      for (i = Math.ceil(o.x[0] / tk) * tk; i <= o.x[1]; i += tk) if (Math.abs(i) > 1e-9) b += T(sx(i), oy + 15, String(i).replace('-', '−'), 'tn', 'middle');
      for (i = Math.ceil(o.y[0] / tk) * tk; i <= o.y[1]; i += tk) if (Math.abs(i) > 1e-9) b += T(ox - 6, sy(i) + 4, String(i).replace('-', '−'), 'tn', 'end');
      b += T(ox - 6, oy + 15, '0', 'tn', 'end');
    }
    (o.fns || []).forEach(function (fn) {
      var d = '', pen = false, from = fn.from != null ? fn.from : o.x[0], to = fn.to != null ? fn.to : o.x[1];
      var span = o.y[1] - o.y[0];
      for (var k = 0; k <= 400; k++) {
        var x = from + (to - from) * k / 400, y = fn.f(x);
        if (!isFinite(y) || y > o.y[1] + span || y < o.y[0] - span) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + r(sx(x)) + ' ' + r(sy(y)) + ' ';
        pen = true;
      }
      b += P(d, (fn.c || 'c1') + ' clip');
      if (fn.label) b += T(sx(fn.label[0]), sy(fn.label[1]), fn.label[2], 't tb ' + (fn.lc || 'ti'), fn.label[3]);
    });
    if (o.extra) b += o.extra(sx, sy);
    var id = 'clp' + (++uid);
    b = '<defs><clipPath id="' + id + '"><rect x="' + pad + '" y="' + pad + '" width="' + (W - 2 * pad) + '" height="' + (H - 2 * pad) + '"/></clipPath></defs>' + b.replace(/ clip"/g, '" clip-path="url(#' + id + ')"');
    return svg(W, H, b, o.label);
  }
  var uid = 0;

  /* ---------- шкала времени ---------- */
  function timeline(ev, from, to, label) {
    var W = 620, H = 210, x0 = 30, x1 = 590, y = 105;
    var sx = function (yr) { return x0 + (yr - from) / (to - from) * (x1 - x0); };
    var b = A(x0 - 10, y, x1 + 18, y, 'ax', 9);
    for (var t = Math.ceil(from / 50) * 50; t <= to; t += 50) b += L(sx(t), y - 4, sx(t), y + 4, 'ax') + T(sx(t), y + 18, t, 'tn', 'middle');
    ev.forEach(function (e, i) {
      var up = i % 2 === 0, far = i % 4 >= 2, x = sx(e[0]), ly = up ? y - 34 - (far ? 36 : 0) : y + 44 + (far ? 36 : 0);
      if (e[2]) b += '<rect x="' + r(x) + '" y="' + (y - 5) + '" width="' + r(sx(e[2]) - x) + '" height="10" class="f2 k2" rx="3"/>';
      b += C(x, y, 5, 'p2') + L(x, up ? y - 6 : y + 26, x, up ? ly + 4 : ly - 14, 'gr');
      b += T(x, ly, '<tspan class="tb mono">' + e[0] + (e[2] ? '–' + e[2] : '') + '</tspan>', 't tr', 'middle');
      b += T(x, ly + (up ? -15 : 15), e[1], 'ts', 'middle');
    });
    return svg(W, H, b, label);
  }

  var F = {};

  /* ================= Математика ================= */
  F['func-basic'] = { cap: 'Основные графики: прямая, парабола, корень и гипербола', svg: function () {
    return plot({ x: [-4, 4], y: [-3, 4], label: 'Графики y=x, y=x², y=√x, y=1/x', fns: [
      { f: function (x) { return x; }, c: 'c5', label: [-2.6, -2.2, 'y = x'] , lc: 'tm' },
      { f: function (x) { return x * x; }, c: 'c1', label: [-2.3, 3.6, 'y = x²'] },
      { f: function (x) { return Math.sqrt(x); }, from: 0, c: 'c3', label: [3.1, 1.3, 'y = √x'], lc: 'tg' },
      { f: function (x) { return 1 / x; }, c: 'c2', label: [2.2, 0.85, 'y = 1/x'], lc: 'tr' }
    ] });
  } };
  F['parabola'] = { cap: 'Парабола y = x² − 2x − 3: вершина x₀ = −b/2a = 1, корни −1 и 3, ось симметрии', svg: function () {
    return plot({ x: [-3, 5], y: [-5, 5], label: 'Парабола', fns: [{ f: function (x) { return x * x - 2 * x - 3; }, c: 'c1', label: [3.4, 3.2, 'a &gt; 0: ветви вверх', 'start'] }],
      extra: function (sx, sy) {
        return L(sx(1), sy(-5), sx(1), sy(5), 'c2 thin d') + C(sx(1), sy(-4), 5, 'p2') + T(sx(1) + 9, sy(-4) + 4, 'вершина (1; −4)', 't tr') +
          C(sx(-1), sy(0), 5, 'p1') + C(sx(3), sy(0), 5, 'p1') + T(sx(-1) - 4, sy(0) - 8, 'x₁', 't tb ti', 'end') + T(sx(3) + 6, sy(0) - 8, 'x₂', 't tb ti') +
          C(sx(0), sy(-3), 4, 'p3') + T(sx(0) - 8, sy(-3) + 4, 'c = −3', 't tg', 'end');
      } });
  } };
  F['hyperbola-shift'] = { cap: 'Сдвиг графика: y = 1/(x − 2) + 1 — гипербола y = 1/x, сдвинутая на 2 вправо и на 1 вверх', svg: function () {
    return plot({ x: [-3, 6], y: [-3, 5], label: 'Сдвиг гиперболы', fns: [
      { f: function (x) { return 1 / x; }, c: 'c5 thin d' },
      { f: function (x) { return 1 / (x - 2) + 1; }, c: 'c1', label: [3.3, 2.6, 'y = 1/(x−2) + 1'] }
    ], extra: function (sx, sy) {
      return L(sx(2), sy(-3), sx(2), sy(5), 'c2 thin d') + L(sx(-3), sy(1), sx(6), sy(1), 'c2 thin d') + T(sx(2) + 5, sy(4.6), 'x = 2', 't tr') + T(sx(-2.9), sy(1) - 6, 'y = 1', 't tr');
    } });
  } };
  F['right-triangle'] = { cap: 'Прямоугольный треугольник: теорема Пифагора и определения синуса, косинуса, тангенса', svg: function () {
    var b = poly([[60, 220], [320, 220], [60, 60]], 'c1 f1') + '<rect x="60" y="202" width="18" height="18" class="c1 thin fn"/>' +
      arc(320, 220, 46, 180, 148.4, 'c2') + T(262, 210, 'α', 't tb tr') +
      T(44, 145, 'a', 't tb ti', 'end') + T(190, 242, 'b', 't tb ti', 'middle') + T(200, 128, 'c', 't tb ti') +
      T(50, 234, 'C', 'ts', 'end') + T(330, 234, 'A', 'ts') + T(50, 56, 'B', 'ts', 'end') +
      T(360, 90, 'a² + b² = c²', 't tb') + T(360, 122, 'sin α = a / c', 't') + T(360, 146, 'cos α = b / c', 't') + T(360, 170, 'tg α = a / b', 't');
    return svg(520, 260, b, 'Прямоугольный треугольник');
  } };
  F['circle-angles'] = { cap: 'Вписанный угол равен половине центрального, опирающегося на ту же дугу', svg: function () {
    var cx = 170, cy = 140, R = 100;
    var pt = function (deg) { return [cx + R * Math.cos(deg * Math.PI / 180), cy - R * Math.sin(deg * Math.PI / 180)]; };
    var Ap = pt(210), Bp = pt(330), Cp = pt(100);
    var b = C(cx, cy, R, 'c5 fn') + P('M' + r(Ap[0]) + ' ' + r(Ap[1]) + ' A' + R + ' ' + R + ' 0 0 0 ' + r(Bp[0]) + ' ' + r(Bp[1]), 'c2 wide') +
      poly([Ap, [cx, cy], Bp], 'c1 f1') + L(Ap[0], Ap[1], Cp[0], Cp[1], 'c3') + L(Bp[0], Bp[1], Cp[0], Cp[1], 'c3') +
      C(cx, cy, 4, 'p1') + C(Ap[0], Ap[1], 4, 'p5') + C(Bp[0], Bp[1], 4, 'p5') + C(Cp[0], Cp[1], 4, 'p3') +
      T(cx + 8, cy + 4, 'O', 't tb') + T(Ap[0] - 8, Ap[1] + 16, 'A', 't tb', 'end') + T(Bp[0] + 8, Bp[1] + 16, 'B', 't tb') + T(Cp[0], Cp[1] - 10, 'C', 't tb', 'middle') +
      arc(cx, cy, 22, 210, 330, 'c1') + T(cx, cy + 40, '120°', 't ti tb', 'middle') + arc(Cp[0], Cp[1], 30, 256, 292, 'c3') + T(Cp[0], Cp[1] + 48, '60°', 't tg tb', 'middle') +
      T(310, 110, '∠ACB = ½ ∠AOB', 't tb') + T(310, 136, 'опираются на дугу AB', 'ts') + T(310, 160, 'угол на диаметр = 90°', 'ts');
    return svg(500, 260, b, 'Вписанный и центральный угол');
  } };
  F['areas'] = { cap: 'Площади главных фигур: высота всегда перпендикулярна основанию', svg: function () {
    var b = poly([[20, 150], [150, 150], [100, 50]], 'c1 f1') + L(100, 50, 100, 150, 'c2 d') + T(106, 110, 'h', 't tb tr') + T(85, 168, 'a', 't tb ti') + T(85, 196, 'S = ½·a·h', 't tb', 'middle') +
      poly([[190, 150], [310, 150], [350, 50], [230, 50]], 'c1 f3') + L(270, 50, 270, 150, 'c2 d') + T(276, 110, 'h', 't tb tr') + T(250, 168, 'a', 't tb ti') + T(270, 196, 'S = a·h', 't tb', 'middle') +
      poly([[390, 150], [560, 150], [520, 50], [430, 50]], 'c1 f4') + L(470, 50, 470, 150, 'c2 d') + T(476, 110, 'h', 't tb tr') + T(475, 168, 'a', 't tb ti') + T(475, 42, 'b', 't tb ti') + T(475, 196, 'S = ½(a + b)·h', 't tb', 'middle');
    return svg(580, 210, b, 'Площади треугольника, параллелограмма, трапеции');
  } };
  F['cube'] = { cap: 'Куб с ребром a: диагональ грани a√2, диагональ куба a√3, объём a³', svg: function () {
    var o = [60, 200], s = 130, dx = 55, dy = -45;
    var p = function (x, y, z) { return [o[0] + x * s + z * dx, o[1] - y * s + z * dy]; };
    var A0 = p(0, 0, 0), B0 = p(1, 0, 0), C0 = p(1, 0, 1), D0 = p(0, 0, 1), A1 = p(0, 1, 0), B1 = p(1, 1, 0), C1 = p(1, 1, 1), D1 = p(0, 1, 1);
    var e = function (a, b, c) { return L(a[0], a[1], b[0], b[1], c || 'c1'); };
    var b = poly([A0, B0, B1, A1], 'f1 k0') + e(A0, B0) + e(B0, C0) + e(A0, A1) + e(B0, B1) + e(C0, C1) + e(A1, B1) + e(B1, C1) + e(C1, D1) + e(D1, A1) +
      e(A0, D0, 'c1 thin d') + e(D0, C0, 'c1 thin d') + e(D0, D1, 'c1 thin d') +
      e(A0, C1, 'c2') + e(A0, B1, 'c3 thin') +
      T(A0[0] - 6, A0[1] + 16, 'A', 'ts', 'end') + T(C1[0] + 6, C1[1] - 4, 'C₁', 'ts') + T((A0[0] + B0[0]) / 2, A0[1] + 18, 'a', 't tb ti', 'middle') +
      T(300, 70, 'd = a√3', 't tb tr') + T(300, 96, 'грань: a√2', 't tg') + T(300, 122, 'V = a³', 't tb') + T(300, 146, 'S = 6a²', 't');
    return svg(440, 230, b, 'Куб');
  } };
  F['bodies'] = { cap: 'Цилиндр и конус с одинаковыми r и h: объём конуса ровно в 3 раза меньше', svg: function () {
    var b = '<ellipse cx="110" cy="50" rx="70" ry="18" class="c1 f1"/>' + L(40, 50, 40, 180) .replace('ax', 'c1') + L(180, 50, 180, 180).replace('ax', 'c1') +
      P('M40 180 A70 18 0 0 0 180 180', 'c1') + P('M40 180 A70 18 0 0 1 180 180', 'c1 thin d') + L(110, 50, 180, 50, 'c2') + T(145, 44, 'r', 't tb tr', 'middle') +
      L(110, 50, 110, 180, 'c2 d') + T(118, 120, 'h', 't tb tr') + T(110, 222, 'V = πr²h', 't tb', 'middle') +
      P('M290 50 L220 180 M290 50 L360 180', 'c1') + P('M220 180 A70 18 0 0 0 360 180', 'c1') + P('M220 180 A70 18 0 0 1 360 180', 'c1 thin d') +
      L(290, 50, 290, 180, 'c2 d') + L(290, 180, 360, 180, 'c2') + T(298, 130, 'h', 't tb tr') + T(325, 174, 'r', 't tb tr', 'middle') + T(290, 222, 'V = ⅓πr²h', 't tb', 'middle');
    return svg(400, 235, b, 'Цилиндр и конус');
  } };
  F['tangent'] = { cap: 'Геометрический смысл производной: f′(x₀) = tg α — угловой коэффициент касательной', svg: function () {
    return plot({ x: [-2, 6], y: [-2, 6], label: 'Касательная', fns: [
      { f: function (x) { return x * x / 4; }, c: 'c1', label: [4.3, 5.6, 'y = f(x)'] },
      { f: function (x) { return x - 1; }, c: 'c2', label: [5.1, 3.4, 'касательная', 'end'], lc: 'tr' }
    ], extra: function (sx, sy) {
      return C(sx(2), sy(1), 5, 'p2') + L(sx(2), sy(0), sx(2), sy(1), 'c5 thin d') + T(sx(2) + 3, sy(0) + 15, 'x₀', 't tb tr') +
        arc(sx(1), sy(0), 26, 0, 45, 'c3') + T(sx(1) + 30, sy(0) - 8, 'α', 't tb tg');
    } });
  } };
  F['extrema'] = { cap: 'Экстремумы: f′ меняет знак с «+» на «−» в точке максимума и с «−» на «+» в точке минимума', svg: function () {
    return plot({ x: [-3, 3], y: [-3, 3], label: 'Максимум и минимум', fns: [{ f: function (x) { return x * x * x / 3 - x; }, c: 'c1', label: [2.1, 2.6, 'y = f(x)'] }],
      extra: function (sx, sy) {
        return C(sx(-1), sy(2 / 3), 5, 'p3') + T(sx(-1), sy(2 / 3) - 12, 'max', 't tb tg', 'middle') + C(sx(1), sy(-2 / 3), 5, 'p2') + T(sx(1), sy(-2 / 3) + 22, 'min', 't tb tr', 'middle') +
          T(sx(-2), sy(-2.6), 'f′ &gt; 0', 't tg', 'middle') + T(sx(0), sy(-2.6), 'f′ &lt; 0', 't tr', 'middle') + T(sx(2), sy(-2.6), 'f′ &gt; 0', 't tg', 'middle');
      } });
  } };
  F['unit-circle'] = { cap: 'Единичная окружность: cos α — абсцисса точки, sin α — ордината', svg: function () {
    var cx = 150, cy = 140, R = 105, a = 40 * Math.PI / 180, px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
    var b = A(30, cy, 275, cy, 'ax', 8) + A(cx, 260, cx, 18, 'ax', 8) + C(cx, cy, R, 'c5 fn') +
      L(cx, cy, px, py, 'c1') + L(px, py, px, cy, 'c2 d') + L(px, py, cx, py, 'c3 d') + C(px, py, 5, 'p1') +
      L(cx, cy, px, cy, 'c2 wide') + L(cx, cy, cx, py, 'c3 wide') + arc(cx, cy, 26, 0, 40, 'c1') + T(cx + 32, cy - 8, 'α', 't tb ti') +
      T(cx + (px - cx) / 2, cy + 18, 'cos α', 't tb tr', 'middle') + T(cx - 6, cy - (cy - py) / 2 + 4, 'sin α', 't tb tg', 'end') +
      T(cx + R + 4, cy + 16, '1', 'tn') + T(cx - R - 4, cy + 16, '−1', 'tn', 'end') + T(cx + 6, cy - R - 4, '1', 'tn') +
      T(248, 48, 'I', 't tm') + T(48, 48, 'II', 't tm') + T(48, 240, 'III', 't tm') + T(248, 240, 'IV', 't tm') +
      T(300, 70, 'sin²α + cos²α = 1', 't tb') + T(300, 100, 'I: sin +, cos +', 'ts') + T(300, 122, 'II: sin +, cos −', 'ts') + T(300, 144, 'III: sin −, cos −', 'ts') + T(300, 166, 'IV: sin −, cos +', 'ts');
    return svg(470, 270, b, 'Единичная окружность');
  } };
  F['exp-log'] = { cap: 'y = 2ˣ и y = log₂x — взаимно обратные функции, их графики симметричны относительно y = x', svg: function () {
    return plot({ x: [-3, 5], y: [-3, 5], label: 'Показательная и логарифмическая функции', fns: [
      { f: function (x) { return x; }, c: 'c5 thin d' },
      { f: function (x) { return Math.pow(2, x); }, c: 'c1', label: [0.3, 4.2, 'y = 2ˣ', 'end'] },
      { f: function (x) { return Math.log(x) / Math.LN2; }, from: 0.01, c: 'c2', label: [4.9, 1.7, 'y = log₂x', 'end'], lc: 'tr' }
    ], extra: function (sx, sy) { return C(sx(0), sy(1), 4, 'p1') + C(sx(1), sy(0), 4, 'p2'); } });
  } };
  F['prob-tree'] = { cap: 'Дерево вероятностей: вдоль ветки вероятности умножаются, разные ветки складываются', svg: function () {
    var b = C(40, 130, 6, 'p5') + L(46, 127, 170, 60, 'c1') + L(46, 133, 170, 200, 'c5') +
      T(96, 78, '0,3', 't tb ti') + T(96, 196, '0,7', 't tm') + T(182, 64, 'A', 't tb') + T(182, 204, 'не A', 't') +
      L(200, 58, 330, 28, 'c1') + L(200, 62, 330, 100, 'c5') + L(214, 198, 330, 168, 'c5') + L(214, 202, 330, 236, 'c5') +
      T(262, 34, '0,4', 't tb ti') + T(262, 96, '0,6', 't tm') + T(262, 174, '0,4', 't tm') + T(262, 236, '0,6', 't tm') +
      T(340, 32, 'B: 0,3 · 0,4 = 0,12', 't tb tr') + T(340, 104, 'не B: 0,18', 't') + T(340, 172, 'B: 0,28', 't') + T(340, 240, 'не B: 0,42', 't') +
      T(340, 136, 'P(B) = 0,12 + 0,28 = 0,4', 't tb tg');
    return svg(560, 260, b, 'Дерево вероятностей');
  } };
  F['intervals'] = { cap: 'Метод интервалов для (x + 2)(x − 3) ≤ 0: ответ [−2; 3]', svg: function () {
    var b = A(20, 90, 540, 90, 'ax', 9) + T(536, 112, 'x', 't ti') +
      P('M150 90 C 220 20, 330 20, 400 90', 'c2 thin') + P('M40 70 C 90 60, 130 66, 150 90', 'c3 thin') + P('M400 90 C 420 66, 460 60, 510 70', 'c3 thin') +
      '<rect x="150" y="84" width="250" height="12" class="f2 k0"/>' +
      C(150, 90, 7, 'p2') + '<circle cx="400" cy="90" r="7" class="p2"/>' + T(150, 122, '−2', 't tb', 'middle') + T(400, 122, '3', 't tb', 'middle') +
      T(80, 50, '+', 't tb tg', 'middle') + T(275, 48, '−', 't tb tr', 'middle') + T(470, 50, '+', 't tb tg', 'middle') +
      T(275, 148, 'закрашенные точки входят в ответ (нестрогое неравенство)', 'ts', 'middle');
    return svg(560, 160, b, 'Метод интервалов');
  } };

  /* ================= Физика ================= */
  F['v-t'] = { cap: 'График скорости при равноускоренном движении: площадь под графиком — перемещение', svg: function () {
    return plot({ x: [0, 5], y: [0, 10], step: 1, tick: 1, axes: ['t, с', 'v, м/с'], label: 'График v(t)', fns: [{ f: function (t) { return 2 + 1.5 * t; }, from: 0, to: 4.6, c: 'c1', label: [3.3, 8.3, 'v = v₀ + at'] }],
      extra: function (sx, sy) {
        return poly([[sx(0), sy(0)], [sx(0), sy(2)], [sx(4), sy(8)], [sx(4), sy(0)]], 'f1 k0 fade') + L(sx(4), sy(0), sx(4), sy(8), 'c5 thin d') +
          T(sx(2), sy(2.6), 'S = площадь', 't tb ti', 'middle') + T(sx(0) + 8, sy(2) - 6, 'v₀', 't tb tr');
      } });
  } };
  F['projectile'] = { cap: 'Бросок под углом: по горизонтали движение равномерное, по вертикали — с ускорением g', svg: function () {
    return plot({ x: [0, 44], y: [0, 14], step: 5, tick: 10, w: 460, h: 250, axes: ['x, м', 'y, м'], label: 'Траектория броска', ticks: true,
      fns: [{ f: function (x) { return x - x * x / 40; }, from: 0, to: 40, c: 'c1' }],
      extra: function (sx, sy) {
        return A(sx(0), sy(0), sx(9), sy(9), 'c2', 10) + T(sx(8.6), sy(9.6), 'v₀', 't tb tr') + A(sx(0), sy(0), sx(9), sy(0), 'c3', 9) + T(sx(9), sy(0) - 6, 'vₓ', 't tb tg') +
          arc(sx(0), sy(0), 30, 0, 29, 'c5') + T(sx(0) + 34, sy(0) - 6, 'α', 't tb') +
          A(sx(20), sy(10), sx(28), sy(10), 'c3', 8) + T(sx(24), sy(10) - 8, 'vₓ = const', 'ts', 'middle') + L(sx(20), sy(0), sx(20), sy(10), 'c5 thin d') + T(sx(20) + 5, sy(5), 'H', 't tb') +
          T(sx(40), sy(0) - 8, 'L', 't tb', 'middle');
      } });
  } };
  F['circular'] = { cap: 'Движение по окружности: скорость направлена по касательной, ускорение — к центру', svg: function () {
    var cx = 150, cy = 125, R = 90, a = 50 * Math.PI / 180, px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
    var b = C(cx, cy, R, 'c5 fn d') + C(cx, cy, 4, 'p5') + L(cx, cy, px, py, 'c5 thin') + T(cx + 30, cy - 18, 'R', 't tb') + C(px, py, 7, 'p1') +
      A(px, py, px + 70 * Math.sin(a), py + 70 * Math.cos(a), 'c1', 10) + T(px + 64 * Math.sin(a) + 8, py + 64 * Math.cos(a) + 4, 'v', 't tb ti') +
      A(px, py, px - 50 * Math.cos(a), py + 50 * Math.sin(a), 'c2', 10) + T(px - 44 * Math.cos(a) - 14, py + 44 * Math.sin(a) + 18, 'a', 't tb tr') +
      T(290, 90, 'a = v² / R', 't tb tr') + T(290, 118, 'v = 2πR / T', 't tb') + T(290, 146, 'ω = 2π / T', 't');
    return svg(430, 250, b, 'Движение по окружности');
  } };
  F['incline'] = { cap: 'Силы на наклонной плоскости: mg раскладываем вдоль и поперёк плоскости', svg: function () {
    var a = 30 * Math.PI / 180;
    var b = poly([[40, 220], [360, 220], [360, 35]], 'f4 k0') + L(40, 220, 360, 220, 'c5') + L(40, 220, 360, 35, 'c5') + arc(40, 220, 44, 0, 30, 'c5') + T(92, 212, 'α', 't tb');
    var bx = 210, by = 220 - (210 - 40) * Math.tan(a);
    var n = [-Math.sin(a), -Math.cos(a)], t = [Math.cos(a), -Math.sin(a)];
    var cx = bx + n[0] * 20, cy = by + n[1] * 20;
    b += '<g transform="rotate(-30 ' + bx + ' ' + by + ')"><rect x="' + (bx - 28) + '" y="' + (by - 40) + '" width="56" height="40" rx="4" class="c1 f1"/></g>';
    b += A(cx, cy, cx, cy + 95, 'c2', 10) + T(cx + 8, cy + 90, 'mg', 't tb tr') +
      A(cx, cy, cx + n[0] * 80, cy + n[1] * 80, 'c1', 10) + T(cx + n[0] * 84 - 16, cy + n[1] * 84, 'N', 't tb ti') +
      A(cx, cy, cx + t[0] * 70, cy + t[1] * 70, 'c3', 10) + T(cx + t[0] * 72 + 6, cy + t[1] * 72, 'Fтр', 't tb tg') +
      T(380, 80, 'N = mg·cos α', 't tb') + T(380, 106, 'Fтр = μN', 't') + T(380, 132, 'ma = mg·sin α − μmg·cos α', 'ts');
    return svg(600, 240, b, 'Наклонная плоскость');
  } };
  F['sine-wave'] = { cap: 'Гармонические колебания x = A·sin(2πt / T): амплитуда A и период T', svg: function () {
    return plot({ x: [0, 4.4], y: [-2, 2], step: 0.5, tick: 1, axes: ['t', 'x'], ticks: false, w: 460, h: 220, label: 'Синусоида', fns: [{ f: function (t) { return 1.5 * Math.sin(Math.PI * t); }, c: 'c1' }],
      extra: function (sx, sy) {
        return A(sx(0.5), sy(0), sx(0.5), sy(1.5), 'c2', 8) + T(sx(0.5) + 6, sy(0.9), 'A', 't tb tr') +
          A(sx(0.5), sy(-1.75), sx(2.5), sy(-1.75), 'c3', 8) + A(sx(2.5), sy(-1.75), sx(0.5), sy(-1.75), 'c3', 8) + T(sx(1.5), sy(-1.75) - 6, 'T', 't tb tg', 'middle') +
          L(sx(0.5), sy(1.5), sx(0.5), sy(-1.9), 'c5 thin d') + L(sx(2.5), sy(1.5), sx(2.5), sy(-1.9), 'c5 thin d') + T(sx(3.5), sy(1.75), 'ν = 1 / T', 't tb', 'middle');
      } });
  } };
  F['pendulum'] = { cap: 'Математический маятник: период зависит только от длины нити и g', svg: function () {
    var ox = 150, oy = 30, l = 170, a = 24 * Math.PI / 180, bx = ox + l * Math.sin(a), by = oy + l * Math.cos(a);
    var b = L(80, 30, 220, 30, 'c5 wide') + L(ox, oy, ox, oy + l + 10, 'c5 thin d') + L(ox, oy, bx, by, 'c1') + C(bx, by, 14, 'p1') +
      P('M' + r(ox - l * Math.sin(a)) + ' ' + r(oy + l * Math.cos(a)) + ' A' + l + ' ' + l + ' 0 0 0 ' + r(bx) + ' ' + r(by), 'c2 thin d') +
      arc(ox, oy, 40, 270, 294, 'c3') + T(ox + 8, oy + 58, 'α', 't tb tg') + T(ox + (bx - ox) / 2 + 10, oy + (by - oy) / 2, 'l', 't tb ti') +
      T(260, 100, 'T = 2π√(l / g)', 't tb tr') + T(260, 128, 'не зависит от массы', 'ts') + T(260, 150, 'и амплитуды (малой)', 'ts');
    return svg(440, 230, b, 'Маятник');
  } };
  function resistor(x, y, v) { return v ? '<rect x="' + (x - 9) + '" y="' + (y - 22) + '" width="18" height="44" rx="2" class="c1 fs"/>' : '<rect x="' + (x - 22) + '" y="' + (y - 9) + '" width="44" height="18" rx="2" class="c1 fs"/>'; }
  F['circuits'] = { cap: 'Последовательное и параллельное соединение проводников', svg: function () {
    var bat = function (x, y) { return L(x, y - 14, x, y + 14, 'c5') + L(x + 12, y - 8, x + 12, y + 8, 'c5 wide'); };
    var b = P('M30 60 H78 M122 60 H158 M202 60 H250 V170 H142 M130 170 H30 V60', 'c5') + resistor(100, 60) + resistor(180, 60) + bat(130, 170) +
      T(100, 45, 'R₁', 't tb ti', 'middle') + T(180, 45, 'R₂', 't tb ti', 'middle') + T(140, 205, 'ток I одинаков', 'ts', 'middle') + T(140, 230, 'R = R₁ + R₂', 't tb tr', 'middle');
    b += P('M310 100 H360 M360 70 V130 M360 70 H398 M442 70 H480 M360 130 H398 M442 130 H480 M480 70 V130 M480 100 H530 V170 H422 M410 170 H310 V100', 'c5') +
      resistor(420, 70) + resistor(420, 130) + bat(410, 170) + C(360, 100, 3.5, 'p5') + C(480, 100, 3.5, 'p5') +
      T(420, 55, 'R₁', 't tb ti', 'middle') + T(420, 115, 'R₂', 't tb ti', 'middle') + T(420, 205, 'напряжение U одинаково', 'ts', 'middle') + T(420, 230, '1/R = 1/R₁ + 1/R₂', 't tb tr', 'middle');
    return svg(560, 245, b, 'Соединения проводников');
  } };
  F['lens'] = { cap: 'Собирающая линза: предмет дальше 2F — изображение действительное, перевёрнутое, уменьшенное', svg: function () {
    var y0 = 130, x0 = 300, f = 80;
    var b = L(20, y0, 580, y0, 'c5 thin') + P('M300 30 Q318 130 300 230 Q282 130 300 30', 'c1 f1') + A(300, 130, 300, 26, 'c1', 8) + A(300, 130, 300, 234, 'c1', 8);
    [-2, -1, 1, 2].forEach(function (k) { b += C(x0 + k * f, y0, 3.5, 'p5') + T(x0 + k * f, y0 + 18, (Math.abs(k) === 2 ? '2F' : 'F'), 'tn', 'middle'); });
    var ox = x0 - 2.6 * f, oh = 60, d = 2.6 * f, di = d * f / (d - f), ih = -oh * di / d, ix = x0 + di;
    b += A(ox, y0, ox, y0 - oh, 'c3', 10) + T(ox - 6, y0 - oh + 4, 'предмет', 'ts', 'end') +
      L(ox, y0 - oh, x0, y0 - oh, 'c2 thin') + L(x0, y0 - oh, ix, y0 - ih, 'c2 thin') +
      L(ox, y0 - oh, ix, y0 - ih, 'c2 thin') + A(ix, y0, ix, y0 - ih, 'c2', 10) + T(ix + 8, y0 - ih, 'изображение', 'ts');
    b += T(420, 40, '1/F = 1/d + 1/f', 't tb tr');
    return svg(600, 250, b, 'Построение в линзе');
  } };
  F['refraction'] = { cap: 'Преломление: при переходе в оптически более плотную среду луч прижимается к нормали', svg: function () {
    var b = '<rect x="20" y="120" width="360" height="110" class="f1 k0"/>' + L(20, 120, 380, 120, 'c5') + L(200, 20, 200, 225, 'c5 thin d') +
      A(80, 30, 198, 118, 'c2', 10) + A(200, 120, 250, 222, 'c2', 10) + arc(200, 120, 40, 90, 126.7, 'c1') + arc(200, 120, 40, 270, 296.1, 'c3') +
      T(180, 72, 'α', 't tb ti', 'end') + T(222, 180, 'β', 't tb tg') + T(30, 110, 'воздух, n₁', 'ts') + T(30, 220, 'стекло, n₂ &gt; n₁', 'ts') +
      T(400, 90, 'n₁·sin α = n₂·sin β', 't tb tr') + T(400, 118, 'β &lt; α', 't');
    return svg(600, 240, b, 'Преломление света');
  } };
  F['isoprocesses'] = { cap: 'Изопроцессы на диаграмме p–V: изотерма — гипербола, изобара — горизонталь, изохора — вертикаль', svg: function () {
    return plot({ x: [0, 6], y: [0, 6], ticks: false, axes: ['V', 'p'], label: 'Изопроцессы', fns: [{ f: function (v) { return 6 / v; }, from: 1.05, c: 'c1', label: [4.7, 1.6, 'T = const'] }],
      extra: function (sx, sy) {
        return A(sx(1.5), sy(4.5), sx(4.5), sy(4.5), 'c2', 10) + T(sx(3), sy(4.5) - 8, 'p = const', 't tb tr', 'middle') +
          A(sx(5.2), sy(1.4), sx(5.2), sy(4.2), 'c3', 10) + T(sx(5.2) - 8, sy(3.4), 'V = const', 't tb tg', 'end');
      } });
  } };
  F['lever'] = { cap: 'Правило рычага: F₁·l₁ = F₂·l₂ — моменты сил равны', svg: function () {
    var b = poly([[220, 130], [205, 160], [235, 160]], 'c5 f4') + L(40, 124, 460, 124, 'c1 wide') + A(70, 124, 70, 200, 'c2', 10) + A(400, 124, 400, 170, 'c2', 10) +
      T(78, 196, 'F₁', 't tb tr') + T(408, 168, 'F₂', 't tb tr') + A(145, 100, 70, 100, 'c3', 8) + A(145, 100, 220, 100, 'c3', 8) + T(145, 92, 'l₁', 't tb tg', 'middle') +
      A(310, 100, 220, 100, 'c3', 8) + A(310, 100, 400, 100, 'c3', 8) + T(310, 92, 'l₂', 't tb tg', 'middle') + T(250, 30, 'M = F·l', 't tb', 'middle');
    return svg(500, 210, b, 'Рычаг');
  } };
  F['bohr'] = { cap: 'Постулаты Бора: при переходе на более низкий уровень атом излучает фотон hν = E₃ − E₂', svg: function () {
    var ys = [210, 120, 80, 60], b = '';
    ys.forEach(function (y, i) { b += L(60, y, 300, y, i === 0 ? 'c1 wide' : 'c1') + T(52, y + 4, 'n = ' + (i + 1), 'ts', 'end') + T(310, y + 4, 'E' + ['₁', '₂', '₃', '₄'][i], 't ti'); });
    b += A(150, 80, 150, 118, 'c2', 10) + P('M160 100 q8 -12 16 0 t16 0 t16 0 t16 0 t16 0', 'c2') + A(236, 100, 262, 100, 'c2', 8) + T(270, 150, 'hν — излучение', 'ts') +
      A(110, 208, 110, 84, 'c3', 10) + T(104, 160, 'поглощение', 'ts', 'end') + T(340, 40, 'hν = Eₘ − Eₙ', 't tb tr');
    return svg(470, 230, b, 'Энергетические уровни');
  } };

  /* ================= Химия ================= */
  F['atom-shells'] = { cap: 'Атом натрия Na: заряд ядра +11, электроны по уровням 2, 8, 1 — один валентный электрон', svg: function () {
    var cx = 130, cy = 125, b = C(cx, cy, 22, 'c2 f2') + T(cx, cy + 5, '+11', 't tb tr', 'middle');
    [[45, 2], [75, 8], [105, 1]].forEach(function (sh, k) {
      b += C(cx, cy, sh[0], 'c5 fn thin');
      for (var i = 0; i < sh[1]; i++) { var a = (i / sh[1]) * 2 * Math.PI + k; b += C(cx + sh[0] * Math.cos(a), cy + sh[0] * Math.sin(a), 6, k === 2 ? 'p3' : 'p1'); }
    });
    b += T(270, 70, '1s² 2s² 2p⁶ 3s¹', 't tb mono') + T(270, 100, 'уровней = номер периода (3)', 'ts') + T(270, 124, 'валентных e⁻ = номер группы (I)', 'ts') + T(270, 148, 'p⁺ = e⁻ = Z = 11', 'ts') + T(270, 172, 'n⁰ = A − Z = 23 − 11 = 12', 'ts');
    return svg(520, 250, b, 'Строение атома натрия');
  } };
  F['pt-trends'] = { cap: 'Как меняются свойства в Периодической системе', svg: function () {
    var b = '<rect x="60" y="40" width="300" height="170" rx="6" class="c5 f1"/>';
    for (var i = 1; i < 8; i++) b += L(60 + i * 300 / 8, 40, 60 + i * 300 / 8, 210, 'gr');
    for (i = 1; i < 6; i++) b += L(60, 40 + i * 170 / 6, 360, 40 + i * 170 / 6, 'gr');
    b += A(70, 26, 350, 26, 'c2', 10) + T(210, 18, 'электроотрицательность, неметаллические свойства ↑', 'ts', 'middle') +
      A(30, 50, 30, 200, 'c1', 10) + T(24, 130, 'радиус ↑', 't ti', 'end') + A(350, 228, 70, 228, 'c3', 10) + T(210, 246, 'металлические свойства и радиус ↑', 'ts', 'middle') +
      T(390, 70, 'F — самый', 't tb tr') + T(390, 90, 'электроотрицательный', 'ts') + T(390, 140, 'Fr, Cs — самые', 't tb tg') + T(390, 160, 'активные металлы', 'ts');
    return svg(560, 255, b, 'Периодические закономерности');
  } };
  F['ph-scale'] = { cap: 'Шкала pH: 7 — нейтральная среда, меньше 7 — кислая, больше 7 — щелочная', svg: function () {
    var cols = ['#d7263d', '#e8553b', '#f08a34', '#f4b400', '#e8d33a', '#b8d43a', '#6cc04a', '#2e9e57', '#1d9a8a', '#1f86b8', '#2a62c9', '#3a47b5', '#5a3aa8', '#6f2c96', '#7a2380'];
    var b = '';
    cols.forEach(function (c, i) { b += '<rect x="' + (30 + i * 36) + '" y="50" width="36" height="46" style="fill:' + c + '"/>' + T(48 + i * 36, 115, i, 'tn', 'middle'); });
    b += '<rect x="30" y="50" width="540" height="46" rx="4" class="c5 fn"/>' +
      T(120, 38, 'кислая', 't tb tr', 'middle') + T(300, 38, 'нейтральная', 't tb', 'middle') + T(480, 38, 'щелочная', 't tb ti', 'middle') +
      T(66, 140, 'HCl', 'ts mono', 'middle') + T(138, 140, 'уксус', 'ts', 'middle') + T(300, 140, 'H₂O', 'ts mono', 'middle') + T(372, 140, 'NaHCO₃', 'ts mono', 'middle') + T(534, 140, 'NaOH', 'ts mono', 'middle') +
      T(300, 168, 'лакмус: красный — фиолетовый — синий; фенолфталеин малиновый только в щелочной', 'ts', 'middle');
    return svg(600, 180, b, 'Шкала pH');
  } };
  F['energy-profile'] = { cap: 'Энергетическая диаграмма экзотермической реакции: катализатор снижает энергию активации, но не меняет ΔH', svg: function () {
    return plot({ x: [0, 10], y: [0, 10], ticks: false, axes: ['ход реакции', 'E'], w: 460, h: 260, label: 'Энергетический профиль', fns: [
      { f: function (x) { return 6 - 3 / (1 + Math.exp(-(x - 5) * 1.6)) + 3.2 * Math.exp(-Math.pow(x - 4.6, 2) / 1.3); }, from: 0.5, to: 9.5, c: 'c1' },
      { f: function (x) { return 6 - 3 / (1 + Math.exp(-(x - 5) * 1.6)) + 1.4 * Math.exp(-Math.pow(x - 4.6, 2) / 1.3); }, from: 0.5, to: 9.5, c: 'c3 d' }
    ], extra: function (sx, sy) {
      return A(sx(1.6), sy(6), sx(1.6), sy(8.9), 'c2', 8) + T(sx(1.6) - 6, sy(7.6), 'Eₐ', 't tb tr', 'end') + A(sx(8.6), sy(6), sx(8.6), sy(3.1), 'c1', 8) + T(sx(8.6) + 6, sy(4.6), 'ΔH &lt; 0', 't tb ti') +
        L(sx(0.5), sy(6), sx(9), sy(6), 'c5 thin d') + T(sx(0.7), sy(6) + 16, 'реагенты', 'ts') + T(sx(9.4), sy(3) + 16, 'продукты', 'ts', 'end') + T(sx(6.2), sy(6.4), 'с катализатором', 'ts tg');
    } });
  } };
  F['bond-types'] = { cap: 'Тип связи определяет разность электроотрицательностей атомов (ΔЭО)', svg: function () {
    var b = '<rect x="30" y="60" width="130" height="36" class="f3 k0"/><rect x="160" y="60" width="250" height="36" class="f1 k0"/><rect x="410" y="60" width="160" height="36" class="f2 k0"/>' +
      '<rect x="30" y="60" width="540" height="36" rx="4" class="c5 fn"/>' + A(30, 120, 580, 120, 'ax', 9) + T(560, 142, 'ΔЭО', 't ti') +
      [0, 0.4, 1, 1.7, 2.5, 3.2].map(function (v) { var x = 30 + v / 3.3 * 540; return L(x, 116, x, 124, 'ax') + T(x, 140, String(v).replace('.', ','), 'tn', 'middle'); }).join('') +
      T(95, 50, 'ковалентная неполярная', 'ts', 'middle') + T(285, 50, 'ковалентная полярная', 'ts', 'middle') + T(490, 50, 'ионная', 'ts', 'middle') +
      T(95, 83, 'H₂, O₂, Cl₂', 't tb mono', 'middle') + T(285, 83, 'HCl, H₂O, NH₃', 't tb mono', 'middle') + T(490, 83, 'NaCl, CaF₂', 't tb mono', 'middle') +
      T(300, 170, 'металлическая связь — у металлов: общие «свободные» электроны', 'ts', 'middle');
    return svg(600, 180, b, 'Типы химической связи');
  } };

  /* ================= Биология ================= */
  F['cell'] = { cap: 'Животная клетка: главные органоиды', svg: function () {
    var b = '<ellipse cx="200" cy="130" rx="170" ry="110" class="c3 f3 wide"/>' + C(200, 130, 42, 'c1 f1') + C(210, 124, 11, 'p1') +
      '<ellipse cx="100" cy="90" rx="30" ry="14" class="c2 f2" transform="rotate(-20 100 90)"/>' + P('M80 90 q8 -10 14 0 t14 0 t14 0', 'c2 thin') +
      '<ellipse cx="300" cy="175" rx="28" ry="13" class="c2 f2" transform="rotate(15 300 175)"/>' +
      P('M250 70 q20 -14 40 0 t40 0 M250 84 q20 -14 40 0 t40 0 M254 98 q20 -14 40 0 t36 0', 'c4') +
      P('M110 170 q14 -10 28 0 M104 184 q20 -10 40 0 M112 198 q14 -10 28 0', 'c5') +
      [[240, 60], [262, 108], [320, 118], [150, 60], [140, 130], [230, 200], [180, 206]].map(function (p) { return C(p[0], p[1], 3, 'p5'); }).join('') +
      L(200, 172, 200, 250, 'gr') + T(200, 262, 'ядро (ДНК)', 't tb ti', 'middle') + L(100, 76, 60, 20, 'gr') + T(60, 14, 'митохондрия — «энергостанция»', 'ts tr') +
      L(330, 70, 390, 40, 'gr') + T(392, 40, 'ЭПС', 'ts') + L(126, 184, 20, 250, 'gr') + T(20, 262, 'комплекс Гольджи', 'ts') + L(262, 108, 400, 110, 'gr') + T(402, 114, 'рибосомы', 'ts') +
      L(362, 150, 400, 170, 'gr') + T(402, 174, 'мембрана', 'ts');
    return svg(520, 270, b, 'Строение клетки');
  } };
  F['mitosis'] = { cap: 'Фазы митоза: профаза, метафаза, анафаза, телофаза. Итог — две клетки с тем же набором 2n', svg: function () {
    var ch = function (x, y, rot, c) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><path d="M-3 -12 L3 12 M3 -12 L-3 12" class="' + (c || 'c1') + ' wide"/></g>'; };
    var b = '', names = ['профаза', 'метафаза', 'анафаза', 'телофаза'];
    for (var i = 0; i < 4; i++) {
      var x = 20 + i * 145, cx = x + 62;
      b += (i < 3 ? '<ellipse cx="' + cx + '" cy="90" rx="58" ry="58" class="c5 f3"/>' : '<ellipse cx="' + cx + '" cy="52" rx="50" ry="36" class="c5 f3"/><ellipse cx="' + cx + '" cy="128" rx="50" ry="36" class="c5 f3"/>') + T(cx, 175, names[i], 't tb', 'middle');
    }
    b += C(82, 90, 38, 'c5 fn d') + ch(70, 80, 20) + ch(92, 96, -30, 'c2') + ch(76, 104, 70);
    b += L(172, 90, 242, 90, 'c5 thin d') + ch(207, 72, 0) + ch(207, 108, 0, 'c2') + L(207, 36, 207, 144, 'gr');
    b += '<path d="M318 60 L318 72 M346 60 L346 72 M318 108 L318 120 M346 108 L346 120" class="c1 wide"/>' + A(332, 80, 332, 44, 'c5', 7) + A(332, 100, 332, 136, 'c5', 7);
    b += '<path d="M498 44 L498 60 M516 44 L516 60 M498 120 L498 136 M516 120 L516 136" class="c1 wide"/>';
    return svg(600, 190, b, 'Фазы митоза');
  } };
  F['dna'] = { cap: 'ДНК: две цепи соединены по принципу комплементарности А–Т (2 водородные связи), Г–Ц (3 связи)', svg: function () {
    var b = '', pairs = [['А', 'Т'], ['Г', 'Ц'], ['Т', 'А'], ['Ц', 'Г'], ['А', 'Т'], ['Г', 'Ц'], ['Т', 'А']];
    var d1 = '', d2 = '';
    for (var i = 0; i <= 60; i++) { var x = 30 + i * 8.5, y1 = 90 - 50 * Math.sin(i / 60 * 2 * Math.PI), y2 = 90 + 50 * Math.sin(i / 60 * 2 * Math.PI); d1 += (i ? 'L' : 'M') + r(x) + ' ' + r(y1); d2 += (i ? 'L' : 'M') + r(x) + ' ' + r(y2); }
    pairs.forEach(function (p, k) {
      var i = 4 + k * 8, x = 30 + i * 8.5, ya = 90 - 50 * Math.sin(i / 60 * 2 * Math.PI), yb = 90 + 50 * Math.sin(i / 60 * 2 * Math.PI);
      b += L(x, ya, x, yb, 'c5 thin') + T(x, Math.min(ya, yb) - 8, p[0], 't tb ti', 'middle') + T(x, Math.max(ya, yb) + 18, p[1], 't tb tr', 'middle');
    });
    b = P(d1, 'c1 wide') + P(d2, 'c2 wide') + b;
    return svg(580, 180, b, 'Двойная спираль ДНК');
  } };
  F['food-pyramid'] = { cap: 'Правило 10%: на следующий трофический уровень переходит около 10% энергии', svg: function () {
    var lv = [['продуценты: трава', '10 000 кДж', 'f3'], ['консументы I: заяц', '1 000 кДж', 'f4'], ['консументы II: лиса', '100 кДж', 'f2'], ['консументы III: орёл', '10 кДж', 'f1']];
    var b = '';
    lv.forEach(function (l, i) {
      var w = 440 - i * 110, y = 190 - i * 46, x = 300 - w / 2;
      b += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="40" rx="4" class="c5 ' + l[2] + '"/>' + T(300, y + 18, l[0], 't tb', 'middle') + T(300, y + 34, l[1], 'tn', 'middle');
    });
    return svg(600, 240, b, 'Экологическая пирамида');
  } };

  /* --- ещё биология --- */
  function box(x, y, w, h, c, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 6) + '" class="' + c + '"/>'; }
  function sector(cx, cy, r1, r2, a1, a2, c) {
    var pt = function (rad, a) { return r(cx + rad * Math.sin(a * Math.PI / 180)) + ' ' + r(cy - rad * Math.cos(a * Math.PI / 180)); };
    var big = a2 - a1 > 180 ? 1 : 0;
    return P('M' + pt(r2, a1) + ' A' + r2 + ' ' + r2 + ' 0 ' + big + ' 1 ' + pt(r2, a2) + ' L' + pt(r1, a2) + ' A' + r1 + ' ' + r1 + ' 0 ' + big + ' 0 ' + pt(r1, a1) + ' Z', c);
  }
  function bell(cx, sg, amp, base, x0, x1) {
    var d = '';
    for (var x = x0; x <= x1; x += 4) d += (x === x0 ? 'M' : 'L') + x + ' ' + r(base - amp * Math.exp(-Math.pow(x - cx, 2) / (2 * sg * sg))) + ' ';
    return d;
  }
  F['prokaryote'] = { cap: 'Бактериальная клетка: нет ядра и мембранных органоидов, кольцевая ДНК лежит в нуклеоиде, рибосомы мелкие (70S)', svg: function () {
    var b = box(60, 50, 340, 160, 'c3 f3 wide', 80) + box(74, 64, 312, 132, 'c5 thin fn', 66) +
      '<ellipse cx="230" cy="130" rx="66" ry="38" class="c1 f1 thin d"/>' + P('M186 122 q10 -20 20 0 t20 0 t20 0 t20 0 M186 140 q10 -20 20 0 t20 0 t20 0 t20 0', 'c1 thin') +
      [[110, 170], [130, 100], [340, 100], [320, 178], [150, 150], [105, 125], [290, 80]].map(function (p) { return C(p[0], p[1], 3.5, 'p2'); }).join('') +
      C(340, 150, 10, 'c2 fn') + P('M400 130 q30 -30 60 0 t60 0 t40 0', 'c4 wide') +
      L(150, 54, 110, 26, 'c5 thin') + T(20, 20, 'клеточная стенка (муреин)', 'ts') + L(255, 96, 285, 26, 'c5 thin') + T(290, 20, 'нуклеоид (кольцевая ДНК)', 'ts') +
      L(110, 172, 62, 236, 'c5 thin') + T(20, 252, 'рибосомы 70S', 'ts') + L(200, 198, 235, 236, 'c5 thin') + T(160, 252, 'плазматическая мембрана', 'ts') +
      L(340, 160, 350, 236, 'c5 thin') + T(340, 252, 'плазмида', 'ts') + T(500, 108, 'жгутик', 'ts', 'middle');
    return svg(600, 262, b, 'Строение бактериальной клетки');
  } };
  F['membrane'] = { cap: 'Плазматическая мембрана: двойной слой липидов с белками. Способы транспорта: диффузия, через канал, активный транспорт с затратой АТФ', svg: function () {
    var b = '', x;
    for (x = 40; x <= 560; x += 20) {
      if (x > 130 && x < 220 || x > 360 && x < 450) continue;
      b += C(x, 90, 8, 'p1') + C(x, 166, 8, 'p1') + L(x - 3, 98, x - 3, 126, 'c5 thin') + L(x + 3, 98, x + 3, 126, 'c5 thin') + L(x - 3, 158, x - 3, 130, 'c5 thin') + L(x + 3, 158, x + 3, 130, 'c5 thin');
    }
    b += box(150, 78, 50, 100, 'c2 f2') + '<ellipse cx="405" cy="128" rx="36" ry="52" class="c4 f4"/>' +
      A(280, 34, 280, 218, 'c1') + A(175, 34, 175, 218, 'c3') + A(405, 218, 405, 40, 'c2') +
      T(295, 60, 'O₂, CO₂, липиды', 'ts') + T(295, 74, '(простая диффузия)', 'ts') + T(168, 34, 'ионы, вода — через канал', 'ts', 'end') + T(420, 34, 'активный транспорт', 'ts tr') + T(420, 240, 'против градиента, нужна АТФ', 'ts tr') +
      T(20, 60, 'снаружи', 'ts tb') + T(20, 214, 'цитоплазма', 'ts tb') + T(190, 240, 'белок-канал', 'ts');
    return svg(600, 250, b, 'Мембрана и транспорт веществ');
  } };
  F['cell-cycle'] = { cap: 'Клеточный цикл: интерфаза (G₁, S, G₂) занимает около 90% времени, митоз (M) — около 10%', svg: function () {
    var segs = [[0, 144, 'f1', 'G₁'], [144, 252, 'f4', 'S'], [252, 324, 'f3', 'G₂'], [324, 360, 'f2', 'M']], b = '';
    segs.forEach(function (s) {
      b += sector(170, 130, 50, 100, s[0], s[1], 'c5 thin ' + s[2]);
      var m = (s[0] + s[1]) / 2 * Math.PI / 180;
      b += T(170 + 75 * Math.sin(m), 130 - 75 * Math.cos(m) + 5, s[3], 't tb', 'middle');
    });
    b += T(170, 126, 'клеточный', 'ts', 'middle') + T(170, 142, 'цикл', 'ts', 'middle');
    [['f1', 'G₁ — рост клетки, синтез белков', '2n2c'], ['f4', 'S — удвоение ДНК (репликация)', '2n2c → 2n4c'], ['f3', 'G₂ — подготовка к делению', '2n4c'], ['f2', 'M — митоз и цитокинез', '2n4c → 2n2c']].forEach(function (l, i) {
      var y = 58 + i * 42;
      b += box(310, y - 13, 22, 22, 'c5 thin ' + l[0], 4) + T(342, y + 3, l[1], 't') + T(342, y + 19, l[2], 'tn');
    });
    return svg(600, 260, b, 'Клеточный цикл');
  } };
  F['meiosis'] = { cap: 'Мейоз: два деления подряд, репликация ДНК только один раз. Из одной диплоидной клетки — четыре гаплоидные', svg: function () {
    var X = function (x, y, c) { return '<path d="M' + (x - 5) + ' ' + (y - 10) + ' L' + (x + 5) + ' ' + (y + 10) + ' M' + (x + 5) + ' ' + (y - 10) + ' L' + (x - 5) + ' ' + (y + 10) + '" class="' + c + ' wide"/>'; };
    var I = function (x, y, c) { return L(x, y - 9, x, y + 9, c + ' wide'); };
    var b = C(300, 44, 38, 'c5 f3') + X(284, 32, 'c1') + X(284, 56, 'c1') + X(316, 32, 'c2') + X(316, 56, 'c2');
    b += A(270, 78, 200, 104, 'c5', 8) + A(330, 78, 400, 104, 'c5', 8) + T(120, 92, 'мейоз I', 't tb tr', 'middle');
    [200, 400].forEach(function (x, k) { b += C(x, 140, 28, 'c5 f3') + X(x - 8, 140, k ? 'c2' : 'c1') + X(x + 8, 140, k ? 'c1' : 'c2'); });
    b += A(185, 172, 130, 200, 'c5', 8) + A(215, 172, 250, 200, 'c5', 8) + A(385, 172, 350, 200, 'c5', 8) + A(415, 172, 470, 200, 'c5', 8) + T(120, 186, 'мейоз II', 't tb tr', 'middle');
    [[110], [250], [350], [490]].forEach(function (p) { b += C(p[0], 232, 24, 'c5 f3') + I(p[0] - 7, 232, 'c1') + I(p[0] + 7, 232, 'c2'); });
    b += T(560, 46, '2n4c', 'tn') + T(560, 144, 'n2c', 'tn') + T(560, 236, 'nc', 'tn');
    return svg(600, 272, b, 'Схема мейоза');
  } };
  F['monohybrid'] = { cap: 'Моногибридное скрещивание Aa × Aa: расщепление по генотипу 1 : 2 : 1, по фенотипу 3 : 1 (при полном доминировании)', svg: function () {
    var g = [['AA', 'f1'], ['Aa', 'f1'], ['Aa', 'f1'], ['aa', 'f2']], b = T(300, 20, 'P: Aa × Aa', 't tb', 'middle') + T(300, 40, 'гаметы: A, a  и  A, a', 'ts', 'middle');
    b += T(178, 82, 'A', 't tb ti', 'middle') + T(238, 82, 'a', 't tb ti', 'middle') + T(122, 122, 'A', 't tb ti', 'middle') + T(122, 182, 'a', 't tb ti', 'middle');
    g.forEach(function (c, i) {
      var x = 148 + (i % 2) * 60, y = 92 + Math.floor(i / 2) * 60;
      b += box(x, y, 60, 60, 'c5 thin ' + c[1], 2) + T(x + 30, y + 37, c[0], 't tb' + (i === 3 ? ' tr' : ''), 'middle');
    });
    b += T(310, 110, 'Генотип:', 't tb') + T(310, 132, '1 AA : 2 Aa : 1 aa', 'tn') + T(310, 164, 'Фенотип:', 't tb') + T(310, 186, '3 доминантных : 1 рецессивный', 'ts') + T(310, 206, 'F₂ по Менделю', 'ts tm');
    return svg(600, 232, b, 'Решётка Пеннета для Aa × Aa');
  } };
  F['selection-forms'] = { cap: 'Формы отбора: штриховая кривая — популяция до отбора, сплошная — после', svg: function () {
    var b = '', base = 140, names = ['стабилизирующий', 'движущий', 'дизруптивный'];
    for (var i = 0; i < 3; i++) {
      var x0 = 15 + i * 195, x1 = x0 + 180, m = x0 + 90;
      b += L(x0, base, x1, base, 'ax') + P(bell(m, 26, 90, base, x0 + 4, x1 - 4), 'c5 thin d');
      if (i === 0) b += P(bell(m, 14, 118, base, x0 + 4, x1 - 4), 'c2 wide');
      if (i === 1) b += P(bell(m + 34, 26, 90, base, x0 + 4, x1 - 4), 'c2 wide') + A(m + 4, 40, m + 30, 40, 'c1', 7);
      if (i === 2) b += P(bell(m - 40, 16, 74, base, x0 + 4, x1 - 4), 'c2 wide') + P(bell(m + 40, 16, 74, base, x0 + 4, x1 - 4), 'c2 wide');
      b += T(m, base + 22, names[i], 't tb', 'middle') + T(m, base + 40, 'значение признака →', 'ts', 'middle');
    }
    b += T(20, 20, 'Условия постоянны', 'ts') + T(215, 20, 'Условия меняются', 'ts') + T(410, 20, 'Условия неоднородны', 'ts');
    return svg(600, 196, b, 'Формы естественного отбора');
  } };
  F['photosynthesis'] = { cap: 'Фотосинтез в хлоропласте: световая фаза идёт на мембранах тилакоидов, тёмная — в строме', svg: function () {
    var b = box(20, 44, 560, 176, 'c3 f3 wide', 60) + box(50, 78, 220, 116, 'c1 f1', 10) + box(330, 78, 220, 116, 'c2 f2', 10);
    b += T(160, 100, 'Световая фаза', 't tb ti', 'middle') + T(160, 118, 'тилакоиды (граны)', 'ts', 'middle') +
      T(160, 146, '2H₂O → O₂ + 4H⁺ + 4e⁻', 'tn', 'middle') + T(160, 164, 'синтез АТФ, НАДФ·Н', 'ts', 'middle') +
      T(440, 100, 'Тёмная фаза', 't tb tr', 'middle') + T(440, 118, 'строма (цикл Кальвина)', 'ts', 'middle') +
      T(440, 146, 'CO₂ + АТФ + НАДФ·Н', 'tn', 'middle') + T(440, 164, '→ глюкоза C₆H₁₂O₆', 'ts', 'middle');
    b += A(270, 136, 330, 136, 'c4', 9) + T(300, 128, 'АТФ', 'ts tb', 'middle') + T(300, 156, 'НАДФ·Н', 'ts tb', 'middle') +
      A(120, 8, 120, 74, 'c4', 9) + T(130, 20, 'свет', 't tb') + T(130, 36, 'H₂O', 'ts') + A(190, 78, 190, 8, 'c1', 9) + T(200, 20, 'O₂ ↑', 't tb ti') +
      A(440, 8, 440, 74, 'c3', 9) + T(450, 22, 'CO₂', 't tb tg') + A(440, 196, 440, 250, 'c2', 9) + T(450, 244, 'глюкоза', 't tb tr');
    return svg(600, 258, b, 'Схема фотосинтеза');
  } };
  F['energy-metab'] = { cap: 'Три этапа энергетического обмена. Полное окисление одной молекулы глюкозы даёт 38 АТФ', svg: function () {
    var st = [['1. Подготовительный', 'ЖКТ, лизосомы', 'полимеры → мономеры', 'энергия — тепло', 'f1'], ['2. Бескислородный', 'цитоплазма (гликолиз)', 'глюкоза → 2 ПВК', '+2 АТФ', 'f4'], ['3. Кислородный', 'митохондрии', 'ПВК + O₂ → CO₂ + H₂O', '+36 АТФ', 'f3']], b = '';
    st.forEach(function (s, i) {
      var x = 16 + i * 198;
      b += box(x, 20, 170, 150, 'c5 thin ' + s[4], 8) + T(x + 85, 46, s[0], 't tb', 'middle') + T(x + 85, 70, s[1], 'ts', 'middle') + T(x + 85, 110, s[2], 'ts', 'middle') + T(x + 85, 148, s[3], 't tb' + (i ? ' tr' : ''), 'middle');
      if (i < 2) b += A(x + 172, 95, x + 196, 95, 'c5', 8);
    });
    b += T(300, 208, 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 38 АТФ', 't tb ti', 'middle');
    return svg(600, 224, b, 'Этапы энергетического обмена');
  } };
  F['protein-synthesis'] = { cap: 'Биосинтез белка: транскрипция в ядре (ДНК → иРНК), трансляция на рибосоме (иРНК → белок)', svg: function () {
    var rows = [['Матричная цепь ДНК', ['ТАЦ', 'ГЦА', 'ААГ'], 'f1'], ['иРНК (кодоны)', ['АУГ', 'ЦГУ', 'УУЦ'], 'f2'], ['тРНК (антикодоны)', ['УАЦ', 'ГЦА', 'ААГ'], 'f4'], ['Белок', ['Мет', 'Арг', 'Фен'], 'f3']], b = '';
    rows.forEach(function (rw, i) {
      var y = 14 + i * 62;
      b += T(20, y + 24, rw[0], 'ts tb');
      rw[1].forEach(function (s, k) { b += box(190 + k * 110, y, 96, 36, 'c5 thin ' + rw[2], 4) + T(238 + k * 110, y + 24, s, 't tb mono', 'middle'); });
    });
    b += A(240, 52, 240, 76, 'c5', 6) + A(240, 176, 240, 200, 'c5', 6) + T(560, 68, 'транскрипция', 'ts tr') + T(560, 92, '(ядро)', 'ts') + T(560, 174, 'трансляция', 'ts tr') + T(560, 198, '(рибосома)', 'ts') + T(560, 132, 'тРНК ↔ кодон', 'ts');
    return svg(660, 258, b, 'Биосинтез белка');
  } };
  F['carbon-cycle'] = { cap: 'Круговорот углерода: продуценты связывают CO₂, а дыхание и разложение возвращают его в атмосферу', svg: function () {
    var b = box(210, 10, 180, 36, 'c5 thin f1') + T(300, 33, 'CO₂ в атмосфере', 't tb', 'middle') + box(20, 118, 180, 36, 'c3 f3') + T(110, 141, 'растения', 't tb', 'middle') +
      box(400, 118, 180, 36, 'c4 f4') + T(490, 141, 'животные', 't tb', 'middle') + box(210, 214, 180, 36, 'c5 thin f2') + T(300, 237, 'редуценты', 't tb', 'middle');
    b += A(230, 48, 120, 116, 'c3', 9) + T(140, 74, 'фотосинтез', 'ts tg') + A(202, 138, 398, 138, 'c4', 9) + T(300, 130, 'питание', 'ts', 'middle') +
      A(490, 116, 380, 48, 'c2', 9) + T(482, 78, 'дыхание', 'ts tr') + A(110, 156, 212, 226, 'c5 d', 8) + T(90, 200, 'отмершие', 'ts') + T(90, 214, 'остатки', 'ts') +
      A(490, 156, 388, 226, 'c5 d', 8) + A(300, 212, 300, 50, 'c2', 9) + T(308, 180, 'дыхание,', 'ts tr') + T(308, 194, 'разложение', 'ts tr');
    return svg(600, 262, b, 'Круговорот углерода');
  } };
  F['flower'] = { cap: 'Строение цветка: околоцветник (чашечка и венчик), тычинки (мужская часть), пестик (женская часть)', svg: function () {
    var b = '<ellipse cx="120" cy="190" rx="26" ry="62" class="c2 f2" transform="rotate(-25 120 190)"/><ellipse cx="320" cy="190" rx="26" ry="62" class="c2 f2" transform="rotate(25 320 190)"/>' +
      L(220, 262, 220, 296, 'c3 wide') + '<ellipse cx="165" cy="264" rx="34" ry="8" class="c3 f3" transform="rotate(-15 165 264)"/><ellipse cx="275" cy="264" rx="34" ry="8" class="c3 f3" transform="rotate(15 275 264)"/>' +
      P('M205 252 Q160 212 160 158 M235 252 Q280 212 280 158', 'c5 thin') + '<ellipse cx="160" cy="150" rx="14" ry="9" class="c4 f4"/><ellipse cx="280" cy="150" rx="14" ry="9" class="c4 f4"/>' +
      '<ellipse cx="220" cy="252" rx="42" ry="10" class="c5 f1"/>' + L(220, 130, 220, 178, 'c5') + '<ellipse cx="220" cy="208" rx="26" ry="32" class="c3 f3"/>' + C(212, 206, 4, 'p2') + C(228, 206, 4, 'p2') + C(220, 220, 4, 'p2') + C(220, 122, 8, 'p2');
    [[228, 122, 30, 'рыльце'], [222, 160, 70, 'столбик'], [246, 202, 110, 'завязь с семязачатками'], [294, 150, 150, 'тычинка: пыльник + нить'], [346, 200, 190, 'лепестки (венчик)'], [300, 266, 236, 'чашелистики (чашечка)'], [258, 254, 276, 'цветоложе']].forEach(function (l) {
      b += L(l[0], l[1], 376, l[2] - 4, 'c5 thin') + T(382, l[2], l[3], 'ts');
    });
    b += T(60, 34, 'пестик = рыльце + столбик + завязь', 'ts tr');
    return svg(600, 300, b, 'Строение цветка');
  } };
  F['tolerance'] = { cap: 'Закон толерантности: организм живёт только в пределах диапазона фактора; вблизи границ — зоны угнетения (пессимум)', svg: function () {
    var b = L(40, 180, 560, 180, 'ax') + L(40, 180, 40, 20, 'ax') + P(bell(300, 80, 140, 180, 44, 556), 'c2 wide') + L(190, 60, 190, 180, 'c5 thin d') + L(410, 60, 410, 180, 'c5 thin d') +
      T(115, 92, 'зона угнетения', 'ts', 'middle') + T(115, 108, '(пессимум)', 'ts', 'middle') + T(485, 92, 'зона угнетения', 'ts', 'middle') + T(485, 108, '(пессимум)', 'ts', 'middle') + T(300, 34, 'оптимум', 't tb tr', 'middle') +
      T(190, 200, 'минимум', 'ts', 'middle') + T(410, 200, 'максимум', 'ts', 'middle') + T(300, 218, 'интенсивность фактора (температура, влажность, свет…) →', 'ts', 'middle') + T(52, 30, 'жизнедеятельность', 'ts');
    b += P('M72 176 L72 180 M528 176 L528 180', 'c5 thin') + T(72, 168, 'смерть', 'ts', 'middle') + T(528, 168, 'смерть', 'ts', 'middle');
    return svg(600, 228, b, 'Кривая толерантности');
  } };

  /* ================= Информатика ================= */
  F['graph-weighted'] = { cap: 'Взвешенный граф: вершины A–F, числа на рёбрах — длины дорог. Степени: A и B — 3, C и D — 2, E и F — 1', svg: function () {
    var v = { A: [180, 90], B: [320, 50], C: [320, 150], D: [80, 150], E: [460, 50], F: [80, 40] };
    var ed = [['A', 'B', 7], ['A', 'C', 3], ['A', 'D', 9], ['B', 'C', 4], ['B', 'E', 5], ['D', 'F', 6]], b = '';
    ed.forEach(function (e) {
      var p = v[e[0]], q = v[e[1]], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
      b += L(p[0], p[1], q[0], q[1], 'c5') + C(mx, my, 11, 'c5 thin fs') + T(mx, my + 4.5, e[2], 'tn tb', 'middle');
    });
    Object.keys(v).forEach(function (k) { b += C(v[k][0], v[k][1], 17, 'c1 f1') + T(v[k][0], v[k][1] + 5, k, 't tb', 'middle'); });
    return svg(540, 190, b, 'Взвешенный граф');
  } };

  /* ================= География ================= */
  F['altitude-temp'] = { cap: 'В тропосфере температура падает примерно на 6 °C на каждый километр подъёма', svg: function () {
    return plot({ x: [-20, 25], y: [0, 7], step: 5, tick: 10, axes: ['t, °C', 'h, км'], w: 440, h: 260, label: 'Температура и высота', fns: [],
      extra: function (sx, sy) {
        var b = L(sx(20), sy(0), sx(-16), sy(6), 'c1'), k;
        for (k = 0; k <= 6; k += 2) b += C(sx(20 - 6 * k), sy(k), 4, 'p1') + T(sx(20 - 6 * k) + 8, sy(k) + 4, (20 - 6 * k + '').replace('-', '−') + ' °C', 'ts');
        return b + T(sx(-18), sy(6.6), 'на вершине 6 км: 20 − 6·6 = −16 °C', 't tb tr');
      } });
  } };
  F['seasons'] = { cap: 'Смена времён года — из-за наклона земной оси (66,5° к плоскости орбиты)', svg: function () {
    var b = '<ellipse cx="300" cy="120" rx="230" ry="70" class="c5 fn d"/>' + C(300, 120, 30, 'c4 f4') + T(300, 125, 'Солнце', 'ts', 'middle');
    var earth = function (x, y, lbl, sub) {
      return C(x, y, 22, 'c1 f1') + '<g transform="rotate(-23.5 ' + x + ' ' + y + ')">' + L(x, y - 34, x, y + 34, 'c2') + L(x - 22, y, x + 22, y, 'c5 thin d') + '</g>' + T(x, y + 50, lbl, 't tb', 'middle') + T(x, y + 66, sub, 'ts', 'middle');
    };
    b += earth(70, 120, '22 декабря', 'зима в Сев. полушарии') + earth(530, 120, '22 июня', 'лето в Сев. полушарии');
    b += T(300, 30, '21 марта и 23 сентября — равноденствия', 'ts', 'middle');
    return svg(600, 200, b, 'Времена года');
  } };
  F['azimuth'] = { cap: 'Азимут — угол между направлением на север и направлением на объект, отсчитывается по часовой стрелке', svg: function () {
    var cx = 150, cy = 130, R = 100;
    var b = C(cx, cy, R, 'c5 fn') + A(cx, cy, cx, cy - R - 12, 'c2', 10) + T(cx, cy - R - 18, 'С (0°)', 't tb tr', 'middle') +
      T(cx + R + 8, cy + 4, 'В 90°', 'ts') + T(cx, cy + R + 18, 'Ю 180°', 'ts', 'middle') + T(cx - R - 8, cy + 4, 'З 270°', 'ts', 'end') +
      L(cx - R, cy, cx + R, cy, 'gr') + L(cx, cy - R, cx, cy + R, 'gr');
    var a = 135 * Math.PI / 180;
    b += A(cx, cy, cx + R * Math.sin(a), cy - R * Math.cos(a), 'c1', 10) + T(cx + R * Math.sin(a) + 6, cy - R * Math.cos(a) + 14, 'объект', 't ti') +
      P('M' + cx + ' ' + (cy - 40) + ' A40 40 0 0 1 ' + r(cx + 40 * Math.sin(a)) + ' ' + r(cy - 40 * Math.cos(a)), 'c3') + T(cx + 46, cy - 26, '135°', 't tb tg') +
      T(290, 80, 'ЮВ = 135°', 't tb') + T(290, 106, 'СВ = 45°, ЮЗ = 225°', 'ts') + T(290, 128, 'СЗ = 315°', 'ts');
    return svg(470, 250, b, 'Азимут');
  } };

  /* ================= Обществознание ================= */
  F['supply-demand'] = { cap: 'Рыночное равновесие: в точке E объём спроса равен объёму предложения', svg: function () {
    return plot({ x: [0, 10], y: [0, 10], ticks: false, axes: ['Q', 'P'], label: 'Спрос и предложение', fns: [
      { f: function (q) { return 9 - 0.8 * q; }, from: 0.5, to: 9.5, c: 'c1', label: [9.2, 1.4, 'D (спрос)', 'end'] },
      { f: function (q) { return 1 + 0.8 * q; }, from: 0.5, to: 9.5, c: 'c2', label: [9.2, 8.2, 'S (предложение)', 'end'], lc: 'tr' }
    ], extra: function (sx, sy) {
      return C(sx(5), sy(5), 6, 'p3') + T(sx(5) + 10, sy(5) + 4, 'E', 't tb tg') + L(sx(0), sy(5), sx(5), sy(5), 'c5 thin d') + L(sx(5), sy(0), sx(5), sy(5), 'c5 thin d') +
        T(sx(0) + 4, sy(5) - 6, 'P*', 't tb') + T(sx(5) + 4, sy(0) - 6, 'Q*', 't tb');
    } });
  } };
  F['demand-shift'] = { cap: 'Сдвиг спроса вправо (рост доходов, мода, рост цен на товар-заменитель): цена и объём растут', svg: function () {
    return plot({ x: [0, 10], y: [0, 10], ticks: false, axes: ['Q', 'P'], label: 'Сдвиг спроса', fns: [
      { f: function (q) { return 8 - 0.8 * q; }, from: 0.5, to: 9, c: 'c1 d', label: [0.7, 8.6, 'D₁'] },
      { f: function (q) { return 10 - 0.8 * q; }, from: 2, to: 10, c: 'c1', label: [2.8, 9.3, 'D₂'] },
      { f: function (q) { return 1 + 0.8 * q; }, from: 0.5, to: 9.5, c: 'c2', label: [9.2, 8.6, 'S', 'end'], lc: 'tr' }
    ], extra: function (sx, sy) {
      return A(sx(3), sy(5.6), sx(5), sy(5.6), 'c3', 9) + C(sx(4.375), sy(4.5), 5, 'p5') + C(sx(5.625), sy(5.5), 6, 'p3') + T(sx(5.625) + 10, sy(5.5) + 4, 'E₂', 't tb tg') + T(sx(4.375) + 8, sy(4.5) + 16, 'E₁', 't tb');
    } });
  } };

  /* ================= Информатика ================= */
  F['binary-places'] = { cap: 'Позиционная запись: 101101₂ = 32 + 8 + 4 + 1 = 45₁₀', svg: function () {
    var d = '101101', b = '';
    for (var i = 0; i < 6; i++) {
      var x = 40 + i * 70, p = 5 - i, on = d[i] === '1';
      b += '<rect x="' + x + '" y="50" width="60" height="60" rx="6" class="c1 ' + (on ? 'f1' : 'fs') + '"/>' + T(x + 30, 92, d[i], on ? 't big ti' : 't big tm', 'middle') +
        T(x + 30, 36, '2' + ['⁰', '¹', '²', '³', '⁴', '⁵'][p], 't tb', 'middle') + T(x + 30, 134, on ? String(Math.pow(2, p)) : '0', on ? 't tb tr' : 'tn', 'middle');
    }
    return svg(480, 150, b + T(470, 134, '= 45', 't tb tg', 'end'), 'Двоичная запись числа');
  } };
  F['venn'] = { cap: 'Конъюнкция A ∧ B — пересечение (оба истинны); дизъюнкция A ∨ B — объединение (хотя бы одно)', svg: function () {
    var b = '<defs><clipPath id="vclip"><circle cx="100" cy="95" r="60"/></clipPath></defs>' +
      '<circle cx="160" cy="95" r="60" class="f1 k0" clip-path="url(#vclip)"/>' + C(100, 95, 60, 'c1 fn') + C(160, 95, 60, 'c1 fn') +
      T(70, 100, 'A', 't tb', 'middle') + T(190, 100, 'B', 't tb', 'middle') + T(130, 185, 'A ∧ B (И)', 't tb ti', 'middle') +
      C(330, 95, 60, 'c2 f2') + C(390, 95, 60, 'c2 f2') + C(330, 95, 60, 'c2 fn') + T(300, 100, 'A', 't tb', 'middle') + T(420, 100, 'B', 't tb', 'middle') + T(360, 185, 'A ∨ B (ИЛИ)', 't tb tr', 'middle');
    return svg(480, 200, b, 'Круги Эйлера');
  } };

  /* ================= Английский ================= */
  F['tense-line'] = { cap: 'Present Simple — регулярно, Present Continuous — прямо сейчас, Past Simple — завершённый момент в прошлом', svg: function () {
    var b = A(20, 100, 580, 100, 'ax', 9) + L(330, 70, 330, 130, 'c2 wide') + T(330, 60, 'NOW', 't tb tr', 'middle') + T(40, 124, 'past', 'ts') + T(560, 124, 'future', 'ts', 'end');
    [80, 160, 240, 420, 500].forEach(function (x) { b += C(x, 100, 5, 'p1'); });
    b += T(290, 150, 'Present Simple: I often play chess', 't ti', 'middle') + P('M300 88 q8 -12 16 0 t16 0 t16 0 t16 0', 'c3 wide') + T(330, 36, 'Present Continuous: I am playing now', 't tg', 'middle') +
      '<path d="M130 90 L150 110 M150 90 L130 110" class="c2 wide"/>' + T(140, 172, 'Past Simple: I played yesterday', 't tr', 'middle');
    return svg(600, 185, b, 'Шкала времён');
  } };
  F['perfect-line'] = { cap: 'Present Perfect связывает прошлое с настоящим: результат или период «до сих пор»', svg: function () {
    var b = A(20, 90, 580, 90, 'ax', 9) + L(420, 60, 420, 120, 'c2 wide') + T(420, 50, 'NOW', 't tb tr', 'middle') +
      '<rect x="140" y="82" width="280" height="16" rx="4" class="f1 k0"/>' + C(140, 90, 6, 'p1') + T(140, 124, '2020', 't tb mono', 'middle') +
      T(280, 150, 'I have lived here since 2020 (and still live)', 't tb ti', 'middle') + T(280, 172, 'Past Simple: I lived there in 2015 (period is over)', 'ts', 'middle');
    return svg(600, 185, b, 'Present Perfect');
  } };

  /* ================= История ================= */
  F['tl-ancient'] = { cap: 'Древняя Русь на ленте времени', svg: function () {
    return timeline([[862, 'Рюрик'], [882, 'Олег в Киеве'], [945, 'гибель Игоря'], [988, 'Крещение'], [1019, 'Ярослав Мудрый', 1054], [1097, 'Любечский съезд'], [1113, 'Мономах', 1125], [1132, 'раздробленность']], 850, 1150, 'Хронология Древней Руси');
  } };
  F['tl-peter'] = { cap: 'Эпоха Петра I и дворцовых переворотов', svg: function () {
    return timeline([[1682, 'Пётр — царь'], [1700, 'Нарва'], [1703, 'Петербург'], [1709, 'Полтава'], [1721, 'Ништадт, империя'], [1725, 'смерть Петра'], [1741, 'Елизавета'], [1762, 'Екатерина II']], 1680, 1765, 'Хронология XVIII века');
  } };
  F['tl-empire'] = { cap: 'Российская империя от Екатерины II до Николая II', svg: function () {
    return timeline([[1762, 'Екатерина II', 1796], [1812, 'Отечественная война'], [1825, 'декабристы'], [1853, 'Крымская война', 1856], [1861, 'отмена крепостного права'], [1881, 'Александр III'], [1894, 'Николай II']], 1750, 1900, 'Хронология XIX века');
  } };

  /* ---------- куда вставлять: тема → номер раздела → рисунки ---------- */
  KL.viz = {
    figs: F,
    map: {
      'math-func': { 0: ['func-basic'], 2: ['parabola'], 3: ['hyperbola-shift'] },
      'math-plane': { 0: ['right-triangle'], 2: ['areas'], 3: ['circle-angles'] },
      'math-solid': { 0: ['cube'], 1: ['bodies'] },
      'math-deriv': { 1: ['tangent'], 3: ['extrema'] },
      'math-trig-log': { 1: ['unit-circle'], 3: ['exp-log'] },
      'math-prob': { 1: ['prob-tree'] },
      'math-eq': { 3: ['intervals'] },
      'phys-kinematics': { 1: ['v-t'], 2: ['projectile'], 3: ['circular'] },
      'phys-dynamics': { 1: ['incline'] },
      'phys-oscillations': { 0: ['sine-wave'], 1: ['pendulum'] },
      'phys-electro': { 2: ['circuits'] },
      'phys-optics': { 1: ['refraction'], 2: ['lens'] },
      'phys-thermo': { 2: ['isoprocesses'] },
      'phys-statics-fluids': { 0: ['lever'] },
      'phys-quantum': { 1: ['bohr'] },
      'chem-atom': { 0: ['atom-shells'], 3: ['pt-trends'] },
      'chem-bond': { 0: ['bond-types'] },
      'chem-ions': { 4: ['ph-scale'] },
      'chem-kinetics': { 1: ['energy-profile'] },
      'bio-cell': { 0: ['prokaryote'], 1: ['cell'], 3: ['membrane'] },
      'bio-division': { 0: ['cell-cycle'], 1: ['mitosis'], 2: ['meiosis'] },
      'bio-metabolism': { 1: ['energy-metab'], 2: ['photosynthesis'], 3: ['dna'], 4: ['protein-synthesis'] },
      'bio-ecology': { 0: ['tolerance'], 1: ['food-pyramid'], 4: ['carbon-cycle'] },
      'bio-genetics': { 1: ['monohybrid'] },
      'bio-evolution': { 1: ['selection-forms'] },
      'bio-plants': { 1: ['flower'] },
      'geo-climate': { 0: ['altitude-temp'] },
      'geo-earth': { 2: ['seasons'] },
      'geo-maps': { 1: ['azimuth'] },
      'soc-market': { 2: ['demand-shift'], 4: ['supply-demand'] },
      'inf-numsys': { 0: ['binary-places'] },
      'inf-logic': { 0: ['venn'] },
      'eng-present-past': { 0: ['tense-line'] },
      'eng-future-perfect': { 1: ['perfect-line'] },
      'hist-ancient-rus': { 0: ['tl-ancient'] },
      'hist-peter': { 0: ['tl-peter'] },
      'hist-empire': { 0: ['tl-empire'] }
    },
    /* HTML рисунка; n — номер рисунка в теме */
    figure: function (name, n) {
      var f = F[name];
      if (!f) return '';
      var body = '';
      try { body = f.svg(); } catch (e) { return ''; }
      return '<figure class="viz">' + body + '<figcaption>' + (n ? '<b>Рис. ' + n + '.</b> ' : '') + f.cap + '</figcaption></figure>';
    },
    /* Рисунки для раздела sec темы tid */
    forSection: function (tid, sec, counter) {
      var m = KL.viz.map[tid], list = m && m[sec];
      if (!list) return '';
      return list.map(function (name) { counter.n++; return KL.viz.figure(name, counter.n); }).join('');
    }
  };
})();
