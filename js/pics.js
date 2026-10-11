/* Фотографии и иллюстрации к теории (Wikimedia Commons, свободные лицензии).
   Файлы — img/<предмет>/, описания — js/pics/<предмет>.js:
     P.add('id-темы', номерРаздела, { src, w, h, alt, cap, credit, source });
   Добавлять только через tools/commons.py (проверяет лицензию и записывает автора). */
(function () {
  'use strict';
  var KL = (window.KL = window.KL || {});
  var map = {};
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  KL.pics = {
    map: map,
    add: function (tid, sec, item) { ((map[tid] = map[tid] || {})[sec] = map[tid][sec] || []).push(item); },
    html: function (p) {
      return '<figure class="pic"><a class="pic-img" href="' + esc(p.src) + '" target="_blank" rel="noopener"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || p.cap) + '" width="' + (p.w || '') + '" height="' + (p.h || '') + '" loading="lazy" decoding="async"></a>' +
        '<figcaption><span class="pic-cap">' + (p.cap || '') + '</span><small class="pic-credit">' + esc(p.credit) + ' · <a href="' + esc(p.source) + '" target="_blank" rel="noopener">Wikimedia Commons</a></small></figcaption></figure>';
    },
    forSection: function (tid, sec) { var m = map[tid], l = m && m[sec]; return l ? l.map(KL.pics.html).join('') : ''; }
  };
})();
