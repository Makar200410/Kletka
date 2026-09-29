/* Лаборатория «Неправильные глаголы» — спринт: дан инфинитив (V1) и перевод, ввести V2 и V3; варианты форм засчитываются, ошибки повторяются. */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  KL.labs = KL.labs || {};

  /* ================= Список глаголов =================
     [V1, V2 (варианты через /), V3 (варианты через /), перевод, подсказка].
     Формы сверены с Oxford Learner's Dictionaries; первым указан британский вариант. */
  var RAW = [
    ['be', 'was/were', 'been', 'быть', 'was — с I, he, she, it; were — с you, we, they'],
    ['beat', 'beat', 'beaten', 'бить; побеждать'],
    ['become', 'became', 'become', 'становиться', 'Как come: V3 совпадает с V1'],
    ['begin', 'began', 'begun', 'начинать', 'Модель i – a – u: begin, drink, ring, sing, sink, swim'],
    ['bend', 'bent', 'bent', 'сгибать'],
    ['bite', 'bit', 'bitten', 'кусать'],
    ['blow', 'blew', 'blown', 'дуть'],
    ['break', 'broke', 'broken', 'ломать'],
    ['bring', 'brought', 'brought', 'приносить', 'bring — brought, но buy — bought'],
    ['build', 'built', 'built', 'строить'],
    ['burn', 'burnt/burned', 'burnt/burned', 'гореть; жечь', 'Форма на -t — британская, на -ed — общая'],
    ['burst', 'burst', 'burst', 'лопаться, взрываться', 'Все три формы одинаковы'],
    ['buy', 'bought', 'bought', 'покупать', 'buy — bought, но bring — brought'],
    ['catch', 'caught', 'caught', 'ловить', 'Как teach — taught'],
    ['choose', 'chose', 'chosen', 'выбирать', 'V2 — одна o: chose; V3 — chosen'],
    ['come', 'came', 'come', 'приходить', 'V3 совпадает с V1: have come'],
    ['cost', 'cost', 'cost', 'стоить', 'Все три формы одинаковы'],
    ['cut', 'cut', 'cut', 'резать', 'Все три формы одинаковы'],
    ['deal', 'dealt', 'dealt', 'иметь дело'],
    ['dig', 'dug', 'dug', 'копать'],
    ['do', 'did', 'done', 'делать'],
    ['draw', 'drew', 'drawn', 'рисовать; тянуть'],
    ['dream', 'dreamt/dreamed', 'dreamt/dreamed', 'мечтать; видеть сны', 'Форма на -t — британская, на -ed — общая'],
    ['drink', 'drank', 'drunk', 'пить', 'Модель i – a – u'],
    ['drive', 'drove', 'driven', 'водить (машину), ехать'],
    ['eat', 'ate', 'eaten', 'есть'],
    ['fall', 'fell', 'fallen', 'падать', 'fell — это V2 от fall, не путайте с feel — felt'],
    ['feed', 'fed', 'fed', 'кормить'],
    ['feel', 'felt', 'felt', 'чувствовать'],
    ['fight', 'fought', 'fought', 'сражаться, драться'],
    ['find', 'found', 'found', 'находить'],
    ['fly', 'flew', 'flown', 'летать'],
    ['forbid', 'forbade/forbad', 'forbidden', 'запрещать'],
    ['forget', 'forgot', 'forgotten', 'забывать'],
    ['forgive', 'forgave', 'forgiven', 'прощать', 'Как give — gave — given'],
    ['freeze', 'froze', 'frozen', 'замерзать; замораживать'],
    ['get', 'got', 'got/gotten', 'получать; становиться', 'gotten — американский вариант V3'],
    ['give', 'gave', 'given', 'давать'],
    ['go', 'went', 'gone', 'идти, ехать'],
    ['grow', 'grew', 'grown', 'расти; выращивать'],
    ['hang', 'hung', 'hung', 'вешать; висеть', 'В значении «казнить через повешение» глагол правильный: hanged'],
    ['have', 'had', 'had', 'иметь'],
    ['hear', 'heard', 'heard', 'слышать'],
    ['hide', 'hid', 'hidden', 'прятать'],
    ['hit', 'hit', 'hit', 'ударять; попадать', 'Все три формы одинаковы'],
    ['hold', 'held', 'held', 'держать'],
    ['hurt', 'hurt', 'hurt', 'причинять боль, ранить', 'Все три формы одинаковы'],
    ['keep', 'kept', 'kept', 'хранить; продолжать'],
    ['know', 'knew', 'known', 'знать'],
    ['lay', 'laid', 'laid', 'класть; накрывать (на стол)', 'Не путайте: lie – lay – lain «лежать» и lay – laid – laid «класть»'],
    ['lead', 'led', 'led', 'вести'],
    ['lean', 'leant/leaned', 'leant/leaned', 'опираться, наклоняться'],
    ['learn', 'learnt/learned', 'learnt/learned', 'учить, узнавать', 'Форма на -t — британская, на -ed — общая'],
    ['leave', 'left', 'left', 'оставлять; уезжать'],
    ['lend', 'lent', 'lent', 'давать взаймы'],
    ['let', 'let', 'let', 'позволять', 'Все три формы одинаковы'],
    ['lie', 'lay', 'lain', 'лежать', 'lie в значении «лгать» — правильный: lied — lied'],
    ['light', 'lit/lighted', 'lit/lighted', 'зажигать'],
    ['lose', 'lost', 'lost', 'терять; проигрывать'],
    ['make', 'made', 'made', 'делать, изготавливать'],
    ['mean', 'meant', 'meant', 'значить, иметь в виду'],
    ['meet', 'met', 'met', 'встречать'],
    ['pay', 'paid', 'paid', 'платить', 'Как lay — laid, say — said'],
    ['put', 'put', 'put', 'класть, ставить', 'Все три формы одинаковы'],
    ['read', 'read', 'read', 'читать', 'Пишутся одинаково, но V2 и V3 читаются [red]'],
    ['ride', 'rode', 'ridden', 'ездить верхом, на велосипеде'],
    ['ring', 'rang', 'rung', 'звонить', 'Модель i – a – u'],
    ['rise', 'rose', 'risen', 'подниматься'],
    ['run', 'ran', 'run', 'бегать', 'V3 совпадает с V1: have run'],
    ['say', 'said', 'said', 'сказать'],
    ['see', 'saw', 'seen', 'видеть'],
    ['seek', 'sought', 'sought', 'искать'],
    ['sell', 'sold', 'sold', 'продавать'],
    ['send', 'sent', 'sent', 'посылать'],
    ['set', 'set', 'set', 'устанавливать', 'Все три формы одинаковы'],
    ['shake', 'shook', 'shaken', 'трясти'],
    ['shine', 'shone', 'shone', 'светить, сиять', 'shined — только в значении «начищать до блеска»'],
    ['shoot', 'shot', 'shot', 'стрелять; снимать (фильм)'],
    ['show', 'showed', 'shown/showed', 'показывать', 'Обычная V3 — shown; showed встречается редко'],
    ['shut', 'shut', 'shut', 'закрывать', 'Все три формы одинаковы'],
    ['sing', 'sang', 'sung', 'петь', 'Модель i – a – u'],
    ['sink', 'sank', 'sunk', 'тонуть', 'Модель i – a – u'],
    ['sit', 'sat', 'sat', 'сидеть'],
    ['sleep', 'slept', 'slept', 'спать'],
    ['smell', 'smelt/smelled', 'smelt/smelled', 'пахнуть; нюхать'],
    ['speak', 'spoke', 'spoken', 'говорить'],
    ['spell', 'spelt/spelled', 'spelt/spelled', 'писать или называть по буквам'],
    ['spend', 'spent', 'spent', 'тратить; проводить (время)'],
    ['spill', 'spilt/spilled', 'spilt/spilled', 'проливать'],
    ['spoil', 'spoilt/spoiled', 'spoilt/spoiled', 'портить'],
    ['spread', 'spread', 'spread', 'распространять(ся)', 'Все три формы одинаковы'],
    ['stand', 'stood', 'stood', 'стоять', 'Как understand — understood'],
    ['steal', 'stole', 'stolen', 'красть'],
    ['stick', 'stuck', 'stuck', 'приклеивать; втыкать'],
    ['strike', 'struck', 'struck', 'ударять; бастовать'],
    ['sweep', 'swept', 'swept', 'подметать'],
    ['swim', 'swam', 'swum', 'плавать', 'Модель i – a – u'],
    ['take', 'took', 'taken', 'брать'],
    ['teach', 'taught', 'taught', 'учить, обучать', 'Как catch — caught'],
    ['tear', 'tore', 'torn', 'рвать'],
    ['tell', 'told', 'told', 'рассказывать, сообщать'],
    ['think', 'thought', 'thought', 'думать'],
    ['throw', 'threw', 'thrown', 'бросать'],
    ['understand', 'understood', 'understood', 'понимать'],
    ['wake', 'woke', 'woken', 'просыпаться; будить'],
    ['wear', 'wore', 'worn', 'носить (одежду)'],
    ['win', 'won', 'won', 'побеждать, выигрывать'],
    ['write', 'wrote', 'written', 'писать', 'V3 — с двумя t: written']
  ];
  var VERBS = RAW.map(function (r) {
    return { id: r[0], v1: r[0], v2: r[1].split('/'), v3: r[2].split('/'), tr: r[3], hint: r[4] || '' };
  });
  var ROUND = 10;
  var KEY = 'kletka.lab.verbs';

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
  /* Ответ засчитывается, если каждое введённое слово — допустимая форма: «was», «were», «was/were», «learnt, learned». */
  function accept(input, forms) {
    var toks = String(input || '').toLowerCase().replace(/[’`]/g, "'").split(/[\s\/,;|]+|\bor\b/).filter(function (t) { return t; });
    if (!toks.length) return false;
    return toks.every(function (t) { return forms.indexOf(t) >= 0; });
  }
  function forms(list) { return list.join(' / '); }
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (!d || typeof d !== 'object') d = {};
      if (!d.w || typeof d.w !== 'object') d.w = {};
      return d;
    } catch (e) { return { w: {} }; }
  }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* хранилище недоступно */ } }
  /* rec: [верных подряд, всего ошибок, показов]. Глагол — «ошибка», пока его не назвали верно дважды подряд. */
  function recOf(d, id) { var r = d.w[id]; return Array.isArray(r) ? r : [0, 0, 0]; }
  function isMistake(d, id) { var r = recOf(d, id); return r[1] > 0 && r[0] < 2; }
  function mark(id, ok) {
    var d = load(), r = recOf(d, id).slice();
    r[2]++;
    if (ok) r[0] = Math.min(5, r[0] + 1); else { r[0] = 0; r[1]++; }
    d.w[id] = r;
    save(d);
  }
  function weightedSample(list, n, wf) {
    var pool = list.map(function (x) { return { x: x, k: Math.pow(Math.random(), 1 / Math.max(0.01, wf(x))) }; });
    pool.sort(function (a, b) { return b.k - a.k; });
    return pool.slice(0, n).map(function (p) { return p.x; });
  }

  /* ================= Стили ================= */
  var CSS = [
    '.lb-vb{display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.lb-vb-top{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center}',
    '.lb-vb-top .grow{flex:1}',
    '.lb-vb .seg button{cursor:pointer}',
    '.lb-vb .seg button:focus-visible{outline:2px solid var(--ink);outline-offset:2px}',
    '.lb-vb-card{border:1px solid var(--line);border-radius:10px;padding:14px 12px;display:flex;flex-direction:column;gap:12px;min-height:280px;',
    'background:var(--sheet);background-image:repeating-linear-gradient(transparent 0 23px,var(--grid) 23px 24px)}',
    '.lb-vb-bar{height:5px;background:var(--sheet-2);border-radius:3px;overflow:hidden}',
    '.lb-vb-bar i{display:block;height:100%;background:var(--ink);border-radius:3px;transition:width .3s}',
    '.lb-vb-meta{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;font-size:13px;color:var(--muted)}',
    '.lb-vb-v1{text-align:center;font:700 clamp(30px,7vw,44px)/1.1 var(--f-body);color:var(--ink);overflow-wrap:anywhere}',
    '.lb-vb-tr{text-align:center;font-size:16px;color:var(--muted);margin-top:-6px}',
    '.lb-vb-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}',
    '.lb-vb .lb-vb-fields input{width:100%;font-size:18px;padding:10px 12px}',
    '.lb-vb .lb-vb-fields input.ok{border-color:var(--ok);background:var(--ok-soft)}',
    '.lb-vb .lb-vb-fields input.bad{border-color:var(--red);background:var(--red-soft)}',
    '.lb-vb-fb{text-align:center;min-height:3.2em;font-size:15px;line-height:1.5}',
    '.lb-vb-fb .res{font:700 22px var(--f-hand);margin-right:6px}',
    '.lb-vb-fb .ok{color:var(--ok)}.lb-vb-fb .bad{color:var(--red)}',
    '.lb-vb-forms{font:700 17px var(--f-mono);color:var(--text)}',
    '.lb-vb-hint{display:block;color:var(--muted);font-size:14px;margin-top:2px}',
    '.lb-vb-act{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}',
    '.lb-vb-keys{font-size:12.5px;color:var(--muted);text-align:center;margin:0}',
    '.lb-vb-keys kbd{font:600 11.5px var(--f-mono);border:1px solid var(--line);border-bottom-width:2px;border-radius:4px;padding:0 4px;background:var(--sheet-2)}',
    '.lb-vb-sum{display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center}',
    '.lb-vb-sum .big{font:700 40px/1 var(--f-hand);color:var(--ink)}',
    '.lb-vb-sum ul{list-style:none;margin:0;padding:0;display:grid;gap:6px;text-align:left;width:100%;max-width:560px}',
    '.lb-vb-sum li{padding:8px 12px;border-radius:8px;background:var(--red-soft);overflow-wrap:anywhere}',
    '.lb-vb-sum li .mine{display:block;font-size:13.5px;color:var(--muted)}',
    '.lb-vb-sum li s{color:var(--red)}',
    '.lb-vb-empty{text-align:center;color:var(--muted);padding:30px 10px}'
  ].join('\n');
  function injectCss() {
    if (document.getElementById('lab-verbs-css')) return;
    var st = document.createElement('style');
    st.id = 'lab-verbs-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ================= Интерфейс ================= */
  function mount(el) {
    injectCss();
    var root = document.createElement('div');
    root.className = 'lb-vb';
    root.innerHTML =
      '<div class="lb-vb-top">' +
        '<div class="seg" role="group" aria-label="Какие глаголы спрашивать">' +
          '<button type="button" data-pool="all" class="on" aria-pressed="true">Все глаголы</button>' +
          '<button type="button" data-pool="mist" aria-pressed="false">Только ошибки (<span data-o="mcount">0</span>)</button>' +
        '</div>' +
        '<span class="grow"></span>' +
        '<button type="button" class="btn sm ghost" data-act="reset">Сбросить прогресс</button>' +
      '</div>' +
      '<div class="score-row">' +
        '<span>Верно: <b data-o="ok">0</b></span><span>Ошибок: <b data-o="bad">0</b></span>' +
        '<span>Точность: <b data-o="acc">—</b></span><span>Серия: <b data-o="streak">0</b></span>' +
      '</div>' +
      '<div class="lb-vb-card" data-o="card"></div>' +
      '<p class="lab-note">В тренажёре ' + VERBS.length + ' ' + plural(VERBS.length, 'глагол', 'глагола', 'глаголов') + '. Если у формы два варианта (was/were, learnt/learned, got/gotten), засчитывается любой из них или оба через косую черту. Раунд — ' + ROUND + ' глаголов; ошибки попадают в режим «Только ошибки» и уходят оттуда после двух верных ответов подряд.</p>';
    el.appendChild(root);

    function o(n) { return root.querySelector('[data-o="' + n + '"]'); }
    var card = o('card');
    var S = { pool: 'all', ok: 0, bad: 0, streak: 0, formsOk: 0, formsAll: 0, queue: [], qi: 0, checked: false, results: [] };

    function pool() {
      var d = load();
      return S.pool === 'mist' ? VERBS.filter(function (v) { return isMistake(d, v.id); }) : VERBS;
    }
    function score() {
      var d = load();
      o('mcount').textContent = VERBS.filter(function (v) { return isMistake(d, v.id); }).length;
      o('ok').textContent = S.ok; o('bad').textContent = S.bad; o('streak').textContent = S.streak;
      o('acc').textContent = S.formsAll ? Math.round(S.formsOk / S.formsAll * 100) + '%' : '—';
    }

    function startRound(list, focus) {
      var src = list || pool();
      if (!src.length) {
        S.queue = [];
        card.innerHTML = '<div class="lb-vb-empty"><p class="hand" style="font-size:26px;color:var(--ok)">Ошибок нет!</p>' +
          '<p>Все глаголы, в которых вы ошибались, уже выучены. Переключитесь на «Все глаголы», чтобы продолжить.</p></div>';
        return;
      }
      var d = load();
      S.queue = list ? list.slice(0, ROUND) : weightedSample(src, Math.min(ROUND, src.length), function (v) {
        var r = d.w[v.id];
        if (!Array.isArray(r) || !r[2]) return 3;
        return [6, 3, 1.5, 1, 0.6, 0.4][r[0]] || 0.4;
      });
      S.qi = 0; S.results = [];
      showVerb(focus);
    }
    function showVerb(focus) {
      if (S.qi >= S.queue.length) { summary(); return; }
      var v = S.queue[S.qi];
      S.checked = false;
      card.innerHTML =
        '<div class="lb-vb-bar" aria-hidden="true"><i style="width:' + Math.round(S.qi / S.queue.length * 100) + '%"></i></div>' +
        '<div class="lb-vb-meta"><span>Глагол ' + (S.qi + 1) + ' из ' + S.queue.length + '</span></div>' +
        '<div class="lb-vb-v1" lang="en">' + esc(v.v1) + '</div>' +
        '<div class="lb-vb-tr">' + esc(v.tr) + '</div>' +
        '<div class="lb-vb-fields">' +
          '<label>V2 — Past Simple<input type="text" data-f="v2" lang="en" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></label>' +
          '<label>V3 — Past Participle<input type="text" data-f="v3" lang="en" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></label>' +
        '</div>' +
        '<div class="lb-vb-fb" aria-live="polite"></div>' +
        '<div class="lb-vb-act">' +
          '<button type="button" class="btn primary" data-act="check">Проверить</button>' +
          '<button type="button" class="btn ghost" data-act="skip">Не знаю</button>' +
        '</div>' +
        '<p class="lb-vb-keys"><kbd>Enter</kbd> — к следующему полю, проверить, дальше</p>';
      if (focus) card.querySelector('[data-f="v2"]').focus();
    }
    function check(giveUp) {
      if (S.checked || S.qi >= S.queue.length) return;
      S.checked = true;
      var v = S.queue[S.qi];
      var i2 = card.querySelector('[data-f="v2"]'), i3 = card.querySelector('[data-f="v3"]');
      var a2 = giveUp ? '' : i2.value.trim(), a3 = giveUp ? '' : i3.value.trim();
      var ok2 = accept(a2, v.v2), ok3 = accept(a3, v.v3), ok = ok2 && ok3;
      [[i2, ok2], [i3, ok3]].forEach(function (p) { p[0].readOnly = true; p[0].classList.add(p[1] ? 'ok' : 'bad'); p[0].setAttribute('aria-invalid', p[1] ? 'false' : 'true'); });
      S.formsAll += 2; S.formsOk += (ok2 ? 1 : 0) + (ok3 ? 1 : 0);
      if (ok) { S.ok++; S.streak++; } else { S.bad++; S.streak = 0; }
      mark(v.id, ok);
      S.results.push({ v: v, ok: ok, a2: a2, a3: a3, ok2: ok2, ok3: ok3 });
      var line = '<span class="lb-vb-forms" lang="en">' + esc(v.v1) + ' – ' + esc(forms(v.v2)) + ' – ' + esc(forms(v.v3)) + '</span>';
      card.querySelector('.lb-vb-fb').innerHTML =
        (ok ? '<span class="res ok">Верно!</span> ' : '<span class="res bad">' + (giveUp ? 'Запомните:' : 'Ошибка.') + '</span> ') + line +
        (v.hint ? '<span class="lb-vb-hint">' + esc(v.hint) + '</span>' : '');
      var act = card.querySelector('.lb-vb-act');
      act.innerHTML = '<button type="button" class="btn primary" data-act="next">' + (S.qi + 1 >= S.queue.length ? 'Итоги раунда' : 'Дальше') + '</button>';
      act.querySelector('button').focus();
      score();
    }
    function next() {
      if (!S.checked) return;
      S.qi++;
      showVerb(true);
    }
    function summary() {
      var n = S.results.length, k = S.results.filter(function (r) { return r.ok; }).length;
      var bad = S.results.filter(function (r) { return !r.ok; });
      var verdict = k === n ? 'Идеально!' : k >= n * 0.8 ? 'Отлично!' : k >= n * 0.5 ? 'Неплохо, но есть что повторить' : 'Эти глаголы стоит повторить';
      card.innerHTML =
        '<div class="lb-vb-sum">' +
          '<span class="eyebrow">Итог раунда</span>' +
          '<span class="big">' + k + ' из ' + n + '</span>' +
          '<p>' + verdict + '</p>' +
          (bad.length ? '<p class="muted" style="font-size:14px">Ошибки раунда:</p><ul>' + bad.map(function (r) {
            var mine = [];
            if (!r.ok2) mine.push('V2: ' + (r.a2 ? '<s>' + esc(r.a2) + '</s>' : '—'));
            if (!r.ok3) mine.push('V3: ' + (r.a3 ? '<s>' + esc(r.a3) + '</s>' : '—'));
            return '<li><span class="lb-vb-forms" lang="en">' + esc(r.v.v1) + ' – ' + esc(forms(r.v.v2)) + ' – ' + esc(forms(r.v.v3)) + '</span> <span class="muted">' + esc(r.v.tr) + '</span>' +
              '<span class="mine">Ваш ответ: ' + mine.join('; ') + '</span></li>';
          }).join('') + '</ul>' : '') +
          '<div class="lb-vb-act">' +
            '<button type="button" class="btn primary" data-act="again">Новый раунд</button>' +
            (bad.length ? '<button type="button" class="btn" data-act="redo">Повторить ошибки раунда</button>' : '') +
          '</div>' +
        '</div>';
      S.lastBad = bad.map(function (r) { return r.v; });
      S.queue = []; S.qi = 0;
      var b = card.querySelector('[data-act="again"]');
      if (b && root.contains(document.activeElement)) b.focus();
    }

    root.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t || !root.contains(t)) return;
      if (t.dataset.pool) {
        if (t.dataset.pool === S.pool) return;
        S.pool = t.dataset.pool;
        var bs = root.querySelectorAll('[data-pool]');
        for (var i = 0; i < bs.length; i++) {
          var on = bs[i].dataset.pool === S.pool;
          bs[i].classList.toggle('on', on);
          bs[i].setAttribute('aria-pressed', on ? 'true' : 'false');
        }
        startRound();
        return;
      }
      var a = t.dataset.act;
      if (a === 'check') check(false);
      else if (a === 'skip') check(true);
      else if (a === 'next') next();
      else if (a === 'again') startRound(null, true);
      else if (a === 'redo') startRound(S.lastBad || [], true);
      else if (a === 'reset') {
        if (t.dataset.confirm) {
          save({ w: {} });
          S.ok = S.bad = S.streak = S.formsOk = S.formsAll = 0;
          delete t.dataset.confirm; t.textContent = 'Сбросить прогресс';
          score(); startRound();
        } else {
          t.dataset.confirm = '1'; t.textContent = 'Точно сбросить?';
          setTimeout(function () { if (t.dataset.confirm) { delete t.dataset.confirm; t.textContent = 'Сбросить прогресс'; } }, 4000);
        }
      }
    });
    card.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.altKey || e.ctrlKey || e.metaKey) return;
      var tg = e.target;
      if (tg.tagName !== 'INPUT') return;
      e.preventDefault();
      if (S.checked) { next(); return; }
      var i2 = card.querySelector('[data-f="v2"]'), i3 = card.querySelector('[data-f="v3"]');
      if (tg === i2 && !i3.value.trim()) { i3.focus(); return; }
      if (tg === i3 && !i2.value.trim()) { i2.focus(); return; }
      check(false);
    });

    score();
    startRound();
  }

  KL.labs.verbs = {
    title: 'Неправильные глаголы',
    icon: 'V₂',
    desc: 'Спринт: по инфинитиву и переводу впишите V2 и V3, ошибки повторяются',
    long: 'Тренажёр трёх форм неправильных глаголов английского языка: даётся инфинитив и перевод, нужно вписать Past Simple и Past Participle. Варианты вроде was/were и learnt/learned засчитываются, а глаголы с ошибками можно гонять отдельно.',
    subjectName: 'Английский язык',
    mount: mount,
    _verbs: VERBS,
    _accept: accept
  };
})();
