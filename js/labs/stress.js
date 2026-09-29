/* Лаборатория «Тренажёр ударений» — слова орфоэпического словника ФИПИ (задание 4 ЕГЭ): клик по ударной гласной, повтор ошибок, режим «как на экзамене». */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  KL.labs = KL.labs || {};

  /* ================= Словник =================
     [слово с заглавной ударной гласной, часть речи, подсказка-связка]
     Части речи: n — существительное, adj — прилагательное, v — глагол, prt — причастие, dpr — деепричастие, adv — наречие.
     Основа — орфоэпический словник ФИПИ к заданию 4 ЕГЭ; добавлены несколько слов из теории темы (договОр, кАшлянуть). */
  var PROVOD = 'Все слова на «-провОд» — с ударением на последнем слоге: водопровОд, газопровОд, нефтепровОд, мусоропровОд';
  var YO = 'Буква ё всегда ударная';
  var KLALA = 'Исключение: клАла, крАла, послАла — ударение остаётся на основе';
  var RAW = [
    /* ---------- Существительные ---------- */
    ['аэропОрты', 'n', 'аэропОрт — аэропОрты — аэропОртов: ударение не сходит с корня'],
    ['бАнты', 'n', 'бАнт — бАнты — бАнтов: ударение закреплено на корне'],
    ['бОроду', 'n', 'Винительный падеж: бОроду — как гОлову и стОрону'],
    ['бухгАлтеров', 'n', 'бухгАлтер — бухгАлтеры — бухгАлтеров'],
    ['вероисповЕдание', 'n', 'исповЕдовать — вероисповЕдание'],
    ['водопровОд', 'n', PROVOD],
    ['газопровОд', 'n', PROVOD],
    ['граждАнство', 'n', 'граждАнин — граждАнство'],
    ['дефИс', 'n', 'дефИс — дефИсы: ударение на последнем слоге'],
    ['дешевИзна', 'n', 'Как белИзна, новИзна'],
    ['диспансЕр', 'n', 'Ударение на последнем слоге, как в словах партЕр, шофЁр'],
    ['договОр', 'n', 'договОр — договОры — договОров'],
    ['договорЁнность', 'n', YO],
    ['докумЕнт', 'n', 'докумЕнт — докумЕнты, как цемЕнт'],
    ['досУг', 'n', 'досУг — досУги'],
    ['жалюзИ', 'n', 'Слово пришло из французского: ударение на последнем слоге'],
    ['знАчимость', 'n', 'знАчить — знАчимый — знАчимость'],
    ['Иксы', 'n', 'Икс — Иксы: ударение на корне'],
    ['каталОг', 'n', 'Как диалОг, монолОг, некролОг'],
    ['квартАл', 'n', 'квартАл — квартАлы: и часть года, и часть города'],
    ['киломЕтр', 'n', 'Как сантимЕтр, миллимЕтр'],
    ['кОнусы', 'n', 'кОнус — кОнусы — кОнусов'],
    ['кОнусов', 'n', 'кОнус — кОнусы — кОнусов'],
    ['корЫсть', 'n', 'корЫстный — корЫсть'],
    ['крАны', 'n', 'крАн — крАны — крАнов: ударение закреплено на корне'],
    ['кремЕнь', 'n', 'кремЕнь — кремнЯ: в косвенных падежах ударение на окончании'],
    ['кремнЯ', 'n', 'кремЕнь — кремнЯ — кремнЮ'],
    ['лЕкторы', 'n', 'лЕктор — лЕкторы — лЕкторов'],
    ['лЕкторов', 'n', 'лЕктор — лЕкторы — лЕкторов'],
    ['лыжнЯ', 'n', 'лыжнЯ — лыжнИ'],
    ['мЕстностей', 'n', 'мЕстность — мЕстностей'],
    ['мусоропровОд', 'n', PROVOD],
    ['намЕрение', 'n', 'намЕрен — намЕрение'],
    ['нарОст', 'n', 'нарОст — нарОсты'],
    ['нЕдруг', 'n', 'нЕдруг — нЕдруги: ударение на приставке нЕ-'],
    ['недУг', 'n', 'недУг — недУги'],
    ['некролОг', 'n', 'Как каталОг, диалОг'],
    ['ненАвистник', 'n', 'ненАвисть — ненАвистник'],
    ['нефтепровОд', 'n', PROVOD],
    ['новостЕй', 'n', 'нОвость — новостЕй'],
    ['нОгтя', 'n', 'нОготь — нОгтя — нОгтей'],
    ['нОгтей', 'n', 'нОготь — нОгтя — нОгтей'],
    ['обеспЕчение', 'n', 'обеспЕчить — обеспЕчение'],
    ['Отрочество', 'n', 'Отрок — Отрочество'],
    ['партЕр', 'n', 'партЕр — партЕра: ударение на последнем слоге'],
    ['портфЕль', 'n', 'портфЕль — портфЕли'],
    ['пОручни', 'n', 'пОручень — пОручни'],
    ['придАное', 'n', 'придАть — придАное'],
    ['призЫв', 'n', 'призЫв, созЫв — ударение на -зЫв'],
    ['свЁкла', 'n', YO + ': свЁкла, свЁклы'],
    ['сирОты', 'n', 'сирОта — сирОты'],
    ['созЫв', 'n', 'созЫв, призЫв — ударение на -зЫв'],
    ['сосредотОчение', 'n', 'сосредотОчить — сосредотОчение'],
    ['срЕдства', 'n', 'срЕдство — срЕдства'],
    ['стАтуя', 'n', 'стАтуя — стАтуи'],
    ['столЯр', 'n', 'столЯр — столЯры, как малЯр'],
    ['тамОжня', 'n', 'тамОжня — тамОженный'],
    ['тОрты', 'n', 'тОрт — тОрты — тОртов: ударение закреплено на корне'],
    ['тОртов', 'n', 'тОрт — тОрты — тОртов'],
    ['тУфля', 'n', 'тУфля — тУфли — тУфель'],
    ['цемЕнт', 'n', 'цемЕнт — как докумЕнт'],
    ['цЕнтнер', 'n', 'цЕнтнер — сто килограммов: ударение на первом слоге'],
    ['цепОчка', 'n', 'цепОчка — цепОчки'],
    ['шАрфы', 'n', 'шАрф — шАрфы — шАрфов: ударение закреплено на корне'],
    ['шофЁр', 'n', YO + ': шофЁр, шофЁры'],
    ['щавЕль', 'n', 'щавЕль — щавЕля'],
    ['экспЕрт', 'n', 'экспЕрт — экспЕрты'],
    /* ---------- Прилагательные ---------- */
    ['вернА', 'adj', 'вЕрный — вЕрен — вернА'],
    ['знАчимый', 'adj', 'знАчить — знАчимый'],
    ['красИвее', 'adj', 'красИвый — красИвее — красИвейший'],
    ['красИвейший', 'adj', 'красИвый — красИвее — красИвейший'],
    ['кухОнный', 'adj', 'кУхня, но кухОнный'],
    ['ловкА', 'adj', 'лОвкий — лОвок — ловкА'],
    ['мозаИчный', 'adj', 'мозАика, но мозаИчный'],
    ['оптОвый', 'adj', 'оптОвый склад, оптОвая цена'],
    ['прозорлИвый', 'adj', 'прозорлИвый — прозорлИва'],
    ['прозорлИва', 'adj', 'прозорлИвый — прозорлИва'],
    /* ---------- Глаголы ---------- */
    ['баловАть', 'v', 'баловАть — балУю — балУет'],
    ['баловАться', 'v', 'баловАться — балУюсь — балУется'],
    ['бралА', 'v', 'брАл — бралА — брАли: в женском роде ударение на окончании'],
    ['бралАсь', 'v', 'бралАсь — ударение на окончании'],
    ['взялА', 'v', 'взЯл — взялА — взЯли'],
    ['взялАсь', 'v', 'взялАсь — ударение на окончании'],
    ['включИм', 'v', 'включИть — включИм, включИшь, включИт, включАт'],
    ['включИшь', 'v', 'включИть — включИм, включИшь, включИт, включАт'],
    ['включИт', 'v', 'включИть — включИм, включИшь, включИт, включАт'],
    ['влилАсь', 'v', 'лилА — влилАсь'],
    ['ворвалАсь', 'v', 'рвалА — ворвалАсь'],
    ['воспринЯть', 'v', 'принЯть — воспринЯть'],
    ['воссоздалА', 'v', 'создалА — воссоздалА'],
    ['вручИт', 'v', 'вручИть — вручИт — вручАт'],
    ['гналА', 'v', 'гнАл — гналА — гнАли'],
    ['гналАсь', 'v', 'гналАсь — ударение на окончании'],
    ['добралА', 'v', 'бралА — добралА'],
    ['добралАсь', 'v', 'бралАсь — добралАсь'],
    ['дождалАсь', 'v', 'ждалА — дождалАсь'],
    ['дозвонИтся', 'v', 'звонИт — дозвонИтся'],
    ['дозИровать', 'v', 'дОза, но дозИровать'],
    ['ждалА', 'v', 'ждАл — ждалА — ждАли'],
    ['жилОсь', 'v', 'жилОсь — ударение на окончании'],
    ['закУпорить', 'v', 'закУпорить — закУпорив — закУпоренный'],
    ['занЯть', 'v', 'занЯть — зАнял — занялА — зАняли'],
    ['зАнял', 'v', 'зАнял — занялА — зАняли'],
    ['занялА', 'v', 'зАнял — занялА — зАняли'],
    ['зАняли', 'v', 'зАнял — занялА — зАняли'],
    ['заперлА', 'v', 'зАпер — заперлА — зАперли'],
    ['запломбировАть', 'v', 'пломбировАть — запломбировАть'],
    ['защемИт', 'v', 'щемИт — защемИт'],
    ['звалА', 'v', 'звАл — звалА — звАли'],
    ['звонИм', 'v', 'звонИть — звонИм, звонИшь, звонИт, звонЯт'],
    ['звонИшь', 'v', 'звонИть — звонИм, звонИшь, звонИт, звонЯт'],
    ['звонИт', 'v', 'звонИт — звонЯт, как горИт — горЯт'],
    ['звонЯт', 'v', 'звонИт — звонЯт, как горИт — горЯт'],
    ['исчЕрпать', 'v', 'чЕрпать — исчЕрпать'],
    ['кАшлянуть', 'v', 'кАшель — кАшлянуть'],
    ['клАла', 'v', KLALA],
    ['клЕить', 'v', 'клЕй — клЕить — клЕит'],
    ['крАла', 'v', KLALA],
    ['крАлась', 'v', 'крАсться — крАлась: ударение на основе'],
    ['кровоточИть', 'v', 'кровоточИть — кровоточАщий'],
    ['лгалА', 'v', 'лгАл — лгалА — лгАли'],
    ['лилА', 'v', 'лИл — лилА — лИли'],
    ['лилАсь', 'v', 'лилАсь — ударение на окончании'],
    ['навралА', 'v', 'врАл — навралА'],
    ['наделИт', 'v', 'наделИть — наделИт'],
    ['надорвалАсь', 'v', 'рвалА — надорвалАсь'],
    ['назвалАсь', 'v', 'звалА — назвалАсь'],
    ['накренИтся', 'v', 'крЕн, но накренИтся'],
    ['налилА', 'v', 'лилА — налилА'],
    ['нарвалА', 'v', 'рвалА — нарвалА'],
    ['начАть', 'v', 'начАть — нАчал — началА — нАчали'],
    ['нАчал', 'v', 'нАчал — началА — нАчали'],
    ['началА', 'v', 'нАчал — началА — нАчали'],
    ['нАчали', 'v', 'нАчал — началА — нАчали'],
    ['обзвонИт', 'v', 'звонИт — обзвонИт'],
    ['облегчИть', 'v', 'лЁгкий, но облегчИть — облегчИт'],
    ['облегчИт', 'v', 'облегчИть — облегчИт'],
    ['облилАсь', 'v', 'лилА — облилАсь'],
    ['обнялАсь', 'v', 'обнялАсь — ударение на окончании'],
    ['обогналА', 'v', 'гналА — обогналА'],
    ['ободралА', 'v', 'бралА — ободралА'],
    ['ободрИть', 'v', 'бОдрый, но ободрИть — ободрИт'],
    ['ободрИшься', 'v', 'ободрИться — ободрИшься'],
    ['обострИть', 'v', 'Острый, но обострИть'],
    ['одолжИть', 'v', 'одолжИть — одолжИт'],
    ['одолжИт', 'v', 'одолжИть — одолжИт'],
    ['озлОбить', 'v', 'злОба — озлОбить'],
    ['оклЕить', 'v', 'клЕить — оклЕить'],
    ['окружИт', 'v', 'окружИть — окружИт'],
    ['опОшлить', 'v', 'пОшлый — опОшлить'],
    ['освЕдомиться', 'v', 'освЕдомиться — освЕдомишься'],
    ['освЕдомишься', 'v', 'освЕдомиться — освЕдомишься'],
    ['отбылА', 'v', 'прибылА, отбылА — ударение на окончании'],
    ['отдалА', 'v', 'отдалА — ударение на окончании'],
    ['откУпорить', 'v', 'Как закУпорить'],
    ['отозвалА', 'v', 'звалА — отозвалА'],
    ['отозвалАсь', 'v', 'звалА — отозвалАсь'],
    ['перезвонИт', 'v', 'звонИт — перезвонИт'],
    ['перелилА', 'v', 'лилА — перелилА'],
    ['плодоносИть', 'v', 'плодоносИть — ударение на последнем слоге'],
    ['пломбировАть', 'v', 'пломбировАть, запломбировАть — не как дозИровать'],
    ['повторИт', 'v', 'повторИть — повторИт'],
    ['позвалА', 'v', 'звалА — позвалА'],
    ['позвонИшь', 'v', 'звонИшь — позвонИшь'],
    ['полилА', 'v', 'лилА — полилА'],
    ['положИл', 'v', 'положИть — положИл — положИла'],
    ['положИла', 'v', 'положИть — положИл — положИла'],
    ['понЯть', 'v', 'понЯть — пОнял — понялА — пОняли'],
    ['пОнял', 'v', 'пОнял — понялА — пОняли'],
    ['понялА', 'v', 'пОнял — понялА — пОняли'],
    ['пОняли', 'v', 'пОнял — понялА — пОняли'],
    ['послАла', 'v', KLALA],
    ['прибЫть', 'v', 'прибЫть — прИбыл — прибылА — прИбыло'],
    ['прИбыл', 'v', 'прИбыл — прибылА — прИбыло'],
    ['прибылА', 'v', 'прИбыл — прибылА — прИбыло'],
    ['прИбыло', 'v', 'прИбыл — прибылА — прИбыло'],
    ['принУдить', 'v', 'принУдить — принУдит'],
    ['принЯть', 'v', 'принЯть — прИнял — принялА — прИняли'],
    ['прИнял', 'v', 'прИнял — принялА — прИняли'],
    ['принялА', 'v', 'прИнял — принялА — прИняли'],
    ['прИняли', 'v', 'прИнял — принялА — прИняли'],
    ['рвалА', 'v', 'рвАл — рвалА — рвАли'],
    ['сверлИт', 'v', 'сверлИть — сверлИт'],
    ['снялА', 'v', 'снЯл — снялА — снЯли'],
    ['совралА', 'v', 'врАл — совралА'],
    ['создалА', 'v', 'создалА — ударение на окончании'],
    ['сорвалА', 'v', 'рвалА — сорвалА'],
    ['сорИт', 'v', 'сорИть — сорИт'],
    ['убралА', 'v', 'бралА — убралА'],
    ['углубИть', 'v', 'глубОкий — углубИть — углублЁнный'],
    ['укрепИт', 'v', 'крЕпкий, но укрепИт'],
    ['чЕрпать', 'v', 'чЕрпать — исчЕрпать'],
    ['щемИт', 'v', 'щемИть — щемИт'],
    ['щЁлкать', 'v', YO + ': щЁлкать, щЁлкнуть'],
    /* ---------- Причастия ---------- */
    ['включЁнный', 'prt', 'включИть — включЁнный — включЁн — включенА'],
    ['включенА', 'prt', 'включЁн — включенА — включенЫ'],
    ['довезЁнный', 'prt', 'довезтИ — довезЁнный'],
    ['зАгнутый', 'prt', 'зАгнутый, как сОгнутый'],
    ['зАнятый', 'prt', 'зАнятый — зАнят — занятА'],
    ['занятА', 'prt', 'зАнят — занятА — зАнято'],
    ['зАпертый', 'prt', 'зАпертый — зАперт — запертА'],
    ['запертА', 'prt', 'зАперт — запертА — зАперто'],
    ['заселЁнный', 'prt', 'заселЁнный — заселЁн — заселенА'],
    ['заселенА', 'prt', 'заселЁн — заселенА'],
    ['избалОванный', 'prt', 'баловАть, но избалОванный'],
    ['кормЯщий', 'prt', 'кормИть — кормЯщий'],
    ['кровоточАщий', 'prt', 'кровоточИть — кровоточАщий'],
    ['нажИвший', 'prt', 'нажИть — нажИвший'],
    ['налИвший', 'prt', 'налИть — налИвший'],
    ['нанЯвшийся', 'prt', 'нанЯться — нанЯвшийся'],
    ['начАвший', 'prt', 'начАть — начАвший'],
    ['облегчЁнный', 'prt', 'облегчИть — облегчЁнный'],
    ['ободрЁнный', 'prt', 'ободрИть — ободрЁнный'],
    ['обострЁнный', 'prt', 'обострИть — обострЁнный'],
    ['отключЁнный', 'prt', 'отключИть — отключЁнный'],
    ['повторЁнный', 'prt', 'повторИть — повторЁнный'],
    ['поделЁнный', 'prt', 'поделИть — поделЁнный'],
    ['понЯвший', 'prt', 'понЯть — понЯвший'],
    ['прИнятый', 'prt', 'прИнятый — прИнят — принятА'],
    ['приручЁнный', 'prt', 'приручИть — приручЁнный'],
    ['прожИвший', 'prt', 'прожИть — прожИвший'],
    ['снятА', 'prt', 'снЯт — снятА — снЯто'],
    ['сОгнутый', 'prt', 'сОгнутый, как зАгнутый'],
    ['углублЁнный', 'prt', 'углубИть — углублЁнный'],
    /* ---------- Деепричастия ---------- */
    ['балУясь', 'dpr', 'баловАться — балУюсь — балУясь'],
    ['закУпорив', 'dpr', 'закУпорить — закУпорив'],
    ['начАв', 'dpr', 'начАть — начАв'],
    ['начАвшись', 'dpr', 'начАться — начАвшись'],
    ['отдАв', 'dpr', 'отдАть — отдАв'],
    ['поднЯв', 'dpr', 'поднЯть — поднЯв'],
    ['понЯв', 'dpr', 'понЯть — понЯв'],
    ['прибЫв', 'dpr', 'прибЫть — прибЫв'],
    ['создАв', 'dpr', 'создАть — создАв'],
    /* ---------- Наречия ---------- */
    ['взАперти', 'adv', 'взАперти — ударение на втором слоге'],
    ['вОвремя', 'adv', 'вОвремя — ударение на первом слоге'],
    ['добелА', 'adv', 'добелА — ударение на последнем слоге'],
    ['дОверху', 'adv', 'дОверху, дОнизу — ударение на приставке'],
    ['донЕльзя', 'adv', 'донЕльзя — ударение на втором слоге'],
    ['дОнизу', 'adv', 'дОнизу, дОверху — ударение на приставке'],
    ['досУха', 'adv', 'досУха — ударение на втором слоге'],
    ['зАвидно', 'adv', 'зАвидно — ударение на первом слоге'],
    ['зАгодя', 'adv', 'зАгодя (заранее) — ударение на приставке'],
    ['зАсветло', 'adv', 'зАсветло, зАтемно — ударение на приставке'],
    ['зАтемно', 'adv', 'зАтемно, зАсветло — ударение на приставке'],
    ['надОлго', 'adv', 'надОлго, ненадОлго'],
    ['ненадОлго', 'adv', 'ненадОлго, как надОлго']
  ];

  var VOWELS = 'аеёиоуыэюя';
  var POS = [['all', 'Все части речи'], ['n', 'Существительные'], ['adj', 'Прилагательные'], ['v', 'Глаголы'], ['prt', 'Причастия'], ['dpr', 'Деепричастия'], ['adv', 'Наречия']];
  var POS_SHORT = { n: 'сущ.', adj: 'прил.', v: 'глаг.', prt: 'прич.', dpr: 'дееприч.', adv: 'нареч.' };
  var ROUND = 20;
  var KEY = 'kletka.lab.stress';

  function parse(e) {
    var raw = e[0], lower = raw.toLowerCase(), stress = -1, vowels = [];
    for (var i = 0; i < raw.length; i++) {
      if (raw[i] !== lower[i]) stress = i;
      if (VOWELS.indexOf(lower[i]) >= 0) vowels.push(i);
    }
    return { id: raw, lower: lower, stress: stress, vowels: vowels, pos: e[1], hint: e[2] || '' };
  }
  var WORDS = RAW.map(parse);

  /* ================= Утилиты ================= */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }
  /* Слово с выделенной ударной (заглавной) буквой; mark — индекс выделяемой гласной. */
  function marked(w, mark, noYo) {
    var s = '';
    for (var i = 0; i < w.lower.length; i++) {
      var c = w.lower[i];
      if (noYo && c === 'ё') c = 'е';
      s += i === mark ? '<b class="lb-st-acc">' + esc(c.toUpperCase()) + '</b>' : esc(c);
    }
    return s;
  }
  /* Форма «как в бланке»: только заглавная буква, без цвета. В неверном варианте ё пишется как е. */
  function plainMarked(w, mark) {
    var s = '';
    for (var i = 0; i < w.lower.length; i++) {
      var c = w.lower[i];
      if (mark !== w.stress && c === 'ё') c = 'е';
      s += i === mark ? c.toUpperCase() : c;
    }
    return s;
  }
  function correctHtml(w) { return marked(w, w.stress, false); }

  /* ================= Прогресс ================= */
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (!d || typeof d !== 'object') d = {};
      if (!d.w || typeof d.w !== 'object') d.w = {};
      return d;
    } catch (e) { return { w: {} }; }
  }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* хранилище недоступно */ } }
  /* rec: [ячейка 0–5, число ошибок, число показов] */
  function recOf(d, id) { var r = d.w[id]; return Array.isArray(r) ? r : [0, 0, 0]; }
  function isMistake(d, id) { var r = recOf(d, id); return r[1] > 0 && r[0] < 2; }
  function mark(id, ok) {
    var d = load(), r = recOf(d, id).slice();
    r[2]++;
    if (ok) r[0] = Math.min(5, r[0] + 1); else { r[0] = 0; r[1]++; }
    d.w[id] = r;
    save(d);
    return d;
  }
  function weight(d, w) {
    var r = d.w[w.id];
    if (!Array.isArray(r) || !r[2]) return 3;
    if (r[0] === 0) return 6;
    return [6, 3.5, 2, 1, 0.6, 0.35][r[0]] || 0.35;
  }
  function weightedSample(list, n, wf) {
    var pool = list.map(function (x) { return { x: x, k: Math.pow(Math.random(), 1 / Math.max(0.01, wf(x))) }; });
    pool.sort(function (a, b) { return b.k - a.k; });
    return pool.slice(0, n).map(function (p) { return p.x; });
  }

  /* ================= Стили ================= */
  var CSS = [
    '.lb-st{display:flex;flex-direction:column;gap:12px;min-width:0}',
    '.lb-st-top{display:flex;flex-wrap:wrap;gap:10px 16px;align-items:flex-end}',
    '.lb-st-top .grow{flex:1}',
    '.lb-st .seg button[aria-pressed="true"]{background:var(--sheet);color:var(--ink);box-shadow:0 1px 2px rgba(0,0,0,.08)}',
    '.lb-st-card{border:1px solid var(--line);border-radius:10px;padding:14px 12px;display:flex;flex-direction:column;gap:8px;min-height:230px;',
    'background:var(--sheet);background-image:repeating-linear-gradient(transparent 0 23px,var(--grid) 23px 24px)}',
    '.lb-st-meta{display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;font-size:13px;color:var(--muted)}',
    '.lb-st .game-word{padding:10px 0 6px;overflow-wrap:anywhere}',
    '.lb-st .game-word button{min-height:44px;touch-action:manipulation}',
    '.lb-st .game-word button[disabled]{cursor:default;opacity:1}',
    '.lb-st .game-word button.v[disabled]:not(.ok):not(.bad){color:var(--muted);border-bottom-color:transparent}',
    '.lb-st .game-word button.v[disabled]:hover{background:none}',
    '.lb-st-fb{text-align:center;min-height:3.4em;font-size:15px;line-height:1.5}',
    '.lb-st-fb .lb-st-res{font:700 22px var(--f-hand);margin-right:6px}',
    '.lb-st-fb .ok{color:var(--ok)}.lb-st-fb .bad{color:var(--red)}',
    '.lb-st-w{font-size:19px;font-weight:600}',
    '.lb-st-acc{color:var(--red);font-weight:800}',
    '.lb-st-hint{display:block;color:var(--muted);font-size:14px;margin-top:2px}',
    '.lb-st-act{display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap}',
    '.lb-st-keys{font-size:12.5px;color:var(--muted);text-align:center}',
    '.lb-st-keys kbd{font:600 11.5px var(--f-mono);border:1px solid var(--line);border-bottom-width:2px;border-radius:4px;padding:0 4px;background:var(--sheet-2)}',
    '.lb-st-q{font-size:15px}',
    '.lb-st-ex{list-style:none;margin:0;padding:0;display:grid;gap:6px}',
    '.lb-st .lb-st-ex label{display:flex;flex-direction:row;align-items:center;gap:10px;padding:8px 12px;border:1.5px solid var(--line);border-radius:8px;',
    'background:var(--sheet);color:var(--text);font:600 20px var(--f-body);letter-spacing:.02em;cursor:pointer;min-width:0;flex-wrap:wrap}',
    '.lb-st .lb-st-ex label:hover{border-color:var(--grid-strong)}',
    '.lb-st-ex input{width:20px;height:20px;accent-color:var(--ink);margin:0;flex:none}',
    '.lb-st-ex .n{font:600 14px var(--f-mono);color:var(--muted);flex:none}',
    '.lb-st-ex .v{overflow-wrap:anywhere}',
    '.lb-st-ex small{margin-left:auto;font:500 13.5px var(--f-body);letter-spacing:0;color:var(--muted)}',
    '.lb-st-ex li.ok label{border-color:var(--ok);background:var(--ok-soft)}',
    '.lb-st-ex li.bad label{border-color:var(--red);background:var(--red-soft)}',
    '.lb-st-ex li.ok small{color:var(--ok)}.lb-st-ex li.bad small{color:var(--red)}',
    '.lb-st-sum{display:flex;flex-direction:column;gap:10px;align-items:center;text-align:center}',
    '.lb-st-sum .big{font:700 40px/1 var(--f-hand);color:var(--ink)}',
    '.lb-st-sum ul{list-style:none;margin:0;padding:0;display:grid;gap:4px;text-align:left;width:100%;max-width:520px}',
    '.lb-st-sum li{padding:6px 10px;border-radius:6px;background:var(--red-soft)}',
    '.lb-st-sum li .lb-st-hint{font-size:13px}',
    '.lb-st-empty{text-align:center;color:var(--muted);padding:30px 10px}',
    '.lb-st-bar{height:5px;background:var(--sheet-2);border-radius:3px;overflow:hidden}',
    '.lb-st-bar i{display:block;height:100%;background:var(--ink);border-radius:3px;transition:width .3s}'
  ].join('\n');
  function injectCss() {
    if (document.getElementById('lab-stress-css')) return;
    var st = document.createElement('style');
    st.id = 'lab-stress-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ================= Интерфейс ================= */
  function mount(el) {
    injectCss();
    var root = document.createElement('div');
    root.className = 'lb-st';
    root.innerHTML =
      '<div class="lb-st-top">' +
        '<div class="seg" role="group" aria-label="Режим">' +
          '<button type="button" data-mode="drill" aria-pressed="true">Тренировка</button>' +
          '<button type="button" data-mode="exam" aria-pressed="false">Как на экзамене</button>' +
        '</div>' +
        '<label>Часть речи<select data-f="pos">' + POS.map(function (p) { return '<option value="' + p[0] + '">' + p[1] + '</option>'; }).join('') + '</select></label>' +
        '<label class="inline"><input type="checkbox" data-f="mist"> <span>Только мои ошибки (<span data-o="mcount">0</span>)</span></label>' +
        '<span class="grow"></span>' +
        '<button type="button" class="btn sm ghost" data-act="reset">Сбросить прогресс</button>' +
      '</div>' +
      '<div class="score-row" aria-live="off">' +
        '<span>Верно: <b data-o="ok">0</b></span><span>Ошибок: <b data-o="bad">0</b></span>' +
        '<span>Серия: <b data-o="streak">0</b></span><span>Рекорд: <b data-o="best">0</b></span>' +
      '</div>' +
      '<div class="lb-st-card" data-o="card"></div>' +
      '<p class="lab-note">Словник — орфоэпический словник ФИПИ к заданию 4 ЕГЭ (' + WORDS.length + ' ' + plural(WORDS.length, 'слово', 'слова', 'слов') + '). Слова, в которых вы ошиблись, возвращаются через несколько карточек и попадают в режим «Только мои ошибки». Буква ё в тренировке показана как е — иначе ударение было бы подсказано.</p>';
    el.appendChild(root);

    function q(s) { return root.querySelector(s); }
    function o(name) { return root.querySelector('[data-o="' + name + '"]'); }
    var card = o('card');
    var selPos = q('[data-f="pos"]'), chkMist = q('[data-f="mist"]');

    var S = {
      mode: 'drill', ok: 0, bad: 0, streak: 0,
      queue: [], qi: 0, mainTotal: 0, mainDone: 0, firstOk: 0, mistakes: [], answered: false, cur: null,
      exam: null, examChecked: false
    };
    var data = load();
    var best = data.best || 0;

    function pool() {
      data = load();
      var p = selPos.value;
      var list = WORDS.filter(function (w) { return p === 'all' || w.pos === p; });
      if (chkMist.checked) list = list.filter(function (w) { return isMistake(data, w.id); });
      return list;
    }
    function updateCounts() {
      data = load();
      var p = selPos.value;
      var n = WORDS.filter(function (w) { return (p === 'all' || w.pos === p) && isMistake(data, w.id); }).length;
      o('mcount').textContent = n;
      o('ok').textContent = S.ok;
      o('bad').textContent = S.bad;
      o('streak').textContent = S.streak;
      o('best').textContent = best;
    }
    function hit(ok) {
      if (ok) {
        S.ok++; S.streak++;
        if (S.streak > best) {
          best = S.streak;
          var d = load(); d.best = best; save(d);
        }
      } else { S.bad++; S.streak = 0; }
    }

    /* ---------- Тренировка ---------- */
    function startRound(list) {
      var src = list || pool();
      if (!src.length) {
        card.innerHTML = '<div class="lb-st-empty">' + (chkMist.checked
          ? '<p class="hand" style="font-size:26px;color:var(--ok)">Ошибок нет!</p><p>В этой группе нет слов, в которых вы ошибались. Снимите галочку «Только мои ошибки», чтобы тренироваться на всём словнике.</p>'
          : '<p>Слов в этой группе нет.</p>') + '</div>';
        S.queue = []; S.cur = null;
        return;
      }
      var picked = list ? shuffle(list).slice(0, ROUND) : weightedSample(src, Math.min(ROUND, src.length), function (w) { return weight(data, w); });
      S.queue = picked.map(function (w) { return { w: w, stage: 0 }; });
      S.qi = 0; S.mainTotal = picked.length; S.mainDone = 0; S.firstOk = 0; S.mistakes = [];
      showWord();
    }
    function showWord(focus) {
      if (S.qi >= S.queue.length) { summary(); return; }
      var item = S.queue[S.qi], w = item.w;
      S.cur = item; S.answered = false;
      var letters = '';
      var vn = 0;
      for (var i = 0; i < w.lower.length; i++) {
        var c = w.lower[i] === 'ё' ? 'е' : w.lower[i];
        if (w.vowels.indexOf(i) >= 0) {
          vn++;
          letters += '<button type="button" class="v" data-i="' + i + '" aria-label="Гласная «' + c + '», ' + vn + '-й слог">' + esc(c) + '</button>';
        } else letters += '<span aria-hidden="true">' + esc(c) + '</span>';
      }
      var num = item.stage ? '' : 'Слово ' + (S.mainDone + 1) + ' из ' + S.mainTotal;
      card.innerHTML =
        '<div class="lb-st-bar" aria-hidden="true"><i style="width:' + Math.round(S.mainDone / S.mainTotal * 100) + '%"></i></div>' +
        '<div class="lb-st-meta"><span class="chip">' + POS_SHORT[w.pos] + '</span>' +
          (num ? '<span>' + num + '</span>' : '<span class="chip warn">Повтор ошибки</span>') + '</div>' +
        '<div class="game-word" role="group" aria-label="Слово «' + esc(w.lower.replace(/ё/g, 'е')) + '»: выберите ударную гласную">' + letters + '</div>' +
        '<div class="lb-st-fb" aria-live="polite"></div>' +
        '<div class="lb-st-act"><button type="button" class="btn primary" data-act="next" hidden>Дальше</button></div>' +
        '<p class="lb-st-keys"><kbd>1</kbd>–<kbd>' + w.vowels.length + '</kbd> — номер гласной, <kbd>←</kbd> <kbd>→</kbd> — выбор, <kbd>Enter</kbd> — дальше</p>';
      var bs = card.querySelectorAll('.game-word button');
      for (var k = 0; k < bs.length; k++) bs[k].tabIndex = k === 0 ? 0 : -1;
      if (focus && bs[0]) bs[0].focus();
    }
    function answer(idx) {
      if (S.answered || !S.cur) return;
      S.answered = true;
      var item = S.cur, w = item.w, ok = idx === w.stress;
      var bs = card.querySelectorAll('.game-word button');
      for (var k = 0; k < bs.length; k++) {
        var i = +bs[k].dataset.i;
        bs[k].disabled = true;
        if (i === w.stress) { bs[k].classList.add('ok'); if (w.lower[i] === 'ё') bs[k].textContent = 'ё'; }
        else if (i === idx) bs[k].classList.add('bad');
      }
      hit(ok);
      data = mark(w.id, ok);
      if (!item.stage) {
        S.mainDone++;
        if (ok) S.firstOk++;
        else S.mistakes.push(w);
      }
      /* Интервальное возвращение: ошибка — через 3 карточки; верный повтор — ещё раз через 7. */
      if (!ok) insertAt(S.qi + 4, { w: w, stage: 1 });
      else if (item.stage === 1) insertAt(S.qi + 8, { w: w, stage: 2 });
      var fb = card.querySelector('.lb-st-fb');
      fb.innerHTML = (ok
        ? '<span class="lb-st-res ok">Верно!</span> <span class="lb-st-w">' + correctHtml(w) + '</span>'
        : '<span class="lb-st-res bad">Нет.</span> Правильно: <span class="lb-st-w">' + correctHtml(w) + '</span>') +
        (w.hint ? '<span class="lb-st-hint">' + esc(w.hint) + '</span>' : '');
      var nx = card.querySelector('[data-act="next"]');
      nx.hidden = false;
      nx.textContent = S.qi + 1 >= S.queue.length ? 'Итоги раунда' : 'Дальше';
      nx.focus();
      updateCounts();
    }
    function insertAt(pos, item) {
      pos = Math.min(pos, S.queue.length);
      S.queue.splice(pos, 0, item);
    }
    function next() {
      if (!S.answered) return;
      S.qi++;
      showWord(true);
    }
    function summary() {
      S.cur = null;
      var n = S.mainTotal, k = S.firstOk;
      var verdict = k === n ? 'Идеально!' : k >= n * 0.85 ? 'Отлично!' : k >= n * 0.6 ? 'Хорошо, но есть над чем поработать' : 'Слова стоит повторить';
      var seen = {};
      var uniq = S.mistakes.filter(function (w) { if (seen[w.id]) return false; seen[w.id] = 1; return true; });
      card.innerHTML =
        '<div class="lb-st-sum">' +
          '<span class="eyebrow">Итог раунда</span>' +
          '<span class="big">' + k + ' из ' + n + '</span>' +
          '<p>' + verdict + '. Верно с первой попытки: ' + k + ' ' + plural(k, 'слово', 'слова', 'слов') + '.</p>' +
          (uniq.length ? '<p class="muted" style="font-size:14px">Ошибки этого раунда — запомните по связкам:</p><ul>' + uniq.map(function (w) {
            return '<li><span class="lb-st-w">' + correctHtml(w) + '</span>' + (w.hint ? '<span class="lb-st-hint">' + esc(w.hint) + '</span>' : '') + '</li>';
          }).join('') + '</ul>' : '') +
          '<div class="lb-st-act">' +
            '<button type="button" class="btn primary" data-act="again">Новый раунд</button>' +
            (uniq.length ? '<button type="button" class="btn" data-act="redo">Повторить ошибки раунда</button>' : '') +
          '</div>' +
        '</div>';
      S.lastMistakes = uniq;
      var b = card.querySelector('[data-act="again"]');
      if (b && root.contains(document.activeElement)) b.focus();
    }

    /* ---------- Как на экзамене ---------- */
    function startExam(focus) {
      var src = pool();
      if (src.length < 5) src = chkMist.checked ? src.concat(WORDS.filter(function (w) { return src.indexOf(w) < 0; })) : WORDS;
      var picks = weightedSample(src.filter(function (w) { return src.length < 5 || true; }), 5, function (w) { return weight(data, w); });
      var nOk = [1, 2, 2, 2, 3, 3, 3, 4][Math.floor(Math.random() * 8)];
      var okIdx = shuffle([0, 1, 2, 3, 4]).slice(0, nOk);
      S.exam = picks.map(function (w, i) {
        var right = okIdx.indexOf(i) >= 0, m = w.stress;
        if (!right) {
          var si = w.vowels.indexOf(w.stress), cand = [];
          if (si > 0) cand.push(w.vowels[si - 1]);
          if (si < w.vowels.length - 1) cand.push(w.vowels[si + 1]);
          m = cand[Math.floor(Math.random() * cand.length)];
        }
        return { w: w, m: m, right: right };
      });
      S.examChecked = false;
      card.innerHTML =
        '<p class="lb-st-q"><b>Задание 4.</b> Укажите варианты ответов, в которых верно выделена буква, обозначающая ударный гласный звук. Запишите номера ответов.</p>' +
        '<ol class="lb-st-ex">' + S.exam.map(function (x, i) {
          return '<li><label><input type="checkbox" value="' + i + '"><span class="n">' + (i + 1) + ')</span><span class="v">' + esc(plainMarked(x.w, x.m)) + '</span><small></small></label></li>';
        }).join('') + '</ol>' +
        '<div class="lb-st-fb" aria-live="polite"></div>' +
        '<div class="lb-st-act"><button type="button" class="btn primary" data-act="check">Проверить</button></div>' +
        '<p class="lb-st-keys"><kbd>1</kbd>–<kbd>5</kbd> — отметить вариант, <kbd>Enter</kbd> — проверить и дальше</p>';
      if (focus) { var f = card.querySelector('.lb-st-ex input'); if (f) f.focus(); }
    }
    function checkExam() {
      if (!S.exam || S.examChecked) return;
      S.examChecked = true;
      var boxes = card.querySelectorAll('.lb-st-ex input');
      var chosen = [], right = [];
      S.exam.forEach(function (x, i) {
        var li = boxes[i].closest('li'), small = li.querySelector('small');
        boxes[i].disabled = true;
        if (boxes[i].checked) chosen.push(i + 1);
        if (x.right) right.push(i + 1);
        li.classList.add(x.right ? 'ok' : 'bad');
        small.innerHTML = x.right ? 'верно' : 'неверно: ' + correctHtml(x.w);
        data = mark(x.w.id, boxes[i].checked === x.right);
      });
      var full = chosen.join('') === right.join('');
      hit(full);
      var fb = card.querySelector('.lb-st-fb');
      fb.innerHTML = (full ? '<span class="lb-st-res ok">Верно!</span> 1 балл.' : '<span class="lb-st-res bad">Не засчитано.</span> Балл ставится только за полное совпадение.') +
        '<span class="lb-st-hint">Ответ: <b class="mono">' + right.join('') + '</b>' + (full ? '' : ' · ваш ответ: <b class="mono">' + (chosen.join('') || '—') + '</b>') + '</span>';
      var b = card.querySelector('[data-act="check"]');
      b.textContent = 'Следующее задание';
      b.dataset.act = 'exam-next';
      b.focus();
      updateCounts();
    }

    /* ---------- События ---------- */
    function setMode(m) {
      S.mode = m;
      var bs = root.querySelectorAll('[data-mode]');
      for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].dataset.mode === m ? 'true' : 'false');
      restart();
    }
    function restart(focus) { if (S.mode === 'exam') startExam(focus); else { startRound(); if (focus) { var b = card.querySelector('.game-word button'); if (b) b.focus(); } } }

    root.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t || !root.contains(t)) return;
      if (t.dataset.mode) { if (t.dataset.mode !== S.mode) setMode(t.dataset.mode); return; }
      if (t.dataset.i != null && t.closest('.game-word')) { answer(+t.dataset.i); return; }
      var a = t.dataset.act;
      if (a === 'next') next();
      else if (a === 'again') restart(true);
      else if (a === 'redo') { startRound(S.lastMistakes || []); var b = card.querySelector('.game-word button'); if (b) b.focus(); }
      else if (a === 'check') checkExam();
      else if (a === 'exam-next') startExam(true);
      else if (a === 'reset') {
        if (t.dataset.confirm) {
          save({ w: {}, best: 0 });
          best = 0; S.ok = 0; S.bad = 0; S.streak = 0;
          delete t.dataset.confirm; t.textContent = 'Сбросить прогресс';
          updateCounts(); restart();
        } else {
          t.dataset.confirm = '1'; t.textContent = 'Точно сбросить?';
          setTimeout(function () { if (t.dataset.confirm) { delete t.dataset.confirm; t.textContent = 'Сбросить прогресс'; } }, 4000);
        }
      }
    });
    selPos.addEventListener('change', function () { updateCounts(); restart(); });
    chkMist.addEventListener('change', function () { updateCounts(); restart(); });

    root.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var tg = e.target;
      if (tg.tagName === 'SELECT' || tg.tagName === 'TEXTAREA' || (tg.tagName === 'INPUT' && tg.type !== 'checkbox')) return;
      if (tg.closest('.lb-st-top')) return;
      var d = /^[1-9]$/.test(e.key) ? +e.key : 0;
      if (S.mode === 'drill') {
        if (!S.cur) return;
        var w = S.cur.w;
        if (d && !S.answered) { if (d <= w.vowels.length) { e.preventDefault(); answer(w.vowels[d - 1]); } return; }
        if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !S.answered) {
          var bs = Array.prototype.slice.call(card.querySelectorAll('.game-word button'));
          if (!bs.length) return;
          var i = bs.indexOf(document.activeElement);
          i = i < 0 ? 0 : (i + (e.key === 'ArrowRight' ? 1 : -1) + bs.length) % bs.length;
          bs.forEach(function (b, k) { b.tabIndex = k === i ? 0 : -1; });
          bs[i].focus();
          e.preventDefault();
          return;
        }
        if (e.key === 'Enter' && S.answered && tg.tagName !== 'BUTTON') { e.preventDefault(); next(); }
      } else {
        if (!S.exam) return;
        if (d && d <= 5 && !S.examChecked) {
          var cb = card.querySelectorAll('.lb-st-ex input')[d - 1];
          if (cb) { e.preventDefault(); cb.checked = !cb.checked; }
          return;
        }
        if (e.key === 'Enter' && tg.tagName !== 'BUTTON') {
          e.preventDefault();
          if (S.examChecked) startExam(true); else checkExam();
        }
      }
    });

    updateCounts();
    startRound();
  }

  KL.labs.stress = {
    title: 'Тренажёр ударений',
    icon: 'А́',
    desc: 'Словник ФИПИ к заданию 4 ЕГЭ: ставьте ударение кликом, ошибки возвращаются',
    long: 'Слова из орфоэпического словника ФИПИ: выберите ударную гласную, получите связку для запоминания. Ошибки повторяются через несколько карточек, а режим «Как на экзамене» воспроизводит задание 4 ЕГЭ.',
    subjectName: 'Русский язык',
    mount: mount,
    _words: WORDS
  };
})();
