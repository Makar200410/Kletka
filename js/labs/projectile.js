/* Лаборатория «Бросок под углом» — траектория тела, брошенного под углом к горизонту с высоты h₀: анимация, векторы скорости, время полёта, высота и дальность. */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  KL.labs = KL.labs || {};

  var G = 10; /* м/с² — как в задачах ОГЭ и ЕГЭ */

  /* ---------- Числа ---------- */
  function fmt(x, d) {
    if (d == null) d = 2;
    if (!isFinite(x)) return '—';
    var k = Math.pow(10, d), v = Math.round(x * k) / k;
    if (v === 0) v = 0; /* убираем −0 */
    var s = v.toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('.', ',').replace('-', '−');
  }

  /* ---------- Физика ---------- */
  function solve(p) {
    var a = p.a * Math.PI / 180;
    var sin = p.a === 90 ? 1 : Math.sin(a), cos = p.a === 90 ? 0 : Math.cos(a);
    var vx = p.v * cos, vy = p.v * sin;
    var T = (vy + Math.sqrt(vy * vy + 2 * G * p.h)) / G;   /* корень уравнения h₀ + vy·t − g t²/2 = 0 */
    var tUp = vy / G;
    var H = p.h + vy * vy / (2 * G);
    var L = vx * T;
    var vEnd = Math.sqrt(p.v * p.v + 2 * G * p.h);        /* закон сохранения энергии */
    var vyEnd = vy - G * T;
    var angEnd = vEnd > 0 ? Math.atan2(-vyEnd, vx) * 180 / Math.PI : 0;
    return { vx: vx, vy: vy, T: T, tUp: tUp, H: H, L: L, vEnd: vEnd, angEnd: angEnd, p: p };
  }
  function posAt(s, t) { return { x: s.vx * t, y: s.p.h + s.vy * t - G * t * t / 2 }; }

  /* ---------- Стили ---------- */
  var CSS = [
    '.lb-pr-ctrls{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px 18px}',
    '.lb-pr-ctrls label b{color:var(--ink);font-family:var(--f-mono);font-weight:700}',
    '.lb-pr-ctrls input[type=range]{width:100%}',
    '.lb-pr-wrap{position:relative;min-width:0}',
    '.lb-pr-legend{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px;font-size:13.5px;color:var(--muted)}',
    '.lb-pr-legend li{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap}',
    '.lb-pr-legend i{display:inline-block;width:22px;height:0;border-top:2px dashed var(--muted);flex-shrink:0;transform:translateY(-3px)}',
    '.lb-pr-legend i.cur{border-top-style:solid;border-color:var(--ink)}',
    '.lb-pr-legend b{font-family:var(--f-mono);font-weight:600;color:var(--text)}',
    '.lb-pr-msg{font-size:14px;color:var(--warn);min-height:0}',
    '.lb-pr-msg:empty{display:none}',
    '.lb-pr-note p{margin:0 0 6px}',
    '.lb-pr-note p:last-child{margin-bottom:0}'
  ].join('\n');
  function injectCSS() {
    if (document.getElementById('lab-projectile-css')) return;
    var st = document.createElement('style');
    st.id = 'lab-projectile-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ---------- Монтирование ---------- */
  function mount(el) {
    injectCSS();
    el.innerHTML =
      '<div class="lb-pr-ctrls">' +
        '<label>Начальная скорость v₀ = <b data-o="v"></b><input type="range" min="5" max="40" step="1" value="20" data-r="v"></label>' +
        '<label>Угол к горизонту α = <b data-o="a"></b><input type="range" min="0" max="90" step="1" value="45" data-r="a"></label>' +
        '<label>Начальная высота h₀ = <b data-o="h"></b><input type="range" min="0" max="30" step="1" value="0" data-r="h"></label>' +
      '</div>' +
      '<div class="lab-row">' +
        '<button type="button" class="btn primary" data-r="go">Бросить</button>' +
        '<button type="button" class="btn sm ghost" data-r="clear">Стереть следы</button>' +
        '<label class="inline">Темп<select data-r="speed" aria-label="Темп анимации">' +
          '<option value="0.25">0,25×</option><option value="0.5">0,5×</option><option value="1" selected>1× (реальное время)</option><option value="2">2×</option>' +
        '</select></label>' +
        '<label class="inline"><input type="checkbox" data-r="vec" checked> векторы скорости</label>' +
        '<label class="inline"><input type="checkbox" data-r="prev" checked> прогноз траектории</label>' +
      '</div>' +
      '<div class="lb-pr-wrap"><canvas role="img" aria-label="Траектория тела, брошенного под углом к горизонту"></canvas></div>' +
      '<div class="lb-pr-msg" data-r="msg" aria-live="polite"></div>' +
      '<div class="readout" data-r="out" aria-live="polite"></div>' +
      '<ul class="lb-pr-legend" data-r="legend"></ul>' +
      '<div class="lab-note lb-pr-note">' +
        '<p>Движение раскладывается на два: по горизонтали — равномерное, по вертикали — равноускоренное с ускорением $g = 10$ м/с², направленным вниз. Сопротивление воздуха не учитывается.</p>' +
        '<p>$x = v_0\\cos\\alpha\\cdot t,\\quad y = h_0 + v_0\\sin\\alpha\\cdot t - \\dfrac{gt^2}{2}$</p>' +
        '<p>$H = h_0 + \\dfrac{v_0^2\\sin^2\\alpha}{2g},\\quad t_{\\text{пол}} = \\dfrac{v_0\\sin\\alpha + \\sqrt{v_0^2\\sin^2\\alpha + 2gh_0}}{g},\\quad L = v_0\\cos\\alpha\\cdot t_{\\text{пол}}$</p>' +
        '<p>При $h_0 = 0$: $t_{\\text{пол}} = \\dfrac{2v_0\\sin\\alpha}{g}$, $L = \\dfrac{v_0^2\\sin 2\\alpha}{g}$ — наибольшая дальность при $\\alpha = 45^\\circ$, а углы $\\alpha$ и $90^\\circ - \\alpha$ дают одинаковую дальность. С высоты $h_0 > 0$ самый дальний бросок получается при угле меньше $45^\\circ$ — проверьте!</p>' +
      '</div>';

    function R(n) { return el.querySelector('[data-r="' + n + '"]'); }
    function O(n) { return el.querySelector('[data-o="' + n + '"]'); }
    var cv = el.querySelector('canvas'), ctx = cv.getContext('2d'), wrap = el.querySelector('.lb-pr-wrap');
    var inV = R('v'), inA = R('a'), inH = R('h');

    var st = {
      W: 0, H: 0, dpr: 1,
      flight: null,   /* {s, t, start} — идёт бросок */
      done: null,     /* последний завершённый бросок */
      traces: []      /* предыдущие броски (до 3) */
    };
    var raf = 0;

    function params() { return { v: +inV.value, a: +inA.value, h: +inH.value }; }
    function paramText(p) { return 'v₀ = ' + p.v + ' м/с, α = ' + p.a + '°, h₀ = ' + p.h + ' м'; }

    /* ---------- Показания ---------- */
    function updateOut() {
      var p = params(), s = solve(p);
      O('v').textContent = p.v + ' м/с';
      O('a').textContent = p.a + '°';
      O('h').textContent = p.h + ' м';
      R('out').innerHTML =
        '<div><b>' + fmt(s.T) + ' с</b><span>время полёта</span></div>' +
        '<div><b>' + fmt(s.H) + ' м</b><span>максимальная высота над землёй</span></div>' +
        '<div><b>' + fmt(s.L) + ' м</b><span>дальность полёта</span></div>' +
        '<div><b>' + fmt(s.tUp) + ' с</b><span>время подъёма до верхней точки</span></div>' +
        '<div><b>' + fmt(s.vx) + ' м/с</b><span>скорость в верхней точке (= vₓ)</span></div>' +
        '<div><b>' + fmt(s.vEnd) + ' м/с</b><span>скорость при падении</span></div>';
    }
    function updateLegend() {
      var h = '';
      if (st.flight || st.done) {
        var s = (st.flight || st.done).s;
        h += '<li><i class="cur" aria-hidden="true"></i><span>текущий бросок: ' + paramText(s.p) + (st.done ? ' → <b>L = ' + fmt(s.L) + ' м, H = ' + fmt(s.H) + ' м</b>' : '') + '</span></li>';
      }
      st.traces.forEach(function (tr, i) {
        h += '<li><i aria-hidden="true"></i><span>след ' + (i + 1) + ': ' + paramText(tr.p) + ' → <b>L = ' + fmt(tr.L) + ' м, H = ' + fmt(tr.H) + ' м</b></span></li>';
      });
      R('legend').innerHTML = h;
      R('clear').disabled = !st.traces.length && !st.done;
    }

    /* ---------- Вид: равный масштаб по осям ---------- */
    var PAD = { l: 46, r: 16, t: 16, b: 34 };
    function niceStep(raw) {
      var e = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), m = raw / e;
      return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e;
    }
    function view() {
      var list = [solve(params())];
      if (st.flight) list.push(st.flight.s);
      if (st.done) list.push(st.done.s);
      st.traces.forEach(function (tr) { list.push(tr); });
      var xm = 5, ym = 5;
      list.forEach(function (s) { xm = Math.max(xm, s.L); ym = Math.max(ym, s.H); });
      xm *= 1.08; ym *= 1.12;
      var pw = st.W - PAD.l - PAD.r, ph = st.H - PAD.t - PAD.b;
      var k = Math.min(pw / xm, ph / ym);
      return { k: k, pw: pw, ph: ph, x0: PAD.l, y0: st.H - PAD.b, xMax: pw / k, yMax: ph / k };
    }

    /* ---------- Рисование ---------- */
    function col(cs, n) { return cs.getPropertyValue(n).trim(); }
    function arrow(x1, y1, x2, y2, c, lw) {
      var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
      if (len < 2) return;
      var ux = dx / len, uy = dy / len, hl = Math.min(9, len * 0.45);
      ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = lw || 2;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - ux * hl * 0.6, y2 - uy * hl * 0.6); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - ux * hl - uy * hl * 0.45, y2 - uy * hl + ux * hl * 0.45);
      ctx.lineTo(x2 - ux * hl + uy * hl * 0.45, y2 - uy * hl - ux * hl * 0.45);
      ctx.closePath(); ctx.fill();
    }
    function path(s, v, tEnd) {
      var n = Math.max(24, Math.min(240, Math.ceil(tEnd * 40)));
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var q = posAt(s, tEnd * i / n);
        var X = v.x0 + q.x * v.k, Y = v.y0 - Math.max(0, q.y) * v.k;
        if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
      }
      ctx.stroke();
    }
    function label(txt, x, y, c, align, base) {
      ctx.fillStyle = c; ctx.textAlign = align || 'left'; ctx.textBaseline = base || 'alphabetic';
      ctx.fillText(txt, x, y);
    }
    function vLabel(sub, x, y, c) {
      var body = getComputedStyle(document.documentElement).getPropertyValue('--f-body').trim() || 'sans-serif';
      ctx.font = 'italic 600 13px ' + body;
      label('v', x, y, c, 'left');
      if (sub) {
        var w = ctx.measureText('v').width;
        ctx.font = 'italic 600 10px ' + body;
        label(sub, x + w + 1, y + 4, c, 'left');
      }
    }
    function draw() {
      raf = 0;
      if (!st.W) return;
      var cs = getComputedStyle(document.documentElement);
      var C = {
        ink: col(cs, '--ink'), red: col(cs, '--red'), ok: col(cs, '--ok'), warn: col(cs, '--warn'),
        text: col(cs, '--text'), muted: col(cs, '--muted'), grid: col(cs, '--grid-strong'), line: col(cs, '--line'),
        sheet: col(cs, '--sheet'), sheet2: col(cs, '--sheet-2')
      };
      var mono = col(cs, '--f-mono') || 'monospace', body = col(cs, '--f-body') || 'sans-serif';
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
      ctx.clearRect(0, 0, st.W, st.H);
      var v = view();

      /* сетка */
      var step = niceStep(40 / v.k);
      ctx.lineWidth = 1; ctx.strokeStyle = C.grid; ctx.setLineDash([]);
      ctx.font = '11px ' + mono;
      var i, X, Y;
      for (i = 0; i * step <= v.xMax + 1e-9; i++) {
        X = Math.round(v.x0 + i * step * v.k) + 0.5;
        ctx.beginPath(); ctx.moveTo(X, PAD.t); ctx.lineTo(X, v.y0); ctx.stroke();
        if (i) label(fmt(i * step, 2), X, v.y0 + 15, C.muted, 'center');
      }
      for (i = 0; i * step <= v.yMax + 1e-9; i++) {
        Y = Math.round(v.y0 - i * step * v.k) + 0.5;
        ctx.beginPath(); ctx.moveTo(v.x0, Y); ctx.lineTo(v.x0 + v.pw, Y); ctx.stroke();
        if (i) label(fmt(i * step, 2), v.x0 - 6, Y, C.muted, 'right', 'middle');
      }
      label('0', v.x0 - 6, v.y0 + 15, C.muted, 'right');
      /* оси */
      ctx.strokeStyle = C.text; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(v.x0, v.y0); ctx.lineTo(v.x0 + v.pw, v.y0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(v.x0, v.y0); ctx.lineTo(v.x0, PAD.t); ctx.stroke();
      ctx.font = '600 12px ' + body;
      label('x, м', v.x0 + v.pw, v.y0 + 29, C.text, 'right');
      label('y, м', v.x0 + 6, PAD.t + 4, C.text, 'left', 'top');

      /* площадка высотой h₀ */
      var p = params();
      var hs = st.flight ? st.flight.s.p.h : st.done ? st.done.s.p.h : p.h;
      if (hs > 0) {
        var ty = v.y0 - hs * v.k;
        ctx.fillStyle = C.sheet2; ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5;
        ctx.fillRect(v.x0 - 12, ty, 12, v.y0 - ty);
        ctx.strokeRect(v.x0 - 12 + 0.5, ty + 0.5, 12, v.y0 - ty);
      }

      /* следы предыдущих бросков */
      ctx.lineWidth = 1.6; ctx.strokeStyle = C.muted; ctx.setLineDash([5, 5]);
      st.traces.forEach(function (tr, j) {
        ctx.globalAlpha = 1 - j * 0.22;
        path(tr, v, tr.T);
        var e = posAt(tr, tr.T);
        ctx.font = '600 11px ' + mono;
        label(String(j + 1), v.x0 + e.x * v.k, v.y0 - 6, C.muted, 'center');
      });
      ctx.globalAlpha = 1;

      /* прогноз */
      var cur = solve(p);
      if (R('prev').checked && !st.flight && cur.T > 0) {
        ctx.globalAlpha = 0.5; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.setLineDash([3, 5]);
        path(cur, v, cur.T);
        ctx.globalAlpha = 1;
      }
      ctx.setLineDash([]);

      /* текущий или последний бросок */
      var fl = st.flight || st.done;
      if (fl) {
        var s = fl.s, t = st.flight ? st.flight.t : s.T;
        ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5;
        if (t > 0) path(s, v, t);
        var q = posAt(s, t), bx = v.x0 + q.x * v.k, by = v.y0 - Math.max(0, q.y) * v.k;
        if (!st.flight) {
          /* отметки высоты и дальности */
          var top = posAt(s, s.tUp), tx = v.x0 + top.x * v.k, tyy = v.y0 - top.y * v.k;
          ctx.strokeStyle = C.muted; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
          ctx.beginPath(); ctx.moveTo(v.x0, tyy); ctx.lineTo(tx, tyy); ctx.lineTo(tx, v.y0); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(tx, tyy, 3.5, 0, 7); ctx.fill();
          ctx.font = '600 12px ' + mono;
          var htx = 'H = ' + fmt(s.H) + ' м', wtx = ctx.measureText(htx).width;
          var lx = Math.min(Math.max(tx + 8, v.x0 + 4), v.x0 + v.pw - wtx - 2);
          label(htx, lx, Math.max(PAD.t + 12, tyy - 7), C.ink, 'left');
          var ltx = 'L = ' + fmt(s.L) + ' м', lw2 = ctx.measureText(ltx).width;
          label(ltx, Math.min(Math.max(bx, v.x0 + lw2 / 2 + 2), v.x0 + v.pw - lw2 / 2), v.y0 - 10, C.red, 'center');
        }
        /* векторы скорости */
        if (R('vec').checked && (st.flight || s.T > 0)) {
          var vxN = s.vx, vyN = s.vy - G * t;
          var kv = Math.max(0.9, Math.min(2.2, Math.min(v.pw, v.ph) * 0.3 / 45));
          arrow(bx, by, bx + vxN * kv, by, C.ok, 2);
          arrow(bx, by, bx, by - vyN * kv, C.warn, 2);
          arrow(bx, by, bx + vxN * kv, by - vyN * kv, C.red, 2.4);
          if (Math.abs(vxN * kv) > 14) vLabel('x', bx + vxN * kv - 8, by + 15, C.ok);
          if (Math.abs(vyN * kv) > 14) vLabel('y', bx - 20, by - vyN * kv * 0.6 + 4, C.warn);
          vLabel('', bx + vxN * kv + 6, by - vyN * kv - 4, C.red);
        }
        /* мяч */
        ctx.fillStyle = C.red; ctx.strokeStyle = C.sheet; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(bx, by, 6, 0, 7); ctx.fill(); ctx.stroke();
        /* живые показания */
        var vNow = Math.sqrt(s.vx * s.vx + Math.pow(s.vy - G * t, 2));
        ctx.font = '12px ' + mono;
        var info = 't = ' + fmt(t) + ' с   x = ' + fmt(q.x, 1) + ' м   y = ' + fmt(Math.max(0, q.y), 1) + ' м   v = ' + fmt(vNow, 1) + ' м/с';
        if (ctx.measureText(info).width > v.pw - 50) info = 't = ' + fmt(t) + ' с  v = ' + fmt(vNow, 1) + ' м/с';
        var iw = ctx.measureText(info).width;
        ctx.fillStyle = C.sheet; ctx.globalAlpha = 0.85;
        ctx.fillRect(v.x0 + v.pw - iw - 12, PAD.t, iw + 10, 20);
        ctx.globalAlpha = 1;
        label(info, v.x0 + v.pw - 7, PAD.t + 10, C.text, 'right', 'middle');
      } else {
        /* мяч на старте */
        ctx.fillStyle = C.red; ctx.strokeStyle = C.sheet; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(v.x0, v.y0 - p.h * v.k, 6, 0, 7); ctx.fill(); ctx.stroke();
      }
      /* угол броска у точки старта */
      if (!st.flight) {
        var sp = st.done ? st.done.s.p : p, sy = v.y0 - sp.h * v.k, ar = sp.a * Math.PI / 180;
        ctx.strokeStyle = C.muted; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(v.x0, sy); ctx.lineTo(v.x0 + 40, sy); ctx.stroke();
        if (sp.a > 0) {
          ctx.beginPath(); ctx.arc(v.x0, sy, 28, -ar, 0); ctx.stroke();
          ctx.font = '600 11px ' + mono;
          var ma = ar / 2;
          label(sp.a + '°', v.x0 + 34 * Math.cos(ma) + 3, sy - 34 * Math.sin(ma), C.muted, 'left', 'middle');
        }
      }
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(draw); }

    /* ---------- Анимация ---------- */
    var anim = 0;
    function tick(ts) {
      anim = 0;
      if (!el.isConnected) { cleanup(); return; }
      var f = st.flight;
      if (!f) return;
      if (f.start == null) f.start = ts;
      f.t = Math.min(f.s.T, (ts - f.start) / 1000 * f.speed);
      if (f.t >= f.s.T) {
        st.done = { s: f.s };
        st.flight = null;
        R('go').textContent = 'Бросить';
        updateLegend();
      } else {
        anim = requestAnimationFrame(tick);
      }
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      draw();
    }
    function launch() {
      var s = solve(params());
      if (st.done) { st.traces.unshift(st.done.s); st.done = null; }
      if (st.traces.length > 3) st.traces.length = 3;
      if (anim) { cancelAnimationFrame(anim); anim = 0; }
      if (s.T <= 0) {
        st.flight = null;
        st.done = { s: s };
        R('msg').textContent = 'При α = 0° и h₀ = 0 тело сразу оказывается на земле: время полёта и дальность равны нулю.';
        updateLegend(); schedule();
        return;
      }
      R('msg').textContent = '';
      st.flight = { s: s, t: 0, start: null, speed: +R('speed').value || 1 };
      R('go').textContent = 'Бросить заново';
      updateLegend();
      anim = requestAnimationFrame(tick);
    }
    function stopFlight() {
      if (st.flight) {
        if (anim) { cancelAnimationFrame(anim); anim = 0; }
        st.flight = null;
        R('go').textContent = 'Бросить';
      }
    }

    /* ---------- События ---------- */
    [inV, inA, inH].forEach(function (inp) {
      inp.addEventListener('input', function () {
        stopFlight();
        R('msg').textContent = '';
        updateOut(); updateLegend(); schedule();
      });
    });
    R('go').addEventListener('click', launch);
    R('clear').addEventListener('click', function () {
      st.traces = []; st.done = null; stopFlight();
      R('msg').textContent = '';
      updateLegend(); schedule();
    });
    R('vec').addEventListener('change', schedule);
    R('prev').addEventListener('change', schedule);
    R('speed').addEventListener('change', function () {
      if (st.flight && st.flight.start != null) {
        /* сохраняем текущий момент полёта при смене темпа */
        var now = performance.now(), sp = +R('speed').value || 1;
        st.flight.start = now - st.flight.t / sp * 1000;
        st.flight.speed = sp;
      }
    });

    /* ---------- Размер и тема ---------- */
    function resize() {
      var W = Math.round(wrap.clientWidth);
      if (!W) return;
      var H = Math.round(Math.max(240, Math.min(480, W * 0.6)));
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
      if (anim) cancelAnimationFrame(anim);
      raf = anim = 0;
    }

    updateOut();
    updateLegend();
  }

  KL.labs.projectile = {
    title: 'Бросок под углом',
    icon: 'v₀',
    desc: 'Траектория, время полёта, высота и дальность броска под углом к горизонту',
    long: 'Задайте начальную скорость, угол и высоту броска и посмотрите на полёт тела с векторами скорости. Сравнивайте броски между собой: следы предыдущих траекторий остаются на графике, а время полёта, максимальная высота и дальность считаются по точным формулам.',
    subjectName: 'Физика',
    mount: mount,
    core: { solve: solve, fmt: fmt, G: G }
  };
})();
