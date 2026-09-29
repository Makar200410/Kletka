/* Проверка иллюстраций: node tools/check-viz.js
   Загружает js/viz.js и js/viz/*.js, вызывает каждый рисунок, ищет NaN/undefined,
   проверяет, что карта вставки ссылается на существующие рисунки, темы и разделы. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.join(__dirname, '..');
const win = { KL: {} };
win.window = win;
const ctx = vm.createContext(win);
const run = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });

const subjects = [];
win.KL.addSubject = (s) => subjects.push(s);
run(path.join(root, 'js/viz.js'));
for (const f of fs.readdirSync(path.join(root, 'js/viz')).sort()) run(path.join(root, 'js/viz', f));
for (const f of fs.readdirSync(path.join(root, 'js/data')).sort()) {
  if (f !== 'registry.js') { try { run(path.join(root, 'js/data', f)); } catch (e) { console.log('данные', f, e.message); } }
}

let errors = 0;
const bad = (m) => { errors++; console.log('  ОШИБКА  ' + m); };
const figs = win.KL.viz.figs;
for (const [name, f] of Object.entries(figs)) {
  let s = '';
  try { s = f.svg(); } catch (e) { bad(name + ': исключение ' + e.message); continue; }
  if (!/^<svg /.test(s)) bad(name + ': не svg');
  if (/NaN|undefined|Infinity/.test(s)) bad(name + ': в разметке NaN/undefined/Infinity');
  if (!f.cap) bad(name + ': нет подписи cap');
  if (!f.colors && /#[0-9a-fA-F]{3,6}\b|rgb\(/.test(s)) bad(name + ': буквальные цвета (сломают тёмную тему)');
  const w = /viewBox="0 0 (\d+) (\d+)"/.exec(s);
  if (w) {
    const W = +w[1], H = +w[2];
    // грубая проверка: текст за пределами рисунка
    const re = /<text x="(-?[\d.]+)" y="(-?[\d.]+)"/g; let m;
    while ((m = re.exec(s))) if (+m[1] < -2 || +m[1] > W + 2 || +m[2] < 0 || +m[2] > H + 4) { bad(name + ': текст вне рамки (' + m[1] + ',' + m[2] + ') при ' + W + '×' + H); break; }
  }
}
const topicSections = {};
for (const s of subjects) for (const t of s.topics) topicSections[t.id] = t.theory.length;
let used = 0;
for (const [tid, m] of Object.entries(win.KL.viz.map)) {
  if (!(tid in topicSections)) { bad('карта: нет темы ' + tid); continue; }
  for (const [sec, list] of Object.entries(m)) {
    if (+sec >= topicSections[tid]) bad('карта: у темы ' + tid + ' нет раздела ' + sec);
    for (const n of list) { used++; if (!figs[n]) bad('карта: нет рисунка ' + n + ' (тема ' + tid + ')'); }
  }
}
// рисунки, вставленные вручную через data-viz
const html = subjects.flatMap((s) => s.topics.flatMap((t) => t.theory.map((x) => x.html))).join('\n');
const re2 = /data-viz="([^"]+)"/g; let mm;
while ((mm = re2.exec(html))) if (!figs[mm[1]]) bad('в теории data-viz="' + mm[1] + '" — такого рисунка нет');
console.log('Рисунков: ' + Object.keys(figs).length + ', вставок по карте: ' + used + ', ошибок: ' + errors);
process.exit(errors ? 1 : 0);
