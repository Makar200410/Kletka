/* Английский язык — контент «Клетки». Формат описан в CONTENT_GUIDE.md. */
KL.addSubject({
  id: 'english',
  name: 'Английский язык',
  tagline: 'Времена, пассив, словообразование и письмо без ошибок',
  exams: {
    oge: {
      title: 'ОГЭ по английскому языку',
      tasks: 38,
      time: '2 ч (письменная часть) + 15 мин (устная часть)',
      maxPrimary: 68,
      structure: 'Письменная часть — 35 заданий: аудирование и чтение (1–19), грамматика (20–28), словообразование (29–34), электронное письмо другу (35). Устная часть — 3 задания: чтение текста вслух, условный диалог-расспрос (ответы на 6 вопросов), тематическое монологическое высказывание.',
      tip: 'Грамматика и словообразование — самые «дешёвые» баллы: 15 заданий решаются по алгоритму. Отработайте времена, пассив, неправильные глаголы и суффиксы — и не забудьте проверить орфографию каждого слова.'
    },
    ege: {
      title: 'ЕГЭ по английскому языку',
      tasks: 42,
      time: '3 ч 10 мин (письменная часть) + 17 мин (устная часть)',
      maxPrimary: 82,
      minScore: 22,
      structure: 'Письменная часть — 38 заданий: аудирование (1–9), чтение (10–18), грамматика и лексика (19–36: грамматика 19–24, словообразование 25–29, лексика 30–36), письмо (37 — электронное письмо, 38 — развёрнутое высказывание по таблице или диаграмме). Устная часть — 4 задания: чтение текста вслух, условный диалог-расспрос (4 вопроса), интервью (ответы на 5 вопросов), монолог с обоснованием выбора фотографий.',
      tip: 'Ответ в заданиях 19–29 пишется с учётом орфографии: одна пропущенная буква — ноль баллов. В письмах строго держите объём и план: всё, что вне плана, может стоить баллов за содержание.'
    }
  },
  topics: [
    /* ============ ТЕМА 1 ============ */
    {
      id: 'eng-present-past',
      title: 'Present и Past: Simple и Continuous',
      exam: ['oge', 'ege'],
      refs: { oge: '20–28', ege: '19–24' },
      level: 1,
      minutes: 15,
      summary: 'Четыре самых частых времени: факт или процесс, настоящее или прошлое. Основа заданий на грамматику в ОГЭ и ЕГЭ.',
      keyPoints: [
        'Present Simple — факты, привычки, расписания: he works, does he work?',
        'Present Continuous — действие прямо сейчас или временное: am/is/are + V-ing',
        'Past Simple — законченное действие в прошлом: yesterday, ago, last week, in 2020',
        'Past Continuous — процесс в момент в прошлом: was/were + V-ing',
        'Глаголы состояния (know, like, want, understand, belong) не ставятся в Continuous',
        'В 3-м лице ед. ч. Present Simple — окончание -s/-es: goes, watches, studies'
      ],
      theory: [
        { h: 'Present Simple и Present Continuous', html: String.raw`<p>Главный вопрос: это <b>факт/привычка</b> или <b>процесс прямо сейчас</b>?</p>
<table class="tbl">
<tr><th></th><th>Present Simple</th><th>Present Continuous</th></tr>
<tr><td>Форма</td><td>V / V-s (he, she, it)</td><td>am / is / are + V-ing</td></tr>
<tr><td>Вопрос</td><td>Do you play? Does she play?</td><td>Are you playing? Is she playing?</td></tr>
<tr><td>Отрицание</td><td>I don't play. She doesn't play.</td><td>I'm not playing. She isn't playing.</td></tr>
<tr><td>Маркеры</td><td>usually, always, often, every day, on Mondays</td><td>now, at the moment, Look!, Listen!, today, this week</td></tr>
<tr><td>Смысл</td><td>регулярно, всегда, факт</td><td>сейчас, временно, запланировано на ближайшее время</td></tr>
</table>
<div class="rule">В 3-м лице единственного числа (he, she, it, Tom, my mum) в Present Simple глагол получает <b>-s</b>: she read<b>s</b>. После <b>-s, -ss, -sh, -ch, -x, -o</b> — <b>-es</b>: watch<b>es</b>, go<b>es</b>. Согласная + y → <b>-ies</b>: study → stud<b>ies</b>, но play → play<b>s</b>.</div>
<p>Общие истины и законы природы — только Present Simple: <i>Water boils at 100 degrees.</i></p>` },
        { h: 'Past Simple и Past Continuous', html: String.raw`<table class="tbl">
<tr><th></th><th>Past Simple</th><th>Past Continuous</th></tr>
<tr><td>Форма</td><td>V-ed или 2-я форма (went, saw)</td><td>was / were + V-ing</td></tr>
<tr><td>Вопрос</td><td>Did you see? (глагол — в 1-й форме!)</td><td>Were you watching?</td></tr>
<tr><td>Маркеры</td><td>yesterday, ago, last year, in 2015, when I was a child</td><td>at 5 o'clock yesterday, all evening, while, when (фоном)</td></tr>
</table>
<p>Классическая схема: длинный процесс (Past Continuous) прерывается коротким действием (Past Simple).</p>
<div class="example"><p><b>Пример.</b> <i>I <b>was reading</b> when the phone <b>rang</b>.</i> — Я читал (процесс), когда зазвонил телефон (одно действие).</p><p><i>While my mum <b>was cooking</b>, my dad <b>was watching</b> TV.</i> — два параллельных процесса.</p></div>
<div class="trap">После <b>did</b> и <b>didn't</b> глагол стоит в начальной форме: <i>Did you <b>go</b>?</i>, <i>I didn't <b>see</b> him.</i> Ошибка «didn't went» — одна из самых частых.</div>
<div class="quick" data-a="was sleeping">Закончите: At midnight yesterday I ______ (SLEEP).</div>` },
        { h: 'Глаголы состояния и used to', html: String.raw`<p>Некоторые глаголы описывают не действие, а <b>состояние</b>, и в Continuous обычно не употребляются:</p>
<ul>
<li>чувства: like, love, hate, want, prefer, need;</li>
<li>мышление: know, understand, believe, remember, mean;</li>
<li>обладание: have (в значении «иметь»), own, belong;</li>
<li>восприятие: see, hear, seem.</li>
</ul>
<div class="trap"><i>I <s>am knowing</s> the answer</i> → <i>I <b>know</b> the answer.</i> Но <i>have</i> в устойчивых сочетаниях — действие: <i>We <b>are having</b> lunch now</i> (обедаем) — это верно.</div>
<p><b>used to + V</b> — «раньше, бывало» (привычка в прошлом, которой больше нет): <i>I <b>used to</b> play the piano, but now I don't.</i> Отрицание и вопрос: <i>didn't use to</i>, <i>Did you use to...?</i></p>
<div class="quick" data-a="doesn't like|does not like|doesn’t like">Закончите: My sister ______ horror films, she thinks they are stupid. (NOT LIKE)</div>` },
        { h: 'Как это выглядит на экзамене', html: String.raw`<p>В ОГЭ (задания 20–28) и ЕГЭ (19–24) дан связный текст с пропусками. Справа — слово капсом (<b>GO, SEE, CHILD</b>), его надо поставить в нужную форму.</p>
<div class="rule">Алгоритм: 1) найдите подлежащее (кто?) и его число; 2) найдите маркеры времени и соседние глаголы — текст обычно написан в прошедшем; 3) решите: факт или процесс; 4) проверьте орфографию.</div>
<div class="example"><p><b>Пример.</b> <i>Last summer my family ______ to Spain. We ______ in a small hotel near the sea.</i> (GO, STAY)</p><p>Маркер <i>last summer</i> → Past Simple: <b>went</b>, <b>stayed</b>.</p></div>
<div class="tip">Большинство экзаменационных текстов — рассказы о прошлом. Если маркера нет, смотрите на время соседних предложений.</div>` }
      ],
      tasks: [
        { id: 'eng-present-past-1', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>My brother usually ______ to school by bus.</i> (GO)",
          answer: 'goes',
          hint: 'Маркер usually и подлежащее в 3-м лице ед. ч.',
          solution: "<i>usually</i> → Present Simple. Подлежащее <i>my brother</i> = he, поэтому нужно окончание: go + es = <b>goes</b>." },
        { id: 'eng-present-past-2', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>Look! The children ______ in the garden.</i> (PLAY)",
          answer: ['are playing'],
          hint: 'Look! — действие происходит прямо сейчас.',
          solution: "<i>Look!</i> → Present Continuous. <i>The children</i> — множественное число, значит <b>are playing</b>." },
        { id: 'eng-present-past-3', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>Yesterday we ______ a very interesting film about whales.</i> (SEE)",
          answer: 'saw',
          hint: 'Yesterday — Past Simple. see — неправильный глагол.',
          solution: "Маркер <i>yesterday</i> → Past Simple. see — saw — seen, вторая форма <b>saw</b>." },
        { id: 'eng-present-past-4', type: 'input', exam: 'both', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>When I came into the room, my parents ______ dinner and talking about their day.</i> (HAVE)",
          answer: ['were having'],
          hint: 'Обратите внимание на «and talking» — второй глагол уже в форме -ing.',
          solution: "Родители были в процессе (ужинали и разговаривали), когда я вошёл → Past Continuous. Подлежащее во мн. ч.: <b>were having</b>. have в значении «есть, ужинать» — действие, поэтому Continuous возможен." },
        { id: 'eng-present-past-5', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Выберите верный вариант: <i>I ______ this word. What does it mean?</i>",
          options: ["am not knowing", "don't know", "doesn't know", "not know"],
          answer: 1,
          hint: 'know — глагол состояния.',
          solution: "know не употребляется в Continuous, поэтому нужен Present Simple. Подлежащее I → <b>don't know</b>. doesn't — только для he/she/it." },
        { id: 'eng-present-past-6', type: 'choice', exam: 'ege', difficulty: 2,
          q: "Выберите верный вариант: <i>While Anna ______ a shower, the phone rang.</i>",
          options: ['took', 'was taking', 'has taken', 'is taking'],
          answer: 1,
          hint: 'While + длительный процесс, прерванный коротким действием.',
          solution: "Процесс в прошлом, который прервал звонок (rang — Past Simple) → Past Continuous: <b>was taking</b>." },
        { id: 'eng-present-past-7', type: 'multi', exam: 'ege', difficulty: 2,
          q: 'Выберите предложения <b>без</b> грамматических ошибок.',
          options: [
            "She is having a new car.",
            "We were watching TV when the lights went out.",
            "He usually gets up at seven.",
            "I am understanding you now.",
            "Did you see Mike yesterday?",
            "They didn't went to the party."
          ],
          answer: [1, 2, 4],
          hint: 'Проверьте глаголы состояния и форму глагола после did/didn\'t.',
          solution: "1) have = «иметь» — состояние: <i>She has a new car</i>. 2) Верно. 3) Верно. 4) understand — глагол состояния: <i>I understand you</i>. 5) Верно. 6) После didn't — начальная форма: <i>didn't go</i>. Верные: 2, 3, 5." },
        { id: 'eng-present-past-8', type: 'match', exam: 'both', difficulty: 1,
          q: 'Соотнесите маркер времени и время, с которым он обычно употребляется.',
          left: ['every Sunday', 'at the moment', 'two days ago', "at 5 o'clock yesterday"],
          right: ['Past Continuous', 'Present Simple', 'Past Simple', 'Present Continuous'],
          answer: [1, 3, 2, 0],
          hint: 'Регулярность, «сейчас», законченный факт прошлого, процесс в точке прошлого.',
          solution: "every Sunday — регулярность → Present Simple; at the moment → Present Continuous; two days ago → Past Simple; at 5 o'clock yesterday — процесс в точный момент прошлого → Past Continuous." },
        { id: 'eng-present-past-9', type: 'input', exam: 'both', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>My mum always ______ when I come home late.</i> (WORRY)",
          answer: 'worries',
          hint: 'Present Simple, 3-е лицо. Как пишется окончание после согласной + y?',
          solution: "always → Present Simple, подлежащее my mum = she. Согласная + y → -ies: <b>worries</b>." },
        { id: 'eng-present-past-10', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>He ______ his bag on the floor and ran out of the room.</i> (DROP)",
          answer: 'dropped',
          hint: 'Второй глагол ran подсказывает время. Проверьте удвоение согласной.',
          solution: "Цепочка действий в прошлом → Past Simple. drop — короткий слог с ударной гласной и одной согласной на конце → согласная удваивается: <b>dropped</b>." },
        { id: 'eng-present-past-11', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>Who ______ this beautiful picture? — My sister did.</i> (PAINT)",
          answer: 'painted',
          hint: 'Вопрос к подлежащему (Who?) строится без вспомогательного глагола.',
          solution: "Ответ «My sister did» показывает Past Simple. Вопрос к подлежащему с who строится как утверждение, без did: <i>Who <b>painted</b> this picture?</i>" },
        { id: 'eng-present-past-12', type: 'choice', exam: 'ege', difficulty: 3,
          q: "Выберите верный вариант: <i>When I was a child, I ______ climb trees, but now I'm afraid of heights.</i>",
          options: ['use to', 'used to', 'was used to', 'am used to'],
          answer: 1,
          hint: 'Прошлая привычка, которой больше нет.',
          solution: "Привычка в прошлом → <b>used to</b> + V. <i>be used to</i> значит «привыкнуть к чему-то» и требует после себя -ing или существительное." },
        { id: 'eng-present-past-13', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>My little sister ______ a glass of milk every morning before school.</i> (DRINK)",
          answer: 'drinks',
          hint: 'every morning — регулярное действие. Кто подлежащее?',
          solution: "Маркер <i>every morning</i> → Present Simple. Подлежащее <i>my little sister</i> = she (3-е лицо ед. ч.) → глагол получает окончание -s: <b>drinks</b>." },
        { id: 'eng-present-past-14', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>Tom ______ TV in the evenings. He reads books instead.</i> (NOT WATCH)",
          answer: ["doesn't watch", 'does not watch', "doesn’t watch"],
          hint: 'Привычка в настоящем, отрицание, 3-е лицо ед. ч.',
          solution: "<i>in the evenings</i> и соседнее <i>reads</i> → Present Simple. Отрицание в 3-м лице ед. ч. строится через does not, а смысловой глагол остаётся в начальной форме (без -es): <b>doesn't watch</b> (does not watch). Ошибка «doesn't watches» — двойное окончание." },
        { id: 'eng-present-past-15', type: 'input', exam: 'both', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>When I phoned at seven o'clock yesterday evening, Mike and his sister ______ their homework, so they couldn't talk to me.</i> (DO)",
          answer: 'were doing',
          hint: 'Какое действие было в процессе в момент звонка?',
          solution: "В момент звонка в прошлом действие уже шло и было прервано → Past Continuous: was/were + V-ing. Подлежащее <i>Mike and his sister</i> — мн. ч. → <b>were doing</b>." },
        { id: 'eng-present-past-16', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>Ann ______ French at university in Paris from 2016 to 2020, and now she works as a translator.</i> (STUDY)",
          answer: 'studied',
          hint: 'Учёба длилась с 2016 по 2020 год и закончилась. Как пишется -ed после согласной + y?',
          solution: "Учёба — законченный период в прошлом (from 2016 to 2020) → Past Simple. study оканчивается на согласную + y → y меняется на i: <b>studied</b>." },
        { id: 'eng-present-past-17', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>Dad usually drives to work, but this week he ______ by bus because his car is in the garage.</i> (TRAVEL)",
          answer: ['is travelling', "'s travelling", "’s travelling", 'is traveling', "'s traveling", "’s traveling"],
          hint: 'this week противопоставлено usually: это временная ситуация.',
          solution: "<i>usually</i> описывает обычную привычку (Present Simple), а <i>this week</i> — временную ситуацию в настоящем → Present Continuous: <b>is travelling</b>. В британском варианте l удваивается (travelling), в американском — нет (traveling); на экзамене допустимы оба написания." },
        { id: 'eng-present-past-18', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Выберите верный вариант: <i>Listen! Somebody ______ at the door.</i>",
          options: ['knocks', 'is knocking', 'knocked', 'knock'],
          answer: 1,
          hint: 'Listen! — действие происходит прямо сейчас.',
          solution: "<i>Listen!</i> — маркер действия в момент речи → Present Continuous. somebody требует глагола в ед. ч. → <b>is knocking</b>." },
        { id: 'eng-present-past-19', type: 'multi', exam: 'ege', difficulty: 3,
          q: 'Выберите предложения <b>без</b> грамматических ошибок.',
          options: [
            "She was cooking dinner when I arrived.",
            "I was knowing the way, so I didn't take a map.",
            "Water boils at 100 degrees Celsius.",
            "Does your brother plays football?",
            "Where did you go last summer?",
            "My father work in a bank."
          ],
          answer: [0, 2, 4],
          hint: 'Проверьте глаголы состояния, форму после does и окончание -s в 3-м лице.',
          solution: "1) Верно: процесс (was cooking) прерван действием (arrived). 2) know — глагол состояния: <i>I knew the way</i>. 3) Верно: закон природы — Present Simple. 4) После does — начальная форма: <i>Does your brother play</i>. 5) Верно. 6) 3-е лицо ед. ч.: <i>My father works</i>. Ответ: 1, 3, 5." }
      ]
    },

    /* ============ ТЕМА 2 ============ */
    {
      id: 'eng-future-perfect',
      title: 'Future, Perfect и согласование времён',
      exam: ['oge', 'ege'],
      refs: { oge: '20–28', ege: '19–24' },
      level: 2,
      minutes: 20,
      summary: 'Будущее, перфектные времена и сдвиг времён в косвенной речи — там, где чаще всего теряют баллы в грамматике.',
      keyPoints: [
        'will + V — решение в момент речи, обещание, прогноз; be going to — намерение и очевидный прогноз',
        'Present Perfect = have/has + V3: результат к настоящему; just, already, yet, ever, never, since, for',
        'Past Perfect = had + V3: действие раньше другого действия в прошлом',
        'После if, when, before, as soon as, until — Present Simple вместо will',
        'Согласование: после said/told/asked в прошлом — сдвиг: is → was, will → would, has done → had done',
        'В косвенном вопросе прямой порядок слов: She asked where I lived'
      ],
      theory: [
        { h: 'Как говорить о будущем', html: String.raw`<table class="tbl">
<tr><th>Форма</th><th>Когда</th><th>Пример</th></tr>
<tr><td>will + V</td><td>решение в момент речи, обещание, прогноз-мнение</td><td>I'll help you. I think it will be cold.</td></tr>
<tr><td>be going to + V</td><td>намерение, план; прогноз по очевидным признакам</td><td>I'm going to study law. Look at the clouds! It's going to rain.</td></tr>
<tr><td>Present Continuous</td><td>договорённость на конкретное время</td><td>We're meeting at six tonight.</td></tr>
<tr><td>Present Simple</td><td>расписание</td><td>The train leaves at 7:15.</td></tr>
</table>
<div class="rule">В придаточных времени и условия (после <b>if, when, before, after, as soon as, until, unless</b>) будущее выражается <b>Present Simple</b>: <i>If it <b>rains</b> tomorrow, we'll stay at home. I'll call you when I <b>get</b> home.</i></div>
<div class="trap">Не путайте с придаточным-дополнением после <i>I don't know / I wonder</i>: <i>I don't know <b>if</b> he <b>will come</b></i> (не знаю, придёт ли) — здесь will нужен!</div>` },
        { h: 'Present Perfect или Past Simple', html: String.raw`<p><b>Present Perfect</b> (have/has + V3) связывает прошлое с настоящим: важен результат, а не время.</p>
<table class="tbl">
<tr><th>Present Perfect</th><th>Past Simple</th></tr>
<tr><td>время не названо, важен результат</td><td>названо время в прошлом</td></tr>
<tr><td>just, already, yet, ever, never, recently, so far, this week (ещё не кончилась)</td><td>yesterday, ago, last…, in 2010, when…?</td></tr>
<tr><td>I've lost my key (и сейчас его нет).</td><td>I lost my key yesterday.</td></tr>
<tr><td>She has lived here <b>since</b> 2015 / <b>for</b> ten years.</td><td>She lived there in 2015.</td></tr>
</table>
<div class="rule"><b>since</b> + точка отсчёта (since Monday, since 2019, since I was five); <b>for</b> + период (for two hours, for ages).</div>
<div class="trap">Вопрос с <b>When</b> и маркеры <b>ago, yesterday, last</b> несовместимы с Present Perfect: <i><s>When have you bought it?</s></i> → <i>When <b>did</b> you <b>buy</b> it?</i></div>
<p><b>Present Perfect Continuous</b> (have/has been + V-ing) подчёркивает длительность: <i>I've been waiting for an hour.</i></p>
<div class="quick" data-a="has just left|'s just left|’s just left">Закончите: She ______ (JUST/LEAVE), you can still catch her at the bus stop.</div>` },
        { h: 'Past Perfect — предпрошедшее', html: String.raw`<p><b>had + V3</b> — действие, которое произошло <b>до</b> другого действия в прошлом.</p>
<div class="example"><p><b>Пример.</b> <i>When we arrived, the film <b>had</b> already <b>started</b>.</i> — сначала начался фильм, потом мы пришли.</p><p>Сравните: <i>When we arrived, the film <b>started</b>.</i> — мы пришли, и тут фильм начался.</p></div>
<p>Маркеры: <b>by the time</b>, by + момент в прошлом (by 5 o'clock yesterday), before, after, already, just в рассказе о прошлом.</p>` },
        { h: 'Согласование времён и косвенная речь', html: String.raw`<p>Если главный глагол в прошедшем (<i>said, told, asked, thought, knew</i>), время в придаточном «сдвигается назад».</p>
<table class="tbl">
<tr><th>Прямая речь</th><th>Косвенная речь</th></tr>
<tr><td>Present Simple: «I <b>like</b> it»</td><td>Past Simple: he said he <b>liked</b> it</td></tr>
<tr><td>Present Continuous: «I <b>am working</b>»</td><td>Past Continuous: <b>was working</b></td></tr>
<tr><td>Past Simple / Present Perfect: «I <b>saw</b> / <b>have seen</b>»</td><td>Past Perfect: <b>had seen</b></td></tr>
<tr><td>will: «I <b>will</b> call»</td><td>would: he said he <b>would</b> call</td></tr>
<tr><td>can / may</td><td>could / might</td></tr>
</table>
<p>Меняются и слова времени и места: now → then, today → that day, yesterday → the day before, tomorrow → the next day, ago → before, here → there, this → that.</p>
<div class="trap">В косвенном вопросе — <b>прямой</b> порядок слов и нет do/did: <i>«Where do you live?» → She asked me where I <b>lived</b>.</i> (а не «where did I live»).</div>
<div class="quick" data-a="would come|'d come|’d come">Закончите: Tom promised that he ______ (COME) to my party.</div>` }
      ],
      tasks: [
        { id: 'eng-future-perfect-1', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>I ______ my homework yet, so I can't go out.</i> (NOT FINISH)",
          answer: ["haven't finished", "have not finished", "haven’t finished"],
          hint: 'yet в отрицании — маркер Present Perfect.',
          solution: "<i>yet</i> + результат к настоящему (не могу выйти) → Present Perfect: <b>haven't finished</b> (have not finished)." },
        { id: 'eng-future-perfect-2', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>Don't worry, I ______ you with your project tomorrow. I promise!</i> (HELP)",
          answer: ['will help', "'ll help", "’ll help"],
          hint: 'Обещание на будущее.',
          solution: "Обещание, tomorrow → Future Simple: <b>will help</b>." },
        { id: 'eng-future-perfect-3', type: 'input', exam: 'both', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>My friends ______ in London since 2019.</i> (LIVE)",
          answer: ['have lived', 'have been living'],
          hint: 'since + год — действие началось в прошлом и продолжается.',
          solution: "<i>since 2019</i> → Present Perfect: <b>have lived</b> (или Present Perfect Continuous <i>have been living</i>). Past Simple с since неверен." },
        { id: 'eng-future-perfect-4', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>By the time we got to the station, the train ______.</i> (LEAVE)",
          answer: 'had left',
          hint: 'Какое действие произошло раньше?',
          solution: "Поезд ушёл <b>раньше</b>, чем мы пришли (got — Past Simple). By the time → Past Perfect: <b>had left</b>." },
        { id: 'eng-future-perfect-5', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>If it ______ tomorrow, we will stay at home and play board games.</i> (RAIN)",
          answer: 'rains',
          hint: 'Придаточное условия.',
          solution: "После if в придаточном условия будущее выражается Present Simple: <b>rains</b> (it — 3-е лицо, окончание -s). «will rain» — ошибка." },
        { id: 'eng-future-perfect-6', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>Tom said that he ______ us the next day.</i> (CALL)",
          answer: ['would call', "'d call", "’d call"],
          hint: 'Главный глагол said в прошедшем, а звонок — в будущем относительно него.',
          solution: "Согласование времён: will → <b>would</b>. «the next day» — косвенная замена tomorrow. Ответ: <b>would call</b>." },
        { id: 'eng-future-perfect-7', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>Mary asked me where I ______.</i> (LIVE)",
          answer: 'lived',
          hint: 'Косвенный вопрос после asked: сдвиг времени и прямой порядок слов.',
          solution: "Прямой вопрос: «Where do you live?». В косвенном после asked — Past Simple и прямой порядок без did: <i>where I <b>lived</b></i>." },
        { id: 'eng-future-perfect-8', type: 'choice', exam: 'oge', difficulty: 2,
          q: "Выберите верный вариант: <i>I ______ Mike since we were five.</i>",
          options: ['know', 'knew', 'have known', 'am knowing'],
          answer: 2,
          hint: 'since + момент в прошлом, знакомство продолжается.',
          solution: "Состояние длится с прошлого до сейчас → Present Perfect: <b>have known</b>. know — глагол состояния, Continuous невозможен." },
        { id: 'eng-future-perfect-9', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Выберите верный вариант: <i>Look at those black clouds! It ______ rain.</i>",
          options: ['will', 'is going to', 'rains', 'is raining'],
          answer: 1,
          hint: 'Прогноз по очевидным признакам.',
          solution: "Мы видим тучи — есть явные признаки → <b>is going to</b> rain." },
        { id: 'eng-future-perfect-10', type: 'match', exam: 'ege', difficulty: 2,
          q: 'Как меняются слова в косвенной речи после said? Установите соответствие.',
          left: ['yesterday', 'tomorrow', 'now', 'ago', 'here'],
          right: ['then', 'there', 'the day before', 'before', 'the next day'],
          answer: [2, 4, 0, 3, 1],
          hint: 'Точка отсчёта смещается в прошлое.',
          solution: "yesterday → the day before; tomorrow → the next day; now → then; ago → before; here → there." },
        { id: 'eng-future-perfect-11', type: 'multi', exam: 'both', difficulty: 3,
          q: 'В каких предложениях Present Perfect употреблён <b>верно</b>?',
          options: [
            "I have seen this film last week.",
            "She has just come home.",
            "Have you ever been to Scotland?",
            "When have you bought this bag?",
            "We have known each other for ten years."
          ],
          answer: [1, 2, 4],
          hint: 'Present Perfect несовместим с точным указанием прошедшего времени.',
          solution: "1) last week → Past Simple: <i>I saw</i>. 2) just — верно. 3) ever — верно. 4) When → Past Simple: <i>When did you buy</i>. 5) for ten years — верно. Ответ: 2, 3, 5." },
        { id: 'eng-future-perfect-12', type: 'order', exam: 'ege', difficulty: 2,
          q: 'Расставьте части, чтобы получилось верное предложение.',
          items: ['I will phone you', 'as soon as', 'I get', 'to the airport.'],
          hint: 'После as soon as — Present Simple.',
          solution: "<i>I will phone you as soon as I get to the airport.</i> В главной части — will, в придаточном времени — Present Simple." },
        { id: 'eng-future-perfect-13', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>I ______ this book three times already — it's my favourite!</i> (READ)",
          answer: ['have read', "'ve read", "’ve read"],
          hint: 'already и «сколько раз к настоящему моменту» — маркеры Present Perfect.',
          solution: "Опыт к настоящему моменту, время не названо, есть <i>already</i> → Present Perfect: have + V3. read — read — read (пишется одинаково, читается [ri:d] — [red] — [red]): <b>have read</b>." },
        { id: 'eng-future-perfect-14', type: 'input', exam: 'oge', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>I'll give you the book back when I ______ it.</i> (FINISH)",
          answer: ['finish', 'have finished', "'ve finished", "’ve finished"],
          hint: 'Придаточное времени после when, а действие относится к будущему.',
          solution: "В придаточном времени (после <i>when</i>) будущее выражается Present Simple: <b>finish</b>. Также допустим Present Perfect <i>have finished</i> — он подчёркивает, что действие будет завершено. «will finish» после when в этом значении — ошибка." },
        { id: 'eng-future-perfect-15', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>When I came home, I saw that somebody ______ the kitchen window.</i> (BREAK)",
          answer: 'had broken',
          hint: 'Окно разбили до того, как я пришёл и увидел это.',
          solution: "Два действия в прошлом: я пришёл и увидел (Past Simple), а окно разбили <b>раньше</b> → Past Perfect: had + V3. break — broke — broken: <b>had broken</b>." },
        { id: 'eng-future-perfect-16', type: 'input', exam: 'both', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>Ann said that she ______ to become a doctor.</i> (WANT)<br>Прямая речь: «I want to become a doctor.»",
          answer: 'wanted',
          hint: 'Главный глагол said — в прошедшем: время в придаточном сдвигается.',
          solution: "Согласование времён: Present Simple (want) после <i>said</i> → Past Simple: <b>wanted</b>." },
        { id: 'eng-future-perfect-17', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>The coach asked me if I ______ swim.</i> (CAN)<br>Прямая речь: «Can you swim?»",
          answer: 'could',
          hint: 'Какая форма у can в косвенной речи после asked?',
          solution: "Общий вопрос в косвенной речи вводится словом <i>if</i> (whether), порядок слов прямой, а can после глагола в прошедшем меняется на <b>could</b>: <i>asked me if I could swim</i>." },
        { id: 'eng-future-perfect-18', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Выберите верный вариант: <i>— The phone is ringing! — OK, ______ it.</i>",
          options: ["I answer", "I'll answer", "I answered", "I've answered"],
          answer: 1,
          hint: 'Решение принято прямо в момент речи.',
          solution: "Спонтанное решение в момент речи → will: <b>I'll answer</b> it. Present Simple, Past Simple и Present Perfect не выражают решение о ближайшем действии." },
        { id: 'eng-future-perfect-19', type: 'match', exam: 'ege', difficulty: 2,
          q: 'Соотнесите прямую речь с косвенной (после <i>She said…</i>).',
          left: ['«I am tired.»', '«I will help you.»', '«I have lost my bag.»', '«I can drive.»'],
          right: ['She said she could drive.', 'She said she had lost her bag.', 'She said she was tired.', 'She said she would help me.', 'She said she would be tired.'],
          answer: [2, 3, 1, 0],
          hint: 'Каждое время сдвигается на шаг в прошлое.',
          solution: "am → was; will → would; have lost (Present Perfect) → had lost (Past Perfect); can → could. «She said she would be tired» не соответствует ни одной фразе: в «I am tired» нет будущего." }
      ]
    },
    /* ============ ТЕМА 3 ============ */
    {
      id: 'eng-passive',
      title: 'Пассивный залог',
      exam: ['oge', 'ege'],
      refs: { oge: '20–28', ege: '19–24' },
      level: 2,
      minutes: 15,
      summary: 'Когда подлежащее не делает действие, а подвергается ему. Пассив есть почти в каждом варианте ОГЭ и ЕГЭ.',
      keyPoints: [
        'Passive = be в нужном времени + V3 (was built, is spoken)',
        'Present Simple: am/is/are + V3; Past Simple: was/were + V3',
        'Present Perfect: has/have been + V3; Future: will be + V3; модальный: can/must be + V3',
        'Continuous: is being + V3, was being + V3',
        'Исполнитель — через by, инструмент — через with',
        'be согласуется с подлежащим: The letters were sent'
      ],
      theory: [
        { h: 'Когда нужен пассив', html: String.raw`<p>Сравните: <i>Shakespeare <b>wrote</b> Hamlet</i> (подлежащее делает действие — актив) и <i>Hamlet <b>was written</b> by Shakespeare</i> (подлежащее подвергается действию — пассив).</p>
<div class="rule">Спросите себя: подлежащее <b>само</b> делает действие? Если нет (дом строят, письмо отправляют, язык изучают) — нужен пассив: <b>be + V3</b>.</div>
<p>Пассив выбирают, когда исполнитель неизвестен, неважен или очевиден: <i>My bike <b>was stolen</b></i>. Исполнителя вводят предлогом <b>by</b> (by my brother), инструмент — <b>with</b> (cut with a knife).</p>
<div class="quick" data-a="are grown">Закончите: Bananas ______ in hot countries. (GROW)</div>` },
        { h: 'Формы пассива', html: String.raw`<table class="tbl">
<tr><th>Время</th><th>Формула</th><th>Пример</th></tr>
<tr><td>Present Simple</td><td>am / is / are + V3</td><td>The room <b>is cleaned</b> every day.</td></tr>
<tr><td>Past Simple</td><td>was / were + V3</td><td>The bridge <b>was built</b> in 1900.</td></tr>
<tr><td>Future Simple</td><td>will be + V3</td><td>The results <b>will be announced</b> tomorrow.</td></tr>
<tr><td>Present Perfect</td><td>has / have been + V3</td><td>The tickets <b>have been sold</b>.</td></tr>
<tr><td>Past Perfect</td><td>had been + V3</td><td>The work <b>had been done</b> by six.</td></tr>
<tr><td>Present Continuous</td><td>am / is / are being + V3</td><td>The road <b>is being repaired</b>.</td></tr>
<tr><td>Past Continuous</td><td>was / were being + V3</td><td>The car <b>was being washed</b>.</td></tr>
<tr><td>Модальный глагол</td><td>can / must / should + be + V3</td><td>It <b>must be done</b> today.</td></tr>
</table>
<div class="tip">Время пассива «живёт» в глаголе be, а смысловой глагол всегда в 3-й форме. Поставьте be в нужное время — и готово.</div>` },
        { h: 'Пассив на экзамене', html: String.raw`<p>В тексте ОГЭ/ЕГЭ пассив маскируется: дан глагол капсом (BUILD, INVENT, DISCOVER), а подлежащее — предмет или явление.</p>
<div class="example"><p><b>Пример.</b> <i>The first underground railway ______ in London in 1863.</i> (OPEN)</p><p>Железная дорога не открывала сама себя → пассив; in 1863 → Past Simple; подлежащее в ед. ч. → <b>was opened</b>.</p></div>
<div class="trap">Типичные ошибки: 1) забыть be (<s>The castle built in 1200</s>); 2) неправильная V3 (<s>was sang</s> → was <b>sung</b>, <s>was teached</s> → was <b>taught</b>); 3) не согласовать be с подлежащим (<s>The houses was built</s> → <b>were</b> built).</div>
<p>«Я родился» — только пассив: <i>I <b>was born</b> in 2010</i>. Настоящее время тут невозможно.</p>` }
      ],
      tasks: [
        { id: 'eng-passive-1', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>This castle ______ in the 12th century.</i> (BUILD)",
          answer: 'was built',
          hint: 'Замок не строил сам себя. Когда?',
          solution: "Подлежащее не выполняет действие → пассив. Прошлое (12th century), ед. ч. → <b>was built</b>." },
        { id: 'eng-passive-2', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>English ______ in many countries all over the world.</i> (SPEAK)",
          answer: 'is spoken',
          hint: 'Общий факт в настоящем; speak — неправильный глагол.',
          solution: "Язык «говорят» (на нём говорят) → пассив, факт → Present Simple: is + V3. speak — spoke — spoken → <b>is spoken</b>." },
        { id: 'eng-passive-3', type: 'input', exam: 'oge', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>The letters ______ yesterday morning, so they will arrive soon.</i> (SEND)",
          answer: 'were sent',
          hint: 'Подлежащее во множественном числе.',
          solution: "Письма отправили → пассив; yesterday → Past Simple; letters — мн. ч. → were. send — sent — sent: <b>were sent</b>." },
        { id: 'eng-passive-4', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>A new sports centre ______ in our town next year.</i> (OPEN)",
          answer: 'will be opened',
          hint: 'next year — будущее.',
          solution: "Центр откроют → пассив; будущее → will be + V3: <b>will be opened</b>." },
        { id: 'eng-passive-5', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>You can't visit the museum now because it ______ at the moment.</i> (REPAIR)",
          answer: 'is being repaired',
          hint: 'at the moment + пассив.',
          solution: "Процесс сейчас (at the moment) + пассив → Present Continuous Passive: <b>is being repaired</b>." },
        { id: 'eng-passive-6', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>Since 2010 more than a hundred new houses ______ in this district.</i> (BUILD)",
          answer: 'have been built',
          hint: 'since + год — какое время? И подлежащее во мн. ч.',
          solution: "since → Present Perfect; дома строят → пассив; houses — мн. ч. → <b>have been built</b>." },
        { id: 'eng-passive-7', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>This homework must ______ by Monday.</i> (DO)",
          answer: 'be done',
          hint: 'После модального глагола — инфинитив без to; работа не делает себя сама.',
          solution: "Модальный пассив: must + be + V3. do — did — done → <b>be done</b>." },
        { id: 'eng-passive-8', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Выберите верный вариант: <i>The Harry Potter books ______ by J. K. Rowling.</i>",
          options: ['wrote', 'were written', 'was written', 'are writing'],
          answer: 1,
          hint: 'books — сколько их? Книги не пишут сами себя.',
          solution: "Пассив, прошлое, подлежащее во мн. ч. (books) → <b>were written</b>." },
        { id: 'eng-passive-9', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Выберите верный вариант: <i>I ______ in 2010 in Kazan.</i>",
          options: ['am born', 'was born', 'born', 'have been born'],
          answer: 1,
          hint: 'Рождение — событие в прошлом.',
          solution: "«Родиться» по-английски — всегда пассив в прошедшем: <b>was born</b>." },
        { id: 'eng-passive-10', type: 'multi', exam: 'ege', difficulty: 3,
          q: 'Выберите предложения, в которых пассив образован <b>верно</b>.',
          options: [
            "The car was washed by my dad.",
            "The cake was cut with a knife.",
            "The problem is discussing now.",
            "This song was sang by a famous singer.",
            "The bridge is being built now."
          ],
          answer: [0, 1, 4],
          hint: 'Проверьте наличие be и правильность третьей формы.',
          solution: "1) Верно. 2) Верно (инструмент — with). 3) Проблему обсуждают → <i>is being discussed</i>. 4) sing — sang — <b>sung</b>: <i>was sung</i>. 5) Верно. Ответ: 1, 2, 5." },
        { id: 'eng-passive-11', type: 'match', exam: 'both', difficulty: 2,
          q: 'Соотнесите активное предложение с его пассивным вариантом.',
          left: ['They clean the room.', 'They cleaned the room.', 'They have cleaned the room.', 'They will clean the room.'],
          right: ['The room will be cleaned.', 'The room is being cleaned.', 'The room is cleaned.', 'The room has been cleaned.', 'The room was cleaned.'],
          answer: [2, 4, 3, 0],
          hint: 'Время сохраняется: меняется только глагол be.',
          solution: "Present Simple → is cleaned; Past Simple → was cleaned; Present Perfect → has been cleaned; Future → will be cleaned. Вариант «is being cleaned» соответствует Present Continuous и лишний." },
        { id: 'eng-passive-12', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>Football ______ in almost every country of the world.</i> (PLAY)",
          answer: 'is played',
          hint: 'В футбол играют люди, сам футбол не играет. Это общий факт.',
          solution: "Подлежащее <i>football</i> не выполняет действие → пассив. Общий факт → Present Simple Passive: is + V3. play — правильный глагол: <b>is played</b>." },
        { id: 'eng-passive-13', type: 'input', exam: 'oge', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>The telephone ______ by Alexander Graham Bell in 1876.</i> (INVENT)",
          answer: 'was invented',
          hint: 'Исполнитель указан через by, год — в прошлом.',
          solution: "Телефон изобрели (исполнитель — by Bell) → пассив; in 1876 → Past Simple; подлежащее в ед. ч. → <b>was invented</b>." },
        { id: 'eng-passive-14', type: 'input', exam: 'both', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>This old bridge ______ three times since it was built.</i> (REPAIR)",
          answer: 'has been repaired',
          hint: 'since — маркер Present Perfect. Мост ремонтируют, а не он ремонтирует.',
          solution: "<i>since it was built</i> → период до настоящего → Present Perfect. Мост не ремонтирует сам себя → пассив: has/have been + V3. Подлежащее в ед. ч. → <b>has been repaired</b>." },
        { id: 'eng-passive-15', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>When we arrived at the hotel, our room ______, so we had to wait in the hall for half an hour.</i> (CLEAN)",
          answer: 'was being cleaned',
          hint: 'Уборка шла в тот момент, когда мы приехали, — поэтому пришлось ждать.',
          solution: "Процесс в момент прошлого (когда мы приехали, номер как раз убирали) → Past Continuous. Номер убирают → пассив: was/were being + V3. Подлежащее <i>our room</i> — ед. ч. → <b>was being cleaned</b>." },
        { id: 'eng-passive-16', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>By the time we got to the party, all the sandwiches ______.</i> (EAT)",
          answer: 'had been eaten',
          hint: 'By the time + прошлое: что случилось раньше? И кто кого ест?',
          solution: "Бутерброды съели <b>до</b> нашего прихода (by the time we got) → Past Perfect. Бутерброды не едят сами → пассив: had been + V3. eat — ate — eaten → <b>had been eaten</b>." },
        { id: 'eng-passive-17', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Выберите верный вариант: <i>This chocolate cake ______ by my grandmother yesterday.</i>",
          options: ['made', 'was made', 'was making', 'were made'],
          answer: 1,
          hint: 'Торт не делает себя сам. Подлежащее — в ед. ч.',
          solution: "Пассив (by my grandmother), прошлое (yesterday), подлежащее <i>cake</i> в ед. ч. → <b>was made</b>. <i>made</i> без was — не пассив, <i>was making</i> — актив, <i>were</i> — для мн. ч." },
        { id: 'eng-passive-18', type: 'order', exam: 'both', difficulty: 2,
          q: 'Расставьте части, чтобы получилось пассивное предложение в будущем времени.',
          items: ['The new school', 'will be', 'opened', 'next September.'],
          hint: 'Пассив в Future Simple: will be + V3.',
          solution: "<i>The new school will be opened next September.</i> — подлежащее, затем будущий пассив will be + V3, в конце обстоятельство времени." }
      ]
    },

    /* ============ ТЕМА 4 ============ */
    {
      id: 'eng-verbs',
      title: 'Неправильные глаголы и формы глагола',
      exam: ['oge', 'ege'],
      refs: { oge: '20–28', ege: '19–24' },
      level: 1,
      minutes: 20,
      summary: 'Три формы глагола и правила орфографии окончаний -s, -ed, -ing: без них не решить ни одного задания на времена и пассив.',
      keyPoints: [
        'Три формы: V1 (go) – V2 (went) – V3 (gone)',
        'V2 — для Past Simple; V3 — для Perfect и пассива',
        'Правильные глаголы: -ed; stop → stopped, study → studied, like → liked',
        '-ing: make → making, run → running, lie → lying',
        'Одинаковые формы: cut – cut – cut, put, let, cost, hit, set, shut',
        'lie – lay – lain (лежать) и lay – laid – laid (класть) — разные глаголы'
      ],
      theory: [
        { h: 'Три формы глагола', html: String.raw`<p>У каждого глагола три основные формы. У правильных V2 = V3 = V + <b>-ed</b>, у неправильных их нужно знать наизусть.</p>
<table class="tbl">
<tr><th>Форма</th><th>Где нужна</th><th>Пример (write)</th></tr>
<tr><td>V1 — инфинитив</td><td>Present Simple, после do/does/did, will, модальных</td><td>I write. Did you write?</td></tr>
<tr><td>V2 — Past Simple</td><td>только утвердительное Past Simple</td><td>I <b>wrote</b> a letter.</td></tr>
<tr><td>V3 — причастие прошедшего времени</td><td>Perfect (have/has/had + V3) и пассив (be + V3)</td><td>I have <b>written</b>. It was <b>written</b>.</td></tr>
</table>
<div class="rule">Видите <b>have/has/had</b> или <b>be</b> перед пропуском — нужна <b>третья</b> форма. Past Simple без вспомогательного глагола — <b>вторая</b>.</div>
<p>Потренируйтесь в тренажёре: он показывает инфинитив, а вы вводите вторую и третью формы.</p>
<div class="lab-embed" data-lab="verbs"></div>` },
        { h: 'Группы неправильных глаголов', html: String.raw`<p>Учить легче группами — по сходству форм:</p>
<table class="tbl">
<tr><th>Модель</th><th>Глаголы</th></tr>
<tr><td>A – A – A</td><td>cut – cut – cut, put, let, cost, hit, set, shut, hurt</td></tr>
<tr><td>A – B – B</td><td>buy – bought – bought, bring – brought, think – thought, teach – taught, catch – caught, find – found, keep – kept, sell – sold, tell – told</td></tr>
<tr><td>A – B – A</td><td>come – came – come, become – became – become, run – ran – run</td></tr>
<tr><td>A – B – C (i – a – u)</td><td>begin – began – begun, drink – drank – drunk, sing – sang – sung, swim – swam – swum, ring – rang – rung</td></tr>
<tr><td>A – B – C (-n)</td><td>write – wrote – written, drive – drove – driven, ride – rode – ridden, speak – spoke – spoken, break – broke – broken, choose – chose – chosen, eat – ate – eaten, fall – fell – fallen, take – took – taken, give – gave – given, know – knew – known, fly – flew – flown, grow – grew – grown</td></tr>
<tr><td>Особые</td><td>be – was/were – been, go – went – gone, do – did – done, see – saw – seen</td></tr>
</table>
<div class="quick" data-a="caught">Вторая форма глагола catch?</div>` },
        { h: 'Орфография: -s, -ed, -ing', html: String.raw`<table class="tbl">
<tr><th>Правило</th><th>-s / -es</th><th>-ed</th><th>-ing</th></tr>
<tr><td>обычно</td><td>works</td><td>worked</td><td>working</td></tr>
<tr><td>на -e</td><td>likes</td><td>liked (только -d)</td><td>liking (e выпадает)</td></tr>
<tr><td>согласная + y</td><td>studies</td><td>studied</td><td>studying (y сохраняется)</td></tr>
<tr><td>гласная + y</td><td>plays</td><td>played</td><td>playing</td></tr>
<tr><td>краткий ударный слог на одну согласную</td><td>stops</td><td>stopped</td><td>stopping</td></tr>
<tr><td>-ie</td><td>lies</td><td>lied</td><td>lying (ie → y)</td></tr>
<tr><td>-s, -sh, -ch, -x, -o</td><td>watches, goes</td><td>watched</td><td>watching</td></tr>
</table>
<div class="example"><p><b>Пример.</b> travel → travelled (брит.), begin → beginning (ударение на последнем слоге), но visit → visited, open → opening (ударение не на последнем слоге — не удваиваем).</p></div>` },
        { h: 'Ловушки-близнецы', html: String.raw`<div class="trap"><b>lie – lay – lain</b> — лежать; <b>lay – laid – laid</b> — класть; <b>lie – lied – lied</b> — лгать. <i>Yesterday I <b>lay</b> on the beach</i> (лежал), но <i>She <b>laid</b> the table</i> (накрыла на стол).</div>
<ul>
<li><b>fall – fell – fallen</b> (падать) и <b>feel – felt – felt</b> (чувствовать);</li>
<li><b>find – found – found</b> (находить) и <b>found – founded – founded</b> (основывать);</li>
<li><b>rise – rose – risen</b> (подниматься самому) и <b>raise – raised – raised</b> (поднимать что-то);</li>
<li><b>leave – left – left</b> (уходить, оставлять) и <b>live – lived – lived</b> (жить).</li>
</ul>
<div class="quick" data-a="fallen">Закончите: The leaves have ______ from the trees. (FALL)</div>` }
      ],
      tasks: [
        { id: 'eng-verbs-1', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>Last week my dad ______ me a new phone.</i> (BUY)",
          answer: 'bought',
          hint: 'Past Simple неправильного глагола.',
          solution: "last week → Past Simple. buy — bought — bought: <b>bought</b>." },
        { id: 'eng-verbs-2', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>Have you ever ______ a horse?</i> (RIDE)",
          answer: 'ridden',
          hint: 'После have — какая форма?',
          solution: "Present Perfect: have + V3. ride — rode — <b>ridden</b>." },
        { id: 'eng-verbs-3', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>The lesson ______ at 9 o'clock yesterday.</i> (BEGIN)",
          answer: 'began',
          hint: 'yesterday; begin — неправильный глагол.',
          solution: "Past Simple, вторая форма: begin — <b>began</b> — begun." },
        { id: 'eng-verbs-4', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>She has already ______ three letters this morning.</i> (WRITE)",
          answer: 'written',
          hint: 'has + V3. Сколько букв t?',
          solution: "Present Perfect: has + V3. write — wrote — <b>written</b> (с двумя t)." },
        { id: 'eng-verbs-5', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>When I was ten, I ______ off my bike and broke my arm.</i> (FALL)",
          answer: 'fell',
          hint: 'Не перепутайте с глаголом feel.',
          solution: "Past Simple: fall — <b>fell</b> — fallen. (felt — это прошедшее от feel.)" },
        { id: 'eng-verbs-6', type: 'input', exam: 'oge', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>Who has ______ my chocolate?</i> (EAT)",
          answer: 'eaten',
          hint: 'has + V3.',
          solution: "Present Perfect: has + V3. eat — ate — <b>eaten</b>." },
        { id: 'eng-verbs-7', type: 'input', exam: 'both', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>We got up early and watched how the sun ______ over the sea.</i> (RISE)",
          answer: ['rose', 'was rising'],
          hint: 'Рассказ о прошлом; rise — неправильный глагол.',
          solution: "got, watched — Past Simple, значит и здесь Past Simple. rise — <b>rose</b> — risen. (Past Continuous <i>was rising</i> тоже допустим: солнце поднималось, пока мы смотрели.)" },
        { id: 'eng-verbs-8', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>Be quiet, please! Grandpa ______ a letter to his old friend.</i> (WRITE)",
          answer: ['is writing', "'s writing", "’s writing"],
          hint: 'Действие сейчас. Что происходит с немой e перед -ing?',
          solution: "Present Continuous: is + V-ing. Немая e выпадает: write → <b>writing</b> (одна t!). Ответ: <b>is writing</b>." },
        { id: 'eng-verbs-9', type: 'choice', exam: 'oge', difficulty: 1,
          q: 'Какова вторая форма (Past Simple) глагола <b>think</b>?',
          options: ['thinked', 'thought', 'taught', 'thank'],
          answer: 1,
          hint: 'Не путайте с teach.',
          solution: "think — <b>thought</b> — thought. taught — формы глагола teach (учить)." },
        { id: 'eng-verbs-10', type: 'match', exam: 'ege', difficulty: 2,
          q: 'Соотнесите глагол с его третьей формой (V3).',
          left: ['bring', 'choose', 'fly', 'teach'],
          right: ['flew', 'taught', 'chosen', 'brought', 'flown'],
          answer: [3, 2, 4, 1],
          hint: 'Одна форма в правой колонке — вторая, а не третья.',
          solution: "bring — brought — <b>brought</b>; choose — chose — <b>chosen</b>; fly — flew — <b>flown</b>; teach — taught — <b>taught</b>. flew — это V2 глагола fly." },
        { id: 'eng-verbs-11', type: 'multi', exam: 'both', difficulty: 2,
          q: 'Выберите глаголы, у которых все три формы <b>одинаковы</b>.',
          options: ['cut', 'put', 'get', 'cost', 'keep'],
          answer: [0, 1, 3],
          hint: 'Модель A – A – A.',
          solution: "cut – cut – cut, put – put – put, cost – cost – cost. У get: got – got (в американском V3 gotten), у keep: kept – kept." },
        { id: 'eng-verbs-12', type: 'choice', exam: 'ege', difficulty: 3,
          q: "Выберите верный вариант: <i>Yesterday I ______ on the beach all day and got sunburnt.</i>",
          options: ['lay', 'laid', 'lied', 'lain'],
          answer: 0,
          hint: 'Здесь значение «лежать».',
          solution: "lie (лежать) — <b>lay</b> — lain. laid — формы глагола lay (класть), lied — от lie (лгать), lain — третья форма, без have не употребляется." },
        { id: 'eng-verbs-13', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>Yesterday I ______ my old friend in the park.</i> (MEET)",
          answer: 'met',
          hint: 'Yesterday — Past Simple; meet — неправильный глагол.',
          solution: "Маркер <i>yesterday</i> → Past Simple, вторая форма. meet — <b>met</b> — met." },
        { id: 'eng-verbs-14', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>We have ______ a lot of money on presents this year.</i> (SPEND)",
          answer: 'spent',
          hint: 'После have — третья форма.',
          solution: "Present Perfect: have + V3. spend — spent — <b>spent</b> (модель A – B – B, как send — sent — sent)." },
        { id: 'eng-verbs-15', type: 'input', exam: 'both', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>Mum ______ the table and called us to dinner.</i> (LAY)",
          answer: 'laid',
          hint: 'lay = класть, накрывать (на стол). Второй глагол called — в Past Simple.',
          solution: "Цепочка действий в прошлом (called) → Past Simple. lay the table — «накрывать на стол»; lay — <b>laid</b> — laid (пишется через i, не «layed»). Не путайте с lie — lay — lain (лежать)." },
        { id: 'eng-verbs-16', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>Look! Two dogs ______ after a cat in the street.</i> (RUN)",
          answer: 'are running',
          hint: 'Look! — Present Continuous. Что происходит с n перед -ing?',
          solution: "<i>Look!</i> → действие сейчас → Present Continuous; <i>two dogs</i> — мн. ч. → are. run — краткий ударный слог на одну согласную → n удваивается: <b>are running</b>." },
        { id: 'eng-verbs-17', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>Who ______ this company? — My grandfather did, in 1990.</i> (FOUND)",
          answer: 'founded',
          hint: 'FOUND здесь не вторая форма find, а отдельный глагол «основывать».',
          solution: "found (основывать) — правильный глагол: found — founded — founded. Ответ «My grandfather did» и 1990 → Past Simple; вопрос к подлежащему (who) строится без did: <i>Who <b>founded</b> this company?</i>" },
        { id: 'eng-verbs-18', type: 'choice', exam: 'oge', difficulty: 1,
          q: 'Какова третья форма (V3) глагола <b>swim</b>?',
          options: ['swam', 'swum', 'swimmed', 'swimming'],
          answer: 1,
          hint: 'Модель i – a – u, как begin — began — begun.',
          solution: "swim — swam — <b>swum</b>. swam — вторая форма, swimming — форма -ing, «swimmed» не существует." },
        { id: 'eng-verbs-19', type: 'multi', exam: 'ege', difficulty: 2,
          q: 'Выберите глаголы, у которых вторая и третья формы <b>совпадают</b>.',
          options: ['tell', 'drink', 'sell', 'find', 'drive'],
          answer: [0, 2, 3],
          hint: 'Выпишите три формы каждого глагола.',
          solution: "tell — told — told, sell — sold — sold, find — found — found: V2 = V3. У drink — drank — drunk и drive — drove — driven формы разные. Ответ: 1, 3, 4." }
      ]
    },
    /* ============ ТЕМА 5 ============ */
    {
      id: 'eng-transform',
      title: 'Степени сравнения, местоимения, числительные',
      exam: ['oge', 'ege'],
      refs: { oge: '20–28', ege: '19–24' },
      level: 1,
      minutes: 15,
      summary: 'Грамматические трансформации не глаголов: прилагательные, местоимения, порядковые числительные и множественное число.',
      keyPoints: [
        'Короткие прилагательные: -er / the -est (cold – colder – the coldest)',
        'Длинные: more / the most (interesting – more interesting – the most interesting)',
        'good – better – best; bad – worse – worst; little – less – least; many/much – more – most',
        'my – mine, her – hers, our – ours; I – me, they – them; myself, themselves',
        'Порядковые: first, second, third, fifth, ninth, twelfth, twentieth',
        'Особое мн. ч.: child – children, man – men, woman – women, foot – feet, tooth – teeth, mouse – mice'
      ],
      theory: [
        { h: 'Степени сравнения прилагательных', html: String.raw`<table class="tbl">
<tr><th>Тип</th><th>Сравнительная</th><th>Превосходная</th></tr>
<tr><td>односложные: tall, cold</td><td>taller, colder</td><td>the tallest, the coldest</td></tr>
<tr><td>на -e: nice, large</td><td>nicer, larger</td><td>the nicest, the largest</td></tr>
<tr><td>краткая гласная + согласная: big, hot, thin</td><td>bigger, hotter, thinner</td><td>the biggest, the hottest, the thinnest</td></tr>
<tr><td>на -y: happy, easy, busy</td><td>happier, easier</td><td>the happiest, the easiest</td></tr>
<tr><td>длинные: beautiful, interesting</td><td>more beautiful</td><td>the most beautiful</td></tr>
</table>
<div class="rule">Исключения: <b>good – better – the best</b>; <b>bad – worse – the worst</b>; <b>little – less – the least</b>; <b>many/much – more – the most</b>; <b>far – farther/further – the farthest/furthest</b>; <b>old – older/elder – the oldest/eldest</b> (elder — о членах семьи).</div>
<p>Подсказки в предложении: <b>than</b> → сравнительная степень; <b>the ... in/of</b>, <b>the ... I have ever seen</b> → превосходная.</p>
<div class="trap">Не удваивайте степень: <s>more better</s>, <s>the most biggest</s>. И не забывайте удвоить согласную: big → bi<b>gg</b>er, hot → ho<b>tt</b>est.</div>
<div class="quick" data-a="easier">Закончите: This test is ______ than the last one. (EASY)</div>` },
        { h: 'Местоимения', html: String.raw`<table class="tbl">
<tr><th>Личное</th><th>Объектное</th><th>Притяжательное (перед сущ.)</th><th>Абсолютное (без сущ.)</th><th>Возвратное</th></tr>
<tr><td>I</td><td>me</td><td>my</td><td>mine</td><td>myself</td></tr>
<tr><td>you</td><td>you</td><td>your</td><td>yours</td><td>yourself / yourselves</td></tr>
<tr><td>he</td><td>him</td><td>his</td><td>his</td><td>himself</td></tr>
<tr><td>she</td><td>her</td><td>her</td><td>hers</td><td>herself</td></tr>
<tr><td>it</td><td>it</td><td>its</td><td>—</td><td>itself</td></tr>
<tr><td>we</td><td>us</td><td>our</td><td>ours</td><td>ourselves</td></tr>
<tr><td>they</td><td>them</td><td>their</td><td>theirs</td><td>themselves</td></tr>
</table>
<div class="example"><p><b>Пример.</b> <i>This is not my bag. It's ______.</i> (SHE) — после глагола, без существительного → <b>hers</b>.</p><p><i>Help ______! I can't swim!</i> (I) — после глагола дополнение → <b>me</b>.</p><p><i>Did you paint it ______?</i> (YOU) — «сам» → <b>yourself</b>.</p></div>
<div class="trap"><b>its</b> (его, её — о предмете) пишется <b>без</b> апострофа. <b>it's</b> = it is / it has.</div>` },
        { h: 'Числительные и множественное число', html: String.raw`<p>В экзамене числительное капсом (ONE, THREE, TWENTY) обычно надо превратить в <b>порядковое</b> — после the или в дате.</p>
<table class="tbl">
<tr><th>Количественное</th><th>Порядковое</th></tr>
<tr><td>one, two, three</td><td>first, second, third</td></tr>
<tr><td>five, nine, twelve</td><td>fifth, ninth, twelfth</td></tr>
<tr><td>eight</td><td>eighth</td></tr>
<tr><td>twenty, forty</td><td>twentieth, fortieth</td></tr>
<tr><td>twenty-one</td><td>twenty-first</td></tr>
</table>
<div class="trap">Орфография: f<b>if</b>th (не fiveth), ni<b>n</b>th (без e), twel<b>f</b>th, forty (без u, хотя four), eigh<b>th</b> (одна t).</div>
<p>Существительное капсом ставят во множественное число, если перед ним many, a lot of, two, these и т. п.</p>
<table class="tbl">
<tr><th>Правило</th><th>Примеры</th></tr>
<tr><td>-s / -es</td><td>books, boxes, buses, potatoes, tomatoes</td></tr>
<tr><td>согласная + y → -ies</td><td>city – cities, story – stories (но day – days)</td></tr>
<tr><td>-f / -fe → -ves</td><td>leaf – leaves, knife – knives, wife – wives, shelf – shelves</td></tr>
<tr><td>особые</td><td>man – men, woman – women, child – children, foot – feet, tooth – teeth, mouse – mice, person – people</td></tr>
<tr><td>не меняются</td><td>sheep, fish, deer</td></tr>
</table>
<div class="quick" data-a="women">Закончите: There are three ______ in the photo. (WOMAN)</div>` }
      ],
      tasks: [
        { id: 'eng-transform-1', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте слово в нужную форму: <i>My brother is two years older than me, but he is ______ than me.</i> (SHORT)",
          answer: 'shorter',
          hint: 'than — сравнительная степень.',
          solution: "Перед than — сравнительная степень. short — односложное: <b>shorter</b>." },
        { id: 'eng-transform-2', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте слово в нужную форму: <i>Yesterday was the ______ day of the year.</i> (HOT)",
          answer: 'hottest',
          hint: 'the + превосходная степень. Удвоение согласной.',
          solution: "the ... of the year → превосходная степень. hot: краткая гласная + согласная → удвоение: <b>hottest</b>." },
        { id: 'eng-transform-3', type: 'input', exam: 'oge', difficulty: 2,
          q: "Поставьте слово в нужную форму: <i>Today the weather is even ______ than yesterday.</i> (BAD)",
          answer: 'worse',
          hint: 'bad — исключение.',
          solution: "than → сравнительная степень; bad — worse — worst → <b>worse</b>." },
        { id: 'eng-transform-4', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте слово в нужную форму: <i>January is the ______ month of the year.</i> (ONE)",
          answer: 'first',
          hint: 'Нужно порядковое числительное.',
          solution: "«Первый месяц» → порядковое числительное: <b>first</b>." },
        { id: 'eng-transform-5', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте слово в нужную форму: <i>My birthday is on the ______ of May.</i> (TWELVE)",
          answer: 'twelfth',
          hint: 'Порядковое; ve → f.',
          solution: "Дата → порядковое числительное. twelve → <b>twelfth</b> (ve меняется на f)." },
        { id: 'eng-transform-6', type: 'input', exam: 'oge', difficulty: 2,
          q: "Поставьте слово в нужную форму: <i>Look at the ______! They are playing football in the yard.</i> (CHILD)",
          answer: 'children',
          hint: 'They are — значит, детей много.',
          solution: "They are → множественное число; child — особое мн. ч.: <b>children</b>." },
        { id: 'eng-transform-7', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте слово в нужную форму: <i>Nobody helped the twins, they built the tree house ______.</i> (THEY)",
          answer: 'themselves',
          hint: '«Сами» — возвратное местоимение.',
          solution: "«Сами, без помощи» → возвратное местоимение 3-го лица мн. ч.: <b>themselves</b>." },
        { id: 'eng-transform-8', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте слово в нужную форму: <i>This is not my umbrella. I think it's ______.</i> (SHE)",
          answer: 'hers',
          hint: 'После it\'s нет существительного.',
          solution: "Существительного после местоимения нет → абсолютная форма: she → <b>hers</b> (без апострофа)." },
        { id: 'eng-transform-9', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте слово в нужную форму: <i>It was the ______ film I have ever seen.</i> (INTERESTING)",
          answer: 'most interesting',
          hint: 'the ... I have ever seen. Прилагательное длинное.',
          solution: "Превосходная степень многосложного прилагательного: the <b>most interesting</b>." },
        { id: 'eng-transform-10', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте слово в нужную форму: <i>At the dentist's the little boy was afraid that he would lose all his ______.</i> (TOOTH)",
          answer: 'teeth',
          hint: 'all + мн. ч. Особая форма.',
          solution: "all his → множественное число. tooth — <b>teeth</b> (как foot — feet)." },
        { id: 'eng-transform-11', type: 'choice', exam: 'ege', difficulty: 2,
          q: "Выберите верный вариант: <i>My grandparents live ______ from the city centre than we do.</i>",
          options: ['farther', 'more far', 'farthest', 'the farther'],
          answer: 0,
          hint: 'than → сравнительная; far образует степени особо.',
          solution: "far — farther/further — farthest/furthest. Перед than — сравнительная степень без the: <b>farther</b>." },
        { id: 'eng-transform-12', type: 'match', exam: 'both', difficulty: 2,
          q: 'Соотнесите прилагательное (наречие) с его сравнительной степенью.',
          left: ['good', 'little', 'many', 'bad'],
          right: ['worse', 'least', 'more', 'better', 'less'],
          answer: [3, 4, 2, 0],
          hint: 'Все четыре — исключения. Одна форма в правой колонке превосходная.',
          solution: "good → better; little → less; many → more; bad → worse. least — превосходная степень от little, лишняя." },
        { id: 'eng-transform-13', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте слово в нужную форму: <i>Moscow is the ______ city in Russia.</i> (BIG)",
          answer: 'biggest',
          hint: 'the ... in Russia — превосходная степень. Удваивается ли согласная?',
          solution: "the + ... in Russia → превосходная степень. big: краткая гласная + одна согласная → g удваивается: <b>biggest</b>." },
        { id: 'eng-transform-14', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте слово в нужную форму: <i>In autumn the ______ on the trees turn yellow and red.</i> (LEAF)",
          answer: 'leaves',
          hint: 'Глагол turn без -s — значит, подлежащее во мн. ч. Что происходит с -f?',
          solution: "Глагол <i>turn</i> без -s и смысл (листья на деревьях) → множественное число. leaf: -f → -ves: <b>leaves</b> (как knife — knives, shelf — shelves)." },
        { id: 'eng-transform-15', type: 'input', exam: 'both', difficulty: 2,
          q: "Поставьте слово в нужную форму: <i>We live on the ______ floor of a tall building, so we always take the lift.</i> (NINE)",
          answer: 'ninth',
          hint: 'the ... floor — нужно порядковое числительное. Остаётся ли e?',
          solution: "«На девятом этаже» → порядковое числительное. nine + th, буква e выпадает: <b>ninth</b> (не «nineth»)." },
        { id: 'eng-transform-16', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте слово в нужную форму: <i>My grandparents live far away, so I don't see ______ very often.</i> (THEY)",
          answer: 'them',
          hint: 'После глагола see местоимение стоит в роли дополнения.',
          solution: "Местоимение после глагола — дополнение → объектный падеж: they → <b>them</b>." },
        { id: 'eng-transform-17', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте слово в нужную форму: <i>This is the ______ book I have ever read — I couldn't put it down.</i> (GOOD)",
          answer: 'best',
          hint: 'the ... I have ever read — превосходная степень. good — исключение.',
          solution: "Конструкция <i>the ... I have ever read</i> требует превосходной степени. good — better — <b>best</b>." },
        { id: 'eng-transform-18', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте слово в нужную форму: <i>Our neighbours have a huge garden. Our garden is not as big as ______.</i> (THEY)",
          answer: 'theirs',
          hint: 'После as существительного нет: «как их (сад)».',
          solution: "Речь о саде соседей, а существительное после местоимения не повторяется → абсолютная притяжательная форма: they → <b>theirs</b> (= their garden). <i>them</i> здесь не подходит: сравниваются сады, а не люди." },
        { id: 'eng-transform-19', type: 'match', exam: 'both', difficulty: 2,
          q: 'Соотнесите существительное с его формой множественного числа.',
          left: ['mouse', 'knife', 'foot', 'person'],
          right: ['feet', 'people', 'mice', 'knives', 'knifes'],
          answer: [2, 3, 0, 1],
          hint: 'Все четыре слова образуют мн. ч. не по общему правилу. Одна форма в правой колонке — ошибочная.',
          solution: "mouse → mice; knife → knives (-fe → -ves); foot → feet; person → people. «knifes» — ошибка: у knife мн. ч. только knives." }
      ]
    },

    /* ============ ТЕМА 6 ============ */
    {
      id: 'eng-word-formation',
      title: 'Словообразование',
      exam: ['oge', 'ege'],
      refs: { oge: '29–34', ege: '25–29' },
      level: 2,
      minutes: 20,
      summary: 'Суффиксы и приставки: образуем из слова-подсказки существительное, прилагательное, наречие или глагол с нужным смыслом.',
      keyPoints: [
        'Сначала часть речи по позиции: после a/the/прилагательного — существительное, перед существительным — прилагательное, при глаголе — наречие',
        'Существительные: -tion/-sion, -ment, -ness, -ity, -ance/-ence, -er/-or, -ist',
        'Прилагательные: -ful, -less, -ous, -able/-ible, -al, -ive, -y, -ic',
        'Наречия: прилагательное + -ly: quick → quickly, happy → happily',
        'Отрицание: un-, in-, im- (перед p, m), il- (перед l), ir- (перед r), dis-, mis-',
        'Проверьте смысл (нужно ли отрицание) и число (нужно ли -s)'
      ],
      theory: [
        { h: 'Алгоритм: сначала часть речи', html: String.raw`<p>В ОГЭ (29–34) и ЕГЭ (25–29) нужно образовать однокоренное слово. Ответ почти всегда подсказывает место пропуска.</p>
<table class="tbl">
<tr><th>Позиция</th><th>Нужна часть речи</th><th>Пример</th></tr>
<tr><td>после a/an/the, my, this, прилагательного; перед of</td><td>существительное</td><td>the <b>invention</b> of the radio</td></tr>
<tr><td>перед существительным; после be, become, seem, look, feel</td><td>прилагательное</td><td>a <b>careful</b> driver; she looks <b>happy</b></td></tr>
<tr><td>при глаголе: как? каким образом?</td><td>наречие</td><td>he drives <b>carefully</b></td></tr>
<tr><td>после подлежащего, после to, модальных</td><td>глагол</td><td>We must <b>protect</b> nature.</td></tr>
</table>
<div class="rule">1) Определите часть речи по позиции. 2) Подберите суффикс. 3) Прочитайте весь абзац: не нужно ли отрицание (<i>but, unfortunately, however</i>) или множественное число (<i>many, several, a lot of</i>)? 4) Проверьте орфографию.</div>` },
        { h: 'Суффиксы существительных', html: String.raw`<table class="tbl">
<tr><th>Суффикс</th><th>От чего</th><th>Примеры</th></tr>
<tr><td>-tion / -sion / -ation</td><td>глагол</td><td>invent → invention, decide → decision, explain → explanation, inform → information</td></tr>
<tr><td>-ment</td><td>глагол</td><td>develop → development, agree → agreement, entertain → entertainment</td></tr>
<tr><td>-ness</td><td>прилагательное</td><td>kind → kindness, happy → happiness, dark → darkness</td></tr>
<tr><td>-ity</td><td>прилагательное</td><td>popular → popularity, active → activity, possible → possibility</td></tr>
<tr><td>-ance / -ence</td><td>глагол, прилагательное</td><td>perform → performance, differ → difference, important → importance</td></tr>
<tr><td>-er / -or / -ist / -ian</td><td>глагол, сущ. (человек)</td><td>teach → teacher, visit → visitor, science → scientist, music → musician</td></tr>
<tr><td>-ship / -hood / -dom</td><td>существительное, прилагательное</td><td>friend → friendship, child → childhood, free → freedom</td></tr>
</table>
<div class="trap">Меняется написание основы: explain → expl<b>a</b>nation, pronounce → pron<b>u</b>nciation, describe → descri<b>p</b>tion, long → length, wide → width, strong → strength, high → height.</div>` },
        { h: 'Прилагательные и наречия', html: String.raw`<table class="tbl">
<tr><th>Суффикс</th><th>Значение</th><th>Примеры</th></tr>
<tr><td>-ful</td><td>полный чего-то</td><td>care → careful, beauty → beautiful, success → successful</td></tr>
<tr><td>-less</td><td>без чего-то</td><td>care → careless, home → homeless, use → useless</td></tr>
<tr><td>-ous</td><td>обладающий</td><td>fame → famous, danger → dangerous, courage → courageous</td></tr>
<tr><td>-able / -ible</td><td>возможный</td><td>comfort → comfortable, enjoy → enjoyable, sense → sensible</td></tr>
<tr><td>-al / -ic / -ive</td><td>относящийся к</td><td>nation → national, tradition → traditional, science → scientific, act → active, attract → attractive</td></tr>
<tr><td>-y</td><td>с признаком</td><td>sun → sunny, rain → rainy, fun → funny, health → healthy</td></tr>
</table>
<div class="rule">Наречие = прилагательное + <b>-ly</b>: quick → quickly, careful → careful<b>ly</b> (две l), happy → happ<b>ily</b>, possible → possib<b>ly</b>, true → tru<b>ly</b>. Особые: good → <b>well</b>, fast → fast, hard → hard.</div>
<div class="quick" data-a="dangerous">Закончите: Swimming in this river is ______. (DANGER)</div>` },
        { h: 'Отрицательные приставки', html: String.raw`<table class="tbl">
<tr><th>Приставка</th><th>Примеры</th></tr>
<tr><td>un-</td><td>unhappy, unusual, unfriendly, unknown, unexpected, unfortunately</td></tr>
<tr><td>in-</td><td>incorrect, independent, informal, invisible</td></tr>
<tr><td>im- (перед p, m)</td><td>impossible, impolite, impatient, immoral</td></tr>
<tr><td>il- (перед l)</td><td>illegal, illogical</td></tr>
<tr><td>ir- (перед r)</td><td>irregular, irresponsible</td></tr>
<tr><td>dis-</td><td>dislike, disagree, disappear, dishonest, disadvantage</td></tr>
<tr><td>mis- (неправильно)</td><td>misunderstand, mistake, misprint</td></tr>
<tr><td>re- (снова)</td><td>rewrite, rebuild, retell</td></tr>
</table>
<div class="example"><p><b>Пример.</b> <i>The test was very difficult and many students found it ______ to finish it in time.</i> (POSSIBLE)</p><p>По смыслу «трудно» → «невозможно»: <b>impossible</b>. Без анализа смысла здесь легко потерять балл.</p></div>
<div class="trap">Одна задача — иногда две операции: <i>He ______ with me.</i> (AGREE) → dis + agree + s = <b>disagrees</b>. Проверяйте и приставку, и грамматическое окончание.</div>` }
      ],
      tasks: [
        { id: 'eng-word-formation-1', type: 'input', exam: 'oge', difficulty: 1,
          q: "Образуйте однокоренное слово: <i>The film was very ______, we laughed a lot.</i> (FUN)",
          answer: 'funny',
          hint: 'После very нужно прилагательное.',
          solution: "very + прилагательное. fun + y с удвоением n: <b>funny</b> (смешной)." },
        { id: 'eng-word-formation-2', type: 'input', exam: 'oge', difficulty: 1,
          q: "Образуйте однокоренное слово: <i>Be ______! The road is very slippery today.</i> (CARE)",
          answer: 'careful',
          hint: 'После be — прилагательное: «будь осторожен».',
          solution: "Be + прилагательное; «полный заботы, внимания» → care + ful = <b>careful</b> (одна l в конце)." },
        { id: 'eng-word-formation-3', type: 'input', exam: 'oge', difficulty: 2,
          q: "Образуйте однокоренное слово: <i>The teacher gave us a clear ______ of the new rule.</i> (EXPLAIN)",
          answer: 'explanation',
          hint: 'После a clear — существительное. Внимательно с корнем!',
          solution: "a + прилагательное + ____ + of → существительное. explain → <b>explanation</b> (ai → a)." },
        { id: 'eng-word-formation-4', type: 'input', exam: 'oge', difficulty: 2,
          q: "Образуйте однокоренное слово: <i>Our town is famous for its ______ old buildings.</i> (BEAUTY)",
          answer: 'beautiful',
          hint: 'Перед существительным — прилагательное.',
          solution: "Перед buildings — прилагательное. beauty + ful, y → i: <b>beautiful</b>." },
        { id: 'eng-word-formation-5', type: 'input', exam: 'oge', difficulty: 2,
          q: "Образуйте однокоренное слово: <i>My cousin works as a ______ in a big laboratory.</i> (SCIENCE)",
          answer: 'scientist',
          hint: 'as a ... — профессия, человек.',
          solution: "Нужно существительное-человек: science → <b>scientist</b> (учёный)." },
        { id: 'eng-word-formation-6', type: 'input', exam: 'ege', difficulty: 2,
          q: "Образуйте однокоренное слово: <i>Unfortunately, my answer was ______, so I got a bad mark.</i> (CORRECT)",
          answer: 'incorrect',
          hint: 'Unfortunately и плохая оценка подсказывают смысл.',
          solution: "По смыслу ответ был неправильным → отрицательная приставка in-: <b>incorrect</b>." },
        { id: 'eng-word-formation-7', type: 'input', exam: 'ege', difficulty: 2,
          q: "Образуйте однокоренное слово: <i>When they saw the sea, the children ran ______ towards the water.</i> (HAPPY)",
          answer: 'happily',
          hint: 'Как бежали? Нужно наречие.',
          solution: "Глагол ran + как? → наречие. happy + ly, y → i: <b>happily</b>." },
        { id: 'eng-word-formation-8', type: 'input', exam: 'ege', difficulty: 3,
          q: "Образуйте однокоренное слово: <i>My brother often ______ with me: he thinks my ideas are silly.</i> (AGREE)",
          answer: 'disagrees',
          hint: 'Две операции: смысл и форма глагола.',
          solution: "По смыслу «не соглашается» → dis-; often + подлежащее he → Present Simple с -s: <b>disagrees</b>." },
        { id: 'eng-word-formation-9', type: 'input', exam: 'ege', difficulty: 3,
          q: "Образуйте однокоренное слово: <i>The ______ of the river here is about 200 metres.</i> (WIDE)",
          answer: 'width',
          hint: 'The ... of — существительное. Как long → length.',
          solution: "Нужно существительное «ширина»: wide → <b>width</b>." },
        { id: 'eng-word-formation-10', type: 'input', exam: 'ege', difficulty: 2,
          q: "Образуйте однокоренное слово: <i>The test was so hard that it was ______ to finish it in 40 minutes.</i> (POSSIBLE)",
          answer: 'impossible',
          hint: 'so hard — смысл отрицательный. Какая приставка перед p?',
          solution: "Тест трудный → закончить было невозможно. Перед p — приставка im-: <b>impossible</b>." },
        { id: 'eng-word-formation-11', type: 'match', exam: 'both', difficulty: 1,
          q: 'Какую часть речи образует суффикс? Установите соответствие.',
          left: ['-ness (kindness)', '-ous (famous)', '-ly (quickly)', '-ise / -ize (organise)'],
          right: ['глагол', 'наречие', 'существительное', 'прилагательное'],
          answer: [2, 3, 1, 0],
          hint: 'Посмотрите на примеры в скобках.',
          solution: "-ness → существительное; -ous → прилагательное; -ly (от прилагательного) → наречие; -ise/-ize → глагол." },
        { id: 'eng-word-formation-12', type: 'multi', exam: 'ege', difficulty: 3,
          q: 'Выберите слова, образованные <b>правильно</b>.',
          options: ['unhappy', 'dishonest', 'unpossible', 'irregular', 'inlegal', 'misunderstand'],
          answer: [0, 1, 3, 5],
          hint: 'Вспомните: im- перед p, il- перед l.',
          solution: "Верно: unhappy, dishonest, irregular, misunderstand. Ошибки: <i>unpossible</i> → impossible, <i>inlegal</i> → illegal." },
        { id: 'eng-word-formation-13', type: 'input', exam: 'oge', difficulty: 1,
          q: "Образуйте однокоренное слово: <i>My grandfather is a famous ______. His pictures are in many museums.</i> (ART)",
          answer: 'artist',
          hint: 'a famous ... — нужно существительное, причём человек.',
          solution: "После <i>a famous</i> — существительное; по смыслу (его картины в музеях) — человек, художник: art + ist = <b>artist</b>." },
        { id: 'eng-word-formation-14', type: 'input', exam: 'oge', difficulty: 2,
          q: "Образуйте однокоренное слово: <i>We were surprised by the ______ of the people in the village: everybody tried to help us.</i> (KIND)",
          answer: 'kindness',
          hint: 'the ... of — существительное. Какой суффикс превращает прилагательное в существительное-качество?',
          solution: "Позиция <i>the ... of</i> → существительное. От прилагательного kind (добрый) существительное-качество образуется суффиксом -ness: <b>kindness</b> (доброта)." },
        { id: 'eng-word-formation-15', type: 'input', exam: 'both', difficulty: 2,
          q: "Образуйте однокоренное слово: <i>Please drive ______ — the road is wet after the rain.</i> (CARE)",
          answer: 'carefully',
          hint: 'Как вести машину? Нужно наречие — в два шага.',
          solution: "Глагол drive + как? → наречие. Две операции: care → careful (прилагательное) → careful + ly = <b>carefully</b> (две l)." },
        { id: 'eng-word-formation-16', type: 'input', exam: 'ege', difficulty: 2,
          q: "Образуйте однокоренное слово: <i>The ______ of this young singer is growing every year.</i> (POPULAR)",
          answer: 'popularity',
          hint: 'The ... of — существительное. Суффикс -ity.',
          solution: "Позиция <i>the ... of</i> и глагол <i>is growing</i> → существительное в ед. ч. popular + ity = <b>popularity</b> (популярность)." },
        { id: 'eng-word-formation-17', type: 'input', exam: 'ege', difficulty: 3,
          q: "Образуйте однокоренное слово: <i>The guide was very ______: she didn't answer our questions and never smiled.</i> (FRIEND)",
          answer: 'unfriendly',
          hint: 'После very — прилагательное. А смысл положительный или отрицательный?',
          solution: "very + прилагательное: friend → friendly (суффикс -ly здесь образует прилагательное). По смыслу экскурсовод была недружелюбной (не отвечала на вопросы, не улыбалась) → приставка un-: <b>unfriendly</b>." },
        { id: 'eng-word-formation-18', type: 'input', exam: 'ege', difficulty: 2,
          q: "Образуйте однокоренное слово: <i>This rule is too difficult for the little ones. Could you ______ it, please?</i> (SIMPLE)",
          answer: 'simplify',
          hint: 'После Could you — глагол: «сделать проще».',
          solution: "После модального <i>could</i> + подлежащее нужен глагол в начальной форме. Глагол со значением «упрощать» образуется суффиксом -ify: simple → <b>simplify</b> (e выпадает)." },
        { id: 'eng-word-formation-19', type: 'match', exam: 'both', difficulty: 2,
          q: 'Соотнесите слово с образованным от него существительным.',
          left: ['develop', 'decide', 'happy', 'perform'],
          right: ['decision', 'happiness', 'performance', 'development', 'decidement'],
          answer: [3, 0, 1, 2],
          hint: 'Суффиксы -ment, -sion, -ness, -ance. Одно слово справа не существует.',
          solution: "develop → development (-ment); decide → decision (-sion, d → s); happy → happiness (-ness, y → i); perform → performance (-ance). «decidement» в английском нет." }
      ]
    },
    /* ============ ТЕМА 7 ============ */
    {
      id: 'eng-conditionals',
      title: 'Условные предложения и модальные глаголы',
      exam: ['oge', 'ege'],
      refs: { oge: '20–28', ege: '19–24' },
      level: 3,
      minutes: 20,
      summary: 'Четыре типа условных предложений, I wish и модальные глаголы: can, must, have to, should, may.',
      keyPoints: [
        'Zero: If + Present, Present — общие истины (If you heat ice, it melts)',
        'First: If + Present, will + V — реальное будущее',
        'Second: If + Past, would + V — нереальное настоящее; If I were you…',
        'Third: If + had V3, would have V3 — нереальное прошлое',
        'I wish + Past (сожаление о настоящем), I wish + Past Perfect (о прошлом)',
        'После модальных — инфинитив без to (can swim), кроме have to, ought to, be able to'
      ],
      theory: [
        { h: 'Четыре типа условных предложений', html: String.raw`<table class="tbl">
<tr><th>Тип</th><th>Придаточное (if)</th><th>Главное</th><th>Пример</th></tr>
<tr><td>0 — всегда</td><td>Present Simple</td><td>Present Simple</td><td>If you heat ice, it melts.</td></tr>
<tr><td>1 — реально в будущем</td><td>Present Simple</td><td>will + V</td><td>If it rains, we will stay at home.</td></tr>
<tr><td>2 — нереально сейчас</td><td>Past Simple (were)</td><td>would + V</td><td>If I had a car, I would drive to school.</td></tr>
<tr><td>3 — нереально в прошлом</td><td>had + V3</td><td>would have + V3</td><td>If you had asked me, I would have helped.</td></tr>
</table>
<div class="rule">В части с <b>if</b> никогда не бывает will и would (в значении условия). Will и would — только в главной части.</div>
<div class="example"><p><b>Пример.</b> <i>If I ______ (KNOW) his number, I would call him.</i></p><p>В главной части would + V → второй тип → в if-части Past Simple: <b>knew</b>. Смысл: номера у меня нет.</p></div>
<div class="trap">Во втором типе с be употребляется <b>were</b> для всех лиц: <i>If I <b>were</b> you, I would...</i> (was допустимо в разговорной речи, но на экзамене надёжнее were).</div>` },
        { h: 'I wish — «жаль, что…»', html: String.raw`<table class="tbl">
<tr><th>О чём сожалеем</th><th>Форма</th><th>Пример</th><th>Смысл</th></tr>
<tr><td>о настоящем</td><td>I wish + Past Simple</td><td>I wish I <b>knew</b> French.</td><td>Жаль, что я не знаю французский.</td></tr>
<tr><td>о прошлом</td><td>I wish + Past Perfect</td><td>I wish I <b>had listened</b> to you.</td><td>Жаль, что я тебя не послушал.</td></tr>
<tr><td>раздражение, желание перемен</td><td>I wish + would</td><td>I wish you <b>would stop</b> talking.</td><td>Хоть бы ты перестал болтать.</td></tr>
</table>
<p>Обратите внимание: утверждение после wish означает отрицание в реальности, и наоборот.</p>
<div class="quick" data-a="had|'d|’d">Закончите: I wish I ______ (HAVE) a dog — I've always wanted one.</div>` },
        { h: 'Модальные глаголы', html: String.raw`<table class="tbl">
<tr><th>Глагол</th><th>Значение</th><th>Пример</th></tr>
<tr><td>can / could</td><td>умение, возможность, просьба; could — умел в прошлом</td><td>She can swim. I could read at four.</td></tr>
<tr><td>be able to</td><td>умение в любом времени</td><td>I will be able to help you tomorrow.</td></tr>
<tr><td>must</td><td>обязанность по мнению говорящего, уверенность</td><td>I must study harder. He must be at home.</td></tr>
<tr><td>have to</td><td>обязанность из-за обстоятельств</td><td>I have to wear a uniform. She had to wait.</td></tr>
<tr><td>should / ought to</td><td>совет</td><td>You should see a doctor.</td></tr>
<tr><td>may / might</td><td>разрешение, возможность</td><td>May I come in? It might rain.</td></tr>
<tr><td>needn't / don't have to</td><td>нет необходимости</td><td>You needn't hurry.</td></tr>
</table>
<div class="trap"><b>mustn't</b> = нельзя (запрет), а <b>don't have to</b> = не обязательно. <i>You mustn't use phones in the exam</i>, но <i>You don't have to come on Sunday</i>.</div>
<div class="rule">У must нет прошедшего времени — используйте <b>had to</b>: <i>Yesterday I had to get up at six.</i> После модальных — голый инфинитив: <s>should to go</s> → should go.</div>` }
      ],
      tasks: [
        { id: 'eng-conditionals-1', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>If you heat ice, it ______.</i> (MELT)",
          answer: 'melts',
          hint: 'Закон природы — нулевой тип.',
          solution: "Нулевой тип: Present Simple в обеих частях. it → <b>melts</b>." },
        { id: 'eng-conditionals-2', type: 'input', exam: 'oge', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>If I ______ some free time tomorrow, I will visit my granny.</i> (HAVE)",
          answer: 'have',
          hint: 'Первый тип: какое время после if?',
          solution: "Реальное будущее, первый тип: в части с if — Present Simple: <b>have</b>. will после if не ставится." },
        { id: 'eng-conditionals-3', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>If I ______ a lot of money, I would travel around the world.</i> (HAVE)",
          answer: 'had',
          hint: 'В главной части would + V.',
          solution: "would travel → второй тип (нереально сейчас). В if-части Past Simple: <b>had</b>." },
        { id: 'eng-conditionals-4', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>If I were you, I ______ to the doctor.</i> (GO)",
          answer: ['would go', "'d go", "’d go"],
          hint: 'If I were you — совет, второй тип.',
          solution: "Второй тип: главная часть would + V → <b>would go</b>." },
        { id: 'eng-conditionals-5', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>If we had left home earlier, we ______ the train.</i> (NOT MISS)",
          answer: ["would not have missed", "wouldn't have missed", "wouldn’t have missed"],
          hint: 'had left — третий тип.',
          solution: "Третий тип (нереальное прошлое): would have + V3, с отрицанием — <b>would not have missed</b> (wouldn't have missed). Мы вышли поздно и опоздали." },
        { id: 'eng-conditionals-6', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>I wish I ______ taller — I'd love to play basketball.</i> (BE)",
          answer: ['were', 'was'],
          hint: 'Сожаление о настоящем.',
          solution: "I wish + Past Simple для настоящего. Для be — <b>were</b> (в разговорной речи допускается was)." },
        { id: 'eng-conditionals-7', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Выберите верный вариант: <i>You ______ use your phone during the exam. It's forbidden.</i>",
          options: ["mustn't", "don't have to", "needn't", 'can'],
          answer: 0,
          hint: 'It\'s forbidden — это запрет.',
          solution: "Запрет → <b>mustn't</b>. don't have to и needn't означают «не обязательно»." },
        { id: 'eng-conditionals-8', type: 'choice', exam: 'oge', difficulty: 2,
          q: "Выберите верный вариант: <i>Hooray! We ______ go to school tomorrow — it's Sunday!</i>",
          options: ["mustn't", "don't have to", "can't", "shouldn't"],
          answer: 1,
          hint: 'Никто не запрещает, просто нет необходимости.',
          solution: "Нет необходимости → <b>don't have to</b>. mustn't — запрет, can't — невозможность, shouldn't — совет не делать." },
        { id: 'eng-conditionals-9', type: 'choice', exam: 'ege', difficulty: 2,
          q: "Выберите верный вариант: <i>When I was five, I ______ already swim.</i>",
          options: ['can', 'could', 'must', 'may'],
          answer: 1,
          hint: 'Умение в прошлом.',
          solution: "Умение в прошлом → <b>could</b>." },
        { id: 'eng-conditionals-10', type: 'match', exam: 'ege', difficulty: 2,
          q: 'Определите тип условного предложения.',
          left: [
            "If it rains, the grass gets wet.",
            "If it rains tomorrow, we'll stay at home.",
            "If I were a bird, I would fly.",
            "If you had asked me, I would have helped you."
          ],
          right: ['второй (нереально сейчас)', 'нулевой (всегда)', 'третий (нереально в прошлом)', 'первый (реально в будущем)'],
          answer: [1, 3, 0, 2],
          hint: 'Смотрите на форму глагола в главной части.',
          solution: "gets — Present → нулевой; 'll stay — will → первый; would fly — второй; would have helped — третий." },
        { id: 'eng-conditionals-11', type: 'multi', exam: 'ege', difficulty: 3,
          q: 'Выберите предложения <b>без</b> ошибок.',
          options: [
            "If I will see him, I will tell him the news.",
            "You should to do your homework.",
            "If she studied harder, she would pass the exam.",
            "He can speak three languages.",
            "We have to wear a uniform at school.",
            "If I would know the answer, I would tell you."
          ],
          answer: [2, 3, 4],
          hint: 'Проверьте if-части и инфинитив после модальных.',
          solution: "1) После if не бывает will: <i>If I see him</i>. 2) should + V без to: <i>should do</i>. 3) Верно. 4) Верно. 5) Верно (have to — с to). 6) <i>If I knew the answer</i>. Ответ: 3, 4, 5." },
        { id: 'eng-conditionals-12', type: 'order', exam: 'both', difficulty: 2,
          q: 'Расставьте части, чтобы получилось условное предложение третьего типа.',
          items: ['If I', 'had known', 'about the party,', 'I would', 'have come.'],
          hint: 'Предложение начинается с If; в главной части would have + V3.',
          solution: "<i>If I had known about the party, I would have come.</i> — «Если бы я знал о вечеринке, я бы пришёл» (но не знал и не пришёл)." },
        { id: 'eng-conditionals-13', type: 'input', exam: 'oge', difficulty: 1,
          q: "Поставьте глагол в нужную форму: <i>If it is sunny tomorrow, we ______ to the beach.</i> (GO)",
          answer: ['will go', "'ll go", "’ll go"],
          hint: 'В части с if — Present Simple и tomorrow: это реальное будущее.',
          solution: "Первый тип (реальное условие в будущем): if + Present Simple (is), в главной части will + V: <b>will go</b> (we'll go)." },
        { id: 'eng-conditionals-14', type: 'input', exam: 'oge', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>Yesterday the bus didn't come, so I ______ to walk to school.</i> (HAVE)",
          answer: 'had',
          hint: 'Вынужденная необходимость в прошлом: have to в Past Simple.',
          solution: "Обязанность из-за обстоятельств (автобус не пришёл) → have to; yesterday → Past Simple: <b>had</b> to walk. У must прошедшей формы нет, поэтому в прошлом всегда had to." },
        { id: 'eng-conditionals-15', type: 'input', exam: 'both', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>If he ______ so lazy, he would get better marks at school.</i> (NOT BE)",
          answer: ["weren't", 'were not', "weren’t", "wasn't", 'was not', "wasn’t"],
          hint: 'В главной части would + V — какой это тип?',
          solution: "would get → второй тип (нереальное настоящее: он ленивый и получает плохие оценки). В части с if — Past Simple, для be — <b>were</b> для всех лиц, с отрицанием: <b>weren't</b> (were not). В разговорной речи допускается и <i>wasn't</i>." },
        { id: 'eng-conditionals-16', type: 'input', exam: 'ege', difficulty: 3,
          q: "Поставьте глагол в нужную форму: <i>I wish I ______ to your advice last year. Now I regret it.</i> (LISTEN)",
          answer: ['had listened', "'d listened", "’d listened"],
          hint: 'Сожаление о прошлом (last year).',
          solution: "I wish + сожаление о прошлом → Past Perfect: had + V3: <b>had listened</b>. Смысл: «Жаль, что я не послушал твоего совета» — в реальности не послушал." },
        { id: 'eng-conditionals-17', type: 'input', exam: 'ege', difficulty: 2,
          q: "Поставьте глагол в нужную форму: <i>If you ______ me about your problem earlier, I would have helped you.</i> (TELL)",
          answer: ['had told', "'d told", "’d told"],
          hint: 'В главной части would have + V3.',
          solution: "would have helped → третий тип (нереальное прошлое). В части с if — Past Perfect: had + V3. tell — told — told → <b>had told</b>. Смысл: ты не рассказал, и я не помог." },
        { id: 'eng-conditionals-18', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Выберите верный вариант: <i>You look ill. You ______ see a doctor.</i>",
          options: ['should', "mustn't", "can't", "needn't"],
          answer: 0,
          hint: 'Здесь дают совет.',
          solution: "Совет → <b>should</b>. mustn't — запрет, can't — невозможность, needn't — нет необходимости: все они противоречат смыслу." },
        { id: 'eng-conditionals-19', type: 'match', exam: 'both', difficulty: 2,
          q: 'Соотнесите предложение с модальным глаголом и его значение.',
          left: ["You mustn't run in the corridor.", "You don't have to wear a tie.", 'You should drink more water.', 'May I open the window?'],
          right: ['совет', 'запрет', 'просьба о разрешении', 'отсутствие необходимости', 'умение'],
          answer: [1, 3, 0, 2],
          hint: "Не путайте mustn't и don't have to. Одно значение лишнее.",
          solution: "mustn't — запрет; don't have to — не обязательно (отсутствие необходимости); should — совет; May I…? — просьба о разрешении. «Умение» выражает can, его здесь нет." }
      ]
    },

    /* ============ ТЕМА 8 ============ */
    {
      id: 'eng-writing',
      title: 'Письмо, чтение и аудирование',
      exam: ['oge', 'ege'],
      refs: { oge: '1–19, 35', ege: '1–18, 37–38' },
      level: 2,
      minutes: 25,
      summary: 'Электронное письмо (ОГЭ 35, ЕГЭ 37), развёрнутое высказывание по таблице или диаграмме (ЕГЭ 38) и стратегии чтения и аудирования.',
      keyPoints: [
        'ОГЭ 35 и ЕГЭ 37 — электронное письмо другу: ответить на 3 вопроса (в ЕГЭ ещё задать 3 своих)',
        'Объём: ОГЭ 35 — 90–120 слов, ЕГЭ 37 — 100–140 слов, ЕГЭ 38 — 200–250 слов',
        'Письмо: обращение — благодарность — ответы — (вопросы) — завершающая фраза — прощание — имя',
        'ЕГЭ 38 — высказывание по данным опроса строго по плану из 5 пунктов, нейтральный стиль',
        'Чтение и аудирование: сначала читайте задания, ищите синонимы и перефразирование',
        'Not stated — только если информации в тексте нет вовсе'
      ],
      theory: [
        { h: 'Электронное письмо (ОГЭ 35, ЕГЭ 37)', html: String.raw`<p>Вам приходит отрывок письма от друга по переписке с вопросами. Нужно написать ответ в неофициальном стиле.</p>
<table class="tbl">
<tr><th></th><th>ОГЭ, задание 35</th><th>ЕГЭ, задание 37</th></tr>
<tr><td>Объём</td><td>90–120 слов</td><td>100–140 слов</td></tr>
<tr><td>Что сделать</td><td>ответить на 3 вопроса друга</td><td>ответить на 3 вопроса и задать 3 своих вопроса</td></tr>
<tr><td>Стиль</td><td colspan="2">неофициальный: сокращения (I'm, don't) и разговорные фразы уместны</td></tr>
</table>
<div class="rule">Структура: <b>Hi / Dear Ben,</b> → благодарность за письмо (<i>Thanks for your email</i>) → ответы на вопросы (каждый — 2–3 предложения) → в ЕГЭ вопросы другу → завершающая фраза (<i>Write back soon!</i>) → прощание (<i>Best wishes,</i>) → имя.</div>
<table class="tbl">
<tr><th>Часть</th><th>Фразы</th></tr>
<tr><td>начало</td><td>Thanks a lot for your email. It was great to hear from you. Sorry I haven't written for so long.</td></tr>
<tr><td>переход к ответам</td><td>You asked me about… As for… By the way…</td></tr>
<tr><td>вопросы (ЕГЭ)</td><td>As for your news, … Where are you going to…? How long…? Who…?</td></tr>
<tr><td>конец</td><td>I have to go now. Write back soon! Hope to hear from you soon. Best wishes, / Love, / Take care,</td></tr>
</table>
<div class="trap">Не пишите адрес и дату — это электронное письмо. Не используйте официальные <i>Dear Sir or Madam, Yours faithfully</i>. Если слов меньше минимума (с учётом допуска) — работа может получить 0 баллов; сверх лимита проверяется только нужная часть текста.</div>` },
        { h: 'Развёрнутое высказывание (ЕГЭ 38)', html: String.raw`<p>Вы проводите «проект» и нашли данные опроса: таблицу (38.1) или диаграмму (38.2). Нужно письменно прокомментировать их, 200–250 слов, по плану:</p>
<ol>
<li>вступление: сформулируйте тему проекта;</li>
<li>выберите и опишите 2–3 факта из таблицы/диаграммы;</li>
<li>сделайте 1–2 сравнения;</li>
<li>назовите проблему, связанную с темой, и предложите способ её решения;</li>
<li>заключение: ваше мнение о важности темы.</li>
</ol>
<div class="example"><p><b>Пример фраз.</b></p><ul><li><i>Nowadays more and more teenagers are interested in…</i> — вступление;</li><li><i>According to the survey, 45 percent of the respondents prefer…</i> — факты;</li><li><i>…is twice as popular as…; In comparison with…</i> — сравнение;</li><li><i>One of the problems is that… A possible solution is to…</i> — проблема;</li><li><i>To conclude, I believe that…</i> — вывод.</li></ul></div>
<div class="tip">Стиль нейтральный: без сокращений (do not, it is), без сленга и обращений к читателю. Делите текст на абзацы по пунктам плана и используйте связки: firstly, moreover, however, as for, on the one hand.</div>
<div class="quick" data-a="200-250|200–250|200 250">Сколько слов нужно написать в задании 38 ЕГЭ? (формат: 000-000)</div>` },
        { h: 'Стратегии чтения', html: String.raw`<p>ОГЭ: соотнесение текстов и рубрик, затем утверждения «верно / неверно / в тексте не сказано». ЕГЭ: задание 10 — заголовки к текстам, 11 — вставить части предложений в текст, 12–18 — вопросы с выбором ответа.</p>
<div class="rule">Сначала читайте <b>задания</b>, потом текст. Ищите в тексте не те же слова, а <b>синонимы и перефразирование</b>: <i>didn't enjoy</i> = <i>was bored</i>, <i>not far from</i> = <i>close to</i>.</div>
<table class="tbl">
<tr><th>Ответ</th><th>Когда выбирать</th></tr>
<tr><td>True (верно)</td><td>текст говорит то же самое, пусть другими словами</td></tr>
<tr><td>False (неверно)</td><td>текст прямо противоречит утверждению</td></tr>
<tr><td>Not stated (не сказано)</td><td>в тексте нет информации, чтобы подтвердить или опровергнуть</td></tr>
</table>
<div class="trap">Не додумывайте! «Том живёт в Брайтоне с шести лет» не означает, что он там родился — это Not stated. Совпадение отдельных слов из утверждения и текста часто оказывается ловушкой.</div>
<p>В задании 11 ЕГЭ проверяйте грамматическую стыковку: подлежащее, время, число, союз (which/who/that) должны подходить к тексту до и после пропуска.</p>` },
        { h: 'Стратегии аудирования и устная часть', html: String.raw`<ul>
<li>Каждая запись звучит <b>дважды</b>. В первый раз наметьте ответы, во второй — проверьте.</li>
<li>В паузе перед записью прочитайте задания и подчеркните ключевые слова.</li>
<li>Говорящие часто упоминают все варианты ответа, но верный — только один: слушайте, что человек в итоге <b>выбрал, сделал, решил</b> (<i>At first I wanted…, but finally…</i>).</li>
<li>Синонимы снова решают: <i>I can't stand crowds</i> = <i>dislikes crowded places</i>.</li>
</ul>
<p><b>Устная часть.</b> ОГЭ: чтение вслух, ответы на 6 вопросов (условный диалог-расспрос), монолог по плану. ЕГЭ: чтение вслух, 4 вопроса по рекламе, ответы на 5 вопросов интервью, монолог с обоснованием выбора фотографий для проекта.</p>
<div class="tip">В монологе строго идите по пунктам плана: каждый пропущенный пункт — потерянный балл. Отвечайте полными предложениями, 2–3 фразы на пункт.</div>` }
      ],
      tasks: [
        { id: 'eng-writing-1', type: 'order', exam: 'oge', difficulty: 1,
          q: 'Расставьте части электронного письма в правильном порядке.',
          items: [
            'Hi Tom,',
            'Thanks for your email. It was great to hear from you.',
            'Answers to all three of Tom’s questions',
            'Write back soon!',
            'Best wishes,',
            'Kate'
          ],
          hint: 'Обращение — благодарность — основная часть — завершение — прощание — подпись.',
          solution: "Порядок: обращение (Hi Tom,) → благодарность → ответы на вопросы → завершающая фраза (Write back soon!) → прощание (Best wishes,) → имя." },
        { id: 'eng-writing-2', type: 'choice', exam: 'oge', difficulty: 1,
          q: 'Какой объём электронного письма требуется в задании 35 ОГЭ?',
          options: ['60–80 слов', '90–120 слов', '100–140 слов', '200–250 слов'],
          answer: 1,
          hint: 'В ОГЭ объём чуть меньше, чем в ЕГЭ.',
          solution: "ОГЭ, задание 35 — <b>90–120 слов</b>. 100–140 — письмо ЕГЭ (37), 200–250 — ЕГЭ 38." },
        { id: 'eng-writing-3', type: 'choice', exam: 'ege', difficulty: 1,
          q: 'Какой объём электронного письма требуется в задании 37 ЕГЭ?',
          options: ['90–120 слов', '100–140 слов', '180–200 слов', '200–250 слов'],
          answer: 1,
          hint: 'Это меньше, чем в развёрнутом высказывании 38.',
          solution: "ЕГЭ, задание 37 — <b>100–140 слов</b>." },
        { id: 'eng-writing-4', type: 'multi', exam: 'both', difficulty: 2,
          q: 'Какие фразы уместны в личном (неофициальном) письме другу?',
          options: [
            "Thanks a lot for your email!",
            "Dear Sir or Madam,",
            "Sorry I haven't written for ages.",
            "I look forward to receiving your reply at your earliest convenience.",
            "Write back soon!",
            "Yours faithfully,"
          ],
          answer: [0, 2, 4],
          hint: 'Отсейте фразы из деловой переписки.',
          solution: "Неофициальные: 1, 3, 5. «Dear Sir or Madam», «at your earliest convenience», «Yours faithfully» — формулы официального письма." },
        { id: 'eng-writing-5', type: 'multi', exam: 'ege', difficulty: 3,
          q: 'Что <b>должно</b> быть в электронном письме в задании 37 ЕГЭ?',
          options: [
            'ответы на три вопроса друга',
            'три вопроса другу по указанной теме',
            'адрес и дата в правом верхнем углу',
            'имя автора в конце',
            'подробный пересказ письма друга',
            'завершающая фраза и прощание'
          ],
          answer: [0, 1, 3, 5],
          hint: 'Письмо электронное, а объём ограничен.',
          solution: "Нужны: ответы на 3 вопроса, 3 своих вопроса, завершающая фраза с прощанием и подпись. Адрес и дата в электронном письме не пишутся, пересказ письма друга — пустая трата слов." },
        { id: 'eng-writing-6', type: 'order', exam: 'ege', difficulty: 2,
          q: 'Расставьте пункты плана задания 38 ЕГЭ в правильном порядке.',
          items: [
            'вступление: тема проекта',
            '2–3 факта из таблицы или диаграммы',
            '1–2 сравнения',
            'проблема и способ её решения',
            'заключение: ваше мнение о важности темы'
          ],
          hint: 'От общего — к данным — к проблеме — к выводу.',
          solution: "План: вступление → факты → сравнения → проблема и решение → собственное мнение в заключении." },
        { id: 'eng-writing-7', type: 'match', exam: 'ege', difficulty: 2,
          q: 'Соотнесите фразу с пунктом плана задания 38.',
          left: [
            "Nowadays many young people are interested in…",
            "According to the survey, 40 percent of teenagers…",
            "In comparison with…, …",
            "One of the problems is… It can be solved by…",
            "To conclude, I believe that…"
          ],
          right: ['сравнение', 'заключение', 'вступление', 'проблема и решение', 'факты из данных'],
          answer: [2, 4, 0, 3, 1],
          hint: 'Ключевые слова: nowadays, according to, in comparison, problem, to conclude.',
          solution: "Nowadays… — вступление; According to the survey… — факты; In comparison with… — сравнение; One of the problems… — проблема и решение; To conclude… — заключение." },
        { id: 'eng-writing-8', type: 'choice', exam: 'both', difficulty: 2,
          q: "Текст: <i>Tom has lived in Brighton since he was six. He goes to school by bike.</i><br>Утверждение: <i>Tom was born in Brighton.</i>",
          options: ['True', 'False', 'Not stated'],
          answer: 2,
          hint: 'Сказано ли в тексте, где Том родился?',
          solution: "Текст сообщает, что Том живёт в Брайтоне с шести лет, но о месте рождения ничего не говорит: он мог родиться и там, и в другом городе → <b>Not stated</b>." },
        { id: 'eng-writing-9', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Текст: <i>The museum is open every day except Monday. Entrance is free for schoolchildren.</i><br>Утверждение: <i>You can visit the museum on Monday.</i>",
          options: ['True', 'False', 'Not stated'],
          answer: 1,
          hint: 'except = кроме.',
          solution: "Музей открыт каждый день, <b>кроме</b> понедельника, — утверждение противоречит тексту → <b>False</b>." },
        { id: 'eng-writing-10', type: 'choice', exam: 'ege', difficulty: 2,
          q: "Говорящий: <i>«I can't stand crowded places, so big concerts are not for me.»</i> Какое утверждение передаёт его мысль?",
          options: [
            'The speaker enjoys big concerts.',
            'The speaker dislikes being in crowds.',
            'The speaker plays in a band.',
            'The speaker often goes to concerts with friends.'
          ],
          answer: 1,
          hint: "can't stand = терпеть не могу.",
          solution: "<i>can't stand crowded places</i> перефразировано как <i>dislikes being in crowds</i> → вариант 2." },
        { id: 'eng-writing-11', type: 'multi', exam: 'both', difficulty: 1,
          q: 'Какие стратегии помогают в заданиях на чтение?',
          options: [
            'прочитать задания до текста',
            'искать в тексте точно такие же слова, как в утверждении',
            'обращать внимание на синонимы и перефразирование',
            'выбирать Not stated, если информации в тексте нет вовсе',
            'дословно переводить весь текст на русский'
          ],
          answer: [0, 2, 3],
          hint: 'Экзамен проверяет понимание, а не совпадение слов.',
          solution: "Верны 1, 3, 4. Совпадение слов часто оказывается ловушкой, а дословный перевод съедает время." },
        { id: 'eng-writing-12', type: 'choice', exam: 'ege', difficulty: 3,
          q: 'Какое предложение подходит по стилю для задания 38 ЕГЭ?',
          options: [
            "Well, loads of guys hate reading, you know.",
            "According to the survey, 40 percent of teenagers prefer e-books.",
            "I'm gonna tell you about books.",
            "Hey! Let's talk about books!"
          ],
          answer: 1,
          hint: 'Нужен нейтральный стиль без сленга и сокращений.',
          solution: "Задание 38 пишется в нейтральном стиле: без сленга (loads of, gonna), сокращений и обращений к читателю. Подходит вариант 2." },
        { id: 'eng-writing-13', type: 'order', exam: 'ege', difficulty: 2,
          q: 'Расставьте части электронного письма (задание 37 ЕГЭ) в правильном порядке.',
          items: [
            'Dear Mark,',
            'Thanks for your email. It was great to hear from you.',
            'Answers to Mark’s three questions',
            'Three questions to Mark about his news',
            "That's all for now. Write back soon!",
            'Love,',
            'Sasha'
          ],
          hint: 'Сначала отвечаем другу, потом спрашиваем сами.',
          solution: "Порядок: обращение (Dear Mark,) → благодарность за письмо → ответы на три вопроса друга → три своих вопроса → завершающая фраза → прощание (Love,) → имя. Вопросы другу логично задавать после ответов, перед завершением письма." },
        { id: 'eng-writing-14', type: 'choice', exam: 'oge', difficulty: 1,
          q: 'Какая формула прощания подходит для электронного письма другу?',
          options: ['Yours faithfully,', 'Best wishes,', 'Dear Sir,', 'To whom it may concern,'],
          answer: 1,
          hint: 'Письмо неофициальное, а нужна именно фраза в конце письма.',
          solution: "<b>Best wishes,</b> — неофициальное прощание. Yours faithfully — прощание в официальном письме, Dear Sir и To whom it may concern — официальные обращения в начале письма." },
        { id: 'eng-writing-15', type: 'choice', exam: 'oge', difficulty: 1,
          q: "Текст: <i>The school library is closed on Saturdays and Sundays.</i><br>Утверждение: <i>Students can borrow books from the school library at weekends.</i>",
          options: ['True', 'False', 'Not stated'],
          answer: 1,
          hint: 'Saturdays and Sundays = weekends.',
          solution: "Суббота и воскресенье — это выходные (weekends). Библиотека в эти дни закрыта, значит взять книги нельзя: утверждение противоречит тексту → <b>False</b>." },
        { id: 'eng-writing-16', type: 'choice', exam: 'both', difficulty: 2,
          q: "Текст: <i>Mike plays the guitar in the school band. The band gives a concert every month.</i><br>Утверждение: <i>Mike writes songs for the band.</i>",
          options: ['True', 'False', 'Not stated'],
          answer: 2,
          hint: 'Играть в группе и сочинять для неё песни — одно и то же?',
          solution: "Из текста известно только, что Майк играет на гитаре в группе. Пишет ли он песни — ни подтверждения, ни опровержения нет → <b>Not stated</b>. Не додумывайте!" },
        { id: 'eng-writing-17', type: 'multi', exam: 'ege', difficulty: 2,
          q: 'Какие фразы подходят по стилю для развёрнутого высказывания (задание 38 ЕГЭ)?',
          options: [
            "It is clear that teenagers spend a lot of time online.",
            "It's gonna be a problem.",
            "Moreover, the number of young readers is falling.",
            "Hi guys! Let me tell you something.",
            "The data show that 30 percent of students do sport every day.",
            "Kids are crazy about gadgets, you know."
          ],
          answer: [0, 2, 4],
          hint: 'Нейтральный стиль: без сленга, разговорных слов и обращений к читателю.',
          solution: "Подходят 1, 3, 5 — нейтральные фразы со связками и ссылкой на данные. 2) gonna — разговорное, и сокращение It's. 4) Hi guys! — обращение к читателю. 6) Kids are crazy about, you know — разговорный стиль." },
        { id: 'eng-writing-18', type: 'choice', exam: 'ege', difficulty: 2,
          q: "Говорящий: <i>«At first I wanted to study medicine, but in the end I chose law. My father is a lawyer, and he inspired me.»</i> Какое утверждение верно?",
          options: [
            'The speaker studies medicine.',
            'The speaker decided to study law.',
            "The speaker's father is a doctor.",
            'The speaker has never been interested in medicine.'
          ],
          answer: 1,
          hint: 'Слушайте, что человек выбрал в итоге (in the end).',
          solution: "Говорящий упоминает медицину, но <i>in the end I chose law</i> — в итоге выбрал право → вариант 2. Отец — юрист (lawyer), а не врач; интерес к медицине был (at first I wanted), поэтому 4 неверно." },
        { id: 'eng-writing-19', type: 'match', exam: 'oge', difficulty: 1,
          q: 'Соотнесите фразу из письма другу с частью письма.',
          left: ['Hi Jane,', 'Thanks for your letter!', 'As for your question about my hobby, I…', 'Hope to hear from you soon.', 'Best wishes,'],
          right: ['ответ на вопрос', 'прощание', 'обращение', 'завершающая фраза', 'благодарность за письмо'],
          answer: [2, 4, 0, 3, 1],
          hint: 'Части письма идут в порядке: обращение → благодарность → ответы → завершающая фраза → прощание.',
          solution: "Hi Jane, — обращение; Thanks for your letter! — благодарность; As for your question… — ответ на вопрос; Hope to hear from you soon. — завершающая фраза; Best wishes, — прощание (после него — только имя)." }
      ]
    }
  ],
  cards: [
    { q: 'Present Simple: форма в 3-м лице ед. ч.', a: 'V + -s/-es: works, watches, goes, studies' },
    { q: 'Present Continuous: формула', a: 'am / is / are + V-ing' },
    { q: 'Past Continuous: формула и маркеры', a: 'was / were + V-ing; at 5 o\'clock yesterday, while, all evening' },
    { q: 'Present Perfect: формула и маркеры', a: 'have / has + V3; just, already, yet, ever, never, since, for' },
    { q: 'Past Perfect: когда нужен', a: 'had + V3 — действие раньше другого действия в прошлом (by the time, before)' },
    { q: 'since или for?', a: 'since + точка отсчёта (since 2019); for + период (for two years)' },
    { q: 'Какое время после if и when в значении будущего?', a: 'Present Simple: If it rains tomorrow, we will stay at home.' },
    { q: 'Пассив: общая формула', a: 'be в нужном времени + V3' },
    { q: 'Пассив в Present Perfect', a: 'has / have been + V3: The tickets have been sold.' },
    { q: 'Пассив в Present Continuous', a: 'am / is / are being + V3: The road is being repaired.' },
    { q: 'Согласование: will в косвенной речи', a: 'would: He said he would call.' },
    { q: 'Косвенная речь: yesterday, tomorrow, ago', a: 'the day before, the next day, before' },
    { q: 'Второй тип условных предложений', a: 'If + Past Simple, would + V: If I had time, I would help you.' },
    { q: 'Третий тип условных предложений', a: 'If + had V3, would have + V3: If I had known, I would have come.' },
    { q: 'mustn\'t и don\'t have to', a: 'mustn\'t — нельзя (запрет); don\'t have to — не обязательно' },
    { q: 'Прошедшее время от must (обязанность)', a: 'had to' },
    { q: 'go – ? – ?', a: 'go – went – gone' },
    { q: 'buy, bring, think, teach, catch: V2 = V3', a: 'bought, brought, thought, taught, caught' },
    { q: 'begin, drink, swim, sing: три формы', a: 'begin – began – begun; drink – drank – drunk; swim – swam – swum; sing – sang – sung' },
    { q: 'lie (лежать) и lay (класть)', a: 'lie – lay – lain; lay – laid – laid' },
    { q: 'good, bad, little, far: сравнительная степень', a: 'better, worse, less, farther / further' },
    { q: 'Порядковые от five, nine, twelve, twenty', a: 'fifth, ninth, twelfth, twentieth' },
    { q: 'Мн. ч.: child, man, woman, tooth, foot, mouse', a: 'children, men, women, teeth, feet, mice' },
    { q: 'Суффиксы существительных', a: '-tion/-sion, -ment, -ness, -ity, -ance/-ence, -er/-or, -ist' },
    { q: 'Суффиксы прилагательных', a: '-ful, -less, -ous, -able/-ible, -al, -ive, -ic, -y' },
    { q: 'Какую приставку отрицания берут possible, legal, regular?', a: 'impossible, illegal, irregular' },
    { q: 'explain, pronounce, wide, long: существительные', a: 'explanation, pronunciation, width, length' },
    { q: 'Объём писем: ОГЭ 35, ЕГЭ 37, ЕГЭ 38', a: '90–120, 100–140 и 200–250 слов' },
    { q: 'Что нужно сделать в письме ЕГЭ 37?', a: 'Ответить на 3 вопроса друга и задать ему 3 своих вопроса' },
    { q: 'True / False / Not stated: когда Not stated?', a: 'Когда в тексте нет информации ни «за», ни «против» утверждения' }
  ]
});
