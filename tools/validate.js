#!/usr/bin/env node
/* Проверка файлов контента: node tools/validate.js js/data/chemistry.js [ещё файлы]
   Без аргументов проверяет все js/data/*.js. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let katex = null;
for (const p of [process.env.KATEX_PATH, 'katex',
  path.join(process.env.TEMP || '', 'claude', 'katexenv', 'node_modules', 'katex')]) {
  if (!p) continue;
  try { katex = require(p); break; } catch (e) { /* пропускаем */ }
}
if (!katex) {
  try {
    const guess = path.resolve(__dirname, '..', '..', 'katexenv', 'node_modules', 'katex');
    katex = require(guess);
  } catch (e) { /* без KaTeX проверка формул пропускается */ }
}

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'js', 'data');
let files = process.argv.slice(2);
if (!files.length) {
  files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js') && f !== 'registry.js').map(f => path.join(dataDir, f));
}

const VOID = new Set(['br', 'hr', 'img', 'input', 'wbr', 'col', 'source']);
const LABS = new Set(['periodic', 'graph', 'projectile', 'numsys', 'truth', 'stress', 'timeline', 'punnett', 'verbs', 'sun']);
const TYPES = new Set(['choice', 'multi', 'input', 'order', 'match']);
const EXAMS = new Set(['oge', 'ege', 'both']);

let errors = 0, warnings = 0;
const allIds = new Map();

function err(where, msg) { errors++; console.log('  ОШИБКА  ' + where + ': ' + msg); }
function warn(where, msg) { warnings++; console.log('  внимание ' + where + ': ' + msg); }

function mathSegments(s) {
  const out = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let m;
  while ((m = re.exec(s))) out.push({ tex: m[1] || m[2], display: !!m[1] });
  return out;
}

function checkText(where, s, opts) {
  if (typeof s !== 'string') { err(where, 'должна быть строка'); return; }
  if (!s.trim() && !(opts && opts.allowEmpty)) err(where, 'пустая строка');
  const dollars = (s.replace(/\\\$/g, '').match(/\$/g) || []).length;
  if (dollars % 2) err(where, 'нечётное число знаков $ (незакрытая формула)');
  if (katex) {
    for (const seg of mathSegments(s)) {
      try { katex.renderToString(seg.tex, { throwOnError: true, displayMode: seg.display, strict: false }); }
      catch (e) { err(where, 'LaTeX: ' + e.message.split('\n')[0] + ' в «' + seg.tex.slice(0, 60) + '»'); }
    }
  }
  const noMath = s.replace(/\$\$[\s\S]+?\$\$|\$[^$]+?\$/g, '');
  const stack = [];
  const re = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(\/?)>/g;
  let m;
  while ((m = re.exec(noMath))) {
    const tag = m[1].toLowerCase();
    if (VOID.has(tag) || m[2] === '/') continue;
    if (m[0][1] === '/') {
      if (stack[stack.length - 1] === tag) stack.pop();
      else { err(where, 'непарный закрывающий тег </' + tag + '> (ожидался </' + (stack[stack.length - 1] || '—') + '>)'); return; }
    } else stack.push(tag);
  }
  if (stack.length) err(where, 'незакрытые теги: ' + stack.join(', '));
  const labRe = /data-lab="([^"]+)"/g;
  while ((m = labRe.exec(s))) if (!LABS.has(m[1])) err(where, 'неизвестная лаборатория ' + m[1]);
  const quickRe = /class="quick"([^>]*)>/g;
  while ((m = quickRe.exec(s))) if (!/data-a="[^"]+"/.test(m[1])) err(where, 'у .quick нет data-a');
}

function uniqueId(id, where) {
  if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id)) { err(where, 'id должен быть из a-z, 0-9, дефиса: ' + id); return; }
  if (allIds.has(id)) err(where, 'повтор id ' + id + ' (уже в ' + allIds.get(id) + ')');
  allIds.set(id, where);
}

function checkTask(t, where, topic) {
  uniqueId(t.id, where);
  where = where + ' [' + t.id + ']';
  if (!TYPES.has(t.type)) err(where, 'неизвестный type ' + t.type);
  if (!EXAMS.has(t.exam)) err(where, 'exam должен быть oge|ege|both');
  if (![1, 2, 3].includes(t.difficulty)) err(where, 'difficulty 1..3');
  checkText(where + '.q', t.q);
  checkText(where + '.solution', t.solution);
  if (t.hint !== undefined) checkText(where + '.hint', t.hint);
  else warn(where, 'нет подсказки hint');
  const arr = (a, name, min) => {
    if (!Array.isArray(a) || a.length < min) { err(where, name + ': нужен массив минимум из ' + min); return false; }
    a.forEach((x, i) => checkText(where + '.' + name + '[' + i + ']', x));
    return true;
  };
  switch (t.type) {
    case 'choice':
      if (arr(t.options, 'options', 2) && !(Number.isInteger(t.answer) && t.answer >= 0 && t.answer < t.options.length)) err(where, 'answer — индекс варианта');
      break;
    case 'multi':
      if (arr(t.options, 'options', 3)) {
        if (!Array.isArray(t.answer) || !t.answer.length || t.answer.some(i => !Number.isInteger(i) || i < 0 || i >= t.options.length)) err(where, 'answer — массив индексов');
        else if (new Set(t.answer).size !== t.answer.length) err(where, 'повтор в answer');
      }
      break;
    case 'input': {
      const a = Array.isArray(t.answer) ? t.answer : [t.answer];
      if (!a.length || a.some(x => typeof x !== 'string' || !x.trim())) err(where, 'answer — непустая строка или массив строк');
      if (t.tolerance !== undefined && typeof t.tolerance !== 'number') err(where, 'tolerance — число');
      break;
    }
    case 'order':
      arr(t.items, 'items', 3);
      break;
    case 'match':
      if (arr(t.left, 'left', 2) && arr(t.right, 'right', 2)) {
        if (!Array.isArray(t.answer) || t.answer.length !== t.left.length || t.answer.some(i => !Number.isInteger(i) || i < 0 || i >= t.right.length)) err(where, 'answer — по индексу right на каждый элемент left');
      }
      break;
  }
}

for (const file of files) {
  const rel = path.relative(root, path.resolve(file));
  console.log('\n' + rel);
  const sandbox = { window: {}, console };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  try {
    vm.runInContext(fs.readFileSync(path.join(dataDir, 'registry.js'), 'utf8'), sandbox);
    sandbox.KL = sandbox.window.KL;
    vm.runInContext(fs.readFileSync(path.resolve(file), 'utf8'), sandbox, { filename: rel });
  } catch (e) {
    err(rel, 'файл не выполняется: ' + e.message);
    continue;
  }
  const subs = sandbox.window.KL.subjects;
  if (subs.length !== 1) { err(rel, 'в файле должен быть ровно один KL.addSubject, найдено ' + subs.length); continue; }
  const s = subs[0];
  const base = path.basename(file, '.js');
  if (s.id !== base) err(rel, 'id предмета «' + s.id + '» не совпадает с именем файла');
  for (const k of ['name', 'tagline']) if (typeof s[k] !== 'string' || !s[k]) err(rel, 'нет поля ' + k);
  for (const ex of ['oge', 'ege']) {
    const e = s.exams && s.exams[ex];
    if (!e) { err(rel, 'нет exams.' + ex); continue; }
    for (const k of ['title', 'time', 'structure', 'tip']) if (typeof e[k] !== 'string' || !e[k]) err(rel, 'exams.' + ex + '.' + k);
    for (const k of ['tasks', 'maxPrimary']) if (typeof e[k] !== 'number') err(rel, 'exams.' + ex + '.' + k + ' — число');
  }
  if (!Array.isArray(s.topics) || s.topics.length < 6) err(rel, 'нужно минимум 6 тем');
  let taskCount = 0;
  const examCount = { oge: 0, ege: 0 };
  (s.topics || []).forEach((tp, i) => {
    const where = rel + ' тема ' + (tp.id || i);
    uniqueId(tp.id, where);
    if (!tp.id || !tp.id.startsWith(s.id.slice(0, 3))) warn(where, 'id темы лучше начинать с префикса предмета');
    for (const k of ['title', 'summary']) if (typeof tp[k] !== 'string' || !tp[k]) err(where, 'нет ' + k);
    if (!Array.isArray(tp.exam) || !tp.exam.length || tp.exam.some(x => x !== 'oge' && x !== 'ege')) err(where, "exam — массив из 'oge'/'ege'");
    if (!tp.refs || typeof tp.refs !== 'object') err(where, 'нет refs');
    if (![1, 2, 3].includes(tp.level)) err(where, 'level 1..3');
    if (typeof tp.minutes !== 'number') err(where, 'minutes — число');
    if (!Array.isArray(tp.keyPoints) || tp.keyPoints.length < 3) err(where, 'keyPoints: минимум 3');
    else tp.keyPoints.forEach((k, j) => checkText(where + '.keyPoints[' + j + ']', k));
    if (!Array.isArray(tp.theory) || tp.theory.length < 3) err(where, 'theory: минимум 3 раздела');
    else {
      const all = tp.theory.map(x => x.html).join('\n');
      tp.theory.forEach((sec, j) => { checkText(where + '.theory[' + j + '].h', sec.h); checkText(where + '.theory[' + j + '].html', sec.html); });
      for (const cls of ['rule', 'trap', 'example', 'quick']) if (!all.includes('class="' + cls + '"')) warn(where, 'в теории нет блока .' + cls);
    }
    if (!Array.isArray(tp.tasks) || tp.tasks.length < 9) err(where, 'нужно минимум 9 заданий, сейчас ' + (tp.tasks || []).length);
    const types = new Set();
    (tp.tasks || []).forEach(t => {
      checkTask(t, where, tp); types.add(t.type); taskCount++;
      if (t.exam === 'oge' || t.exam === 'both') examCount.oge++;
      if (t.exam === 'ege' || t.exam === 'both') examCount.ege++;
    });
    if (types.size < 3) warn(where, 'меньше 3 типов заданий');
  });
  if (!Array.isArray(s.cards) || s.cards.length < 20) err(rel, 'нужно минимум 20 карточек');
  else s.cards.forEach((c, i) => { checkText(rel + ' card[' + i + '].q', c.q); checkText(rel + ' card[' + i + '].a', c.a); });
  console.log('  тем: ' + (s.topics || []).length + ', заданий: ' + taskCount + ' (ОГЭ ' + examCount.oge + ', ЕГЭ ' + examCount.ege + '), карточек: ' + (s.cards || []).length);
}
console.log('\n' + (errors ? 'Ошибок: ' + errors : 'Ошибок нет') + ', предупреждений: ' + warnings + (katex ? '' : ' (формулы не проверялись: нет KaTeX)'));
process.exit(errors ? 1 : 0);
