import {
  wrapCodeBlock as wrapCode,
  SQL_CODE_CHALLENGES,
  SQL_CONCEPT_PROMPTS as SQL_CONCEPT_EXPANSION,
  PYTHON_SNIPPET_PROMPTS as PYTHON_SNIPPET_EXPANSION,
  PYTHON_CONCEPT_PROMPTS as PYTHON_CONCEPT_EXPANSION,
  STATS_FORMULA_PROMPTS as STATS_FORMULA_EXPANSION,
  PROBABILITY_CASE_PROMPTS as PROBABILITY_EXTRA_PROMPTS,
  AB_SCENARIO_PROMPTS as AB_SCENARIO_EXPANSION,
  MCQ_SQL_PROMPTS as MCQ_SQL_EXPANSION,
  MSQ_EXTRA_PROMPTS as MSQ_ADDITIONAL_EXPANSION,
  SQL_ANALYTICS_PROMPTS,
  PYTHON_ANALYTICS_PROMPTS,
  STATS_ADVANCED_PROMPTS,
  AB_MATH_PROMPTS,
  PROBABILITY_DISTRIBUTION_PROMPTS,
  MSQ_ANALYTICS_PROMPTS,
} from './question_expansion.js';

// Synthesized question banks focused on SQL, статистика, вероятность и эксперименты.

const SQL_WINDOW_PROMPTS = [
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как посчитать 7-дневное скользящее среднее заказов по пользователю с помощью оконной функции? По полям user_id, order_date и order_cnt.',
    answer: 'Используйте AVG(order_cnt) OVER (PARTITION BY user_id ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW).',
    tags: ['window-functions', 'rolling'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question: 'Опишите, как работает оконная функция LAG и приведите пример расчёта разницы между текущей и предыдущей покупкой.',
    answer: 'LAG позволяет обратиться к предыдущей строке без self join. Например: amount - LAG(amount) OVER (PARTITION BY user_id ORDER BY paid_at) считает изменение чека.',
    tags: ['window-functions'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question: 'Как с помощью оконных функций распределить пользователей по квантилям активности?',
    answer: 'Используйте NTILE(4) OVER (ORDER BY sessions_last_30d DESC) как квартиль активности; результат хранит группу 1..4.',
    tags: ['window-functions', 'segmentation'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как посчитать running total выручки по дате заказа?',
    answer: 'SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) возвращает накопленную выручку.',
    tags: ['window-functions'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question: 'Объясните отличие ROWS и RANGE в оконных функциях на примере вычисления 30-минутного окна.',
    answer: 'ROWS задаёт конкретное число строк (например, 30 предыдущих событий), RANGE — диапазон значений ORDER BY (например, PAYLOAD с интервалом INTERVAL 30 MINUTE).',
    tags: ['window-frame'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как выделить первый заказ пользователя после подключения подписки? По полям user_id и order_time.',
    answer: 'Используйте ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_time) и фильтруйте rn = 1 на выбранном диапазоне.',
    tags: ['window-functions'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question: 'Как посчитать долю категории в продаже каждого заказа без self join? По полям category_amount и order_id.',
    answer: 'SUM(category_amount) OVER (PARTITION BY order_id) даёт общий чек, затем category_amount / SUM(category_amount) OVER ...',
    tags: ['window-functions'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как получить TOP-N товаров в категории с помощью оконных функций? Если есть поля category, product_id и revenue.',
    answer: 'Выполните ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) и фильтруйте rn <= N.',
    tags: ['ranking'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как сравнить текущий показатель MAU с MAU предыдущего месяца в одном запросе? Очень кратко.',
    answer: 'date_trunc + COUNT DISTINCT + LAG(metric) OVER (ORDER BY month). Разница = current - previous.',
    tags: ['window-functions'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question: 'Как в PostgreSQL использовать оконную функцию для расчёта перцентилей времени отклика?',
    answer: 'percentile_cont(0.95) WITHIN GROUP (ORDER BY response_ms) OVER (PARTITION BY endpoint) — непрерывный перцентиль без группировки.',
    tags: ['percentile'],
  }
];

const SQL_CODE_PROMPTS = [
  {
    category: 'SQL',
    difficulty: 'medium',
    question:
      'Что вернёт запрос:' +
      wrapCode(
        'SELECT user_id, COUNT(*) FILTER (WHERE event_name = \"signup\") AS signups,\n       COUNT(*) FILTER (WHERE event_name = \"purchase\") AS purchases\nFROM events\nWHERE event_date >= current_date - INTERVAL \"30 day\"\nGROUP BY 1;'
      ),
    answer: 'Для каждого user_id покажет число регистраций и покупок за последние 30 дней, используя условные агрегаты.',
    tags: ['filter-clause'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question:
      'Что сделает конструкция:' +
      wrapCode(
        'SELECT DISTINCT ON (user_id) user_id, plan, changed_at\nFROM plan_history\nORDER BY user_id, changed_at DESC;'
      ),
    answer: 'Вернёт последнюю запись по каждому пользователю благодаря DISTINCT ON с сортировкой по убыванию даты.',
    tags: ['postgres', 'distinct-on'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question:
      'Что посчитает запрос с CROSS JOIN и генерацией дат:' +
      wrapCode(
        'WITH dates AS (\n  SELECT generate_series(date_trunc(\'month\', current_date) - INTERVAL \"5 month\",\n                         date_trunc(\'month\', current_date), INTERVAL \"1 month\") AS month\n)\nSELECT d.month, COUNT(DISTINCT u.user_id)\nFROM dates d\nLEFT JOIN users u ON date_trunc(\'month\', u.created_at) = d.month\nGROUP BY 1;'
      ),
    answer: 'Создаёт календарь месяцев и считает количество новых пользователей по каждому месяцу, даже если регистраций не было.',
    tags: ['generate_series'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question:
      'Что вернёт запрос с JSONB:' +
      wrapCode(
        'SELECT event_data ->> \"experiment\" AS experiment, COUNT(*)\nFROM analytics_log\nWHERE event_data ? \"experiment\"\nGROUP BY 1;'
      ),
    answer: 'По JSONB ключу experiment посчитает количество событий в каждом эксперименте.',
    tags: ['jsonb'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question:
      'Что делает запрос' +
      wrapCode(
        'SELECT user_id, MIN(event_time) AS first_use\nFROM events\nWHERE event_name = ANY(ARRAY[\"export\", \"download\"])\nGROUP BY 1 HAVING COUNT(*) >= 2;'
      ),
    answer: 'Находит пользователей, которые дважды использовали export или download, и выводит первое срабатывание.',
    tags: ['arrays'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question:
      'Какой результат у запроса' +
      wrapCode(
        'SELECT DATE_TRUNC(\'week\', event_time)::date AS week,\n       SUM(revenue) / NULLIF(COUNT(DISTINCT user_id), 0) AS arpu\nFROM orders\nGROUP BY 1;'
      ),
    answer: 'ARPU по неделям: сумма выручки делится на уникальных покупателей внутри недели.',
    tags: ['arpu'],
  }
];

const probabilityBlocks = [];

const pushBlock = (category, prompts) => {
  prompts.forEach((prompt) => probabilityBlocks.push({ category, ...prompt }));
};

const latexFrac = (numerator, denominator) => `P = \\frac{${numerator}}{${denominator}}`;

pushBlock('Теория вероятностей', [
  {
    difficulty: 'medium',
    question: 'Сформулируйте теорему Байеса и поясните, когда её применять.',
    answer: `P(H_i|A) = P(A|H_i)P(H_i) / \\\\sum P(A|H_j)P(H_j). Применяется, когда нужно обновить вероятность гипотезы после наблюдения события A.`,
    tags: ['bayes'],
  },
  {
    difficulty: 'hard',
    question: 'Решите: вероятность дефекта у станка A — 2%, у станка B — 1%. 60% деталей делает A. Какова вероятность, что найденный дефект из станка A?',
    answer: `${latexFrac('0.02 \\times 0.6', '0.02 \\times 0.6 + 0.01 \\times 0.4')} = 0.75`,
    tags: ['bayes'],
  },
  {
    difficulty: 'medium',
    question: 'Опишите закон полной вероятности.',
    answer: 'Если события H₁...Hₙ образуют полную группу, то P(A) = Σ P(A|H_i)P(H_i).',
    tags: ['total-probability'],
  },
  {
    difficulty: 'medium',
    question: 'Приведите пример разбиения пространства для применения теоремы полной вероятности.',
    answer: 'Например, пользователей делим на каналы привлечения и считаем общую конверсию как сумму по каналам.',
    tags: ['total-probability'],
  },
  {
    difficulty: 'medium',
    question: 'Как сформулировать простую задачу на Бернулли (n=5, p=0.2)?',
    answer: 'Вероятность ровно двух успехов: C(5,2) × 0.2² × 0.8³ = 0.2048.',
    tags: ['bernoulli'],
  },
  {
    difficulty: 'medium',
    question: 'Что такое биномиальное распределение и как найти математическое ожидание?',
    answer: 'X ~ Bin(n,p); E[X] = np, Var[X] = np(1-p).',
    tags: ['binomial'],
  },
  {
    difficulty: 'medium',
    question: 'Сформулируйте закон больших чисел (ЗБЧ).',
    answer: 'Среднее независимых одинаково распределённых величин сходится к ожиданию при n→∞.',
    tags: ['lln'],
  },
  {
    difficulty: 'medium',
    question: 'Приведите пример применения ЗБЧ для измерения метрики продукта.',
    answer: 'Средний чек по пользователям стабилизируется при большом числе заказов, что позволяет полагаться на выборочное среднее.',
    tags: ['lln'],
  },
  {
    difficulty: 'medium',
    question: 'Сформулируйте центральную предельную теорему (ЦПТ).',
    answer: 'Сумма (или среднее) большого числа независимых СВ стремится к нормальному распределению независимо от исходного распределения.',
    tags: ['clt'],
  },
  {
    difficulty: 'medium',
    question: 'Объясните на примере, почему ЦПТ позволяет строить доверительные интервалы.',
    answer: 'Средняя конверсия по пользователям близка к нормали ⇒ можно использовать z-распределение для интервала.',
    tags: ['clt'],
  },
  {
    difficulty: 'medium',
    question: 'Что такое дисперсия и зачем она нужна?',
    answer: 'Var(X) = E[(X - E[X])²]. Показывает разброс значений относительно среднего.',
    tags: ['variance'],
  },
  {
    difficulty: 'medium',
    question: 'Какова дисперсия суммы независимых величин?',
    answer: 'Var(X + Y) = Var(X) + Var(Y) для независимых X и Y.',
    tags: ['variance'],
  },
  {
    difficulty: 'medium',
    question: 'Что такое p-value в A/B тестах?',
    answer: 'Вероятность получить столь же экстремальную статистику при условии верности H0.',
    tags: ['p-value'],
  },
  {
    difficulty: 'medium',
    question: 'Почему p-value ≠ вероятность гипотезы?',
    answer: 'p-value относится к данным при фиксированной гипотезе, но не к вероятности самой гипотезы.',
    tags: ['p-value'],
  },
  {
    difficulty: 'medium',
    question: 'Дайте формулы для числа сочетаний и перестановок.',
    answer: 'C(n,k) = n!/(k!(n-k)!), P(n) = n!.',
    tags: ['combinatorics'],
  },
  {
    difficulty: 'hard',
    question: 'Задача на сочетания: сколько способов выбрать комитет из 3 человек из 10?',
    answer: 'C(10,3) = 120.',
    tags: ['combinatorics'],
  },
  {
    difficulty: 'medium',
    question: 'Как посчитать вероятность хотя бы одного успеха из n независимых попыток?',
    answer: '1 - (1 - p)^n.',
    tags: ['probability'],
  },
  {
    difficulty: 'medium',
    question: 'Задача на полную вероятность: с вероятностью 0.7 пользователь с мобайла, у мобайл-конверсии 2%, у десктопа 3%. Найдите общую конверсию.',
    answer: 'P = 0.7×0.02 + 0.3×0.03 = 0.023.',
    tags: ['total-probability'],
  }
]);

const PROBABILITY_PROMPTS = probabilityBlocks;

const STATS_PROMPTS = [
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'В чём отличие t-теста от критерия Манна–Уитни?',
    answer: 'Тесты проверяют разные вещи: t-тест: гипотезу о равенстве средних, Манна–Уитни — о равенстве распределений.',
    tags: ['hypothesis-testing'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Когда применять критерий Манна–Уитни?',
    answer: 'Когда важна проверка равенства распределений, а не средних: при малых выборках, выбросах или явной неоднородности дисперсий Манна–Уитни сравнивает ранги и не делает предположений о нормальности.',
    tags: ['nonparametric'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое дельта-метод в A/B тестах?',
    answer: 'Позволяет получить оценку дисперсии сложной метрики через ее приближение линейной функцией.',
    tags: ['delta-method'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Опишите CUPED и его применение.',
    answer: 'CUPED вводит ковариату (pre-experiment metric) и вычитает θ(X - mean(X)), уменьшая дисперсию и размер выборки.',
    tags: ['cuped'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое switchback тест?',
    answer: 'Метод для продуктовых изменений, где пользователей тяжело разделить. Трафик переключается между вариантами по расписанию, учитывая сезонность.',
    tags: ['switchback'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Когда использовать стратификацию в экспериментах?',
    answer: 'Когда важно выровнять по каналу/платформе, чтобы снизить дисперсию и избежать перекоса выборок.',
    tags: ['stratification'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'В чём идея последовательного теста?',
    answer: 'Метрика проверяется после каждого блока данных с контролем α-расхода, что позволяет раньше останавливать успешные/провальные эксперименты.',
    tags: ['sequential-tests'],
  }
];

const AB_ADVANCED_PROMPTS = [
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как применить дельта-метод для метрики конверсии?',
    answer: 'Представьте конверсию как ratio: c = conversions / traffic. Оцените дисперсию через производную функции и дисперсии числителя/знаменателя.',
    tags: ['delta-method'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Объясните идею switchback теста с примерами.',
    answer: 'Например, алгоритм выдачи курьеров меняют по дням недели, чтобы учесть циклы спроса. Каждая площадка получает оба варианта во времени.',
    tags: ['switchback'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как проводить CUPED на практике?',
    answer: 'Рассчитайте θ = Cov(Y, X) / Var(X), где X — метрика на предпериоде. Новый показатель Y_adj = Y - θ(X - mean(X)). На нём запускайте t-тест.',
    tags: ['cuped'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Что такое switch-over bias и как его избежать?',
    answer: 'Пользователь может видеть оба варианта (A, B). Решение - жёсткая привязка к варианту по user_id.',
    tags: ['experiments'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Зачем нужна стратификация при рандомизации?',
    answer: 'Чтобы уравнять важные факторы (канал, платформа) и снизить дисперсию. Особенно полезна при небольших выборках.',
    tags: ['stratification'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Что такое sequential probability ratio test (SPRT)?',
    answer: 'Метод последовательного тестирования, сравнивающий правдоподобие H1/H0, что позволяет остановиться быстрее при высоком сигнале.',
    tags: ['sequential-tests'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как скорректировать метрику retention с помощью линеаризации?',
    answer: 'Retention как ratio: R = retained/total. Производная = 1/total, поэтому Var(R) ≈ Var(retained)/total².',
    tags: ['delta-method'],
  }
];

const METRIC_PROMPTS = [
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Что такое Activation Rate и как её рассчитать в SQL? Есть таблица events(user_id, event_name).',
    answer:
      "Доля пользователей, достигших aha-действия. Пример: COUNT(DISTINCT CASE WHEN event_name = 'aha' THEN user_id END) / COUNT(DISTINCT CASE WHEN event_name = 'signup' THEN user_id END).",
    tags: ['activation', 'sql'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Опишите формулу WAU/MAU и зачем она нужна.',
    answer:
      'WAU/MAU = активные пользователи за 7 дней / активные за 30 дней. Чем выше коэффициент, тем сильнее привычка использования (значение > 0.5 — хороший ориентир).',
    tags: ['wau-mau'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Как получить ARPU в разрезе тарифов? Есть таблица payments(plan, user_id, amount).',
    answer:
      "ARPU = SUM(revenue)/COUNT(DISTINCT payer). SQL: SELECT plan, SUM(amount)::float / NULLIF(COUNT(DISTINCT user_id),0) FROM payments GROUP BY plan.",
    tags: ['arpu', 'sql'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Что такое NRR и как его интерпретировать? Приведите формулу.',
    answer:
      'Net Revenue Retention = (MRR_start + Expansion - Contraction - Churn) / MRR_start. Значение > 100% означает рост выручки от текущих клиентов.',
    tags: ['nrr'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Как посчитать churn rate пользователей (формула и SQL)? Есть таблица customer_status(user_id, status) со статусами active_start и churned.',
    answer:
      "Churn Rate = churned_users / users_at_start. SQL: SELECT COUNT(*) FILTER (WHERE status='churned')::float / NULLIF(COUNT(*) FILTER (WHERE status='active_start'), 0) FROM customer_status;",
    tags: ['churn', 'sql'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Что такое Time to First Value (TTFV)?',
    answer:
      'TTFV — время от регистрации до первого полезного действия. Чем оно ниже, тем проще пользователю увидеть ценность и выше retention.',
    tags: ['ttfv'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Как измерить Feature Adoption Rate новой функции? Есть таблица events(user_id, event_name).',
    answer:
      'Доля активных пользователей, попробовавших фичу: COUNT(DISTINCT feature_users)/COUNT(DISTINCT active_users). Анализируйте по сегментам/каналам.',
    tags: ['adoption'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Что такое Customer Effort Score (CES)?',
    answer:
      'CES измеряет усилие для завершения сценария (обычно шкала 1–7). Используется для поиска препятствий в онбординге или поддержке.',
    tags: ['ces'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Как построить SQL-воронку signup → checkout → purchase? Есть таблица events(user_id, event_name, event_time).',
    answer:
      "Используйте подзапрос с MIN CASE по user_id: WITH funnel AS (SELECT user_id, MIN(...) signup, MIN(...) checkout, MIN(...) purchase FROM events GROUP BY 1). Затем посчитайте долю пользователей, у которых есть следующий шаг.",
    tags: ['funnel', 'sql'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Что показывает отношение LTV/CAC и какие значения приемлемы? Как их рассчитать?',
    answer:
      'LTV/CAC показывает окупаемость привлечения. Значение ≥3 считается здоровым. LTV оценивают через ARPU и retention, CAC — из маркетинговых затрат и новых клиентов.',
    tags: ['ltv', 'cac'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Как измерить Support Contact Rate?',
    answer:
      'SCR = тикеты поддержки / активные пользователи * 1000. Рост SCR сигналит о болях UX и помогает приоритизировать улучшения.',
    tags: ['support'],
  },
  {
    category: 'Метрики',
    difficulty: 'medium',
    question: 'Что такое Query Success Rate в поиске?',
    answer:
      'QSR = успешные поисковые запросы / общее число запросов. Показывает долю запросов с релевантной выдачей и помогает оптимизировать поиск.',
    tags: ['search'],
  }
];

const MARKETING_PROMPTS = [
  {
    category: 'Маркетинговая аналитика',
    difficulty: 'medium',
    question: 'Как рассчитать blended CAC и чем он отличается от channel CAC?',
    answer:
      'Blended CAC = sum(marketing_spend) / sum(new_customers) по всем каналам. Channel CAC — отдельный расчёт по каналу, позволяет видеть эффективность каждой площадки, но blended показывает общий payback.',
    tags: ['cac', 'marketing'],
  },
  {
    category: 'Маркетинговая аналитика',
    difficulty: 'medium',
    question: 'Что такое ROAS и как его использовать?',
    answer:
      'ROAS = revenue атрибутированная к кампании / рекламные расходы. Если ROAS < 1, кампания убыточна. Для подписок лучше смотреть на LTV/Spend.',
    tags: ['roas'],
  },
  {
    category: 'Маркетинговая аналитика',
    difficulty: 'medium',
    question: 'Опишите разницу между last-click и data-driven атрибуцией.',
    answer:
      'Last-click приписывает ценность последнему касанию, data-driven распределяет вклад по цепочке с помощью моделей (Shapley, Markov). Последний точнее отражает реальность и позволяет оптимизировать верх воронки.',
    tags: ['attribution'],
  },
  {
    category: 'Маркетинговая аналитика',
    difficulty: 'medium',
    question: 'Как построить incremental lift тест для рекламной кампании?',
    answer:
      'Разделите аудиторию на test/control, отключите рекламу в контроле. Измеряйте разницу в целевой метрике (конверсии, выручка) — это и есть инкремент.',
    tags: ['incrementality'],
  },
  {
    category: 'Маркетинговая аналитика',
    difficulty: 'hard',
    question: 'Что такое MMM (Marketing Mix Modeling) и когда его использовать?',
    answer:
      'MMM — регрессионная модель, связывающая маркетинговые активности и продажи с учётом сезонности и лагов. Используется, когда нет user-level данных (TV, offline) и нужна стратегическая оптимизация бюджета.',
    tags: ['mmm'],
  },
  {
    category: 'Маркетинговая аналитика',
    difficulty: 'medium',
    question: 'Как оценить качество лидов из разных каналов в SQL? Есть таблица leads(source, stage).',
    answer:
      "Соберите когорты по источникам, присоедините таблицу конверсий/оплаты и вычислите конверсию в оплату и выручку. Пример запроса: GROUP BY source и считаем SUM(CASE WHEN stage='paid' THEN 1 END)/COUNT(*).",
    tags: ['lead-quality', 'sql'],
  },
  {
    category: 'Маркетинговая аналитика',
    difficulty: 'medium',
    question: 'Что такое blended payback и как его интерпретировать?',
    answer:
      'Blended payback = CAC / (ARPU * gross margin). Показывает, за сколько месяцев маркетинговые вложения окупаются. Значение > 12 месяцев сигналит о рискованных кампаниях.',
    tags: ['payback'],
  },
  {
    category: 'Маркетинговая аналитика',
    difficulty: 'medium',
    question: 'Как построить SQL-отчёт по каналам привлечения и когортам?',
    answer:
      "Используйте cohort_date = date_trunc('week', signup_at) и source. Считайте активность/оплаты в следующем периоде. Это позволяет видеть LTV по каналам.",
    tags: ['cohort', 'marketing', 'sql'],
  },
  {
    category: 'Маркетинговая аналитика',
    difficulty: 'medium',
    question: 'Что такое attributed vs. non-attributed revenue и зачем их разделять?',
    answer:
      'Attributed revenue — сумма заказов, связанная с конкретной кампанией. Non-attributed — органика. Разделение помогает увидеть реальный вклад маркетинга и не переоценивать кампании.',
    tags: ['attribution'],
  },
  {
    category: 'Маркетинговая аналитика',
    difficulty: 'medium',
    question: 'Как оценить эффективность промокода?',
    answer:
      'Посчитайте incremental revenue = (revenue_with_code - baseline). Учитывайте каннибализацию: сравните поведение пользователей, получивших код, с похожими без кода (matched control).',
    tags: ['promo'],
  }
];

const PRODUCT_ANALYTICS_PROMPTS = [
  {
    category: 'Продуктовая аналитика',
    difficulty: 'medium',
    question: 'Как рассчитать конверсию по этапам продуктовой воронки в SQL?',
    answer:
      "Строй CTE с MIN временем каждого этапа и агрегируй: селект user_id, MIN(signup) AS signup, MIN(activation) AS activation... затем считай COUNT(activation)/COUNT(signup) и т.д.",
    tags: ['funnel', 'sql'],
  },
  {
    category: 'Продуктовая аналитика',
    difficulty: 'medium',
    question: 'Что такое retention curve и какие выводы по ней можно сделать?',
    answer:
      'Retention curve показывает долю пользователей, вернувшихся в день N после регистрации. Форма кривой помогает понять наличие плато, влияние фич и сегментировать пользователей.',
    tags: ['retention'],
  },
  {
    category: 'Продуктовая аналитика',
    difficulty: 'medium',
    question: 'Как измерить DAU/WAU/MAU и для чего их сравнивают?',
    answer:
      'DAU/WAU/MAU — активные пользователи в соответствующих окнах. Сравнение (например, DAU/MAU) показывает регулярность использования и помогает оценить stickiness.',
    tags: ['dau', 'stickiness'],
  },
  {
    category: 'Продуктовая аналитика',
    difficulty: 'medium',
    question: 'Что такое cohort analysis и как он помогает проверить гипотезу?',
    answer:
      'Когорты позволяют сравнить поведение пользователей, зарегистрированных в разные периоды/каналы, и увидеть эффект фич или кампаний на retention и revenue.',
    tags: ['cohort'],
  },
  {
    category: 'Продуктовая аналитика',
    difficulty: 'medium',
    question: 'Приведите пример метрики product-market fit survey.',
    answer:
      'Классический вопрос: «Насколько вы были бы расстроены, если бы больше не могли пользоваться продуктом?» Если ≥40% ответят «очень», это сигнал PMF.',
    tags: ['pmf'],
  },
  {
    category: 'Продуктовая аналитика',
    difficulty: 'medium',
    question: 'Как оценить влияние фичи на North Star Metric?',
    answer:
      'Определите, какой драйвер North Star меняет фича (например, depth). Запустите эксперимент или cohorth analysis и проверяйте влияние на драйвер → на NSM.',
    tags: ['north-star'],
  },
  {
    category: 'Продуктовая аналитика',
    difficulty: 'medium',
    question: 'Что такое Opportunity Solution Tree?',
    answer:
      'OST связывает бизнес-цели (outcomes) с возможностями (opportunities) и решениями. Помогает структурировать discovery и не прыгать сразу к фичам.',
    tags: ['discovery'],
  },
  {
    category: 'Продуктовая аналитика',
    difficulty: 'medium',
    question: 'Как измерить влияние push-кампании на retention?',
    answer:
      'Используйте holdout-группу без push, сравните retention в горизонт 7/30 дней. Для точности примените CUPED или стратификацию по активности.',
    tags: ['push', 'experiment'],
  },
  {
    category: 'Продуктовая аналитика',
    difficulty: 'medium',
    question: 'Что такое product health score и из чего он может состоять?',
    answer:
      'Health score комбинирует usage (сессии, активные действия), value (созданные объекты), sentiment (NPS, тикеты) и технические сигналы (SLA). Помогает прогнозировать churn.',
    tags: ['health-score'],
  },
  {
    category: 'Продуктовая аналитика',
    difficulty: 'medium',
    question: 'Как посчитать rolling retention (например, D7) в SQL?',
    answer:
      "Используйте cohort_date, затем проверяйте, был ли пользователь активен в диапазоне cohort_date + INTERVAL '7 day'. Пример: COUNT(DISTINCT user_id) FILTER (WHERE event_date BETWEEN cohort AND cohort+7) / COUNT(DISTINCT user_id).",
    tags: ['retention', 'sql'],
  }
];

const ML_PROMPTS = [
  {
    category: 'ML',
    difficulty: 'medium',
    question: 'Чем отличается дерево решений от случайного леса?',
    answer: 'Дерево — одна модель, склонная к переобучению. Случайный лес — ансамбль из деревьев с бутстрэпом и случайным подмножеством признаков, устойчивый и менее интерпретируемый.',
    tags: ['decision-trees'],
  },
  {
    category: 'ML',
    difficulty: 'medium',
    question: 'Как устроен градиентный бустинг?',
    answer: 'Модели строятся последовательно, каждая аппроксимирует отрицательный градиент функции потерь, уменьшая остатки.',
    tags: ['boosting'],
  },
  {
    category: 'ML',
    difficulty: 'medium',
    question: 'Когда линейная регрессия неприемлема?',
    answer: 'При нелинейной зависимости, сильной мультиколлинеарности, гетероскедастичности или не-нормальных остатках без трансформаций.',
    tags: ['regression'],
  },
  {
    category: 'ML',
    difficulty: 'medium',
    question: 'Что такое регуляризация в линейной модели?',
    answer: 'L1/L2 штрафы добавляются к функции потерь, ограничивая веса и снижая переобучение.',
    tags: ['regularization'],
  },
  {
    category: 'ML',
    difficulty: 'medium',
    question: 'Как интерпретировать коэффициенты логистической регрессии?',
    answer: 'Коэффициент показывает лог-отношение шансов при увеличении признака на единицу, при прочих равных.',
    tags: ['logistic'],
  }
];

const MSQ_PROMPTS = [
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Какие условия нужны для t-теста Стьюдента?',
    options: [
      'Нормальность распределения или большая выборка',
      'Близкие дисперсии',
      'Случайная выборка',
      'Переменные должны быть категориальными'
    ],
    correctOptionIndexes: [0, 1, 2],
    explanation: 't-тест предполагает нормальность (или ЦПТ), равные дисперсии (для классической версии) и случайную выборку. Категориальные переменные не требуются.',
    tags: ['t-test'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Что помогает контролировать сезонность в эксперименте?',
    options: [
      'Switchback дизайн',
      'Сегментация по дню недели',
      'Сбор CSS переменных',
      'Стратификация при рандомизации'
    ],
    correctOptionIndexes: [0, 1, 3],
    explanation: 'Switchback и стратификация по календарю помогают уравнять сезонность. CSS не имеет значения.',
    tags: ['experiments'],
  }
];


const PRODUCT_CASE_PROMPTS = [
  {
    category: 'Продуктовые кейсы',
    difficulty: 'hard',
    question:
      'Маркетплейс увидел падение конверсии checkout→оплата на iOS на 4 п.п. Багов в логах нет. Как структурируешь расследование?',
    answer:
      '1) Проверяю техсигналы: SRM, ошибки SDK, версии приложения и статусы платёжных провайдеров. 2) Сегментирую checkout по способам оплаты, странам, типам корзин и сравниваю с Android/веб. 3) Смотрю, на каком шаге растут отказы/время (например, CVV или 3DS). 4) Сопоставляю с релизами и экспериментами. Дальше формирую гипотезы и эскалации.',
    tags: ['cases', 'conversion', 'mobile'],
  },
  {
    category: 'Продуктовые кейсы',
    difficulty: 'hard',
    question:
      'У медиа‑сервиса просел D7 retention после отключения персонализированных пушей. Как убедиться, что причина именно в push?',
    answer:
      'Собираю holdout-группу, сравниваю retention с учётом сезонности, анализирую доставку (open rate, ошибки) и сегментирую по новым/старым пользователям. Проверяю, компенсируют ли другие каналы (email, рекомендации). Если падение концентрируется на сегментах, зависимых от push, гипотеза подтверждается.',
    tags: ['retention', 'push'],
  },
  {
    category: 'Продуктовые кейсы',
    difficulty: 'medium',
    question:
      'Сервис доставки заметил снижение среднего чека после масштабной акции. Как показать, что кампания всё ещё выгодна?',
    answer:
      'Сравниваю AOV и частоту заказов, считаю incremental revenue = (AOV × orders) − скидки. Сегментирую по новым/старым пользователям и каналам, оцениваю изменения LTV и payback. Если снижение AOV компенсируется ростом частоты и удержания, показываю расчёт окупаемости.',
    tags: ['ltv', 'promo'],
  },
  {
    category: 'Продуктовые кейсы',
    difficulty: 'medium',
    question:
      'Финтех-продукт внедрил новый KYC. Approve rate вырос, но онбординг стал занимать 10 минут. Как аргументировать, что это ок?',
    answer:
      'Сравниваю выручку на одобренного пользователя, fraud rate и стоимость комплаенса до/после. Показываю, что рост approve rate даёт больший вклад в деньги, чем потери от более длинного процесса. Добавляю распределение времени и предложения по UX.',
    tags: ['onboarding', 'fintech'],
  },
  {
    category: 'Продуктовые кейсы',
    difficulty: 'medium',
    question:
      'Команда Stories в соцсети хочет доказать, что новая лента повышает вовлечённость. Какие шаги предложишь?',
    answer:
      'Определяю North Star (stories viewed per user) и guardrail (time spent в основной ленте). Запускаю эксперимент, смотрю глубину просмотра и переходы в creation flow, проверяю вклад новых авторов. В отчёте показываю uplift и риски.',
    tags: ['engagement', 'stories'],
  },
];

const PRODUCT_CASE_MCQ_PROMPTS = [
  {
    category: 'Продуктовые кейсы',
    difficulty: 'medium',
    question: 'Эксперимент дал SRM 60/40 вместо 50/50. Что делаешь первым делом?',
    options: [
      'Останавливаю эксперимент и ищу причину дисбаланса перед перезапуском',
      'Ничего — главное, что p-value < 0.05',
      'Сдвигаю трафик, чтобы искусственно выровнять доли',
      'Удаляю «лишних» пользователей из контрольной группы'
    ],
    correctOptionIndex: 0,
    answer:
      'SRM сигнализирует о проблеме рандомизации. Эксперимент останавливают, находят источник (фильтры, баг трекинга) и только затем запускают снова.',
    tags: ['experiments', 'srm'],
  },
  {
    category: 'Продуктовые кейсы',
    difficulty: 'medium',
    question: 'Команда Growth видит падение activation rate на Android. Что проверить в первую очередь?',
    options: [
      'Сразу раздать бонусы за регистрацию',
      'Сравнить версии приложения и последние релизы SDK',
      'Убрать Android из отчётов и анализировать только iOS',
      'Удалить события трекинга, чтобы не шумели'
    ],
    correctOptionIndex: 1,
    answer:
      'Частая причина — свежий билд с багом онбординга. Сначала сверяем версии, релизы SDK и ошибки, а не выдаём бонусы.',
    tags: ['activation', 'mobile'],
  },
  {
    category: 'Продуктовые кейсы',
    difficulty: 'medium',
    question: 'Какой набор метрик лучше всего отражает успех реферальной механики?',
    options: [
      'Только число приглашений',
      'Количество установок и долю активировавшихся рефералов',
      'Число отправленных пушей',
      'DAU всего продукта'
    ],
    correctOptionIndex: 1,
    answer:
      'Нужно мерить путь: приглашение → регистрация → целевое действие/оплата. Просто считать инвайты недостаточно.',
    tags: ['referral', 'metrics'],
  },
  {
    category: 'Продуктовые кейсы',
    difficulty: 'medium',
    question: 'Что взять за целевую метрику при тесте нового paywall в подписке?',
    options: [
      'Только LTV всех пользователей',
      'Конверсию paywall view → purchase и ARPPU платящих',
      'Количество отправленных email‑рассылок',
      'Оценку дизайна по шкале из 5 баллов'
    ],
    correctOptionIndex: 1,
    answer:
      'На коротком горизонте решение принимают по конверсии paywall и деньгам платящих. LTV пригодится позднее, но не для go/no-go сейчас.',
    tags: ['paywall', 'subscription'],
  },
];

const PRODUCT_CASE_MSQ_PROMPTS = [
  {
    category: 'Продуктовые кейсы',
    difficulty: 'medium',
    question: 'Какие шаги обязательны перед запуском сложной фичи на ограниченный трафик?',
    options: [
      'Определить guardrail-метрики',
      'Подготовить презентацию для дизайнеров',
      'Настроить трекинг ключевых событий',
      'Сразу выкатывать всем пользователям',
      'Прописать план отката'
    ],
    correctOptionIndexes: [0, 2, 4],
    explanation:
      'Нужны guardrails, события для измерения и понятный rollback. Презентация и мгновенный rollout не критичны.',
    tags: ['launch', 'guardrails'],
  },
  {
    category: 'Продуктовые кейсы',
    difficulty: 'medium',
    question: 'Что понадобится, чтобы посчитать LTV подписки?',
    options: [
      'Даты начала и окончания подписки',
      'Тип тарифа/сегмент',
      'Цвет кнопки «Купить»',
      'CAC или стоимость привлечения',
      'Информация о промокодах и скидках'
    ],
    correctOptionIndexes: [0, 1, 3, 4],
    explanation:
      'Нужны временные рамки, тариф/ARPU, маркетинговая стоимость и скидки. Цвет кнопки не влияет на расчёт LTV напрямую.',
    tags: ['ltv', 'subscription'],
  },
  {
    category: 'Продуктовые кейсы',
    difficulty: 'hard',
    question: 'Что обязательно включить в рассказ о продуктовой инициативе для руководства?',
    options: [
      'Проблему и гипотезу',
      'Только сырые таблицы без выводов',
      'Расчёт влияния на деньги',
      'Риски и next steps',
      'Скрыть неудачные результаты'
    ],
    correctOptionIndexes: [0, 2, 3],
    explanation:
      'Структура problem → hypothesis → impact + деньги и риски помогает принять решение. Сырые таблицы и сокрытие данных делают кейс слабым.',
    tags: ['communication', 'cases'],
  },
];


const BASE_QUESTIONS = [
  {
    id: 1,
    category: 'SQL',
    difficulty: 'easy',
    question: 'Чем отличается INNER JOIN от LEFT JOIN и когда использовать каждый?',
    answer: 'INNER JOIN возвращает только совпадающие строки, LEFT JOIN сохраняет все строки из левой таблицы и добавляет NULL для отсутствующих совпадений в правой, полезно при анализе неполных связей.',
    tags: ['joins', 'basics']
  },
  {
    id: 2,
    category: 'SQL',
    difficulty: 'easy',
    question: 'Как работает оператор GROUP BY и почему важно добавлять агрегаты к неагрегированным полям?',
    answer: 'GROUP BY группирует строки, агрегатные функции применяются к каждой группе отдельно; поля вне GROUP BY должны быть агрегированы или приведут к ошибке недетерминированности.',
    tags: ['aggregation']
  },
  {
    id: 3,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Что делает оконная функция ROW_NUMBER() и чем отличается от DENSE_RANK()?',
    answer: 'ROW_NUMBER() назначает уникальные последовательные номера строкам, DENSE_RANK() присваивает одинаковый ранг равным значениям и не пропускает ранги.',
    tags: ['window-functions']
  },
  {
    id: 4,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Объясните разницу между WHERE и HAVING.',
    answer: 'WHERE фильтрует строки до агрегации, HAVING фильтрует уже агрегированные группы, поэтому HAVING может использовать агрегатные функции.',
    tags: ['aggregation', 'filtering']
  },
  {
    id: 5,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как использовать CTE (WITH) и зачем они нужны?',
    answer: 'CTE позволяют объявлять временные результирующие наборы с именем, улучшая читаемость и повторное использование промежуточных запросов.',
    tags: ['cte']
  },
  {
    id: 6,
    category: 'SQL',
    difficulty: 'hard',
    question: 'Что такое window frame и почему RANGE BETWEEN отличается от ROWS BETWEEN?',
    answer: 'Window frame определяет подмножество строк внутри партиции. ROWS BETWEEN оперирует физическими строками, RANGE BETWEEN использует значения текущей строки (например, диапазон дат).',
    tags: ['window-functions']
  },
  {
    id: 7,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как бы вы вычислили 7-дневный скользящий средний для метрики посещений?',
    answer: 'Используйте оконную функцию AVG(metric) OVER (PARTITION BY entity ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW).',
    tags: ['rolling', 'window-functions']
  },
  {
    id: 8,
    category: 'SQL',
    difficulty: 'easy',
    question: 'Для чего нужен COALESCE и чем он лучше NVL/IFNULL?',
    answer: 'COALESCE возвращает первый ненулевой аргумент и работает в ANSI SQL, поэтому переносимее vendor-специфичных функций.',
    tags: ['nulls']
  },
  {
    id: 9,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как посчитать конверсию по воронке с помощью оконных функций?',
    answer: 'Сгруппируйте события по пользователю, отсортируйте по шагу и используйте MAX/COUNT с window PARTITION BY user ORDER BY step для определения прохождения.',
    tags: ['funnels']
  },
  {
    id: 10,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Когда стоит использовать DISTINCT, а когда GROUP BY?',
    answer: 'DISTINCT убирает дубликаты по перечисленным столбцам, GROUP BY нужен, если помимо уникальных комбинаций требуется агрегировать дополнительные поля.',
    tags: ['deduplication']
  },
  {
    id: 11,
    category: 'SQL',
    difficulty: 'hard',
    question: 'Опишите стратегию оптимизации запроса с несколькими JOIN и фильтрами.',
    answer: 'Проверьте индексы на ключевых полях, упорядочьте фильтры для уменьшения данных до JOIN, используйте EXPLAIN для поиска full scan и подумайте о материализации промежуточных результатов.',
    tags: ['performance']
  },
  {
    id: 12,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Что делает оператор LATERAL и когда полезен?',
    answer: 'LATERAL позволяет подзапросу ссылаться на столбцы из текущей строки внешнего запроса, удобно для вызова функций, разбора массивов или переменного числа строк.',
    tags: ['advanced']
  },
  {
    id: 13,
    category: 'SQL',
    difficulty: 'easy',
    question: 'Какие типы индексов бывают и как выбрать подходящий?',
    answer: 'Основные типы: B-Tree для точных и диапазонных запросов, Hash для равенства, GiST/Gin для полнотекста и массивов; выбор зависит от паттерна чтения.',
    tags: ['indexes']
  },
  {
    id: 14,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как проверить качество данных на предмет дубликатов и пропусков?',
    answer: 'Используйте COUNT(DISTINCT), агрегаты по ключам, WINDOW COUNT(*) OVER (PARTITION BY key) и проверки NULL через SUM(CASE WHEN col IS NULL THEN 1 ELSE 0 END).',
    tags: ['data-quality']
  },
  {
    id: 15,
    category: 'SQL',
    difficulty: 'hard',
    question: 'Объясните MERGE и приведите пример его использования.',
    answer: 'MERGE объединяет INSERT/UPDATE/DELETE в одном выражении, например при обновлении витрины: когда ключ найден — обновить, иначе вставить новую строку.',
    tags: ['dml']
  },
  {
    id: 16,
    category: 'Python',
    difficulty: 'easy',
    question: 'Чем отличаются списки и кортежи в Python?',
    answer: 'Списки изменяемы и имеют больше методов, кортежи неизменяемы и безопаснее для ключей словаря, а также занимают меньше памяти.',
    tags: ['basics']
  },
  {
    id: 17,
    category: 'Python',
    difficulty: 'easy',
    question: 'Как работает list comprehension и чем лучше цикла?',
    answer: 'List comprehension компактнее и зачастую быстрее благодаря реализации на уровне С, подходит для преобразований коллекций.',
    tags: ['comprehension']
  },
  {
    id: 18,
    category: 'Python',
    difficulty: 'medium',
    question: 'Что такое генератор и чем он отличается от списка?',
    answer: 'Генератор ленив, хранит только текущие значения и экономит память, в то время как список хранит все элементы сразу.',
    tags: ['generators']
  },
  {
    id: 19,
    category: 'Python',
    difficulty: 'medium',
    question: 'Как работает менеджер контекста и зачем нужен?',
    answer: 'Менеджер контекста гарантирует выполнение входа/выхода (например, открытие/закрытие файла) через методы __enter__ и __exit__, упрощая безопасное управление ресурсами.',
    tags: ['context-manager']
  },
  {
    id: 20,
    category: 'Python',
    difficulty: 'medium',
    question: 'Объясните разницу между deepcopy и copy.',
    answer: 'copy создаёт поверхностную копию, сохраняя ссылки на вложенные объекты, deepcopy рекурсивно копирует всю структуру, создавая независимые объекты.',
    tags: ['copying']
  },
  {
    id: 21,
    category: 'Python',
    difficulty: 'hard',
    question: 'Как устроен GIL и почему он не даёт линейного ускорения в многопоточности?',
    answer: 'Global Interpreter Lock позволяет исполняться только одному байткоду Python одновременно, поэтому CPU-bound задачи в потоках не распараллеливаются, но I/O выгоду получают.',
    tags: ['performance']
  },
  {
    id: 22,
    category: 'Python',
    difficulty: 'medium',
    question: 'Когда стоит использовать pandas.merge vs pandas.join?',
    answer: 'merge универсален и позволяет объединять по столбцам с разными именами, join синтаксический сахар по индексам; выбор зависит от структуры ключей.',
    tags: ['pandas']
  },
  {
    id: 23,
    category: 'Python',
    difficulty: 'medium',
    question: 'Как оптимизировать обработку больших CSV в pandas?',
    answer: 'Используйте chunksize для потоковой загрузки, указывайте dtypes, parse_dates и нужные столбцы, применяйте категориальные признаки.',
    tags: ['performance', 'pandas']
  },
  {
    id: 24,
    category: 'Python',
    difficulty: 'hard',
    question: 'Зачем использовать typing и как он помогает аналитикам?',
    answer: 'Аннотации типов улучшают автодополнение, документацию и упрощают code review, а инструменты типа mypy ловят ошибки на ранней стадии.',
    tags: ['typing']
  },
  {
    id: 25,
    category: 'Python',
    difficulty: 'easy',
    question: 'Чем полезен pathlib по сравнению с os.path?',
    answer: 'pathlib предлагает объектный API, удобную работу с путями и операциями файловой системы, читабельнее os.path.',
    tags: ['files']
  },
  {
    id: 26,
    category: 'Python',
    difficulty: 'medium',
    question: 'Как работает itertools.groupby и чем его ограничение?',
    answer: 'Функция группирует последовательные элементы по ключу, требует предварительной сортировки для глобальных групп и возвращает итераторы, которые нужно сразу потреблять.',
    tags: ['itertools']
  },
  {
    id: 27,
    category: 'Python',
    difficulty: 'medium',
    question: 'Как быстро собрать интерактивный прототип дашборда без BI-систем?',
    answer: 'Используйте лёгкий веб-фреймворк (Dash, Streamlit, Panel), но логику метрик держите в отдельных модулях, кешируйте тяжёлые расчёты и описывайте зависимости в requirements, чтобы прототип легко перенести в прод.',
    tags: ['dashboards', 'prototyping']
  },
  {
    id: 28,
    category: 'Python',
    difficulty: 'hard',
    question: 'Какие приёмы профилирования Python-кода знаете?',
    answer: 'Используйте модули cProfile, line_profiler, timeit для микробенчмарков и визуализации snakeviz для поиска узких мест.',
    tags: ['profiling']
  },
  {
    id: 29,
    category: 'Python',
    difficulty: 'easy',
    question: 'Чем полезен enumerate при обходе списка?',
    answer: 'enumerate возвращает индекс и значение, избавляет от ручного счётчика и повышает читаемость.',
    tags: ['iteration']
  },
  {
    id: 30,
    category: 'Python',
    difficulty: 'medium',
    question: 'Как безопасно работать с конфиденциальными переменными окружения в проектах аналитика?',
    answer: 'Используйте dotenv/secret-хранилища, не коммитьте .env, обращайтесь к значениям через os.environ и предоставляйте шаблон .env.example.',
    tags: ['security']
  },
  {
    id: 31,
    category: 'Теория вероятностей',
    difficulty: 'easy',
    question: 'Чем отличается дискретная случайная величина от непрерывной?',
    answer: 'Дискретная принимает отдельные значения с положительной вероятностью, непрерывная определяется плотностью и имеет нулевую вероятность конкретного значения.',
    tags: ['basics']
  },
  {
    id: 32,
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Сформулируйте закон больших чисел.',
    answer: 'Среднее независимых одинаково распределённых величин сходится к математическому ожиданию при росте числа наблюдений.',
    tags: ['lln']
  },
  {
    id: 33,
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Что такое условная вероятность и как её вычислить?',
    answer: 'P(A|B) = P(A ∩ B) / P(B), характеризует вероятность события A при условии, что событие B произошло.',
    tags: ['conditional-probability']
  },
  {
    id: 34,
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Объясните формулу полной вероятности.',
    answer: 'Если события B_i образуют полную группу, то P(A) = Σ P(A|B_i)P(B_i).',
    tags: ['total-probability']
  },
  {
    id: 35,
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Что такое теорема Байеса и когда её использовать?',
    answer: 'P(B_i|A) = P(A|B_i)P(B_i)/Σ P(A|B_j)P(B_j); применяют для обновления вероятностей гипотез после наблюдения.',
    tags: ['bayes']
  },
  {
    id: 36,
    category: 'Теория вероятностей',
    difficulty: 'easy',
    question: 'Как посчитать математическое ожидание для дискретной величины?',
    answer: 'E[X] = Σ x_i * P(X = x_i).',
    tags: ['expectation']
  },
  {
    id: 37,
    category: 'Теория вероятностей',
    difficulty: 'easy',
    question: 'Что показывает дисперсия?',
    answer: 'Дисперсия измеряет разброс значений относительно среднего: Var(X) = E[(X - E[X])^2].',
    tags: ['variance']
  },
  {
    id: 38,
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как связаны независимость событий и произведение вероятностей?',
    answer: 'События независимы, если P(A ∩ B) = P(A)P(B).',
    tags: ['independence']
  },
  {
    id: 39,
    category: 'Теория вероятностей',
    difficulty: 'hard',
    question: 'Что такое марковская цепь и приведите пример?',
    answer: 'Марковская цепь — процесс, где будущее состояние зависит только от текущего; пример: переход пользователя между экранами приложения.',
    tags: ['markov']
  },
  {
    id: 40,
    category: 'Теория вероятностей',
    difficulty: 'hard',
    question: 'Опишите биномиальное распределение и его параметры.',
    answer: 'Моделирует число успехов в n независимых испытаниях с вероятностью успеха p; параметры n и p задают среднее np и дисперсию np(1-p).',
    tags: ['distributions']
  },
  {
    id: 41,
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Когда применимо распределение Пуассона?',
    answer: 'Для подсчёта редких событий на фиксированном интервале при независимых событиях и малой вероятности, но большом числе попыток.',
    tags: ['poisson']
  },
  {
    id: 42,
    category: 'Теория вероятностей',
    difficulty: 'hard',
    question: 'Что такое центральная предельная теорема?',
    answer: 'Сумма большого числа независимых одинаково распределённых величин стремится к нормальному распределению независимо от исходного.',
    tags: ['clt']
  },
  {
    id: 43,
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как вычислить ковариацию и что она показывает?',
    answer: 'Cov(X,Y) = E[(X - E[X])(Y - E[Y])], положительное значение говорит о совместном росте, отрицательное — о противоположных тенденциях.',
    tags: ['covariance']
  },
  {
    id: 44,
    category: 'Теория вероятностей',
    difficulty: 'hard',
    question: 'Что такое функция распределения и её свойства?',
    answer: 'F(x) = P(X ≤ x) монотонна, непрерывна справа и стремится к 0 и 1 на границах.',
    tags: ['cdf']
  },
  {
    id: 45,
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как посчитать вероятность хотя бы одного события из нескольких?',
    answer: 'Используйте принцип включений-исключений: сумма вероятностей минус вероятность пересечений.',
    tags: ['inclusion-exclusion']
  },
  {
    id: 46,
    category: 'Статистика',
    difficulty: 'easy',
    question: 'Чем отличаются выборка и генеральная совокупность?',
    answer: 'Выборка — подмножество наблюдений, генеральная совокупность — все возможные наблюдения, параметры оценок относятся к популяции.',
    tags: ['sampling']
  },
  {
    id: 47,
    category: 'Статистика',
    difficulty: 'easy',
    question: 'Что такое медиана и чем она полезна?',
    answer: 'Медиана — центральное значение упорядоченных данных, устойчива к выбросам в отличие от среднего.',
    tags: ['central-tendency']
  },
  {
    id: 48,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Поясните доверительный интервал средней.',
    answer: 'Доверительный интервал показывает диапазон, в котором с заданной вероятностью лежит истинное среднее, строится как mean ± z * (σ/√n).',
    tags: ['confidence-intervals']
  },
  {
    id: 49,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое p-value и как его интерпретировать?',
    answer: 'p-value — вероятность получить столь экстремальное значение статистики при условии верности нулевой гипотезы; маленькое значение даёт основания отвергнуть H0.',
    tags: ['hypothesis-testing']
  },
  {
    id: 50,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Разница между типами ошибок I и II рода?',
    answer: 'Ошибка I рода — отклонение истинной H0, ошибка II рода — непринятие ложной H0; альфа и бета характеризуют их вероятности.',
    tags: ['errors']
  },
  {
    id: 51,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как проверить нормальность распределения?',
    answer: 'Используйте QQ-плот, тесты Шапиро-Уилка, Колмогорова-Смирнова, анализ асимметрии и эксцесса.',
    tags: ['normality']
  },
  {
    id: 52,
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Когда применять критерий Манна-Уитни вместо t-теста?',
    answer: 'Когда гипотеза о равенстве средних неуместна: Манна–Уитни проверяет равенство функций распределения/медиан и устойчив к выбросам и неравным дисперсиям, поэтому его выбирают при небольших, ненормальных выборках.',
    tags: ['nonparametric']
  },
  {
    id: 53,
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Что такое бутстрэп и зачем он нужен?',
    answer: 'Бутстрэп — повторная выборка с возвращением для оценки распределения статистики, полезен при сложных показателях и неизвестной форме распределения.',
    tags: ['bootstrap']
  },
  {
    id: 54,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как рассчитать корреляцию Пирсона и когда она подходит?',
    answer: 'Корреляция Пирсона измеряет линейную связь между двумя переменными, подходит для количественных признаков с нормальной формой.',
    tags: ['correlation']
  },
  {
    id: 55,
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Чем ANOVA отличается от множества t-тестов?',
    answer: 'ANOVA сравнивает более двух групп одновременно, контролируя общий уровень значимости и требуя меньшего числа тестов.',
    tags: ['anova']
  },
  {
    id: 56,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое стандартная ошибка среднего?',
    answer: 'Стандартная ошибка = σ / √n, отражает разброс оценок среднего между выборками.',
    tags: ['standard-error']
  },
  {
    id: 57,
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Объясните множественную проверку гипотез и методы контроля FDR.',
    answer: 'При множественных тестах растёт вероятность ложных срабатываний; методы Benjamini-Hochberg или Bonferroni контролируют FDR/FWER.',
    tags: ['multiple-testing']
  },
  {
    id: 58,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что показывает плотность Kernel Density Estimate?',
    answer: 'KDE сглаживает гистограмму, оценивая непрерывную плотность по ядрам, задаваемым шириной полосы.',
    tags: ['kde']
  },
  {
    id: 59,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как вычислить доверительный интервал для пропорции?',
    answer: 'Например, через нормальную аппроксимацию: p̂ ± z * √(p̂(1 - p̂)/n) или точный интервал Клоппера-Пирсона.',
    tags: ['proportions']
  },
  {
    id: 60,
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Что такое байесовские интервалы достоверности?',
    answer: 'Это диапазон значений параметра с заданной апостериорной вероятностью, вычисляемый из апостериорного распределения.',
    tags: ['bayesian']
  },
  {
    id: 61,
    category: 'Визуализация',
    difficulty: 'easy',
    question: 'Когда удобнее использовать линейный график, а когда столбчатый?',
    answer: 'Линия отображает динамику во времени, столбцы сравнивают категориальные значения или состав.',
    tags: ['chart-choice']
  },
  {
    id: 62,
    category: 'Визуализация',
    difficulty: 'easy',
    question: 'Что такое data-ink ratio по Туфти?',
    answer: 'Это доля чернил, несущих данные, к общему количеству чернил; высокая доля означает минимализм и отсутствие мусора.',
    tags: ['best-practices']
  },
  {
    id: 63,
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Как выбрать палитру цветов для людей с дальтонизмом?',
    answer: 'Используйте палитры типа ColorBrewer colorblind safe (сине-оранжевые контрасты), избегайте красно-зелёных сочетаний.',
    tags: ['accessibility']
  },
  {
    id: 64,
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Какой график лучше показать распределение и плотность одновременно?',
    answer: 'Комбинированный violin plot, ridge plot или boxen plot показывают распределение и ключевые статистики.',
    tags: ['distributions']
  },
  {
    id: 65,
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Что такое small multiples и когда их применять?',
    answer: 'Это серия одинаковых графиков по категориям, помогает сравнивать несколько сегментов без перегрузки одного графика.',
    tags: ['storytelling']
  },
  {
    id: 66,
    category: 'Визуализация',
    difficulty: 'hard',
    question: 'Как оценить эффективность визуализации A/B тестом?',
    answer: 'Определите целевое действие (например, клики), случайно распределите пользователей между версиями дашборда, измерьте метрику и примените статистический тест.',
    tags: ['experimentation']
  },
  {
    id: 67,
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Когда стоит использовать логарифмическую шкалу?',
    answer: 'При показе данных, меняющихся на порядки, или при мультипликативном росте для лучшего сравнения относительных изменений.',
    tags: ['scales']
  },
  {
    id: 68,
    category: 'Визуализация',
    difficulty: 'easy',
    question: 'Чем плоха 3D диаграмма для 2D данных?',
    answer: 'Искажается восприятие, сложно читать значения и сравнивать области, добавляется визуальный шум без пользы.',
    tags: ['anti-patterns']
  },
  {
    id: 69,
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Что такое визуальная иерархия и как её создавать?',
    answer: 'Иерархия направляет внимание с помощью цвета, размера, положения, whitespace; помогает пользователю понимать приоритеты.',
    tags: ['design']
  },
  {
    id: 70,
    category: 'Визуализация',
    difficulty: 'hard',
    question: 'Как оценить читабельность дашборда на мобильных устройствах?',
    answer: 'Протестировать адаптивность сетки, размер текста, интерактивность и время загрузки, использовать user testing или встроенные симуляторы.',
    tags: ['responsive']
  },
  {
    id: 71,
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Когда диаграмма Санки оправдана?',
    answer: 'Для отображения потоков между состояниями или этапами, когда важен объём переходов и сохранение суммарных значений.',
    tags: ['flows']
  },
  {
    id: 72,
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Как организовать storytelling в презентации аналитика?',
    answer: 'Используйте структуру hook → context → insight → action, минимизируйте текст и подчёркивайте ключевое сообщение визуально.',
    tags: ['storytelling']
  },
  {
    id: 73,
    category: 'ML',
    difficulty: 'easy',
    question: 'Что такое переобучение и как его обнаружить?',
    answer: 'Переобучение — высокая точность на обучении и низкая на валидации; ищите большой разрыв метрик, используйте кросс-валидацию.',
    tags: ['overfitting']
  },
  {
    id: 74,
    category: 'ML',
    difficulty: 'medium',
    question: 'Какие способы регуляризации знаете?',
    answer: 'L1/L2, dropout, ранняя остановка, data augmentation, ограничение глубины деревьев.',
    tags: ['regularization']
  },
  {
    id: 75,
    category: 'ML',
    difficulty: 'medium',
    question: 'Объясните разницу между precision и recall.',
    answer: 'Precision = TP/(TP+FP) показывает точность положительных предсказаний, recall = TP/(TP+FN) показывает полноту нахождения положительных объектов.',
    tags: ['classification']
  },
  {
    id: 76,
    category: 'ML',
    difficulty: 'medium',
    question: 'Когда ROC кривая лучше PR-кривой и наоборот?',
    answer: 'ROC лучше при сбалансированных классах, PR полезнее при сильном дисбалансе, так как фокусируется на положительном классе.',
    tags: ['evaluation']
  },
  {
    id: 77,
    category: 'ML',
    difficulty: 'medium',
    question: 'Что такое градиентный бустинг?',
    answer: 'Итеративное построение слабых моделей, каждая корректирует ошибки предыдущей, оптимизируя функцию потерь.',
    tags: ['ensembles']
  },
  {
    id: 78,
    category: 'ML',
    difficulty: 'hard',
    question: 'Как интерпретировать Shapley values?',
    answer: 'SHAP распределяет вклад признаков в предсказание, учитывая все возможные подмножества, требуя вычислительных приближений.',
    tags: ['interpretability']
  },
  {
    id: 79,
    category: 'ML',
    difficulty: 'medium',
    question: 'Когда использовать kNN?',
    answer: 'Когда данные имеют понятную метрику расстояния, размеры относительно малы и важна интерпретируемость; чувствителен к масштабу признаков.',
    tags: ['knn']
  },
  {
    id: 80,
    category: 'ML',
    difficulty: 'medium',
    question: 'Как оценить важность признаков в деревьях решений?',
    answer: 'Используют уменьшение impurity (Gini/entropy), permutation importance или SHAP для точного вклада.',
    tags: ['feature-importance']
  },
  {
    id: 81,
    category: 'ML',
    difficulty: 'hard',
    question: 'Что такое утечка признаков и как её избежать?',
    answer: 'Утечка — когда модель использует информацию из будущего/целевого признака; избегают строгим разделением данных, отсечением пост-целевых переменных и контролем feature engineering.',
    tags: ['data-leakage']
  },
  {
    id: 82,
    category: 'ML',
    difficulty: 'medium',
    question: 'Как работает кросс-валидация и зачем она нужна?',
    answer: 'Данные делят на k фолдов, модель обучают k раз, каждый раз оставляя один фолд под валидацию; сглаживает оценку обобщающей способности.',
    tags: ['validation']
  },
  {
    id: 83,
    category: 'ML',
    difficulty: 'hard',
    question: 'Опишите разницу между bagging и boosting.',
    answer: 'Bagging обучает модели параллельно на бутстрэпе и усредняет предсказания, boosting обучает последовательно, исправляя ошибки предыдущих.',
    tags: ['ensembles']
  },
  {
    id: 84,
    category: 'ML',
    difficulty: 'medium',
    question: 'Когда линейная регрессия неприемлема?',
    answer: 'При нелинейных зависимостях, мультиколлинеарности, гетероскедастичности или не-нормальности остатков без трансформаций.',
    tags: ['regression']
  },
  {
    id: 85,
    category: 'ML',
    difficulty: 'medium',
    question: 'Как выбрать число кластеров в k-means?',
    answer: 'Используйте метод локтя, силуэтный коэффициент, оценку информационных критериев или знание предметной области.',
    tags: ['clustering']
  },
  {
    id: 86,
    category: 'ML',
    difficulty: 'hard',
    question: 'Зачем стандартизировать признаки перед PCA?',
    answer: 'PCA чувствителен к масштабу, стандартизация предотвращает доминирование признаков с большой дисперсией.',
    tags: ['pca']
  },
  {
    id: 87,
    category: 'ML',
    difficulty: 'medium',
    question: 'Что такое baseline модель?',
    answer: 'Простая модель (например, среднее или частота класса), служащая отправной точкой для оценки улучшений.',
    tags: ['process']
  },
  {
    id: 88,
    category: 'ML',
    difficulty: 'hard',
    question: 'Как контролировать качество модели после выката?',
    answer: 'Настроить мониторинг дрейфа данных, метрик качества, алерты на деградацию и периодические повторные обучения.',
    tags: ['mlops']
  },
  {
    id: 89,
    category: 'ML',
    difficulty: 'medium',
    question: 'Когда логистическая регрессия предпочтительнее дерева решений?',
    answer: 'При линейной разделимости, необходимости интерпретации коэффициентов и устойчивости к шуму.',
    tags: ['model-choice']
  },
  {
    id: 90,
    category: 'ML',
    difficulty: 'medium',
    question: 'Как бороться с дисбалансом классов?',
    answer: 'Используйте взвешивание, oversampling (SMOTE), undersampling, корректные метрики и пороги.',
    tags: ['imbalanced']
  },
  {
    id: 91,
    category: 'Продуктовое мышление',
    difficulty: 'easy',
    question: 'Что такое north star metric?',
    answer: 'Ключевая метрика, максимально отражающая ценность продукта для пользователя и бизнеса, вокруг неё выстраивают фокус команды.',
    tags: ['metrics']
  },
  {
    id: 92,
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как определить основные сегменты пользователей?',
    answer: 'Анализируйте поведение, ценность и контекст использования, применяйте кластеризацию, интервью и RFM-сегментацию.',
    tags: ['segmentation']
  },
  {
    id: 93,
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Что важно учесть при постановке эксперимента на продуктовой метрике?',
    answer: 'Формулировка гипотезы, выбор метрик, расчёт выборки, сегментация, исключение коллизий и мониторинг статуса.',
    tags: ['experimentation']
  },
  {
    id: 94,
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как оценить влияние фичи без A/B теста?',
    answer: 'Используйте quasi-experimental дизайны: откатные тесты, синтетические контрольные группы, difference-in-differences.',
    tags: ['causality']
  },
  {
    id: 95,
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как выбрать метрики активации, ретенции и монетизации?',
    answer: 'Исходите из пользовательского пути: активация — первый ключевой успех, ретенция — возврат в период, монетизация — доход на пользователя.',
    tags: ['pirate-metrics']
  },
  {
    id: 96,
    category: 'Продуктовое мышление',
    difficulty: 'hard',
    question: 'Опишите фреймворк HEART от Google.',
    answer: 'HEART = Happiness, Engagement, Adoption, Retention, Task success; помогает структурировать продуктовые метрики и сигналы UX.',
    tags: ['frameworks']
  },
  {
    id: 97,
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как приоритизировать backlog аналитических задач?',
    answer: 'Используйте RICE/ICE, учитывайте влияние на метрики, затраты ресурсов и срочность, согласуйте с владельцами продукта.',
    tags: ['prioritization']
  },
  {
    id: 98,
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как сформулировать аналитическую рекомендацию для продукта?',
    answer: 'Привяжите инсайт к бизнес-цели, предложите действие, оцените ожидаемый эффект и риски, добавьте способ измерения результата.',
    tags: ['communication']
  },
  {
    id: 99,
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Что такое JTBD и как аналитик может помочь его сформулировать?',
    answer: 'Jobs To Be Done описывает задачу пользователя; аналитик исследует данные поведения и качественные инсайты для выявления нужд.',
    tags: ['research']
  },
  {
    id: 100,
    category: 'Продуктовое мышление',
    difficulty: 'hard',
    question: 'Как измерить продуктово-аналитическую инициативу с помощью counter metrics?',
    answer: 'Определите побочные метрики, которые не должны ухудшиться (например, NPS, churn), мониторьте их параллельно с целевой метрикой.',
    tags: ['counter-metrics']
  },
  {
    id: 101,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как писать запросы, устойчивые к изменению часовых поясов?',
    answer: 'Храните время в UTC, приводите к локальной зоне только на уровне отображения и используйте функции AT TIME ZONE.',
    tags: ['timezones']
  },
  {
    id: 102,
    category: 'Python',
    difficulty: 'medium',
    question: 'Как распараллелить вычислительные задачи без влияния GIL?',
    answer: 'Используйте multiprocessing, joblib или NumPy/SciPy, где тяжёлые части реализованы на C и не блокируются GIL.',
    tags: ['parallelism']
  },
  {
    id: 103,
    category: 'ML',
    difficulty: 'hard',
    question: 'Какие подходы к feature store рекомендуете для аналитических команд?',
    answer: 'Централизованный репозиторий признаков с декларативными трансформациями, версионированием и сервингом онлайн/офлайн, например Feast или dbt + материализованные представления.',
    tags: ['mlops']
  },
  {
    id: 104,
    category: 'Визуализация',
    difficulty: 'hard',
    question: 'Как управлять динамическим диапазоном значений на heatmap?',
    answer: 'Примените нормализацию, нелинейные шкалы, trim экстремумов или двустороннюю палитру для отклонений.',
    tags: ['heatmap']
  },
  {
    id: 105,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое uplift-моделирование?',
    answer: 'Uplift-модели прогнозируют разницу эффекта вмешательства на пользователя, используя treatment и control для поиска тех, кто реагирует лучше.',
    tags: ['causality']
  },
  {
    id: 206,
    category: 'SQL',
    difficulty: 'hard',
    question: 'Когда стоит секционировать таблицу и как выбрать ключ секционирования?',
    answer: 'Секционирование полезно при диапазонных запросах и больших объёмах: выбирайте ключ по полю, которое чаще всего используется в фильтрах/TTL (например, дате), чтобы движок считывал только нужные партиции и было проще архивировать старые сегменты.',
    tags: ['partitioning', 'architecture']
  },
  {
    id: 207,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как организовать инкрементальное обновление материализованного представления?',
    answer: 'Храните отметку max(updated_at) предыдущего обновления, загружайте только свежие записи, применяйте MERGE/UPSERT во временную таблицу и выполняйте REFRESH CONCURRENTLY или атомарное переключение, чтобы пользователь видел консистентные данные.',
    tags: ['materialized-views', 'etl']
  },
  {
    id: 208,
    category: 'Python',
    difficulty: 'medium',
    question: 'Когда стоит использовать dataclass вместо NamedTuple?',
    answer: 'Dataclass даёт изменяемые объекты, поддержку default factory, post-init и методов. NamedTuple легковесен, но неизменяем и хуже расширяется. Если нужна логика, валидация или методы — берите dataclass.',
    tags: ['dataclasses']
  },
  {
    id: 209,
    category: 'Python',
    difficulty: 'hard',
    question: 'Чем отличается asyncio от multiprocessing при построении ETL-конвейера?',
    answer: 'asyncio раскрывает параллелизм I/O в одном процессе (API, базы), multiprocessing запускает отдельные процессы и не упирается в GIL для CPU-bound шагов. В ETL их часто комбинируют: асинхронные загрузки плюс процессинг в пулах.',
    tags: ['async', 'parallelism']
  },
  {
    id: 210,
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Сформулируйте закон полного математического ожидания.',
    answer: 'E[X] = Σ E[X | B_i] P(B_i), где события B_i образуют полную систему. Закон позволяет разложить сложную величину на ожидания по сегментам.',
    tags: ['expectation']
  },
  {
    id: 211,
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Что такое разложение дисперсии (law of total variance) и чем оно полезно в экспериментах?',
    answer: 'Var(X) = E[Var(X|Z)] + Var(E[X|Z]); формула разделяет шум внутри сегментов и между ними. В экспериментах помогает понять вклад стратификации и выбрать ковариаты.',
    tags: ['variance', 'experiments']
  },
  {
    id: 212,
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Как корректно проводить последовательный анализ результатов эксперимента?',
    answer: 'Используйте group sequential design или α-spending, чтобы делить бюджет значимости между промежуточными проверками (Pocock, O’Brien-Fleming) и не завышать вероятность ложного вывода.',
    tags: ['sequential-testing']
  },
  {
    id: 213,
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Как построить сториборд аналитической презентации?',
    answer: 'Определи главный тезис, разбей рассказ на сцены (контекст → проблема → инсайт → действие) и под каждую сцену подготовь минимальный необходимый график с call-to-action. Так слушатель не теряется в данных.',
    tags: ['storytelling']
  },
  {
    id: 214,
    category: 'Визуализация',
    difficulty: 'easy',
    question: 'Какие аннотации помогают быстро считывать инсайт с графика?',
    answer: 'Стрелки и подписи ключевых точек, подсветка области и бейджи со сводными значениями направляют взгляд пользователя и усиливают сообщение.',
    tags: ['annotation']
  },
  {
    id: 215,
    category: 'ML',
    difficulty: 'medium',
    question: 'Кому критично масштабирование признаков и чем отличаются StandardScaler и MinMaxScaler?',
    answer: 'Масштаб нужен методам, чувствительным к расстояниям/регуляризации (kNN, логистическая регрессия, SVM). StandardScaler делает нулевое среднее и единичное σ, MinMaxScaler сжимает диапазон к [0,1], что удобно, если модель чувствительна к границам.',
    tags: ['feature-engineering']
  },
  {
    id: 216,
    category: 'ML',
    difficulty: 'medium',
    question: 'Как определить периодичность переобучения продовой модели?',
    answer: 'Комбинируйте регулярные перезапуски (например, еженедельно) с мониторингом дрейфа данных и деградации онлайновых метрик. Срабатывание алерта или выход за SLA вызывает внеплановое переобучение.',
    tags: ['mlops']
  },
  {
    id: 217,
    category: 'ML',
    difficulty: 'hard',
    question: 'Как обнаружить дрейф признаков в проде?',
    answer: 'Сравнивайте обучающие и текущие распределения (PSI, KL-divergence, тест Колмогорова-Смирнова, χ² для категорий) и ставьте алерты на средние/квантили. Раннее обнаружение предотвращает деградацию метрик.',
    tags: ['monitoring', 'drift']
  },
  {
    id: 218,
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Что такое guardrail-метрики и как их выбирать?',
    answer: 'Это показатели-ограничители (NPS, churn, SLA), которые не должны ухудшиться при эксперименте. Выбирают те, что отражают ключевые риски для пользователя или бизнеса, и мониторят их параллельно с целевой метрикой.',
    tags: ['metrics']
  },
  {
    id: 219,
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как спроектировать трекинг событий перед запуском новой фичи?',
    answer: 'Опишите user journey, определите ключевые состояния, составьте tracking plan (event_name + обязательные параметры) и согласуйте его с разработчиками/QA, добавив автоматические проверки в pipeline.',
    tags: ['analytics']
  },
  {
    id: 220,
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Зачем строить дерево метрик (metrics tree) для North Star?',
    answer: 'Дерево раскладывает North Star Metric на управляемые подметрики, показывает владельцев и рычаги. Так команды видят, как их локальные улучшения влияют на глобальную цель.',
    tags: ['metrics']
  },
  {
    id: 221,
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как реализовать data contract между источником и аналитической витриной?',
    answer: 'Определите схему и SLA, добавьте автоматические тесты (dbt, Great Expectations) на not null, уникальность и диапазоны. При нарушении контракт сигнализирует и блокирует загрузку, чтобы источник исправил данные.',
    tags: ['data-quality', 'governance']
  },
  {
    id: 222,
    category: 'Python',
    difficulty: 'hard',
    question: 'Когда полезно использовать typing.Protocol?',
    answer: 'Protocol описывает структурный тип: достаточно реализовать нужные методы, а не наследоваться. Это облегчает тестирование и внедрение зависимостей, когда важны возможности объекта, а не его класс.',
    tags: ['typing']
  },
  {
    id: 223,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое CUPED и как он ускоряет эксперименты?',
    answer: 'CUPED вводит ковариату (pre-experiment metric) и строит скорректированную метрику Y_adj = Y - θ (X - mean(X)), уменьшая дисперсию и требуемый размер выборки. Эффективен, если X хорошо коррелирует с целевой метрикой.',
    tags: ['experiments', 'variance-reduction']
  },
  {
    id: 224,
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Что такое дизайн-токены в BI-системах и зачем они нужны?',
    answer: 'Дизайн-токены — централизованные значения цветов, шрифтов и отступов. Используя их в темах Looker/Power BI/Tableau, команда поддерживает единый стиль и может массово обновлять визуализацию.',
    tags: ['design-systems']
  },
  {
    id: 225,
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое Sample Ratio Mismatch и как его обнаружить?',
    answer: 'SRM — несоответствие фактического распределения трафика плану (например, 60/40 вместо 50/50) из-за багов рандомизации или фильтров. Его выявляют мониторингом долей и χ²-тестом; при SRM эксперимент признают недействительным.',
    tags: ['experiments', 'quality']
  }
];

const MCQ_QUESTIONS = [
  {
    id: 106,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'easy',
    question: 'Какой оператор вернёт только уникальные значения столбца city?',
    options: [
      'SELECT city FROM users;',
      'SELECT DISTINCT city FROM users;',
      'SELECT UNIQUE city FROM users;',
      'SELECT city GROUP BY city FROM users;'
    ],
    correctOptionIndex: 1,
    answer: 'DISTINCT удаляет дубликаты и оставляет уникальные комбинации указанных столбцов.',
    tags: ['basics', 'select']
  },
  {
    id: 107,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как правильно отфильтровать агрегированные группы по условию?',
    options: [
      'Использовать WHERE после GROUP BY',
      'Применить HAVING после GROUP BY',
      'Применить WINDOW FILTER',
      'Фильтровать подзапрос до агрегации'
    ],
    correctOptionIndex: 1,
    answer: 'HAVING применяется к уже агрегированным группам и поддерживает агрегатные функции.',
    tags: ['aggregation']
  },
  {
    id: 108,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как выбрать последнюю запись по дате для каждого пользователя?',
    options: [
      'Использовать MAX(date) и GROUP BY user_id без полей записи',
      'ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY date DESC) = 1',
      'ORDER BY date DESC LIMIT 1',
      'SELECT DISTINCT ON (user_id) ORDER BY date ASC'
    ],
    correctOptionIndex: 1,
    answer: 'ROW_NUMBER() позволяет пронумеровать строки по пользователю и взять первую по дате.',
    tags: ['window-functions']
  },
  {
    id: 109,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'easy',
    question: 'Какой JOIN вернёт все строки из левой таблицы независимо от совпадений справа?',
    options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN'],
    correctOptionIndex: 1,
    answer: 'LEFT JOIN сохраняет все строки левой таблицы и дополняет NULL при отсутствии пары.',
    tags: ['joins']
  },
  {
    id: 110,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какой индекс поможет ускорить поиск по условию `WHERE status = \'paid\' AND created_at BETWEEN ...`?',
    options: [
      'Индекс только по created_at',
      'Составной индекс (status, created_at)',
      'Полнотекстовый индекс',
      'Хеш-индекс по created_at'
    ],
    correctOptionIndex: 1,
    answer: 'Селективный столбец status в начале составного индекса улучшает фильтрацию по обоим полям.',
    tags: ['indexes', 'performance']
  },
  {
    id: 111,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'easy',
    question: 'Что делает оператор UNION ALL?',
    options: [
      'Склеивает выборки и удаляет дубликаты',
      'Склеивает выборки и сохраняет дубликаты',
      'Находит пересечение двух наборов',
      'Сравнивает схемы таблиц'
    ],
    correctOptionIndex: 1,
    answer: 'UNION ALL не удаляет повторяющиеся строки, что быстрее и полезно для суммирования данных.',
    tags: ['set-operations']
  },
  {
    id: 112,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как вычислить долю заказа пользователя от общей выручки?',
    options: [
      'SUM(amount) / COUNT(*)',
      'amount / SUM(amount) OVER ()',
      'AVG(amount) OVER ()',
      'SUM(amount) OVER (PARTITION BY user_id)'
    ],
    correctOptionIndex: 1,
    answer: 'Оконная сумма без PARTITION позволяет делить значение строки на общую выручку.',
    tags: ['window-functions', 'metrics']
  },
  {
    id: 113,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какой оператор удаляет строки, присутствующие в обеих выборках?',
    options: ['UNION', 'INTERSECT', 'EXCEPT', 'MERGE'],
    correctOptionIndex: 2,
    answer: 'EXCEPT возвращает строки первой выборки, которых нет во второй.',
    tags: ['set-operations']
  },
  {
    id: 114,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'hard',
    question: 'Как безопасно обновить дубликаты, оставив одну запись?',
    options: [
      'DELETE FROM t WHERE ctid NOT IN (SELECT MIN(ctid) FROM t)',
      'DELETE с подзапросом по ROW_NUMBER() > 1',
      'TRUNCATE и вставить заново',
      'Сначала UPDATE, потом DELETE без условий'
    ],
    correctOptionIndex: 1,
    answer: 'Нумерация дубликатов через ROW_NUMBER() > 1 позволяет удалить «лишние» строки контролируемо.',
    tags: ['data-quality']
  },
  {
    id: 115,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'easy',
    question: 'Как заменить NULL на значение по умолчанию в ANSI SQL?',
    options: ['IFNULL(col, 0)', 'NVL(col, 0)', 'COALESCE(col, 0)', 'CASE WHEN col = NULL THEN 0 END'],
    correctOptionIndex: 2,
    answer: 'COALESCE переносим между СУБД и возвращает первый ненулевой аргумент.',
    tags: ['nulls']
  },
  {
    id: 116,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как посчитать скользящую 3-дневную сумму без пропусков дат?',
    options: [
      'Использовать SUM(amount) OVER (ORDER BY date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)',
      'GROUP BY date',
      'COUNT(DISTINCT user_id)',
      'Использовать CROSS JOIN дат'
    ],
    correctOptionIndex: 0,
    answer: 'Оконный фрейм ROWS BETWEEN 2 PRECEDING AND CURRENT ROW создаёт окно из трёх дней подряд.',
    tags: ['window-functions', 'rolling']
  },
  {
    id: 117,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какая конструкция удобнее всего для пошаговых преобразований и повторного использования подзапросов?',
    options: ['Подзапрос в SELECT', 'WITH (CTE)', 'VIEW', 'TEMP TABLE'],
    correctOptionIndex: 1,
    answer: 'CTE делает запрос читаемым и позволяет переиспользовать промежуточные результаты в одном запросе.',
    tags: ['cte']
  },
  {
    id: 118,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'easy',
    question: 'Как быстро оценить план выполнения запроса в PostgreSQL?',
    options: ['DESCRIBE', 'EXPLAIN', 'PROFILE', 'SHOW PLAN'],
    correctOptionIndex: 1,
    answer: 'EXPLAIN показывает план, а EXPLAIN ANALYZE фактическое время и затраты.',
    tags: ['performance']
  },
  {
    id: 119,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как объединить данные из JSONB-столбца с реляционными полями?',
    options: [
      'Использовать ->> для извлечения и приводить тип',
      'Только через внешнее приложение',
      'Сначала экспортировать JSON на клиент',
      'Использовать единственный ключ PRIMARY KEY'
    ],
    correctOptionIndex: 0,
    answer: 'Оператор ->> вытягивает текстовое значение из JSONB, что позволяет фильтровать и джойнить в SQL.',
    tags: ['json']
  },
  {
    id: 120,
    type: 'mcq',
    category: 'SQL',
    difficulty: 'hard',
    question: 'Какой уровень изоляции транзакций максимально защищает от фантомных чтений, но дороже всего?',
    options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'],
    correctOptionIndex: 3,
    answer: 'SERIALIZABLE имитирует последовательное выполнение транзакций и предотвращает фантомы за счёт блокировок/вёрсионирования.',
    tags: ['transactions']
  },
  {
    id: 121,
    type: 'mcq',
    category: 'Python',
    difficulty: 'easy',
    question: 'Какой тип коллекции в Python неизменяемый?',
    options: ['list', 'dict', 'tuple', 'set'],
    correctOptionIndex: 2,
    answer: 'Кортеж tuple является неизменяемым и может использоваться в качестве ключа словаря.',
    tags: ['basics']
  },
  {
    id: 122,
    type: 'mcq',
    category: 'Python',
    difficulty: 'medium',
    question: 'Что вернёт выражение `[x * 2 for x in range(3)]`?',
    options: ['[1, 2, 3]', '[0, 2, 4]', '[2, 4, 6]', 'range(0, 6, 2)'],
    correctOptionIndex: 1,
    answer: 'range(3) даёт 0,1,2, умножение на 2 вернёт [0, 2, 4].',
    tags: ['comprehension']
  },
  {
    id: 123,
    type: 'mcq',
    category: 'Python',
    difficulty: 'medium',
    question: 'Какой модуль использовать для сериализации объекта Python в JSON?',
    options: ['pickle', 'json', 'marshal', 'csv'],
    correctOptionIndex: 1,
    answer: 'Стандартный модуль json преобразует словари и списки в JSON-строку.',
    tags: ['io']
  },
  {
    id: 124,
    type: 'mcq',
    category: 'Python',
    difficulty: 'hard',
    question: 'Как избежать дублирования кода при работе с контекстами (открытие/закрытие) нестандартных ресурсов?',
    options: [
      'Использовать try/except/finally везде',
      'Создать менеджер контекста через contextlib.contextmanager',
      'Просто отключить проверки',
      'Оборачивать в while True'
    ],
    correctOptionIndex: 1,
    answer: 'contextlib.contextmanager позволяет определить enter/exit и переиспользовать через with.',
    tags: ['context-manager']
  },
  {
    id: 125,
    type: 'mcq',
    category: 'Python',
    difficulty: 'medium',
    question: 'Как объединить два DataFrame по столбцам user_id и date в pandas?',
    options: [
      'df1 + df2',
      'pd.merge(df1, df2, on=[\'user_id\', \'date\'], how=\'inner\')',
      'df1.append(df2)',
      'df1.join(df2, how=\'outer\')'
    ],
    correctOptionIndex: 1,
    answer: 'pd.merge с перечислением ключей объединит таблицы по совпадающим user_id и date.',
    tags: ['pandas', 'joins']
  },
  {
    id: 126,
    type: 'mcq',
    category: 'Python',
    difficulty: 'easy',
    question: 'Как проверить, содержится ли ключ в словаре без выброса исключения?',
    options: ['dict.has(key)', 'key in my_dict', 'my_dict.key', 'my_dict.get(key) == Error'],
    correctOptionIndex: 1,
    answer: 'Оператор `key in my_dict` проверяет наличие ключа по хеш-таблице.',
    tags: ['dict']
  },
  {
    id: 127,
    type: 'mcq',
    category: 'Python',
    difficulty: 'medium',
    question: 'Как вычислить среднее значение столбца в pandas без учёта NaN?',
    options: [
      'df.col.mean(skipna=True)',
      'df.col.mean(skipna=False)',
      'np.mean(df.col, ignore_nan=True)',
      'df.col.sum() / len(df.col)'
    ],
    correctOptionIndex: 0,
    answer: 'По умолчанию mean пропускает NaN, но аргумент skipna=True явно фиксирует поведение.',
    tags: ['pandas', 'statistics']
  },
  {
    id: 128,
    type: 'mcq',
    category: 'Python',
    difficulty: 'medium',
    question: 'Что делает выражение `lambda x: x**2`?',
    options: [
      'Определяет именованную функцию',
      'Создаёт анонимную функцию, возвращающую квадрат x',
      'Создаёт генератор',
      'Возводит x в квадрат сразу же'
    ],
    correctOptionIndex: 1,
    answer: 'Lambda создаёт функцию без имени, которую можно передавать в map/filter.',
    tags: ['functions']
  },
  {
    id: 129,
    type: 'mcq',
    category: 'Python',
    difficulty: 'hard',
    question: 'Какой способ распараллеливания обойдёт GIL для CPU-bound задач?',
    options: [
      'threading.Thread',
      'asyncio.gather',
      'multiprocessing.Pool',
      'time.sleep'
    ],
    correctOptionIndex: 2,
    answer: 'multiprocessing запускает отдельные процессы и не делит GIL.',
    tags: ['parallelism']
  },
  {
    id: 130,
    type: 'mcq',
    category: 'Python',
    difficulty: 'easy',
    question: 'Какой метод применяют для удаления дубликатов в pandas?',
    options: [
      'df.remove_duplicates()',
      'df.drop_duplicates()',
      'df.delete()',
      'df.unique()'
    ],
    correctOptionIndex: 1,
    answer: 'drop_duplicates очищает DataFrame по всем столбцам или по subset.',
    tags: ['pandas', 'data-cleaning']
  },
  {
    id: 131,
    type: 'mcq',
    category: 'Python',
    difficulty: 'medium',
    question: 'Чем отличается loc от iloc в pandas?',
    options: [
      'loc — по позициям, iloc — по меткам',
      'loc — по меткам, iloc — по позициям',
      'loc удаляет строки',
      'iloc работает только с колонками'
    ],
    correctOptionIndex: 1,
    answer: 'loc принимает метки индекса/колонок, iloc — целочисленные позиции.',
    tags: ['pandas', 'indexing']
  },
  {
    id: 132,
    type: 'mcq',
    category: 'Python',
    difficulty: 'medium',
    question: 'Как зафиксировать версию зависимостей для проекта?',
    options: [
      'pip freeze > requirements.txt',
      'pip install --lock',
      'pip save packages',
      'python -m lock'
    ],
    correctOptionIndex: 0,
    answer: 'pip freeze выписывает фактические версии установленных пакетов.',
    tags: ['tooling']
  },
  {
    id: 133,
    type: 'mcq',
    category: 'Python',
    difficulty: 'hard',
    question: 'Как уменьшить использование памяти при обработке CSV в pandas?',
    options: [
      'Использовать dtype=object для всех столбцов',
      'Указать dtypes и использовать chunksize',
      'Загружать всё в список',
      'Отключить GC'
    ],
    correctOptionIndex: 1,
    answer: 'Чёткие типы и потоковая загрузка chunk-ами сокращают RAM footprint.',
    tags: ['performance', 'pandas']
  },
  {
    id: 134,
    type: 'mcq',
    category: 'Python',
    difficulty: 'medium',
    question: 'Какой оператор безопасно открывает файл и закрывает его автоматически?',
    options: [
      'open() + close()',
      'with open(...) as f:',
      'read_file()',
      'file.open(auto=True)'
    ],
    correctOptionIndex: 1,
    answer: 'with open(...) гарантирует вызов close даже при исключениях.',
    tags: ['files']
  },
  {
    id: 135,
    type: 'mcq',
    category: 'Python',
    difficulty: 'medium',
    question: 'Какой тип анотаций позволяет подсказать IDE структуру DataFrame?',
    options: ['typing.Dict', 'typing.Any', 'pandas-stubs + TypedDict', 'collections.Counter'],
    correctOptionIndex: 2,
    answer: 'TypedDict и pandas-stubs дают IDE информацию о доступных колонках и методах.',
    tags: ['typing']
  },
  {
    id: 136,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'easy',
    question: 'Сумма вероятностей всех возможных исходов дискретной случайной величины равна…',
    options: ['0', '1', 'зависит от распределения', 'бесконечности'],
    correctOptionIndex: 1,
    answer: 'По определению вероятность полного события равна 1.',
    tags: ['basics']
  },
  {
    id: 137,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как найти вероятность пересечения независимых событий A и B?',
    options: ['P(A) + P(B)', 'P(A) * P(B)', 'P(A) / P(B)', 'P(A|B)'],
    correctOptionIndex: 1,
    answer: 'Для независимых событий P(A ∩ B) = P(A)P(B).',
    tags: ['independence']
  },
  {
    id: 138,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Каков ожидаемый результат подбрасывания честной монеты 10 раз по числу орлов?',
    options: ['10', '5', '2', '0'],
    correctOptionIndex: 1,
    answer: 'Математическое ожидание биномиального распределения np = 10 * 0.5 = 5.',
    tags: ['binomial']
  },
  {
    id: 139,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Что выражает формула полной вероятности?',
    options: [
      'Сумму вероятностей несовместимых гипотез',
      'Вероятность как сумму P(A|B_i)P(B_i)',
      'Разность вероятностей A и B',
      'Произведение условных вероятностей'
    ],
    correctOptionIndex: 1,
    answer: 'P(A) = Σ P(A|B_i)P(B_i) при полном наборе событий B_i.',
    tags: ['total-probability']
  },
  {
    id: 140,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'hard',
    question: 'Какое распределение является пределом биномиального при малой p и большом n?',
    options: ['Нормальное', 'Пуассона', 'Экспоненциальное', 'Единичное'],
    correctOptionIndex: 1,
    answer: 'Распределение Пуассона аппроксимирует редкие события с параметром λ = np.',
    tags: ['poisson']
  },
  {
    id: 141,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Чему равна вероятность хотя бы одного успеха при независимых событиях?',
    options: [
      'Произведение вероятностей',
      '1 - P(нет успехов)',
      'P(A) / P(B)',
      'Сумма вероятностей всех событий'
    ],
    correctOptionIndex: 1,
    answer: 'P(хотя бы одно) = 1 - P(ни одного), удобно при множестве попыток.',
    tags: ['complements']
  },
  {
    id: 142,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как вычислить математическое ожидание непрерывной случайной величины?',
    options: [
      'Σ x_i * p_i',
      '∫ x f(x) dx',
      'Считать только моду',
      'Перемножить минимум и максимум'
    ],
    correctOptionIndex: 1,
    answer: 'Для непрерывной СВ ожидание вычисляется интегралом x f(x) по всей оси.',
    tags: ['expectation']
  },
  {
    id: 143,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'hard',
    question: 'Что означает Markov property?',
    options: [
      'Будущее зависит от всей истории',
      'Будущее зависит только от текущего состояния',
      'События независимы',
      'Вероятности равны'
    ],
    correctOptionIndex: 1,
    answer: 'Марковское свойство утверждает, что переход зависит только от текущего состояния.',
    tags: ['markov']
  },
  {
    id: 144,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как интерпретировать дисперсию случайной величины?',
    options: [
      'Среднее значение',
      'Средний квадрат отклонения от ожидания',
      'Максимальное значение',
      'Количество исходов'
    ],
    correctOptionIndex: 1,
    answer: 'Дисперсия показывает средний квадрат разницы между значением и математическим ожиданием.',
    tags: ['variance']
  },
  {
    id: 145,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'hard',
    question: 'Чему равна вероятность события A при условии события B?',
    options: [
      'P(A ∩ B) / P(B)',
      'P(A) + P(B)',
      'P(A) - P(B)',
      'P(A) * P(B)'
    ],
    correctOptionIndex: 0,
    answer: 'Условная вероятность P(A|B) = P(A ∩ B) / P(B).',
    tags: ['conditional-probability']
  },
  {
    id: 146,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Центральная предельная теорема утверждает, что…',
    options: [
      'Сумма СВ всегда равномерна',
      'При больших n нормируется к нормальному распределению',
      'Сумма СВ всегда биномиальна',
      'Нельзя использовать нормальное распределение'
    ],
    correctOptionIndex: 1,
    answer: 'Нормировка суммы независимых одинаково распределённых СВ стремится к нормальному распределению.',
    tags: ['clt']
  },
  {
    id: 147,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как посчитать ковариацию?',
    options: [
      'E[(X - E[X])(Y - E[Y])]',
      'E[X] * E[Y]',
      'E[X+Y]',
      'Var(X) + Var(Y)'
    ],
    correctOptionIndex: 0,
    answer: 'Ковариация измеряет совместное отклонение двух величин от их средних.',
    tags: ['covariance']
  },
  {
    id: 148,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Что описывает функция распределения F(x)?',
    options: [
      'P(X = x)',
      'P(X ≤ x)',
      'P(X ≥ x)',
      'Только плотность'
    ],
    correctOptionIndex: 1,
    answer: 'Функция распределения показывает вероятность того, что величина не превышает x.',
    tags: ['cdf']
  },
  {
    id: 149,
    type: 'mcq',
    category: 'Теория вероятностей',
    difficulty: 'hard',
    question: 'Для независимых событий A и B верно, что…',
    options: [
      'P(A|B) = P(A)',
      'P(A|B) = 0',
      'P(A|B) = P(B)',
      'P(A|B) = P(A) + P(B)'
    ],
    correctOptionIndex: 0,
    answer: 'Независимость означает, что знание B не меняет вероятность A.',
    tags: ['independence']
  },
  {
    id: 150,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'easy',
    question: 'Какой показатель устойчив к выбросам?',
    options: ['Среднее', 'Медиана', 'Стандартное отклонение', 'Сумма'],
    correctOptionIndex: 1,
    answer: 'Медиана зависит только от порядка наблюдений и стабильна к экстремальным значениям.',
    tags: ['robust']
  },
  {
    id: 151,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что показывает boxplot?',
    options: [
      'Только среднее',
      'Квартильный размах и выбросы',
      'Гистограмму плотности',
      'Тренд во времени'
    ],
    correctOptionIndex: 1,
    answer: 'Boxplot визуализирует медиану, квартильный ящик, усы и потенциальные выбросы.',
    tags: ['visualization']
  },
  {
    id: 152,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Какой критерий используют для проверки равенства средних двух нормальных выборок при неизвестных, но равных дисперсиях?',
    options: ['z-тест', 't-тест Стьюдента', 'χ² тест', 'Критерий Манна-Уитни'],
    correctOptionIndex: 1,
    answer: 't-тест Стьюдента предназначен для сравнений средних при неизвестных, предположительно равных дисперсиях.',
    tags: ['hypothesis-testing']
  },
  {
    id: 153,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое p-value?',
    options: [
      'Вероятность гипотезы',
      'Вероятность получить столь экстремальную статистику при верной H0',
      'Размер эффекта',
      'Априорная вероятность'
    ],
    correctOptionIndex: 1,
    answer: 'p-value измеряет редкость наблюдения при предположении, что нулевая гипотеза верна.',
    tags: ['hypothesis-testing']
  },
  {
    id: 154,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Как контролировать суммарную вероятность ложных срабатываний при множественных тестах?',
    options: [
      'Ничего не делать',
      'Применить поправку Бонферрони',
      'Увеличить p-value',
      'Сравнивать только медианы'
    ],
    correctOptionIndex: 1,
    answer: 'Поправка Бонферрони (или FDR) уменьшает вероятность ошибки I рода при множестве проверок.',
    tags: ['multiple-testing']
  },
  {
    id: 155,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Чем отличается доверительный интервал 95% от утверждения «с вероятностью 95% параметр лежит внутри» в частотной интерпретации?',
    options: [
      'Это одно и то же',
      'Интервал случайный, параметр фиксирован',
      'Параметр случайный',
      'Интервал всегда шире дисперсии'
    ],
    correctOptionIndex: 1,
    answer: 'В частотной трактовке интервал меняется от выборки к выборке, параметр фиксирован.',
    tags: ['confidence-intervals']
  },
  {
    id: 156,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как интерпретировать коэффициент корреляции Пирсона 0.8?',
    options: [
      'Сильная положительная линейная связь',
      'Отсутствие связи',
      'Сильная отрицательная связь',
      'Нелинейная связь'
    ],
    correctOptionIndex: 0,
    answer: '0.8 означает высокую положительную линейную зависимость признаков.',
    tags: ['correlation']
  },
  {
    id: 157,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Какой тест используют для проверки нормальности малых выборок?',
    options: ['Шапиро-Уилка', 'Краскела-Уоллиса', 't-тест', 'F-тест'],
    correctOptionIndex: 0,
    answer: 'Тест Шапиро-Уилка чувствителен к отклонениям от нормальности при n < 50.',
    tags: ['normality']
  },
  {
    id: 158,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое стандартная ошибка среднего?',
    options: [
      'Стандартное отклонение переменной',
      'SD / √n',
      'Среднеквадратичная ошибка регрессии',
      'Медиана ошибок'
    ],
    correctOptionIndex: 1,
    answer: 'SE показывает разброс оценок среднего между выборками и равна σ / √n.',
    tags: ['standard-error']
  },
  {
    id: 159,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что показывает AUC ROC?',
    options: [
      'Точность модели',
      'Вероятность, что положительный объект получит больший скор, чем отрицательный',
      'Кросс-энтропию',
      'Корреляцию признаков'
    ],
    correctOptionIndex: 1,
    answer: 'AUC = P(score_positive > score_negative) и отражает ранжирующую способность модели.',
    tags: ['evaluation']
  },
  {
    id: 160,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как вычислить доверительный интервал пропорции при больших n?',
    options: [
      'p̂ ± z * √(p̂(1-p̂)/n)',
      'p̂ ± t * σ',
      'Использовать теорему Байеса',
      'Всегда брать 0.5 ± 0.1'
    ],
    correctOptionIndex: 0,
    answer: 'Нормальная аппроксимация пропорции подходит при np̂ ≥ 5 и n(1-p̂) ≥ 5.',
    tags: ['proportions']
  },
  {
    id: 161,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что измеряет коэффициент детерминации R²?',
    options: [
      'Корень из MSE',
      'Долю объяснённой вариации целевой переменной',
      'Количество признаков',
      'Наклон прямой'
    ],
    correctOptionIndex: 1,
    answer: 'R² = 1 - SSE/SST показывает, какая доля разброса объясняется моделью.',
    tags: ['regression']
  },
  {
    id: 162,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Какой подход используют для оценки распределения сложной статистики без явной формулы?',
    options: ['Бутстрэп', 'ANOVA', 't-тест', 'Z-тест'],
    correctOptionIndex: 0,
    answer: 'Бутстрэп переиспользует выборку с возвращением и оценивает распределение показателя.',
    tags: ['bootstrap']
  },
  {
    id: 163,
    type: 'mcq',
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Когда предпочтительнее критерий Манна-Уитни?',
    options: [
      'При нормальности и больших выборках',
      'При малых выборках и отсутствии нормальности',
      'Только для категорий',
      'Когда есть пропуски'
    ],
    correctOptionIndex: 1,
    answer: 'Манна-Уитни непараметричен и сравнивает ранги, подходя при выбросах и неизвестной форме распределения.',
    tags: ['nonparametric']
  },
  {
    id: 164,
    type: 'mcq',
    category: 'Визуализация',
    difficulty: 'easy',
    question: 'Какой график лучше всего показывает доли целого?',
    options: ['Столбчатый график', 'Линейный график', 'Круговая диаграмма', 'Scatter plot'],
    correctOptionIndex: 2,
    answer: 'Pie chart отображает доли, но лучше использовать bar при большом числе сегментов.',
    tags: ['chart-choice']
  },
  {
    id: 165,
    type: 'mcq',
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Зачем нужен логарифмический масштаб на графике?',
    options: [
      'Чтобы увеличить значения',
      'Чтобы линейно показать экспоненциальный рост',
      'Чтобы скрыть выбросы',
      'Чтобы добавить цвета'
    ],
    correctOptionIndex: 1,
    answer: 'Логарифмическая шкала делает мультипликативные изменения более читаемыми.',
    tags: ['scales']
  },
  {
    id: 166,
    type: 'mcq',
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Какой тип графика лучше для сравнения распределений нескольких категорий?',
    options: ['Violin plot', 'Line chart', 'Pie chart', 'Gauge chart'],
    correctOptionIndex: 0,
    answer: 'Violin plot показывает плотность и основные статистики для сравнения распределений.',
    tags: ['distributions']
  },
  {
    id: 167,
    type: 'mcq',
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Что такое data-ink ratio?',
    options: [
      'Количество данных в отчёте',
      'Доля визуальных элементов, несущих информацию',
      'Соотношение RGB',
      'Размер файла'
    ],
    correctOptionIndex: 1,
    answer: 'Чем выше data-ink ratio, тем меньше визуального шума в графике.',
    tags: ['best-practices']
  },
  {
    id: 168,
    type: 'mcq',
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Как улучшить доступность палитры для дальтоников?',
    options: [
      'Использовать красно-зелёные оттенки',
      'Выбирать палитры ColorBrewer colorblind safe',
      'Добавить больше насыщенности',
      'Переключить на 3D'
    ],
    correctOptionIndex: 1,
    answer: 'ColorBrewer предлагает устойчивые сочетания, избегая конфликтных цветов.',
    tags: ['accessibility']
  },
  {
    id: 169,
    type: 'mcq',
    category: 'Визуализация',
    difficulty: 'easy',
    question: 'Когда имеет смысл использовать sparkline?',
    options: [
      'Для подробного отчёта',
      'Чтобы компактно показать тренд внутри таблицы',
      'Для сравнений категорий',
      'Никогда'
    ],
    correctOptionIndex: 1,
    answer: 'Sparkline — мини-график внутри таблицы, показывающий мини-тренд.',
    tags: ['dashboard']
  },
  {
    id: 170,
    type: 'mcq',
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Как показать поток пользователей между экранами?',
    options: ['Scatter plot', 'Sankey diagram', 'Boxplot', 'Radar chart'],
    correctOptionIndex: 1,
    answer: 'Sankey показывает переходы и толщину потоков между состояниями.',
    tags: ['flows']
  },
  {
    id: 171,
    type: 'mcq',
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Что помогает выстроить визуальную иерархию?',
    options: [
      'Использование whitespace, цвета и размеров',
      'Добавление сетки',
      'Только шрифты',
      'Случайные цвета'
    ],
    correctOptionIndex: 0,
    answer: 'Размер, цвет, контраст и отступы направляют взгляд пользователя.',
    tags: ['design']
  },
  {
    id: 172,
    type: 'mcq',
    category: 'Визуализация',
    difficulty: 'hard',
    question: 'Как протестировать читаемость дашборда на мобильных устройствах?',
    options: [
      'Верить макету',
      'Использовать адаптивные превью и UX-тесты',
      'Сжать до 50%',
      'Избегать дашбордов'
    ],
    correctOptionIndex: 1,
    answer: 'Просмотр в responsive preview, опрос пользователей и тестирование на реальных устройствах выявят проблемы.',
    tags: ['responsive']
  },
  {
    id: 173,
    type: 'mcq',
    category: 'Визуализация',
    difficulty: 'medium',
    question: 'Какой график лучше всего подчеркнёт сезонность и год-к-году сравнение?',
    options: ['Heatmap календаря', 'Pie chart', 'Treemap', 'Gauge'],
    correctOptionIndex: 0,
    answer: 'Календарная тепловая карта или heatmap с неделями/месяцами хорошо показывает сезонные паттерны.',
    tags: ['seasonality']
  },
  {
    id: 174,
    type: 'mcq',
    category: 'ML',
    difficulty: 'easy',
    question: 'Что означает переобучение модели?',
    options: [
      'Плохое обучение на трейне',
      'Высокая точность на трейне и низкая на валидации',
      'Отсутствие обучения',
      'Всегда высокая точность'
    ],
    correctOptionIndex: 1,
    answer: 'Overfitting проявляется, когда модель запоминает шум и не обобщает на новых данных.',
    tags: ['overfitting']
  },
  {
    id: 175,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Какой метод уменьшает дисбаланс классов?',
    options: [
      'SMOTE',
      'Использовать больше признаков',
      'Понизить learning rate',
      'Добавить регуляризацию L2'
    ],
    correctOptionIndex: 0,
    answer: 'SMOTE синтетически увеличивает малый класс, улучшая баланс.',
    tags: ['imbalanced']
  },
  {
    id: 176,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Что измеряет precision?',
    options: [
      'TP / (TP + FP)',
      'TP / (TP + FN)',
      'TN / (TN + FP)',
      'TP / (TP + TN)'
    ],
    correctOptionIndex: 0,
    answer: 'Precision показывает, какой процент предсказанных положительных действительно положительны.',
    tags: ['classification']
  },
  {
    id: 177,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Какой алгоритм относится к ансамблям с последовательным обучением?',
    options: ['Random Forest', 'Gradient Boosting', 'KNN', 'Naive Bayes'],
    correctOptionIndex: 1,
    answer: 'Boosting строит модели последовательно, исправляя ошибки предыдущих.',
    tags: ['ensembles']
  },
  {
    id: 178,
    type: 'mcq',
    category: 'ML',
    difficulty: 'hard',
    question: 'Что делает регуляризация L1?',
    options: [
      'Штрафует квадрат весов',
      'Штрафует абсолютные значения весов, зануляя слабые признаки',
      'Увеличивает число признаков',
      'Ничего'
    ],
    correctOptionIndex: 1,
    answer: 'L1 стимулирует разреженность, что удобно для отбора признаков.',
    tags: ['regularization']
  },
  {
    id: 179,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Какой метрикой удобно оценивать ранжирующую задачу?',
    options: ['RMSE', 'MAP@K', 'Accuracy', 'Recall'],
    correctOptionIndex: 1,
    answer: 'Mean Average Precision по топ-K отражает качество выдачи.',
    tags: ['ranking']
  },
  {
    id: 180,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Для чего служит валидационный набор?',
    options: [
      'Для обучения',
      'Для настройки гиперпараметров и контроля переобучения',
      'Для финальной оценки',
      'Для хранения лога'
    ],
    correctOptionIndex: 1,
    answer: 'Валидация помогает подбирать гиперпараметры и вовремя остановить обучение.',
    tags: ['validation']
  },
  {
    id: 181,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Какой подход интерпретируемости учитывает все подмножества признаков?',
    options: ['Permutation importance', 'SHAP', 'Gain importance', 'LOO'],
    correctOptionIndex: 1,
    answer: 'SHAP основан на значениях Шепли и честно распределяет вклад признаков.',
    tags: ['interpretability']
  },
  {
    id: 182,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Как выбрать число кластеров в k-means?',
    options: ['Метод локтя', 'Брать 10 всегда', 'Применить логистическую регрессию', 'Использовать AUC'],
    correctOptionIndex: 0,
    answer: 'Метод локтя оценивает инерцию кластеров для разных k и ищет точку перегиба.',
    tags: ['clustering']
  },
  {
    id: 183,
    type: 'mcq',
    category: 'ML',
    difficulty: 'hard',
    question: 'Что такое утечка признаков?',
    options: [
      'Слишком мало признаков',
      'Использование информации из будущего или целевой переменной',
      'Отсутствие нормализации',
      'Неверный train/test split по размеру'
    ],
    correctOptionIndex: 1,
    answer: 'Leakage происходит, когда признаки содержат информацию о таргете, недоступную в реальном прогнозе.',
    tags: ['data-leakage']
  },
  {
    id: 184,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Какой критерий расщепления используется в деревьях решений для классификации?',
    options: ['RMSE', 'Gini или энтропия', 'MAE', 'Jaccard'],
    correctOptionIndex: 1,
    answer: 'Деревья минимизируют impurity через индекс Джини или энтропию.',
    tags: ['decision-trees']
  },
  {
    id: 185,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Когда логистическая регрессия предпочтительнее SVM?',
    options: [
      'При больших признаковых пространствах и потребности в вероятностях',
      'Когда данные не линейно разделимы',
      'Когда нужно кластеризовать',
      'Когда нет категориальных признаков'
    ],
    correctOptionIndex: 0,
    answer: 'Логистическая регрессия даёт вероятности и проще объясняется, хорошо работает на больших данных.',
    tags: ['model-choice']
  },
  {
    id: 186,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Что показывает learning curve?',
    options: [
      'Зависимость метрики от размера обучающей выборки',
      'Распределение признаков',
      'ROC-кривую',
      'Важность признаков'
    ],
    correctOptionIndex: 0,
    answer: 'Learning curve помогает понять, хватает ли данных и есть ли переобучение.',
    tags: ['diagnostics']
  },
  {
    id: 187,
    type: 'mcq',
    category: 'ML',
    difficulty: 'hard',
    question: 'Как мониторить деградацию модели после выката?',
    options: [
      'Не нужно мониторить',
      'Собирать метрики качества, дрейф входов и алерты',
      'Запускать обучение каждый час',
      'Удалять старые данные'
    ],
    correctOptionIndex: 1,
    answer: 'МЛ-опс предполагает мониторинг распределения признаков/таргетов и контроль метрик.',
    tags: ['mlops']
  },
  {
    id: 188,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Что делает кросс-валидация k-fold?',
    options: [
      'Делит данные на k частей, по очереди обучая и валидируя',
      'Добавляет регуляризацию',
      'Уменьшает количество признаков',
      'Увеличивает learning rate'
    ],
    correctOptionIndex: 0,
    answer: 'k-fold усредняет качество по нескольким разбиениям и снижает дисперсию оценки.',
    tags: ['validation']
  },
  {
    id: 189,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Какой показатель важен при ранжировании рекомендаций?',
    options: ['Hit Rate@K', 'RMSE', 'MSE', 'R²'],
    correctOptionIndex: 0,
    answer: 'Hit Rate@K проверяет, попал ли релевантный объект в топ-K выдачи.',
    tags: ['ranking']
  },
  {
    id: 190,
    type: 'mcq',
    category: 'ML',
    difficulty: 'hard',
    question: 'Почему PCA требует стандартизации признаков?',
    options: [
      'Чтобы признаки имели одинаковый вклад в дисперсию',
      'Чтобы уменьшить количество признаков',
      'Чтобы увеличить дисперсию',
      'Чтобы добавить регуляризацию'
    ],
    correctOptionIndex: 0,
    answer: 'Без стандартизации признаки с большим масштабом доминируют в компонентах.',
    tags: ['pca']
  },
  {
    id: 191,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Что такое baseline-модель?',
    options: [
      'Сложная нейросеть',
      'Простая модель/эвристика для сравнения улучшений',
      'Модель с максимальной точностью',
      'Случайный набор признаков'
    ],
    correctOptionIndex: 1,
    answer: 'Baseline задаёт точку отсчёта для оценки прироста качества.',
    tags: ['process']
  },
  {
    id: 192,
    type: 'mcq',
    category: 'ML',
    difficulty: 'medium',
    question: 'Как бороться с мультиколлинеарностью в линейной регрессии?',
    options: [
      'Добавить ещё признаки',
      'Удалить или комбинировать скоррелированные признаки, использовать регуляризацию',
      'Увеличить learning rate',
      'Перемешать строки'
    ],
    correctOptionIndex: 1,
    answer: 'Удаление/трансформация коррелированных признаков или Ridge-регуляризация стабилизируют модель.',
    tags: ['regression']
  },
  {
    id: 193,
    type: 'mcq',
    category: 'ML',
    difficulty: 'hard',
    question: 'Какой подход позволит онлайн и офлайн доступ к единому набору признаков?',
    options: [
      'Хранить признаки только в ноутбуке',
      'Feature Store с версионированием (например, Feast)',
      'Ручное обновление CSV',
      'Использовать Google Sheets'
    ],
    correctOptionIndex: 1,
    answer: 'Feature Store обеспечивает декларативные фичи, повторяемость и единое место для офлайн/онлайн сервинга.',
    tags: ['mlops', 'feature-store']
  },
  {
    id: 194,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'easy',
    question: 'Что такое North Star Metric?',
    options: [
      'Метрика, описывающая финансовый отчёт',
      'Единая метрика, отражающая ценность продукта для пользователя и бизнеса',
      'Количество релизов',
      'Число сотрудников'
    ],
    correctOptionIndex: 1,
    answer: 'NSM помогает команде фокусироваться на ключевой ценности продукта.',
    tags: ['metrics']
  },
  {
    id: 195,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как выбрать целевую метрику для эксперимента?',
    options: [
      'Выбрать любую популярную метрику',
      'Привязать к бизнес-цели и пользовательской ценности',
      'Фокусироваться на vanity метриках',
      'Использовать только NPS'
    ],
    correctOptionIndex: 1,
    answer: 'Метрика должна напрямую отражать гипотезу и бизнес-результат.',
    tags: ['experimentation']
  },
  {
    id: 196,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Что включает фреймворк HEART?',
    options: [
      'Happiness, Engagement, Adoption, Retention, Task success',
      'Hypothesis, Experiment, Analysis, Result, Test',
      'Heatmap, Engagement, Analytics, ROI, Traffic',
      'Hype, Experience, Activation, Revenue, Trust'
    ],
    correctOptionIndex: 0,
    answer: 'Фреймворк HEART от Google помогает системно измерять UX.',
    tags: ['frameworks']
  },
  {
    id: 197,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Какой подход поможет сегментировать пользователей по ценности?',
    options: ['RFM-анализ', 'Только возраст', 'Случайная выборка', 'Объединить все данные'],
    correctOptionIndex: 0,
    answer: 'RFM учитывает давность, частоту и чек для выделения сегментов.',
    tags: ['segmentation']
  },
  {
    id: 198,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как оценить эффект фичи, если A/B запуск невозможен?',
    options: [
      'Сравнить ощущения команды',
      'Использовать квази-эксперименты (diff-in-diff, синтетический контроль)',
      'Ничего не делать',
      'Глядеть на NPS'
    ],
    correctOptionIndex: 1,
    answer: 'Quasi-experimental дизайны позволяют приблизиться к каузальной оценке без рандомизации.',
    tags: ['causality']
  },
  {
    id: 199,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Что такое counter metric?',
    options: [
      'Метрика, которую нужно максимизировать',
      'Побочная метрика, которая не должна ухудшиться при эксперименте',
      'Метрика расходов',
      'Обратная метрика'
    ],
    correctOptionIndex: 1,
    answer: 'Counter metrics защищают пользовательский опыт и предупреждают побочные эффекты.',
    tags: ['metrics']
  },
  {
    id: 200,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как приоритизировать backlog аналитических задач?',
    options: ['Случайным образом', 'Использовать RICE/ICE', 'Сначала лёгкие задачи', 'Отложить все'],
    correctOptionIndex: 1,
    answer: 'Фреймворки RICE/ICE учитывают влияние, охват, уверенность и усилия.',
    tags: ['prioritization']
  },
  {
    id: 201,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Что включает Jobs To Be Done?',
    options: [
      'Только демографию',
      'Задачу пользователя, контекст и ожидаемый результат',
      'Список фичей',
      'Метрики загрузки'
    ],
    correctOptionIndex: 1,
    answer: 'JTBD описывает работу, которую пользователь «нанимает» продукт, и желаемый прогресс.',
    tags: ['research']
  },
  {
    id: 202,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как аналитик может поддержать JTBD-интервью?',
    options: [
      'Не участвовать',
      'Подготовить данные поведения, сегменты и уточняющие вопросы',
      'Сделать только SQL-скрипты',
      'Построить A/B тест'
    ],
    correctOptionIndex: 1,
    answer: 'Аналитик добавляет количественный контекст и помогает выбрать релевантных респондентов.',
    tags: ['research']
  },
  {
    id: 203,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Что важно включить в аналитическую рекомендацию?',
    options: [
      'Только графики',
      'Инсайт, действие, ожидаемый эффект и способ измерения',
      'Список задач',
      'Описание команды'
    ],
    correctOptionIndex: 1,
    answer: 'Чёткая рекомендация связывает данные с действием и предполагаемым влиянием.',
    tags: ['communication']
  },
  {
    id: 204,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Как измерить активацию в продукте?',
    options: [
      'Считать все регистрации',
      'Определить ключевое целевое действие (aha moment) и измерять его долю',
      'Считать только выручку',
      'Смотреть MAU'
    ],
    correctOptionIndex: 1,
    answer: 'Активация — это переход пользователя к ценности, определяется ключевым действием.',
    tags: ['pirate-metrics']
  },
  {
    id: 205,
    type: 'mcq',
    category: 'Продуктовое мышление',
    difficulty: 'medium',
    question: 'Что означает продуктовое мышление?',
    options: [
      'Фокус на реализации задач',
      'Фокус на пользовательской ценности, бизнес-цели и данных',
      'Фокус только на коде',
      'Фокус на KPI отдела'
    ],
    correctOptionIndex: 1,
    answer: 'Продуктовое мышление помогает соединить потребности пользователя, бизнес и технологические решения.',
    tags: ['mindset']
  }
];

const HIGHEST_ID = Math.max(
  ...BASE_QUESTIONS.map((q) => q.id),
  ...MCQ_QUESTIONS.map((q) => q.id)
);

let NEXT_ID = HIGHEST_ID + 1;

const assignIds = (items) =>
  items.map((item) => ({
    id: NEXT_ID++,
    ...item,
  }));

const SQL_WINDOW_SET = assignIds(SQL_WINDOW_PROMPTS);
const SQL_CODE_SET = assignIds(SQL_CODE_PROMPTS);
const PROBABILITY_SET = assignIds(PROBABILITY_PROMPTS);
const STATS_SET = assignIds(STATS_PROMPTS);
const AB_ADVANCED_SET = assignIds(AB_ADVANCED_PROMPTS);
const METRIC_SET = assignIds(METRIC_PROMPTS);
const MARKETING_SET = assignIds(MARKETING_PROMPTS);
const PRODUCT_ANALYTICS_SET = assignIds(PRODUCT_ANALYTICS_PROMPTS);
const ML_SET = assignIds(ML_PROMPTS);
const MULTI_SELECT_SET = assignIds(MSQ_PROMPTS.map((item) => ({ type: 'msq', ...item })));
const SQL_CHALLENGE_SET = assignIds(SQL_CODE_CHALLENGES);
const SQL_CONCEPT_SET = assignIds(SQL_CONCEPT_EXPANSION);
const PYTHON_SNIPPET_SET = assignIds(PYTHON_SNIPPET_EXPANSION);
const PYTHON_CONCEPT_SET = assignIds(PYTHON_CONCEPT_EXPANSION);
const STATS_FORMULA_SET = assignIds(STATS_FORMULA_EXPANSION);
const PROBABILITY_EXTRA_SET = assignIds(PROBABILITY_EXTRA_PROMPTS);
const AB_SCENARIO_EXTRA_SET = assignIds(AB_SCENARIO_EXPANSION);
const MCQ_SQL_SET = assignIds(MCQ_SQL_EXPANSION.map((item) => ({ type: 'mcq', ...item })));
const MSQ_EXTRA_SET = assignIds(MSQ_ADDITIONAL_EXPANSION.map((item) => ({ type: 'msq', ...item })));
const PRODUCT_CASE_SET = assignIds(PRODUCT_CASE_PROMPTS);
const PRODUCT_CASE_MCQ_SET = assignIds(PRODUCT_CASE_MCQ_PROMPTS.map((item) => ({ type: 'mcq', ...item })));
const PRODUCT_CASE_MSQ_SET = assignIds(PRODUCT_CASE_MSQ_PROMPTS.map((item) => ({ type: 'msq', ...item })));
const SQL_ANALYTICS_SET = assignIds(SQL_ANALYTICS_PROMPTS);
const PYTHON_ANALYTICS_SET = assignIds(PYTHON_ANALYTICS_PROMPTS);
const STATS_ADVANCED_SET = assignIds(STATS_ADVANCED_PROMPTS);
const AB_MATH_SET = assignIds(AB_MATH_PROMPTS);
const PROBABILITY_DISTRIBUTION_SET = assignIds(PROBABILITY_DISTRIBUTION_PROMPTS);
const MSQ_ANALYTICS_SET = assignIds(MSQ_ANALYTICS_PROMPTS.map((item) => ({ type: 'msq', ...item })));

export const QUESTIONS = [
  ...BASE_QUESTIONS,
  ...MCQ_QUESTIONS,
  ...SQL_WINDOW_SET,
  ...SQL_CODE_SET,
  ...PROBABILITY_SET,
  ...STATS_SET,
  ...AB_ADVANCED_SET,
  ...METRIC_SET,
  ...MARKETING_SET,
  ...PRODUCT_ANALYTICS_SET,
  ...ML_SET,
  ...MULTI_SELECT_SET,
  ...SQL_CHALLENGE_SET,
  ...SQL_CONCEPT_SET,
  ...PYTHON_SNIPPET_SET,
  ...PYTHON_CONCEPT_SET,
  ...STATS_FORMULA_SET,
  ...PROBABILITY_EXTRA_SET,
  ...AB_SCENARIO_EXTRA_SET,
  ...MCQ_SQL_SET,
  ...MSQ_EXTRA_SET,
  ...PRODUCT_CASE_SET,
  ...PRODUCT_CASE_MCQ_SET,
  ...PRODUCT_CASE_MSQ_SET,
  ...SQL_ANALYTICS_SET,
  ...PYTHON_ANALYTICS_SET,
  ...STATS_ADVANCED_SET,
  ...AB_MATH_SET,
  ...PROBABILITY_DISTRIBUTION_SET,
  ...MSQ_ANALYTICS_SET,
];