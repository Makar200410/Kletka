/* Статические страницы для поисковиков: node tools/build-pages.js
   Из js/data и js/viz собирает обычные HTML-страницы:
     /s/<предмет>/index.html          — предмет: формат экзаменов и список тем
     /s/<предмет>/<тема>/index.html   — тема: шпаргалка, вся теория, рисунки
   и пересобирает sitemap.xml. Сам тренажёр (задания, пробник, карточки) остаётся
   в приложении по адресам /#/…; страницы ведут туда кнопками.
   Запускать после любых изменений контента, результат коммитить вместе с ним. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE = 'https://kletka.himpodgotovka.ru';
const root = path.join(__dirname, '..');
const out = path.join(root, 's');

/* ---------- загрузка данных и рисунков ---------- */
const win = { KL: {} };
win.window = win;
const ctx = vm.createContext(win);
const run = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
const subjects = [];
win.KL.addSubject = (s) => subjects.push(s);
run(path.join(root, 'js/viz.js'));
for (const f of fs.readdirSync(path.join(root, 'js/viz')).sort()) run(path.join(root, 'js/viz', f));
for (const f of fs.readdirSync(path.join(root, 'js/data')).sort()) if (f !== 'registry.js') run(path.join(root, 'js/data', f));
const V = win.KL.viz;

const ORDER = ['math', 'russian', 'physics', 'chemistry', 'biology', 'informatics', 'history', 'social', 'english', 'geography'];
subjects.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
const GLYPH = { math: 'x²', russian: 'Ёё', physics: 'λ', chemistry: 'H₂O', biology: 'ДНК', informatics: '01', history: '862', social: '§', english: 'Aa', geography: '60°' };
const LABS = { periodic: 'Таблица Менделеева', graph: 'Графики функций', projectile: 'Бросок под углом', numsys: 'Системы счисления', truth: 'Таблицы истинности', stress: 'Тренажёр ударений', timeline: 'Хронология', punnett: 'Решётка Пеннета', verbs: 'Неправильные глаголы', sun: 'Высота Солнца и время' };

/* ---------- общие куски из index.html ---------- */
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const pick = (re) => { const m = indexHtml.match(re); return m ? m[0] : ''; };
const metrika = pick(/<!-- Yandex\.Metrika counter -->[\s\S]*?<!-- \/Yandex\.Metrika counter -->/);
const metrikaNoscript = pick(/<noscript><div><img src="https:\/\/mc\.yandex\.ru[^]*?<\/noscript>/);
const fonts = pick(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/);
const cssV = (indexHtml.match(/css\/app\.css\?v=([\w]+)/) || [])[1] || '1';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const strip = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\$+([^$]*)\$+/g, '$1').replace(/\\[a-z]+/gi, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);
const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
const examName = (m) => (m === 'oge' ? 'ОГЭ' : 'ЕГЭ');
const refsText = (t) => ['oge', 'ege'].filter((m) => t.refs && t.refs[m]).map((m) => examName(m) + ' № ' + t.refs[m]).join(' · ');

function page({ url, title, desc, crumbs, cta, body, sid }) {
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${SITE}${url}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Клетка">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${SITE}${url}">
  <meta property="og:locale" content="ru_RU">
  <meta name="theme-color" content="#1f3fa6">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  ${fonts}
  <link rel="stylesheet" href="/css/app.css?v=${cssV}">
  <script>try { var t = JSON.parse(localStorage.getItem('kletka.v1') || '{}').theme; if (t) document.documentElement.dataset.theme = t; } catch (e) {}</script>
  ${metrika}
</head>
<body class="static-page">
  ${metrikaNoscript}
  <header class="top"><div class="top-in">
    <a class="logo" href="/" aria-label="Клетка — на главную"><span class="logo-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="logo-text">Клетка</span></a>
    <nav class="nav static-nav" aria-label="Разделы"><a href="/">Тренажёр</a><a href="/#/exam">Пробник</a><a href="/#/cards${sid ? '/' + sid : ''}">Карточки</a><a href="/#/labs">Лаборатория</a></nav>
    <div class="top-right"><a class="btn primary sm" href="${cta.href}">${esc(cta.label)}</a></div>
  </div></header>
  <main>
    <nav class="crumbs" aria-label="Навигация">${crumbs.map((c, i) => (i < crumbs.length - 1 ? `<a href="${c[1]}">${esc(c[0])}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${esc(c[0])}</span>`)).join('')}</nav>
${body}
  </main>
  <footer class="foot">
    <span>Клетка — бесплатный тренажёр для подготовки к ОГЭ и ЕГЭ. Задания составлены по образцу демоверсий ФИПИ.</span>
    <nav class="static-subjects" aria-label="Предметы">${subjects.map((s) => `<a href="/s/${s.id}/">${esc(s.name)}</a>`).join('')}</nav>
  </footer>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js" defer></script>
  <script>
    window.addEventListener('DOMContentLoaded', function () {
      if (window.renderMathInElement) renderMathInElement(document.querySelector('main'), { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], output: 'mathml', throwOnError: false, ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] });
    });
  </script>
</body>
</html>
`;
}

/* Теория для статической страницы: лаборатории → ссылки, вставки рисунков → SVG, мини-проверки → вопрос с раскрывающимся ответом */
function staticTheory(html) {
  return String(html)
    .replace(/<div class="lab-embed" data-lab="([\w-]+)"[^>]*><\/div>/g, (m, id) => `<p class="static-lab"><a class="btn" href="/#/labs/${id}">Интерактив «${esc(LABS[id] || id)}» — открыть в тренажёре →</a></p>`)
    .replace(/<div class="viz" data-viz="([\w-]+)"[^>]*><\/div>/g, (m, name) => V.figure(name) || '')
    .replace(/<div class="quick" data-a="([^"]*)"[^>]*>([\s\S]*?)<\/div>/g, (m, a, q) => `<details class="static-quick"><summary><b>Проверь себя.</b> ${q}</summary><p>Ответ: <b>${esc(a.split('|')[0])}</b></p></details>`);
}

/* ---------- генерация ---------- */
fs.rmSync(out, { recursive: true, force: true });
const urls = [];
let topicCount = 0;

for (const s of subjects) {
  const sUrl = `/s/${s.id}/`;
  urls.push(sUrl);
  const nTasks = s.topics.reduce((a, t) => a + t.tasks.length, 0);
  const examCard = (m) => {
    const e = s.exams && s.exams[m];
    if (!e) return '';
    return `<section class="exam-card sheet static-exam"><span class="eyebrow">${examName(m)}</span><b style="font-size:17px">${esc(e.title)}</b>
      <div class="exam-facts"><div><b>${esc(e.tasks)}</b><span>заданий</span></div><div><b>${esc(e.time)}</b><span>длительность</span></div><div><b>${esc(e.maxPrimary)}</b><span>перв. баллов</span></div></div>
      ${e.minScore ? `<p><span class="chip red">Минимум ${esc(e.minScore)} тестовых баллов</span></p>` : ''}<p>${esc(e.structure)}</p><p class="muted"><b>Совет.</b> ${esc(e.tip)}</p></section>`;
  };
  const sBody = `
    <header class="topic-head"><span class="eyebrow">Подготовка к ОГЭ и ЕГЭ</span><h1>${esc(s.name)}: теория и задания для ОГЭ и ЕГЭ</h1>
      <p class="topic-summary">${esc(s.tagline)}. ${s.topics.length} ${plural(s.topics.length, 'тема', 'темы', 'тем')} с теорией, ${nTasks} ${plural(nTasks, 'задание', 'задания', 'заданий')} в формате ФИПИ с проверкой и разбором, ${(s.cards || []).length} флеш-карточек.</p>
      <p><a class="btn primary" href="/#/s/${s.id}">Открыть тренажёр по предмету</a> <a class="btn" href="/#/exam/${s.id}">Пробный вариант</a></p></header>
    <div class="static-exams">${examCard('oge')}${examCard('ege')}</div>
    <section class="section"><div class="section-head"><h2>Темы</h2><span class="muted">Номера заданий — по демоверсиям ФИПИ</span></div>
    <ol class="toc-list">${s.topics.map((t, i) => `<li><a class="toc-row" href="/s/${s.id}/${t.id}/"><span class="toc-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span><span class="toc-main"><b>${esc(t.title)}</b><span class="toc-meta"><span>${esc(t.summary)}</span></span><span class="toc-meta">${refsText(t) ? `<span class="mono">${refsText(t)}</span>` : ''}<span>${t.minutes || 15} мин чтения</span><span>${t.tasks.length} ${plural(t.tasks.length, 'задание', 'задания', 'заданий')}</span></span></span></a></li>`).join('')}</ol></section>`;
  const sDesc = cut(`${s.name} — подготовка к ОГЭ и ЕГЭ: ${s.topics.length} тем с теорией, ${nTasks} заданий в формате ФИПИ с проверкой и разбором, пробные варианты. ${s.tagline}.`, 200);
  fs.mkdirSync(path.join(out, s.id), { recursive: true });
  fs.writeFileSync(path.join(out, s.id, 'index.html'), page({
    url: sUrl, sid: s.id, title: `${s.name}: подготовка к ОГЭ и ЕГЭ — теория и задания | Клетка`, desc: sDesc,
    crumbs: [['Клетка', '/'], [s.name, sUrl]], cta: { href: `/#/s/${s.id}`, label: 'Решать задания' }, body: sBody
  }));

  s.topics.forEach((t, ti) => {
    const tUrl = `/s/${s.id}/${t.id}/`;
    urls.push(tUrl);
    topicCount++;
    const counter = { n: 0 };
    const theory = t.theory.map((sec, i) => `<h2 id="sec-${i}"><span class="sec-n" aria-hidden="true">${i + 1}.</span>${esc(sec.h)}</h2>${staticTheory(sec.html)}${V.forSection(t.id, i, counter)}`).join('\n');
    const prev = s.topics[ti - 1], next = s.topics[ti + 1];
    const levels = [1, 2, 3].map((d) => t.tasks.filter((q) => (q.difficulty || 1) === d).length);
    const exams = (t.exam || []).map(examName).join(' и ');
    const tBody = `
    <header class="topic-head"><span class="eyebrow">${esc(s.name)} · тема ${ti + 1} из ${s.topics.length}${refsText(t) ? ' · ' + refsText(t) : ''}</span><h1>${esc(t.title)}</h1><p class="topic-summary">${esc(t.summary)}</p>
      <div class="topic-meta"><span class="chip">${t.minutes || 15} мин чтения</span>${(t.exam || []).map((m) => `<span class="chip ink">${examName(m)}</span>`).join('')}<span class="chip">${t.tasks.length} ${plural(t.tasks.length, 'задание', 'задания', 'заданий')}</span></div></header>
    <section class="page cheat" aria-labelledby="cheat-h"><div class="cheat-title"><h2 class="hand" id="cheat-h">Коротко</h2><span class="muted">главное за 30 секунд</span></div><ol>${t.keyPoints.map((k) => `<li>${k}</li>`).join('')}</ol></section>
    <article class="page"><div class="prose">${theory}</div></article>
    <section class="section static-cta sheet"><div><span class="eyebrow">Практика</span><h2>Закрепите тему: ${t.tasks.length} ${plural(t.tasks.length, 'задание', 'задания', 'заданий')} ${exams ? 'для ' + exams : ''}</h2>
      <p class="muted">От простых к сложным: базовый уровень — ${levels[0]}, повышенный — ${levels[1]}, высокий — ${levels[2]}. Мгновенная проверка, подсказки, подробные решения и тренажёр ошибок.</p></div>
      <p><a class="btn primary" href="/#/s/${s.id}/${t.id}/practice">Решать задания по теме</a> <a class="btn" href="/#/cards/${s.id}">Флеш-карточки</a></p></section>
    <nav class="pager" aria-label="Соседние темы">${prev ? `<a class="btn" href="/s/${s.id}/${prev.id}/">← ${esc(prev.title)}</a>` : `<a class="btn" href="${sUrl}">← Все темы: ${esc(s.name)}</a>`}${next ? `<a class="btn primary" href="/s/${s.id}/${next.id}/">${esc(next.title)} →</a>` : `<a class="btn primary" href="/#/exam/${s.id}">Пробный вариант →</a>`}</nav>`;
    const tDesc = cut(`${t.title} — ${strip(t.summary)} Теория для ${exams || 'ОГЭ и ЕГЭ'} по предмету «${s.name}»: правила, примеры, ловушки экзамена и ${t.tasks.length} заданий с решениями.`, 200);
    fs.mkdirSync(path.join(out, s.id, t.id), { recursive: true });
    fs.writeFileSync(path.join(out, s.id, t.id, 'index.html'), page({
      url: tUrl, sid: s.id, title: `${t.title} — теория для ${exams || 'ОГЭ и ЕГЭ'} | ${s.name} | Клетка`, desc: tDesc,
      crumbs: [['Клетка', '/'], [s.name, sUrl], [t.title, tUrl]], cta: { href: `/#/s/${s.id}/${t.id}/practice`, label: 'Решать задания' }, body: tBody
    }));
  });
}

/* ---------- sitemap.xml и список для переобхода ---------- */
const today = new Date().toISOString().slice(0, 10);
const sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  `  <url><loc>${SITE}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>`]
  .concat(urls.map((u) => `  <url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${u.split('/').length === 4 ? '0.8' : '0.6'}</priority></url>`))
  .concat(['</urlset>', '']).join('\n');
fs.writeFileSync(path.join(root, 'sitemap.xml'), sm);
fs.writeFileSync(path.join(root, 'tools', 'recrawl-urls.txt'), urls.map((u) => SITE + u).join('\n') + '\n');
console.log('Страниц предметов: ' + subjects.length + ', тем: ' + topicCount + ', всего в sitemap: ' + (urls.length + 1));
