"""Картинки с Wikimedia Commons для теории — только со свободной лицензией и с указанием автора.

  python tools/commons.py search "mitosis onion root" [кол-во]
      — кандидаты: название, размер, лицензия (OK / НЕЛЬЗЯ), описание.
  python tools/commons.py get "File:Название.jpg" <предмет> <slug> [ширина]
      — проверяет лицензию, скачивает уменьшенную копию в img/<предмет>/<slug>.<ext>
        и печатает готовую строку для js/pics/<предмет>.js (с автором и лицензией).

Разрешены: общественное достояние, CC0, CC BY, CC BY-SA. Запрещены NC/ND, fair use, GFDL-only.
Скачанный файл обязательно открой и посмотри, прежде чем вставлять.
"""
import json, os, re, sys, urllib.parse, urllib.request, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
API = 'https://commons.wikimedia.org/w/api.php'
UA = 'KletkaEdu/1.0 (https://kletka.himpodgotovka.ru; educational site)'
OK_LICENSE = re.compile(r'^(public domain|pd\b|pd-|cc0|cc[- ]?by(-sa)?([ -][0-9.]+)?( [a-z]{2,})?$)', re.I)


def api(params):
    params = dict(params, format='json')
    req = urllib.request.Request(API + '?' + urllib.parse.urlencode(params), headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)


def clean(s):
    s = re.sub(r'<[^>]+>', ' ', s or '')
    return re.sub(r'\s+', ' ', html.unescape(s)).strip()


def info(titles, width=900):
    d = api({'action': 'query', 'titles': '|'.join(titles), 'prop': 'imageinfo',
             'iiprop': 'url|size|extmetadata|mime', 'iiurlwidth': width})
    return list(d.get('query', {}).get('pages', {}).values())


def licence_ok(lic):
    lic = (lic or '').strip()
    return bool(OK_LICENSE.match(lic)) and not re.search(r'\b(nc|nd)\b', lic, re.I)


def search(q, n=8):
    d = api({'action': 'query', 'generator': 'search', 'gsrsearch': 'filetype:bitmap|drawing ' + q,
             'gsrnamespace': 6, 'gsrlimit': n, 'prop': 'imageinfo', 'iiprop': 'size|extmetadata|mime'})
    pages = sorted(d.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0))
    for i, p in enumerate(pages, 1):
        ii = p['imageinfo'][0]
        m = ii.get('extmetadata', {})
        lic = m.get('LicenseShortName', {}).get('value', '')
        desc = clean(m.get('ImageDescription', {}).get('value', ''))[:110]
        print('%d. %s  [%sx%s]  %s %s\n   %s' % (i, p['title'], ii.get('width'), ii.get('height'),
                                              'OK' if licence_ok(lic) else 'НЕЛЬЗЯ', lic, desc))


def get(title, subject, slug, width=900):
    if not title.startswith('File:'):
        title = 'File:' + title
    if not re.fullmatch(r'[a-z0-9-]+', slug):
        sys.exit('slug: только a-z, 0-9 и дефис')
    p = info([title], width)[0]
    if 'imageinfo' not in p:
        sys.exit('Файл не найден: ' + title)
    ii = p['imageinfo'][0]
    m = ii.get('extmetadata', {})
    lic = m.get('LicenseShortName', {}).get('value', '')
    if not licence_ok(lic):
        sys.exit('НЕЛЬЗЯ: лицензия «%s» не разрешает использование на сайте' % lic)
    url = ii.get('thumburl') or ii['url']
    ext = os.path.splitext(urllib.parse.urlparse(url).path)[1].lower()
    if ext not in ('.jpg', '.jpeg', '.png', '.gif', '.webp'):
        ext = '.png' if 'svg' in ii.get('mime', '') else '.jpg'
    if ext == '.jpeg':
        ext = '.jpg'
    folder = os.path.join(ROOT, 'img', subject)
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, slug + ext)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r, open(path, 'wb') as f:
        f.write(r.read())
    w, h = ii.get('thumbwidth') or ii.get('width'), ii.get('thumbheight') or ii.get('height')
    author = clean(m.get('Artist', {}).get('value', '')) or 'автор не указан'
    author = re.sub(r'\s*\(talk\)|\s*Own work', '', author)[:80]
    credit = '%s, %s' % (author, lic)
    src = '/img/%s/%s%s' % (subject, slug, ext)
    item = {'src': src, 'w': w, 'h': h, 'alt': '', 'cap': '', 'credit': credit,
            'source': ii.get('descriptionurl', 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title))}
    print('Скачано: %s (%s КБ, %sx%s)' % (path, os.path.getsize(path) // 1024, w, h))
    print('Посмотри файл, затем вставь в js/pics/%s.js (заполни cap и alt, sec — номер раздела теории с 0):' % subject)
    print("P.add('ID-ТЕМЫ', SEC, %s);" % json.dumps(item, ensure_ascii=False))


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) >= 2 and a[0] == 'search':
        search(a[1], int(a[2]) if len(a) > 2 else 8)
    elif len(a) >= 4 and a[0] == 'get':
        get(a[1], a[2], a[3], int(a[4]) if len(a) > 4 else 900)
    else:
        print(__doc__)
