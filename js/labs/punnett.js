/* Лаборатория «Решётка Пеннета» — гаметы, решётка и расщепление для моно-, ди- и тригибридных скрещиваний, неполного доминирования и наследования, сцепленного с X-хромосомой. */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  KL.labs = KL.labs || {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function gcd(a, b) { while (b) { var t = a % b; a = b; b = t; } return a; }
  function gcdAll(arr) { return arr.reduce(function (g, x) { return gcd(g, x); }, 0) || 1; }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function isUp(c) { return c !== c.toLowerCase(); }
  function alleleSort(a, b) { return (isUp(a) ? 0 : 1) - (isUp(b) ? 0 : 1); }
  function pct(n, total) {
    var v = Math.round(n / total * 10000) / 100;
    return String(v).replace('.', ',');
  }
  function frac(n, total) { var g = gcd(n, total); return (n / g) + '/' + (total / g); }

  /* ---------- Разбор генотипа ---------- */
  var MOD = {
    'ᴬ': 'A', 'ᴮ': 'B', 'ᴰ': 'D', 'ᴱ': 'E', 'ᴳ': 'G', 'ᴴ': 'H', 'ᴵ': 'I', 'ᴶ': 'J', 'ᴷ': 'K', 'ᴸ': 'L', 'ᴹ': 'M', 'ᴺ': 'N', 'ᴼ': 'O', 'ᴾ': 'P', 'ᴿ': 'R', 'ᵀ': 'T', 'ᵁ': 'U', 'ᵂ': 'W',
    'ᵃ': 'a', 'ᵇ': 'b', 'ᶜ': 'c', 'ᵈ': 'd', 'ᵉ': 'e', 'ᶠ': 'f', 'ᵍ': 'g', 'ʰ': 'h', 'ⁱ': 'i', 'ʲ': 'j', 'ᵏ': 'k', 'ˡ': 'l', 'ᵐ': 'm', 'ⁿ': 'n', 'ᵒ': 'o', 'ᵖ': 'p', 'ʳ': 'r', 'ˢ': 's', 'ᵗ': 't', 'ᵘ': 'u', 'ᵛ': 'v', 'ʷ': 'w'
  };
  var CYR = { 'А': 'A', 'а': 'a', 'В': 'B', 'Е': 'E', 'е': 'e', 'К': 'K', 'к': 'k', 'М': 'M', 'Н': 'H', 'О': 'O', 'о': 'o', 'Р': 'P', 'р': 'p', 'С': 'C', 'с': 'c', 'Т': 'T', 'Х': 'X', 'х': 'x', 'у': 'y' };
  var SUPU = { A: 'ᴬ', B: 'ᴮ', D: 'ᴰ', E: 'ᴱ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', R: 'ᴿ', T: 'ᵀ', U: 'ᵁ', W: 'ᵂ' };
  var SUPL = { a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ' };
  function supChar(c) { return SUPU[c] || SUPL[c] || ('^' + c); }

  function parse(raw) {
    var s = String(raw || '').replace(/[\s^_,.;·-]/g, '');
    if (!s) return { error: 'пустое поле — впишите генотип, например Aa' };
    s = s.split('').map(function (c) { return MOD[c] || CYR[c] || c; }).join('');
    if (/\//.test(s)) return { error: 'запись со сцеплением (AB//ab) лаборатория не моделирует: гены считаются лежащими в разных хромосомах' };
    if (/[^A-Za-z]/.test(s)) return { error: 'используйте латинские буквы: A, a, B, b… (недопустимый символ «' + s.match(/[^A-Za-z]/)[0] + '»)' };
    var res = { genes: [], x: null, sex: null };
    var xi = s.indexOf('X');
    if (xi >= 0) {
      var m = s.slice(xi).match(/^X([A-WZa-wz])(?:X([A-WZa-wz])|(Y))/);
      if (!m) return { error: 'не удалось разобрать половые хромосомы. Пишите так: XᴴXʰ (или XHXh) для женского пола, XᴴY (или XHY) для мужского' };
      if (m[3]) { res.sex = 'm'; res.x = { L: m[1].toUpperCase(), al: [m[1]] }; }
      else {
        if (m[1].toUpperCase() !== m[2].toUpperCase()) return { error: 'в X-хромосомах аллели разных генов (' + m[1] + ' и ' + m[2] + '): у одного гена одна буква, например XᴴXʰ' };
        res.sex = 'f'; res.x = { L: m[1].toUpperCase(), al: [m[1], m[2]].sort(alleleSort) };
      }
      s = s.slice(0, xi) + s.slice(xi + m[0].length);
      if (/[XY]/.test(s)) return { error: 'X и Y встречаются лишний раз. Половые хромосомы записываются один раз: XᴴXʰ или XᴴY' };
    } else if (/Y/.test(s)) return { error: 'есть Y, но нет X-хромосомы. Мужской генотип записывается как XᴴY' };
    if (/[xy]/.test(s)) return { error: 'буквы x и y лучше не использовать для генов — их легко спутать с половыми хромосомами' };
    if (s.length % 2) return { error: 'у каждого гена два аллеля, поэтому букв должно быть чётное число (Aa, AaBb…)' };
    var seen = {};
    for (var i = 0; i < s.length; i += 2) {
      var a = s.charAt(i), b = s.charAt(i + 1);
      if (a.toUpperCase() !== b.toUpperCase()) return { error: '«' + a + b + '» — это аллели разных генов. Аллели одного гена обозначают одной буквой: ' + a.toUpperCase() + a.toUpperCase() + ', ' + a.toUpperCase() + a.toLowerCase() + ' или ' + a.toLowerCase() + a.toLowerCase() };
      var L = a.toUpperCase();
      if (seen[L]) return { error: 'ген ' + L + ' записан дважды' };
      seen[L] = 1;
      res.genes.push({ L: L, al: [a, b].sort(alleleSort) });
    }
    if (res.x && seen[res.x.L]) return { error: 'буква ' + res.x.L + ' занята и аутосомным, и X-сцепленным геном — выберите разные буквы' };
    var total = res.genes.length + (res.x ? 1 : 0);
    if (!total) return { error: 'не найдено ни одного гена' };
    if (total > 3) return { error: 'не больше трёх генов (решётка до 8 × 8)' };
    return res;
  }
  function genoText(p) {
    var t = p.genes.map(function (g) { return g.al.join(''); }).join('');
    if (p.x) t += p.sex === 'f' ? 'X' + supChar(p.x.al[0]) + 'X' + supChar(p.x.al[1]) : 'X' + supChar(p.x.al[0]) + 'Y';
    return t;
  }
  function xHtml(c) { return c === 'Y' ? 'Y' : 'X<sup>' + esc(c) + '</sup>'; }
  function genoHtml(p) {
    var t = p.genes.map(function (g) { return g.al.join(''); }).join('');
    if (p.x) t += p.sex === 'f' ? xHtml(p.x.al[0]) + xHtml(p.x.al[1]) : xHtml(p.x.al[0]) + 'Y';
    return t;
  }

  /* ---------- Скрещивание ---------- */
  function uniq(a) { var o = []; a.forEach(function (x) { if (o.indexOf(x) < 0) o.push(x); }); return o; }
  function gametes(p, order) {
    /* order — порядок генов: [{L, x:bool}] */
    var lists = order.map(function (o) {
      if (o.x) return p.sex === 'f' ? uniq(p.x.al) : [p.x.al[0], 'Y'];
      var g = p.genes.filter(function (gg) { return gg.L === o.L; })[0];
      return uniq(g.al);
    });
    var out = [[]];
    lists.forEach(function (l) {
      var nx = [];
      out.forEach(function (pre) { l.forEach(function (a) { nx.push(pre.concat([a])); }); });
      out = nx;
    });
    return out;
  }
  function gameteHtml(gm, order) {
    return gm.map(function (a, i) { return order[i].x ? xHtml(a) : esc(a); }).join('');
  }
  function cross(p1, p2, dom, traits) {
    var order = p1.genes.map(function (g) { return { L: g.L, x: false }; });
    if (p1.x) order.push({ L: p1.x.L, x: true });
    var g1 = gametes(p1, order), g2 = gametes(p2, order);
    var cells = [], N = g1.length * g2.length;
    g1.forEach(function (a) {
      var row = [];
      g2.forEach(function (b) {
        var gk = [], ghtml = '', grank = [], pk = [], prank = [], pdesc = [], phtml = [], sex = null;
        order.forEach(function (o, i) {
          var x = a[i], y = b[i], tr = traits && traits[o.L];
          if (!o.x) {
            var pr = [x, y].sort(alleleSort), key = pr.join('');
            gk.push(key); ghtml += esc(key);
            var nUp = (isUp(pr[0]) ? 1 : 0) + (isUp(pr[1]) ? 1 : 0);
            grank.push(2 - nUp);
            if (dom[o.L] === 'inc') {
              pk.push(key); prank.push(2 - nUp); phtml.push(esc(key));
              pdesc.push(tr ? (nUp === 2 ? tr.dom : nUp === 1 ? (tr.mid || 'промежуточный') : tr.rec) : (nUp === 1 ? 'промежуточный по ' + o.L : (nUp === 2 ? 'доминантный' : 'рецессивный') + ' по ' + o.L));
            } else {
              var d = nUp > 0;
              pk.push(d ? o.L + '_' : o.L.toLowerCase() + o.L.toLowerCase()); prank.push(d ? 0 : 1);
              phtml.push(d ? esc(o.L) + '_' : esc(o.L.toLowerCase() + o.L.toLowerCase()));
              pdesc.push(tr ? (d ? tr.dom : tr.rec) : (d ? 'доминантный' : 'рецессивный') + ' по ' + o.L);
            }
          } else {
            var male = x === 'Y' || y === 'Y';
            if (male) {
              var al = x === 'Y' ? y : x;
              sex = 'm';
              gk.push('m' + al); ghtml += xHtml(al) + 'Y'; grank.push(3 + (isUp(al) ? 0 : 1));
              var dm = isUp(al);
              pk.push('m' + (dm ? 'D' : 'R')); prank.push(dm ? 2 : 3);
              phtml.push('♂ ' + xHtml(al) + 'Y');
              pdesc.push('сын: ' + (tr ? (dm ? tr.dom : tr.rec) : (dm ? 'доминантный' : 'рецессивный') + ' признак'));
            } else {
              sex = 'f';
              var fp = [x, y].sort(alleleSort), up = (isUp(fp[0]) ? 1 : 0) + (isUp(fp[1]) ? 1 : 0);
              gk.push('f' + fp.join('')); ghtml += xHtml(fp[0]) + xHtml(fp[1]); grank.push(2 - up);
              var df = up > 0;
              pk.push('f' + (df ? 'D' : 'R')); prank.push(df ? 0 : 1);
              phtml.push('♀ ' + (df ? xHtml(o.L) + 'X<sup>–</sup>' : xHtml(o.L.toLowerCase()) + xHtml(o.L.toLowerCase())));
              pdesc.push('дочь: ' + (tr ? (df ? tr.dom : tr.rec) : (df ? 'доминантный' : 'рецессивный') + ' признак'));
            }
          }
        });
        row.push({ gk: gk.join('|'), ghtml: ghtml, grank: grank, pk: pk.join('|'), prank: prank, phtml: phtml.join(' '), pdesc: pdesc.join(', '), sex: sex });
      });
      cells.push(row);
    });
    function tally(field, rankF, htmlF) {
      var map = {}, list = [];
      cells.forEach(function (r) {
        r.forEach(function (c) {
          if (!map[c[field]]) { map[c[field]] = { key: c[field], n: 0, rank: c[rankF], html: c[htmlF], desc: c.pdesc, sex: c.sex, sexN: { f: 0, m: 0 } }; list.push(map[c[field]]); }
          map[c[field]].n++;
        });
      });
      list.sort(function (a, b) {
        for (var i = 0; i < a.rank.length; i++) if (a.rank[i] !== b.rank[i]) return a.rank[i] - b.rank[i];
        return 0;
      });
      /* для X-сцепленного: дочери, затем сыновья */
      if (order.length && order[order.length - 1].x) {
        list.sort(function (a, b) {
          var sa = a.sex === 'm' ? 1 : 0, sb = b.sex === 'm' ? 1 : 0;
          if (sa !== sb) return sa - sb;
          for (var i = 0; i < a.rank.length; i++) if (a.rank[i] !== b.rank[i]) return a.rank[i] - b.rank[i];
          return 0;
        });
      }
      return list;
    }
    var geno = tally('gk', 'grank', 'ghtml'), pheno = tally('pk', 'prank', 'phtml');
    return { order: order, g1: g1, g2: g2, cells: cells, N: N, geno: geno, pheno: pheno, xLinked: !!p1.x };
  }
  function ratioStr(list) {
    var g = gcdAll(list.map(function (c) { return c.n; }));
    return list.map(function (c) { return c.n / g; }).join(':');
  }
  function parseRatio(s) {
    var t = String(s || '').replace(/\s+/g, '').replace(/[—–-]/g, ':');
    if (/^(100%?|всё|все|1)$/i.test(t)) return [1];
    if (!/^\d+(:\d+)*$/.test(t)) return null;
    var a = t.split(':').map(Number);
    if (a.some(function (x) { return !x; })) return null;
    var g = gcdAll(a);
    return a.map(function (x) { return x / g; });
  }
  function sameMultiset(a, b) {
    if (a.length !== b.length) return false;
    a = a.slice().sort(function (x, y) { return x - y; }); b = b.slice().sort(function (x, y) { return x - y; });
    for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }
  function parseProb(s) {
    var t = String(s || '').replace(/\s+/g, '').replace('%', '').replace(',', '.');
    var m = t.match(/^(\d+)\/(\d+)$/);
    if (m) return +m[2] ? (+m[1] / +m[2]) * 100 : null;
    if (!/^\d+(\.\d+)?$/.test(t)) return null;
    var v = parseFloat(t);
    return v;
  }

  /* ---------- Пресеты и задачи ---------- */
  var PEA = { A: { dom: 'жёлтые семена', rec: 'зелёные семена' }, B: { dom: 'гладкие семена', rec: 'морщинистые семена' } };
  var MIRAB = { A: { dom: 'красные цветки', mid: 'розовые цветки', rec: 'белые цветки' } };
  var HEMO = { H: { dom: 'норма', rec: 'гемофилия' } };
  var DALT = { D: { dom: 'норма', rec: 'дальтонизм' } };
  var PRESETS = [
    { n: 'Моногибридное', p1: 'Aa', p2: 'Aa', dom: {}, tr: PEA, note: 'Закон расщепления: 3:1 по фенотипу, 1:2:1 по генотипу.' },
    { n: 'Анализирующее', p1: 'Aa', p2: 'aa', dom: {}, tr: PEA, note: 'Особь с доминантным фенотипом скрещивают с рецессивной гомозиготой aa. Расщепление 1:1 означает, что она гетерозиготна.' },
    { n: 'Дигибридное', p1: 'AaBb', p2: 'AaBb', dom: {}, tr: PEA, note: 'Закон независимого наследования: 9:3:3:1 по фенотипу.' },
    { n: 'Неполное доминирование', p1: 'Aa', p2: 'Aa', dom: { A: 'inc' }, tr: MIRAB, note: 'Ночная красавица: гетерозигота Aa розовая, расщепление по фенотипу совпадает с генотипом — 1:2:1.' },
    { n: 'Гемофилия', p1: 'XᴴXʰ', p2: 'XᴴY', dom: {}, tr: HEMO, note: 'Мать — носительница, отец здоров: все дочери здоровы (половина — носительницы), половина сыновей больна.' },
    { n: 'Дальтонизм', p1: 'XᴰXᵈ', p2: 'XᵈY', dom: {}, tr: DALT, note: 'Мать — носительница, отец — дальтоник: и у дочерей, и у сыновей вероятность дальтонизма 50%.' },
    { n: 'Аутосома + X', p1: 'AaXᴴXʰ', p2: 'aaXᴴY', dom: {}, tr: { A: { dom: 'тёмные волосы', rec: 'светлые волосы' }, H: HEMO.H }, note: 'Два гена в разных хромосомах: аутосомный и сцепленный с X. Типовая задача линии 28 ЕГЭ.' }
  ];
  var TASKS = [
    { p1: 'Aa', p2: 'Aa', dom: {}, tr: PEA, who: 'растения гороха' },
    { p1: 'Aa', p2: 'aa', dom: {}, tr: PEA, who: 'растения гороха' },
    { p1: 'AA', p2: 'aa', dom: {}, tr: PEA, who: 'растения гороха' },
    { p1: 'AA', p2: 'Aa', dom: {}, tr: PEA, who: 'растения гороха' },
    { p1: 'Aa', p2: 'Aa', dom: {}, tr: { A: { dom: 'чёрная шерсть', rec: 'белая шерсть' } }, who: 'морских свинок' },
    { p1: 'Aa', p2: 'Aa', dom: { A: 'inc' }, tr: MIRAB, who: 'растения ночной красавицы' },
    { p1: 'Aa', p2: 'aa', dom: { A: 'inc' }, tr: MIRAB, who: 'растения ночной красавицы' },
    { p1: 'AA', p2: 'Aa', dom: { A: 'inc' }, tr: MIRAB, who: 'растения ночной красавицы' },
    { p1: 'AaBb', p2: 'AaBb', dom: {}, tr: PEA, who: 'растения гороха' },
    { p1: 'AaBb', p2: 'aabb', dom: {}, tr: PEA, who: 'растения гороха' },
    { p1: 'AaBb', p2: 'Aabb', dom: {}, tr: PEA, who: 'растения гороха' },
    { p1: 'AaBb', p2: 'aaBb', dom: {}, tr: PEA, who: 'растения гороха' },
    { p1: 'AABb', p2: 'aabb', dom: {}, tr: PEA, who: 'растения гороха' },
    { p1: 'AaBB', p2: 'aaBb', dom: {}, tr: PEA, who: 'растения гороха' },
    { p1: 'XᴴXʰ', p2: 'XᴴY', dom: {}, tr: HEMO, who: 'людей (мать × отец)' },
    { p1: 'XᴴXʰ', p2: 'XʰY', dom: {}, tr: HEMO, who: 'людей (мать × отец)' },
    { p1: 'XʰXʰ', p2: 'XᴴY', dom: {}, tr: HEMO, who: 'людей (мать × отец)' },
    { p1: 'XᴰXᵈ', p2: 'XᴰY', dom: {}, tr: DALT, who: 'людей (мать × отец)' },
    { p1: 'XᴰXᴰ', p2: 'XᵈY', dom: {}, tr: DALT, who: 'людей (мать × отец)' }
  ];
  function traitLine(tr, dom) {
    return Object.keys(tr).map(function (L) {
      var t = tr[L], l = L.toLowerCase();
      if (dom[L] === 'inc') return L + L + ' — ' + t.dom + ', ' + L + l + ' — ' + t.mid + ', ' + l + l + ' — ' + t.rec;
      return L + ' — ' + t.dom + ', ' + l + ' — ' + t.rec;
    }).join('; ');
  }

  /* ---------- Стили ---------- */
  function injectCSS() {
    if (document.getElementById('lab-punnett-css')) return;
    var st = document.createElement('style');
    st.id = 'lab-punnett-css';
    st.textContent = [
      '.lb-pn{display:flex;flex-direction:column;gap:12px;min-width:0}',
      '.lb-pn [hidden]{display:none!important}',
      '.lb-pn-presets{display:flex;flex-wrap:wrap;gap:6px}',
      '.lb-pn-presets .btn[aria-pressed="true"]{border-color:var(--ink);color:var(--ink);background:var(--ink-soft)}',
      '.lb-pn-in{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end}',
      '.lb-pn-in label{flex:0 1 190px}',
      '.lb-pn-in input{width:100%;font-size:17px!important;letter-spacing:.03em}',
      '.lb-pn-in input.bad{border-color:var(--red)!important}',
      '.lb-pn-x{font:700 20px var(--f-mono);color:var(--muted);padding-bottom:6px}',
      '.lb-pn-err{color:var(--red);font-size:14px;min-height:0}',
      '.lb-pn-err:empty{display:none}',
      '.lb-pn-dom{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;font-size:14px;color:var(--muted)}',
      '.lb-pn-dom .seg button{font-size:13px}',
      '.lb-pn-p{font:600 16px var(--f-mono);line-height:1.6}',
      '.lb-pn-p .muted{font-family:var(--f-body);font-weight:400;font-size:14px}',
      '.lb-pn-gam{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;font-size:14px;color:var(--muted)}',
      '.lb-pn-gam .chip{font-family:var(--f-mono);font-size:14px;color:var(--text)}',
      '.lb-pn-scroll{overflow-x:auto;max-width:100%;padding:2px}',
      '.lb-pn .punnett{margin:0}',
      '.lb-pn .punnett th,.lb-pn .punnett td{min-width:58px;width:auto;padding:4px 7px;white-space:nowrap;transition:opacity .15s}',
      '.lb-pn .punnett td{background:color-mix(in srgb,var(--pc,transparent) 22%,var(--sheet))}',
      '.lb-pn .punnett th.corner{font:600 12px var(--f-body);color:var(--muted);background:var(--sheet)}',
      '.lb-pn .punnett.focus td:not(.on){opacity:.25}',
      '.lb-pn .punnett sup,.lb-pn-p sup,.lb-pn-res sup,.lb-pn-gam sup{font-size:.68em}',
      '.lb-pn-res{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}',
      '.lb-pn-box{border:1px solid var(--line);border-radius:8px;padding:10px 12px;min-width:0}',
      '.lb-pn-box h4{margin:0 0 6px;font-size:14px;font-weight:600}',
      '.lb-pn-box .big{font:700 20px var(--f-mono);color:var(--ink);margin-bottom:6px;word-break:break-word}',
      '.lb-pn-rows{display:flex;flex-direction:column;gap:2px}',
      '.lb-pn-row{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;padding:3px 6px;border-radius:6px;border:0;background:none;text-align:left;font:inherit;color:inherit;cursor:default}',
      '.lb-pn-row:hover,.lb-pn-row:focus-visible{background:var(--sheet-2)}',
      '.lb-pn-row i{width:12px;height:12px;border-radius:3px;display:inline-block}',
      '.lb-pn-row .g{font-family:var(--f-mono);font-weight:600}',
      '.lb-pn-row .d{font-size:13px;color:var(--muted);display:block;font-family:var(--f-body);font-weight:400}',
      '.lb-pn-row .v{font:500 13px var(--f-mono);color:var(--muted);text-align:right;white-space:nowrap}',
      '.lb-pn-task{border:1.5px solid var(--ink);border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:10px}',
      '.lb-pn-task p{margin:0;line-height:1.5}',
      '.lb-pn-fb{font-size:14.5px}.lb-pn-fb.ok{color:var(--ok)}.lb-pn-fb.bad{color:var(--red)}',
      '.lb-pn-help summary{cursor:pointer;color:var(--ink);font-weight:600;font-size:14px}',
      '.lb-pn-help ul{margin:6px 0 0;padding-left:20px;font-size:14px;line-height:1.55;color:var(--text)}',
      '@media (max-width:520px){.lb-pn-in label{flex:1 1 100%}.lb-pn-x{display:none}}'
    ].join('\n');
    document.head.appendChild(st);
  }
  function palette(i, n) {
    var hues = [215, 140, 30, 350, 275, 185, 55, 320, 95, 0, 250, 160];
    if (n > hues.length) return 'hsl(' + Math.round(i * 360 / n) + ',65%,50%)';
    return 'hsl(' + hues[i] + ',65%,50%)';
  }

  /* ---------- Монтирование ---------- */
  function mount(root) {
    injectCSS();
    var st = { p1: 'Aa', p2: 'aa', dom: {}, tr: PEA, preset: -1, task: null, answered: false, score: 0, total: 0 };
    root.innerHTML =
      '<div class="lb-pn">' +
      '<div class="lb-pn-presets" data-r="presets" role="group" aria-label="Готовые скрещивания"></div>' +
      '<div class="lb-pn-in">' +
      '<label>Родитель 1 (♀)<input type="text" data-r="p1" autocomplete="off" spellcheck="false" autocapitalize="off" aria-describedby=""></label>' +
      '<span class="lb-pn-x" aria-hidden="true">×</span>' +
      '<label>Родитель 2 (♂)<input type="text" data-r="p2" autocomplete="off" spellcheck="false" autocapitalize="off"></label>' +
      '<button type="button" class="btn sm" data-r="swap" title="Поменять родителей местами">⇄ Поменять</button>' +
      '<button type="button" class="btn sm primary" data-r="task">Задача</button>' +
      '</div>' +
      '<div class="lb-pn-err" data-r="err" role="alert"></div>' +
      '<div class="lb-pn-dom" data-r="dom"></div>' +
      '<div class="lb-pn-task" data-r="taskbox" hidden></div>' +
      '<div data-r="out" style="display:flex;flex-direction:column;gap:12px;min-width:0"></div>' +
      '<details class="lb-pn-help"><summary>Как записывать генотипы</summary><ul>' +
      '<li>Один ген — одна буква: заглавная — доминантный аллель, строчная — рецессивный. Примеры: <b class="mono">Aa</b>, <b class="mono">AaBb</b>, <b class="mono">AABbCc</b> (до трёх генов).</li>' +
      '<li>Сцепленный с X ген: <b class="mono">XᴴXʰ</b> — женщина, <b class="mono">XᴴY</b> — мужчина. С обычной клавиатуры можно набрать <b class="mono">XHXh</b> и <b class="mono">XHY</b>.</li>' +
      '<li>Можно сочетать: <b class="mono">AaXᴴXʰ × aaXᴴY</b>. Гены считаются лежащими в разных хромосомах (без сцепления и кроссинговера).</li>' +
      '<li>Наведите на строку расщепления — в решётке подсветятся соответствующие клетки.</li>' +
      '</ul></details>' +
      '</div>';
    function R(n) { return root.querySelector('[data-r="' + n + '"]'); }
    var in1 = R('p1'), in2 = R('p2'), err = R('err'), out = R('out'), domBox = R('dom'), taskBox = R('taskbox');
    in1.value = st.p1; in2.value = st.p2;

    R('presets').innerHTML = PRESETS.map(function (p, i) {
      return '<button type="button" class="btn sm" data-pre="' + i + '" aria-pressed="false">' + esc(p.n) + '</button>';
    }).join('');
    R('presets').addEventListener('click', function (e) {
      var b = e.target.closest('[data-pre]'); if (!b) return;
      var p = PRESETS[+b.dataset.pre];
      endTask();
      st.preset = +b.dataset.pre; st.dom = JSON.parse(JSON.stringify(p.dom)); st.tr = p.tr;
      in1.value = p.p1; in2.value = p.p2;
      update();
    });
    function markPreset() {
      Array.prototype.forEach.call(root.querySelectorAll('[data-pre]'), function (b) {
        b.setAttribute('aria-pressed', String(+b.dataset.pre === st.preset));
      });
    }
    var timer = null;
    function onInput() {
      st.preset = -1; endTask();
      clearTimeout(timer); timer = setTimeout(update, 180);
    }
    in1.addEventListener('input', onInput); in2.addEventListener('input', onInput);
    R('swap').addEventListener('click', function () { var t = in1.value; in1.value = in2.value; in2.value = t; endTask(); update(); });
    R('task').addEventListener('click', newTask);

    function validate() {
      var a = parse(in1.value), b = parse(in2.value), msgs = [];
      in1.classList.toggle('bad', !!a.error); in2.classList.toggle('bad', !!b.error);
      if (a.error) msgs.push('Родитель 1: ' + a.error + '.');
      if (b.error) msgs.push('Родитель 2: ' + b.error + '.');
      if (msgs.length) return { error: msgs.join(' ') };
      var la = a.genes.map(function (g) { return g.L; }), lb = b.genes.map(function (g) { return g.L; });
      var sa = la.slice().sort().join(''), sb = lb.slice().sort().join('');
      if (sa !== sb) return { error: 'У родителей должны быть одни и те же гены: у первого ' + (la.join(', ') || 'нет аутосомных') + ', у второго ' + (lb.join(', ') || 'нет аутосомных') + '.' };
      if (!!a.x !== !!b.x) return { error: 'X-сцепленный ген записан только у одного родителя. Запишите половые хромосомы обоим: XᴴXʰ × XᴴY.' };
      if (a.x) {
        if (a.x.L !== b.x.L) return { error: 'В X-хромосомах у родителей разные гены (' + a.x.L + ' и ' + b.x.L + ').' };
        if (a.sex === b.sex) return { error: a.sex === 'f' ? 'Оба родителя женского пола (XX). У одного должен быть генотип вида XᴴY.' : 'Оба родителя мужского пола (XY). У одного должен быть генотип вида XᴴXʰ.' };
      }
      /* порядок генов второго родителя — как у первого */
      b.genes.sort(function (x, y) { return la.indexOf(x.L) - la.indexOf(y.L); });
      return { a: a, b: b };
    }

    function renderDom(v) {
      if (!v.a || !v.a.genes.length) { domBox.innerHTML = ''; return; }
      domBox.innerHTML = '<span>Тип доминирования:</span>' + v.a.genes.map(function (g) {
        var inc = st.dom[g.L] === 'inc';
        return '<span style="display:inline-flex;gap:6px;align-items:center"><b class="mono" style="color:var(--text)">' + g.L + '</b><span class="seg" role="group" aria-label="Доминирование по гену ' + g.L + '"><button type="button" data-dg="' + g.L + '" data-dv="full" class="' + (inc ? '' : 'on') + '" aria-pressed="' + !inc + '">полное</button><button type="button" data-dg="' + g.L + '" data-dv="inc" class="' + (inc ? 'on' : '') + '" aria-pressed="' + inc + '">неполное</button></span></span>';
      }).join('') + (v.a.x ? '<span>X-сцепленный ген ' + v.a.x.L + ': полное доминирование</span>' : '');
    }
    domBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-dg]'); if (!b) return;
      st.dom[b.dataset.dg] = b.dataset.dv;
      update();
      var nb = domBox.querySelector('[data-dg="' + b.dataset.dg + '"][data-dv="' + b.dataset.dv + '"]'); if (nb) nb.focus();
    });

    var last = null;
    function update() {
      markPreset();
      var v = validate();
      err.textContent = v.error || '';
      renderDom(v);
      if (v.error) { out.innerHTML = ''; last = null; return; }
      var tr = st.tr;
      if (tr) {
        /* описания признаков оставляем, только если все гены ими покрыты */
        var letters = v.a.genes.map(function (g) { return g.L; }).concat(v.a.x ? [v.a.x.L] : []);
        if (!letters.every(function (L) { return tr[L] && (st.dom[L] !== 'inc' || tr[L].mid); })) tr = null;
      }
      var r = cross(v.a, v.b, st.dom, tr);
      last = { v: v, r: r, tr: tr };
      if (st.task && !st.answered) { out.innerHTML = ''; return; }
      renderOut(v, r, tr);
    }

    function row(c, total, color, kind, extraN) {
      var g = '<span class="g">' + (c.n) + ' ' + c.html + (kind === 'ph' ? '<span class="d">' + esc(c.desc) + '</span>' : '') + '</span>';
      return '<button type="button" class="lb-pn-row" data-k="' + kind + '" data-key="' + esc(c.key) + '"><i style="background:' + color + '"></i>' + g +
        '<span class="v">' + frac(c.n, extraN || total) + ' · ' + pct(c.n, extraN || total) + '%</span></button>';
    }
    function renderOut(v, r, tr) {
      var sexA = v.a.sex === 'm' ? '♂' : '♀', sexB = v.b.sex === 'f' ? '♀' : '♂';
      if (!v.a.x) { sexA = '♀'; sexB = '♂'; }
      var phColor = {};
      r.pheno.forEach(function (c, i) { phColor[c.key] = palette(i, r.pheno.length); });
      var h = '<div class="lb-pn-p">P: ' + sexA + ' ' + genoHtml(v.a) + ' × ' + sexB + ' ' + genoHtml(v.b) +
        (tr ? ' <span class="muted">(' + esc(traitLine(tr, st.dom)) + ')</span>' : '') + '</div>';
      h += '<div class="lb-pn-gam"><span>Гаметы ' + sexA + ': ' + r.g1.map(function (g) { return '<span class="chip">' + gameteHtml(g, r.order) + '</span>'; }).join(' ') + '</span>' +
        '<span>Гаметы ' + sexB + ': ' + r.g2.map(function (g) { return '<span class="chip">' + gameteHtml(g, r.order) + '</span>'; }).join(' ') + '</span>' +
        '<span>' + r.g1.length + ' × ' + r.g2.length + ' = ' + r.N + ' равновероятных сочетаний</span></div>';
      h += '<div class="lb-pn-scroll"><table class="punnett" data-r="grid"><caption class="sr">Решётка Пеннета: по строкам гаметы родителя ' + sexA + ', по столбцам — ' + sexB + '</caption><tr><th class="corner" scope="col">' + sexA + ' \\ ' + sexB + '</th>' +
        r.g2.map(function (g) { return '<th scope="col">' + gameteHtml(g, r.order) + '</th>'; }).join('') + '</tr>';
      r.cells.forEach(function (rw, i) {
        h += '<tr><th scope="row">' + gameteHtml(r.g1[i], r.order) + '</th>' + rw.map(function (c) {
          return '<td style="--pc:' + phColor[c.pk] + '" data-gk="' + esc(c.gk) + '" data-pk="' + esc(c.pk) + '" title="' + esc(c.pdesc) + '">' + c.ghtml + '</td>';
        }).join('') + '</tr>';
      });
      h += '</table></div>';
      h += '<div class="lb-pn-res">';
      h += '<div class="lb-pn-box"><h4>По фенотипу</h4><div class="big">' + ratioStr(r.pheno) + '</div><div class="lb-pn-rows">' +
        r.pheno.map(function (c) { return row(c, r.N, phColor[c.key], 'ph'); }).join('') + '</div></div>';
      h += '<div class="lb-pn-box"><h4>По генотипу</h4><div class="big">' + ratioStr(r.geno) + '</div><div class="lb-pn-rows">' +
        r.geno.map(function (c) { return row(c, r.N, 'var(--grid-strong)', 'gt'); }).join('') + '</div></div>';
      if (r.xLinked) {
        ['f', 'm'].forEach(function (sx) {
          var ph = r.pheno.filter(function (c) { return c.sex === sx; }), gt = r.geno.filter(function (c) { return c.sex === sx; });
          var n = ph.reduce(function (s, c) { return s + c.n; }, 0);
          if (!n) return;
          h += '<div class="lb-pn-box"><h4>' + (sx === 'f' ? 'Дочери ♀' : 'Сыновья ♂') + ' <span class="muted" style="font-weight:400">(' + pct(n, r.N) + '% потомства; доли — среди ' + (sx === 'f' ? 'дочерей' : 'сыновей') + ')</span></h4>' +
            '<div class="lb-pn-rows">' + ph.map(function (c) { return row(c, r.N, phColor[c.key], 'ph', n); }).join('') + '</div>' +
            '<div class="lb-pn-rows" style="margin-top:6px;border-top:1px dashed var(--line);padding-top:6px">' + gt.map(function (c) { return row(c, r.N, 'var(--grid-strong)', 'gt', n); }).join('') + '</div></div>';
        });
      }
      h += '</div>';
      var pre = PRESETS[st.preset];
      if (pre && pre.note) h += '<p class="lab-note">' + esc(pre.note) + '</p>';
      out.innerHTML = h;
      bindHover();
    }
    function bindHover() {
      var tbl = out.querySelector('[data-r="grid"]'); if (!tbl) return;
      function on(kind, key) {
        tbl.classList.add('focus');
        Array.prototype.forEach.call(tbl.querySelectorAll('td'), function (td) {
          td.classList.toggle('on', td.getAttribute(kind === 'ph' ? 'data-pk' : 'data-gk') === key);
        });
      }
      function off() { tbl.classList.remove('focus'); }
      Array.prototype.forEach.call(out.querySelectorAll('.lb-pn-row'), function (b) {
        b.addEventListener('mouseenter', function () { on(b.dataset.k, b.dataset.key); });
        b.addEventListener('focus', function () { on(b.dataset.k, b.dataset.key); });
        b.addEventListener('mouseleave', off);
        b.addEventListener('blur', off);
        b.addEventListener('click', function () { on(b.dataset.k, b.dataset.key); });
      });
    }

    /* ---------- Режим «Задача» ---------- */
    function newTask() {
      var t = pick(TASKS);
      if (Math.random() < 0.5) {
        /* родители могут идти в любом порядке, но в X-задачах мать первой */
        if (!/X/.test(t.p1)) t = { p1: t.p2, p2: t.p1, dom: t.dom, tr: t.tr, who: t.who };
      }
      st.preset = -1; st.dom = JSON.parse(JSON.stringify(t.dom)); st.tr = t.tr;
      in1.value = t.p1; in2.value = t.p2;
      st.task = { t: t }; st.answered = false;
      update();
      if (!last) { endTask(); return; }
      var r = last.r, kinds = ['ph', 'ph', 'prob'];
      if (r.geno.length <= 9 && !r.xLinked) kinds.push('gt');
      var kind = pick(kinds), q, cls = null;
      if (kind === 'prob') {
        cls = pick(r.pheno);
        q = 'Какова вероятность (в %) появления в потомстве особи с фенотипом «' + esc(cls.desc) + '»?';
      } else if (kind === 'ph') q = 'Каково расщепление в потомстве <b>по фенотипу</b>? Запишите отношение через двоеточие, например 3:1.';
      else q = 'Каково расщепление в потомстве <b>по генотипу</b>? Запишите отношение через двоеточие, например 1:2:1.';
      st.task.kind = kind; st.task.cls = cls;
      var sexA = last.v.a.x ? (last.v.a.sex === 'f' ? '♀ ' : '♂ ') : '', sexB = last.v.b.x ? (last.v.b.sex === 'f' ? '♀ ' : '♂ ') : '';
      taskBox.hidden = false;
      taskBox.innerHTML = '<div class="lab-row" style="justify-content:space-between"><b>Задача</b><span class="score-row" data-r="score"></span></div>' +
        '<p>Скрещивают ' + esc(t.who) + ': ' + sexA + '<b class="mono">' + genoHtml(last.v.a) + '</b> × ' + sexB + '<b class="mono">' + genoHtml(last.v.b) + '</b>' +
        (last.tr ? ' (' + esc(traitLine(last.tr, st.dom)) + ')' : '') + '. ' + (st.dom.A === 'inc' ? 'Доминирование неполное. ' : '') + '</p><p>' + q + '</p>' +
        '<div class="lab-row"><input type="text" data-r="ans" autocomplete="off" spellcheck="false" aria-label="Ваш ответ" placeholder="' + (kind === 'prob' ? 'например 25' : 'например 3:1') + '" style="width:170px"><button type="button" class="btn primary sm" data-r="check">Проверить</button><button type="button" class="btn sm" data-r="next">Новая задача</button><button type="button" class="btn sm ghost" data-r="quit">Выйти</button></div>' +
        '<div class="lb-pn-fb" data-r="fb" role="status"></div>';
      renderScore();
      var ans = R('ans');
      R('check').addEventListener('click', check);
      ans.addEventListener('keydown', function (e) { if (e.key === 'Enter') { if (st.answered) newTask(); else check(); } });
      R('next').addEventListener('click', function () { newTask(); var a = R('ans'); if (a) a.focus(); });
      R('quit').addEventListener('click', function () { endTask(); update(); });
      ans.focus();
    }
    function renderScore() { var s = R('score'); if (s) s.innerHTML = '<span>Решено: <b>' + st.score + '</b> из <b>' + st.total + '</b></span>'; }
    function check() {
      if (!st.task || st.answered || !last) return;
      var ans = R('ans'), fb = R('fb'), r = last.r, ok, right, val = ans.value;
      if (!val.trim()) { fb.className = 'lb-pn-fb'; fb.textContent = 'Сначала впишите ответ.'; return; }
      if (st.task.kind === 'prob') {
        var p = parseProb(val);
        if (p === null) { fb.className = 'lb-pn-fb'; fb.textContent = 'Нужно число процентов (например 25 или 6,25) или дробь (1/4).'; return; }
        var exact = st.task.cls.n / r.N * 100;
        ok = Math.abs(p - exact) < 0.01;
        right = pct(st.task.cls.n, r.N) + '% (' + st.task.cls.n + ' из ' + r.N + ' клеток решётки)';
      } else {
        var u = parseRatio(val), list = st.task.kind === 'ph' ? r.pheno : r.geno;
        if (!u) { fb.className = 'lb-pn-fb'; fb.textContent = 'Запишите отношение целыми числами через двоеточие, например 1:2:1.'; return; }
        var g = gcdAll(list.map(function (c) { return c.n; }));
        ok = sameMultiset(u, list.map(function (c) { return c.n / g; }));
        right = ratioStr(list);
      }
      st.answered = true; st.total++; if (ok) st.score++;
      fb.className = 'lb-pn-fb ' + (ok ? 'ok' : 'bad');
      fb.innerHTML = ok ? '<b>Верно!</b> Проверьте себя по решётке ниже.' : '<b>Неверно.</b> Правильный ответ: ' + right + '. Разберите решётку ниже.';
      renderScore();
      renderOut(last.v, r, last.tr);
    }
    function endTask() {
      if (!st.task) return;
      st.task = null; st.answered = false;
      taskBox.hidden = true; taskBox.innerHTML = '';
    }

    update();
  }

  KL.labs.punnett = {
    title: 'Решётка Пеннета',
    icon: 'Aa',
    desc: 'Гаметы, решётка и расщепление: моно-, дигибридное и сцепленное с полом',
    long: 'Введите генотипы родителей (до трёх генов, в том числе сцепленный с X-хромосомой) — лаборатория выпишет гаметы, построит решётку Пеннета и посчитает расщепление по генотипу и фенотипу. В режиме «Задача» проверьте себя.',
    subjectName: 'Биология',
    mount: mount,
    _core: { parse: parse, cross: cross, ratioStr: ratioStr, parseRatio: parseRatio, parseProb: parseProb, genoText: genoText }
  };
})();
