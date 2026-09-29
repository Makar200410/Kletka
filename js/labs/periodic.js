/* Лаборатория «Таблица Менделеева» — все 118 элементов, карточка элемента, раскраски, поиск и тренировка к заданиям 1–3 ОГЭ и ЕГЭ. */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  KL.labs = KL.labs || {};

  /* ================= Данные =================
     символ | название | Ar (IUPAC, округлено до 5 значащих цифр; в скобках — массовое число самого устойчивого изотопа)
     | ЭО по Полингу (пусто — нет общепринятого значения) | массовое число основного изотопа
     (самого распространённого в природе; у радиоактивных элементов — самого устойчивого) */
  var RAW = [
    'H|Водород|1.008|2.20|1', 'He|Гелий|4.0026||4', 'Li|Литий|6.94|0.98|7', 'Be|Бериллий|9.0122|1.57|9',
    'B|Бор|10.81|2.04|11', 'C|Углерод|12.011|2.55|12', 'N|Азот|14.007|3.04|14', 'O|Кислород|15.999|3.44|16',
    'F|Фтор|18.998|3.98|19', 'Ne|Неон|20.180||20', 'Na|Натрий|22.990|0.93|23', 'Mg|Магний|24.305|1.31|24',
    'Al|Алюминий|26.982|1.61|27', 'Si|Кремний|28.085|1.90|28', 'P|Фосфор|30.974|2.19|31', 'S|Сера|32.06|2.58|32',
    'Cl|Хлор|35.45|3.16|35', 'Ar|Аргон|39.95||40', 'K|Калий|39.098|0.82|39', 'Ca|Кальций|40.078|1.00|40',
    'Sc|Скандий|44.956|1.36|45', 'Ti|Титан|47.867|1.54|48', 'V|Ванадий|50.942|1.63|51', 'Cr|Хром|51.996|1.66|52',
    'Mn|Марганец|54.938|1.55|55', 'Fe|Железо|55.845|1.83|56', 'Co|Кобальт|58.933|1.88|59', 'Ni|Никель|58.693|1.91|58',
    'Cu|Медь|63.546|1.90|63', 'Zn|Цинк|65.38|1.65|64', 'Ga|Галлий|69.723|1.81|69', 'Ge|Германий|72.630|2.01|74',
    'As|Мышьяк|74.922|2.18|75', 'Se|Селен|78.971|2.55|80', 'Br|Бром|79.904|2.96|79', 'Kr|Криптон|83.798|3.00|84',
    'Rb|Рубидий|85.468|0.82|85', 'Sr|Стронций|87.62|0.95|88', 'Y|Иттрий|88.906|1.22|89', 'Zr|Цирконий|91.224|1.33|90',
    'Nb|Ниобий|92.906|1.6|93', 'Mo|Молибден|95.95|2.16|98', 'Tc|Технеций|[97]|1.9|97', 'Ru|Рутений|101.07|2.2|102',
    'Rh|Родий|102.91|2.28|103', 'Pd|Палладий|106.42|2.20|106', 'Ag|Серебро|107.87|1.93|107', 'Cd|Кадмий|112.41|1.69|114',
    'In|Индий|114.82|1.78|115', 'Sn|Олово|118.71|1.96|120', 'Sb|Сурьма|121.76|2.05|121', 'Te|Теллур|127.60|2.1|130',
    'I|Иод|126.90|2.66|127', 'Xe|Ксенон|131.29|2.6|132', 'Cs|Цезий|132.91|0.79|133', 'Ba|Барий|137.33|0.89|138',
    'La|Лантан|138.91|1.10|139', 'Ce|Церий|140.12|1.12|140', 'Pr|Празеодим|140.91|1.13|141', 'Nd|Неодим|144.24|1.14|142',
    'Pm|Прометий|[145]||145', 'Sm|Самарий|150.36|1.17|152', 'Eu|Европий|151.96||153', 'Gd|Гадолиний|157.25|1.20|158',
    'Tb|Тербий|158.93|1.1|159', 'Dy|Диспрозий|162.50|1.22|164', 'Ho|Гольмий|164.93|1.23|165', 'Er|Эрбий|167.26|1.24|166',
    'Tm|Тулий|168.93|1.25|169', 'Yb|Иттербий|173.05||174', 'Lu|Лютеций|174.97|1.27|175', 'Hf|Гафний|178.49|1.3|180',
    'Ta|Тантал|180.95|1.5|181', 'W|Вольфрам|183.84|2.36|184', 'Re|Рений|186.21|1.9|187', 'Os|Осмий|190.23|2.2|192',
    'Ir|Иридий|192.22|2.20|193', 'Pt|Платина|195.08|2.28|195', 'Au|Золото|196.97|2.54|197', 'Hg|Ртуть|200.59|2.00|202',
    'Tl|Таллий|204.38|1.62|205', 'Pb|Свинец|207.2|1.87|208', 'Bi|Висмут|208.98|2.02|209', 'Po|Полоний|[209]|2.0|209',
    'At|Астат|[210]|2.2|210', 'Rn|Радон|[222]||222', 'Fr|Франций|[223]|0.7|223', 'Ra|Радий|[226]|0.9|226',
    'Ac|Актиний|[227]|1.1|227', 'Th|Торий|232.04|1.3|232', 'Pa|Протактиний|231.04|1.5|231', 'U|Уран|238.03|1.38|238',
    'Np|Нептуний|[237]|1.36|237', 'Pu|Плутоний|[244]|1.28|244', 'Am|Америций|[243]|1.3|243', 'Cm|Кюрий|[247]|1.28|247',
    'Bk|Берклий|[247]|1.3|247', 'Cf|Калифорний|[251]|1.3|251', 'Es|Эйнштейний|[252]|1.3|252', 'Fm|Фермий|[257]|1.3|257',
    'Md|Менделевий|[258]|1.3|258', 'No|Нобелий|[259]|1.3|259', 'Lr|Лоуренсий|[266]|1.3|266', 'Rf|Резерфордий|[267]||267',
    'Db|Дубний|[268]||268', 'Sg|Сиборгий|[267]||267', 'Bh|Борий|[270]||270', 'Hs|Хассий|[271]||271',
    'Mt|Мейтнерий|[278]||278', 'Ds|Дармштадтий|[281]||281', 'Rg|Рентгений|[282]||282', 'Cn|Коперниций|[285]||285',
    'Nh|Нихоний|[286]||286', 'Fl|Флеровий|[289]||289', 'Mc|Московий|[290]||290', 'Lv|Ливерморий|[293]||293',
    'Ts|Теннессин|[294]||294', 'Og|Оганесон|[294]||294'
  ];
  var ALIAS = { 53: 'йод' };
  var EN_NOTE = {
    82: 'Значение 1,87 — для свинца(II); для свинца(IV) Полинг приводит 2,33.',
    87: 'Оценка Полинга; по современным данным ЭО франция может быть чуть выше, чем у цезия.'
  };

  /* Электронные конфигурации: порядок заполнения по правилу Клечковского + экспериментальные исключения */
  var ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
  var CAP = { s: 2, p: 6, d: 10, f: 14 };
  var LORD = { s: 0, p: 1, d: 2, f: 3 };
  var EXC = {
    24: { '3d': 5, '4s': 1 }, 29: { '3d': 10, '4s': 1 },
    41: { '4d': 4, '5s': 1 }, 42: { '4d': 5, '5s': 1 }, 44: { '4d': 7, '5s': 1 }, 45: { '4d': 8, '5s': 1 },
    46: { '4d': 10, '5s': 0 }, 47: { '4d': 10, '5s': 1 },
    78: { '5d': 9, '6s': 1 }, 79: { '5d': 10, '6s': 1 },
    57: { '4f': 0, '5d': 1 }, 58: { '4f': 1, '5d': 1 }, 64: { '4f': 7, '5d': 1 },
    89: { '5f': 0, '6d': 1 }, 90: { '5f': 0, '6d': 2 }, 91: { '5f': 2, '6d': 1 }, 92: { '5f': 3, '6d': 1 },
    93: { '5f': 4, '6d': 1 }, 96: { '5f': 7, '6d': 1 }, 103: { '6d': 0, '7p': 1 }
  };
  var NOBLE = [2, 10, 18, 36, 54, 86];
  var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  var GROUP_LABEL = ['IA', 'IIA', 'IIIB', 'IVB', 'VB', 'VIB', 'VIIB', 'VIIIB', 'VIIIB', 'VIIIB', 'IB', 'IIB', 'IIIA', 'IVA', 'VA', 'VIA', 'VIIA', 'VIIIA'];

  var FAM = {
    alkali: { n: 'Щелочные металлы', one: 'щелочной металл', c: '#e03131', kind: 'metal' },
    alkearth: { n: 'Щёлочноземельные', one: 'щёлочноземельный металл', c: '#f59f00', kind: 'metal' },
    trans: { n: 'Переходные металлы', one: 'переходный металл', c: '#4263eb', kind: 'metal' },
    post: { n: 'Постпереходные металлы', one: 'постпереходный металл', c: '#1098ad', kind: 'metal' },
    metalloid: { n: 'Полуметаллы', one: 'полуметалл', c: '#82c91e', kind: 'metalloid' },
    nonmetal: { n: 'Неметаллы', one: 'неметалл', c: '#2b8a3e', kind: 'nonmetal' },
    halogen: { n: 'Галогены', one: 'галоген', c: '#d6336c', kind: 'nonmetal' },
    noble: { n: 'Благородные газы', one: 'благородный (инертный) газ', c: '#7950f2', kind: 'nonmetal' },
    lanth: { n: 'Лантаноиды', one: 'лантаноид', c: '#b0703c', kind: 'metal' },
    act: { n: 'Актиноиды', one: 'актиноид', c: '#6c7a89', kind: 'metal' }
  };
  var FAM_ORDER = ['alkali', 'alkearth', 'trans', 'post', 'metalloid', 'nonmetal', 'halogen', 'noble', 'lanth', 'act'];
  var BLOCK_C = { s: '#e03131', p: '#f59f00', d: '#4263eb', f: '#2b8a3e' };
  var KIND = {
    metal: { n: 'Металлы', c: '#4263eb' },
    metalloid: { n: 'Полуметаллы (амфотерные простые вещества)', c: '#f59f00' },
    nonmetal: { n: 'Неметаллы', c: '#2b8a3e' }
  };
  var OXIDE_TYPE = {
    3: 'основный', 11: 'основный', 19: 'основный', 37: 'основный', 55: 'основный', 87: 'основный',
    4: 'амфотерный', 12: 'основный', 20: 'основный', 38: 'основный', 56: 'основный', 88: 'основный',
    5: 'кислотный', 13: 'амфотерный', 31: 'амфотерный',
    6: 'кислотный', 14: 'кислотный', 32: 'амфотерный', 50: 'амфотерный', 82: 'амфотерный',
    7: 'кислотный', 15: 'кислотный', 33: 'кислотный', 16: 'кислотный', 34: 'кислотный', 52: 'кислотный', 17: 'кислотный'
  };
  var D_OX = {
    21: ['+3', 'Sc2O3'], 22: ['+2, +3, +4', 'TiO2'], 23: ['+2, +3, +4, +5', 'V2O5'], 24: ['+2, +3, +6', 'CrO3'],
    25: ['+2, +3, +4, +6, +7', 'Mn2O7'], 26: ['+2, +3 (+6 в ферратах)', 'Fe2O3'], 27: ['+2, +3', ''], 28: ['+2 (+3)', ''],
    29: ['+1, +2', 'CuO'], 30: ['+2', 'ZnO'], 39: ['+3', 'Y2O3'], 40: ['+4', 'ZrO2'], 42: ['+4, +6', 'MoO3'],
    47: ['+1', 'Ag2O'], 48: ['+2', 'CdO'], 74: ['+4, +6', 'WO3'], 78: ['+2, +4', ''], 79: ['+1, +3', ''], 80: ['+1, +2', 'HgO']
  };

  var SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUBD = '₀₁₂₃₄₅₆₇₈₉';
  function sup(n) { return String(n).replace(/\d/g, function (d) { return SUPD[+d]; }); }
  function chem(f) { return String(f).replace(/\d+/g, function (d) { return d.replace(/\d/g, function (x) { return SUBD[+x]; }); }); }
  function comma(s) { return String(s).replace('.', ',').replace(/^-/, '−'); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(s) { return String(s || '').toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' ').trim(); }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function position(z) {
    if (z === 1) return { p: 1, col: 1, row: 1 };
    if (z === 2) return { p: 1, col: 18, row: 1 };
    if (z <= 10) return { p: 2, col: z <= 4 ? z - 2 : z + 8, row: 2 };
    if (z <= 18) return { p: 3, col: z <= 12 ? z - 10 : z, row: 3 };
    if (z <= 36) return { p: 4, col: z - 18, row: 4 };
    if (z <= 54) return { p: 5, col: z - 36, row: 5 };
    if (z <= 86) {
      if (z <= 56) return { p: 6, col: z - 54, row: 6 };
      if (z <= 71) return { p: 6, col: 3 + (z - 57), row: 8, fgroup: true };
      return { p: 6, col: z - 68, row: 6 };
    }
    if (z <= 88) return { p: 7, col: z - 86, row: 7 };
    if (z <= 103) return { p: 7, col: 3 + (z - 89), row: 9, fgroup: true };
    return { p: 7, col: z - 100, row: 7 };
  }
  function family(z, g) {
    if ([3, 11, 19, 37, 55, 87].indexOf(z) >= 0) return 'alkali';
    if ([4, 12, 20, 38, 56, 88].indexOf(z) >= 0) return 'alkearth';
    if (z >= 57 && z <= 71) return 'lanth';
    if (z >= 89 && z <= 103) return 'act';
    if ([2, 10, 18, 36, 54, 86, 118].indexOf(z) >= 0) return 'noble';
    if ([9, 17, 35, 53, 85, 117].indexOf(z) >= 0) return 'halogen';
    if ([1, 6, 7, 8, 15, 16, 34].indexOf(z) >= 0) return 'nonmetal';
    if ([5, 14, 32, 33, 51, 52].indexOf(z) >= 0) return 'metalloid';
    if (g >= 3 && g <= 12) return 'trans';
    return 'post';
  }
  function madelung(z) {
    var c = {}, left = z;
    for (var i = 0; i < ORDER.length && left > 0; i++) {
      var n = Math.min(CAP[ORDER[i].charAt(1)], left);
      c[ORDER[i]] = n; left -= n;
    }
    return c;
  }
  function config(z) {
    var c = madelung(z), e = EXC[z];
    if (e) Object.keys(e).forEach(function (k) { if (e[k]) c[k] = e[k]; else delete c[k]; });
    return c;
  }
  function sortedShells(c) {
    return Object.keys(c).filter(function (k) { return c[k] > 0; }).sort(function (a, b) {
      return (+a.charAt(0) - +b.charAt(0)) || (LORD[a.charAt(1)] - LORD[b.charAt(1)]);
    });
  }
  function cfgStr(c) { return sortedShells(c).map(function (k) { return k + sup(c[k]); }).join(''); }
  function coreOf(z) { var core = 0; NOBLE.forEach(function (n) { if (n < z) core = n; }); return core; }
  function shortCfg(z, c) {
    var core = coreOf(z);
    if (!core) return cfgStr(c);
    var cc = madelung(core), rest = {};
    Object.keys(c).forEach(function (k) { var r = c[k] - (cc[k] || 0); if (r > 0) rest[k] = r; });
    return '[' + BYZ[core].sym + '] ' + cfgStr(rest);
  }
  function levels(c) {
    var lv = [];
    Object.keys(c).forEach(function (k) { var n = +k.charAt(0); lv[n - 1] = (lv[n - 1] || 0) + c[k]; });
    for (var i = 0; i < lv.length; i++) lv[i] = lv[i] || 0;
    return lv;
  }

  var ELS = [], BYZ = {};
  RAW.forEach(function (line, i) {
    var f = line.split('|'), z = i + 1, pos = position(z);
    var g = pos.fgroup ? 3 : pos.col;
    var el = {
      z: z, sym: f[0], name: f[1], mass: f[2], en: f[3] ? parseFloat(f[3]) : null, enStr: f[3], A: +f[4],
      period: pos.p, col: pos.col, row: pos.row, group: g, fam: family(z, g)
    };
    el.main = g <= 2 || g >= 13;
    el.mainN = g <= 2 ? g : (g >= 13 ? g - 10 : 0);
    el.label = GROUP_LABEL[g - 1];
    el.block = ((z >= 58 && z <= 71) || (z >= 90 && z <= 103)) ? 'f' : (z === 2 || g <= 2 ? 's' : (g >= 13 ? 'p' : 'd'));
    el.kind = FAM[el.fam].kind;
    el.cfg = config(z);
    el.lv = levels(el.cfg);
    el.outer = el.lv[el.lv.length - 1];
    el.search = norm(el.name) + ' ' + (ALIAS[z] || '');
    ELS.push(el); BYZ[z] = el;
  });
  function massCalc(el) { return el.z === 17 ? '35,5' : String(Math.round(parseFloat(el.mass.replace(/[\[\]]/g, '')))); }
  function massStr(el) { return comma(el.mass); }

  /* Степени окисления, высший оксид и летучее водородное соединение для элементов главных подгрупп */
  function f(tpl, s) { return chem(tpl.replace('R', s)); }
  function mainChem(el) {
    var z = el.z, s = el.sym, g = el.mainN;
    if (!el.main || z >= 104) return null;
    if (z === 1) return { max: '+1', min: '−1', oxide: 'H₂O', hyd: '—', note: 'Водород сам входит в состав водородных соединений других элементов; с активными металлами образует гидриды (NaH, CaH₂), где его степень окисления −1.' };
    if (g === 8) {
      if (z === 54) return { max: '+8', min: '0', oxide: 'XeO₄', hyd: '—', note: 'Ксенон образует фториды и оксиды: XeF₂, XeF₄, XeF₆, XeO₃, XeO₄.' };
      if (z === 36) return { max: '+2', min: '0', oxide: '—', hyd: '—', note: 'Известен фторид криптона KrF₂.' };
      if (z === 86) return { max: '+2', min: '0', oxide: '—', hyd: '—', note: 'Известен фторид радона RnF₂; радон радиоактивен.' };
      return { max: '0', min: '0', oxide: '—', hyd: '—', note: 'Устойчивых химических соединений не образует.' };
    }
    if (z === 8) return { max: '+2', min: '−2', oxide: '—', hyd: 'H₂O', note: 'Исключение: высшая степень окисления кислорода +2 (только в OF₂), а не +6 по номеру группы. Обычно −2, в пероксидах −1.' };
    if (z === 9) return { max: '0', min: '−1', oxide: '—', hyd: 'HF', note: 'Исключение: фтор — самый электроотрицательный элемент, положительных степеней окисления не имеет и оксидов не образует (OF₂ — фторид кислорода).' };
    var OX = ['R2O', 'RO', 'R2O3', 'RO2', 'R2O5', 'RO3', 'R2O7'][g - 1];
    var r = { max: '+' + g, min: g >= 4 ? '−' + (8 - g) : '0', oxide: f(OX, s), hyd: '—', note: '' };
    if (g >= 4) r.hyd = f(['RH4', 'RH3', 'H2R', 'HR'][g - 4], s);
    if (g === 1) r.note = 'С водородом образует твёрдый солеобразный гидрид ' + s + 'H — не летучее соединение.';
    if (g === 2) r.note = 'Гидрид ' + s + 'H₂ — твёрдое нелетучее вещество.';
    if (z === 5) { r.min = '−3'; r.hyd = 'B₂H₆'; r.note = 'Простейший боран BH₃ существует в виде димера B₂H₆ (диборан).'; }
    if (z === 81) r.note = 'Для таллия устойчивее степень окисления +1.';
    if (z === 50) { r.min = '0'; r.note = 'Металл: характерные степени окисления +2 и +4. Станнан SnH₄ неустойчив.'; }
    if (z === 82) { r.min = '0'; r.hyd = 'PbH₄'; r.note = 'Металл: характерные степени окисления +2 и +4 (соединения свинца(II) устойчивее). Плюмбан PbH₄ крайне неустойчив.'; }
    if (z === 83) { r.min = '0'; r.oxide = 'Bi₂O₅'; r.note = 'Металл: обычно +3 (Bi₂O₃). Соединения висмута(V) — сильные окислители, Bi₂O₅ неустойчив. Висмутин BiH₃ крайне неустойчив.'; }
    if (z === 84) { r.note = 'Радиоактивный металл; обычные степени окисления +2 и +4, устойчивый оксид PoO₂.'; }
    if (z === 35) { r.oxide = 'Br₂O₇ (не получен)'; r.note = 'Степень окисления +7 бром проявляет в перброматах (KBrO₄); оксид Br₂O₇ не выделен.'; }
    if (z === 53) { r.oxide = 'I₂O₇ (формально)'; r.note = 'Степень окисления +7 — в периодатах (HIO₄, KIO₄); устойчивый оксид иода — I₂O₅.'; }
    if (z === 85) { r.oxide = '—'; r.note = 'Астат радиоактивен, его химия изучена мало.'; }
    if (z >= 113) return null;
    return r;
  }

  /* ================= Стили ================= */
  function injectCSS() {
    if (document.getElementById('lab-periodic-css')) return;
    var st = document.createElement('style');
    st.id = 'lab-periodic-css';
    st.textContent = [
      '.lb-pt{display:flex;flex-direction:column;gap:12px;min-width:0}',
      '.lb-pt [hidden]{display:none!important}',
      '.lb-pt .lb-pt-grid{grid-template-columns:16px repeat(18,minmax(36px,1fr));min-width:720px;position:relative}',
      '.lb-pt .pt-el{background:color-mix(in srgb,var(--pc) var(--pm,20%),var(--sheet));border-color:color-mix(in srgb,var(--pc) 55%,transparent);padding:2px 3px;overflow:hidden;font-size:inherit}',
      '.lb-pt .pt-el.pred{border-style:dashed}',
      '.lb-pt .pt-el:focus-visible{outline:2.5px solid var(--ink);outline-offset:1px;z-index:3;position:relative}',
      '.lb-pt .pt-el.hl{outline:2.5px solid var(--warn);outline-offset:1px;z-index:2;position:relative}',
      '.lb-pt .pt-el.good{outline:3px solid var(--ok);outline-offset:1px;z-index:2;position:relative}',
      '.lb-pt .pt-el.bad{outline:3px solid var(--red);outline-offset:1px;z-index:2;position:relative}',
      '.lb-pt .pt-el.dim{opacity:.22}',
      '.lb-pt-per{font:600 10px var(--f-mono);color:var(--muted);display:flex;align-items:center;justify-content:center}',
      '.lb-pt-lbl{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;line-height:1.05;padding-bottom:2px}',
      '.lb-pt-lbl small{font-size:8.5px;opacity:.7;font-weight:500}',
      '.lb-pt-ph{border:1px dashed var(--grid-strong);border-radius:3px;display:flex;flex-direction:column;align-items:center;justify-content:center;font:600 9px/1.1 var(--f-mono);color:var(--muted);background:var(--sheet-2);cursor:pointer;padding:0;min-width:0;text-align:center}',
      '.lb-pt-ph:hover{border-color:var(--ink);color:var(--ink)}',
      '.lb-pt-flbl{font:600 9px/1.1 var(--f-body);color:var(--muted);display:flex;align-items:center;justify-content:flex-end;text-align:right;padding-right:4px}',
      '.lb-pt-sp{height:10px}',
      '.lb-pt-inset{grid-row:2/5;grid-column:4/14;display:flex;gap:12px;align-items:center;padding:2px 8px;min-width:0;pointer-events:none}',
      '.lb-pt-inset .ib{flex:0 0 auto;width:74px;height:74px;border:2px solid var(--pc,var(--ink));border-radius:6px;background:color-mix(in srgb,var(--pc,var(--ink)) 16%,var(--sheet));display:flex;flex-direction:column;justify-content:space-between;padding:4px 6px;font-family:var(--f-mono)}',
      '.lb-pt-inset .ib b{font:700 26px/1 var(--f-display);color:var(--text)}',
      '.lb-pt-inset .ib span{font-size:10px;color:var(--muted);line-height:1}',
      '.lb-pt-inset .it{min-width:0;display:flex;flex-direction:column;gap:2px;font-size:12.5px;line-height:1.3}',
      '.lb-pt-inset .it b{font-size:15px}',
      '.lb-pt-inset .it .mono{font-family:var(--f-mono);font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.lb-pt-legend button{border:0;background:none;padding:2px 4px;border-radius:5px;display:inline-flex;align-items:center;gap:5px;font:inherit;color:var(--muted);cursor:pointer}',
      '.lb-pt-legend button:hover{color:var(--text);background:var(--sheet-2)}',
      '.lb-pt-legend button[aria-pressed="true"]{color:var(--text);background:var(--ink-soft);box-shadow:inset 0 0 0 1px var(--ink)}',
      '.lb-pt-legend i{display:inline-block;width:11px;height:11px;border-radius:2px;flex:0 0 auto}',
      '.lb-pt-heat{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
      '.lb-pt-heat .bar{width:180px;max-width:50vw;height:10px;border-radius:5px}',
      '.lb-pt-search{flex:1 1 200px;min-width:0;display:flex;gap:8px;align-items:center}',
      '.lb-pt-search input{flex:1;min-width:0;width:100%}',
      '.lb-pt-msg{font-size:13px;color:var(--muted);min-height:1.2em}',
      '.lb-pt-card{border:1px solid var(--line);border-radius:8px;padding:12px;background:var(--sheet)}',
      '.lb-pt-card .pt-big{--pc:var(--ink);border-color:color-mix(in srgb,var(--pc) 70%,var(--ink));background:color-mix(in srgb,var(--pc) 16%,var(--sheet))}',
      '.lb-pt-card .pt-big .sym{color:var(--text)}',
      '.lb-pt-card .pt-big .nm{font:600 13px var(--f-body);color:var(--text)}',
      '.lb-pt-card .pt-big .ms{font-size:11px;color:var(--muted)}',
      '.lb-pt-card .pt-big .zz{font-size:13px;font-weight:700;color:var(--muted)}',
      '.lb-pt-card .pt-props .wide{grid-column:1/-1}',
      '.lb-pt-card .pt-props b{font-size:14.5px}',
      '.lb-pt-card .lb-pt-note{grid-column:1/-1;font-size:13.5px;color:var(--text);background:var(--warn-soft);border-radius:6px;padding:7px 10px;line-height:1.45}',
      '.lb-pt-card .lb-pt-note.info{background:var(--ink-soft)}',
      '.lb-pt-train{border:1.5px solid var(--ink);border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:10px;background:var(--sheet)}',
      '.lb-pt-q{font-size:16px;line-height:1.5;font-weight:500}',
      '.lb-pt-q .mono{font-family:var(--f-mono);font-weight:600;color:var(--ink);white-space:normal;word-break:break-word}',
      '.lb-pt-fb{font-size:14.5px;line-height:1.5;min-height:1.2em}',
      '.lb-pt-fb.ok{color:var(--ok)}.lb-pt-fb.bad{color:var(--red)}',
      '.lb-pt-fb .ex{display:block;color:var(--text);margin-top:4px}',
      '.lb-pt-choices{display:flex;flex-wrap:wrap;gap:8px}',
      '.lb-pt-choices .btn.ok{border-color:var(--ok);background:var(--ok-soft);color:var(--ok)}',
      '.lb-pt-choices .btn.bad{border-color:var(--red);background:var(--red-soft);color:var(--red)}',
      '.lb-pt-kbd{font-size:12.5px;color:var(--muted)}',
      '@media (max-width:640px){.lb-pt-inset{display:none}.lb-pt-q{font-size:15px}}'
    ].join('\n');
    document.head.appendChild(st);
  }

  /* ================= Цвета ================= */
  function hex2rgb(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  var HEAT = ['#339af0', '#22b8cf', '#94d82d', '#fcc419', '#f76707', '#e03131'];
  function heat(t) {
    t = Math.max(0, Math.min(1, t)) * (HEAT.length - 1);
    var i = Math.min(HEAT.length - 2, Math.floor(t)), k = t - i, a = hex2rgb(HEAT[i]), b = hex2rgb(HEAT[i + 1]);
    return 'rgb(' + a.map(function (v, j) { return Math.round(v + (b[j] - v) * k); }).join(',') + ')';
  }
  var EN_MIN = 0.7, EN_MAX = 3.98;
  function colorOf(el, mode) {
    if (mode === 'block') return { c: BLOCK_C[el.block], m: '22%' };
    if (mode === 'kind') return { c: KIND[el.kind].c, m: '22%' };
    if (mode === 'en') {
      if (el.en == null) return { c: 'var(--muted)', m: '6%' };
      return { c: heat((el.en - EN_MIN) / (EN_MAX - EN_MIN)), m: '42%' };
    }
    return { c: FAM[el.fam].c, m: '22%' };
  }

  /* ================= Карточка ================= */
  function prop(label, val, cls) { return '<div' + (cls ? ' class="' + cls + '"' : '') + '><span>' + label + '</span><b>' + val + '</b></div>'; }
  function cardHTML(el) {
    var c = el.cfg, pred = el.z >= 104;
    var col = colorOf(el, 'fam').c;
    var h = '<div class="pt-info"><div class="pt-big" style="--pc:' + col + '"><span class="zz">' + el.z + '</span><span class="sym">' + esc(el.sym) + '</span><span class="nm">' + esc(el.name) + '</span><span class="ms">' + massStr(el) + '</span></div><div class="pt-props">';
    h += prop('Порядковый номер Z', el.z);
    h += prop('Ar точная', massStr(el));
    h += prop('Ar в расчётах', massCalc(el));
    h += prop('Период', el.period + (el.period <= 3 ? ' (малый)' : ' (большой)'));
    var grp;
    if (el.row >= 8) grp = 'IIIB (3), ' + (el.row === 8 ? 'ряд лантаноидов' : 'ряд актиноидов');
    else grp = el.label + ' (' + el.group + '), ' + (el.main ? 'главная' : 'побочная') + ' подгруппа';
    h += prop('Группа', grp);
    var fname = FAM[el.fam].one;
    h += prop('Семейство', fname.charAt(0).toUpperCase() + fname.slice(1) + (pred ? ' (предск.)' : ''));
    h += prop('Блок', el.block + '-элемент');
    h += prop('Тип', (el.kind === 'metal' ? 'металл' : el.kind === 'nonmetal' ? 'неметалл' : 'полуметалл') + (pred ? ' (предск.)' : ''));
    h += prop('Протонов / электронов', el.z + ' / ' + el.z);
    h += prop('Нейтронов', (el.A - el.z) + ' <span class="muted" style="display:inline;font-weight:400">в ' + sup(el.A) + esc(el.sym) + '</span>');
    h += prop('ЭО по Полингу', el.en == null ? '—' : comma(el.enStr));
    h += prop('Электронов по уровням', el.lv.join(', '));
    h += prop('На внешнем уровне', el.outer + ' e⁻ (' + el.lv.length + '-й уровень)');
    if (el.block === 'd' && el.z !== 57 && el.z !== 89) {
      var n = el.lv.length, ns = c[n + 's'] || 0, dn = c[(n - 1) + 'd'] || 0;
      h += prop('Валентные электроны', (dn ? (n - 1) + 'd' + sup(dn) : '') + (ns ? n + 's' + sup(ns) : '') + ' (' + (dn + ns) + ')');
    }
    h += prop('Электронная конфигурация', cfgStr(c), 'wide');
    h += prop('Сокращённая запись', shortCfg(el.z, c), 'wide');
    var mc = mainChem(el);
    if (mc) {
      h += prop('Высшая степень окисления', mc.max);
      h += prop('Низшая степень окисления', mc.min);
      h += prop('Высший оксид', mc.oxide + (OXIDE_TYPE[el.z] ? ' <span class="muted" style="display:inline;font-weight:400">(' + OXIDE_TYPE[el.z] + ')</span>' : ''));
      h += prop('Летучее водородное соединение', mc.hyd);
    } else if (D_OX[el.z]) {
      h += prop('Характерные степени окисления', D_OX[el.z][0], 'wide');
      if (D_OX[el.z][1]) h += prop('Высший оксид', chem(D_OX[el.z][1]));
    }
    var notes = [];
    if (EXC[el.z]) {
      var exp = shortCfg(el.z, madelung(el.z)), act = shortCfg(el.z, c);
      var dip = [24, 29, 41, 42, 44, 45, 46, 47, 78, 79].indexOf(el.z) >= 0;
      notes.push('<b>Исключение из правила Клечковского' + (dip ? ' («провал» электрона)' : '') + '.</b> Ожидалось ' + exp + ', на самом деле ' + act + '.' +
        (el.z === 24 || el.z === 42 ? ' Наполовину заполненный d-подуровень энергетически выгоднее.' : '') +
        (el.z === 29 || el.z === 47 || el.z === 79 ? ' Полностью заполненный d-подуровень энергетически выгоднее.' : '') +
        (el.z === 46 ? ' У палладия внешний 5s-подуровень пуст, поэтому электроны занимают только 4 уровня, хотя элемент стоит в 5-м периоде.' : ''));
    }
    if (el.z === 57 || el.z === 89) notes.push((el.z === 57 ? 'Лантан' : 'Актиний') + ' по строению — d-элемент (' + (el.z === 57 ? '5d¹6s²' : '6d¹7s²') + '), но его помещают в начало ряда ' + (el.z === 57 ? 'лантаноидов' : 'актиноидов') + '.');
    if (el.z === 4 || el.z === 12) notes.push('По IUPAC бериллий и магний тоже относят к щёлочноземельным металлам, но в школьных учебниках так часто называют только Ca, Sr, Ba и Ra.');
    if (el.z === 1) notes.push('Водород ставят в IA-группу (один электрон, как у щелочных металлов), но это неметалл; иногда его помещают и в VIIA-группу.');
    if (el.z === 2) notes.push('Гелий — s-элемент (1s²), но по свойствам благородный газ, поэтому стоит в VIIIA-группе.');
    if (mc && mc.note) notes.push(mc.note);
    if (EN_NOTE[el.z]) notes.push(EN_NOTE[el.z]);
    if (el.mass.charAt(0) === '[') notes.push('Стабильных изотопов нет. В квадратных скобках — массовое число самого устойчивого изотопа.');
    if (pred) notes.push('Сверхтяжёлый элемент: получены лишь отдельные атомы, электронная конфигурация и свойства предсказаны теоретически.');
    notes.forEach(function (t) { h += '<div class="lb-pt-note' + (/^<b>Исключение/.test(t) ? '' : ' info') + '">' + t + '</div>'; });
    return h + '</div></div>';
  }

  /* ================= Тренировка ================= */
  function gen(el) {
    var n = el.name.toLowerCase();
    if (n === 'никель') return 'никеля';
    if (/ий$/.test(n)) return n.slice(0, -2) + 'ия';
    if (/ец$/.test(n)) return n.slice(0, -2) + 'ца';
    if (/ь$/.test(n)) return n.slice(0, -1) + 'и';
    if (/о$/.test(n)) return n.slice(0, -1) + 'а';
    if (/а$/.test(n)) return n.slice(0, -1) + 'ы';
    return n + 'а';
  }
  function pool(level, what) {
    return ELS.filter(function (e) {
      if (!e.main || e.z >= 57 && e.z <= 71) return false;
      if (what === 'active' && (e.fam === 'noble' || e.z === 1)) return false;
      return level === 'oge' ? e.z <= 20 : e.z <= 56;
    });
  }
  function elAnswerCheck(val) {
    var v = norm(val).replace(/[()]/g, '');
    if (!v) return null;
    if (/^\d+$/.test(v)) return BYZ[+v] || null;
    for (var i = 0; i < ELS.length; i++) {
      var e = ELS[i];
      if (e.sym.toLowerCase() === v || norm(e.name) === v || (ALIAS[e.z] && ALIAS[e.z] === v)) return e;
    }
    return null;
  }
  function trendAnswer(a, b, prop) {
    /* true, если у a свойство больше; null — если пару нельзя использовать */
    var samePeriod = a.period === b.period, bigger;
    if (prop === 'en') {
      if (a.en == null || b.en == null || a.en === b.en) return null;
      var trend = samePeriod ? a.group > b.group : a.period < b.period;
      if ((a.en > b.en) !== trend) return null;
      return a.en > b.en;
    }
    if (prop === 'r' || prop === 'met') bigger = samePeriod ? a.group < b.group : a.period > b.period;
    else bigger = samePeriod ? a.group > b.group : a.period < b.period; /* неметаллические свойства */
    return bigger;
  }
  var PROPS = {
    en: 'больше электроотрицательность',
    r: 'больше радиус атома',
    met: 'сильнее выражены металлические свойства',
    nonmet: 'сильнее выражены неметаллические свойства'
  };
  function genQuestion(level) {
    var types = ['outer', 'outer', 'cfg', 'cfg', 'cmp', 'cmp', 'cmp', 'pos', 'oxide', 'hyd'];
    if (level === 'oge') types.push('layers', 'levels');
    else types.push('outerD', 'layers');
    for (var guard = 0; guard < 50; guard++) {
      var t = pick(types), q = null, e, P;
      if (t === 'outer' || t === 'outerD') {
        e = t === 'outerD' ? BYZ[pick([19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 37, 38, 42, 47])] : pick(pool(level));
        q = { type: 'num', text: 'Сколько электронов находится на внешнем энергетическом уровне атома <b>' + gen(e) + '</b> (' + e.sym + ')?', answer: e.outer,
          explain: e.sym + ': ' + cfgStr(e.cfg) + '. По уровням: ' + e.lv.join(', ') + ' — на внешнем, ' + e.lv.length + '-м уровне ' + e.outer + '.' + (EXC[e.z] ? ' Обратите внимание на «провал» электрона.' : ''), z: e.z };
      } else if (t === 'layers') {
        e = pick(pool(level));
        q = { type: 'num', text: 'Сколько энергетических уровней (электронных слоёв) заполняется электронами в атоме <b>' + gen(e) + '</b> (' + e.sym + ')?', answer: e.lv.length,
          explain: 'Число заполняемых уровней равно номеру периода: ' + e.sym + ' — ' + e.period + '-й период (' + e.lv.join(', ') + ').', z: e.z };
      } else if (t === 'levels') {
        e = pick(pool(level).filter(function (x) { return x.z > 2; }));
        q = { type: 'el', text: 'Атом какого элемента имеет распределение электронов по уровням <span class="mono">' + e.lv.join(', ') + '</span>? Нажмите на него в таблице или впишите символ.', answer: e.z,
          explain: 'Всего электронов ' + e.lv.join(' + ') + ' = ' + e.z + ', значит Z = ' + e.z + ' — ' + e.name.toLowerCase() + ' (' + e.sym + ').' };
      } else if (t === 'cfg') {
        var cands = level === 'oge' ? pool(level).filter(function (x) { return x.z > 2; }) : ELS.filter(function (x) { return x.z >= 5 && x.z <= 54 && (x.main || x.period === 4); });
        e = pick(cands);
        var full = level === 'oge' || Math.random() < 0.5;
        var s = full ? cfgStr(e.cfg) : shortCfg(e.z, e.cfg);
        q = { type: 'el', text: 'Какой элемент имеет электронную конфигурацию <span class="mono">' + s + '</span>? Нажмите на него в таблице или впишите символ.', answer: e.z,
          explain: 'Сумма верхних индексов = ' + e.z + ' электронов → Z = ' + e.z + ', это ' + e.name.toLowerCase() + ' (' + e.sym + ').' + (full ? '' : ' В квадратных скобках — конфигурация благородного газа ' + BYZ[coreOf(e.z)].sym + ' (' + coreOf(e.z) + ' e⁻).') };
      } else if (t === 'pos') {
        var pc = level === 'oge' ? pool(level, 'active').filter(function (x) { return x.period >= 2; }) : ELS.filter(function (x) { return x.z >= 3 && x.z <= 56 && x.fam !== 'noble' && (x.main || (x.period === 4 && (x.group < 8 || x.group > 10))); });
        e = pick(pc);
        q = { type: 'el', text: 'Какой элемент находится в <b>' + e.period + '-м периоде</b>, в <b>' + e.label + '</b>-группе (' + (e.main ? 'главная' : 'побочная') + ' подгруппа ' + ROMAN[(e.main ? e.mainN : (e.group <= 7 ? e.group : e.group - 10)) - 1] + ' группы)? Нажмите на него в таблице или впишите символ.', answer: e.z,
          explain: e.period + '-й период, ' + e.label + ' → ' + e.name.toLowerCase() + ' (' + e.sym + ', Z = ' + e.z + ').' };
      } else if (t === 'cmp') {
        var pr = pick(['en', 'r', 'met', 'nonmet']), pl = pool(level, 'active').filter(function (x) { return x.period >= 2 && x.z !== 1; });
        var a = pick(pl), same = Math.random() < 0.5, others = pl.filter(function (x) {
          if (x === a) return false;
          if (same) return x.period === a.period;
          return x.group === a.group && [1, 2, 14, 15, 16, 17].indexOf(x.group) >= 0;
        });
        if (!others.length) continue;
        var b = pick(others), ans = trendAnswer(a, b, pr);
        if (ans === null) continue;
        var win = ans ? a : b, lose = ans ? b : a;
        var why;
        if (same) why = win.sym + ' и ' + lose.sym + ' — в одном (' + a.period + '-м) периоде. Слева направо ' + (pr === 'r' ? 'радиус уменьшается (растёт заряд ядра, электроны притягиваются сильнее)' : pr === 'met' ? 'металлические свойства ослабевают' : pr === 'en' ? 'электроотрицательность растёт' : 'неметаллические свойства усиливаются') + '.';
        else why = win.sym + ' и ' + lose.sym + ' — в одной (' + a.label + ') группе. Сверху вниз ' + (pr === 'r' ? 'радиус растёт (добавляются электронные слои)' : pr === 'met' ? 'металлические свойства усиливаются' : pr === 'en' ? 'электроотрицательность уменьшается' : 'неметаллические свойства ослабевают') + '.';
        if (pr === 'en') why += ' ЭО: ' + win.sym + ' ' + comma(win.enStr) + ', ' + lose.sym + ' ' + comma(lose.enStr) + '.';
        var pairQ = shuffle([a, b]);
        q = { type: 'choice', text: 'У какого элемента ' + PROPS[pr] + '?', choices: pairQ.map(function (x) { return { label: x.sym + ' — ' + x.name.toLowerCase(), z: x.z, ok: x === win }; }), answer: win.z, pair: [a.z, b.z], explain: why };
      } else if (t === 'oxide') {
        var po = pool(level, 'active').filter(function (x) { return x.mainN <= 7 && [8, 9, 35, 53, 1].indexOf(x.z) < 0 && x.z <= 38; });
        e = pick(po);
        P = ['R2O', 'RO', 'R2O3', 'RO2', 'R2O5', 'RO3', 'R2O7'];
        var right = P[e.mainN - 1], opts = shuffle([right].concat(shuffle(P.filter(function (x) { return x !== right; })).slice(0, 3)));
        q = { type: 'choice', text: 'Какова формула высшего оксида <b>' + gen(e) + '</b> (' + e.sym + ')?', choices: opts.map(function (o) { return { label: f(o, e.sym), ok: o === right }; }),
          explain: e.sym + ' — в ' + e.label + '-группе, высшая степень окисления +' + e.mainN + ' → ' + f(right, e.sym) + '.', z: e.z };
      } else if (t === 'hyd') {
        var ph = ELS.filter(function (x) { return [6, 7, 14, 15, 16, 17, 32, 33, 34, 35].indexOf(x.z) >= 0 && (level === 'ege' || x.z <= 20); });
        e = pick(ph);
        P = ['RH4', 'RH3', 'H2R', 'HR'];
        var rh = P[e.mainN - 4];
        q = { type: 'choice', text: 'Какова формула летучего водородного соединения <b>' + gen(e) + '</b> (' + e.sym + ')?', choices: shuffle(P).map(function (o) { return { label: f(o, e.sym), ok: o === rh }; }),
          explain: 'Низшая степень окисления = номер группы − 8 = ' + e.mainN + ' − 8 = −' + (8 - e.mainN) + ' → ' + f(rh, e.sym) + '.', z: e.z };
      }
      if (q) { q.kind = t; return q; }
    }
    return null;
  }

  /* ================= Монтирование ================= */
  function mount(root) {
    injectCSS();
    var st = { mode: 'ref', color: 'fam', sel: 16, hover: null, filter: null, query: '', level: 'oge', q: null, done: false, score: 0, total: 0, streak: 0 };
    root.innerHTML =
      '<div class="lb-pt">' +
      '<div class="lab-row">' +
      '<div class="seg" role="group" aria-label="Режим"><button type="button" data-mode="ref" class="on" aria-pressed="true">Справочник</button><button type="button" data-mode="train" aria-pressed="false">Тренировка</button></div>' +
      '<label class="inline">Раскраска <select data-r="color" aria-label="Раскраска таблицы"><option value="fam">по семействам</option><option value="block">по блокам s, p, d, f</option><option value="kind">металлы и неметаллы</option><option value="en">электроотрицательность</option></select></label>' +
      '<div class="lb-pt-search" data-r="searchbox"><input type="text" data-r="q" placeholder="Поиск: Fe, железо, 26" aria-label="Поиск элемента по символу, названию или номеру" autocomplete="off" spellcheck="false"></div>' +
      '</div>' +
      '<div class="lb-pt-train" data-r="train" hidden></div>' +
      '<div class="pt-legend lb-pt-legend" data-r="legend"></div>' +
      '<div class="lb-pt-msg" data-r="msg" aria-live="polite"></div>' +
      '<div class="pt-scroll"><div class="pt lb-pt-grid" data-r="grid" role="group" aria-label="Периодическая система химических элементов. Перемещение — стрелками."></div></div>' +
      '<div class="lb-pt-kbd" data-r="kbd">Нажмите на элемент, чтобы увидеть карточку. С клавиатуры: Tab — в таблицу, стрелки — перемещение, Home/End — край ряда.</div>' +
      '<div class="lb-pt-card" data-r="card" aria-live="polite"></div>' +
      '</div>';
    function R(n) { return root.querySelector('[data-r="' + n + '"]'); }
    var grid = R('grid'), card = R('card'), legend = R('legend'), msg = R('msg'), train = R('train'), qInput = R('q');
    var btn = {};

    /* Сетка */
    var html = '';
    for (var g = 1; g <= 18; g++) {
      html += '<div class="pt-label lb-pt-lbl" style="grid-row:1;grid-column:' + (g + 1) + '">' + GROUP_LABEL[g - 1] + '<small>' + g + '</small></div>';
    }
    for (var p = 1; p <= 7; p++) html += '<div class="lb-pt-per" style="grid-row:' + (p + 1) + ';grid-column:1" aria-hidden="true">' + p + '</div>';
    html += '<div class="lb-pt-inset" data-r="inset" aria-hidden="true"></div>';
    html += '<button type="button" class="lb-pt-ph" style="grid-row:7;grid-column:4" data-jump="57" aria-label="Лантаноиды, элементы 57–71: перейти к ряду"><span>57–71</span><span style="font-weight:400">La–Lu</span></button>';
    html += '<button type="button" class="lb-pt-ph" style="grid-row:8;grid-column:4" data-jump="89" aria-label="Актиноиды, элементы 89–103: перейти к ряду"><span>89–103</span><span style="font-weight:400">Ac–Lr</span></button>';
    html += '<div class="lb-pt-sp" style="grid-row:9;grid-column:1/-1"></div>';
    html += '<div class="lb-pt-flbl" style="grid-row:10;grid-column:1/4">Лантаноиды</div>';
    html += '<div class="lb-pt-flbl" style="grid-row:11;grid-column:1/4">Актиноиды</div>';
    ELS.forEach(function (e) {
      var gr = e.row <= 7 ? e.row + 1 : e.row + 2;
      html += '<button type="button" class="pt-el' + (e.z >= 104 ? ' pred' : '') + '" data-z="' + e.z + '" tabindex="-1" style="grid-row:' + gr + ';grid-column:' + (e.col + 1) + '" aria-label="' + e.z + ', ' + esc(e.name) + ', ' + esc(e.sym) + '">' +
        '<span class="z">' + e.z + '</span><span class="sym">' + esc(e.sym) + '</span><span class="nm">' + esc(e.name) + '</span></button>';
    });
    grid.innerHTML = html;
    var inset = R('inset');
    Array.prototype.forEach.call(grid.querySelectorAll('.pt-el'), function (b) { btn[b.dataset.z] = b; });

    function paint() {
      ELS.forEach(function (e) {
        var c = colorOf(e, st.color), b = btn[e.z];
        b.style.setProperty('--pc', c.c); b.style.setProperty('--pm', c.m);
      });
      applyFilter();
      renderLegend();
    }
    function catOf(e) { return st.color === 'block' ? e.block : st.color === 'kind' ? e.kind : st.color === 'fam' ? e.fam : null; }
    function renderLegend() {
      var items = [];
      if (st.color === 'fam') items = FAM_ORDER.map(function (k) { return [k, FAM[k].n, FAM[k].c]; });
      if (st.color === 'block') items = ['s', 'p', 'd', 'f'].map(function (k) { return [k, k + '-элементы', BLOCK_C[k]]; });
      if (st.color === 'kind') items = ['metal', 'metalloid', 'nonmetal'].map(function (k) { return [k, KIND[k].n, KIND[k].c]; });
      if (st.color === 'en') {
        var stops = []; for (var i = 0; i <= 10; i++) stops.push(heat(i / 10));
        legend.innerHTML = '<span class="lb-pt-heat">ЭО по Полингу: <b class="mono">0,7</b><span class="bar" style="background:linear-gradient(90deg,' + stops.join(',') + ')" aria-hidden="true"></span><b class="mono">3,98</b></span>' +
          '<span><i style="background:color-mix(in srgb,var(--muted) 20%,var(--sheet));border:1px solid var(--line)"></i>нет данных</span>' +
          '<span>Растёт слева направо и снизу вверх; максимум — у фтора.</span>';
        return;
      }
      legend.innerHTML = items.map(function (it) {
        return '<button type="button" data-cat="' + it[0] + '" aria-pressed="' + (st.filter === it[0]) + '" title="Показать только эту категорию"><i style="background:' + it[2] + '"></i>' + esc(it[1]) + '</button>';
      }).join('') + (st.color === 'fam' ? '<span><i style="border:1px dashed var(--muted)"></i>свойства предсказаны</span>' : '');
    }
    function applyFilter() {
      var q = norm(st.query), hits = 0, first = null, exact = null;
      ELS.forEach(function (e) {
        var on = true;
        if (q) {
          var ex = e.sym.toLowerCase() === q || String(e.z) === q || norm(e.name) === q || ALIAS[e.z] === q;
          on = ex || e.search.indexOf(q) >= 0 || (q.length <= 2 && e.sym.toLowerCase().indexOf(q) === 0);
          if (ex && !exact) exact = e;
        } else if (st.filter) on = catOf(e) === st.filter;
        btn[e.z].classList.toggle('dim', !on);
        if (on && (q || st.filter)) { hits++; if (!first) first = e; }
      });
      first = exact || first;
      if (q) msg.textContent = hits ? 'Найдено: ' + hits + (hits === 1 ? '' : ' (Enter — открыть ' + first.name.toLowerCase() + ')') : 'Ничего не найдено';
      else if (st.filter) msg.textContent = 'Показаны: ' + legendName(st.filter) + ' — ' + hits + '. Нажмите на пункт легенды ещё раз, чтобы снять выделение.';
      else msg.textContent = '';
      return first;
    }
    function legendName(k) { return (FAM[k] && FAM[k].n) || (KIND[k] && KIND[k].n) || (k + '-элементы'); }

    function renderInset(e) {
      if (!e || st.mode !== 'ref') { inset.innerHTML = ''; return; }
      var c = colorOf(e, 'fam').c;
      inset.innerHTML = '<div class="ib" style="--pc:' + c + '"><span>' + e.z + '</span><b>' + esc(e.sym) + '</b><span>' + massStr(e) + '</span></div>' +
        '<div class="it"><b>' + esc(e.name) + '</b><span class="mono">' + shortCfg(e.z, e.cfg) + '</span><span class="mono">' + e.lv.join(', ') + ' · ЭО ' + (e.en == null ? '—' : comma(e.enStr)) + '</span><span class="mono">' + e.label + ' · ' + e.period + '-й период</span></div>';
    }
    function setRoving(z) {
      Object.keys(btn).forEach(function (k) { btn[k].tabIndex = -1; });
      if (btn[z]) btn[z].tabIndex = 0;
    }
    function select(z, noFocus) {
      if (btn[st.sel]) { btn[st.sel].classList.remove('sel'); btn[st.sel].removeAttribute('aria-current'); }
      st.sel = z;
      btn[z].classList.add('sel'); btn[z].setAttribute('aria-current', 'true');
      setRoving(z);
      if (st.mode === 'ref') { card.innerHTML = cardHTML(BYZ[z]); renderInset(BYZ[z]); }
      if (!noFocus) btn[z].focus();
    }

    /* Навигация стрелками */
    function neighbor(z, key) {
      var e = BYZ[z], best = null, d;
      if (key === 'ArrowLeft' || key === 'ArrowRight') {
        d = key === 'ArrowLeft' ? -1 : 1;
        ELS.forEach(function (x) { if (x.row === e.row && (x.col - e.col) * d > 0 && (!best || Math.abs(x.col - e.col) < Math.abs(best.col - e.col))) best = x; });
        return best;
      }
      if (key === 'Home' || key === 'End') {
        ELS.forEach(function (x) { if (x.row === e.row && (!best || (key === 'Home' ? x.col < best.col : x.col > best.col))) best = x; });
        return best;
      }
      d = key === 'ArrowUp' ? -1 : 1;
      for (var r = e.row + d; r >= 1 && r <= 9; r += d) {
        ELS.forEach(function (x) { if (x.row === r && (!best || Math.abs(x.col - e.col) < Math.abs(best.col - e.col))) best = x; });
        if (best) return best;
      }
      return null;
    }
    grid.addEventListener('keydown', function (ev) {
      var t = ev.target.closest('.pt-el'); if (!t) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].indexOf(ev.key) < 0) return;
      ev.preventDefault();
      var n = neighbor(+t.dataset.z, ev.key); if (!n) return;
      if (st.mode === 'ref') select(n.z);
      else { setRoving(n.z); btn[n.z].focus(); }
    });
    grid.addEventListener('click', function (ev) {
      var ph = ev.target.closest('.lb-pt-ph');
      if (ph) { var jz = +ph.dataset.jump; if (st.mode === 'ref') select(jz); else { setRoving(jz); btn[jz].focus(); } return; }
      var t = ev.target.closest('.pt-el'); if (!t) return;
      var z = +t.dataset.z;
      if (st.mode === 'ref') select(z, true);
      else { setRoving(z); answerEl(z); }
    });
    grid.addEventListener('mouseover', function (ev) {
      var t = ev.target.closest('.pt-el'); if (!t || st.mode !== 'ref') return;
      renderInset(BYZ[+t.dataset.z]);
    });
    grid.addEventListener('mouseleave', function () { if (st.mode === 'ref') renderInset(BYZ[st.sel]); });
    grid.addEventListener('focusin', function (ev) {
      var t = ev.target.closest('.pt-el'); if (!t || st.mode !== 'ref') return;
      renderInset(BYZ[+t.dataset.z]);
    });

    /* Контролы */
    R('color').addEventListener('change', function () { st.color = this.value; st.filter = null; paint(); });
    qInput.addEventListener('input', function () { st.query = this.value; st.filter = null; renderLegend(); applyFilter(); });
    qInput.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') { var fe = applyFilter(); if (fe && st.query.trim()) select(fe.z); }
      if (ev.key === 'Escape') { this.value = ''; st.query = ''; applyFilter(); }
    });
    legend.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-cat]'); if (!b) return;
      st.filter = st.filter === b.dataset.cat ? null : b.dataset.cat;
      st.query = ''; qInput.value = '';
      renderLegend(); applyFilter();
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-mode]'), function (b) {
      b.addEventListener('click', function () { setMode(b.dataset.mode); });
    });

    function setMode(m) {
      st.mode = m;
      Array.prototype.forEach.call(root.querySelectorAll('[data-mode]'), function (b) {
        var on = b.dataset.mode === m; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
      });
      clearMarks();
      train.hidden = m !== 'train';
      card.hidden = m === 'train';
      R('searchbox').hidden = m === 'train';
      R('kbd').textContent = m === 'train' ? 'Отвечайте кликом по элементу в таблице (или с клавиатуры: стрелки и Enter) либо вводом.' : 'Нажмите на элемент, чтобы увидеть карточку. С клавиатуры: Tab — в таблицу, стрелки — перемещение, Home/End — край ряда.';
      if (m === 'train') {
        st.query = ''; qInput.value = ''; st.filter = null; renderLegend(); applyFilter();
        btn[st.sel].classList.remove('sel');
        renderInset(null);
        if (!st.q) nextQ(); else renderQ();
      } else {
        select(st.sel, true);
      }
    }

    function clearMarks() {
      Object.keys(btn).forEach(function (k) { btn[k].classList.remove('hl', 'good', 'bad'); });
    }
    function nextQ() {
      clearMarks();
      st.q = genQuestion(st.level); st.done = false;
      renderQ();
    }
    function renderQ() {
      var q = st.q;
      var h = '<div class="lab-row" style="justify-content:space-between"><div class="seg" role="group" aria-label="Уровень"><button type="button" data-lv="oge" class="' + (st.level === 'oge' ? 'on' : '') + '" aria-pressed="' + (st.level === 'oge') + '">ОГЭ 1–3</button><button type="button" data-lv="ege" class="' + (st.level === 'ege' ? 'on' : '') + '" aria-pressed="' + (st.level === 'ege') + '">ЕГЭ 1–3</button></div>' +
        '<div class="score-row"><span>Верно: <b>' + st.score + '</b> из <b>' + st.total + '</b></span><span>Серия: <b>' + st.streak + '</b></span></div></div>' +
        '<div class="lb-pt-q">' + q.text + '</div>';
      if (q.type === 'choice') {
        h += '<div class="lb-pt-choices">' + q.choices.map(function (c, i) { return '<button type="button" class="btn" data-ch="' + i + '">' + c.label + '</button>'; }).join('') + '</div>';
      } else {
        h += '<div class="lab-row"><input type="text" data-a="1" inputmode="' + (q.type === 'num' ? 'numeric' : 'text') + '" placeholder="' + (q.type === 'num' ? 'число' : 'символ, название или Z') + '" aria-label="Ваш ответ" autocomplete="off" spellcheck="false" style="width:190px"><button type="button" class="btn primary sm" data-go="1">Ответить</button></div>';
      }
      h += '<div class="lb-pt-fb" data-fb="1" role="status"></div><div class="lab-row"><button type="button" class="btn sm" data-next="1">' + (st.done ? 'Следующий вопрос' : 'Пропустить') + '</button></div>';
      train.innerHTML = h;
      if (q.pair) q.pair.forEach(function (z) { btn[z].classList.add('hl'); });
      Array.prototype.forEach.call(train.querySelectorAll('[data-lv]'), function (b) {
        b.addEventListener('click', function () { if (st.level !== b.dataset.lv) { st.level = b.dataset.lv; nextQ(); } });
      });
      Array.prototype.forEach.call(train.querySelectorAll('[data-ch]'), function (b) {
        b.addEventListener('click', function () { answerChoice(+b.dataset.ch); });
      });
      var inp = train.querySelector('[data-a]');
      if (inp) {
        var go = function () { answerText(inp.value); };
        train.querySelector('[data-go]').addEventListener('click', go);
        inp.addEventListener('keydown', function (ev) {
          if (ev.key !== 'Enter') return;
          if (st.done) { nextQ(); var ni = train.querySelector('[data-a]') || train.querySelector('[data-ch]'); if (ni) ni.focus(); } else go();
        });
      }
      train.querySelector('[data-next]').addEventListener('click', function () {
        if (!st.done) { st.total++; st.streak = 0; }
        nextQ();
        var ni = train.querySelector('[data-a]') || train.querySelector('[data-ch]'); if (ni) ni.focus();
      });
    }
    function finish(ok, userText) {
      if (st.done) return;
      st.done = true; st.total++;
      if (ok) { st.score++; st.streak++; } else st.streak = 0;
      var q = st.q, fb = train.querySelector('[data-fb]');
      var right = q.type === 'choice' ? q.choices.filter(function (c) { return c.ok; })[0].label : q.type === 'el' ? BYZ[q.answer].sym + ' — ' + BYZ[q.answer].name.toLowerCase() : String(q.answer);
      fb.className = 'lb-pt-fb ' + (ok ? 'ok' : 'bad');
      fb.innerHTML = (ok ? '<b>Верно!</b>' : '<b>Неверно' + (userText ? ' (' + esc(userText) + ')' : '') + '.</b> Правильный ответ: ' + right + '.') + '<span class="ex">' + q.explain + '</span>';
      var sr = train.querySelector('.score-row');
      if (sr) sr.innerHTML = '<span>Верно: <b>' + st.score + '</b> из <b>' + st.total + '</b></span><span>Серия: <b>' + st.streak + '</b></span>';
      var nb = train.querySelector('[data-next]'); nb.textContent = 'Следующий вопрос'; nb.classList.add('primary');
      var target = q.type === 'el' || q.pair ? q.answer : q.z;
      if (target) { btn[target].classList.add('good'); setRoving(target); }
      Array.prototype.forEach.call(train.querySelectorAll('[data-ch]'), function (b) {
        var c = q.choices[+b.dataset.ch]; if (c.ok) b.classList.add('ok'); b.setAttribute('aria-disabled', 'true');
      });
      nb.focus();
    }
    function answerEl(z) {
      var q = st.q; if (!q || st.done) return;
      if (q.type === 'el') {
        if (z !== q.answer) btn[z].classList.add('bad');
        finish(z === q.answer, BYZ[z].sym);
      } else if (q.pair && q.pair.indexOf(z) >= 0) {
        if (z !== q.answer) btn[z].classList.add('bad');
        finish(z === q.answer, BYZ[z].sym);
      } else {
        var fb = train.querySelector('[data-fb]');
        fb.className = 'lb-pt-fb'; fb.textContent = q.pair ? 'Выберите один из двух подсвеченных элементов или нажмите кнопку.' : 'В этом вопросе ответ — число или вариант; впишите его в поле.';
      }
    }
    function answerChoice(i) {
      var q = st.q; if (st.done) return;
      var c = q.choices[i], b = train.querySelector('[data-ch="' + i + '"]');
      if (!c.ok && b) b.classList.add('bad');
      if (c.z && !c.ok) btn[c.z].classList.add('bad');
      finish(c.ok, c.ok ? '' : c.label);
    }
    function answerText(v) {
      var q = st.q, fb = train.querySelector('[data-fb]');
      if (st.done) return;
      if (!String(v).trim()) { fb.className = 'lb-pt-fb'; fb.textContent = 'Сначала впишите ответ.'; return; }
      if (q.type === 'num') {
        var n = parseFloat(String(v).replace(',', '.').replace(/[^\d.\-]/g, ''));
        if (isNaN(n)) { fb.className = 'lb-pt-fb'; fb.textContent = 'Нужно число.'; return; }
        finish(n === q.answer, v.trim());
      } else {
        var e = elAnswerCheck(v);
        if (!e) { fb.className = 'lb-pt-fb'; fb.textContent = 'Не удалось узнать элемент. Впишите символ (Na), название (натрий) или номер (11).'; return; }
        if (e.z !== q.answer) btn[e.z].classList.add('bad');
        finish(e.z === q.answer, e.sym);
      }
    }

    function onTheme() {
      if (!root.isConnected) { window.removeEventListener('kl-theme', onTheme); return; }
      paint();
    }
    window.addEventListener('kl-theme', onTheme);

    paint();
    select(st.sel, true);
  }

  KL.labs.periodic = {
    title: 'Таблица Менделеева',
    icon: 'Fe',
    desc: 'Все 118 элементов: конфигурации, степени окисления, раскраски и тренировка',
    long: 'Интерактивная периодическая система: карточка каждого элемента с электронной конфигурацией, степенями окисления и формулами соединений, раскраски по семействам, блокам и электроотрицательности, а также тренировка к заданиям 1–3 ОГЭ и ЕГЭ.',
    subjectName: 'Химия',
    mount: mount,
    _data: { ELS: ELS, config: config, madelung: madelung, cfgStr: cfgStr, shortCfg: shortCfg, mainChem: mainChem, gen: gen, genQuestion: genQuestion, massCalc: massCalc }
  };
})();
