/* Реестр предметов. Каждый файл js/data/<id>.js вызывает KL.addSubject({...}).
   Формат описан в CONTENT_GUIDE.md. */
(function () {
  var KL = (window.KL = window.KL || {});
  KL.subjects = KL.subjects || [];
  KL.addSubject = function (s) {
    KL.subjects.push(s);
  };
})();
