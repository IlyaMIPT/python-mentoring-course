// Все материалы бесплатные. Добавляй/удаляй секции как удобно — нет жёсткой схемы.

export const RESOURCE_TOPICS = [
  {
    id: 'python',
    title: 'Python',
    description: 'Python для аналитиков является мощным инструментом для обработки данных, автоматизации задач и проведения анализа. Освоение Python открывает новые возможности в работе с данными.',
    sections: [
      {
        badge: 'Курсы',
        title: 'Интерактивы и интенсивы',
        description: 'Где можно сразу писать код и получать фидбек.',
        items: [
          {
            title: 'Stepik · Поколение Python',
            url: 'https://stepik.org/course/58852',
            note: 'Базовый синтаксис, ветвления, функции.',
          },
          {
            title: 'Stepik · Поколение Python: курс для продвинутых',
            url: 'https://stepik.org/course/68343/syllabus',
            note: 'Продвинутый курс по Python',
          },
          {
            title: 'Инди-курс программирования на Python',
            url: 'https://stepik.org/course/63085/syllabus',
            note: 'Курс по основам Python с задачами и автопроверкой.',
          },
          {
            title: 'Основы Python · Karpov Courses',
            url: 'https://karpov.courses/pythonzero',
            note: 'Интенсивный курс по Python для начинающих с практическими заданиями.',
          },
          {
            title: 'Основы Python · Яндекс Практикум',
            url: 'https://education.yandex.ru/handbook/python',
            note: 'Хэндбук с основами Python от Яндекс Практикума.',
          },
        ],
      },
      {
        badge: 'Статьи',
        title: 'Конспекты и шпаргалки',
        items: [
          {
            title: 'Python для аналитика',
            url: 'https://t.me/zasql_python/433',
            note: 'Огромный конспект по Python для аналитика.',
          },
          {
            title: 'Что такое модули и библиотеки в Python',
            url: 'https://sky.pro/media/chto-takoe-moduli-i-biblioteki-v-python/',
            note: 'Обзор того, как подключать и использовать библиотеки в Python.',
          },
          {
            title: 'Топ-9 библиотек в Python для профессионального анализа данных',
            url: 'https://practicum.yandex.ru/blog/biblioteki-python-dlya-data-science/',
            note: 'Список ключевых библиотек для анализа данных с описанием.',
          },
          {
            title: 'Материалы для прокачки навыков в pandas для начинающих',
            url: 'https://t.me/zasql_python/312',
            note: 'Основная библиотека для работы с табличными данными в Python.',
          },
          {
            title: 'Шпаргалки по визуализации данных в Python',
            url: 'https://t.me/zasql_python/408',
            note: 'Визуализация с Matplotlib, Seaborn и Plotly.',
          },
        ],
      },
      {
        badge: 'Практика',
        title: 'Практические задачи и проекты',
        items: [
          {
            title: 'Pandas Упражнения | Pandas Задачи | LabEx',
            url: 'https://labex.io/ru/exercises/pandas',
            note: 'Упражнения для практики работы с библиотекой pandas.',
          },
          {
            title: 'Pandas Challenges',
            url: 'https://pandaspractice.com/',
            note: 'Практические задачи для улучшения навыков работы с pandas.',
          },
          {
            title: '100 numpy exercises (Rus version)',
            url: 'https://www.kaggle.com/code/sokolovaleks/100-numpy-exercises-rus-version',
            note: 'Практические задачи для освоения библиотеки NumPy.',
          },
          {
            title: 'LeetCode',
            url: 'https://leetcode.com/',
            note: 'Платформа с задачами по программированию, включая задачи на Python.',
          },
          {
            title: 'Мастерим с Pandas: практические руководства на Python',
            url: 'https://www.youtube.com/playlist?list=PLe-iIMbo5JOLWm4VCI7ibSQHOAkRwpS-P',
            note: 'Серия видеоуроков по практическому использованию pandas.',
          },
        ],
      },
    ],
  },
  {
    id: 'sql',
    title: 'SQL',
    description:
      'SQL для аналитиков: от базовых запросов до оконных функций и оптимизации. Навык, который спрашивают на собесах и используют каждый день.',
    sections: [
      {
        badge: 'Курсы',
        title: 'Интерактивы и курсы',
        items: [
          {
            title: 'Симулятор SQL · Karpov Courses',
            url: 'https://karpov.courses/simulator-sql',
            note: 'Практика SELECT, оконок и бизнесовых задач в интерфейсе, похожем на Redash.',
          },
          {
            title: 'Stepik · Интерактивный тренажёр SQL',
            url: 'https://stepik.org/course/63054',
            note: 'Автопроверка решений прямо на платформе.',
          },
          {
            title: 'SQL Academy · Guide',
            url: 'https://sql-academy.org/ru/guide',
            note: 'Системный курс по MySQL/PostgreSQL с примерами оптимизации.',
          },
          {
            title: 'sql-ex.ru',
            url: 'https://sql-ex.ru/',
            note: 'Классический тренажёр с заданиями разных уровней (устарел интерфейс)',
          },
        ],
      },
      {
        badge: 'Статьи',
        title: 'Гайды и разборы',
        items: [
          {
            title: 'Оптимизация SQL-запросов',
            url: 'https://habr.com/ru/articles/861604/',
            note: 'Обзор техник оптимизации на примере PostgreSQL.',
          },
          {
            title: 'Оконные функции SQL простым языком с примерами',
            url: 'https://habr.com/ru/articles/664000/',
            note: 'Пояснение оконных функций на понятных кейсах.',
          },
          {
            title: 'Оконные функции в SQL: что это и как использовать',
            url: 'https://practicum.yandex.ru/blog/okonnye-funkcii-v-sql/',
            note: 'Ещё один гайд по оконным функциям с примерами.',
          },
          {
            title: 'Про чтение в SQL',
            url: 'https://t.me/zasql_python/463',
            note: 'Как работают запросы на чтение данных.',
          },
        ],
      },
      {
        badge: 'Шпаргалки',
        title: 'Шпаргалки по SQL',
        items: [
          {
            title: 'Пост на моем канале',
            url: 'https://t.me/zasql_python/377',
            note: 'Сборник классных шпаргалок, которые помогут быстро освежить память.',
          },
        ],
      },
      {
        badge: 'Примеры',
        title: 'Практика и задачники',
        items: [
          {
            title: 'Как считать пенетрацию пользователей в продукте в SQL',
            url: 'https://t.me/zasql_python/302',
            note: 'Пост с разбором кейса и примером запроса.',
          },
          {
            title: 'Каннибализация в SQL: как посчитать метрики с пересекающейся аудиторией',
            url: 'https://t.me/zasql_python/327',
            note: 'Пост с разбором кейса и примером запроса.',
          },
          {
            title: 'Как посчитать ARPU и ARPPU в SQL',
            url: 'https://t.me/zasql_python/339',
            note: 'Пост с разбором метрик и примерами запросов.',
          },
          {
            title: 'Отладка SQL-запросов',
            url: 'https://t.me/zasql_python/346',
            note: 'Пошаговое руководство по поиску и исправлению ошибок в SQL.',
          },
          {
            title: 'SQL Academy Trainer',
            url: 'https://sql-academy.org/ru/trainer',
            note: 'Задачи от разных компаний, разбивка по темам и сложности.',
          },
          {
            title: 'SQL Bolt',
            url: 'https://sqlbolt.com/',
            note: 'Серия коротких уроков с проверкой результата.',
          },
          {
            title: 'LeetCode Database',
            url: 'https://leetcode.com/problemset/database/',
            note: 'Собеседовательные задачи, удобно фильтровать по уровню.',
          },
          {
            title: 'StrataScratch',
            url: 'https://platform.stratascratch.com/coding?code_type=1&is_freemium=1',
            note: 'Задачи с собесов FAANG и финтеха, часть доступна бесплатно.',
          },
          {
            title: 'DataLemur',
            url: 'https://datalemur.com/questions',
            note: 'Практика SQL-запросов с комментариями к решениям.',
          },
        ],
      },
    ],
  },
  {
    id: 'statistics',
    title: 'Статистика',
    description: 'Статистика нужна для понимания данных, проведения экспериментов и принятия решений на основе анализа. Освоение статистики поможет вам стать более уверенным аналитиком и принимать обоснованные решения.',
    sections: [
      {
        badge: 'Курсы',
        title: 'Лекции',
        items: [
          {
            title: 'Stepik · Основы статистики',
            url: 'https://stepik.org/course/76',
            note: 'Базовый курс по основам статистики.',
          },
          {
            title: 'Теория вероятностей и математическая статистика, фэн, 2021/22',
            url: 'http://wiki.cs.hse.ru/Теория_вероятностей_и_математическая_статистика,_фэн,_2021/22',
            note: 'Фундаментальный курс от ФЭН ВШЭ с лекциями и задачами.',
          },
          {
            title: 'Курс по прикладной статистике от Академии Аналитиков Авито - все части',
            url: 'https://avito.tech/education/statistics',
            note: 'Курс Avito Tech по прикладной статистике с практическими примерами для A/B тестирования.',
          },
          {
            title: 'Основы статистики и A/B-тестирования',
            url: 'https://practicum.yandex.ru/profile/statistics-basic/',
            note: 'Бесплатный курс от Яндекса по основам статистики и A/B-тестированию.',
          },
        ],
      },
      {
        badge: 'Статьи',
        title: 'Конспекты и видео',
        items: [
          {
            title: 'Прикладная статистика от МФТИ',
            url: 'https://www.youtube.com/playlist?list=PLk4h7dmY2eYEdKleN2_pwDBFwW0oX-pDl',
            note: 'Прикладные лекции по статистике с примерами на Python.',
          },
          {
            title: '3blue1brown · Статистика (на русском)',
            url: 'https://www.youtube.com/playlist?list=PL4cNQ1YkG5WhQGmPnRe4vDUImh_nviriy',
            note: 'Визуальные объяснения основных концепций статистики.',
          },
        ],
      },
      {
        badge: 'ТГ-посты',
        title: 'Телеграм',
        items: [
          {
            title: 'Как доверительные интервалы помогают решать задачи бизнеса?',
            url: 'https://t.me/zasql_python/281',
            note: 'Пояснение концепции доверительных интервалов на простом языке.',
          },
          {
            title: 'Поговорим про p-value',
            url: 'https://t.me/zasql_python/448',
            note: 'p-value: что это и как его правильно интерпретировать.',
          },
        ],
      },
      {
        badge: 'Примеры',
        title: 'Шпаргалки и шаблоны',
        items: [
          {
            title: 'Seeing Theory',
            url: 'https://seeing-theory.brown.edu/',
            note: 'Визуальные объяснения распределений, основ на простых примерах.',
          },
          {
            title: 'mathprofi.com · Матстат демо (PDF)',
            url: 'https://mathprofi.com/knigi_i_kursy/files/matstat_demo.pdf',
            note: 'Матстат с примерами расчетов и интерпретаций, микро-учебник.',
          },
          {
            title: 'Statistics Cheat Sheet',
            url: 'https://www.geeksforgeeks.org/data-science/statistics-cheatsheet',
            note: 'Кратко, верхнеуровнево про статистику .',
          },
          {
            title: 'СТАТИСТИКА: СБОРНИК ЗАДАНИЙ С ПРИМЕРАМИ РЕШЕНИЙ И ПОЯСНЕНИЯМИ',
            url: 'https://study.urfu.ru/Aid/Publication/13874/1/ЭОР_Кеткина%20(без%20тестовых).pdf',
            note: 'Сборник задач по статистике с решениями и пояснениями.',
          },
          {
            title: 'Математическая статистика примеры, задачи и типовые задания',
            url: 'https://www.gubkin.ru/faculty/automation_and_computer_science/chairs_and_departments/kvm/metod_mater/Stat2.pdf',
            note: 'Математическая статистика: примеры, задачи и типовые задания с решениями.',
          },
        
        ],
      },
    ],
  },
  {
    id: 'probability',
    title: 'Теория вероятностей',
    description: 'Теория вероятностей помогает понимать случайные процессы, оценивать риски и принимать решения в условиях неопределенности. Этот навык особенно важен для аналитиков, работающих с данными и статистикой.',
    sections: [
      {
        badge: 'Курсы',
        title: 'Лекции и интерактивы',
        items: [
          {
            title: 'Теория вероятностей Computer Science Center',
            url: 'https://stepik.org/course/3089/syllabus?search=8256114835',
            note: 'Много практики и задач с разбором.',
          },
          {
            title: 'Теория вероятностей. Краткий курс для начинающих',
            url: 'https://mathprofi.ru/teorija_verojatnostei.html',
            note: 'Много разборов, объяснений и задач с решениями.',
          },
          {
            title: 'Теория вероятностей и математическая статистика, фэн, 2021/22',
            url: 'http://wiki.cs.hse.ru/Теория_вероятностей_и_математическая_статистика,_фэн,_2021/22',
            note: 'Курс по теории вероятностей от ФЭН ВШЭ с лекциями и задачами.',
          },
          {
            title: 'Райгородский А.М. Теория вероятности (2к ФБМФ) - YouTube',
            url: 'https://www.youtube.com/playlist?list=PLthfp5exSWEr8tRK-Yf-i9aXgcFJ-O16d',
            note: 'Курс по теории вероятностей МФТИ.',
          },
        ],
      },
      {
        badge: 'Статьи',
        title: 'Конспекты, визуализации',
        items: [
          {
            title: 'Seeing Theory',
            url: 'https://seeing-theory.brown.edu/',
            note: 'Визуальные объяснения распределений, основ на простых примерах.',
          },
          {
            title: 'Теории вероятностей: готовимся к собеседованию и разрешаем «парадоксы»',
            url: 'https://habr.com/ru/companies/JetBrains-education/articles/498188/',
            note: 'Статья на Хабре с разбором классических задач по теории вероятностей.',
          },
          {
            title: 'Теорема Байеса для чайников',
            url: 'https://habr.com/ru/articles/739648/',
            note: 'Статья на Хабре с объяснением и примерами применения теоремы Байеса.',
          },
          {
            title: 'Типичные распределения вероятности: шпаргалка data scientist-а',
            url: 'https://habr.com/ru/articles/331060/',
            note: 'Статья на Хабре с обзором основных распределений вероятностей.',
          },
        ],
      },
      {
        badge: 'Примеры',
        title: 'Видео и разборы задач',
        items: [
          {
            title: 'Самые популярные ЗАДАЧИ на ТЕРВЕР на собеседовании АНАЛИТИКА',
            url: 'https://www.youtube.com/watch?v=5NfbUTlTs7w',
            note: 'В видеоформате разбор классических задач по теории вероятностей.',
          },
          {
            title: 'Модуль random. Часть 1',
            url: 'https://www.dmitrymakarov.ru/python/random/',
            note: 'Статья с примерами использования модуля random в Python для симуляций вероятностных событий.',
          },
          {
            title: 'Модуль random. Часть 2',
            url: 'https://www.dmitrymakarov.ru/python/random-02/',
            note: 'Статья с примерами использования модуля random в Python для симуляций вероятностных событий.',
          },
          {
            title: 'Модуль random. Часть 3',
            url: 'https://www.dmitrymakarov.ru/python/random-03/',
            note: 'Статья с примерами использования модуля random в Python для симуляций вероятностных событий.',
          },
          {
            title: 'Модуль random. Часть 4',
            url: 'https://www.dmitrymakarov.ru/python/random-04/',
            note: 'Статья с примерами использования модуля random в Python для симуляций вероятностных событий.',
          },
          {
            title: 'Вероятность и статистика',
            url: 'https://www.youtube.com/playlist?list=PLQJ7ptkRY-xbHLLI66KdscKp_FJt0FsIi',
            note: 'Курс по вероятности и статистике с примерами и задачами на Python.',
          },
        ],
      },
    ],
  },
  {
    id: 'ab-testing',
    title: 'A/B тестирование',
    description: 'A/B тестирование — ключевой навык для аналитиков, позволяющий принимать обоснованные решения на основе данных экспериментов. Освоение A/B тестирования поможет вам улучшить продукты и процессы в вашей компании.',
    sections: [
      {
        badge: 'От базы до профи',
        title: 'От основ к продвинутым темам A/B тестирования',
        description: 'Введение в эксперименты, статистику и первые шаги.',
        items: [
          {
            title: 'Теория и практика онлайн-экспериментов 22/23 (ПМИ ВШЭ)',
            url: 'https://www.youtube.com/playlist?list=PLEwK9wdS5g0rOx1NhhugBZJlPZQ-RZU5S',
            note: 'Курс-лекции ФКН ВШЭ — полноценная база экспериментов.',
          },
          {
            title: 'Основы статистики и A/B-тестирования · Яндекс Практикум',
            url: 'https://practicum.yandex.ru/profile/statistics-basic/',
            note: 'Бесплатные материалы по матстату и A/B тестам.',
          },
          {
            title: 'A/B testing — курс Лекториума',
            url: 'https://www.lektorium.tv/ab-test',
            note: 'Англоязычный курс с практическими заданиями.',
          },
          {
            title: 'A/B Week Школы анализа данных',
            url: 'https://shad.yandex.ru/abweek#program',
            note: 'Серия вебинаров по A/B тестированию от Яндекса.',
          },
          {
            title: 'А/Б-тесты: Интуитивное руководство (YouTube)',
            url: 'https://www.youtube.com/watch?v=YL--dvVwVNo',
            note: 'Разбор базовых принципов с визуализациями.',
          },
          {
            title: 'База: айсберг A/B-тестов',
            url: 'https://habr.com/ru/companies/kuper/articles/774608/',
            note: 'Статья от Купер с чек-листом процесса.',
          },
          {
            title: 'Шесть причин, почему ваши A/B-тесты не работают',
            url: 'https://habr.com/ru/companies/ozontech/articles/712306/',
            note: 'Ozon про типичные ошибки и как их исправить.',
          },
          {
            title: '10 мифов об A/B-тестировании',
            url: 'https://habr.com/ru/companies/yandex/articles/919966/',
            note: 'Яндекс развенчивает популярные заблуждения.',
          },
          {
            title: 'Как улучшить ваши A/B-тесты: лайфхаки (Ч. 1)',
            url: 'https://habr.com/ru/companies/avito/articles/571094/',
            note: 'Советы аналитиков Авито.',
          },
          {
            title: 'Как улучшить ваши A/B-тесты: лайфхаки (Ч. 2)',
            url: 'https://habr.com/ru/companies/avito/articles/571096/',
            note: 'Продолжение с реальными примерами.',
          },
          {
            title: 'Методичка по A/B-тестированию от аналитиков Авито',
            url: 'https://habr.com/ru/companies/avito/articles/936804/',
            note: 'Большая памятка по дизайну и анализу.',
          },
        ],
      },
      {
        badge: 'Variance Reduction',
        title: 'Методы повышения чувствительности',
        description: 'CUPED, стратификация и другие техники.',
        items: [
          {
            title: 'Стратификация. Как разбиение выборки повышает чувствительность A/B теста',
            url: 'https://habr.com/ru/companies/X5Tech/articles/596279/',
            note: 'Когда и как разбивать выборку.',
          },
          {
            title: 'А/Б тестирование с CUPED',
            url: 'https://habr.com/ru/companies/X5Tech/articles/780270/',
            note: 'Пошаговый гайд по CUPED.',
          },
          {
            title: 'CUPED vs Stratification',
            url: 'https://habr.com/ru/companies/X5Tech/articles/826488/',
            note: 'Сравнение методов снижения дисперсии.',
          },
          {
            title: 'ML-критерии для A/B-тестов',
            url: 'https://habr.com/ru/companies/avito/articles/590105/',
            note: 'Авито про CUPED/CUPAC и ML-подходы.',
          },
          {
            title: 'Сетап A/B теста, который снизил MDE в 2 раза',
            url: 'https://habr.com/ru/companies/avito/articles/929894/',
            note: 'Практический кейс Авито.',
          },
          {
            title: 'Про CUPED простыми словами',
            url: 'https://t.me/zasql_python/188',
            note: 'Пост про метод сокращения дисперсии CUPED простыми словами.',
          },
          {
            title: 'VWE — Variance Weighted Estimator',
            url: 'https://t.me/zasql_python/222',
            note: 'Ещё один метод снижения дисперсии.',
          },
        ],
      },
      {
        badge: 'Ratio',
        title: 'Ratio-метрики: Дельта-метод и линеаризация',
        items: [
          {
            title: 'Анализ эксперимента с Ratio-метрикой',
            url: 'https://t.me/zasql_python/301',
            note: 'Пост с анализом экспериментов с метриками отношения.',
          },
          {
            title: 'Линеаризация: зачем и как укрощать ratio-метрики',
            url: 'https://habr.com/ru/companies/kuper/articles/768826/',
            note: 'Практический гайд от Купер.',
          },
          {
            title: 'А/Б тесты с метрикой отношения. Дельта-метод',
            url: 'https://habr.com/ru/companies/X5Tech/articles/740476/',
            note: 'X5 Tech про корректный анализ ratio-метрик.',
          },
          {
            title: 'A/B-тесты с метриками-отношениями и при чём здесь внутрипользовательские корреляции',
            url: 'https://www.youtube.com/watch?v=ObzlKVCiBqI&t=3420s',
            note: 'Видео с разбором про Ratio-метрики с примерами на Python.',
          },
        ],
      },
      {
        badge: 'Статистика',
        title: 'Критерии и статистика в A/B тестах',
        items: [
          {
            title: 'MDE и Uplift в A/B тестах',
            url: 'https://t.me/zasql_python/195',
            note: 'Пост про связь MDE и uplift.',
          },
          {
            title: 'Varioqub: за Mann–Whitney замолвите слово',
            url: 'https://habr.com/ru/companies/X5Tech/articles/823078/',
            note: 'X5 Tech про непараметрические критерии.',
          },
          {
            title: 'Байесовский подход к A/B тестированию',
            url: 'https://habr.com/ru/companies/glowbyte/articles/732024/',
            note: 'Glowbyte про байесовские методы в экспериментах.',
          },
          {
            title: 'Критерий Манна-Уитни — главный враг A/B тестов',
            url: 'https://habr.com/ru/companies/avito/articles/709596/',
            note: 'Авито про риски непараметрических критериев.',
          },
          {
            title: 'Проблема подглядывания и последовательное A/B тестирование',
            url: 'https://habr.com/ru/companies/X5Tech/articles/926546/',
            note: 'Как контролировать проблему подглядывания.',
          },
          {
            title: 'Как же мощно я провёл A/B тест…',
            url: 'https://habr.com/ru/companies/lamoda/articles/728034/',
            note: 'Lamoda про ошибки интерпретации uplift vs MDE.',
          },
        ],
      },
      {
        badge: 'Infra',
        title: 'Инфраструктура и фреймворки',
        items: [
          {
            title: 'Без A/B результат ХЗ',
            url: 'https://habr.com/ru/companies/ozontech/articles/689052/',
            note: 'Ozon о платформе и процессах A/B тестов.',
          },
          {
            title: 'Как устроено A/B-тестирование в Авито',
            url: 'https://habr.com/ru/companies/avito/articles/454164/',
            note: 'Как Авито строит культуру экспериментов.',
          },
          {
            title: 'Как проводить A/B-тестирование на 15 000 офлайн-магазинах',
            url: 'https://habr.com/ru/companies/X5Tech/articles/466349/',
            note: 'Особенности офлайн-экспериментов X5.',
          },
          {
            title: 'Как сделать A/B-тест в офлайне (Самокат)',
            url: 'https://habr.com/ru/companies/ecom_tech/articles/821777/',
            note: 'Кейс ускорения доставки в Самокате.',
          },
          {
            title: 'Как мы в Авито проводим A/B-тесты CRM-рассылок',
            url: 'https://habr.com/ru/companies/avito/articles/875012/',
            note: 'Практика экспериментов в коммуникациях.',
          },
          {
            title: 'Глобальный контроль в A/B тестах',
            url: 'https://t.me/zasql_python/341',
            note: 'Пост про глобальный контроль в экспериментах.',
          },
          {
            title: 'Зачем нужен хэш с солью в A/B тестах',
            url: 'https://t.me/zasql_python/277',
            note: 'Как разбивать пользователей по группам.',
          },
        ],
      },
      {
        badge: 'Концепт',
        title: 'Концептуальные и продуктовые темы',
        items: [
          {
            title: 'Дизайн A/B тестов и почему это важно',
            url: 'https://t.me/zasql_python/288',
            note: 'Пост про важность правильного дизайна экспериментов.',
          },
          {
            title: '50 оттенков линейной регрессии',
            url: 'https://habr.com/ru/companies/X5Tech/articles/846298/',
            note: 'X5 Tech про связь регрессии и A/B тестов.',
          },
          {
            title: 'Ухудшающие A/B-тесты: зачем ломать продукт ради роста?',
            url: 'https://t.me/zasql_python/308',
            note: 'Пост про смысл "негативных" экспериментов.',
          },
          {
            title: 'Бутстрап: как оценить неопределённость',
            url: 'https://t.me/zasql_python/202',
            note: 'Бутстрап-оценка доверительных интервалов.',
          },
          {
            title: 'Симуляция A/A тестов и зачем это нужно',
            url: 'https://t.me/zasql_python/419',
            note: 'Пост про проверку A/A тестов.',
          },
          {
            title: 'Sample Ratio Mismatch (SRM)',
            url: 'https://t.me/zasql_python/344',
            note: 'Как ловить SRM и что с ним делать.',
          },
          {
            title: 'Выбросы в A/B тестах',
            url: 'https://t.me/zasql_python/267',
            note: 'Что делать с выбросами на разных этапах.',
          },
        ],
      },
      {
        badge: 'Практика',
        title: 'Практика и инструменты',
        items: [
          {
            title: 'Evan Miller AB Test Calculator',
            url: 'https://www.evanmiller.org/ab-testing/',
            note: 'Калькулятор размера выборки и значимости.',
          },
          {
            title: 'AB Test Guide Playground',
            url: 'https://www.abtestguide.com/calc/',
            note: 'Симулятор тестов и визуализации.',
          },
          {
            title: 'Kaggle A/B Testing',
            url: 'https://www.kaggle.com/datasets/zhangluyuan/ab-testing/data',
            note: 'Набор данных для практики A/B тестирования + возможностью просмотра кода у других участников.',
          },
          {
            title: 'ЦПТ, скосы распределений, логарифмирование',
            url: 'https://t.me/zasql_python/458',
            note: 'Визуализации ЦПТ и лог-трансформации (пост @zasql_python).',
          },
        ],
      },
    ],
  },
  {
    id: 'visualization',
    title: 'Визуализация',
    description: 'Визуализация данных помогает эффективно передавать информацию и выявлять инсайты. Освоение навыков визуализации позволит вам создавать понятные и информативные графики, которые помогут в принятии решений на основе данных.',
    sections: [
      {
        badge: 'Полезности',
        title: 'Курс и документация',
        items: [
          {
            title: 'Курс «DataLens: анализ и визуализация данных» — Обучение | Yandex Cloud',
            url: 'https://yandex.cloud/ru/training/datalens',
            note: 'Бесплатные занятия по BI.',
          },
          {
            title: 'Документация SuperSet',
            url: 'https://superset.apache.org/docs/intro/',
            note: 'Документация по популярному open-source BI-инструменту.',
          },
        ],
      },
    ],
  },
  {
    id: 'product-thinking',
    title: 'Продуктовое мышление',
    description: 'Продуктовое мышление нужно аналитику, чтобы не просто считать цифры, а понимать бизнес-контекст, видеть причинно-следственные связи и принимать решения, которые реально двигают продуктовые метрики.',
    sections: [
      {
        badge: 'Курсы, интервью',
        title: 'Мастер-классы',
        items: [
          {
            title: 'Школа менеджеров Яндекса · Бесплатные вебинары',
            url: 'https://www.youtube.com/playlist?list=PLEs8EuAPI73Bj78n7-BIW3s1we0r15yJl',
            note: 'Вебинары по продуктовому менеджменту и метрикам.',
          },
          {
            title: 'Мок-интервью на продакт-менеджмента · YouTube',
            url: 'https://www.youtube.com/playlist?list=PLzSsdayMiDmh90tppsZlI-K37VRhL5RlP',
            note: 'Мок-интервью на продакт-менеджмента с разбором ошибок.',
          },
          {
            title: 'Live-собеседования на продакт-менеджера',
            url: 'https://www.youtube.com/playlist?list=PLdlwYthmjinAo9nY2L3XBZ7dhXh2WG3c4',
            note: 'Live-собеседования на продакт-менеджера с разбором ошибок.',
          },
        ],
      },
      {
        badge: 'Статьи',
        title: 'Фреймворки',
        items: [
          {
            title: 'Go Practice, бесплатные статьи',
            url: 'https://gopractice.ru/',
            note: 'Статьи по продуктовой аналитике и метрикам.',
          },
          {
            title: 'Метрики продукта: как оценить эффективность бизнеса',
            url: 'https://practicum.yandex.ru/blog/chto-takoe-produktovye-metriki-i-kakimi-oni-byvayut/',
            note: 'Ключевые продуктовые метрики с примерами.',
          },
          {
            title: 'HADI цикл: гипотеза, анализ, разработка, измерение',
            url: 'https://t.me/zasql_python/239',
            note: 'Пост про HADI цикл для продуктовых изменений.',
          },
          {
            title: 'HEART framework: метрики для оценки пользовательского опыта',
            url: 'https://t.me/zasql_python/376',
            note: 'Пост про HEART framework для оценки UX.',
          },
          {
            title: 'AARRR: пиратские метрики',
            url: 'https://www.alexcouncil.com/aarrr-piratskie-metriki/',
            note: 'Обзор пиратских метрик для компаний.',
          },
        ],
      },
      {
        badge: 'ТГ-посты',
        title: 'Телеграм',
        items: [
          {
            title: 'Разбор трех кейсов по продуктовому мышлению',
            url: 'https://t.me/zasql_python/347',
            note: 'Пост с разбором продуктовых кейсов.',
          },
          {
            title: 'Формирование пользовательской привычки: почему одни продукты входят в повседневность, а другие нет?',
            url: 'https://t.me/zasql_python/315',
            note: 'Пост про формирование привычек пользователей.',
          },
        ],
      },
      {
        badge: 'Примеры',
        title: 'Шаблоны',
        items: [
          {
            title: 'Пирамида метрик',
            url: 'https://habr.com/ru/companies/agima/articles/753314/',
            note: 'Пирамида метрик с примерами.',
          },
          {
            title: 'Что такое метрики: гайд для продакт-менеджера',
            url: 'https://gopractice.ru/product/metrics/',
            note: 'Дерево метрик для презентаций.',
          },
          {
            title: 'Сборник тестовых заданий для Product Manager',
            url: 'https://habr.com/ru/articles/656579/',
            note: 'Сборник кейсов и заданий для практики продуктового мышления.',
          },
        ],
      },
    ],
  },
  {
    id: 'ml',
    title: 'ML',
    description: 'ML нужен аналитику, чтобы находить закономерности, которые не видны простыми методами, строить более точные прогнозы и модели поведения пользователей и тем самым усиливать влияние аналитики на продуктовые решения.',
    sections: [
      {
        badge: 'Курсы',
        title: 'Обучающие программы',
        items: [
          {
            title: 'Введение в Data Science и машинное обучение',
            url: 'https://stepik.org/course/4852',
            note: 'Бесплатный курс по началу машинного обучения с практикой на Python.',
          },
          {
            title: 'Машинное обучение 1, ПМИ ФКН ВШЭ',
            url: 'https://www.youtube.com/playlist?list=PLEwK9wdS5g0oZwFwoQT-BrjmkazJWXxfe',
            note: 'Курс по машинному обучению с разбором алгоритмов и практикой.',
          },
          {
            title: 'Конспекты по машинному обучению от ФКН ВШЭ',
            url: 'https://github.com/esokolov/ml-course-hse/tree/master/2021-fall/lecture-notes',
            note: 'Конспекты лекций по машинному обучению с примерами.',
          },
          {
            title: 'Домашние задания по машинному обучению от ФКН ВШЭ',
            url: 'https://github.com/esokolov/ml-course-hse/tree/master/2021-fall/homeworks-practice',
            note: 'Домашние задания с решениями и разбором.',
          },
          {
            title: 'Машинное обучение (machine learning)',
            url: 'https://www.youtube.com/playlist?list=PLA0M1Bcd0w8zxDIDOTQHsX68MCDOAJDtj',
            note: 'Курс по машинному обучению с пракктикой на Python.',
          },
          {
            title: 'Машинное обучение ШАД Яндекса',
            url: 'https://www.youtube.com/playlist?list=PLJOzdkh8T5krxc4HsHbB8g8f0hu7973fK',
            note: 'Курс по машинному обучению от ШАД Яндекса.',
          },
          {
            title: 'Курс по машинному обучению. Проект «ИИ Старт»',
            url: 'https://stepik.org/course/125587/syllabus',
            note: 'Курс на Python с практикой на реальных данных.',
          },
          {
            title: 'Прогнозирование на Python в примерах и задачах',
            url: 'https://www.youtube.com/playlist?list=PLi7wcJNcND_auuF_OMy322t6Q5Qq1eJIM',
            note: 'Курс по прогнозированию временных рядов с практикой на Python.',
          },
          {
            title: 'Intro to Machine Learning Kaggle',
            url: 'https://www.kaggle.com/learn/intro-to-machine-learning',
            note: 'Бесплатный курс по основам машинного обучения от Kaggle.',
          }
        ],
      },
      {
        badge: 'Статьи, книги, учебники',
        title: 'ML и интерпретируемость',
        items: [
          {
            title: 'Учебник по машинному обучению от ШАД Яндекса',
            url: 'https://education.yandex.ru/handbook/ml?utm_source=yandex&utm_medium=cpc&utm_campaign=handbook&utm_content=search_ru.704177297&utm_term=---autotargeting_desktop_17357803933&ybaip=1&yclid=10731072826400047103',
            note: 'Подробный учебник по основам и продвинутым темам ML.',
          },
          {
            title: 'Математика для Data Science',
            url: 'https://psv4.userapi.com/s/v1/d/xYoYWMFozin4u5mVI2RuWuOjbmLXiSDd1KpgqN-X14FF65WEXLcDxOaqr1jyMfZPgKH2mz8ib9jbeIdQZcNpRSF1sE2PRS74hAhFlJB8xGOISXInNSTLxw/Matematika_dlya_data_science.pdf',
            note: 'Книга по математике для DS.',
          },
          {
            title: 'Математика для Data Science',
            url: 'https://psv4.userapi.com/s/v1/d/xYoYWMFozin4u5mVI2RuWuOjbmLXiSDd1KpgqN-X14FF65WEXLcDxOaqr1jyMfZPgKH2mz8ib9jbeIdQZcNpRSF1sE2PRS74hAhFlJB8xGOISXInNSTLxw/Matematika_dlya_data_science.pdf',
            note: 'Книга по математике для DS.',
          },
          {
            title: 'Математика в машинном обучении',
            url: 'https://psv4.userapi.com/s/v1/d/d7fiulCt9h9AM8tuMEXjidA_iIZNvmVuV4AJzF7qtsIle4ut70ZzzY69a9jlHm6DSDVOc-YNJVLC9sLJDiafmPToG47KkXqs6L9Ptw1MOzYGis9otBHJ3Q/Matematika_v_mashinnom_obucheni.pdf',
            note: 'Книга по математике в ML.',
          },
        ],
      },
      {
        badge: 'ТГ-посты',
        title: 'Telegram',
        items: [
          {
            title: 'Зачем нужен ML в аналитике?',
            url: 'https://t.me/zasql_python/242',
            note: 'Пост про применение ML в аналитике.',
          },
          {
            title: 'Что влияет на метрику X',
            url: 'https://t.me/zasql_python/321',
            note: 'Пост про интерпретируемость моделей и важность признаков.',
          },
          {
            title: 'Что такое predict_proba?',
            url: 'https://t.me/zasql_python/269',
            note: 'Пост про вероятностные предсказания моделей классификации.',
          },
          {
            title: 'Градиентный спуск',
            url: 'https://t.me/zasql_python/252',
            note: 'Пост про градиентный спуск и его применение в обучении моделей.',
          },
          {
            title: 'Causal Inference',
            url: 'https://t.me/zasql_python/256',
            note: 'Пост про причинно-следственные связи и их важность в аналитике.',
          },
          {
            title: 'Propensity Score Matching',
            url: 'https://t.me/zasql_python/257',
            note: 'Пост про метод сопоставления по склонности для оценки эффектов вмешательств.',
          },
        ],
      },
      {
        badge: 'Вебинары',
        title: 'Датасеты и ноутбуки',
        items: [
          {
            title: 'Градиентный Бустинг: самый частый вопрос на собеседовании на дата саентиста',
            url: 'https://www.youtube.com/watch?v=ZNJ3lKyI-EY&t=1127s',
            note: 'Вебинар по градиентному бустингу с примерами на Python.',
          },
          {
            title: 'Time Series Forecasting: прогнозирование временных рядов для аналитиков',
            url: 'https://www.kaggle.com/learn/time-series',
            note: 'Ноутбук и датасеты по прогнозированию временных рядов от Kaggle.',
          },
          {
            title: 'Линейная Регрессия для Дата Саентиста',
            url: 'https://www.youtube.com/watch?v=QZJ94igWVxQ',
            note: 'Вебинар по линейной регрессии с примерами на Python.',
          },
          {
            title: 'Методы обнаружения выбросов',
            url: 'https://www.youtube.com/watch?v=TOK7Kq7x0yc',
            note: 'Вебинар по методам обнаружения выбросов с примерами на Python.',
          },
          {
            title: 'Propensity Score Matching in Python Kaggle',
            url: 'https://www.kaggle.com/code/harrywang/propensity-score-matching-in-python',
            note: 'Ноутбук по Propensity Score Matching с примерами на Python.',
          },
        ],
      },
    ],
  },
];