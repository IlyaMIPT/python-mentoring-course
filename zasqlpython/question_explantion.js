const escapeHtml = (text = '') =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const wrapCodeBlock = (sql) => `\n<pre class="code-block"><code>${escapeHtml(sql)}</code></pre>\n`;

const buildSqlCodeQuestion = ({ prompt, code, answer, tags = [], difficulty = 'medium' }) => ({
  category: 'SQL',
  difficulty,
  question: `${prompt}${wrapCodeBlock(code)}`,
  answer,
  tags,
});

const SQL_CODE_CHALLENGES = [
  buildSqlCodeQuestion({
    prompt: 'Что вернёт запрос, который отделяет первые покупки от повторных заказов?',
    code: `WITH ranked AS (
  SELECT user_id,
         order_id,
         order_date,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY order_date) AS rn
  FROM orders
)
SELECT user_id,
       COUNT(*) FILTER (WHERE rn = 1) AS first_orders,
       COUNT(*) FILTER (WHERE rn > 1) AS repeat_orders
FROM ranked
GROUP BY 1;`,
    answer: 'Вернёт по каждому пользователю число первых заказов (0 или 1) и повторных, используя оконную нумерацию.',
    tags: ['window-functions', 'funnel'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как работает запрос для подсчёта 7-дневного retention?',
    difficulty: 'hard',
    code: `WITH cohort AS (
  SELECT user_id,
         MIN(event_date) AS signup_date
  FROM events
  WHERE event_name = 'signup'
  GROUP BY 1
),
activity AS (
  SELECT user_id,
         MIN(event_date) FILTER (WHERE event_date <= signup_date + INTERVAL '7 day') AS day7
  FROM events e
  JOIN cohort c USING (user_id)
  GROUP BY 1, signup_date
)
SELECT signup_date,
       COUNT(*) FILTER (WHERE day7 IS NOT NULL)::float / COUNT(*) AS retention_d7
FROM activity
GROUP BY 1
ORDER BY 1;`,
    answer: 'Формирует когорты регистрации и проверяет, вернулся ли пользователь в течение 7 дней. Возвращает ежедневный D7 retention.',
    tags: ['retention', 'cohorts'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Какой результат вернёт запрос с recursive CTE для построения иерархии категорий?',
    code: `WITH RECURSIVE tree AS (
  SELECT id, parent_id, name, 1 AS depth, name AS path
  FROM categories
  WHERE parent_id IS NULL
  UNION ALL
  SELECT c.id,
         c.parent_id,
         c.name,
         t.depth + 1 AS depth,
         CONCAT(t.path, ' > ', c.name) AS path
  FROM categories c
  JOIN tree t ON c.parent_id = t.id
)
SELECT * FROM tree ORDER BY path;`,
    answer: 'Вернёт полную иерархию категорий с глубиной и текстовым путём вида «Root > Subcategory».',
    tags: ['cte', 'hierarchy'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что вернёт запрос, который находит пользователей с подряд идущими 3 днями активности?',
    difficulty: 'hard',
    code: `WITH ranked AS (
  SELECT user_id,
         event_date,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_date) AS rn
  FROM activity
  GROUP BY user_id, event_date
),
groups AS (
  SELECT user_id,
         event_date,
         event_date - rn * INTERVAL '1 day' AS grp_key
  FROM ranked
)
SELECT user_id,
       MIN(event_date) AS streak_start,
       MAX(event_date) AS streak_end,
       COUNT(*) AS days_in_row
FROM groups
GROUP BY user_id, grp_key
HAVING COUNT(*) >= 3;`,
    answer: 'Находит всех пользователей с серией минимум из трёх последовательных дней активности и показывает границы серии.',
    tags: ['streaks', 'window-functions'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Зачем используется lateral join в примере ниже и что вернёт запрос?',
    code: `SELECT u.user_id,
       actions.action_name,
       actions.latest_time
FROM users u
CROSS JOIN LATERAL (
  SELECT event_name AS action_name,
         MAX(event_time) AS latest_time
  FROM events e
  WHERE e.user_id = u.user_id
  GROUP BY event_name
  ORDER BY latest_time DESC
  LIMIT 1
) AS actions;`,
    answer: 'Для каждого пользователя берёт его самое позднее действие без дополнительного подзапроса с параметрами; lateral позволяет ссылаться на внешний user_id.',
    tags: ['lateral', 'postgres'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что делает запрос для расчёта weekly rolling revenue?',
    code: `SELECT week_start,
       SUM(week_revenue) OVER (
         ORDER BY week_start
         ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
       ) AS revenue_4w
FROM (
  SELECT DATE_TRUNC('week', order_date) AS week_start,
         SUM(amount) AS week_revenue
  FROM orders
  GROUP BY 1
) t;`,
    answer: 'Считает сумму выручки за текущую и три предыдущие недели (4-недельное скользящее окно).',
    tags: ['window-functions', 'rolling'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как этот запрос с PIVOT имитированным через FILTER соберёт метрику?',
    code: `SELECT
  DATE_TRUNC('day', event_time) AS day,
  COUNT(*) FILTER (WHERE event_name = 'view') AS views,
  COUNT(*) FILTER (WHERE event_name = 'add_to_cart') AS add_to_cart,
  COUNT(*) FILTER (WHERE event_name = 'purchase') AS purchases
FROM events
GROUP BY 1
ORDER BY 1;`,
    answer: 'Вернёт ежедневную агрегацию по событиям в формате одной строки per день с отдельными колонками для каждого шага воронки.',
    tags: ['conditional-agg'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что делает запрос с DISTINCT ON для отбора последнего статуса подписки?',
    code: `SELECT DISTINCT ON (user_id)
       user_id,
       status,
       updated_at
FROM subscription_status
ORDER BY user_id, updated_at DESC;`,
    answer: 'Для каждого пользователя возвращает последнюю запись по updated_at благодаря синтаксису DISTINCT ON.',
    tags: ['distinct-on'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как работает запрос, который сравнивает конверсию по платформам и возвращает uplift?',
    code: `WITH platform_conv AS (
  SELECT platform,
         COUNT(*) FILTER (WHERE event_name = 'purchase')::float
         / NULLIF(COUNT(*) FILTER (WHERE event_name = 'signup'), 0) AS conversion
  FROM events
  GROUP BY 1
)
SELECT platform,
       conversion,
       conversion - FIRST_VALUE(conversion) OVER (ORDER BY conversion DESC) AS uplift_vs_leader
FROM platform_conv
ORDER BY conversion DESC;`,
    answer: 'Считает конверсию signup→purchase по платформам и показывает отставание от лидера с помощью оконной функции.',
    tags: ['conversion', 'window-functions'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что вернёт запрос с JSONB-распаковкой свойств события?',
    code: `SELECT event_id,
       attr.key,
       attr.value
FROM events e,
LATERAL jsonb_each_text(e.event_props) AS attr;`,
    answer: 'Каждый JSONB ключ превращается в отдельную строку с именем ключа и значением, что удобно для ad-hoc анализа свойств.',
    tags: ['jsonb'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как запрос с percentile_cont поможет найти SLA по времени ответа поддержки?',
    code: `SELECT DATE_TRUNC('week', created_at) AS week,
       percentile_cont(0.9) WITHIN GROUP (ORDER BY response_minutes) AS p90_response
FROM tickets
GROUP BY 1;`,
    answer: 'Возвращает недельный 90-й перцентиль времени ответа и позволяет контролировать SLA.',
    tags: ['percentile', 'sla'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что делает запрос со скользящим окном для расчёта z-score аномалий по MAU?',
    difficulty: 'hard',
    code: `WITH monthly AS (
  SELECT DATE_TRUNC('month', event_time) AS month,
         COUNT(DISTINCT user_id) AS mau
  FROM events
  GROUP BY 1
),
stats AS (
  SELECT month,
         mau,
         AVG(mau) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS mean_mau,
         STDDEV_SAMP(mau) OVER (ORDER BY month ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS std_mau
  FROM monthly
)
SELECT month,
       mau,
       (mau - mean_mau) / NULLIF(std_mau, 0) AS z_score
FROM stats;`,
    answer: 'Считает для каждого месяца Z-скор относительно трёх последних периодов, что помогает ловить аномалии MAU.',
    tags: ['anomaly', 'window-functions'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как запрос находит пользователей, впервые попробовавших новую фичу после онбординга?',
    code: `WITH ordered AS (
  SELECT user_id,
         event_time,
         event_name,
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_time) AS rn
  FROM events
  WHERE event_name IN ('onboarding_complete', 'new_feature_use')
)
SELECT user_id,
       MIN(event_time) FILTER (WHERE event_name = 'new_feature_use') AS first_feature_use
FROM ordered
WHERE rn > 1
GROUP BY 1;`,
    answer: 'Берёт событие первого использования фичи после завершённого онбординга, исключая тех, кто не завершил процесс.',
    tags: ['feature-adoption', 'window-functions'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что делает запрос, соединяющий таблицу заказов с агрегатами оплаты через CTE?',
    code: `WITH payments AS (
  SELECT order_id,
         SUM(amount) AS paid_sum,
         COUNT(*) AS payment_attempts
  FROM transactions
  GROUP BY 1
)
SELECT o.order_id,
       o.amount AS order_sum,
       p.paid_sum,
       p.payment_attempts,
       o.amount - COALESCE(p.paid_sum, 0) AS gap
FROM orders o
LEFT JOIN payments p USING (order_id);`,
    answer: 'Возвращает заказы с суммой оплат, числом попыток и разницей до полной оплаты.',
    tags: ['cte', 'payments'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как работает запрос, делающий дедупликацию событий по уникальному hash?',
    code: `WITH ranked AS (
  SELECT *,
         ROW_NUMBER() OVER (PARTITION BY dedup_hash ORDER BY ingested_at DESC) AS rn
  FROM raw_events
)
SELECT *
FROM ranked
WHERE rn = 1;`,
    answer: 'Оставляет только последнюю версию события с одинаковым hash, убирая дубликаты и поздние перезаписи.',
    tags: ['dedup'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что вернёт запрос, вычисляющий stickiness (DAU/MAU)?',
    code: `WITH dau AS (
  SELECT DATE_TRUNC('day', event_time) AS day,
         COUNT(DISTINCT user_id) AS dau
  FROM events
  GROUP BY 1
),
mau AS (
  SELECT DATE_TRUNC('month', event_time) AS month,
         COUNT(DISTINCT user_id) AS mau
  FROM events
  GROUP BY 1
)
SELECT a.day,
       a.dau,
       m.mau,
       a.dau::float / NULLIF(m.mau, 0) AS stickiness
FROM dau a
JOIN mau m ON DATE_TRUNC('month', a.day) = m.month;`,
    answer: 'Сопоставляет ежедневно DAU с MAU месяца и возвращает коэффициент stickiness дня.',
    tags: ['stickiness'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как запрос с CUBE поможет посчитать выручку по измерениям и по итогу?',
    code: `SELECT region,
       channel,
       product_line,
       SUM(amount) AS revenue
FROM sales
GROUP BY CUBE (region, channel, product_line);`,
    answer: 'Вернёт выручку по всем комбинациям измерений, включая частичные и общий итог благодаря CUBE.',
    tags: ['cube', 'olap'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Зачем использовать window frame RANGE BETWEEN INTERVAL \'6 hours\' и что вернёт пример ниже?',
    code: `SELECT event_time,
       SUM(value) OVER (
         ORDER BY event_time
         RANGE BETWEEN INTERVAL '6 hours' PRECEDING AND CURRENT ROW
       ) AS value_6h
FROM metrics;`,
    answer: 'Считает сумму значений за последние 6 часов, даже если события редкие, потому что RANGE использует временной интервал.',
    tags: ['window-frame'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как запрос находит пользователей с двумя подряд отменами доставок?',
    code: `WITH ordered AS (
  SELECT user_id,
         event_time,
         event_name,
         LAG(event_name) OVER (PARTITION BY user_id ORDER BY event_time) AS prev_event
  FROM courier_events
)
SELECT DISTINCT user_id
FROM ordered
WHERE event_name = 'cancel_delivery'
  AND prev_event = 'cancel_delivery';`,
    answer: 'Возвращает пользователей, у которых две отмены шли подряд, анализируя соседние строки через LAG.',
    tags: ['lag', 'behavior'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что делает запрос, который распределяет пользователей по квантилям LTV и считает ARPU?',
    code: `WITH ltv AS (
  SELECT user_id, SUM(amount) AS lifetime_value
  FROM payments
  GROUP BY 1
),
scored AS (
  SELECT user_id,
         lifetime_value,
         NTILE(4) OVER (ORDER BY lifetime_value) AS quartile
  FROM ltv
)
SELECT quartile,
       AVG(lifetime_value) AS avg_ltv,
       SUM(lifetime_value) / NULLIF(COUNT(*), 0) AS arpu
FROM scored
GROUP BY 1
ORDER BY 1;`,
    answer: 'Группирует пользователей по квартилям LTV и считает средний чек и ARPU в каждой группе.',
    tags: ['ltv', 'segmentation'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как запрос с массивами распаковывает атрибуты, вытянутые из JSON?',
    code: `SELECT user_id,
       UNNEST(device_ids) AS device_id
FROM user_profiles;`,
    answer: 'Каждому пользователю сопоставляет каждое устройство из массива, создавая отдельную строку на устройство.',
    tags: ['arrays'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что вернёт запрос, который рассчитывает коэффициент сезонности по дням недели?',
    code: `WITH totals AS (
  SELECT EXTRACT(DOW FROM event_time) AS dow,
         COUNT(*) AS events_per_day
  FROM sessions
  GROUP BY 1
),
avg_all AS (
  SELECT AVG(events_per_day) AS avg_events FROM totals
)
SELECT dow,
       events_per_day / avg_events AS seasonality_factor
FROM totals CROSS JOIN avg_all;`,
    answer: 'Показывает, во сколько раз каждый день недели активнее среднего дня (seasonality_factor).',
    tags: ['seasonality'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как запрос найдет повторно активированных пользователей через INTERSECT?',
    code: `WITH previous AS (
  SELECT DISTINCT user_id FROM events
  WHERE event_date BETWEEN current_date - INTERVAL '60 day' AND current_date - INTERVAL '30 day'
),
current AS (
  SELECT DISTINCT user_id FROM events
  WHERE event_date >= current_date - INTERVAL '30 day'
)
SELECT user_id FROM current
EXCEPT
SELECT user_id FROM previous;`,
    answer: 'Вернёт пользователей, которые вернулись за последние 30 дней после периода тишины (были в current, но не в предыдущем окне).',
    tags: ['reactivation', 'set-operations'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как запрос вычисляет кумулятивную конверсию кредитной воронки?',
    code: `WITH funnel AS (
  SELECT user_id,
         MAX(event_time) FILTER (WHERE event_name = 'apply') AS applied,
         MAX(event_time) FILTER (WHERE event_name = 'approved') AS approved,
         MAX(event_time) FILTER (WHERE event_name = 'funded') AS funded
  FROM credit_events
  GROUP BY 1
)
SELECT
  COUNT(*) AS applicants,
  COUNT(*) FILTER (WHERE approved IS NOT NULL) AS approvals,
  COUNT(*) FILTER (WHERE funded IS NOT NULL) AS funded_cnt,
  COUNT(*) FILTER (WHERE approved IS NOT NULL)::float / COUNT(*) AS approve_rate,
  COUNT(*) FILTER (WHERE funded IS NOT NULL)::float / COUNT(*) AS fund_rate
FROM funnel;`,
    answer: 'Строит трёхшаговую воронку и выводит абсолютные и относительные показатели для каждой ступени благодаря FILTER.',
    tags: ['funnels', 'filter'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что вернёт запрос, агрегирующий эксперименты и проверяющий SRM?',
    code: `SELECT experiment_id,
       COUNT(*) FILTER (WHERE variant = 'control') AS control_users,
       COUNT(*) FILTER (WHERE variant = 'treatment') AS treatment_users,
       COUNT(*) FILTER (WHERE variant = 'treatment')::float
         / NULLIF(COUNT(*), 0) AS share_treatment
FROM experiment_assignments
GROUP BY 1;`,
    answer: 'Показывает распределение трафика по вариантам и долю treatment, что помогает быстро заметить Sample Ratio Mismatch.',
    tags: ['experiments', 'srm'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Как запросы с window COUNT DISTINCT эмулируют когорты подписок?',
    code: `SELECT user_id,
       plan,
       subscription_start,
       COUNT(DISTINCT plan) OVER (PARTITION BY user_id ORDER BY subscription_start) AS plan_iteration
FROM subscriptions;`,
    answer: 'Для каждого пользователя считает, какая по счёту подписка (переход между тарифами), что полезно для анализа апгрейдов.',
    tags: ['window-functions', 'subscriptions'],
  }),
  buildSqlCodeQuestion({
    prompt: 'Что вернёт запрос, который находит пользователей с необычным числом сессий с помощью MAD?',
    difficulty: 'hard',
    code: `WITH agg AS (
  SELECT user_id,
         COUNT(*) AS sessions
  FROM sessions
  GROUP BY 1
),
median_calc AS (
  SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY sessions) AS median_sessions FROM agg
),
mad_calc AS (
  SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY ABS(sessions - median_sessions)) AS mad
  FROM agg CROSS JOIN median_calc
)
SELECT a.*,
       (a.sessions - median_sessions) / NULLIF(mad, 0) AS modified_z
FROM agg
CROSS JOIN median_calc
CROSS JOIN mad_calc;`,
    answer: 'Считает медиану и Median Absolute Deviation для количества сессий и помечает пользователей с выбросами по modified z-score.',
    tags: ['robust-stats', 'window-functions'],
  }),
];

const SQL_CONCEPT_PROMPTS = [
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Зачем использовать LISTAGG/STRING_AGG в аналитических задачах?',
    answer: 'Функция собирает значения группы в строку и полезна, когда нужно показать все действия пользователя или состав товаров заказа в одной ячейке.',
    tags: ['aggregation'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'В чём разница между UNION и UNION ALL в витринах данных?',
    answer: 'UNION удаляет дубликаты и требует сортировки/агрегации, UNION ALL просто конкатенирует наборы быстрее. При ETL чаще используют UNION ALL и дедеуплицируют отдельно.',
    tags: ['set-operations'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Почему стоит явно задавать COLLATE при сравнении строк?',
    answer: 'Коллация определяет регистр и сортировку. В разных БД дефолт отличается, поэтому явный COLLATE обеспечивает предсказуемость и ускоряет использование индексов.',
    tags: ['collation'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question: 'Как работает частичная материализация (incremental refresh) в BI и SQL?',
    answer: 'Сначала выделяется диапазон данных (обычно последние N дней), пересчитывается только он, остальные партиции остаются нетронутыми. Это реализуют через PARTITIONED tables и WHERE в ETL.',
    tags: ['materialization'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Когда выгодно использовать CLUSTER BY/ZORDER поверх партиционирования?',
    answer: 'Когда нужен дополнительный порядок внутри партиции для ускорения диапазонных фильтров (например, по user_id). Кластеризация создаёт сортированный layout и снижает скан данных.',
    tags: ['performance'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Зачем использовать GENERATED ALWAYS AS IDENTITY вместо SERIAL?',
    answer: 'IDENTITY соответствует стандарту SQL и корректно работает с репликацией/импортом, позволяет RESET/RESTART. SERIAL всего лишь синтаксический сахар над sequence.',
    tags: ['identity'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Что такое covering index и когда он полезен?',
    answer: 'Это индекс, содержащий все поля, которые нужны запросу. Тогда чтение можно обслужить только за счёт индекса без обращения к таблице, что ускоряет аналитические выборки.',
    tags: ['indexes'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Почему важно задавать NULLS FIRST/LAST в ORDER BY?',
    answer: 'Поведение по умолчанию различается между СУБД. Явное указание гарантирует, что пропуски окажутся в нужной части списка и не сломают оконные вычисления.',
    tags: ['sorting'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как работает HASH JOIN и когда он эффективнее NESTED LOOP?',
    answer: 'HASH JOIN строит хеш-таблицу по меньшей таблице и ищет совпадения за O(1). Эффективен при больших неотсортированных наборах и равенствах, но требует памяти.',
    tags: ['joins'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Зачем использовать WINDOW EXCLUDE GROUP/NO OTHERS?',
    answer: 'EXCLUDE позволяет исключать текущую строку или группу из расчёта. Например, рассчитать среднее по группе без текущего пользователя для анти-меры.',
    tags: ['window-frame'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question: 'Что такое late arriving dimensions и как их обрабатывать в SQL?',
    answer: 'Это измерения, приходящие позже фактов. Обычно создают «unknown» суррогатный ключ, обновляют записи фактов, когда измерение появляется, или используют SCD Type 2 с датами активностей.',
    tags: ['dwh'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Почему важно нормализовать timezone при анализе событий?',
    answer: 'События могут приходить в локальном времени. Приведение к UTC и отдельный столбец user_timezone предотвращают сдвиги метрик и дублирование суток.',
    tags: ['time'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Что даёт TABLESAMPLE и когда его стоит применять?',
    answer: 'TABLESAMPLE позволяет взять долю строк напрямую из таблицы без полного скана. Используется для быстрой оценки распределений или проверки качества данных.',
    tags: ['sampling'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Когда стоит включать constraint VALIDATE NOT VALID в PostgreSQL?',
    answer: 'NOT VALID добавляет ограничение без проверки существующих данных. VALIDATE запускают отдельно, чтобы не блокировать запись большой таблицы.',
    tags: ['constraints'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как объяснить разницу между logical и physical планом EXPLAIN?',
    answer: 'Logical план описывает операции (scan, join). Physical рассказывает, какой алгоритм выбран (seq scan vs index scan). Для оптимизации смотрят physical план и затраты (cost).',
    tags: ['explain'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Что такое incremental snapshot и чем он отличается от full snapshot?',
    answer: 'Incremental пересоздаёт только изменившиеся строки (через CDC или сравнение hash). Full полностью перезаписывает витрину, что дороже и дольше.',
    tags: ['etl'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Когда стоит хранить агрегаты в отдельной таблице (rollups)?',
    answer: 'Если метрика переиспользуется и считается дорого, создают rollup с периодической пересборкой и partition pruning. Это снижает нагрузку на сырые события.',
    tags: ['rollup'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Почему window функции удобнее self join для поиска предыдущего события?',
    answer: 'LAG/LEAD обращаются к соседним строкам без дополнительных связок и читаются проще. Self join требует агрегатов и условий, что усложняет план и производительность.',
    tags: ['window-functions'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как использовать hyperloglog/sketches в SQL движках?',
    answer: 'При больших объёмах SELECT approx_count_distinct(col) или HLL sketches позволяют оценить уникальные значения с контролируемой ошибкой. Полезно для уникальных пользователей или урлов.',
    tags: ['approximation'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Когда полезен USING вместо ON в JOIN?',
    answer: 'USING автоматически удаляет дублирующиеся столбцы и читабельнее, если ключевые поля имеют одинаковые имена. Это спасает от опечаток в ON.',
    tags: ['joins'],
  },
  {
    category: 'SQL',
    difficulty: 'easy',
    question: 'В чём преимущество DATE_TRUNC перед EXTRACT при построении календарей?',
    answer: 'DATE_TRUNC возвращает саму дату начала периода (неделя, месяц), которую можно использовать в GROUP BY и JOIN, а EXTRACT даёт номер периода и его приходится комбинировать с годом.',
    tags: ['dates'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Когда стоит включать constraint DEFERRABLE INITIALLY DEFERRED?',
    answer: 'Такой constraint проверяется в конце транзакции, что полезно при взаимных ссылках или пачечной загрузке данных.',
    tags: ['transactions'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Что даёт временная таблица ON COMMIT PRESERVE ROWS?',
    answer: 'Такая таблица сохраняет данные для всей сессии и удобна для промежуточных расчётов без риска очистки при коммите.',
    tags: ['temp-tables'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как объяснить работу GROUPING SETS простыми словами?',
    answer: 'GROUPING SETS позволяют задать несколько комбинаций группировок в одном запросе вместо UNION — например, по стране, по устройству и по обоим параметрам сразу.',
    tags: ['grouping-sets'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Почему стоит явно указывать precision/scale для NUMERIC?',
    answer: 'Иначе некоторые движки используют максимальную точность, что замедляет расчёты и увеличивает хранение. Чётко заданные NUMERIC(12,2) экономят место и ускоряют арифметику.',
    tags: ['types'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какие преимущества у columnar storage (ClickHouse, BigQuery) для аналитики?',
    answer: 'Колонки сжимаются эффективнее и читаются независимо, поэтому запросы по нескольким столбцам сканируют меньше данных и работают быстрее.',
    tags: ['storage'],
  },
];

const PYTHON_SNIPPET_PROMPTS = [
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что выведет код, использующий list comprehension с условием?' +
      wrapCodeBlock(`nums = [1, 2, 3, 4, 5]\nprint([n ** 2 for n in nums if n % 2 == 0])`),
    answer: 'Список квадратов чётных чисел: [4, 16].',
    tags: ['comprehension'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что произойдёт при работе с mutable default аргументом?' +
      wrapCodeBlock(`def append_item(item, bucket=[]):\n    bucket.append(item)\n    return bucket\n\nprint(append_item(1))\nprint(append_item(2))`),
    answer: 'Будет повторное использование одного и того же списка, поэтому вывод: [1] и затем [1, 2].',
    tags: ['functions', 'pitfalls'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как работает zip_longest из itertools?' +
      wrapCodeBlock(`from itertools import zip_longest\nprint(list(zip_longest([1, 2], ['a'], fillvalue='-')))`),
    answer: 'Вернёт [(1, \'a\'), (2, \'-\')], дополняя недостающие элементы fillvalue.',
    tags: ['itertools'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что выведет код с enumerate и start?' +
      wrapCodeBlock(`names = ['sql', 'python', 'ml']\nfor idx, name in enumerate(names, start=1):\n    print(idx, name.upper())`),
    answer: 'Строки «1 SQL», «2 PYTHON», «3 ML». enumerate позволяет задать старт индекса.',
    tags: ['enumerate'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как работает Counter.most_common?' +
      wrapCodeBlock(`from collections import Counter\nlog = Counter('abbccc')\nprint(log.most_common(2))`),
    answer: "[('c', 3), ('b', 2)] — лучшие элементы по частоте.",
    tags: ['collections'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что выведет генераторное выражение и функция sum?' +
      wrapCodeBlock(`print(sum(n for n in range(5) if n % 2 == 1))`),
    answer: 'Сумма нечётных чисел от 0 до 4 = 1 + 3 = 4.',
    tags: ['generators'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как работает распаковка словарей?' +
      wrapCodeBlock(`a = {'sql': 1}\nb = {'python': 2, **a}\nprint(b)`),
    answer: "Словарь объединится в {'sql': 1, 'python': 2}.",
    tags: ['dict'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что напечатает оператор walrus (:=)?' +
      wrapCodeBlock(`data = [0, 3, 5]\nif (count := len(data)) > 2:\n    print(f'В списке {count} элементов')`),
    answer: 'Сначала присвоит count = 3, затем выведет «В списке 3 элементов».',
    tags: ['walrus'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как работает Pathlib при построении путей?' +
      wrapCodeBlock(`from pathlib import Path\nprint(Path('data') / 'raw' / '2025-01.csv')`),
    answer: 'Вернёт объект пути data/raw/2025-01.csv независимо от ОС.',
    tags: ['pathlib'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что вернёт использование dataclass с default factory?' +
      wrapCodeBlock(`from dataclasses import dataclass, field\n\n@dataclass\nclass User:\n    tags: list[str] = field(default_factory=list)\n\na = User()\na.tags.append('sql')\nb = User()\nprint(a.tags, b.tags)`),
    answer: 'Каждый экземпляр получит свой список: [\'sql\'] и []. default_factory предотвращает общий mutable объект.',
    tags: ['dataclass'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что произойдёт при использовании Decimal для денежной суммы?' +
      wrapCodeBlock(`from decimal import Decimal\namount = Decimal('10.10') - Decimal('3.02')\nprint(amount)`),
    answer: 'Вывод 7.08 без ошибок двоичной арифметики, так как Decimal хранит точные десятичные значения.',
    tags: ['decimal'],
  },
  {
    category: 'Python',
    difficulty: 'hard',
    question:
      'Что напечатает contextlib.suppress?' +
      wrapCodeBlock(`from contextlib import suppress\nwith suppress(ZeroDivisionError):\n    print(1 / 0)\nprint('ok')`),
    answer: 'Исключение ZeroDivisionError будет подавлено, поэтому на экран попадёт только «ok».',
    tags: ['contextlib'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как itertools.groupby группирует отсортированные данные?' +
      wrapCodeBlock(`from itertools import groupby\nrecords = [('sql', 1), ('sql', 2), ('python', 3)]\nfor key, group in groupby(records, key=lambda item: item[0]):\n    print(key, list(group))`),
    answer: 'Сгруппирует подряд идущие элементы: sql [(\'sql\', 1), (\'sql\', 2)] и python [(\'python\', 3)].',
    tags: ['groupby'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что выведет код с defaultdict(int)?' +
      wrapCodeBlock(`from collections import defaultdict\ncounter = defaultdict(int)\ncounter['sql'] += 1\nprint(counter['python'])`),
    answer: 'Для отсутствующего ключа вернётся 0 благодаря значению по умолчанию.',
    tags: ['defaultdict'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как работает slicing с шагом?' +
      wrapCodeBlock(`text = 'datascience'\nprint(text[::2])`),
    answer: 'Выведет символы через один: dtscine.',
    tags: ['slicing'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что выведет sorted с key=len и reverse?' +
      wrapCodeBlock(`words = ['sql', 'probability', 'ab']\nprint(sorted(words, key=len, reverse=True))`),
    answer: "['probability', 'sql', 'ab'] — сортировка по длине по убыванию.",
    tags: ['sorting'],
  },
  {
    category: 'Python',
    difficulty: 'hard',
    question:
      'Как работает functools.lru_cache?' +
      wrapCodeBlock(`from functools import lru_cache\n\n@lru_cache(maxsize=2)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n-1) + fib(n-2)\n\nprint(fib(5))`),
    answer: 'lru_cache запоминает результаты и ускоряет рекурсию. Вывод 5.',
    tags: ['memoization'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что произойдёт при использовании pandas.assign?' +
      wrapCodeBlock(`import pandas as pd\ndf = pd.DataFrame({'value': [1, 2, 3]})\nprint(df.assign(ratio=lambda d: d.value / d.value.sum()))`),
    answer: 'Добавится столбец ratio с долей строки от суммы, assign не мутирует оригинал без присваивания.',
    tags: ['pandas'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как работает numpy broadcasting в примере?' +
      wrapCodeBlock(`import numpy as np\narr = np.array([1, 2, 3])\nprint(arr + np.array([10]))`),
    answer: 'Результат [11 12 13]; скалярный массив расширяется до размера arr.',
    tags: ['numpy'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что выведет использование pathlib.glob?' +
      wrapCodeBlock(`from pathlib import Path\nfiles = sorted(Path('data').glob('*.csv'))\nprint(len(files))`),
    answer: 'Подсчитает количество CSV файлов в каталоге data (по маске, без рекурсии).',
    tags: ['filesystem'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что делает метод DataFrame.pipe?' +
      wrapCodeBlock(`import pandas as pd\ndf = pd.DataFrame({'x': [1, 2, 3]})\nresult = (df\n  .pipe(lambda d: d.assign(y=d.x**2))\n  .pipe(lambda d: d[d.y > 3]))\nprint(result)`),
    answer: 'Позволяет строить читаемые конвейеры: сначала добавляет y=x^2, затем фильтрует строки где y>3.',
    tags: ['pandas'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как работает typing.TypedDict?' +
      wrapCodeBlock(`from typing import TypedDict\n\nclass Event(TypedDict):\n    name: str\n    value: float\n\ndef normalize(event: Event) -> float:\n    return event['value'] / 100\n\nprint(normalize({'name': 'sql', 'value': 25}))`),
    answer: 'TypedDict описывает структуру словаря для статической проверки. Вывод 0.25.',
    tags: ['typing'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что делает asyncio.gather в примере?' +
      wrapCodeBlock(`import asyncio\n\nasync def job(name, delay):\n    await asyncio.sleep(delay)\n    return name\n\nasync def main():\n    results = await asyncio.gather(job('A', 0.1), job('B', 0.2))\n    print(results)\n\nasyncio.run(main())`),
    answer: 'Запускает корутины параллельно и возвращает список их результатов: [\'A\', \'B\'].',
    tags: ['asyncio'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как работает heapq.nlargest?' +
      wrapCodeBlock(`import heapq\nnums = [5, 1, 10, 3]\nprint(heapq.nlargest(2, nums))`),
    answer: '[10, 5] — два наибольших элемента без полной сортировки.',
    tags: ['heapq'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Что выведет код с Fraction?' +
      wrapCodeBlock(`from fractions import Fraction\nprint(Fraction(1, 3) + Fraction(1, 6))`),
    answer: 'Вернёт Fraction(1, 2) — точные рациональные числа без округлений.',
    tags: ['fractions'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как работает csv.DictWriter для записи отчётов?' +
      wrapCodeBlock(`import csv\nrows = [{'metric': 'MAU', 'value': 1000}]\nwith open('metrics.csv', 'w', newline='') as f:\n    writer = csv.DictWriter(f, fieldnames=['metric', 'value'])\n    writer.writeheader()\n    writer.writerows(rows)`),
    answer: 'Создаёт CSV с заголовком metric,value и строкой 1000. DictWriter ожидает словари с указанными полями.',
    tags: ['csv'],
  },
];
const PYTHON_CONCEPT_PROMPTS = [
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'В чём разница между multiprocessing и threading для аналитических задач?',
    answer: 'threading подходит для I/O (зависит от GIL), multiprocessing создаёт процессы и масштабирует CPU-bound расчёты, но дороже по памяти.',
    tags: ['performance'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Зачем использовать pyarrow/parquet при выгрузке данных?',
    answer: 'Parquet — колонночный формат со сжатием и схемой. PyArrow позволяет быстро писать/читать аналитические наборы и интегрируется с Pandas/Spark.',
    tags: ['io'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Почему стоит использовать poetry/pip-tools для управления зависимостями?',
    answer: 'Они фиксируют версии, создают lock-файлы и позволяют воспроизводимые окружения для аналитических скриптов и Airflow DAG.',
    tags: ['tooling'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Когда prefer vectorized Pandas API вместо apply?',
    answer: 'Vectorized операции выполняются на C-уровне и обрабатывают массивы, поэтому работают на порядки быстрее, чем row-wise apply с Python функцией.',
    tags: ['pandas', 'performance'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Что даёт typing.Literal и когда его применять?',
    answer: 'Literal ограничивает аргумент набором строк/чисел (например, режимы метрики). Это повышает читаемость и позволяет линтерам ловить опечатки.',
    tags: ['typing'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Почему полезно использовать mypy/pyright в аналитических кодовых базах?',
    answer: 'Статический анализ находит несоответствия типов в ETL, особенно при работе с DataFrame схемами и helper-функциями.',
    tags: ['quality'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как TypedDict помогает описать событие трекинга?',
    answer: 'TypedDict фиксирует обязательные и опциональные поля события, обеспечивает автодополнение и ранний контроль схемы.',
    tags: ['tracking'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Когда следует использовать pathlib вместо os.path?',
    answer: 'Pathlib предоставляет объектно-ориентированный API, безопасное объединение путей и одинаково работает на Windows/Linux, что уменьшает ошибки в пайплайнах.',
    tags: ['pathlib'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Что такое pandas.eval и чем он полезен?',
    answer: 'pandas.eval выполняет выражения на основе numexpr, ускоряя вычисления и позволяя обращаться к столбцам без df["col"].',
    tags: ['pandas'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Почему важно фиксировать random seed в экспериментах и моделях?',
    answer: 'Семенa делают результаты воспроизводимыми: выборка train/test, bootstrap и симуляции дают одинаковые итерации.',
    tags: ['reproducibility'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Зачем использовать logging вместо print?',
    answer: 'logging поддерживает уровни (info, warning, error), форматирование и вывод в файлы, что критично в ETL и бэчах.',
    tags: ['logging'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Когда полезно выносить бизнес-правила в Pydantic модели?',
    answer: 'Pydantic валидирует входные данные, автоматически преобразует типы и документирует схемы API/ETL.',
    tags: ['validation'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Что такое lazy evaluation в Polars и какие преимущества даёт?',
    answer: 'Polars строит план выполнения и оптимизирует его (predicate pushdown, projection). Это ускоряет сложные агрегаты по сравнению с eager Pandas.',
    tags: ['polars'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Почему стоит избегать chained assignment в Pandas?',
    answer: 'df[df.x>0].y = 1 создаёт копию и не гарантирует запись. Лучше использовать loc или assign, чтобы явно обновить данные.',
    tags: ['pandas'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Какие преимущества у poetry scripts для аналитика?',
    answer: 'Poetry scripts позволяют описать CLI команды в pyproject и запускать обработчики одной командой без написания shell-скриптов.',
    tags: ['tooling'],
  },
];
const STATS_FORMULA_PROMPTS = [
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как вычислить стандартную ошибку пропорции при конверсии 15% на выборке 8 000 пользователей?',
    answer: 'Используем формулу \\(SE = \\sqrt{p(1-p)/n}\\). Подставляем p=0.15, n=8000 ⇒ SE ≈ 0.0040 (0.4 п.п.).',
    tags: ['standard-error', 'proportions'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как построить 95% доверительный интервал для среднего времени сессии (μ̂ = 12 мин, σ = 4, n = 100)?',
    answer: 'CI = \\( \\bar{x} \\pm z_{0.975} \\cdot \\frac{\sigma}{\\sqrt{n}} \\) ⇒ 12 ± 1.96 * 0.4 ⇒ (11.22; 12.78).',
    tags: ['confidence-interval'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как рассчитать t-статистику для разницы средних (mean_A=120, mean_B=125, sd=30, n=400)?',
    answer: 't = (125 - 120) / (30 * sqrt(2/400)) ≈ 1.49. Этого недостаточно для 0.05.',
    tags: ['t-test'],
  },
  {
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Как применить дельта-метод к метрике ARPU = revenue/users?',
    answer: 'Аппроксимируем функцией \\(g(x,y)=x/y\\). Производные: \\(g_x=1/y, g_y=-x/y^2\\). Var(g) ≈ g_x^2 Var(x)+g_y^2 Var(y) - 2 g_x g_y Cov(x,y).',
    tags: ['delta-method'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Чем отличается односторонний и двусторонний тест и когда выбирать каждый?',
    answer: 'Двусторонний проверяет любое отличие (CUPED, качество). Односторонний — когда нас заботит улучшение в конкретную сторону и есть весомое обоснование.',
    tags: ['hypothesis-testing'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как оценить мощность теста при минимальном эффекте 1 п.п., σ=0.03 и n=20k?',
    answer: 'Используем формулу power для z-теста: \\(z_{power} = (d \\sqrt{n})/σ - z_{1-α/2}\\). Подставляем d=0.01 ⇒ z_power≈1.49 ⇒ мощность ≈ 0.93.',
    tags: ['power'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как работает критерий χ² на примере таблицы конверсий?',
    answer: 'Строим таблицу 2×2 (success/fail). χ² = Σ ((obs-exp)²/exp). Значение сравниваем с χ²(1) чтобы проверить независимость варианта и исхода.',
    tags: ['chi-square'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое pooled variance в t-тесте и почему его используют?',
    answer: 'Pooled variance \\(\\hat{σ}^2 = ((n_A-1)σ_A^2 + (n_B-1)σ_B^2)/(n_A+n_B-2)\\) объединяет дисперсии, если предположим их равными и повышает устойчивость.',
    tags: ['t-test'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как вычислить эффект по метрике ratio с помощью лог-преобразования?',
    answer: 'Берём \\(\ln(Y/X)\\), строим доверительный интервал для лог-разницы и затем экспоненцируем. Это симметризует распределение и эквивалентно дельта-методу.',
    tags: ['transformations'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как посчитать стандартную ошибку медианы через бутстрэп?',
    answer: 'Проводим B перемулированных выборок, для каждой находим медиану и измеряем стандартное отклонение полученных значений — это и есть SE.',
    tags: ['bootstrap'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что означает p-value = 0.03 и почему это не вероятность гипотезы?',
    answer: '0.03 — вероятность увидеть столь экстремальные данные, если H0 верна. Это не P(H0|data); для этого нужен Байес.',
    tags: ['p-value'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как корректировать множественные проверки с помощью Holm-Bonferroni?',
    answer: 'Сортируем p-values, последовательно сравниваем с α/(m-i+1). Как только тест незначим — следующие считаем незначимыми. Метод менее консервативен чем классический Bonferroni.',
    tags: ['multiple-testing'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'В чём отличие доверительного интервала пропорции Вальда и Уилсона?',
    answer: 'Интервал Уилсона корректирует асимметрию и работает лучше на краях (p≈0 или 1). Формула: \\( (p + z^2/(2n) ± z \\sqrt{p(1-p)/n + z^2/(4n^2)}) / (1+z^2/n) \\).',
    tags: ['confidence-interval'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как интерпретировать доверительный интервал, который включает 0?',
    answer: 'Если CI разницы средних пересекает 0, мы не можем отвергнуть H0 на выбранном уровне — эффект статистически незначим.',
    tags: ['interpretation'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое sequential test и как контролировать α-расход?',
    answer: 'Например, тест SPRT или alpha-spending: заранее определяем график «расхода» альфа при каждом просмотре данных, чтобы сохранять общий уровень значимости.',
    tags: ['sequential-tests'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как работает CUPED и какую формулу использует?',
    answer: 'Y_adj = Y - θ(X - \\(\\bar{X}\\)), где θ = Cov(Y,X)/Var(X). Это уменьшает дисперсию за счёт ковариаты X (pre-metric).',
    tags: ['cuped'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Когда применять критерий Манна–Уитни вместо t-теста?',
    answer: 'Когда распределение не нормальное, есть выбросы или интересует различие медиан/распределений. Манна–Уитни сравнивает ранги (функции распределения).',
    tags: ['nonparametric'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как посчитать дисперсию суммы двух независимых метрик?',
    answer: 'Var(X+Y) = Var(X) + Var(Y). В коде часто берут стандартные ошибки и складывают квадраты: \\(SE_{total} = \\\sqrt{SE_X^2 + SE_Y^2}\\).',
    tags: ['variance'],
  },
  {
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Что такое delta-method для логарифма и чем он полезен?',
    answer: 'Если g(x)=ln(x), то g\'(x)=1/x. Для оценки распределения ln(X) используем Var(g(X)) ≈ (1/μ^2) Var(X). Это позволяет строить CI для относительных изменений.',
    tags: ['delta-method'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как оценить размер выборки для A/B при ожидаемом uplift 5% и power 80%?',
    answer: 'Используем формулу пропорций: \\(n = 2 \\cdot \\frac{(z_{1-α/2} \\sqrt{2p(1-p)} + z_{power} \\sqrt{p_1(1-p_1)+p_2(1-p_2)})^2}{(p_1 - p_2)^2}\\). Подставляем p=baseline, получаем требуемый n.',
    tags: ['sample-size'],
  },
];
const PROBABILITY_CASE_PROMPTS = [
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Монета подбрасывается 8 раз. Какова вероятность ровно трёх решек?',
    answer: 'Используем схему Бернулли: \\(C_8^3 \\cdot 0.5^8 = 56 / 256 = 0.21875\\).',
    tags: ['bernoulli'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'В ящике 5 хороших и 2 бракованных деталей. Какова вероятность достать браковку без возвращения на втором шаге?',
    answer: 'P = (5/7)*(2/6) + (2/7)*(1/6) = 10/42 + 2/42 = 12/42 ≈ 0.2857.',
    tags: ['conditional'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Классическая задача на формулу полной вероятности: push-кампания отправляется 40% базы с конверсией 6%, остальным 2%. Какая итоговая конверсия?',
    answer: 'P = 0.4×0.06 + 0.6×0.02 = 0.036.',
    tags: ['total-probability'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как применить теорему Байеса: вероятность спама 10%, фильтр ловит 95% спама и ошибается на 1% нормальных писем.',
    answer: 'P(spam|flag) = 0.95×0.1 / (0.95×0.1 + 0.01×0.9) ≈ 0.913.',
    tags: ['bayes'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Сколько перестановок можно составить из слова «analysis»?',
    answer: 'Всего 8 букв, буква «a» встречается 2 раза, «n» 1, «l» 1, «y»1, «s»2, «i»1. Формула: 8!/(2!·2!) = 10 080.',
    tags: ['permutations'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Какова вероятность из 3 независимых экспериментов (p=0.3) получить хотя бы один успех?',
    answer: '1 - (1 - 0.3)^3 = 0.657.',
    tags: ['probability'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Сформулируйте и примените закон больших чисел к оценке конверсии.',
    answer: 'LLN: среднее сходится к ожиданию. При росте выборки средняя конверсия \\(\\hat{p}\\) приближается к истинной p, поэтому дисперсия падает ~1/n.',
    tags: ['lln'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как воспользоваться ЦПТ для оценки суммы чеков?',
    answer: 'Сумма независимых чеков при n ≥ 30 приближается нормальным распределением \\(N(nμ, nσ^2)\\). Можно строить доверительные интервалы и z-тест.',
    tags: ['clt'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как вычислить вероятность по формуле Бернулли: n=12 писем, p открытия = 0.4, хотим ≥8 открытий?',
    answer: 'Суммируем C_{12}^k p^k (1-p)^{12-k} для k=8..12. Численно ≈ 0.053.',
    tags: ['bernoulli'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Сколько комбинаций выбрать 4 эксперимента из 12 возможных?',
    answer: 'Сочетания: \\(C_{12}^4 = 495\\).',
    tags: ['combinatorics'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Вероятность дефекта на линии A = 3%, на B = 1%. 70% деталей с линии A. Найдите вероятность, что дефектная деталь с линии B.',
    answer: 'P(B|defect) = 0.01×0.3 / (0.03×0.7 + 0.01×0.3) ≈ 0.125.',
    tags: ['bayes'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как оценить вероятность «минимум два успеха» при n=5 и p=0.2?',
    answer: '1 - [P(0)+P(1)] = 1 - [(0.8^5) + (5×0.2×0.8^4)] ≈ 0.2627.',
    tags: ['bernoulli'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Чем отличается независимость событий от условной независимости?',
    answer: 'Независимые: P(A∩B)=P(A)P(B). Условно независимые: P(A∩B|C)=P(A|C)P(B|C). При анализе удержания учитывайте сегменты (канал C).',
    tags: ['independence'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Какова вероятность того, что два случайных пользователя родились в один месяц?',
    answer: 'P = 1/12 ≈ 0.0833 при равномерном распределении месяцев.',
    tags: ['classical'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'hard',
    question: 'Как использовать формулу полной вероятности для каналов привлечения и конверсии?',
    answer: 'Если каналы H_i образуют полную группу, то \\(P(конверсия) = \\sum_i P(конверсия|H_i) P(H_i)\\). Это позволяет понять вклад каждого канала без смешивания аудиторий.',
    tags: ['total-probability'],
  },
];
const AB_SCENARIO_PROMPTS = [
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Когда использовать switchback дизайн вместо классического сплит-теста?',
    answer: 'Если невозможно закрепить пользователя за вариантом (например, алгоритм распределяет курьеров). В switchback трафик переключают по расписанию и сравнивают периоды.',
    tags: ['switchback'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как проверить SRM до запуска основного анализа?',
    answer: 'Построить таблицу распределения по вариантам и провести χ²-тест. Если p-value < 0.01, эксперимент недействителен.',
    tags: ['srm'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'В чём преимущества CUPED и какие данные нужны?',
    answer: 'Нужна коррелирующая метрика до эксперимента. CUPED снижает дисперсию и позволяет быстрее достичь значимости.',
    tags: ['cuped'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Когда выбирать стратифицированную рандомизацию?',
    answer: 'При сильных различиях по платформе/каналу. Стратификация обеспечивает равные пропорции в вариантах и уменьшает дисперсию.',
    tags: ['stratification'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как объяснить дельта-метод продуктовой команде?',
    answer: 'Мы линейризуем сложную метрику (ratio, retention) через производную, чтобы оценить дисперсию и построить доверительный интервал без бутстрэпа.',
    tags: ['delta-method'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Зачем применять CUPAC к retention?',
    answer: 'Это аналог CUPED для категориальных ковариат: удержание корректируется по активности/каналу, что уменьшает шум.',
    tags: ['variance-reduction'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как интерпретировать uplift = +2 п.п. при доверительном интервале (-1; +5)?',
    answer: 'Эффект статистически незначим — интервал включает 0. Рекомендация: продолжить тест или улучшить дизайн.',
    tags: ['interpretation'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Почему sequential tests требуют корректировки уровня значимости?',
    answer: 'Многократный просмотр данных увеличивает шанс ложноположительного результата. Используют alpha-spending или методы Покока/О’Брайен–Флеминга.',
    tags: ['sequential-tests'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Когда выбирать дизайн holdout vs PSA (pre-post analysis)?',
    answer: 'PSA (до/после) подходит при маленьком трафике. Holdout хорош для длительных экспериментов с постоянным контролем.',
    tags: ['design'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как работает CUPED при наличии нескольких pre-metrics?',
    answer: 'Можно использовать регрессию: Y_adj = Y - βᵀ(X - \\\(\\\bar{X}\\\)). Это расширение стандартного CUPED с несколькими ковариатами.',
    tags: ['cuped'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Что такое guardrail метрики и зачем они нужны?',
    answer: 'Это показатели, которые не должны ухудшиться (latency, отказ). Они помогают вовремя остановить вредный эксперимент.',
    tags: ['guardrail'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Когда стоит применять diff-in-diff вместо A/B?',
    answer: 'Если нет возможности рандомизировать, но есть контрольная группа во времени (внедрение цены на части регионов).',
    tags: ['quasi-experiment'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как трактовать метрику probability to be best в Bayesian тестах?',
    answer: 'Это вероятность, что вариант превосходит другие по целевой метрике с учётом апостериорного распределения.',
    tags: ['bayesian'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Почему нельзя останавливать тест по достижению p-value < 0.05 без поправок?',
    answer: 'p-value становится условным на момент остановки и увеличивает риск ошибки I рода. Нужны правила остановки или sequential control.',
    tags: ['stopping-rules'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Что такое CUPED lift и как его интерпретировать?',
    answer: 'Lift считается на скорректированной метрике Y_adj. Его можно переводить в проценты, но важно сообщать, что коррекция меняет дисперсию.',
    tags: ['cuped'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'hard',
    question: 'Как применять CUPED при выраженной сезонности?',
    answer: 'Нужна pre-metric, собранная в те же дни недели/часы. Иначе ковариата не захватит цикличность и дисперсия не снизится.',
    tags: ['seasonality'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Что такое variance inflation factor (VIF) в дизайне эксперимента?',
    answer: 'VIF показывает, насколько возрастает дисперсия оценки из-за несбалансированных ковариат. Высокий VIF — сигнал пересмотреть стратификацию.',
    tags: ['design'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Когда полезно сочетать CUPED и стратификацию?',
    answer: 'Когда есть мощная ковариата и неоднородность трафика. Стратификация гарантирует баланс, CUPED убирает остаточный шум.',
    tags: ['best-practices'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как объяснить разницу между статистической и практической значимостью?',
    answer: 'Статистическая — эффект не случаен. Практическая — импакт достаточен для бизнеса. Можно получить статистику без практической выгоды.',
    tags: ['communication'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Зачем использовать holdout для маркетинговых кампаний?',
    answer: 'Часть аудитории не получает коммуникацию, что позволяет точно измерить uplift и учесть сезонность/внешние факторы.',
    tags: ['marketing'],
  },
];
const MCQ_SQL_PROMPTS = [
  {
    category: 'SQL',
    difficulty: 'easy',
    question: 'Какой оператор вернёт первые N строк без гарантии порядка?',
    options: ['LIMIT', 'WHERE', 'GROUP BY', 'ORDER BY'],
    correctOptionIndex: 0,
    answer: 'LIMIT ограничивает число строк, но порядок задаёт ORDER BY.',
    tags: ['basics'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какая функция вернёт долю строки в группе?',
    options: ['RANK()', 'ROW_NUMBER()', 'RATIO_TO_REPORT()', 'NTILE()'],
    correctOptionIndex: 2,
    answer: 'RATIO_TO_REPORT (или value / SUM(value) OVER PARTITION) даёт процент внутри группы.',
    tags: ['window-functions'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какой индекс выбрать для поиска WHERE user_id = ? AND created_at BETWEEN ...?',
    options: [
      'Индекс только по created_at',
      'Составной (user_id, created_at)',
      'Hash по created_at',
      'GIN по JSON',
    ],
    correctOptionIndex: 1,
    answer: 'Составной B-Tree по user_id, created_at соответствует условию и позволяет range scan.',
    tags: ['indexes'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Что делает DISTINCT ON в PostgreSQL?',
    options: [
      'Удаляет дубликаты всех столбцов',
      'Оставляет первую строку по сортировке для указанного набора полей',
      'Создаёт индекс',
      'Аналог GROUP BY',
    ],
    correctOptionIndex: 1,
    answer: 'DISTINCT ON берет первую строку каждого ключа согласно ORDER BY.',
    tags: ['postgres'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какой тип JOIN вернёт строки без совпадений из обеих таблиц?',
    options: ['LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN', 'INNER JOIN'],
    correctOptionIndex: 2,
    answer: 'FULL OUTER JOIN сохраняет все строки и заполняет NULL, если пары нет.',
    tags: ['joins'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Когда стоит использовать WINDOW FRAME ROWS BETWEEN?',
    options: [
      'Когда нужно учитывать только фиксированное число предыдущих строк',
      'Чтобы заменить GROUP BY',
      'Для фильтрации',
      'Для pivot таблиц',
    ],
    correctOptionIndex: 0,
    answer: 'ROWS BETWEEN определяет окно по количеству строк (например, 7 предыдущих дней).',
    tags: ['window-frame'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Что делает оператор LATERAL?',
    options: [
      'Создаёт индекс',
      'Позволяет подзапросу использовать столбцы из текущей строки внешнего запроса',
      'Выполняет транзакцию',
      'Формирует CTE',
    ],
    correctOptionIndex: 1,
    answer: 'LATERAL обеспечивает доступ к колонкам внешнего запроса внутри подзапроса.',
    tags: ['advanced'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какой оператор помогает посчитать скользящее среднее без оконных функций?',
    options: ['JOIN того же запроса', 'Подзапрос в SELECT', 'GROUP BY', 'UNNEST'],
    correctOptionIndex: 0,
    answer: 'Можно сделать self join по диапазону дат, но это менее эффективно чем windows.',
    tags: ['alternative'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Что такое CUBE в GROUP BY?',
    options: [
      'Построение 3D-графика',
      'Все комбинации группировок по указанным измерениям',
      'Ускорение вычислений',
      'Создание временной таблицы',
    ],
    correctOptionIndex: 1,
    answer: 'CUBE строит агрегации для всех сочетаний и общего итога.',
    tags: ['olap'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как выбрать медиану в PostgreSQL?',
    options: [
      'median(col)',
      'percentile_disc(0.5) WITHIN GROUP (ORDER BY col)',
      'AVG(col)',
      'NTILE(2)',
    ],
    correctOptionIndex: 1,
    answer: 'percentile_disc (или percentile_cont) возвращает медиану при сортировке.',
    tags: ['percentile'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Что вернёт COUNT(DISTINCT CASE WHEN event = \\\"purchase\\\" THEN user_id END)?',
    options: [
      'Всех пользователей',
      'Количество покупок',
      'Количество пользователей с покупкой',
      'NULL',
    ],
    correctOptionIndex: 2,
    answer: 'Считает уникальных пользователей, у которых событие purchase.',
    tags: ['conditional'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какой подход реализует anti-join (оставить только записи без совпадений)?',
    options: [
      'LEFT JOIN ... WHERE right.id IS NULL',
      'INNER JOIN',
      'CROSS JOIN',
      'FULL JOIN',
    ],
    correctOptionIndex: 0,
    answer: 'LEFT JOIN с проверкой NULL на правой таблице возвращает только строки без пары.',
    tags: ['anti-join'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Чем отличается UNION ALL от UNION?',
    options: [
      'UNION ALL сохраняет дубликаты и быстрее, UNION убирает дубликаты',
      'UNION ALL работает только в PostgreSQL',
      'UNION ALL сортирует',
      'UNION ALL требует одинаковые столбцы',
    ],
    correctOptionIndex: 0,
    answer: 'UNION ALL не убирает дубликаты и не сортирует, что быстрее.',
    tags: ['set-operations'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какой агрегат посчитает «что вернёт код» для частоты событий за окно?',
    options: ['AVG', 'COUNT', 'STDDEV', 'SUM DISTINCT'],
    correctOptionIndex: 1,
    answer: 'COUNT OVER (ROWS BETWEEN ...) используется для частоты событий.',
    tags: ['window-functions'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Какой тип коллекции сохраняет порядок добавления с Python 3.7+?',
    options: ['dict', 'set', 'frozenset', 'heap'],
    correctOptionIndex: 0,
    answer: 'Стандартный dict сохраняет порядок, set — нет.',
    tags: ['dict'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Какой модуль использовать для многопроцессорной обработки CPU-bound задач?',
    options: ['threading', 'asyncio', 'multiprocessing', 'sched'],
    correctOptionIndex: 2,
    answer: 'multiprocessing создаёт отдельные процессы и обходит GIL.',
    tags: ['performance'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Какой способ чтения CSV наиболее экономичный по памяти?',
    options: [
      'pd.read_csv без аргументов',
      'pd.read_csv(..., chunksize=10000)',
      'pd.DataFrame.from_dict',
      'json.load',
    ],
    correctOptionIndex: 1,
    answer: 'Чтение чанками (chunksize) позволяет стримить файл и обрабатывать порциями.',
    tags: ['pandas'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Какой тип данных стоит выбрать для столбца с кодами категорий в Pandas?',
    options: ['object', 'int8', 'category', 'datetime64'],
    correctOptionIndex: 2,
    answer: 'category экономит память и ускоряет группировки.',
    tags: ['pandas'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Что делает метод DataFrame.query?',
    options: [
      'Создаёт SQL запрос',
      'Фильтрует строки через строковое выражение',
      'Переименовывает столбцы',
      'Строит pivot',
    ],
    correctOptionIndex: 1,
    answer: 'query позволяет писать выражение наподобие SQL прямо в строке и фильтровать DataFrame.',
    tags: ['pandas'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Какой тип коллекции хранит только уникальные элементы и запоминает порядок?',
    options: ['set', 'list', 'dict', 'OrderedDict'],
    correctOptionIndex: 3,
    answer: 'OrderedDict хранит пары ключ-значение и порядок добавления.',
    tags: ['collections'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Какой тест использовать для проверки равенства дисперсий?',
    options: ['Levene', 't-test', 'Mann–Whitney', 'χ²'],
    correctOptionIndex: 0,
    answer: 'Levene (или Bartlett) проверяет равенство дисперсий.',
    tags: ['variance'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Какой критерий выбрать при нормальности и одинаковых дисперсиях?',
    options: ['t-тест Стьюдента', 'U-тест Манна–Уитни', 'Колмогоров–Смирнов', 'F-тест'],
    correctOptionIndex: 0,
    answer: 'Классический t-тест оптимален при соблюдении допущений.',
    tags: ['t-test'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что показывает величина effect size (Cohen’s d)?',
    options: [
      'Вероятность ошибки',
      'Нормированную разницу средних',
      'Долю объяснённой вариации',
      'Размер выборки',
    ],
    correctOptionIndex: 1,
    answer: 'Cohen’s d = (μ1 - μ2)/σ_pooled — величина эффекта в σ.',
    tags: ['effect-size'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что означает мощность теста (power)?',
    options: [
      'Вероятность ошибки I рода',
      'Вероятность обнаружить эффект при его наличии',
      'Шанс допустить SRM',
      'Обратное к p-value',
    ],
    correctOptionIndex: 1,
    answer: 'Power = 1 - β — шанс отклонить H0, когда H1 верна.',
    tags: ['power'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Какой подход уменьшает дисперсию без изменения дизайна теста?',
    options: ['CUPED', 'Увеличить трафик', 'SRM', 'Случайное завершение'],
    correctOptionIndex: 0,
    answer: 'CUPED корректирует метрику через ковариату.',
    tags: ['cuped'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Какой метод помогает избежать пересечения пользователей между вариантами?',
    options: [
      'Assign по session_id',
      'Sticky bucketing по user_id',
      'Рандомизация по IP',
      'Перезапускать тест',
    ],
    correctOptionIndex: 1,
    answer: 'Привязка к user_id гарантирует уникальное назначение варианта.',
    tags: ['experimentation'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Что нужно сделать перед sequential test для контроля alpha?',
    options: [
      'Ничего',
      'Определить функцию расхода α',
      'Считать median',
      'Сократить выборку',
    ],
    correctOptionIndex: 1,
    answer: 'Нужен alpha-spending schedule до старта теста.',
    tags: ['sequential-tests'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Каков результат формулы полной вероятности?',
    options: [
      'Сумма вероятностей по непересекающимся гипотезам',
      'Произведение вероятностей',
      'Разность вероятностей',
      'Интервал значений',
    ],
    correctOptionIndex: 0,
    answer: 'P(A) = Σ P(A|H_i)P(H_i).',
    tags: ['total-probability'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Что такое Bernoulli trial?',
    options: [
      'Эксперимент с тремя исходами',
      'Один эксперимент с успехом/неудачей',
      'Непрерывная величина',
      'Событие с бесконечными результатами',
    ],
    correctOptionIndex: 1,
    answer: 'Бернулли — попытка с двумя исходами и вероятностью успеха p.',
    tags: ['bernoulli'],
  },
];
const MSQ_EXTRA_PROMPTS = [
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Какие условия должны быть выполнены для применения Центральной предельной теоремы в аналитике?',
    options: [
      'Независимые наблюдения',
      'Идентичное распределение (или ограниченное влияние одной наблюдаемой)',
      'Наличие сезонности',
      'Достаточно больших выборок',
    ],
    correctOptionIndexes: [0, 1, 3],
    explanation: 'ЦПТ требует независимости, одинакового распределения и большого n. Сезонность не является обязательным условием.',
    tags: ['clt'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Что помогает снизить дисперсию метрик в эксперименте?',
    options: [
      'CUPED / ковариаты',
      'Стратификация по важным признакам',
      'SRM',
      'Использование ratio-метрик без линеаризации',
    ],
    correctOptionIndexes: [0, 1],
    explanation: 'CUPED и стратификация снижают дисперсию. SRM — проблема, а нелинеаризованные ratio могут повысить шум.',
    tags: ['variance-reduction'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Какие подходы помогут ускорить сложный аналитический запрос?',
    options: [
      'Создать covering index',
      'Материализовать промежуточные результаты',
      'Удалить ORDER BY',
      'Использовать EXPLAIN для диагностики',
    ],
    correctOptionIndexes: [0, 1, 3],
    explanation: 'Covering индекс и материализация уменьшают чтение, EXPLAIN показывает план. ORDER BY удалять нельзя, если нужен порядок.',
    tags: ['performance'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Какие приёмы повышают воспроизводимость аналитического кода?',
    options: [
      'Фиксировать random seed',
      'Использовать виртуальные окружения/poetry',
      'Запускать код только локально',
      'Писать детерминированные тесты',
    ],
    correctOptionIndexes: [0, 1, 3],
    explanation: 'Seed, окружения и тесты делают результат воспроизводимым. Место запуска значения не имеет.',
    tags: ['reproducibility'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Какие действия стоит выполнить перед запуском t-теста?',
    options: [
      'Проверить нормальность или применимость ЦПТ',
      'Оценить равенство дисперсий',
      'Сделать bootstrap SRM',
      'Проверить независимость наблюдений',
    ],
    correctOptionIndexes: [0, 1, 3],
    explanation: 't-тест предполагает независимость, нормальность/ЦПТ и равные дисперсии (для классической версии). SRM не связан с тестом.',
    tags: ['t-test'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Какие факторы учитывают при выборе метрик-«сторожей» (guardrail)?',
    options: [
      'UX показатели (ошибки, латентность)',
      'Ключевые бизнес KPI, которые не должны упасть',
      'Случайные вспомогательные графики',
      'Метрики качества данных',
    ],
    correctOptionIndexes: [0, 1, 3],
    explanation: 'Guardrail защищает UX, бизнес и качество данных. Случайные графики не подходят.',
    tags: ['guardrail'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Когда полезно применять оконные функции вместо self join?',
    options: [
      'Сравнение со строкой-предшественником',
      'Расчёт рангов и квантилей',
      'Pivot таблицы',
      'Скользящие агрегаты',
    ],
    correctOptionIndexes: [0, 1, 3],
    explanation: 'Windows удобны для lag/lead, рангов и rolling. Pivot требует других конструкций.',
    tags: ['window-functions'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Какие способы уменьшить объём памяти при работе с Pandas?',
    options: [
      'Указывать dtypes при чтении',
      'Использовать category для повторяющихся строк',
      'Работать только в списках',
      'Читать файл чанками',
    ],
    correctOptionIndexes: [0, 1, 3],
    explanation: 'dtype, category и chunksize экономят память. Списки не решают проблему табличных данных.',
    tags: ['pandas'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Какие признаки говорят о необходимости непараметрического теста?',
    options: [
      'Сильные выбросы',
      'Небольшие выборки',
      'Сильно скошенные распределения',
      'Гомоскедастичность',
    ],
    correctOptionIndexes: [0, 1, 2],
    explanation: 'Выбросы, малые n и скошенность — сигналы для Манна–Уитни/перестановок. Гомоскедастичность не требует непараметрического теста.',
    tags: ['nonparametric'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Какие шаги помогут справиться с сезонностью в экспериментах?',
    options: [
      'Запускать достаточно долго, чтобы покрыть цикл',
      'Использовать switchback',
      'Игнорировать календарь',
      'Стратифицировать по дню недели',
    ],
    correctOptionIndexes: [0, 1, 3],
    explanation: 'Длительность, switchback и стратификация по календарю минимизируют сезонность. Игнорирование ведёт к смещению.',
    tags: ['seasonality'],
  },
];

const SQL_ANALYTICS_PROMPTS = [
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как в SQL построить D1 retention с разрезом по устройству?',
    answer:
      "Соберите когорту регистрации (MIN(event_date) по user_id), джойните события за следующий день и считайте долю пользователей с activity. GROUP BY 1, device_type для сравнения платформ.",
    tags: ['retention', 'device'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как оценить повторные покупки с шагом 30 дней?',
    answer:
      'Используйте WINDOW LAG для дат заказов и сравнивайте разницу: CASE WHEN order_date - LAG(order_date) <= INTERVAL \'30 day\' THEN 1 END. Далее агрегируйте по пользователю.',
    tags: ['window-functions', 'repeat'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как в SQL найти вклад фичи в North Star Metric по сегментам?',
    answer:
      "Считайте метрику (например, отправленные сообщения) и добавьте CASE WHEN feature_flag THEN value ELSE 0 END. Затем агрегируйте по сегментам (country, plan) и сравнивайте долю contribution.",
    tags: ['north-star', 'segmentation'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как построить когорты подписок и их LTV на горизонте 90 дней?',
    answer:
      'Создайте cohort_date = MIN(start_date) per user, агрегируйте платежи с интервалом <= 90 дней и посчитайте SUM(amount)/COUNT(DISTINCT user_id) для каждой cohort_date.',
    tags: ['ltv', 'cohorts'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как обнаружить пользователей, у которых MAU падает две недели подряд?',
    answer:
      'В окне по user_id отсортируйте по неделе и сравните WEEKLY_ACTIVE flag через LAG/LAG 2. CASE WHEN current=0 AND LAG=0 THEN mark drop.',
    tags: ['engagement'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как в SQL посчитать sticky factor = DAU/WAU?',
    answer:
      'Получите таблицы dau и wau по датам, затем джойните по неделе: dau / NULLIF(wau,0). Для прогнозов используйте WINDOW AVG для сглаживания.',
    tags: ['stickiness'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как реализовать детерминистическое сплитование пользователей прямо в SQL?',
    answer:
      "Используйте hash-функцию: MOD(abs(hashtext(CONCAT(user_id, 'salt'))), 100) < 50 — вариант A, иначе B. Это даёт стабильное распределение.",
    tags: ['experiments', 'hashing'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как получить top movers метрики (фичи с максимальным изменением использования)?',
    answer:
      'Сравните usage_count за последние 7 и предыдущие 7 дней, посчитайте delta и ранжируйте через ROW_NUMBER() OVER (ORDER BY delta DESC).',
    tags: ['trends'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как собрать маркетинговый атрибуционный срез last-click в SQL?',
    answer:
      'В событиях пользователей ищите последнее взаимодействие с тэгом utm перед конверсией через LAG и FILTER, затем агрегируйте конверсии по каналу.',
    tags: ['attribution'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как найти пользователей, которые активировали фичу в течение 3 дней после регистрации?',
    answer:
      'Сравните event_date фичи с signup_date через CASE WHEN feature_event BETWEEN signup AND signup+3 THEN 1 END и агрегируйте на уровне пользователя.',
    tags: ['activation'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как посчитать охват эксперимента (exposure) среди MAU?',
    answer:
      'Определите таблицу experiment_assignments и джойн на MAU последнего месяца, затем делите COUNT(DISTINCT exposed)/COUNT(DISTINCT mau_users).',
    tags: ['experiments'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как построить product tree для категорий и посчитать суммарный вклад каждого узла?',
    answer:
      'Используйте RECURSIVE CTE для обхода дерева категорий и агрегируйте продажи, суммируя дочерние узлы. Это позволяет увидеть вклад каждого уровня.',
    tags: ['hierarchy'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question: 'Как посчитать долю уникальных сценариев per user (feature variety)?',
    answer:
      'Соберите COUNT(DISTINCT event_name) per user, затем перераспределите NTILE для сегментов разнообразия и агрегируйте средние по тарифам.',
    tags: ['variety'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как найти пользователей, у которых churn наступил после 45 дней тишины?',
    answer:
      'Используйте LAG(event_date) OVER (PARTITION BY user_id ORDER BY event_date) и пометьте churn, если разрыв > 45 дней и нет новых событий.',
    tags: ['churn'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как построить витрину product-health c KPI по странам?',
    answer:
      'Создайте агрегаты по ключевым метрикам (activation, retention, revenue) GROUP BY country, затем нормируйте (z-score) и объединяйте в health_score через взвешенную сумму.',
    tags: ['health-score'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как учитывать пользователей с несколькими устройствами в MAU?',
    answer:
      'Используйте device_id + user_id таблицу, агрегируйте COUNT(DISTINCT user_id) и COUNT(DISTINCT device_id) для оценки мультиустройств и фильтруйте подозрительные кейсы.',
    tags: ['devices'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как посчитать среднее время между ключевыми действиями (lead time)?',
    answer:
      'Отсортируйте события target_a и target_b, используйте LAG(event_time) FILTER по типу, вычислите разницу и усредните по сегментам.',
    tags: ['lead-time'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как найти feature adoption rate по сегментам тарифа?',
    answer:
      'Для каждой подписки считайте долю пользователей, у которых есть событие feature_use; GROUP BY plan и сравните adoption_rate.',
    tags: ['adoption'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question: 'Как использовать percentile_disc для SLA ответа поддержки по продуктам?',
    answer:
      'GROUP BY product_id и примените percentile_disc(0.9) WITHIN GROUP (ORDER BY response_minutes). Получите SLA p90 и сортируйте продукты по нарушению.',
    tags: ['sla'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как посчитать медианный чек и медианный рост заказа по пользователю?',
    answer:
      'Используйте percentile_disc(0.5) OVER (PARTITION BY user_id ORDER BY order_time) для чека и LAG для роста; результат агрегируйте по сегментам.',
    tags: ['median'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как построить витрину для MDE расчёта по историческим данным?',
    answer:
      'Соберите среднее и стандартное отклонение целевой метрики по неделям, храните их в таблице variance_reference и используйте для вычисления σ и n в калькуляторе MDE.',
    tags: ['mde'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как посчитать ARR contribution новых фичей?',
    answer:
      'Соберите платежи пользователей, у которых включена фича, и сравните их ARR с контрольной группой через SUM(amount) FILTER. Разницу можно делить на общее ARR.',
    tags: ['arr'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как построить cohort retention heatmap без BI?',
    answer:
      'Сгенерируйте pivot таблицу: cohort_month и months_since_signup, затем COUNT(DISTINCT user_id) FILTER (WHERE activity). Используйте CASE и SUM для формата wide.',
    tags: ['retention'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как рассчитать FTE экономию от автоматизации процесса?',
    answer:
      'Храните таблицу task_events с duration, до и после фичи. Через CASE WHEN feature=1 THEN duration ELSE NULL обнуляйте поток, затем сравнивайте среднее время на задачу.',
    tags: ['efficiency'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как найти пользователей, которые выполнили key action > 5 раз подряд?',
    answer:
      'Используйте оконные функции с ROW_NUMBER и LAG для проверки последовательностей либо примените технику “grouping by value - row_number”.',
    tags: ['streaks'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как сравнить конверсию referral vs organic с учётом ретаргета?',
    answer:
      'Сегментируйте пользователей по первому каналу, но исключите тех, кто получил referral после регистрации через EXISTS. Сравните CR по каналам.',
    tags: ['channels'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как оценить влияние push-кампании по holdout группе в SQL?',
    answer:
      'Маркируйте пользователей holdout flag, затем сравнивайте целевую метрику на период кампании через агрегаты и вычисляйте uplift = treatment - holdout.',
    tags: ['holdout'],
  },
  {
    category: 'SQL',
    difficulty: 'hard',
    question: 'Как построить распределение времени от регистрации до оплаты (time-to-pay)?',
    answer:
      'Найдите signup_date и first_payment_date, вычислите разницу и используйте WIDTH_BUCKET/NTILE для распределения. Это помогает сегментировать тормозящих пользователей.',
    tags: ['ttv'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как измерить влияние price experiment на mix товаров?',
    answer:
      'Агрегируйте продажи по variant и product_category, вычислите share = revenue_category / revenue_total и сравните доли между вариантами.',
    tags: ['pricing'],
  },
  {
    category: 'SQL',
    difficulty: 'medium',
    question: 'Как найти пользователей, у которых снизилась глубина сессии на 30%?',
    answer:
      'Посчитайте средний events_per_session за последние 7 и предыдущие 7 дней, добавьте CASE WHEN current < previous*0.7 THEN 1 END и агрегируйте.',
    tags: ['engagement'],
  },
];

const PYTHON_ANALYTICS_PROMPTS = [
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как реализовать детерминированное сплитование пользователей в Python для эксперимента?',
    answer:
      'Используйте хеширование: `def bucket(user_id, salt, buckets=100): return hash(f\"{user_id}{salt}\") % buckets`. Это гарантирует стабильное назначение без БД.',
    tags: ['experiments', 'hashing'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как написать генератор, который построчно читает большой лог и возвращает события пользователя?',
    answer:
      'Создайте generator с `with open(...)` и `for line in f: yield json.loads(line)`. Это экономит память и позволяет стримить данные в пайплайн.',
    tags: ['generators'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как средствами Python быстро оценить MDE?',
    answer:
      'Используйте формулу MDE = z_{α/2} * σ * √(2/n). В коде: `def mde(sigma, n, alpha=0.05): return stats.norm.ppf(1-alpha/2)*sigma*math.sqrt(2/n)`.',
    tags: ['mde'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question:
      'Как с помощью pandas построить воронку "просмотр → корзина → покупка" из событий?',
    answer:
      'Сгруппируйте события по user_id, возьмите MIN timestamp for каждого шага и фильтруйте пользователей, у которых шаг выполнен. Затем посчитайте доли через len(filtered)/len(base).',
    tags: ['funnels'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как реализовать экспоненциально взвешенное среднее в pandas для метрики?',
    answer:
      "Используйте `df['rolling'] = df.metric.ewm(span=7, adjust=False).mean()` — это сглаживает метрику и реагирует на свежие значения.",
    tags: ['pandas'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как сэмулировать распределение статистики и оценить вероятность ошибки II рода?',
    answer:
      'Запустите Монте-Карло: генерируйте выборки при альтернативе, применяйте критерий и считайте долю непринятых H1. Это и есть β-ошибка.',
    tags: ['simulation'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как реализовать случайный итератор для выдачи подсказок в тренажёре?',
    answer:
      'Используйте генератор с `random.shuffle` списка и yield по одному элементу; когда элементы закончились — перетасуйте снова. Это обеспечивает бесконечный поток без повторов.',
    tags: ['iteration'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как организовать слой вычислений метрик в проекте без Airflow?',
    answer:
      'Создайте модуль со словарём метрик и функциями, описывающими SQL/параметры. Поверх напишите CLI (Typer/Click), который вызывает нужные вычисления и логирует результаты.',
    tags: ['architecture'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как проверить качество рандомизации с помощью pandas?',
    answer:
      'Соберите DataFrame с признаками и вариантами, примените groupby + agg для средних и std, затем используйте `scipy.stats.ttest_ind` или χ² на категориальные столбцы.',
    tags: ['experiments'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как рассчитать доверительный интервал для доли методом Уилсона в Python?',
    answer:
      'Используйте формулу Wilson CI или библиотеку statsmodels: `proportion_confint(count, nobs, method=\'wilson\')`. Это устойчиво при малых n.',
    tags: ['confidence-interval'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как написать кастомный bootstrap для произвольной метрики?',
    answer:
      'Создайте функцию, принимающую DataFrame и callable metric. Внутри выполняйте `for _ in range(B): sample = df.sample(frac=1, replace=True); samples.append(metric(sample))` и возвращайте percentiles.',
    tags: ['bootstrap'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как строить распределение времени до события с помощью numpy.histogram?',
    answer:
      'Посчитайте deltas и вызовите `counts, bins = np.histogram(deltas, bins=[0,1,3,7,14,30])`. Нормируйте counts для вероятностей.',
    tags: ['histogram'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как организовать мониторинг показателей в ноутбуке без BI?',
    answer:
      'Используйте `plotly`/`altair` + `ipywidgets` для фильтров. Создайте функции, которые обновляют графики при изменении селекторов, и публикуйте ноутбук через nbviewer/voilà.',
    tags: ['monitoring'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как посчитать FDR c помощью statsmodels?',
    answer:
      'Используйте `from statsmodels.stats.multitest import multipletests` с методом `fdr_bh`. Передайте массив p-values и получите скорректированные значения.',
    tags: ['multiple-testing'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Как построить кумулятивную кривую конверсии по времени жизни пользователя?',
    answer:
      'Отсортируйте пользователей по lifetime_days и примените `np.cumsum` к показателю converted / total. Это помогает увидеть скорость прогрева аудитории.',
    tags: ['lifetime'],
  },
];

const STATS_ADVANCED_PROMPTS = [
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое ошибка первого и второго рода?',
    answer:
      'Ошибка I рода (α) — отклоняем верную H0. Ошибка II рода (β) — не отклоняем ложную H0. Баланс α/β задаёт риск и мощность теста.',
    tags: ['type-i-ii'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как интерпретировать мощность теста?',
    answer: 'Power = 1 - β показывает вероятность обнаружить эффект заданной величины. Рост power требует больше выборки или снижения шума.',
    tags: ['power'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое MDE и как его использовать?',
    answer:
      'MDE (minimal detectable effect) — минимальный относительный эффект, который тест способен заметить при заданных α, β и дисперсии. Он помогает оценить, стоит ли запуск.',
    tags: ['mde'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Чем отличается CDF от PDF?',
    answer:
      'CDF (F(x)) — вероятность X ≤ x, монотонна. PDF f(x) — плотность, производная CDF для непрерывных распределений. Для дискретных аналог — PMF.',
    tags: ['distributions'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как понять, что размер выборки достаточен для ЦПТ?',
    answer:
      'Правила: n ≥ 30, отсутствие тяжёлых хвостов. Но для дискретных распределений с редкими событиями (p<0.05) нужно больше; проверяйте симуляцией.',
    tags: ['clt'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как корректировать множественные проверки методом BH (Benjamini-Hochberg)?',
    answer:
      'Отсортируйте p-values, найдите максимальный i, где p_i ≤ (i/m)*q. Все p_j≤p_i считаются значимыми. Это контролирует FDR, а не FWER.',
    tags: ['multiple-testing'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое ROC-кривая и AUC в задачах аналитика?',
    answer:
      'ROC отображает TPR vs FPR при разных порогах. AUC оценивает способность метрики ранжировать положительные выше отрицательных — полезно при отборе лидов.',
    tags: ['binary'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как построить доверительный интервал на разницу пропорций с учётом корреляции (paired test)?',
    answer:
      'Используйте дельта-метод с ковариацией: Var(p1 - p2) = Var(p1) + Var(p2) - 2Cov. В парных данных Cov>0 уменьшает SE.',
    tags: ['paired'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое функция выживания (survival function)?',
    answer:
      'S(t) = P(T > t) = 1 - CDF. В аналитике её применяют для удержания: вероятность пользователя не отвалиться к моменту t.',
    tags: ['survival'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как оценить hazard rate для SaaS продукта?',
    answer:
      'Hazard = f(t)/S(t) — мгновенная вероятность churn. В SQL можно построить по когортам: churners за t / оставшиеся к t.',
    tags: ['hazard'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как использовать QQ-плот для проверки распределений метрики?',
    answer:
      'Стройте квантиль-квантиль график фактических данных против теоретического нормального распределения. Линейность ⇒ нормальность, изгибы ⇒ отклонения.',
    tags: ['diagnostics'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое pooled variance в тестах?',
    answer:
      'Объединённая оценка дисперсии: ( (n1-1)s1^2 + (n2-1)s2^2 ) / (n1+n2-2 ). Используется в t-тесте при предположении равных дисперсий.',
    tags: ['variance'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как интерпретировать p-value = 0.5?',
    answer:
      'Это значит, что наблюдаемая статистика очень типична при H0. Данных недостаточно, чтобы говорить об эффекте; планируйте MDE/размер выборки заново.',
    tags: ['p-value'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Когда стоит использовать перестановочный (permutation) тест?',
    answer:
      'Когда распределения неизвестны или метрика сложная (median, ratio). Перестановки сохраняют структуру данных и строят эмпирическое распределение статистики.',
    tags: ['permutation'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как оценить дисперсию CLV, если распределение heavy-tail?',
    answer:
      'Примените log-трансформацию или winsorization перед расчётом, либо используйте бутстрэп, чтобы получить доверительные интервалы.',
    tags: ['clv'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Чем sequential test отличается от фиксированного?',
    answer:
      'Sequential позволяет смотреть на данные по расписанию и тратить α постепенно (alpha-spending), тогда как фиксированный требует одного финального замера.',
    tags: ['sequential-tests'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое контроль метрик через Shewhart/EWMA карты?',
    answer:
      'Это статистический процесс-контроль: Shewhart реагирует на резкие скачки, EWMA — на тренды. Помогает мониторить метрики продукта (латентность, CR).',
    tags: ['spc'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как интерпретировать плотность вероятности log-normal распределения в продукте?',
    answer:
      'Время сессии и чек часто log-normal: log(X) ~ Normal(μ, σ). Ожидание = exp(μ + σ²/2), медиана = exp(μ). Делайте выводы в log-пространстве.',
    tags: ['lognormal'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что такое overdispersion в биномиальных метриках?',
    answer:
      'Дисперсия превышает np(1-p) из-за неоднородности пользователей. Нужно применять beta-binomial или стратификацию.',
    tags: ['overdispersion'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как использовать z-скор для мониторинга метрик?',
    answer:
      'z = (x - μ)/σ. Если z выходит за ±3, метрика аномальна. μ и σ можно взять из исторического окна, обновляя их скользяще.',
    tags: ['z-score'],
  },
  {
    category: 'Статистика',
    difficulty: 'hard',
    question: 'Как оценить доверительный интервал для относительного риска (risk ratio)?',
    answer:
      'Используйте лог-преобразование: ln(RR) ± z * sqrt(1/a - 1/(a+c) + 1/b - 1/(b+d)). Экспоненцируйте границы обратно.',
    tags: ['risk'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Как связаны pdf и cdf у экспоненциального распределения?',
    answer:
      'f(x) = λe^{-λx}, F(x) = 1 - e^{-λx}. Экспоненциальное распределение описывает время до события с памятью 0.',
    tags: ['exponential'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Когда стоит применять критерий Колмогорова–Смирнова?',
    answer:
      'Для проверки соответствия распределения теоретическому или сравнения двух непрерывных распределений. В проданалитике применяют на метриках latency.',
    tags: ['ks-test'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Зачем считать skewness/kurtosis для продуктовых метрик?',
    answer:
      'Скос и эксцесс показывают тяжесть хвостов. Если skew >> 1, лучше использовать медиану или log-преобразование перед тестами.',
    tags: ['distribution-shape'],
  },
];

const AB_MATH_PROMPTS = [
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как оценить SRM статистически?',
    answer:
      'Используйте χ² тест на contingency table фактических assign vs ожиданий. Если p-value < 0.01 — SRM, эксперимент останавливаем.',
    tags: ['srm'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как посчитать размер выборки для абсолютного эффекта 0.5 п.п.?',
    answer:
      'n = 2 * (z_{α/2}√(2p(1-p)) + z_{power}√(p1(1-p1)+p2(1-p2)))² / (p1-p2)². В коде можно использовать statsmodels.stats.power.',
    tags: ['sample-size'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Что такое CUPAC и когда его применять?',
    answer:
      'CUPAC корректирует категориальные ковариаты (Channel, Platform) через dummy-регрессию до подсчёта метрики, снижая дисперсию по сегментам.',
    tags: ['variance-reduction'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как реализовать switchback расписание?',
    answer:
      'Определите интервалы (например, час) и чередуйте варианты A/B в каждом слоте. В SQL достаточно добавить schedule таблицу и JOIN по timestamp.',
    tags: ['switchback'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как рассчитать uplift и доверительный интервал для ARPU?',
    answer:
      'Используйте дельта-метод: Var(ARPU) ≈ Var(revenue)/n^2. CI = diff ± z * √(VarA/nA + VarB/nB).',
    tags: ['uplift'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Когда стоит предпочесть diff-in-diff вместо A/B?',
    answer:
      'Когда нельзя рандомизировать пользователей, но есть контрольная группа во времени или регионе. Diff-in-diff контролирует фиксированные эффекты.',
    tags: ['causality'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как учитывать повторные визиты в экспериментах магазина?',
    answer:
      'Используйте user_id для sticky bucketing, избегайте session_id. Для оффлайн событий создавайте surrogate id (телефон/карта).',
    tags: ['assignment'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как рассчитать деление трафика для многовариантного теста (A/B/C)?',
    answer:
      'Назначайте пропорции по формуле n_i ∝ √(σ_i). Если дисперсии сходны — равномерно. Используйте hash bucket с диапазонами.',
    tags: ['multi-armed'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Почему важно отслеживать metric guardrails?',
    answer:
      'Они защищают NPS, время ответа, ошибки. Даже при улучшении целевой метрики отклонения guardrail сигнализируют об отмене запуска.',
    tags: ['guardrail'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как считать комбинированную метрику click-to-purchase?',
    answer:
      'Метрика = conversions / clicks. Для теста используйте дельта-метод и храните обе составляющие (clicks, conversions) для оценки ковариации.',
    tags: ['ratio'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Когда применять CUPED, если нет прецедентных данных?',
    answer:
      'Не стоит — CUPED требует ковариаты, измеренной до эксперимента. Если её нет, используйте стратификацию или сегментный анализ.',
    tags: ['cuped'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как интерпретировать Bayesian probability to beat control?',
    answer:
      'Это апостериорная вероятность, что вариант > контроля. Можно задать порог (например, 95%) и принимать решения быстрее при сильных сигналах.',
    tags: ['bayesian'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как учитывать сезоны при расчёте длительности теста?',
    answer:
      'Определите минимальную единицу сезонности (неделя) и умножьте planned duration на целое число таких периодов, чтобы оба варианта видели одинаковые паттерны.',
    tags: ['seasonality'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Что делать, если метрика имеет heavy tail и t-тест неустойчив?',
    answer:
      'Используйте лог-преобразование, перцентильную метрику или непараметрические методы (bootstrap, Mann–Whitney). Либо измеряйте медиану.',
    tags: ['robustness'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Как тестировать долгие платежные сценарии без влияния на выручку?',
    answer:
      'Применяйте holdout или sequential testing, ограничивайте аудиторию и мониторьте guardrails (GMV). Можно симулировать изменения на когортах.',
    tags: ['payments'],
  },
];

const PROBABILITY_DISTRIBUTION_PROMPTS = [
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Что такое функция распределения (CDF) и какие свойства она имеет?',
    answer:
      'F(x) = P(X ≤ x), монотонна, непрерывна справа, лимиты 0 и 1. Любая CDF полностью описывает закон распределения.',
    tags: ['cdf'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Определите плотность экспоненциального распределения и его ожидание.',
    answer: 'f(x)=λe^{-λx}, E[X]=1/λ, Var[X]=1/λ². Подходит для времени до события без памяти.',
    tags: ['exponential'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как найти вероятности для нормального распределения без таблиц?',
    answer:
      'Используйте стандартное Z=(x-μ)/σ и библиотеку (scipy.stats.norm.cdf). В аналитике часто применяют аппроксимацию Эрфа.',
    tags: ['normal'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Что такое совместное распределение и как вычислить маргинальное?',
    answer:
      'Совместное описывает пары (X,Y). Маргинальное получают интегрированием/суммированием по второй переменной. Например, P(X)=Σ_y P(X,Y).',
    tags: ['joint'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как связаны независимость и факторизация PDF?',
    answer: 'Если X и Y независимы, то f_{X,Y}(x,y)=f_X(x)f_Y(y). Обратно, если равенство выполняется ∀x,y, то X независимы.',
    tags: ['independence'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Что такое характеристическая функция распределения?',
    answer:
      'φ_X(t)=E[e^{itX}]. Она всегда существует и однозначно задаёт распределение, удобна при суммировании независимых СВ.',
    tags: ['characteristic-function'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как интерпретировать β-распределение в задачах Bayes?',
    answer:
      'Beta(α,β) задаёт априори для вероятности успеха. После наблюдений обновляется параметрами α+success, β+fail. Полезно для конверсий.',
    tags: ['beta'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как получить распределение суммы независимых Бернулли (непараметрические p)?',
    answer:
      'Если вероятности разные, сумма имеет Poisson Binomial. Для расчёта используют динамическое программирование или FFT.',
    tags: ['poisson-binomial'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Когда применяют отрицательное биномиальное распределение?',
    answer:
      'Когда моделируют число провалов до k успехов или счётчик событий с overdispersion (маркетинговые отклики).',
    tags: ['negative-binomial'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Что такое закон распределения ошибок (error distribution) и зачем он нужен?',
    answer:
      'Это распределение остатков модели. Если оно нормальное и без смещений, t/z-оценки валидны. В проданалитике проверяют ошибки прогнозов.',
    tags: ['residuals'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как описать распределение минимума независимых экспоненциальных величин?',
    answer:
      'Минимум тоже экспоненциальный с параметром равным сумме λ. Полезно для конкурирующих рисков (какой процесс сработает первым).',
    tags: ['competition'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Чем отличается PMF от PDF?',
    answer:
      'PMF — вероятность точного значения для дискретных величин. PDF — плотность для непрерывных, нужно интегрировать для получения вероятности.',
    tags: ['pmf'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как считать ожидание функции от случайной величины?',
    answer:
      'E[g(X)] = Σ g(x_i)P(x_i) (дискретная) или ∫ g(x)f(x)dx. Это используется при расчёте MSE, энтропии, utility.',
    tags: ['expectation'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Как посчитать ковариацию двух величин?',
    answer: 'Cov(X,Y)=E[(X-EX)(Y-EY)] = E[XY]-EX·EY. Знак показывает связь; нормируйте для корреляции.',
    tags: ['covariance'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Что такое линейность математического ожидания и почему она важна?',
    answer:
      'E[aX + bY] = aE[X] + bE[Y] даже при зависимости. Позволяет упрощать расчёты сумм метрик (например, ARPU) без знания полного распределения.',
    tags: ['expectation'],
  },
];

const MSQ_ANALYTICS_PROMPTS = [
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что влияет на выбор критерия A/B теста?',
    options: [
      'Распределение и дисперсия метрики',
      'Размер выборки и power',
      'Наличие сезонности',
      'Цвет кнопки на лендинге',
    ],
    correctOptionIndexes: [0, 1, 2],
    explanation: 'Статистические свойства метрики и дизайн теста определяют критерий. Цвет кнопки не влияет на выбор статистики.',
    tags: ['experiments'],
  },
  {
    category: 'A/B тесты',
    difficulty: 'medium',
    question: 'Какие параметры требуются для расчёта MDE?',
    options: ['Базовая конверсия', 'Желаемый power', 'Бюджет маркетинга', 'Допустимый α'],
    correctOptionIndexes: [0, 1, 3],
    explanation: 'MDE зависит от baseline, α и β (power). Бюджет напрямую не входит, хотя влияет опосредованно.',
    tags: ['mde'],
  },
  {
    category: 'Теория вероятностей',
    difficulty: 'medium',
    question: 'Какие свойства есть у CDF?',
    options: ['Невозрастает', 'Пределы 0 и 1', 'Правосторонне непрерывна', 'Может уменьшаться'],
    correctOptionIndexes: [1, 2],
    explanation: 'CDF монотонно неубывает, F(-∞)=0, F(+∞)=1 и имеет правую непрерывность.',
    tags: ['cdf'],
  },
  {
    category: 'Статистика',
    difficulty: 'medium',
    question: 'Что помогает снизить дисперсию метрики?',
    options: ['CUPED/CUPAC', 'Стратификация', 'SRM', 'Наблюдение дольше одного дня'],
    correctOptionIndexes: [0, 1, 3],
    explanation: 'Ковариаты, страты и длительность уменьшают шум. SRM — проблема, а не решение.',
    tags: ['variance-reduction'],
  },
  {
    category: 'Python',
    difficulty: 'medium',
    question: 'Какие инструменты подойдут для симуляций экспериментов?',
    options: ['numpy.random', 'pandas', 'scipy.stats', 'bash'],
    correctOptionIndexes: [0, 1, 2],
    explanation: 'NumPy, pandas и SciPy обеспечивают генерацию и анализ. Bash сам по себе не подходит.',
    tags: ['simulation'],
  },
];

export {
  SQL_CODE_CHALLENGES,
  SQL_CONCEPT_PROMPTS,
  PYTHON_SNIPPET_PROMPTS,
  PYTHON_CONCEPT_PROMPTS,
  STATS_FORMULA_PROMPTS,
  PROBABILITY_CASE_PROMPTS,
  AB_SCENARIO_PROMPTS,
  MCQ_SQL_PROMPTS,
  MSQ_EXTRA_PROMPTS,
  SQL_ANALYTICS_PROMPTS,
  PYTHON_ANALYTICS_PROMPTS,
  STATS_ADVANCED_PROMPTS,
  AB_MATH_PROMPTS,
  PROBABILITY_DISTRIBUTION_PROMPTS,
  MSQ_ANALYTICS_PROMPTS,
};