/* Проверка фото к теории: node tools/check-pics.js
   Файл существует, есть подпись и автор, тема и раздел существуют, в формулах подписи не потеряны
   обратные слэши, в img/ нет файлов без записи, файлы не слишком тяжёлые. */
'use strict';
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
for (const f of fs.readdirSync(path.join(root, 'js/data')).sort()) if (f !== 'registry.js') run(path.join(root, 'js/data', f));
run(path.join(root, 'js/pics.js'));
for (const f of fs.readdirSync(path.join(root, 'js/pics')).sort()) run(path.join(root, 'js/pics', f));

const sections = {};
for (const s of subjects) for (const t of s.topics) sections[t.id] = t.theory.length;
let errors = 0, warns = 0;
const bad = (m) => { errors++; console.log('  ОШИБКА  ' + m); };
const warn = (m) => { warns++; console.log('  внимание ' + m); };
const used = new Set();
const count = {};
const map = win.KL.pics.map;
const LATEX = /(^|[^\\a-zA-Z])(lambda|sqrt|frac|dfrac|cdot|pi|alpha|beta|Delta|nu|approx|varepsilon|text)(?![a-zA-Z])/;
for (const tid of Object.keys(map)) {
  if (!(tid in sections)) bad(tid + ': такой темы нет');
  for (const sec of Object.keys(map[tid])) {
    if (+sec >= (sections[tid] || 0)) bad(tid + ': нет раздела ' + sec);
    for (const p of map[tid][sec]) {
      const sub = (p.src || '').split('/')[2];
      count[sub] = (count[sub] || 0) + 1;
      const file = path.join(root, p.src || '');
      used.add(path.normalize(file));
      if (!p.src || !fs.existsSync(file)) { bad(tid + ': нет файла ' + p.src); continue; }
      if (!p.cap) bad(p.src + ': нет подписи cap');
      if (!p.credit || !p.source) bad(p.src + ': нет автора или источника');
      for (const g of (p.cap || '').match(/\$[^$]+\$/g) || []) if (LATEX.test(g)) bad(p.src + ': в формуле потерян обратный слэш: ' + g);
      const kb = fs.statSync(file).size / 1024;
      if (kb > 450) warn(p.src + ': ' + Math.round(kb) + ' КБ — стоит сжать');
    }
  }
}
const imgRoot = path.join(root, 'img');
if (fs.existsSync(imgRoot)) for (const d of fs.readdirSync(imgRoot)) for (const f of fs.readdirSync(path.join(imgRoot, d))) {
  const full = path.normalize(path.join(imgRoot, d, f));
  if (!used.has(full)) warn('файл без записи: img/' + d + '/' + f);
}
console.log('Фото по предметам: ' + JSON.stringify(count));
console.log((errors ? 'Ошибок: ' + errors : 'Ошибок нет') + ', предупреждений: ' + warns);
process.exit(errors ? 1 : 0);
