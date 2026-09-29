/* Клетка — движок сайта: данные, прогресс, маршруты, задания, пробник, карточки, поиск, ИИ-репетитор. */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  var main = document.getElementById('main');

  /* ================= Утилиты ================= */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function strip(html) { return String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim(); }
  function plural(n, one, few, many) {
    n = Math.abs(n);
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
  function today(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  /* Полночь через n дней от now (по местному времени, с учётом перехода на летнее время) */
  function dayStart(now, n) { var d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + (n || 0)); return d.getTime(); }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function frag(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function examName(m) { return m === 'oge' ? 'ОГЭ' : 'ЕГЭ'; }
  function reducedMotion() { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function scrollToEl(el) { if (el) el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' }); }
  function focusEl(el) {
    if (!el) return;
    if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
    try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
  }
  var LETTERS = 'АБВГДЕЖЗИК';
  var IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || '');
  var ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    up: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 15 6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    grip: '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/></svg>',
    print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5 5 5M4 21h16"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7z"/></svg>'
  };

  /* ================= Предметы и индекс ================= */
  var ORDER = ['math', 'russian', 'physics', 'chemistry', 'biology', 'informatics', 'history', 'social', 'english', 'geography'];
  var GLYPH = { math: 'x²', russian: 'Ёё', physics: 'λ', chemistry: 'H₂O', biology: 'ДНК', informatics: '01', history: '862', social: '§', english: 'Aa', geography: '60°' };
  var SHORT = { math: 'Математика', russian: 'Русский', physics: 'Физика', chemistry: 'Химия', biology: 'Биология', informatics: 'Информатика', history: 'История', social: 'Общество', english: 'Английский', geography: 'География' };
  var subjects = (KL.subjects || []).filter(function (s) { return s && s.id && s.name; }).slice().sort(function (a, b) {
    var ia = ORDER.indexOf(a.id), ib = ORDER.indexOf(b.id);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  var S = {}, T = {}, Q = {};
  subjects.forEach(function (s) {
    S[s.id] = s;
    s.topics = s.topics || [];
    s.exams = s.exams || {};
    s.topics.forEach(function (t, ti) {
      t._s = s; t._i = ti; T[t.id] = t;
      t.tasks = t.tasks || []; t.keyPoints = t.keyPoints || []; t.theory = t.theory || [];
      t.tasks.forEach(function (q, qi) { q._t = t; q._s = s; q._i = qi; Q[q.id] = q; });
    });
  });
  function glyph(s, cls) {
    var g = GLYPH[s.id] || s.name.slice(0, 2);
    var fs = g.length >= 3 ? ' style="font-size:' + (cls === 'sm' ? 11 : 14) + 'px"' : '';
    return '<span class="glyph" aria-hidden="true"' + fs + '>' + esc(g) + '</span>';
  }
  function cvar(s) { return '--c: var(--s-' + s.id + ', var(--ink))'; }
  function taskFits(q, mode) { return q.exam === 'both' || q.exam === mode; }
  function topicFits(t, mode) { return (t.exam || []).indexOf(mode) >= 0; }
  function examRef(t, mode) {
    var r = t.refs && t.refs[mode];
    return r ? examName(mode) + ' № ' + r : '';
  }

  /* ================= Хранилище прогресса ================= */
  var Store = {
    key: 'kletka.v1',
    data: null,
    warned: false,
    defaults: function () {
      return { exam: 'ege', examDate: {}, theme: null, xp: 0, days: {}, tasks: {}, read: {}, review: {}, cards: {}, history: [], last: null, plan: null };
    },
    /* Приводит данные к ожидаемой форме: повреждённое хранилище или чужой файл не должны ронять сайт */
    sanitize: function (d) {
      var def = this.defaults();
      if (!d || typeof d !== 'object' || Array.isArray(d)) return def;
      var isObj = function (v) { return v && typeof v === 'object' && !Array.isArray(v); };
      if (d.exam === 'oge' || d.exam === 'ege') def.exam = d.exam;
      if (d.theme === 'light' || d.theme === 'dark') def.theme = d.theme;
      if (typeof d.xp === 'number' && isFinite(d.xp) && d.xp > 0) def.xp = Math.round(d.xp);
      if (typeof d.last === 'string') def.last = d.last;
      ['examDate', 'days', 'read', 'cards'].forEach(function (k) { if (isObj(d[k])) def[k] = d[k]; });
      if (isObj(d.tasks)) Object.keys(d.tasks).forEach(function (id) {
        var st = d.tasks[id];
        if (isObj(st)) def.tasks[id] = { tries: Math.max(0, +st.tries || 0), solved: !!st.solved, first: !!st.first, ok: !!st.ok, at: +st.at || 0 };
      });
      if (isObj(d.review)) Object.keys(d.review).forEach(function (id) {
        var r = d.review[id];
        if (isObj(r)) def.review[id] = { box: Math.max(0, +r.box || 0), due: +r.due || 0 };
      });
      if (Array.isArray(d.history)) def.history = d.history.filter(function (h) { return isObj(h) && h.n > 0; }).slice(-60);
      if (isObj(d.plan) && Array.isArray(d.plan.subjects)) def.plan = { subjects: d.plan.subjects.filter(function (x) { return typeof x === 'string'; }) };
      return def;
    },
    load: function () {
      var d = null;
      try { d = JSON.parse(localStorage.getItem(this.key) || 'null'); } catch (e) { d = null; }
      this.data = this.sanitize(d);
    },
    save: function () {
      try { localStorage.setItem(this.key, JSON.stringify(this.data)); return true; } catch (e) {
        if (!this.warned) { this.warned = true; setTimeout(function () { toast('Браузер не даёт сохранить прогресс: хранилище недоступно или переполнено'); }, 0); }
        return false;
      }
    }
  };
  Store.load();
  var D = function () { return Store.data; };

  var DAY = 86400000;
  var BOX_DAYS = [0, 1, 3, 7];
  var Progress = {
    /* ctx: 'practice' | 'exam' | 'review'; o.retry — повторная попытка сразу после ошибки */
    record: function (q, ok, ctx, o) {
      o = o || {};
      var d = D(), now = Date.now();
      var st = d.tasks[q.id] || { tries: 0, solved: false, first: false };
      var firstTime = !st.solved && ok;
      st.tries++;
      if (st.tries === 1 && ok) st.first = true;
      st.ok = ok; st.at = now;
      if (ok) st.solved = true;
      d.tasks[q.id] = st;
      var key = today();
      d.days[key] = (d.days[key] || 0) + 1;
      var gained = 0;
      if (firstTime) gained = 5 * (q.difficulty || 1) + (st.first ? 5 : 0);
      d.xp += gained;
      var r = d.review[q.id];
      if (!ok) d.review[q.id] = { box: 0, due: now };
      else if (r && !o.retry && (ctx === 'review' || now >= r.due)) {
        /* Верный ответ сразу после ошибки («Ещё раз») не двигает интервал: навык ещё не проверен временем */
        r.box++;
        if (r.box >= BOX_DAYS.length) delete d.review[q.id];
        else r.due = dayStart(now, BOX_DAYS[r.box]);
      }
      Store.save();
      updateBadge();
      return gained;
    },
    /* Пропущенное в пробнике задание: не попытка, но попадает в тренажёр ошибок */
    skip: function (q) {
      var d = D();
      if (!d.review[q.id]) d.review[q.id] = { box: 0, due: Date.now() };
    },
    topicStats: function (t) {
      var d = D(), solved = 0, attempted = 0, firstOk = 0, total = t.tasks.length;
      t.tasks.forEach(function (q) {
        var st = d.tasks[q.id];
        if (!st) return;
        attempted++;
        if (st.solved) solved++;
        if (st.first) firstOk++;
      });
      return { solved: solved, total: total, pct: total ? solved / total : 0, read: !!d.read[t.id], attempted: attempted, firstOk: firstOk };
    },
    mastered: function (t) { var st = Progress.topicStats(t); return st.pct >= 0.8 && st.read; },
    started: function (t) { var st = Progress.topicStats(t); return !!(st.attempted || st.read); },
    subjectStats: function (s) {
      var solved = 0, total = 0, mastered = 0;
      s.topics.forEach(function (t) {
        var st = Progress.topicStats(t);
        solved += st.solved; total += st.total;
        if (st.pct >= 0.8 && st.read) mastered++;
      });
      return { solved: solved, total: total, pct: total ? solved / total : 0, mastered: mastered };
    },
    status: function (t) {
      var st = Progress.topicStats(t);
      if (st.pct >= 0.8 && st.read) return '<span class="chip ok">освоено</span>';
      if (st.solved || st.attempted || st.read) return '<span class="chip ink">в процессе</span>';
      return '<span class="chip">не начато</span>';
    },
    streak: function () {
      var d = D().days, n = 0, cur = new Date();
      cur.setHours(12, 0, 0, 0);
      if (!d[today(cur)]) cur.setDate(cur.getDate() - 1);
      while (d[today(cur)]) { n++; cur.setDate(cur.getDate() - 1); }
      return n;
    },
    totals: function () {
      var d = D(), solved = 0, first = 0, attempted = 0;
      Object.keys(d.tasks).forEach(function (id) {
        var st = d.tasks[id]; if (!st.tries) return;
        attempted++; if (st.solved) solved++; if (st.first) first++;
      });
      return { solved: solved, attempted: attempted, acc: attempted ? Math.round(first / attempted * 100) : 0 };
    },
    dueReview: function (sid) {
      var d = D(), now = Date.now();
      return Object.keys(d.review).filter(function (id) {
        return Q[id] && d.review[id].due <= now && (!sid || Q[id]._s.id === sid);
      }).sort(function (a, b) { return d.review[a].due - d.review[b].due; }).map(function (id) { return Q[id]; });
    }
  };

  /* ================= Общие элементы интерфейса ================= */
  var toastTimer = null;
  function toast(msg) {
    var old = $('.toast'); if (old) old.remove();
    clearTimeout(toastTimer);
    var t = frag('<div class="toast" role="status" aria-live="polite">' + esc(msg) + '</div>');
    document.body.appendChild(t);
    toastTimer = setTimeout(function () { t.remove(); }, Math.max(2600, String(msg).length * 60));
  }
  function xpPop(el, n) {
    if (!n || !el) return;
    var r = el.getBoundingClientRect();
    var p = frag('<div class="xp-pop" aria-hidden="true">+' + n + ' XP</div>');
    p.style.left = Math.max(8, Math.min(window.innerWidth - 90, r.left + r.width / 2 - 20)) + 'px';
    p.style.top = Math.max(8, r.top - 10) + 'px';
    document.body.appendChild(p);
    setTimeout(function () { p.remove(); }, 1000);
  }
  var fitQueued = false;
  function renderMath(el) {
    if (!el || typeof window.renderMathInElement !== 'function') return;
    try {
      window.renderMathInElement(el, {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
        output: 'mathml', throwOnError: false, strict: false,
        ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'option', 'input']
      });
    } catch (e) { /* формулы останутся текстом */ }
    /* Выключные формулы — в блок с собственной прокруткой, чтобы не распирать страницу */
    $$('math[display="block"]', el).forEach(function (m) {
      var p = m.parentNode;
      if (p && p.classList && p.classList.contains('katex')) p.classList.add('katex-block');
    });
    if (!fitQueued) { fitQueued = true; requestAnimationFrame(function () { fitQueued = false; fitMath(main); }); }
  }
  /* Строчная формула шире колонки (узкий экран) получает горизонтальную прокрутку вместо вылета за край */
  function fitMath(root) {
    if (!root) return;
    $$('.katex:not(.katex-block)', root).forEach(function (k) {
      var box = k.parentElement; if (!box) return;
      k.classList.remove('katex-wide');
      var avail = box.getBoundingClientRect();
      var r = k.getBoundingClientRect();
      if (r.width > 0 && (r.right > avail.right + 1 || r.width > avail.width + 1)) k.classList.add('katex-wide');
    });
  }
  function wrapTables(el) {
    $$('table', el).forEach(function (t) {
      if (t.parentNode.classList.contains('tbl-wrap') || t.closest('.lab-frame') || t.classList.contains('answer-table')) return;
      var w = document.createElement('div'); w.className = 'tbl-wrap';
      t.parentNode.insertBefore(w, t); w.appendChild(t);
    });
  }
  function enhance(el) {
    wrapTables(el);
    mountQuick(el);
    mountLabs(el);
    renderMath(el);
  }
  function mountLabs(el) {
    $$('.lab-embed[data-lab]', el).forEach(function (box) {
      if (box.dataset.mounted) return;
      box.dataset.mounted = '1';
      var lab = KL.labs && KL.labs[box.dataset.lab];
      if (!lab) { box.hidden = true; return; }
      box.appendChild(labFrame(lab, box.dataset.lab, true));
    });
  }
  function labFrame(lab, id, embedded) {
    var f = frag('<div class="lab-frame"><div class="lab-bar"><span class="lab-tag">Лаборатория</span><b>' + esc(lab.title) + '</b><span class="grow"></span>' +
      (embedded ? '<a class="btn sm ghost" href="#/labs/' + esc(id) + '">Открыть отдельно</a>' : '') + '</div><div class="lab-body"></div></div>');
    try { lab.mount($('.lab-body', f)); } catch (e) {
      $('.lab-body', f).textContent = 'Лабораторию не удалось запустить: ' + e.message;
      if (window.console) console.error(e);
    }
    return f;
  }
  function mountQuick(el) {
    $$('.quick[data-a]', el).forEach(function (box, i) {
      if (box.dataset.mounted) return;
      box.dataset.mounted = '1';
      var qid = 'quick-' + hashStr(box.textContent + i) + '-' + (++uid);
      var q = document.createElement('div'); q.className = 'quick-q'; q.id = qid + '-q';
      while (box.firstChild) q.appendChild(box.firstChild);
      box.appendChild(q);
      var inp = frag('<input class="blank lower" id="' + qid + '" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" placeholder="ответ" aria-labelledby="' + qid + '-q">');
      var btn = frag('<button class="btn sm" type="button">Проверить</button>');
      var res = frag('<span class="quick-res" aria-live="polite"></span>');
      box.appendChild(inp); box.appendChild(btn); box.appendChild(res);
      var answers = box.dataset.a.split('|');
      function go() {
        if (!inp.value.trim()) { res.style.color = 'var(--muted)'; res.textContent = ''; inp.focus(); toast('Впишите ответ'); return; }
        var ok = checkInput(answers, inp.value, null);
        inp.classList.toggle('ok', ok); inp.classList.toggle('bad', !ok);
        res.style.color = ok ? 'var(--ok)' : 'var(--red)';
        res.textContent = ok ? 'Верно!' : 'Ответ: ' + answers[0];
      }
      btn.addEventListener('click', go);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } });
      inp.addEventListener('input', function () { inp.classList.remove('ok', 'bad'); res.textContent = ''; });
    });
  }
  var uid = 0;

  /* ================= Проверка ответов ================= */
  function norm(s) {
    return String(s == null ? '' : s).toLowerCase().replace(/ё/g, 'е').replace(/[’‘`´ʼ]/g, "'").replace(/[−–—‒]/g, '-')
      .replace(/ | /g, ' ').replace(/\s+/g, ' ').trim().replace(/\.$/, '').trim();
  }
  /* Число из строки. Пробел допустим только как разделитель тысяч («266 200»), запятая и точка — десятичные.
     «1, 5» или «2,4,1,3» — это не число, а перечень. */
  function num(s) {
    var t = norm(s);
    if (/^[-+]?\d{1,3}( \d{3})+([.,]\d+)?$/.test(t)) t = t.replace(/ /g, '');
    t = t.replace(',', '.');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/.test(t)) return null;
    return parseFloat(t);
  }
  function squash(s) { return norm(s).replace(/[\s,;]/g, ''); }
  function checkInput(answers, value, tol) {
    if (!String(value == null ? '' : value).trim()) return false;
    var v = norm(value), vn = num(value);
    var vLead = /^[-+]?0\d/.test(v.replace(/\s/g, ''));
    return answers.some(function (a) {
      a = String(a);
      if (norm(a) === v) return true;
      var an = num(a);
      if (an !== null && vn !== null) {
        /* Оба ответа — числа: сравниваем только как числа, чтобы «1,5» не совпало с «15» */
        if (/^[-+]?0\d/.test(norm(a).replace(/\s/g, '')) || vLead) return false;
        if (tol) return Math.abs(an - vn) <= Math.abs(tol) * (1 + 1e-9) + 1e-12;
        return Math.abs(an - vn) <= 1e-9 * Math.max(1, Math.abs(an));
      }
      /* Перечень цифр/слов: «2, 4, 1, 3» = «2413» */
      return squash(a) === squash(value) && squash(a) !== '';
    });
  }
  function numSort(a) { return a.slice().sort(function (x, y) { return x - y; }); }
  function stripUnit(q, v) {
    if (!q.unit || typeof v !== 'string') return v;
    var u = norm(q.unit), s = norm(v);
    if (u && s.length > u.length && s.slice(-u.length) === u) return s.slice(0, -u.length).trim();
    return v;
  }
  function isCorrect(q, v) {
    switch (q.type) {
      case 'choice': return v === q.answer;
      case 'multi':
        if (!Array.isArray(v)) return false;
        var a = numSort(q.answer), b = numSort(v);
        return a.length === b.length && a.every(function (x, i) { return x === b[i]; });
      case 'input':
        var ans = Array.isArray(q.answer) ? q.answer : [q.answer];
        return checkInput(ans, v, q.tolerance) || checkInput(ans, stripUnit(q, v), q.tolerance);
      case 'order': return Array.isArray(v) && v.length === q.items.length && v.every(function (x, i) { return x === i; });
      case 'match': return Array.isArray(v) && v.length === q.answer.length && q.answer.every(function (x, i) { return v[i] === x; });
    }
    return false;
  }
  function correctText(q) {
    switch (q.type) {
      case 'choice': return '<b>' + (q.answer + 1) + '</b> — ' + q.options[q.answer];
      case 'multi': return '<b>' + numSort(q.answer).map(function (i) { return i + 1; }).join('') + '</b>';
      case 'input': return '<b>' + esc(Array.isArray(q.answer) ? q.answer[0] : q.answer) + '</b>' + (q.unit ? ' ' + esc(q.unit) : '');
      case 'order': return '<ol>' + q.items.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol>';
      case 'match': return '<b>' + q.answer.map(function (x, i) { return LETTERS[i] + '–' + (x + 1); }).join(', ') + '</b> (в бланк: <b>' + q.answer.map(function (x) { return x + 1; }).join('') + '</b>)';
    }
    return '';
  }
  function isEmptyValue(q, v) {
    if (v == null) return true;
    if (typeof v === 'string') return !v.trim();
    if (Array.isArray(v)) return !v.length || v.some(function (x) { return x === null || x === undefined; });
    return false;
  }
  function valueText(q, v) {
    if (isEmptyValue(q, v) && !(q.type === 'match' && Array.isArray(v) && v.some(function (x) { return x != null; }))) return '—';
    switch (q.type) {
      case 'choice': return String(v + 1);
      case 'multi': return numSort(v).map(function (i) { return i + 1; }).join('');
      case 'input': return String(v);
      case 'order': return v.map(function (i) { return strip(q.items[i]); }).join(' → ');
      case 'match': return v.map(function (x, i) { return LETTERS[i] + (x == null ? '?' : x + 1); }).join(' ');
    }
    return '';
  }
  var TYPE_NAME = { choice: 'Один ответ', multi: 'Несколько ответов', input: 'Краткий ответ', order: 'Последовательность', match: 'Соответствие' };

  /* ================= Карточка задания =================
     opts: num, mode ('practice' | 'exam' | 'review'), value, onChange(v, init), onResult(ok, gained), onEnter(), showTopic, ephemeral */
  function renderTask(q, opts) {
    opts = opts || {};
    var mode = opts.mode || 'practice';
    var st = D().tasks[q.id];
    var el = document.createElement('article');
    var tid = 'task-' + (++uid);
    el.className = 'task sheet';
    el.dataset.id = q.id;
    el.setAttribute('aria-labelledby', tid + '-h');
    var diff = Math.max(1, Math.min(3, q.difficulty || 1));
    var examChip = q.exam === 'both' ? '<span class="chip">ОГЭ · ЕГЭ</span>' : '<span class="chip">' + examName(q.exam) + '</span>';
    var dots = '<span class="dots" role="img" aria-label="Сложность ' + diff + ' из 3" title="Сложность ' + diff + ' из 3">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= diff ? 'on' : '') + '"></i>'; }).join('') + '</span>';
    var topicLink = opts.showTopic && q._t ? '<a href="#/s/' + q._s.id + '/' + q._t.id + '" class="muted">' + esc(SHORT[q._s.id] || q._s.name) + ' · ' + esc(q._t.title) + '</a>' : '';
    var solvedChip = mode !== 'exam' && st && st.solved && !opts.ephemeral ? '<span class="chip ok">решено</span>' : '';
    el.innerHTML =
      '<div class="task-head"><span class="task-num" id="' + tid + '-h" aria-label="Задание ' + esc(opts.num || '') + '">' + (opts.num || '') + '</span>' + examChip + dots +
      '<span>' + TYPE_NAME[q.type] + '</span>' + solvedChip + (opts.ephemeral ? '<span class="chip ink">от ИИ</span>' : '') + topicLink + '</div>' +
      '<div class="task-q" id="' + tid + '-q">' + q.q + '</div><div class="task-body"></div>' +
      (mode === 'exam' ? '' :
        '<div class="task-actions"><button class="btn primary" data-act="check" type="button">Проверить</button>' +
        (q.hint ? '<button class="btn ghost" data-act="hint" type="button" aria-expanded="false">Подсказка</button>' : '') +
        '<button class="btn ghost" data-act="solution" type="button" hidden>Решение</button>' +
        '<button class="btn ghost" data-act="retry" type="button" hidden>Ещё раз</button>' +
        '<button class="btn ghost ai-only" data-act="ai" type="button" hidden>' + ICON.spark + ' Разобрать с ИИ</button></div>' +
        '<div class="task-extra"></div><p class="sr" aria-live="polite" data-role="status"></p>');

    var body = $('.task-body', el);
    var value = opts.value !== undefined ? opts.value : null;
    function set(v) { value = v; if (opts.onChange) opts.onChange(v, false); }
    function locked() { return el.classList.contains('locked'); }
    function submit() {
      var c = $('[data-act="check"]', el);
      if (c && !c.hidden) c.click();
      else if (opts.onEnter) opts.onEnter();
    }

    if (q.type === 'choice' || q.type === 'multi') {
      if (q.type === 'multi') {
        body.insertAdjacentHTML('beforeend', '<p class="muted task-note">Выберите все верные варианты. В бланк записываются их номера.</p>');
        if (!Array.isArray(value)) value = [];
      }
      var list = document.createElement('div'); list.className = 'opts';
      list.setAttribute('role', q.type === 'choice' ? 'radiogroup' : 'group');
      list.setAttribute('aria-labelledby', tid + '-q');
      q.options.forEach(function (o, i) {
        var b = frag('<button type="button" class="opt" role="' + (q.type === 'choice' ? 'radio' : 'checkbox') + '" aria-checked="false"><span class="box" aria-hidden="true">' + (i + 1) + '</span><span>' + o + '</span></button>');
        b.addEventListener('click', function () {
          if (locked()) return;
          if (q.type === 'choice') set(i);
          else { var a = value.slice(); var k = a.indexOf(i); if (k >= 0) a.splice(k, 1); else a.push(i); set(a); }
          paintOpts();
        });
        list.appendChild(b);
      });
      /* Стрелки внутри группы, как у нативных радиокнопок */
      list.addEventListener('keydown', function (e) {
        if (['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].indexOf(e.key) < 0) return;
        var bs = $$('.opt', list), i = bs.indexOf(document.activeElement);
        if (i < 0) return;
        e.preventDefault();
        var n = (i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length;
        bs[n].focus();
      });
      body.appendChild(list);
      var paintOpts = function () {
        $$('.opt', list).forEach(function (b, i) {
          var on = q.type === 'choice' ? value === i : value.indexOf(i) >= 0;
          b.classList.toggle('sel', on); b.setAttribute('aria-checked', on ? 'true' : 'false');
        });
      };
      paintOpts();
    } else if (q.type === 'input') {
      var iid = 'ans-' + tid;
      var row = frag('<div class="input-row"><label class="sr" for="' + iid + '">Ответ' + (q.unit ? ' в ' + esc(q.unit) : '') + '</label><input class="blank" id="' + iid + '" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="Ответ" maxlength="40">' + (q.unit ? '<span class="unit" aria-hidden="true">' + esc(q.unit) + '</span>' : '') + '</div>');
      var inp = $('input', row);
      var a0 = String(Array.isArray(q.answer) ? q.answer[0] : q.answer);
      if (!/[a-zа-яё]/i.test(a0) || /[a-z]/.test(a0)) inp.classList.add('lower');
      if (/^[-+−]?[\d\s]+([.,]\d+)?$/.test(a0) && !q.unit) inp.setAttribute('inputmode', 'decimal');
      if (value) inp.value = value;
      inp.addEventListener('input', function () { set(inp.value); });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); submit(); } });
      body.appendChild(row);
    } else if (q.type === 'order') {
      if (!Array.isArray(value) || value.length !== q.items.length) {
        var idx = q.items.map(function (_, i) { return i; });
        var sh = shuffle(idx), guard = 0;
        while (sh.every(function (x, i) { return x === i; }) && guard++ < 10) sh = shuffle(idx);
        value = sh; if (opts.onChange) opts.onChange(value, true);
      }
      body.insertAdjacentHTML('beforeend', '<p class="muted task-note">Перетащите строки за ручку ⋮⋮ или переставляйте кнопками со стрелками.</p>');
      var ol = document.createElement('ol'); ol.className = 'order-list';
      ol.setAttribute('aria-labelledby', tid + '-q');
      var live = frag('<p class="sr" aria-live="assertive"></p>');
      body.appendChild(ol); body.appendChild(live);
      var paintOrder = function (focus) {
        ol.innerHTML = '';
        var n = value.length, lk = locked();
        value.forEach(function (orig, pos) {
          var txt = esc(strip(q.items[orig]).slice(0, 80));
          var li = frag('<li class="order-item" data-orig="' + orig + '"><span class="grip" aria-hidden="true">' + ICON.grip + '</span><span class="box" aria-hidden="true">' + (pos + 1) + '</span><span class="order-text">' + q.items[orig] + '</span>' +
            '<span class="mv"><button type="button" data-d="-1" aria-label="Выше: ' + txt + '"' + (pos === 0 || lk ? ' disabled' : '') + '>' + ICON.up + '</button>' +
            '<button type="button" data-d="1" aria-label="Ниже: ' + txt + '"' + (pos === n - 1 || lk ? ' disabled' : '') + '>' + ICON.down + '</button></span></li>');
          ol.appendChild(li);
        });
        renderMath(ol);
        if (focus) {
          var li2 = ol.children[focus.pos];
          var bt = li2 && ($('[data-d="' + focus.d + '"]:not([disabled])', li2) || $('button:not([disabled])', li2));
          if (bt) bt.focus();
        }
      };
      var move = function (pos, d) {
        if (locked()) return;
        var np = pos + d; if (np < 0 || np >= value.length) return;
        var a = value.slice(); var t = a[pos]; a[pos] = a[np]; a[np] = t; set(a);
        paintOrder({ pos: np, d: d });
        live.textContent = '«' + strip(q.items[a[np]]).slice(0, 60) + '» — теперь ' + (np + 1) + '-й из ' + a.length;
      };
      ol.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-d]');
        if (!b || b.disabled) return;
        var li = b.closest('.order-item');
        move(Array.prototype.indexOf.call(ol.children, li), +b.dataset.d);
      });
      ol.addEventListener('pointerdown', function (e) {
        var item = e.target.closest('.order-item');
        if (!item || e.button > 0 || e.target.closest('button') || locked()) return;
        /* На тачскрине тянем только за ручку — остальная строка прокручивает страницу */
        if (e.pointerType !== 'mouse' && !e.target.closest('.grip')) return;
        e.preventDefault();
        var pid = e.pointerId;
        item.classList.add('dragging');
        var mv = function (ev) {
          if (ev.pointerId !== pid) return;
          ev.preventDefault();
          var over = document.elementFromPoint(ev.clientX, ev.clientY);
          over = over && over.closest('.order-item');
          if (over && over !== item && over.parentNode === ol) {
            var r = over.getBoundingClientRect();
            ol.insertBefore(item, ev.clientY > r.top + r.height / 2 ? over.nextSibling : over);
          }
          if (ev.clientY < 70) window.scrollBy(0, -12);
          else if (ev.clientY > window.innerHeight - 70) window.scrollBy(0, 12);
        };
        var up = function (ev) {
          if (ev.pointerId !== pid) return;
          item.classList.remove('dragging');
          window.removeEventListener('pointermove', mv);
          window.removeEventListener('pointerup', up);
          window.removeEventListener('pointercancel', up);
          var nv = $$('.order-item', ol).map(function (li) { return +li.dataset.orig; });
          if (nv.join() !== value.join()) set(nv);
          paintOrder();
        };
        window.addEventListener('pointermove', mv, { passive: false });
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', up);
      });
      paintOrder();
      el._repaintOrder = function () { paintOrder(); };
    } else if (q.type === 'match') {
      var R = q.right.length;
      if (!Array.isArray(value) || value.length !== q.left.length) value = q.left.map(function () { return null; });
      var cols = frag('<div class="match-cols"><div class="match-col"><span class="eyebrow">Столбец А</span></div><div class="match-col"><span class="eyebrow">Столбец Б</span></div></div>');
      q.left.forEach(function (x, i) { $$('.match-col', cols)[0].appendChild(frag('<div class="match-item"><b>' + LETTERS[i] + ')</b><span>' + x + '</span></div>')); });
      q.right.forEach(function (x, i) { $$('.match-col', cols)[1].appendChild(frag('<div class="match-item"><b>' + (i + 1) + ')</b><span>' + x + '</span></div>')); });
      body.appendChild(cols);
      var tbl = frag('<div class="match-answer"><span class="eyebrow">Ответ в бланк</span><table class="answer-table"><tr>' +
        q.left.map(function (_, i) { return '<th scope="col">' + LETTERS[i] + '</th>'; }).join('') + '</tr><tr>' +
        q.left.map(function (_, i) { return '<td><input inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off" enterkeyhint="next" id="m-' + tid + '-' + i + '" aria-label="' + LETTERS[i] + ': номер из столбца Б, от 1 до ' + R + '"></td>'; }).join('') + '</tr></table>' +
        '<p class="muted match-note" aria-live="polite"></p></div>');
      var ins = $$('input', tbl), note = $('.match-note', tbl);
      ins.forEach(function (inp, i) {
        if (value[i] != null) inp.value = value[i] + 1;
        inp.addEventListener('focus', function () { try { inp.select(); } catch (e) { /* ignore */ } });
        inp.addEventListener('input', function () {
          if (inp.readOnly) return;
          var dgt = inp.value.replace(/\D/g, '').slice(-1);
          var n = parseInt(dgt, 10);
          var a = value.slice();
          if (dgt && !(n >= 1 && n <= R)) {
            inp.value = '';
            note.textContent = 'В столбце Б только номера от 1 до ' + R + '.';
            a[i] = null; set(a);
            return;
          }
          note.textContent = '';
          inp.value = dgt;
          a[i] = dgt ? n - 1 : null;
          set(a);
          if (dgt && ins[i + 1]) ins[i + 1].focus();
        });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Backspace' && !inp.value && ins[i - 1]) { e.preventDefault(); ins[i - 1].focus(); }
          else if (e.key === 'ArrowLeft' && ins[i - 1]) { e.preventDefault(); ins[i - 1].focus(); }
          else if (e.key === 'ArrowRight' && ins[i + 1]) { e.preventDefault(); ins[i + 1].focus(); }
          else if (e.key === 'Enter') { e.preventDefault(); submit(); }
        });
      });
      body.appendChild(tbl);
    }

    el.getValue = function () { return value; };
    el.setLocked = function (on) {
      el.classList.toggle('locked', on);
      $$('input', body).forEach(function (i) { i.readOnly = on; });
      $$('.opt', body).forEach(function (b) { b.setAttribute('aria-disabled', on ? 'true' : 'false'); });
      if (el._repaintOrder) el._repaintOrder();
    };

    if (mode !== 'exam') {
      var extra = $('.task-extra', el);
      var status = $('[data-role="status"]', el);
      var btn = function (a) { return $('[data-act="' + a + '"]', el); };
      var shown = { hint: false, sol: false };
      var lastWrong = null, attempts = 0;
      var clearMarks = function () {
        $$('.opt', el).forEach(function (o) { o.classList.remove('right', 'wrong'); });
        $$('.order-item', el).forEach(function (o) { o.classList.remove('right', 'wrong'); });
        $$('input', body).forEach(function (i) { i.classList.remove('ok', 'bad'); });
        var m = $('.mark', el); if (m) m.remove();
      };
      var paintResult = function (ok) {
        clearMarks();
        if (q.type === 'choice' || q.type === 'multi') {
          $$('.opt', el).forEach(function (o, i) {
            var right = q.type === 'choice' ? i === q.answer : q.answer.indexOf(i) >= 0;
            var sel = q.type === 'choice' ? value === i : value.indexOf(i) >= 0;
            if (sel && right) o.classList.add('right');
            else if (sel && !right) o.classList.add('wrong');
            else if (!sel && right && ok) o.classList.add('right');
          });
        } else if (q.type === 'input') {
          $('input', body).classList.add(ok ? 'ok' : 'bad');
        } else if (q.type === 'order') {
          $$('.order-item', el).forEach(function (li, pos) { li.classList.add(+li.dataset.orig === pos ? 'right' : 'wrong'); });
        } else if (q.type === 'match') {
          $$('input', body).forEach(function (inp, i) { inp.classList.add(value[i] === q.answer[i] ? 'ok' : 'bad'); });
        }
        var mk = frag('<span class="mark ' + (ok ? 'ok' : 'bad') + '" aria-hidden="true">' + (ok ? 'Верно!' : 'Не так') + '</span>');
        el.appendChild(mk);
      };
      var showSolution = function () {
        if (shown.sol) return;
        shown.sol = true;
        el.setLocked(true);
        var box = frag('<div class="task-reveal"><div class="correct-answer"><span class="eyebrow">Правильный ответ</span>' + correctText(q) + '</div><div><span class="eyebrow">Решение</span>' + (q.solution || '') + '</div></div>');
        extra.appendChild(box);
        enhance(box);
        btn('solution').hidden = true;
        btn('retry').hidden = true;
        btn('check').hidden = true;
        focusEl(box);
      };
      btn('check').addEventListener('click', function () {
        if (isEmptyValue(q, value) && q.type !== 'order') {
          toast(q.type === 'match' ? 'Заполните все клетки ответа' : q.type === 'input' ? 'Сначала впишите ответ' : 'Сначала выберите ответ');
          var f = $('input:not([readonly])', body);
          if (q.type === 'match') f = $$('input', body).filter(function (x) { return !x.value; })[0] || f;
          if (f) f.focus();
          return;
        }
        var ok = isCorrect(q, value);
        paintResult(ok);
        var gained = opts.ephemeral ? 0 : Progress.record(q, ok, mode, { retry: attempts > 0 });
        attempts++;
        xpPop(btn('check'), gained);
        status.textContent = ok ? 'Верно!' + (gained ? ' Плюс ' + gained + ' XP.' : '') : 'Неверно. Можно попробовать ещё раз или посмотреть решение.';
        el.setLocked(true);
        btn('check').hidden = true;
        btn('solution').hidden = shown.sol;
        if (ok) {
          btn('retry').hidden = true;
          btn('ai').hidden = true;
          btn('solution').textContent = 'Решение';
        } else {
          lastWrong = valueText(q, value);
          btn('retry').hidden = shown.sol;
          btn('solution').textContent = 'Показать ответ и решение';
          btn('ai').hidden = false;
        }
        if (opts.onResult) opts.onResult(ok, gained);
        var nb = !btn('retry').hidden ? btn('retry') : !btn('solution').hidden ? btn('solution') : null;
        if (nb && el.contains(document.activeElement) || document.activeElement === document.body) { if (nb) nb.focus(); }
      });
      btn('retry').addEventListener('click', function () {
        el.setLocked(false);
        clearMarks();
        status.textContent = '';
        btn('check').hidden = false; btn('retry').hidden = true;
        var f = $('input', body) || $('.opt.sel', body) || $('.opt', body) || $('.order-item button:not([disabled])', body);
        if (f) f.focus();
      });
      btn('solution').addEventListener('click', showSolution);
      if (btn('hint')) btn('hint').addEventListener('click', function () {
        if (shown.hint) return; shown.hint = true;
        var hb = frag('<div class="hint-box" tabindex="-1">' + q.hint + '</div>');
        extra.insertBefore(hb, extra.firstChild);
        renderMath(hb);
        btn('hint').setAttribute('aria-expanded', 'true');
        btn('hint').hidden = true;
        focusEl(hb);
      });
      btn('ai').addEventListener('click', function () { AI.explain(q, lastWrong, extra, btn('ai')); });
    }
    enhance(el);
    return el;
  }

  /* ================= ИИ-репетитор (возможность sample) ================= */
  var AI = {
    sample: null,
    init: function () {
      try {
        if (!window.claude || typeof window.claude.use !== 'function') return;
        Promise.resolve(window.claude.use('sample')).then(function (s) {
          if (!s) return;
          AI.sample = s;
          document.body.classList.add('has-ai');
        }).catch(function () { /* нет ИИ — функции скрыты */ });
      } catch (e) { /* нет ИИ */ }
    },
    fail: function (e) {
      var code = e && e.code;
      if (code === 'not_granted' || code === 'sampling_disabled' || code === 'not_declared' || code === 'capability_disabled' || code === 'capability_removed') {
        document.body.classList.remove('has-ai');
        return 'ИИ-репетитор недоступен в этом просмотре.';
      }
      if (code === 'rate_limited') return 'Слишком много запросов подряд. Попробуйте через минуту.';
      if (code === 'session_expired') return 'Сессия истекла. Войдите в аккаунт снова.';
      if (code === 'refused') return 'ИИ не стал отвечать на этот запрос. Переформулируйте вопрос.';
      if (code === 'cancelled' || (e && e.name === 'AbortError')) return '';
      if (navigator.onLine === false) return 'Нет подключения к интернету — ИИ-репетитор работает только онлайн.';
      return 'Не получилось связаться с ИИ. Попробуйте ещё раз.';
    },
    clean: function (t) { return String(t || '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/^#+\s*/gm, '').replace(/`/g, ''); },
    explain: function (q, wrong, host, button) {
      if (!AI.sample) return;
      var box = frag('<div class="ai-box"><span class="eyebrow">ИИ-репетитор</span><span class="ai-text">Думаю над вашим ответом…</span></div>');
      host.appendChild(box);
      button.disabled = true;
      var opts = q.options ? '\nВарианты:\n' + q.options.map(function (o, i) { return (i + 1) + ') ' + strip(o); }).join('\n') : '';
      if (q.type === 'order') opts = '\nЭлементы для упорядочивания (в верном порядке): ' + q.items.map(strip).join(' → ');
      if (q.type === 'match') opts = '\nЛевый столбец: ' + q.left.map(function (x, i) { return LETTERS[i] + ') ' + strip(x); }).join('; ') + '\nПравый столбец: ' + q.right.map(function (x, i) { return (i + 1) + ') ' + strip(x); }).join('; ');
      var prompt = 'Ты — доброжелательный и точный репетитор по предмету «' + q._s.name + '», готовишь школьника к ' + (q.exam === 'oge' ? 'ОГЭ' : 'ЕГЭ') + '.\n' +
        'Тема: ' + q._t.title + '.\nЗадание: ' + strip(q.q) + opts +
        '\nОтвет ученика: ' + (wrong || 'нет') + '\nПравильный ответ: ' + strip(correctText(q)) + '\nЭталонное решение: ' + strip(q.solution) +
        '\n\nОбъясни ученику по-русски, почему его ответ неверен и как рассуждать, чтобы прийти к правильному. Назови конкретную ошибку в рассуждении, если её можно угадать. ' +
        'Не больше 140 слов, без заголовков и markdown, формулы простым текстом. В конце одна фраза-совет, как не ошибиться на экзамене.';
      AI.sample(prompt, { onText: function (u) { $('.ai-text', box).textContent = AI.clean(u.text); } })
        .then(function (r) { $('.ai-text', box).textContent = AI.clean(r.text); })
        .catch(function (e) {
          var m = AI.fail(e);
          if (e && e.text) $('.ai-text', box).textContent = AI.clean(e.text) + (m ? '\n\n' + m : '');
          else if (m) $('.ai-text', box).textContent = m; else box.remove();
        })
        .then(function () { button.disabled = false; });
    },
    generate: function (t, mode, host, button) {
      if (!AI.sample) return;
      var sample = t.tasks.slice(0, 3).map(function (q) { return '- ' + strip(q.q).slice(0, 220); }).join('\n');
      var prompt = 'Составь одно новое тренировочное задание для подготовки к ' + (mode === 'oge' ? 'ОГЭ' : 'ЕГЭ') + ' по предмету «' + t._s.name + '», тема «' + t.title + '».\n' +
        'Ключевые идеи темы:\n' + t.keyPoints.map(function (k) { return '- ' + strip(k); }).join('\n') +
        '\nПримеры существующих заданий (не повторяй их):\n' + sample +
        '\n\nЗадание должно быть в формате ФИПИ, с однозначным ответом, фактически точным. Перепроверь ответ перед выдачей.\n' +
        'Ответь только JSON-объектом одного из видов:\n' +
        '{"type":"choice","q":"условие","options":["...","...","...","..."],"answer":0,"hint":"подсказка","solution":"решение"}\n' +
        'или {"type":"input","q":"условие","answer":"42","hint":"подсказка","solution":"решение"}.\n' +
        'answer в choice — индекс верного варианта с нуля. Формулы можно писать в LaTeX между знаками $...$. Текст на русском (для английского языка — условие на английском).';
      var holder = frag('<div class="ai-box" role="status"><span class="eyebrow">ИИ-репетитор</span><span class="ai-text">Составляю новую задачу… Это займёт до минуты.</span></div>');
      host.insertBefore(holder, host.firstChild);
      button.disabled = true;
      AI.sample.json(prompt, { cache: false }).then(function (o) {
        if (!o || (o.type !== 'choice' && o.type !== 'input') || typeof o.q !== 'string' || !o.solution) throw { code: 'invalid_json' };
        if (o.type === 'choice' && (!Array.isArray(o.options) || o.options.length < 2 || !(o.answer >= 0 && o.answer < o.options.length))) throw { code: 'invalid_json' };
        if (o.type === 'input' && (o.answer == null || !String(o.answer).trim())) throw { code: 'invalid_json' };
        var q = {
          id: 'ai-' + Date.now(), type: o.type, exam: mode, difficulty: 2, q: esc(o.q).replace(/\n/g, '<br>'),
          options: o.type === 'choice' ? o.options.map(function (x) { return esc(x); }) : undefined,
          answer: o.type === 'choice' ? Number(o.answer) : String(o.answer),
          hint: o.hint ? esc(o.hint) : undefined, solution: esc(o.solution).replace(/\n/g, '<br>'), _t: t, _s: t._s
        };
        holder.replaceWith(renderTask(q, { num: '★', ephemeral: true }));
      }).catch(function (e) {
        var m = e && e.code === 'invalid_json' ? 'ИИ прислал задачу в неверном формате. Попробуйте ещё раз.' : AI.fail(e);
        if (m) $('.ai-text', holder).textContent = m; else holder.remove();
      }).then(function () { button.disabled = false; });
    },
    chat: function (t, root) {
      var log = $('.tutor-log', root), ta = $('textarea', root), send = $('[data-act="send"]', root), stop = $('[data-act="stop"]', root);
      var turns = [], ctl = null;
      var theory = t.theory.map(function (x) { return x.h + ': ' + strip(x.html); }).join('\n').slice(0, 7000);
      var rules = 'Ты — ИИ-репетитор на сайте подготовки к ОГЭ и ЕГЭ «Клетка». Предмет: ' + t._s.name + '. Тема: ' + t.title + '.\n' +
        'Конспект темы на сайте:\n' + theory + '\n\nОтвечай по-русски, кратко (до 170 слов), понятно для школьника, с примером, если он помогает. ' +
        'Опирайся на школьную программу и формат ФИПИ. Без markdown-заголовков. Формулы простым текстом. Если вопрос не по учёбе, мягко верни к теме.';
      function add(role, text) {
        var m = frag('<div class="msg ' + (role === 'user' ? 'me' : 'ai') + '"></div>');
        m.textContent = text; log.appendChild(m); log.scrollTop = log.scrollHeight; return m;
      }
      function ask(text) {
        text = String(text || '').trim();
        if (!text || !AI.sample || send.disabled) return;
        ta.value = '';
        add('user', text);
        turns.push({ role: 'user', content: text });
        var bubble = add('ai', 'Думаю…');
        send.disabled = true; stop.hidden = false;
        ctl = typeof AbortController === 'function' ? new AbortController() : null;
        var input = [{ role: 'user', content: rules }].concat(turns.slice(-10));
        AI.sample(input, { cache: false, signal: ctl ? ctl.signal : undefined, onText: function (u) { bubble.textContent = AI.clean(u.text); log.scrollTop = log.scrollHeight; } })
          .then(function (r) { bubble.textContent = AI.clean(r.text); turns.push({ role: 'assistant', content: r.text }); })
          .catch(function (e) {
            var m = AI.fail(e);
            bubble.textContent = (e && e.text ? AI.clean(e.text) + '\n\n' : '') + (m || 'Остановлено.');
            if (e && e.text) turns.push({ role: 'assistant', content: e.text });
          })
          .then(function () { send.disabled = false; stop.hidden = true; ctl = null; });
      }
      send.addEventListener('click', function () { ask(ta.value); });
      stop.addEventListener('click', function () { if (ctl) ctl.abort(); });
      ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(ta.value); } });
      $$('.suggests button', root).forEach(function (b) { b.addEventListener('click', function () { ask(b.textContent); }); });
      onLeave(function () { if (ctl) ctl.abort(); });
    }
  };

  /* ================= Шапка ================= */
  function renderTop() {
    var top = $('#top');
    top.innerHTML =
      '<div class="top-in">' +
      '<a class="logo" href="#/" aria-label="Клетка — на главную"><span class="logo-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="logo-text">Клетка</span></a>' +
      '<nav class="nav" id="nav" aria-label="Разделы">' +
      '<a href="#/" data-r="home">Предметы</a>' +
      '<a href="#/exam" data-r="exam">Пробник</a>' +
      '<a href="#/review" data-r="review">Ошибки <span class="badge" id="rev-badge" hidden>0</span></a>' +
      '<a href="#/cards" data-r="cards">Карточки</a>' +
      '<a href="#/labs" data-r="labs">Лаборатория</a>' +
      '<a href="#/me" data-r="me">Прогресс</a>' +
      '</nav>' +
      '<div class="top-right">' +
      '<div class="seg" role="group" aria-label="Экзамен"><button type="button" data-exam="oge">ОГЭ</button><button type="button" data-exam="ege">ЕГЭ</button></div>' +
      '<button class="icon-btn search-btn" type="button" id="search-btn" aria-label="Поиск" aria-keyshortcuts="' + (IS_MAC ? 'Meta+K' : 'Control+K') + '">' + ICON.search + '<span>Поиск</span><kbd>' + (IS_MAC ? '⌘ K' : 'Ctrl K') + '</kbd></button>' +
      '<button class="icon-btn" type="button" id="theme-btn" aria-label="Сменить тему"></button>' +
      '<button class="icon-btn menu-btn" type="button" id="menu-btn" aria-label="Меню" aria-expanded="false" aria-controls="nav">' + ICON.menu + '</button>' +
      '</div></div>';
    $$('[data-exam]', top).forEach(function (b) {
      b.addEventListener('click', function () {
        if (D().exam === b.dataset.exam) return;
        D().exam = b.dataset.exam; Store.save(); paintExam();
        route({ keepScroll: true });
        toast('Режим: подготовка к ' + examName(D().exam));
      });
    });
    $('#search-btn').addEventListener('click', openSearch);
    $('#theme-btn').addEventListener('click', function () {
      var dark = isDark();
      D().theme = dark ? 'light' : 'dark'; Store.save(); applyTheme();
    });
    var nav = $('#nav'), menuBtn = $('#menu-btn');
    var setMenu = function (open) { nav.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false'); };
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); if (nav.classList.contains('open')) { var a = $('a', nav); if (a) a.focus(); } });
    document.addEventListener('click', function (e) { if (nav.classList.contains('open') && !e.target.closest('#nav, #menu-btn')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });
    top._setMenu = setMenu;
    paintExam(); applyTheme(); updateBadge();
  }
  function paintExam() {
    $$('[data-exam]').forEach(function (b) { var on = b.dataset.exam === D().exam; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
  }
  function isDark() {
    var t = document.documentElement.dataset.theme;
    if (t) return t === 'dark';
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function applyTheme() {
    if (D().theme) document.documentElement.dataset.theme = D().theme;
    else delete document.documentElement.dataset.theme;
    var dark = isDark();
    var b = $('#theme-btn');
    if (b) { b.innerHTML = dark ? ICON.sun : ICON.moon; b.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему'); b.title = b.getAttribute('aria-label'); }
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#17201c' : '#f4f5ef');
    window.dispatchEvent(new Event('kl-theme'));
  }
  function updateBadge() {
    var b = $('#rev-badge'); if (!b) return;
    var n = Progress.dueReview().length;
    b.hidden = !n; b.textContent = n;
    b.setAttribute('aria-label', n + ' ' + plural(n, 'задача', 'задачи', 'задач') + ' к повторению');
  }

  /* ================= Маршрутизатор ================= */
  var cleanup = [];
  function onLeave(fn) { cleanup.push(fn); }
  var curRoute = '';
  function isRouteHash(h) { return !h || h === '#' || h.charAt(1) === '/' || !!S[h.slice(1)]; }
  function route(o) {
    o = o || {};
    var y = window.scrollY;
    cleanup.forEach(function (f) { try { f(); } catch (e) { /* ignore */ } });
    cleanup = [];
    var ov = $('.overlay'); if (ov && ov._close) ov._close(true);
    var raw = '';
    try { raw = decodeURIComponent(location.hash.replace(/^#\/?/, '')); } catch (e) { raw = location.hash.replace(/^#\/?/, ''); }
    var parts = raw.split('/').filter(Boolean);
    if (parts.length === 1 && S[parts[0]]) parts = ['s', parts[0]];
    var r = parts[0] || 'home';
    curRoute = parts.join('/');
    $$('#nav a').forEach(function (a) {
      var on = a.dataset.r === (r === 's' ? 'home' : r);
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var top = $('#top'); if (top && top._setMenu) top._setMenu(false);
    main.innerHTML = '';
    main.classList.remove('page-enter'); void main.offsetWidth; main.classList.add('page-enter');
    keepScroll = !!o.keepScroll;
    var known = true;
    if (r === 's' && S[parts[1]] && parts[2] && T[parts[2]] && T[parts[2]]._s === S[parts[1]]) viewTopic(T[parts[2]], parts[3]);
    else if (r === 's' && S[parts[1]]) viewSubject(S[parts[1]]);
    else if (r === 'exam') viewExam(parts[1]);
    else if (r === 'review') viewReview();
    else if (r === 'cards') viewCards(parts[1]);
    else if (r === 'labs') viewLabs(parts[1]);
    else if (r === 'me') viewMe();
    else { known = r === 'home'; viewHome(); }
    if (!known) toast('Такой страницы нет — открыли главную');
    if (o.keepScroll) window.scrollTo(0, y);
    else if (!(r === 's' && parts[2])) window.scrollTo(0, 0);
    keepScroll = false;
    document.title = (main.dataset.title ? main.dataset.title + ' · ' : '') + 'Клетка ОГЭ и ЕГЭ';
    paintExamPill();
  }
  var keepScroll = false;

  /* ================= Главная ================= */
  function examDate(mode) {
    var d = D().examDate[mode];
    return /^\d{4}-\d{2}-\d{2}$/.test(d || '') ? d : (mode === 'ege' ? '2027-06-01' : '2027-05-20');
  }
  function daysLeft(mode) {
    var t = new Date(examDate(mode) + 'T00:00:00').getTime();
    return Math.max(0, Math.round((t - dayStart(Date.now())) / DAY));
  }
  function viewHome() {
    main.dataset.title = '';
    var d = D(), mode = d.exam, tot = Progress.totals();
    var days = daysLeft(mode);
    var digits = String(days).padStart(3, '0').split('');
    var due = Progress.dueReview();
    var last = d.last && T[d.last] ? T[d.last] : null;
    var nTasks = Object.keys(Q).length, nTopics = Object.keys(T).length;
    var dateStr = new Date(examDate(mode) + 'T00:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    main.innerHTML =
      '<section class="hero">' +
      '<div class="hero-left">' +
      '<span class="eyebrow">Подготовка к ' + examName(mode) + ' · ' + subjects.length + ' ' + plural(subjects.length, 'предмет', 'предмета', 'предметов') + '</span>' +
      '<h1>Экзамен сдаётся <em>клеточка</em> за клеточкой</h1>' +
      '<p class="hero-lead">Теория, которую приятно читать, и задания в формате ФИПИ с мгновенной проверкой, подробным разбором и тренажёром ошибок. ' + nTopics + ' ' + plural(nTopics, 'тема', 'темы', 'тем') + ', ' + nTasks + ' ' + plural(nTasks, 'задание', 'задания', 'заданий') + '.</p>' +
      '<div class="countdown"><div class="count-cells" aria-hidden="true">' + digits.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' +
      '<div class="count-label"><b>' + (days ? days + ' ' + plural(days, 'день', 'дня', 'дней') + ' до ' + examName(mode) : examName(mode) + ' уже сегодня или прошёл') + '</b>' +
      '<span class="muted">' + dateStr + (d.examDate[mode] ? '' : ', примерно') + '</span><br>' +
      '<button type="button" id="set-date" aria-expanded="false" aria-controls="date-edit">Указать свою дату</button>' +
      '<span id="date-edit" class="date-edit" hidden><label class="sr" for="date-input">Дата экзамена</label><input type="date" id="date-input" value="' + examDate(mode) + '" min="' + today() + '"> <button type="button" class="btn sm" id="date-save">Сохранить</button> <button type="button" class="btn sm ghost" id="date-cancel">Отмена</button></span></div></div>' +
      '<div class="stats">' +
      '<div class="stat"><b>' + d.xp + '</b><span>опыт, XP</span></div>' +
      '<div class="stat"><b>' + Progress.streak() + '</b><span>дней подряд</span></div>' +
      '<div class="stat"><b>' + tot.solved + '</b><span>задач решено</span></div>' +
      '<div class="stat"><b>' + tot.acc + '%</b><span>с первой попытки</span></div>' +
      '</div></div>' +
      '<div class="daily sheet" id="daily"></div>' +
      '</section>' +
      '<nav class="quick-subjects" aria-label="Быстрый переход к предмету">' + subjects.map(function (s) { return '<a href="#/s/' + s.id + '" style="' + cvar(s) + '">' + glyph(s, 'sm') + esc(SHORT[s.id] || s.name) + '</a>'; }).join('') + '</nav>' +
      (last || due.length ? '<section class="section continue-list">' +
        (last ? '<div class="continue sheet" style="' + cvar(last._s) + '">' + glyph(last._s) + '<div><span class="eyebrow">Продолжить</span><div><b>' + esc(last.title) + '</b> <span class="muted">· ' + esc(last._s.name) + '</span></div></div><a class="btn primary" href="#/s/' + last._s.id + '/' + last.id + '">Открыть тему</a></div>' : '') +
        (due.length ? '<div class="continue sheet"><span class="glyph" style="--c:var(--red)" aria-hidden="true">!</span><div><span class="eyebrow">Тренажёр ошибок</span><div><b>' + due.length + ' ' + plural(due.length, 'задача ждёт', 'задачи ждут', 'задач ждут') + ' повторения</b> <span class="muted">· интервальное повторение закрепляет навык</span></div></div><a class="btn red" href="#/review">Повторить</a></div>' : '') +
        '</section>' : '') +
      '<section class="section" id="plan-sec"></section>' +
      '<section class="section"><div class="section-head"><h2>Предметы</h2><span class="muted">Прогресс считается по решённым заданиям</span></div><div class="subjects" id="subjects"></div></section>' +
      '<section class="section" id="labs-sec"><div class="section-head"><h2>Лаборатория</h2><a href="#/labs">Все интерактивы</a></div><div class="labs-strip" id="labs-strip"></div></section>';

    var grid = $('#subjects');
    subjects.forEach(function (s) {
      var st = Progress.subjectStats(s);
      var fit = s.topics.filter(function (t) { return topicFits(t, mode); }).length;
      var pc = Math.round(st.pct * 100);
      grid.appendChild(frag('<a class="subj" href="#/s/' + s.id + '" style="' + cvar(s) + '" data-glyph="' + esc(GLYPH[s.id] || '') + '"><div class="subj-top">' + glyph(s) + '<div><h3>' + esc(s.name) + '</h3><span class="muted" style="font-size:13px">' + fit + ' ' + plural(fit, 'тема', 'темы', 'тем') + ' для ' + examName(mode) + '</span></div><span class="subj-ring" style="--p:' + pc + '" role="img" aria-label="Решено ' + pc + '%"><span>' + pc + '%</span></span></div><p>' + esc(s.tagline) + '</p><div class="subj-foot"><span class="mono">' + st.solved + ' / ' + st.total + ' задач</span><span class="subj-go" aria-hidden="true">Открыть →</span></div></a>'));
    });
    if (!subjects.length) grid.innerHTML = '<div class="empty sheet"><span class="hand">Пусто</span><p>Предметы ещё не загружены.</p></div>';

    var ls = $('#labs-strip');
    var labIds = Object.keys(KL.labs || {});
    labIds.forEach(function (id) {
      var l = KL.labs[id];
      ls.appendChild(frag('<a class="lab-card" href="#/labs/' + esc(id) + '"><span class="lab-ico" aria-hidden="true">' + esc(l.icon) + '</span><b>' + esc(l.title) + '</b><span>' + esc(l.desc) + '</span></a>'));
    });
    if (!labIds.length) $('#labs-sec').hidden = true;

    var edit = $('#date-edit'), setBtn = $('#set-date');
    var closeEdit = function () { edit.hidden = true; setBtn.hidden = false; setBtn.setAttribute('aria-expanded', 'false'); setBtn.focus(); };
    setBtn.addEventListener('click', function () { edit.hidden = false; setBtn.hidden = true; setBtn.setAttribute('aria-expanded', 'true'); $('#date-input').focus(); });
    $('#date-cancel').addEventListener('click', closeEdit);
    var saveDate = function () {
      var v = $('#date-input').value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) { toast('Выберите дату'); return; }
      D().examDate[mode] = v; Store.save(); toast('Дата ' + examName(mode) + ' сохранена'); route({ keepScroll: true });
    };
    $('#date-save').addEventListener('click', saveDate);
    $('#date-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') saveDate(); if (e.key === 'Escape') closeEdit(); });

    renderDaily($('#daily'), mode);
    renderPlan($('#plan-sec'), mode, days);
  }
  function renderDaily(host, mode) {
    var pool = Object.keys(Q).map(function (id) { return Q[id]; }).filter(function (q) { return taskFits(q, mode) && q.type !== 'order'; });
    if (!pool.length) { host.innerHTML = '<div class="empty"><span class="hand">Скоро</span><p>Задача дня появится, когда загрузятся задания.</p></div>'; return; }
    var key = today();
    var q = pool[hashStr(key + mode) % pool.length];
    host.innerHTML = '<div class="daily-head"><span class="hand">Задача дня</span><span class="chip" style="' + cvar(q._s) + ';color:var(--c)">' + esc(q._s.name) + '</span></div>' +
      '<p class="muted" style="font-size:14px">Одна задача каждый день держит серию. Тема: <a href="#/s/' + q._s.id + '/' + q._t.id + '">' + esc(q._t.title) + '</a></p>';
    var card = renderTask(q, { num: '★' });
    card.classList.remove('sheet');
    card.classList.add('flat');
    host.appendChild(card);
  }

  /* ---------- План подготовки ---------- */
  function planSubjects(mode) {
    var d = D();
    if (d.plan && d.plan.subjects) return d.plan.subjects.filter(function (id) { return S[id]; });
    /* По умолчанию — предметы, которыми человек уже занимался */
    return subjects.filter(function (s) { return s.topics.some(function (t) { return topicFits(t, mode) && Progress.started(t); }); }).map(function (s) { return s.id; });
  }
  function renderPlan(host, mode, days) {
    var chosen = planSubjects(mode);
    var explicit = !!(D().plan && D().plan.subjects);
    var html = '<div class="section-head"><h2>План подготовки</h2><span class="muted">' + examName(mode) + ' · ' + (days ? 'осталось ' + days + ' ' + plural(days, 'день', 'дня', 'дней') : 'дата экзамена прошла') + '</span></div>' +
      '<div class="plan sheet"><div class="plan-pick"><span class="eyebrow" id="plan-pick-l">Мои предметы' + (explicit ? '' : ' · выбраны автоматически') + '</span><div class="filter-row" role="group" aria-labelledby="plan-pick-l">' +
      subjects.map(function (s) { var on = chosen.indexOf(s.id) >= 0; return '<button type="button" class="chip pick-chip' + (on ? ' ink' : '') + '" aria-pressed="' + on + '" data-sid="' + s.id + '">' + esc(SHORT[s.id] || s.name) + '</button>'; }).join('') +
      '</div></div><div class="plan-body"></div></div>';
    host.innerHTML = html;
    var body = $('.plan-body', host);
    $$('.pick-chip', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var cur = planSubjects(mode).slice(), k = cur.indexOf(b.dataset.sid);
        if (k >= 0) cur.splice(k, 1); else cur.push(b.dataset.sid);
        D().plan = { subjects: cur }; Store.save();
        renderPlan(host, mode, days);
        var nb = $('.pick-chip[data-sid="' + b.dataset.sid + '"]', host); if (nb) nb.focus();
      });
    });
    if (!chosen.length) {
      body.innerHTML = '<p class="muted">Отметьте предметы, которые сдаёте, — план покажет, сколько тем проходить в неделю и с чего начать.</p>';
      return;
    }
    var all = [], left = [];
    chosen.forEach(function (sid) {
      S[sid].topics.forEach(function (t) {
        if (!topicFits(t, mode)) return;
        all.push(t);
        if (!Progress.mastered(t)) left.push(t);
      });
    });
    if (!all.length) { body.innerHTML = '<p class="muted">В выбранных предметах пока нет тем для ' + examName(mode) + '.</p>'; return; }
    if (!left.length) {
      body.innerHTML = '<p><b>Все темы освоены.</b> <span class="muted">Теперь решайте пробные варианты и закрывайте тренажёр ошибок.</span></p><div class="plan-actions"><a class="btn primary" href="#/exam">Пробный вариант</a><a class="btn" href="#/review">Тренажёр ошибок</a></div>';
      return;
    }
    var weeks = days / 7;
    var reserve = weeks >= 8 ? 2 : weeks >= 3 ? 1 : 0;
    var studyWeeks = Math.max(weeks - reserve, 1);
    var perWeek = Math.max(1, Math.ceil(left.length / studyWeeks));
    var load = left.reduce(function (a, t) {
      var st = Progress.topicStats(t);
      return a + (st.read ? 0 : t.minutes || 15) + (st.total - st.solved) * 3;
    }, 0);
    var studyDays = Math.max(1, Math.round(studyWeeks * 7));
    var perDay = Math.max(10, Math.ceil(load / studyDays / 5) * 5);
    /* Следующие темы: сначала начатые, затем по уровню и порядку; предметы чередуются */
    var bySubj = {};
    left.forEach(function (t) { (bySubj[t._s.id] = bySubj[t._s.id] || []).push(t); });
    Object.keys(bySubj).forEach(function (k) {
      bySubj[k].sort(function (a, b) { return (Progress.started(b) - Progress.started(a)) || ((a.level || 1) - (b.level || 1)) || (a._i - b._i); });
    });
    var next = [], round = 0, take = Math.min(6, Math.max(3, perWeek));
    while (next.length < take && chosen.some(function (sid) { return bySubj[sid] && bySubj[sid].length > round; })) {
      chosen.forEach(function (sid) { if (next.length < take && bySubj[sid] && bySubj[sid][round]) next.push(bySubj[sid][round]); });
      round++;
    }
    var done = all.length - left.length;
    body.innerHTML =
      '<div class="plan-stats"><div><b>' + left.length + '</b><span>' + plural(left.length, 'тема осталась', 'темы осталось', 'тем осталось') + ' из ' + all.length + '</span></div>' +
      '<div><b>' + (days ? perWeek : left.length) + '</b><span>' + (days ? plural(perWeek, 'тема', 'темы', 'тем') + ' в неделю' : 'на повторение') + '</span></div>' +
      '<div><b>≈' + perDay + '</b><span>минут в день</span></div></div>' +
      '<div class="bar plan-bar" role="img" aria-label="Освоено ' + done + ' из ' + all.length + ' тем"><i style="width:' + Math.round(done / all.length * 100) + '%"></i></div>' +
      '<p class="muted plan-note">' + (days ? (reserve ? 'Последние ' + reserve + ' ' + plural(reserve, 'неделю', 'недели', 'недель') + ' оставлены на пробники и повторение. ' : '') + 'Тема считается освоенной, когда прочитана теория и решено 80% заданий.' : 'Укажите новую дату экзамена выше, чтобы пересчитать план.') + '</p>' +
      '<span class="eyebrow">На этой неделе</span><ol class="plan-list">' +
      next.map(function (t) {
        var st = Progress.topicStats(t), ref = examRef(t, mode);
        return '<li><a class="plan-item" href="#/s/' + t._s.id + '/' + t.id + '" style="' + cvar(t._s) + '">' + glyph(t._s, 'sm') +
          '<span class="plan-main"><b>' + esc(t.title) + '</b><small>' + esc(SHORT[t._s.id] || t._s.name) + (ref ? ' · ' + esc(ref) : '') + ' · уровень ' + (t.level || 1) + ' · ' + st.solved + '/' + st.total + ' задач</small></span>' +
          Progress.status(t) + '</a></li>';
      }).join('') + '</ol>';
  }

  /* ================= Предмет ================= */
  function viewSubject(s) {
    main.dataset.title = s.name;
    var mode = D().exam;
    var st = Progress.subjectStats(s);
    var due = Progress.dueReview(s.id).length;
    main.innerHTML =
      '<nav class="crumbs" aria-label="Навигация"><a href="#/">Предметы</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(s.name) + '</span></nav>' +
      '<section class="subj-hero" style="' + cvar(s) + '"><div>' +
      '<div class="subj-title">' + glyph(s) + '<div><h1>' + esc(s.name) + '</h1><p class="muted" style="font-size:17px">' + esc(s.tagline) + '</p></div></div>' +
      '<div class="subj-progress"><div style="flex:1;min-width:200px"><div class="bar" style="height:8px" role="img" aria-label="Решено ' + Math.round(st.pct * 100) + '%"><i style="width:' + Math.round(st.pct * 100) + '%"></i></div></div>' +
      '<span class="mono">' + st.solved + ' / ' + st.total + ' задач</span><span class="mono">' + st.mastered + ' / ' + s.topics.length + ' тем освоено</span></div>' +
      '<div class="subj-actions"><a class="btn primary" href="#/exam/' + s.id + '">Пробный вариант</a><a class="btn" href="#/cards/' + s.id + '">Карточки · ' + (s.cards || []).length + '</a>' +
      (due ? '<a class="btn" href="#/review">Ошибки · ' + due + '</a>' : '') + '</div></div>' +
      '<aside class="exam-card sheet" id="exam-card" aria-label="Формат экзамена"></aside></section>' +
      '<section class="section"><div class="section-head"><h2>Темы</h2><span class="muted">Номера заданий указаны по демоверсиям ФИПИ</span></div><ol class="toc-list" id="toc"></ol></section>';

    var card = $('#exam-card');
    var paintCard = function (m, focus) {
      var e = s.exams[m];
      card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><span class="eyebrow">Формат экзамена</span><div class="seg" role="group" aria-label="Экзамен"><button type="button" data-m="oge" aria-pressed="' + (m === 'oge') + '" class="' + (m === 'oge' ? 'on' : '') + '">ОГЭ</button><button type="button" data-m="ege" aria-pressed="' + (m === 'ege') + '" class="' + (m === 'ege' ? 'on' : '') + '">ЕГЭ</button></div></div>' +
        (e ? '<b style="font-size:17px">' + esc(e.title) + '</b>' +
          '<div class="exam-facts"><div><b>' + esc(e.tasks) + '</b><span>заданий</span></div><div><b>' + esc(e.time) + '</b><span>длительность</span></div><div><b>' + esc(e.maxPrimary) + '</b><span>перв. баллов</span></div></div>' +
          (e.minScore ? '<p><span class="chip red">Минимум ' + esc(e.minScore) + ' тестовых баллов</span></p>' : '') +
          '<p>' + esc(e.structure) + '</p><p class="muted"><b style="color:var(--text)">Совет.</b> ' + esc(e.tip) + '</p>'
          : '<p class="muted">Описание формата пока не добавлено.</p>');
      $$('[data-m]', card).forEach(function (b) { b.addEventListener('click', function () { paintCard(b.dataset.m, true); }); });
      if (focus) { var f = $('[data-m="' + m + '"]', card); if (f) f.focus(); }
    };
    paintCard(mode);

    var toc = $('#toc');
    s.topics.forEach(function (t, i) {
      var ts = Progress.topicStats(t);
      var fits = topicFits(t, mode);
      var refs = ['oge', 'ege'].map(function (m) { return examRef(t, m); }).filter(Boolean).join(' · ');
      toc.appendChild(frag('<li><a class="toc-row' + (fits ? '' : ' dim') + '" href="#/s/' + s.id + '/' + t.id + '">' +
        '<span class="toc-num" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="toc-main"><b>' + esc(t.title) + '</b><span class="toc-meta"><span>' + esc(t.summary) + '</span></span>' +
        '<span class="toc-meta">' + (refs ? '<span class="mono">' + refs + '</span>' : '') + '<span>' + (t.minutes || 15) + ' мин чтения</span><span>' + t.tasks.length + ' ' + plural(t.tasks.length, 'задание', 'задания', 'заданий') + '</span>' + (fits ? '' : '<span>нет в ' + examName(mode) + '</span>') + '</span></span>' +
        '<span class="toc-side">' + Progress.status(t) + '<span class="bar" role="img" aria-label="Решено ' + ts.solved + ' из ' + ts.total + '"><i style="width:' + Math.round(ts.pct * 100) + '%"></i></span></span></a></li>'));
    });
    if (!s.topics.length) toc.outerHTML = '<div class="empty sheet"><p>Темы по этому предмету скоро появятся.</p></div>';
  }

  /* ================= Тема ================= */
  function viewTopic(t, anchor) {
    var s = t._s, mode = D().exam;
    main.dataset.title = t.title;
    D().last = t.id; Store.save();
    var refs = ['oge', 'ege'].map(function (m) { return examRef(t, m); }).filter(Boolean).join(' · ');
    var prev = s.topics[t._i - 1], next = s.topics[t._i + 1];
    var filter = t.tasks.some(function (q) { return taskFits(q, mode); }) ? mode : 'all';
    var lvl = Math.max(1, Math.min(3, t.level || 1));

    main.innerHTML =
      '<nav class="crumbs" aria-label="Навигация"><a href="#/">Предметы</a><span aria-hidden="true">/</span><a href="#/s/' + s.id + '">' + esc(s.name) + '</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(t.title) + '</span></nav>' +
      '<div class="topic-layout" style="' + cvar(s) + '">' +
      '<nav class="side-toc" id="side-toc" aria-label="На странице"><span class="eyebrow">На странице</span></nav>' +
      '<div style="min-width:0">' +
      '<header class="topic-head"><span class="eyebrow">Тема ' + (t._i + 1) + ' из ' + s.topics.length + (refs ? ' · ' + refs : '') + '</span><h1>' + esc(t.title) + '</h1><p class="topic-summary">' + esc(t.summary) + '</p>' +
      '<div class="topic-meta">' + Progress.status(t) + '<span class="chip">' + (t.minutes || 15) + ' мин чтения</span><span class="chip">Уровень <span class="dots" role="img" aria-label="' + lvl + ' из 3" style="margin-left:4px">' + [1, 2, 3].map(function (i) { return '<i class="' + (i <= lvl ? 'on' : '') + '"></i>'; }).join('') + '</span></span>' +
      (t.exam || []).map(function (m) { return '<span class="chip ink">' + examName(m) + '</span>'; }).join('') + '</div></header>' +
      '<section class="page cheat" id="sec-cheat" aria-labelledby="cheat-h"><div class="cheat-title"><h2 class="hand" id="cheat-h">Коротко</h2><span class="muted">главное за 30 секунд</span>' +
      '<button class="btn sm ghost no-print cheat-print" type="button" id="print-cheat" title="Распечатать шпаргалку">' + ICON.print + '<span>Печать</span></button></div><ol>' + t.keyPoints.map(function (k) { return '<li>' + k + '</li>'; }).join('') + '</ol></section>' +
      '<article class="page"><div class="prose" id="theory">' +
      t.theory.map(function (sec, i) { return '<h2 id="sec-' + i + '"><span class="sec-n" aria-hidden="true">' + (i + 1) + '.</span>' + esc(sec.h) + '</h2>' + sec.html; }).join('') +
      '</div><div class="read-row" id="read-row"></div></article>' +
      '<section class="section" id="practice" aria-labelledby="practice-h"><div class="practice-head"><div><span class="eyebrow">Практика</span><h2 id="practice-h">Задания по теме</h2></div>' +
      '<div class="filter-row"><div class="seg" id="task-filter" role="group" aria-label="Показать задания"><button type="button" data-f="all">Все</button><button type="button" data-f="oge">ОГЭ</button><button type="button" data-f="ege">ЕГЭ</button></div>' +
      '<button class="btn sm ai-only" type="button" id="ai-gen">' + ICON.spark + ' Новая задача от ИИ</button></div></div>' +
      '<div id="ai-tasks" class="tasks" style="margin-bottom:16px"></div><div class="tasks" id="tasks"></div></section>' +
      '<section class="section ai-only" id="tutor-sec"><div class="tutor sheet" id="tutor"><div><span class="eyebrow">ИИ-репетитор</span><h2 style="font-family:var(--f-display);font-size:22px;font-weight:600;margin-top:4px">Спросите, что осталось непонятным</h2>' +
      '<p class="muted" style="font-size:14.5px;margin-top:4px">Репетитор знает конспект этой темы. Ответ приходит с вашего аккаунта Claude.</p></div>' +
      '<div class="suggests"><button type="button">Объясни эту тему проще</button><button type="button">Какие ошибки чаще всего делают на экзамене?</button><button type="button">Дай мнемонику, чтобы запомнить главное</button></div>' +
      '<div class="tutor-log" aria-live="polite"></div>' +
      '<div class="tutor-form"><label class="sr" for="tutor-input">Вопрос репетитору</label><textarea id="tutor-input" rows="2" placeholder="Например: почему здесь ставится запятая?"></textarea>' +
      '<button class="btn primary" type="button" data-act="send">Спросить</button><button class="btn" type="button" data-act="stop" hidden>Стоп</button></div></div></section>' +
      '<nav class="pager" aria-label="Соседние темы">' +
      (prev ? '<a class="btn" href="#/s/' + s.id + '/' + prev.id + '">← ' + esc(prev.title) + '</a>' : '<span></span>') +
      (next ? '<a class="btn primary" href="#/s/' + s.id + '/' + next.id + '">' + esc(next.title) + ' →</a>' : '<a class="btn primary" href="#/exam/' + s.id + '">Пробный вариант →</a>') +
      '</nav></div></div>';

    enhance($('#theory'));
    enhance($('#sec-cheat'));

    $('#print-cheat').addEventListener('click', function () { printCheat(); });

    // Отметка «прочитано»
    var readRow = $('#read-row');
    var paintRead = function () {
      var r = D().read[t.id];
      readRow.innerHTML = r
        ? '<span class="chip ok">Теория прочитана</span><a class="btn" href="#practice">К заданиям ↓</a>'
        : '<button class="btn primary" type="button" id="mark-read">Я разобрался с теорией</button><span class="muted" style="font-size:14px">+20 XP и отметка в прогрессе</span>';
      var b = $('#mark-read');
      if (b) b.addEventListener('click', function () {
        if (D().read[t.id]) return;
        D().read[t.id] = true; D().xp += 20; Store.save(); xpPop(b, 20); paintRead();
        var a = $('a', readRow); if (a) a.focus({ preventScroll: true });
        scrollToEl($('#practice'));
      });
    };
    paintRead();

    // Задания
    var list = $('#tasks');
    var paintTasks = function () {
      $$('#task-filter button').forEach(function (b) { var on = b.dataset.f === filter; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      list.innerHTML = '';
      var n = 0;
      t.tasks.forEach(function (q) {
        if (filter !== 'all' && !taskFits(q, filter)) return;
        list.appendChild(renderTask(q, { num: ++n, onResult: function () { paintSide(); } }));
      });
      if (!n) list.innerHTML = '<div class="empty sheet"><p>В этой теме нет заданий для выбранного экзамена.</p></div>';
    };
    $$('#task-filter button').forEach(function (b) { b.addEventListener('click', function () { if (filter === b.dataset.f) return; filter = b.dataset.f; paintTasks(); }); });
    paintTasks();

    $('#ai-gen').addEventListener('click', function () { AI.generate(t, mode, $('#ai-tasks'), $('#ai-gen')); });
    AI.chat(t, $('#tutor'));

    // Оглавление сбоку и прогресс
    var side = $('#side-toc');
    var links = [['sec-cheat', 'Коротко']].concat(t.theory.map(function (x, i) { return ['sec-' + i, x.h]; })).concat([['practice', 'Практика']]);
    links.forEach(function (l) { side.appendChild(frag('<a href="#' + l[0] + '">' + esc(l[1]) + '</a>')); });
    var prog = frag('<div class="side-prog"></div>');
    side.appendChild(prog);
    var paintSide = function () {
      var ts = Progress.topicStats(t);
      prog.innerHTML = '<span class="eyebrow">Прогресс темы</span><div class="bar" role="img" aria-label="Решено ' + ts.solved + ' из ' + ts.total + '"><i style="width:' + Math.round(ts.pct * 100) + '%"></i></div><span class="mono" style="font-size:13px">' + ts.solved + ' из ' + ts.total + ' решено</span>';
    };
    paintSide();
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          $$('a', side).forEach(function (a) {
            var on = a.getAttribute('href') === '#' + en.target.id;
            a.classList.toggle('on', on);
            if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-20% 0px -70% 0px' });
      links.forEach(function (l) { var tg = document.getElementById(l[0]); if (tg) io.observe(tg); });
      onLeave(function () { io.disconnect(); });
    }
    if (keepScroll) return;
    if (anchor === 'practice') requestAnimationFrame(function () { var p = $('#practice'); if (p) { p.scrollIntoView({ block: 'start' }); } });
    else window.scrollTo(0, 0);
  }
  function printCheat() {
    document.body.classList.add('print-cheat');
    var done = function () { document.body.classList.remove('print-cheat'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    try { window.print(); } catch (e) { toast('Печать недоступна в этом окне'); }
    setTimeout(done, 1500);
  }

  /* ================= Пробный вариант ================= */
  var EXAM_KEY = 'kletka.exam.v1';
  var exam = null;
  function examQs() { return exam ? exam.ids.map(function (id) { return Q[id]; }) : []; }
  function saveExam() {
    try { if (exam) localStorage.setItem(EXAM_KEY, JSON.stringify(exam)); else localStorage.removeItem(EXAM_KEY); } catch (e) { /* не сохранится между перезагрузками */ }
  }
  function loadExam() {
    var e = null;
    try { e = JSON.parse(localStorage.getItem(EXAM_KEY) || 'null'); } catch (er) { e = null; }
    if (!e || typeof e !== 'object' || !Array.isArray(e.ids) || !S[e.sid]) return null;
    e.ids = e.ids.filter(function (id) { return Q[id]; });
    if (!e.ids.length) return null;
    e.values = e.values && typeof e.values === 'object' ? e.values : {};
    e.touched = e.touched && typeof e.touched === 'object' ? e.touched : {};
    e.cur = Math.max(0, Math.min(e.cur | 0, e.ids.length - 1));
    if (e.done) e.results = e.ids.map(function (id) { return examFilledQ(Q[id], e) && isCorrect(Q[id], e.values[id]); });
    return e;
  }
  function examFilledQ(q, e) {
    var v = e.values[q.id];
    if (q.type === 'order') return !!e.touched[q.id] && Array.isArray(v);
    return !isEmptyValue(q, v);
  }
  function examLeft() { return exam && exam.dur ? Math.max(0, exam.dur - (Date.now() - exam.start)) : Infinity; }
  function fmtTime(ms) {
    var s = Math.ceil(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : String(m).padStart(2, '0')) + ':' + String(sec).padStart(2, '0');
  }
  function estimate(pct) { return isFinite(pct) ? Math.round(100 * (1 - Math.pow(1 - Math.max(0, Math.min(1, pct)), 1.25))) : 0; }
  function examFinish(reason) {
    if (!exam || exam.done) return;
    var qs = examQs();
    exam.done = true;
    exam.took = exam.dur ? Math.min(Date.now() - exam.start, exam.dur) : Date.now() - exam.start;
    var ok = 0;
    exam.results = qs.map(function (q) {
      var filled = examFilledQ(q, exam);
      var good = filled && isCorrect(q, exam.values[q.id]);
      if (good) ok++;
      if (filled) Progress.record(q, good, 'exam');
      else Progress.skip(q);
      return good;
    });
    D().history.push({ sid: exam.sid, mode: exam.mode, n: qs.length, ok: ok, at: Date.now(), took: exam.took });
    if (D().history.length > 60) D().history.splice(0, D().history.length - 60);
    Store.save(); saveExam(); updateBadge();
    stopExamClock();
    if (curRoute === 'exam/run') {
      if (reason === 'time') toast('Время вышло — вариант отправлен на проверку');
      location.hash = '#/exam/result';
    } else if (reason === 'time') {
      toast('Время пробника вышло. Результат — в разделе «Пробник»');
      paintExamPill();
    }
  }
  var examClock = null;
  function startExamClock() {
    if (examClock || !exam || exam.done) return;
    examClock = setInterval(examTick, 500);
    examTick();
  }
  function stopExamClock() { clearInterval(examClock); examClock = null; paintExamPill(); }
  function examTick() {
    if (!exam || exam.done) { stopExamClock(); return; }
    var left = examLeft();
    var txt = exam.dur ? fmtTime(left) : '';
    var tv = $('#ex-timer-v');
    if (tv && exam.dur) {
      tv.textContent = txt;
      tv.classList.toggle('low', left < 120000);
      var sr = $('#ex-timer-sr');
      var mins = Math.ceil(left / 60000);
      if (sr && (mins === 5 || mins === 1) && sr.dataset.m !== String(mins)) { sr.dataset.m = mins; sr.textContent = 'Осталось ' + mins + ' ' + plural(mins, 'минута', 'минуты', 'минут'); }
    }
    var pill = $('#exam-pill');
    if (pill && !pill.hidden) $('.mono', pill).textContent = exam.dur ? txt : 'идёт';
    if (left <= 0) examFinish('time');
  }
  function paintExamPill() {
    var pill = $('#exam-pill');
    var show = !!(exam && !exam.done && curRoute !== 'exam/run');
    if (!pill) {
      if (!show) return;
      pill = frag('<a class="exam-pill" id="exam-pill" href="#/exam/run"><span class="exam-pill-dot" aria-hidden="true"></span>Пробник <span class="mono"></span></a>');
      document.body.appendChild(pill);
    }
    pill.hidden = !show;
    if (show) {
      $('.mono', pill).textContent = exam.dur ? fmtTime(examLeft()) : 'идёт';
      pill.setAttribute('aria-label', 'Вернуться к пробнику: ' + (S[exam.sid] ? S[exam.sid].name : '') + (exam.dur ? ', осталось ' + fmtTime(examLeft()) : ''));
      startExamClock();
    }
  }

  function viewExam(arg) {
    if (arg === 'run' && exam && !exam.done) return examRun();
    if (arg === 'result' && exam && exam.done) return examResult();
    main.dataset.title = 'Пробный вариант';
    var mode = D().exam;
    var sel = S[arg] ? arg : (exam && exam.sid) || (subjects[0] && subjects[0].id);
    var len = 12, timed = true;
    var running = exam && !exam.done;
    main.innerHTML = '<nav class="crumbs" aria-label="Навигация"><a href="#/">Предметы</a><span aria-hidden="true">/</span><span aria-current="page">Пробный вариант</span></nav>' +
      '<header class="topic-head"><span class="eyebrow">Режим экзамена</span><h1>Пробный вариант</h1><p class="topic-summary">Задания идут в порядке КИМ, ответы проверяются только в конце — как на настоящем экзамене. После проверки увидите балл, разбор и темы, которые стоит подтянуть.</p></header>' +
      (running ? '<div class="resume sheet" role="region" aria-label="Незавершённый вариант"><div><span class="eyebrow">Незавершённый вариант</span><b>' + esc(S[exam.sid].name) + ' · ' + examName(exam.mode) + '</b><span class="muted">' + exam.ids.length + ' ' + plural(exam.ids.length, 'задание', 'задания', 'заданий') + ', ответов: ' + examQs().filter(function (q) { return examFilledQ(q, exam); }).length + (exam.dur ? ' · осталось ' + fmtTime(examLeft()) : '') + '</span></div>' +
        '<div class="resume-actions"><a class="btn primary" href="#/exam/run">Продолжить</a><button class="btn" type="button" id="ex-drop">Отменить вариант</button></div>' +
        '<div class="resume-confirm" id="ex-drop-confirm" hidden>Ответы этого варианта пропадут. <button class="btn sm red" type="button" id="ex-drop-yes">Да, отменить</button> <button class="btn sm ghost" type="button" id="ex-drop-no">Нет</button></div></div>' : '') +
      (!running && exam && exam.done ? '<p class="last-result"><a href="#/exam/result">Результат последнего варианта →</a></p>' : '') +
      '<h2 class="sr">Предмет</h2><div class="exam-setup" id="picks" role="radiogroup" aria-label="Предмет"></div>' +
      '<div class="setup-row"><div class="seg" id="ex-mode" role="group" aria-label="Экзамен"><button type="button" data-v="oge">ОГЭ</button><button type="button" data-v="ege">ЕГЭ</button></div>' +
      '<div class="seg" id="ex-len" role="group" aria-label="Число заданий"><button type="button" data-v="6">6 заданий</button><button type="button" data-v="12">12</button><button type="button" data-v="20">20</button></div>' +
      '<label class="inline check-label"><input type="checkbox" id="ex-timer" checked> Таймер (3 мин на задание)</label>' +
      '<button class="btn primary" type="button" id="ex-start">' + (running ? 'Начать новый вариант' : 'Начать вариант') + '</button></div>' +
      '<p class="muted" id="ex-info" style="margin-top:10px;font-size:14px"></p>' +
      '<section class="section"><div class="section-head"><h2>История</h2></div><div id="ex-hist"></div></section>';
    var picks = $('#picks');
    var bankSize = function (s, m) { return s.topics.reduce(function (a, t) { return a + (topicFits(t, m) ? t.tasks.filter(function (q) { return taskFits(q, m); }).length : 0); }, 0); };
    var paint = function (focusSel) {
      picks.innerHTML = '';
      subjects.forEach(function (s) {
        var n = bankSize(s, mode);
        var on = s.id === sel;
        var b = frag('<button type="button" role="radio" aria-checked="' + on + '" class="pick' + (on ? ' on' : '') + '" style="' + cvar(s) + '"' + (n ? '' : ' aria-disabled="true"') + '>' + glyph(s) + '<div><b>' + esc(s.name) + '</b><span>' + (n ? n + ' ' + plural(n, 'задание', 'задания', 'заданий') + ' в банке' : 'нет заданий для ' + examName(mode)) + '</span></div></button>');
        b.addEventListener('click', function () { sel = s.id; paint(true); });
        picks.appendChild(b);
      });
      if (focusSel) { var f = $('.pick.on', picks); if (f) f.focus(); }
      $$('#ex-mode button').forEach(function (b) { var on = b.dataset.v === mode; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      $$('#ex-len button').forEach(function (b) { var on = +b.dataset.v === len; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      var e = S[sel] && S[sel].exams[mode];
      var n = S[sel] ? bankSize(S[sel], mode) : 0;
      $('#ex-info').textContent = (e ? 'Настоящий ' + e.title + ': ' + e.tasks + ' заданий, ' + e.time + '. ' : '') + (n ? 'Здесь — тренировочная выборка из банка сайта' + (n < len ? ' (в банке только ' + n + ')' : '') + '.' : 'Для этого экзамена по предмету пока нет заданий.');
      $('#ex-start').disabled = !n;
    };
    $$('#ex-mode button').forEach(function (b) { b.addEventListener('click', function () { mode = b.dataset.v; paint(); }); });
    $$('#ex-len button').forEach(function (b) { b.addEventListener('click', function () { len = +b.dataset.v; paint(); }); });
    $('#ex-timer').addEventListener('change', function (e) { timed = e.target.checked; });
    if (running) {
      $('#ex-drop').addEventListener('click', function () { $('#ex-drop-confirm').hidden = false; $('#ex-drop-yes').focus(); });
      $('#ex-drop-no').addEventListener('click', function () { $('#ex-drop-confirm').hidden = true; $('#ex-drop').focus(); });
      $('#ex-drop-yes').addEventListener('click', function () { exam = null; saveExam(); stopExamClock(); toast('Вариант отменён'); route(); });
    }
    $('#ex-start').addEventListener('click', function () {
      var s = S[sel]; if (!s) return;
      var byTopic = s.topics.filter(function (t) { return topicFits(t, mode); }).map(function (t) { return shuffle(t.tasks.filter(function (q) { return taskFits(q, mode); })); }).filter(function (a) { return a.length; });
      /* Темы берутся по кругу: сначала по одному заданию из каждой, чтобы вариант покрывал весь курс */
      byTopic = shuffle(byTopic);
      var picked = [];
      var round = 0;
      while (picked.length < len && byTopic.some(function (a) { return a.length > round; })) {
        byTopic.forEach(function (a) { if (picked.length < len && a[round]) picked.push(a[round]); });
        round++;
      }
      if (!picked.length) { toast('Для этого экзамена пока нет заданий'); return; }
      picked.sort(function (a, b) { return a._t._i - b._t._i || a.difficulty - b.difficulty; });
      exam = { sid: s.id, mode: mode, ids: picked.map(function (q) { return q.id; }), values: {}, touched: {}, cur: 0, start: Date.now(), dur: timed ? picked.length * 180000 : 0, done: false };
      saveExam();
      location.hash = '#/exam/run';
    });
    paint();
    var hist = D().history.slice(-12).reverse();
    $('#ex-hist').innerHTML = hist.length ? '<div class="tbl-wrap"><table class="tbl"><thead><tr><th scope="col">Дата</th><th scope="col">Предмет</th><th scope="col">Экзамен</th><th scope="col">Результат</th><th scope="col">≈ Балл</th></tr></thead><tbody>' +
      hist.map(function (h) { return '<tr><td class="mono">' + new Date(h.at).toLocaleDateString('ru-RU') + '</td><td>' + esc(S[h.sid] ? S[h.sid].name : h.sid) + '</td><td>' + examName(h.mode) + '</td><td class="mono">' + h.ok + ' / ' + h.n + '</td><td class="mono">' + (h.mode === 'ege' ? estimate(h.ok / h.n) : ogeMark(h.ok / h.n)) + '</td></tr>'; }).join('') + '</tbody></table></div>'
      : '<div class="empty sheet"><span class="hand">Здесь будут ваши варианты</span><p class="muted">Решите первый пробник, и результат появится в истории.</p></div>';
  }
  function ogeMark(pct) { return pct >= 0.85 ? '«5»' : pct >= 0.65 ? '«4»' : pct >= 0.35 ? '«3»' : '«2»'; }
  function examRun() {
    var s = S[exam.sid];
    main.dataset.title = 'Пробник · ' + s.name;
    main.innerHTML = '<h1 class="sr">Пробный вариант: ' + esc(s.name) + '</h1><div class="exam-run"><div id="ex-task" style="min-width:0"></div>' +
      '<aside class="exam-panel sheet" aria-label="Навигация по варианту"><div><span class="eyebrow">' + esc(s.name) + ' · ' + examName(exam.mode) + '</span><div class="timer" id="ex-timer-v" role="timer" aria-label="Оставшееся время">' + (exam.dur ? fmtTime(examLeft()) : '—:—') + '</div><span class="sr" id="ex-timer-sr" aria-live="polite"></span></div>' +
      '<div class="num-grid" id="ex-nums" role="group" aria-label="Задания варианта"></div><div class="ex-nav"><button class="btn" type="button" id="ex-prev" aria-label="Предыдущее задание">←</button><button class="btn" type="button" id="ex-next">Дальше →</button></div>' +
      '<button class="btn red" type="button" id="ex-finish">Завершить и проверить</button><div id="ex-confirm" hidden class="ex-confirm" role="alertdialog" aria-labelledby="ex-confirm-t"><span id="ex-confirm-t"></span><div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap"><button class="btn sm red" type="button" id="ex-yes">Да, проверить</button><button class="btn sm" type="button" id="ex-no">Вернуться</button></div></div></aside></div>';
    var qs = examQs();
    var nums = $('#ex-nums');
    var filled = function (i) { return examFilledQ(qs[i], exam); };
    var paintNums = function () {
      var btns = $$('button', nums);
      if (btns.length !== qs.length) {
        nums.innerHTML = '';
        qs.forEach(function (q, i) {
          var b = frag('<button type="button">' + (i + 1) + '</button>');
          b.addEventListener('click', function () { go(i); });
          nums.appendChild(b);
        });
        btns = $$('button', nums);
      }
      btns.forEach(function (b, i) {
        var f = filled(i);
        b.className = (f ? 'done ' : '') + (i === exam.cur ? 'cur' : '');
        b.setAttribute('aria-label', 'Задание ' + (i + 1) + (f ? ', есть ответ' : ', без ответа'));
        if (i === exam.cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      });
    };
    var go = function (i, focusTask) {
      exam.cur = i; saveExam(); show();
      var host = $('#ex-task');
      if (host.getBoundingClientRect().top < 0 || window.innerWidth <= 980) host.scrollIntoView({ block: 'start', behavior: reducedMotion() ? 'auto' : 'smooth' });
      if (focusTask) { var h = $('.task', host); focusEl(h); }
    };
    var show = function () {
      var q = qs[exam.cur];
      var host = $('#ex-task'); host.innerHTML = '';
      var card = renderTask(q, {
        num: exam.cur + 1, mode: 'exam', value: exam.values[q.id],
        onChange: function (v, init) { exam.values[q.id] = v; if (!init) exam.touched[q.id] = true; saveExam(); paintNums(); },
        onEnter: function () { if (exam.cur < qs.length - 1) go(exam.cur + 1, true); }
      });
      host.appendChild(card);
      $('#ex-prev').disabled = exam.cur === 0;
      $('#ex-next').textContent = exam.cur === qs.length - 1 ? 'К проверке' : 'Дальше →';
      paintNums();
    };
    $('#ex-prev').addEventListener('click', function () { if (exam.cur > 0) go(exam.cur - 1, true); });
    $('#ex-next').addEventListener('click', function () { if (exam.cur < qs.length - 1) go(exam.cur + 1, true); else $('#ex-finish').click(); });
    $('#ex-finish').addEventListener('click', function () {
      var emptyN = qs.filter(function (_, i) { return !filled(i); }).length;
      if (emptyN) {
        $('#ex-confirm-t').textContent = 'Без ответа ' + emptyN + ' ' + plural(emptyN, 'задание', 'задания', 'заданий') + '. Завершить всё равно?';
        $('#ex-confirm').hidden = false; $('#ex-yes').focus(); return;
      }
      examFinish('user');
    });
    $('#ex-yes').addEventListener('click', function () { examFinish('user'); });
    $('#ex-no').addEventListener('click', function () {
      $('#ex-confirm').hidden = true;
      var firstEmpty = qs.map(function (_, i) { return i; }).filter(function (i) { return !filled(i); })[0];
      if (firstEmpty != null) go(firstEmpty, true);
    });
    show();
    startExamClock();
    examTick();
  }
  function examResult() {
    var s = S[exam.sid], qs = examQs();
    var ok = exam.results.filter(Boolean).length, pct = qs.length ? ok / qs.length : 0;
    main.dataset.title = 'Результат пробника';
    var byTopic = {}, order = [];
    qs.forEach(function (q, i) { var k = q._t.id; if (!byTopic[k]) { byTopic[k] = { t: q._t, ok: 0, n: 0 }; order.push(k); } byTopic[k].n++; if (exam.results[i]) byTopic[k].ok++; });
    var mins = Math.round((exam.took || 0) / 60000);
    var skipped = qs.filter(function (q) { return !examFilledQ(q, exam); }).length;
    main.innerHTML = '<nav class="crumbs" aria-label="Навигация"><a href="#/exam">Пробный вариант</a><span aria-hidden="true">/</span><span aria-current="page">Результат</span></nav>' +
      '<section class="result-hero sheet" style="' + cvar(s) + '"><div class="score-big" aria-label="' + ok + ' из ' + qs.length + '">' + ok + '<small> / ' + qs.length + '</small></div>' +
      '<div><span class="eyebrow">' + esc(s.name) + ' · ' + examName(exam.mode) + ' · ' + (mins < 1 ? 'меньше минуты' : mins + ' мин') + (skipped ? ' · без ответа: ' + skipped : '') + '</span><h1 class="h-display" style="font-size:28px;margin:6px 0 8px">' + (pct >= 0.85 ? 'Отличный результат' : pct >= 0.6 ? 'Хорошая база, есть что подтянуть' : 'Есть над чем поработать') + '</h1>' +
      '<p class="muted">Ориентировочно ' + (exam.mode === 'ege' ? '<b style="color:var(--text)">' + estimate(pct) + ' тестовых баллов</b>' : '<b style="color:var(--text)">' + (pct >= 0.35 ? 'отметка ' + ogeMark(pct) : 'пока ниже «3»') + '</b>') + '. Оценка грубая: в реальном экзамене у заданий разный вес.</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px"><a class="btn primary" href="#/exam/' + s.id + '">Новый вариант</a>' + (ok < qs.length ? '<a class="btn" href="#/review">Разобрать ошибки</a>' : '') + '</div></div></section>' +
      '<section class="section"><div class="section-head"><h2>По темам</h2></div><div class="toc-list result-topics">' +
      order.map(function (k) { var b = byTopic[k]; return '<a class="toc-row" href="#/s/' + s.id + '/' + k + '"><span class="toc-main"><b style="font-size:15.5px">' + esc(b.t.title) + '</b></span><span class="toc-side" style="flex-direction:row;align-items:center"><span class="mono">' + b.ok + '/' + b.n + '</span><span class="bar" style="width:100px;--c:' + (b.ok === b.n ? 'var(--ok)' : 'var(--red)') + '" role="img" aria-label="' + b.ok + ' из ' + b.n + ' верно"><i style="width:' + Math.round(b.ok / b.n * 100) + '%"></i></span></span></a>'; }).join('') + '</div></section>' +
      '<section class="section"><div class="section-head"><h2>Разбор</h2><button class="btn sm ghost" type="button" id="ex-open-all">Раскрыть все</button></div><div class="tasks" id="ex-review"></div></section>';
    var host = $('#ex-review');
    qs.forEach(function (q, i) {
      var good = exam.results[i], filledQ = examFilledQ(q, exam);
      var box = frag('<details class="sheet review-item"' + (good ? '' : ' open') + '><summary><span class="task-num" style="width:30px;height:30px">' + (i + 1) + '</span>' +
        '<span class="chip ' + (good ? 'ok' : filledQ ? 'red' : 'warn') + '">' + (good ? 'верно' : filledQ ? 'ошибка' : 'нет ответа') + '</span><span class="muted">' + esc(q._t.title) + '</span></summary>' +
        '<div class="task-q" style="margin-top:12px">' + q.q + '</div>' +
        (q.options ? '<ol style="margin:8px 0 0;padding-left:22px">' + q.options.map(function (o) { return '<li>' + o + '</li>'; }).join('') + '</ol>' : '') +
        (q.type === 'match' ? '<div class="match-cols" style="margin-top:8px"><div>' + q.left.map(function (x, j) { return '<div class="match-item"><b>' + LETTERS[j] + ')</b><span>' + x + '</span></div>'; }).join('') + '</div><div>' + q.right.map(function (x, j) { return '<div class="match-item"><b>' + (j + 1) + ')</b><span>' + x + '</span></div>'; }).join('') + '</div></div>' : '') +
        '<div class="task-reveal" style="margin-top:12px"><div><span class="eyebrow">Ваш ответ</span><span class="mono">' + esc(filledQ ? valueText(q, exam.values[q.id]) : '—') + '</span></div><div class="correct-answer"><span class="eyebrow">Правильный ответ</span>' + correctText(q) + '</div><div><span class="eyebrow">Решение</span>' + (q.solution || '') + '</div></div></details>');
      host.appendChild(box);
      enhance(box);
    });
    $('#ex-open-all').addEventListener('click', function () {
      var ds = $$('details', host), open = ds.some(function (d) { return !d.open; });
      ds.forEach(function (d) { d.open = open; });
      this.textContent = open ? 'Свернуть все' : 'Раскрыть все';
    });
  }

  /* ================= Тренажёр ошибок ================= */
  function viewReview() {
    main.dataset.title = 'Тренажёр ошибок';
    var due = Progress.dueReview();
    var all = Object.keys(D().review).filter(function (id) { return Q[id]; });
    var later = all.length - due.length;
    var nextDue = all.filter(function (id) { return D().review[id].due > Date.now(); }).map(function (id) { return D().review[id].due; }).sort()[0];
    main.innerHTML = '<nav class="crumbs" aria-label="Навигация"><a href="#/">Предметы</a><span aria-hidden="true">/</span><span aria-current="page">Тренажёр ошибок</span></nav>' +
      '<header class="topic-head"><span class="eyebrow">Интервальное повторение</span><h1>Тренажёр ошибок</h1>' +
      '<p class="topic-summary">Каждая ошибка попадает сюда. Решили верно — задача вернётся через 1 день, потом через 3 и через 7 дней. Четыре верных решения подряд — и навык закреплён. Ошибка отправляет задачу в начало круга.</p>' +
      '<div class="topic-meta"><span class="chip red">к повторению: ' + due.length + '</span><span class="chip">запланировано позже: ' + later + '</span></div></header>' +
      '<div class="tasks" id="rev-list"></div>';
    var list = $('#rev-list');
    if (!due.length) {
      list.innerHTML = '<div class="empty sheet"><span class="hand">' + (all.length ? 'На сегодня всё!' : 'Ошибок пока нет') + '</span><p class="muted">' + (all.length ? 'Следующее повторение — ' + new Date(nextDue).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) + '.' : 'Решайте задания в темах — неверные ответы окажутся здесь.') + '</p><a class="btn primary" href="#/">К предметам</a></div>';
      return;
    }
    due.forEach(function (q, i) {
      var card = renderTask(q, {
        num: i + 1, mode: 'review', showTopic: true,
        onResult: function (ok) {
          var r = D().review[q.id], note = $('.review-note', card);
          if (!note) { note = frag('<p class="review-note muted"></p>'); $('.task-actions', card).after(note); }
          note.textContent = !ok ? 'Задача остаётся в тренажёре — вернитесь к ней после разбора.'
            : !r ? 'Навык закреплён — задача ушла из тренажёра.'
            : r.due > Date.now() ? 'Следующее повторение — ' + new Date(r.due).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }) + '.'
            : 'Верно после подсказки не считается: задача вернётся в следующий раз.';
        }
      });
      list.appendChild(card);
    });
  }

  /* ================= Карточки ================= */
  function viewCards(sid) {
    main.dataset.title = 'Карточки';
    var s = S[sid];
    var deck = [];
    (s ? [s] : subjects).forEach(function (x) { (x.cards || []).forEach(function (c, i) { if (c && c.q != null) deck.push({ key: x.id + ':' + i, c: c, s: x }); }); });
    var cs = D().cards, now = Date.now();
    var isLearned = function (d) { return cs[d.key] && cs[d.key].box >= 3; };
    var learned = deck.filter(isLearned).length;
    var queue = deck.filter(function (d) { return !cs[d.key] || cs[d.key].due <= now; });
    queue = shuffle(queue.filter(function (d) { return cs[d.key]; })).concat(shuffle(queue.filter(function (d) { return !cs[d.key]; })));
    main.innerHTML = '<nav class="crumbs" aria-label="Навигация"><a href="#/">Предметы</a><span aria-hidden="true">/</span><span aria-current="page">Карточки</span></nav>' +
      '<header class="topic-head"><span class="eyebrow">Флеш-карточки</span><h1>' + (s ? esc(s.name) + ': карточки' : 'Карточки по всем предметам') + '</h1>' +
      '<p class="topic-summary">Формулы, даты, термины и исключения. Нажмите на карточку или пробел, чтобы перевернуть. Клавиши 1 и 2 — «не помню» и «помню».</p>' +
      '<nav class="filter-row" id="deck-pick" aria-label="Колода"></nav></header>' +
      '<div class="flash-wrap" id="flash"></div>';
    var pick = $('#deck-pick');
    pick.appendChild(frag('<a class="chip ' + (s ? '' : 'ink') + '" href="#/cards"' + (s ? '' : ' aria-current="page"') + '>Все</a>'));
    subjects.forEach(function (x) {
      var n = (x.cards || []).length;
      if (!n) return;
      pick.appendChild(frag('<a class="chip ' + (s === x ? 'ink' : '') + '" href="#/cards/' + x.id + '"' + (s === x ? ' aria-current="page"' : '') + '>' + esc(SHORT[x.id] || x.name) + ' <span class="mono">' + n + '</span></a>'));
    });
    var host = $('#flash');
    var i = 0, cur = null;
    var show = function (focusCard) {
      cur = null;
      if (i >= queue.length) {
        var dueLater = deck.filter(function (d) { return cs[d.key] && cs[d.key].due > Date.now(); }).length;
        host.innerHTML = '<div class="empty sheet"><span class="hand">Колода пройдена</span><p class="muted">Выучено ' + deck.filter(isLearned).length + ' из ' + deck.length + '. ' + (dueLater ? 'Карточки, которые вы помните, вернутся позже.' : '') + '</p><button class="btn primary" type="button" id="again">Повторить всё заново</button></div>';
        $('#again').addEventListener('click', function () { queue = shuffle(deck); i = 0; show(true); });
        $('#again').focus();
        return;
      }
      var d = queue[i];
      host.innerHTML = '<div class="score-row" aria-live="polite"><span>Карточка <b>' + (i + 1) + '</b> из <b>' + queue.length + '</b></span><span>Выучено <b>' + learned + '</b> из <b>' + deck.length + '</b></span></div>' +
        '<div class="flash" id="card" tabindex="0" role="button" aria-pressed="false" aria-label="Карточка. Нажмите, чтобы увидеть ответ" style="' + cvar(d.s) + '"><div class="flash-in">' +
        '<div class="flash-face flash-front"><span class="eyebrow" style="color:var(--c)">' + esc(d.s.name) + '</span><div>' + d.c.q + '</div></div>' +
        '<div class="flash-face flash-back" aria-hidden="true"><span class="eyebrow">Ответ</span><div>' + d.c.a + '</div></div></div></div>' +
        '<p class="sr" aria-live="polite" id="card-live"></p>' +
        '<div class="flash-actions"><button class="btn" type="button" id="c-no" aria-keyshortcuts="1">1 · Не помню</button><button class="btn" type="button" id="c-flip">Перевернуть</button><button class="btn primary" type="button" id="c-yes" aria-keyshortcuts="2">2 · Помню</button></div>';
      renderMath(host);
      var card = $('#card');
      var flip = function () {
        var on = card.classList.toggle('flipped');
        card.setAttribute('aria-pressed', on ? 'true' : 'false');
        $('.flash-front', card).setAttribute('aria-hidden', on ? 'true' : 'false');
        $('.flash-back', card).setAttribute('aria-hidden', on ? 'false' : 'true');
        $('#card-live').textContent = on ? 'Ответ: ' + strip(d.c.a) : '';
      };
      card.addEventListener('click', flip);
      card.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); flip(); } });
      $('#c-flip').addEventListener('click', flip);
      var rate = function (good) {
        var st = cs[d.key] || { box: 0, due: 0 };
        st.box = good ? st.box + 1 : 0;
        st.due = good ? dayStart(Date.now(), [0, 1, 3, 7, 14][Math.min(st.box, 4)]) : 0;
        cs[d.key] = st; Store.save();
        if (!good) queue.push(d);
        learned = deck.filter(isLearned).length;
        i++; show(true);
      };
      $('#c-no').addEventListener('click', function () { rate(false); });
      $('#c-yes').addEventListener('click', function () { rate(true); });
      cur = { rate: rate, flip: flip };
      if (focusCard && host.contains(document.activeElement) === false) card.focus({ preventScroll: true });
    };
    var key = function (e) {
      if (!cur || e.ctrlKey || e.metaKey || e.altKey || $('.overlay')) return;
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === ' ' || e.key === 'Spacebar') {
        if (e.target.closest && e.target.closest('button, a, summary')) return;
        e.preventDefault(); cur.flip();
      }
      else if (e.key === '1') cur.rate(false);
      else if (e.key === '2') cur.rate(true);
    };
    document.addEventListener('keydown', key);
    onLeave(function () { document.removeEventListener('keydown', key); });
    if (!deck.length) { host.innerHTML = '<div class="empty sheet"><span class="hand">Скоро</span><p class="muted">Карточек ' + (s ? 'по этому предмету ' : '') + 'пока нет.</p></div>'; return; }
    show(false);
  }

  /* ================= Лаборатория ================= */
  function viewLabs(id) {
    var labs = KL.labs || {};
    if (id && labs[id]) {
      var l = labs[id];
      main.dataset.title = l.title;
      main.innerHTML = '<nav class="crumbs" aria-label="Навигация"><a href="#/labs">Лаборатория</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(l.title) + '</span></nav>' +
        '<header class="topic-head"><span class="eyebrow">' + esc(l.subjectName) + '</span><h1>' + esc(l.title) + '</h1><p class="topic-summary">' + esc(l.long || l.desc) + '</p></header><div id="lab-host"></div>';
      $('#lab-host').appendChild(labFrame(l, id, false));
      renderMath($('#lab-host'));
      return;
    }
    main.dataset.title = 'Лаборатория';
    main.innerHTML = '<nav class="crumbs" aria-label="Навигация"><a href="#/">Предметы</a><span aria-hidden="true">/</span><span aria-current="page">Лаборатория</span></nav>' +
      '<header class="topic-head"><span class="eyebrow">Интерактивы</span><h1>Лаборатория</h1><p class="topic-summary">Тренажёры и модели, в которых можно крутить параметры и сразу видеть результат. Многие встроены прямо в теорию.</p></header>' +
      '<div class="labs-strip" id="lab-grid"></div>';
    var keys = Object.keys(labs);
    keys.forEach(function (k) {
      var l = labs[k];
      $('#lab-grid').appendChild(frag('<a class="lab-card" href="#/labs/' + esc(k) + '"><span class="lab-ico" aria-hidden="true">' + esc(l.icon) + '</span><b>' + esc(l.title) + '</b><span>' + esc(l.desc) + '</span><span class="chip" style="align-self:flex-start;margin-top:4px">' + esc(l.subjectName) + '</span></a>'));
    });
    if (!keys.length) $('#lab-grid').outerHTML = '<div class="empty sheet"><span class="hand">Скоро</span><p class="muted">Интерактивы ещё загружаются или пока не добавлены.</p></div>';
    if (id && !labs[id]) toast('Такой лаборатории нет');
  }

  /* ================= Прогресс ================= */
  function weakTopics() {
    var d = D(), out = [];
    subjects.forEach(function (s) {
      s.topics.forEach(function (t) {
        var st = Progress.topicStats(t);
        if (st.attempted < 2) return;
        var dueN = t.tasks.filter(function (q) { return d.review[q.id]; }).length;
        var acc = st.firstOk / st.attempted;
        if (acc >= 0.8 && !dueN) return;
        out.push({ t: t, acc: acc, st: st, due: dueN });
      });
    });
    return out.sort(function (a, b) { return a.acc - b.acc || b.due - a.due || b.st.attempted - a.st.attempted; }).slice(0, 6);
  }
  function viewMe() {
    main.dataset.title = 'Прогресс';
    var d = D(), tot = Progress.totals();
    var weak = weakTopics();
    main.innerHTML = '<nav class="crumbs" aria-label="Навигация"><a href="#/">Предметы</a><span aria-hidden="true">/</span><span aria-current="page">Прогресс</span></nav>' +
      '<header class="topic-head"><span class="eyebrow">Статистика</span><h1>Мой прогресс</h1><p class="topic-summary">Прогресс хранится в этом браузере. Чтобы продолжить на другом устройстве, сохраните его в файл и загрузите там.</p></header>' +
      '<div class="stats" style="margin-bottom:28px"><div class="stat"><b>' + d.xp + '</b><span>опыт, XP</span></div><div class="stat"><b>' + Progress.streak() + '</b><span>дней подряд</span></div><div class="stat"><b>' + tot.solved + '</b><span>задач решено</span></div><div class="stat"><b>' + tot.acc + '%</b><span>с первой попытки</span></div></div>' +
      '<section class="sheet heat-sec"><div class="section-head" style="margin-bottom:10px"><h2 style="font-size:18px">Активность за 20 недель</h2><span class="muted" style="font-size:13px">одна клетка — один день</span></div><div class="heat-scroll"><canvas id="heat" role="img" aria-label="Календарь активности"></canvas></div></section>' +
      '<section class="section"><div class="section-head"><h2>Слабые места</h2><span class="muted">темы с наименьшей точностью с первой попытки</span></div><div id="weak"></div></section>' +
      '<section class="section"><div class="section-head"><h2>По предметам</h2></div><div class="toc-list" id="me-subj"></div></section>' +
      '<section class="section"><div class="section-head"><h2>Перенос прогресса</h2></div><div class="sheet data-box"><p>Сохраните прогресс в файл и загрузите его на другом устройстве или в другом браузере. В файле — решённые задачи, XP, тренажёр ошибок, карточки и история пробников.</p>' +
      '<div class="data-actions"><button class="btn" type="button" id="exp">' + ICON.download + ' Сохранить в файл</button><label class="btn" for="imp-file">' + ICON.upload + ' Загрузить из файла</label><input type="file" id="imp-file" accept="application/json,.json" class="sr"></div>' +
      '<div id="imp-confirm" class="imp-confirm" hidden role="alertdialog" aria-labelledby="imp-text"><p id="imp-text"></p><div class="data-actions"><button class="btn primary" type="button" id="imp-yes">Заменить прогресс</button><button class="btn ghost" type="button" id="imp-no">Отмена</button></div></div></div></section>' +
      '<section class="section" id="install-sec" hidden><div class="section-head"><h2>Приложение</h2></div><div class="sheet data-box"><p>Установите «Клетку» как приложение: иконка на рабочем столе, запуск без браузерных панелей, теория и задания открываются без интернета.</p><div class="data-actions"><button class="btn primary" type="button" id="install-me">Установить</button></div></div></section>' +
      '<section class="section"><div class="section-head"><h2>Сброс</h2></div><div class="sheet data-box" style="flex-direction:row;align-items:center;flex-wrap:wrap"><p style="flex:1;min-width:220px">Удалить весь прогресс, историю пробников и тренажёр ошибок в этом браузере.</p><button class="btn" type="button" id="reset">Сбросить прогресс</button><span id="reset-confirm" hidden role="alertdialog" aria-label="Подтверждение сброса"><button class="btn red" type="button" id="reset-yes">Да, удалить всё</button> <button class="btn ghost" type="button" id="reset-no">Отмена</button></span></div></section>';

    var wh = $('#weak');
    if (!weak.length) {
      wh.innerHTML = '<div class="empty sheet"><span class="hand">' + (tot.attempted ? 'Слабых мест не видно' : 'Пока нечего анализировать') + '</span><p class="muted">' + (tot.attempted ? 'Во всех темах, где вы решали хотя бы 2 задания, точность с первой попытки 80% и выше.' : 'Решите несколько заданий в темах — здесь появятся те, что даются тяжелее всего.') + '</p></div>';
    } else {
      wh.innerHTML = '<ol class="toc-list weak-list">' + weak.map(function (w) {
        var p = Math.round(w.acc * 100);
        return '<li class="weak-row" style="' + cvar(w.t._s) + '">' + glyph(w.t._s, 'sm') + '<span class="toc-main"><b>' + esc(w.t.title) + '</b><span class="toc-meta"><span>' + esc(SHORT[w.t._s.id] || w.t._s.name) + '</span><span>решали ' + w.st.attempted + ' из ' + w.st.total + '</span>' + (w.due ? '<span class="chip red">' + w.due + ' в тренажёре</span>' : '') + '</span></span>' +
          '<span class="weak-acc"><span class="mono">' + p + '%</span><span class="bar" role="img" aria-label="Точность ' + p + '%" style="--c:' + (p < 50 ? 'var(--red)' : 'var(--warn)') + '"><i style="width:' + p + '%"></i></span></span>' +
          '<a class="btn sm" href="#/s/' + w.t._s.id + '/' + w.t.id + '/practice" aria-label="Потренировать тему «' + esc(w.t.title) + '»">Потренировать</a></li>';
      }).join('') + '</ol>';
    }

    var host = $('#me-subj');
    subjects.forEach(function (s) {
      var st = Progress.subjectStats(s);
      host.appendChild(frag('<a class="toc-row me-subj-row" style="' + cvar(s) + '" href="#/s/' + s.id + '">' + glyph(s) + '<span class="toc-main"><b>' + esc(s.name) + '</b><span class="toc-meta"><span>' + st.mastered + ' из ' + s.topics.length + ' тем освоено</span></span></span><span class="toc-side"><span class="mono">' + st.solved + '/' + st.total + '</span><span class="bar" role="img" aria-label="Решено ' + Math.round(st.pct * 100) + '%"><i style="width:' + Math.round(st.pct * 100) + '%"></i></span></span></a>'));
    });

    /* Экспорт / импорт */
    $('#exp').addEventListener('click', exportProgress);
    var pending = null;
    $('#imp-file').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!f) return;
      if (f.size > 5 * 1024 * 1024) { toast('Файл слишком большой для прогресса'); return; }
      var rd = new FileReader();
      rd.onload = function () {
        var obj = null;
        try { obj = JSON.parse(String(rd.result)); } catch (er) { obj = null; }
        var data = obj && obj.app === 'kletka' ? obj.data : obj;
        if (!data || typeof data !== 'object' || !data.tasks || typeof data.tasks !== 'object') { toast('Это не файл прогресса «Клетки»'); return; }
        pending = Store.sanitize(data);
        var n = Object.keys(pending.tasks).filter(function (id) { return pending.tasks[id].solved; }).length;
        $('#imp-text').textContent = 'В файле: ' + n + ' ' + plural(n, 'решённая задача', 'решённые задачи', 'решённых задач') + ', ' + pending.xp + ' XP' + (obj && obj.exportedAt ? ', сохранён ' + new Date(obj.exportedAt).toLocaleDateString('ru-RU') : '') + '. Текущий прогресс в этом браузере будет заменён.';
        $('#imp-confirm').hidden = false;
        $('#imp-yes').focus();
      };
      rd.onerror = function () { toast('Не удалось прочитать файл'); };
      rd.readAsText(f);
    });
    $('#imp-no').addEventListener('click', function () { pending = null; $('#imp-confirm').hidden = true; });
    $('#imp-yes').addEventListener('click', function () {
      if (!pending) return;
      pending.theme = pending.theme || D().theme;
      Store.data = pending; pending = null; Store.save();
      searchIndex = null; applyTheme(); paintExam(); updateBadge();
      toast('Прогресс загружен'); route();
    });

    /* Установка */
    var paintInstallMe = function () { var sec = $('#install-sec'); if (sec) sec.hidden = !installEvt; };
    paintInstallMe();
    $('#install-me').addEventListener('click', promptInstall);
    window.addEventListener('kl-install', paintInstallMe);
    onLeave(function () { window.removeEventListener('kl-install', paintInstallMe); });

    $('#reset').addEventListener('click', function () { $('#reset-confirm').hidden = false; $('#reset-yes').focus(); });
    $('#reset-no').addEventListener('click', function () { $('#reset-confirm').hidden = true; $('#reset').focus(); });
    $('#reset-yes').addEventListener('click', function () {
      var keep = { exam: d.exam, theme: d.theme, examDate: d.examDate, plan: d.plan };
      try { localStorage.removeItem(Store.key); } catch (e) { /* ignore */ }
      Store.load(); Object.assign(Store.data, keep); Store.save();
      exam = null; saveExam(); stopExamClock();
      updateBadge(); toast('Прогресс сброшен'); route();
    });

    var draw = function () {
      var cv = $('#heat'); if (!cv || !cv.isConnected) return;
      var cs = getComputedStyle(document.documentElement);
      var W = cv.clientWidth, dpr = window.devicePixelRatio || 1;
      if (!W) return;
      var weeks = 20, gap = 3, left = 26, cell = Math.max(8, Math.min(18, (W - left - 4) / weeks - gap));
      var H = Math.ceil(4 + 7 * (cell + gap));
      cv.style.height = H + 'px';
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      var g = cv.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      var ink = cs.getPropertyValue('--ink').trim(), line = cs.getPropertyValue('--line').trim(), muted = cs.getPropertyValue('--muted').trim();
      var start = new Date(); start.setHours(12, 0, 0, 0);
      var dow = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - ((weeks - 1) * 7 + dow));
      g.font = '11px ' + (cs.getPropertyValue('--f-mono') || 'monospace'); g.fillStyle = muted; g.textBaseline = 'middle';
      ['пн', 'ср', 'пт'].forEach(function (t, i) { g.fillText(t, 0, 4 + (i * 2) * (cell + gap) + cell / 2); });
      var nowT = Date.now(), active = 0, total = 0;
      for (var w = 0; w < weeks; w++) for (var dd = 0; dd < 7; dd++) {
        var day = new Date(start); day.setDate(start.getDate() + w * 7 + dd);
        if (day.getTime() > nowT) continue;
        var n = d.days[today(day)] || 0;
        if (n) { active++; total += n; }
        var x = left + w * (cell + gap), y = 4 + dd * (cell + gap);
        g.globalAlpha = 1; g.fillStyle = line; g.fillRect(x, y, cell, cell);
        if (n) { g.fillStyle = ink; g.globalAlpha = Math.min(1, 0.3 + n / 12); g.fillRect(x, y, cell, cell); }
      }
      g.globalAlpha = 1;
      cv.setAttribute('aria-label', 'Календарь активности за 20 недель: занимались ' + active + ' ' + plural(active, 'день', 'дня', 'дней') + ', ' + total + ' ' + plural(total, 'попытка', 'попытки', 'попыток') + ' решения');
    };
    draw();
    var redraw = function () { requestAnimationFrame(draw); };
    window.addEventListener('kl-theme', redraw); window.addEventListener('resize', redraw);
    onLeave(function () { window.removeEventListener('kl-theme', redraw); window.removeEventListener('resize', redraw); });
  }
  function exportProgress() {
    var payload = { app: 'kletka', version: 1, exportedAt: new Date().toISOString(), data: D() };
    var blob = new Blob([JSON.stringify(payload, null, 1)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'kletka-progress-' + today() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    toast('Файл прогресса сохранён');
  }

  /* ================= Поиск ================= */
  var searchIndex = null;
  function low(s) { return String(s || '').toLowerCase().replace(/ё/g, 'е'); }
  function buildIndex() {
    searchIndex = [];
    subjects.forEach(function (s) {
      searchIndex.push({ kind: 'Предмет', s: s, title: s.name, sub: s.tagline, href: '#/s/' + s.id, text: low(s.name + ' ' + s.tagline), boost: 3 });
      s.topics.forEach(function (t) {
        searchIndex.push({ kind: 'Тема', s: s, title: t.title, sub: s.name + ' · ' + t.summary, href: '#/s/' + s.id + '/' + t.id, text: low(t.title + ' ' + t.summary + ' ' + strip(t.keyPoints.join(' ')) + ' ' + t.theory.map(function (x) { return x.h; }).join(' ')), boost: 2 });
        t.tasks.forEach(function (q) {
          searchIndex.push({ kind: 'Задание', s: s, title: strip(q.q).slice(0, 90), sub: s.name + ' · ' + t.title, href: '#/s/' + s.id + '/' + t.id + '/practice', text: low(strip(q.q)) });
        });
      });
    });
    Object.keys(KL.labs || {}).forEach(function (id) {
      var l = KL.labs[id];
      searchIndex.push({ kind: 'Лаборатория', lab: l, title: l.title, sub: l.desc, href: '#/labs/' + id, text: low(l.title + ' ' + l.desc + ' ' + (l.subjectName || '')), boost: 1 });
    });
    searchIndex.forEach(function (x) { x.ltitle = low(x.title); });
  }
  function openSearch() {
    if ($('.overlay')) return;
    if (!searchIndex) buildIndex();
    var prevFocus = document.activeElement;
    var ov = frag('<div class="overlay" role="dialog" aria-modal="true" aria-label="Поиск"><div class="palette sheet"><label class="sr" for="search-input">Поиск по темам, заданиям и лабораториям</label>' +
      '<input id="search-input" type="search" role="combobox" aria-expanded="true" aria-controls="search-list" aria-autocomplete="list" placeholder="Тема, термин, формула… например «гидролиз»" autocomplete="off" spellcheck="false" enterkeyhint="go">' +
      '<div class="palette-list" id="search-list" role="listbox" aria-label="Результаты"></div><p class="sr" aria-live="polite" id="search-count"></p>' +
      '<div class="palette-foot" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> выбор</span><span><kbd>Enter</kbd> открыть</span><span><kbd>Esc</kbd> закрыть</span></div></div></div>');
    document.body.appendChild(ov);
    document.body.classList.add('no-scroll');
    var inp = $('#search-input', ov), list = $('#search-list', ov), act = 0, items = [];
    var close = function (silent) {
      if (!ov.isConnected) return;
      ov.remove();
      document.body.classList.remove('no-scroll');
      if (!silent && prevFocus && prevFocus.focus && document.contains(prevFocus)) prevFocus.focus();
    };
    ov._close = close;
    var setAct = function (i) {
      var els = $$('.palette-item', list);
      if (!els.length) { inp.removeAttribute('aria-activedescendant'); return; }
      act = (i + els.length) % els.length;
      els.forEach(function (x, k) { x.classList.toggle('act', k === act); x.setAttribute('aria-selected', k === act ? 'true' : 'false'); });
      inp.setAttribute('aria-activedescendant', els[act].id);
      els[act].scrollIntoView({ block: 'nearest' });
    };
    var paint = function () {
      var qv = low(inp.value).trim();
      var words = qv.split(/\s+/).filter(Boolean);
      if (!words.length) items = searchIndex.filter(function (x) { return x.kind === 'Предмет' || x.kind === 'Лаборатория'; });
      else {
        items = searchIndex.filter(function (x) { return words.every(function (w) { return x.text.indexOf(w) >= 0 || x.ltitle.indexOf(w) >= 0; }); });
        var score = function (x) { var t = x.ltitle, sc = (x.boost || 0) * 2; if (t.indexOf(qv) === 0) sc += 6; else if (t.indexOf(qv) >= 0) sc += 4; else if (t.indexOf(words[0]) >= 0) sc += 2; return sc; };
        items.forEach(function (x) { x._sc = score(x); });
        items.sort(function (a, b) { return b._sc - a._sc; });
      }
      var total = items.length;
      items = items.slice(0, 40); act = 0;
      list.innerHTML = items.length ? '' : '<p class="muted" style="padding:14px">Ничего не нашлось. Попробуйте другое слово.</p>';
      items.forEach(function (x, i) {
        var g = x.s ? '<span style="' + cvar(x.s) + '">' + glyph(x.s, 'sm') + '</span>' : '<span class="glyph" aria-hidden="true" style="font-size:11px">' + esc(x.lab.icon) + '</span>';
        var a = frag('<a class="palette-item" role="option" id="sr-' + i + '" aria-selected="false" href="' + x.href + '">' + g + '<div><b>' + esc(x.title) + '</b><small>' + esc(x.kind) + ' · ' + esc(x.sub) + '</small></div></a>');
        a.addEventListener('click', function () { close(true); });
        a.addEventListener('mousemove', function () { if (act !== i) setAct(i); });
        list.appendChild(a);
      });
      setAct(0);
      $('#search-count', ov).textContent = words.length ? (total ? 'Найдено: ' + total : 'Ничего не найдено') : '';
    };
    inp.addEventListener('input', paint);
    ov.addEventListener('keydown', function (e) {
      var els = $$('.palette-item', list);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setAct(act + (e.key === 'ArrowDown' ? 1 : -1)); inp.focus(); }
      else if (e.key === 'Enter' && document.activeElement === inp && els[act]) { e.preventDefault(); var h = els[act].getAttribute('href'); close(true); if (location.hash === h) route(); else location.hash = h; }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') {
        /* Фокус не уходит за пределы окна поиска */
        var f = [inp].concat(els), k = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    paint();
    inp.focus();
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K' || e.key === 'л' || e.key === 'Л' || e.code === 'KeyK')) { e.preventDefault(); openSearch(); return; }
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !(e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]')) && !$('.overlay')) { e.preventDefault(); openSearch(); }
  });

  /* ================= Якорные ссылки внутри страницы ================= */
  /* Ссылки вида #practice не должны менять маршрут (#/...) — только прокручивать и переводить фокус */
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var h = a.getAttribute('href');
    if (isRouteHash(h)) {
      /* Повторный клик по текущему маршруту — перерисовать (например, «Новый вариант» на той же странице) */
      if (h === location.hash || (h === '#/' && (location.hash === '' || location.hash === '#/'))) { e.preventDefault(); route(); focusView(); }
      return;
    }
    var id = h.slice(1), tg = null;
    try { tg = document.getElementById(decodeURIComponent(id)); } catch (er) { tg = document.getElementById(id); }
    if (!tg) return;
    e.preventDefault();
    scrollToEl(tg);
    focusEl(tg);
  });
  function focusView() {
    var h = $('h1', main);
    focusEl(h || main);
  }

  /* ================= Офлайн, установка, синхронизация вкладок ================= */
  var installEvt = null;
  function promptInstall() {
    if (!installEvt) return;
    var ev = installEvt; installEvt = null;
    try { ev.prompt(); } catch (e) { /* ignore */ }
    if (ev.userChoice) ev.userChoice.then(function () { window.dispatchEvent(new Event('kl-install')); paintInstallFoot(); });
    window.dispatchEvent(new Event('kl-install')); paintInstallFoot();
  }
  function paintInstallFoot() {
    var b = $('#install-btn');
    if (b) b.hidden = !installEvt;
  }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    installEvt = e;
    paintInstallFoot();
    window.dispatchEvent(new Event('kl-install'));
  });
  window.addEventListener('appinstalled', function () { installEvt = null; paintInstallFoot(); window.dispatchEvent(new Event('kl-install')); toast('«Клетка» установлена как приложение'); });
  window.addEventListener('offline', function () { toast('Нет интернета — теория и задания работают из кеша'); });
  window.addEventListener('online', function () { toast('Снова онлайн'); });
  window.addEventListener('storage', function (e) {
    if (e.key === Store.key) { Store.load(); applyTheme(); paintExam(); updateBadge(); }
    if (e.key === EXAM_KEY) { exam = loadExam(); if (exam && !exam.done) startExamClock(); else stopExamClock(); paintExamPill(); }
  });
  function registerSW() {
    if (!/^https?:$/.test(location.protocol)) return;
    try {
      if (!('serviceWorker' in navigator)) return;
      navigator.serviceWorker.register('sw.js').catch(function () { /* без офлайна */ });
    } catch (e) { /* песочница без service worker */ }
  }
  var resizeT = null;
  window.addEventListener('resize', function () { clearTimeout(resizeT); resizeT = setTimeout(function () { fitMath(main); }, 150); });

  /* ================= Запуск ================= */
  KL.app = { renderTask: renderTask, renderMath: renderMath, isCorrect: isCorrect, checkInput: checkInput, toast: toast, Store: Store, Progress: Progress };
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var mqh = function () { if (!D().theme) applyTheme(); };
    if (mq.addEventListener) mq.addEventListener('change', mqh);
    else if (mq.addListener) mq.addListener(mqh);
  }
  renderTop();
  AI.init();
  exam = loadExam();
  window.addEventListener('hashchange', function () {
    if (!isRouteHash(location.hash)) return;
    route();
    focusView();
  });
  route();
  (function () {
    var b = $('#install-btn');
    if (b) b.addEventListener('click', promptInstall);
  })();
  if (document.readyState === 'complete') registerSW();
  else window.addEventListener('load', registerSW);
})();
