export const METRICS = [
  {
    id: 'dau',
    code: 'DAU',
    name: 'Daily Active Users',
    category: 'Активность',
    tagline: 'Уникальные пользователи, совершившие целевое действие за календарный день.',
    how: 'Берём события активности (app_open, session_start, ключевые действия) за день и считаем уникальных пользователей.',
    why: 'База для понимания ежедневной аудитории, сезонности, ретеншна и нагрузки.',
    formula: 'DAU = COUNT(DISTINCT user_id) за день по событиям активности',
    tips: [
      'Зафиксируй список событий активности и единый часовой пояс.',
      'Исключи тестовые и пустые user_id.',
    ],
    sql: `SELECT
  DATE(event_timestamp) AS date,
  COUNT(DISTINCT user_id) AS dau
FROM events
WHERE event_timestamp >= CURRENT_DATE - INTERVAL '30 day'
  AND event_name IN ('app_open', 'session_start', 'feature_use')
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'wau',
    code: 'WAU',
    name: 'Weekly Active Users',
    category: 'Активность',
    tagline: 'Уникальные пользователи, активные в пределах одной недели.',
    how: 'Считаем уникальных пользователей по событиям активности по неделям.',
    why: 'Сглаживает шум DAU, помогает видеть тренды по неделям, более устойчивая метрика во времени.',
    formula: 'WAU = COUNT(DISTINCT user_id) за неделю',
    tips: [
      'Используй один стандарт (ISO week или с понедельника) в отчётах.',
      'Отдельно проверяй праздничные недели: они искажают картину.',
    ],
    sql: `SELECT
  DATE_TRUNC('week', event_timestamp) AS week,
  COUNT(DISTINCT user_id) AS wau
FROM events
WHERE event_timestamp >= CURRENT_DATE - INTERVAL '90 day'
  AND event_name IN ('app_open', 'session_start', 'feature_use')
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'mau',
    code: 'MAU',
    name: 'Monthly Active Users',
    category: 'Активность',
    tagline: 'Уникальные пользователи, активные хотя бы раз за месяц.',
    how: 'Считаем уникальных пользователей по событиям активности внутри календарного месяца.',
    why: 'Оценка охвата продукта, база для LTV и платёжного потолка. Сглаживает шум дневных пиков.',
    formula: 'MAU = COUNT(DISTINCT user_id) за календарный месяц',
    tips: [
      'Для сравнения брать только полные месяцы.',
      'Определение активности должно совпадать с DAU/WAU.',
    ],
    sql: `SELECT
  DATE_TRUNC('month', event_timestamp) AS month,
  COUNT(DISTINCT user_id) AS mau
FROM events
WHERE event_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month')
  AND event_name IN ('app_open', 'session_start', 'feature_use')
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'stickiness',
    code: 'DAU/MAU',
    name: 'Stickiness Factor',
    category: 'Активность',
    tagline: 'Доля месячной аудитории, которая заходит в продукт ежедневно.',
    how: 'Делим DAU на MAU в рамках одного месяца.',
    why: 'Характеризует привычку и ценность продукта. Высокая доля = сильное удержание.',
    formula: 'Stickiness = DAU / MAU (для дня внутри месяца)',
    tips: [
      'Смотри месяцы целиком, а не отдельные дни.',
      'Для редких сценариев нормальный уровень 0.05–0.15.',
    ],
    sql: `WITH daily AS (
  SELECT DATE(event_timestamp) AS date, COUNT(DISTINCT user_id) AS dau
  FROM events
  WHERE event_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND event_timestamp <  DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')
    AND event_name IN ('app_open', 'session_start', 'feature_use')
  GROUP BY 1
),
monthly AS (
  SELECT DATE_TRUNC('month', event_timestamp) AS month, COUNT(DISTINCT user_id) AS mau
  FROM events
  WHERE event_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND event_timestamp <  DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')
    AND event_name IN ('app_open', 'session_start', 'feature_use')
  GROUP BY 1
)
SELECT
  d.date,
  d.dau,
  m.mau,
  ROUND(d.dau::decimal / NULLIF(m.mau, 0), 3) AS dau_to_mau
FROM daily d
JOIN monthly m ON DATE_TRUNC('month', d.date) = m.month
ORDER BY d.date DESC;`,
  },
  {
    id: 'dod',
    code: 'DoD',
    name: 'Day over Day',
    category: 'Динамика',
    tagline: 'Дневной рост/падение метрики в сравнении с предыдущим днём.',
    how: 'Берём ежедневный показатель (например DAU), считаем относительное изменение к вчера.',
    why: 'Быстро ловит аномалии и влияние акций. Но шумно, стоит смотреть в паре с недельным сглаживанием.',
    formula: 'DoD = (Текущий день - Вчера) / Вчера',
    tips: [
      'Проверяй сезонность: понедельники vs выходные.',
      'Используй и абсолютный, и относительный дельты.',
    ],
    sql: `WITH daily AS (
  SELECT DATE(event_timestamp) AS date, COUNT(DISTINCT user_id) AS dau
  FROM events
  WHERE event_timestamp >= CURRENT_DATE - INTERVAL '30 day'
  GROUP BY 1
)
SELECT
  date,
  dau,
  LAG(dau) OVER (ORDER BY date) AS prev_dau,
  ROUND((dau - LAG(dau) OVER (ORDER BY date))::decimal / NULLIF(LAG(dau) OVER (ORDER BY date), 0), 3) AS dod
FROM daily
ORDER BY date DESC;`,
  },
  {
    id: 'mom',
    code: 'MoM',
    name: 'Month over Month',
    category: 'Динамика',
    tagline: 'Темп роста метрики по месяцам.',
    how: 'Берём помесячный показатель (выручка, MAU) и делим разницу на прошлый месяц.',
    why: 'Оценивает устойчивый тренд без шума дня недели. Хорошо для выручки, ARPU, MAU.',
    formula: 'MoM = (Текущий месяц - Прошлый) / Прошлый',
    tips: [
      'Сравнивай только полные месяцы.',
      'Разделяй органику и кампании, чтобы понять драйвер.',
    ],
    sql: `WITH monthly AS (
  SELECT DATE_TRUNC('month', order_timestamp) AS month, SUM(amount) AS revenue
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '7 month')
  GROUP BY 1
)
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
  ROUND((revenue - LAG(revenue) OVER (ORDER BY month))::decimal / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 3) AS mom
FROM monthly
ORDER BY month DESC;`,
  },
  {
    id: 'yoy',
    code: 'YoY',
    name: 'Year over Year',
    category: 'Динамика',
    tagline: 'Рост метрики год к году за сравнимый период.',
    how: 'Берём показатель за месяц/квартал и сравниваем с тем же периодом прошлого года.',
    why: 'Учитывает сезонность. Нужен для оценки реального роста, а не сезонных всплесков.',
    formula: 'YoY = (Период текущего года - Период прошлого года) / Период прошлого года',
    tips: [
      'Сравни сопоставимые календари (кол-во недель).',
      'Проверь, что база прошлого года очищена от аномалий.',
    ],
    sql: `WITH monthly AS (
  SELECT DATE_TRUNC('month', order_timestamp) AS month, SUM(amount) AS revenue
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '24 month')
  GROUP BY 1
),
prev_year AS (
  SELECT month + INTERVAL '1 year' AS month, revenue AS revenue_prev
  FROM monthly
)
SELECT
  m.month,
  m.revenue,
  p.revenue_prev,
  ROUND((m.revenue - p.revenue_prev)::decimal / NULLIF(p.revenue_prev, 0), 3) AS yoy
FROM monthly m
LEFT JOIN prev_year p ON p.month = m.month
ORDER BY m.month DESC;`,
  },
  {
    id: 'activation',
    code: 'Activation Rate',
    name: 'Процент активации пользователей',
    category: 'Продукт',
    tagline: 'Доля новых пользователей, дошедших до ключевого действия за N дней.',
    how: 'Берём новых пользователей, ищем событие активации в окне (например 7 дней) и делим.',
    why: 'Показывает, как онбординг доводит до ценности. Чувствительна к качеству трафика.',
    formula: 'Activation = Activated users / New users (за окно)',
    tips: [
      'Чётко фиксируй событие активации и окно (обычно 1–7 дней).',
      'Считай когортно по дате регистрации, не по календарным дням.',
    ],
    sql: `WITH new_users AS (
  SELECT
    user_id,
    created_at AS signup_ts,
    created_at::date AS signup_date
  FROM users
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 day'
),
activations AS (
  SELECT DISTINCT nu.user_id
  FROM new_users nu
  JOIN events e ON e.user_id = nu.user_id
  WHERE e.event_name = 'activation_event'
    AND e.event_timestamp >= nu.signup_ts
    AND e.event_timestamp <  nu.signup_ts + INTERVAL '7 day'
)
SELECT
  nu.signup_date,
  COUNT(DISTINCT nu.user_id) AS new_users,
  COUNT(DISTINCT a.user_id) AS activated_users,
  ROUND(COUNT(DISTINCT a.user_id)::decimal / NULLIF(COUNT(DISTINCT nu.user_id), 0), 3) AS activation_rate
FROM new_users nu
LEFT JOIN activations a ON a.user_id = nu.user_id
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'retention_d7',
    code: 'Retention',
    name: 'Retention N Days',
    category: 'Удержание',
    tagline: 'Доля когорты, вернувшаяся в окно после N дней. Пример расчёта для 7 дней.',
    how: 'Берём когорту по дате начала периода, считаем долю активных в окне [D7, D7+1). Для другого N меняем окно.',
    why: 'Отвечает, становится ли продукт привычкой. Для LTV и прогнозов окупаемости важны разные горизонты.',
    formula: 'Retention N Days = Вернувшиеся в окно Dn / Размер когорты (пример: D7).',
    tips: [
      'Используй то же определение активности, что для DAU.',
      'Проверь таймзоны и очисти мусорные события.',
    ],
    sql: `WITH cohort AS (
  SELECT
    user_id,
    created_at AS signup_ts,
    created_at::date AS signup_date
  FROM users
  WHERE created_at >= CURRENT_DATE - INTERVAL '60 day'
),
d7_returns AS (
  SELECT DISTINCT c.user_id
  FROM cohort c
  JOIN events e ON e.user_id = c.user_id
  WHERE e.event_name IN ('app_open','session_start','feature_use')  -- same activity definition!
    AND e.event_timestamp >= c.signup_ts + INTERVAL '7 day'
    AND e.event_timestamp <  c.signup_ts + INTERVAL '8 day'
)
SELECT
  c.signup_date,
  COUNT(DISTINCT c.user_id) AS cohort_size,
  COUNT(DISTINCT r.user_id) AS returned,
  ROUND(COUNT(DISTINCT r.user_id)::decimal / NULLIF(COUNT(DISTINCT c.user_id), 0), 3) AS retention_d7
FROM cohort c
LEFT JOIN d7_returns r ON r.user_id = c.user_id
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'rolling_retention_30',
    code: 'Rolling 30d',
    name: 'Rolling Retention 30d',
    category: 'Удержание',
    tagline: 'Доля когорты, вернувшаяся хотя бы раз после 30-го дня с регистрации.',
    how: 'Берём активных в выбранном периоде (start_date), считаем, кто вернулся хотя бы раз после +30 дней.',
    why: 'Показывает, есть ли долгосрочная привычка, важна для подписок и контента.',
    formula: 'Rolling Retention 30d = Пользователи периода, вернувшиеся после +30 дней / Пользователи периода',
    tips: [
      'Используй то же определение активности, что для DAU.',
      'Исключи тестовые аккаунты и пустые user_id.',
    ],
    sql: `WITH cohort AS (
  SELECT
    user_id,
    created_at AS signup_ts,
    created_at::date AS signup_date
  FROM users
  WHERE created_at >= CURRENT_DATE - INTERVAL '120 day'
),
returned_after_30 AS (
  SELECT DISTINCT c.user_id
  FROM cohort c
  JOIN events e ON e.user_id = c.user_id
  WHERE e.event_name IN ('app_open','session_start','feature_use')
    AND e.event_timestamp >= c.signup_ts + INTERVAL '30 day'
)
SELECT
  c.signup_date,
  COUNT(*) AS cohort_size,
  COUNT(*) FILTER (WHERE r.user_id IS NOT NULL) AS returned_after_30d,
  ROUND(COUNT(*) FILTER (WHERE r.user_id IS NOT NULL)::decimal / NULLIF(COUNT(*), 0), 3) AS rolling_retention_30
FROM cohort c
LEFT JOIN returned_after_30 r ON r.user_id = c.user_id
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'churn',
    code: 'Churn Rate',
    name: 'Доля оттока пользователей',
    category: 'Удержание',
    tagline: 'Отток = 1 - retention. Доля прошлой активной базы, которая не вернулась в текущем периоде.',
    how: 'Берём активных в прошлом периоде, смотрим, кто не активен в текущем, делим на прошлую базу.',
    why: 'Ключевой драйвер роста и LTV. Высокий Churn съедает весь приток.',
    formula: 'Churn = 1 - Retention = Ушедшие / Активные в прошлом периоде',
    tips: [
      'Зафиксируй, что является оттоком в компании (например, не пришел спустя 30 дней в продукт).',
      'Строй по сегментам (канал, устройство, тариф) — среднее не показывает проблемы.',
    ],
    sql: `WITH prev_period AS (
  SELECT DISTINCT user_id
  FROM events
  WHERE event_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND event_timestamp < DATE_TRUNC('month', CURRENT_DATE)
),
curr_period AS (
  SELECT DISTINCT user_id
  FROM events
  WHERE event_timestamp >= DATE_TRUNC('month', CURRENT_DATE)
    AND event_timestamp < DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month')
)
SELECT
  COUNT(DISTINCT prev.user_id) AS active_prev,
  COUNT(DISTINCT curr.user_id) AS active_curr,
  COUNT(DISTINCT prev.user_id) FILTER (WHERE curr.user_id IS NOT NULL) AS retained,
  COUNT(DISTINCT prev.user_id) - COUNT(DISTINCT prev.user_id) FILTER (WHERE curr.user_id IS NOT NULL) AS churned,
  ROUND(
    (COUNT(DISTINCT prev.user_id) - COUNT(DISTINCT prev.user_id) FILTER (WHERE curr.user_id IS NOT NULL))::decimal
      / NULLIF(COUNT(DISTINCT prev.user_id), 0),
    3
  ) AS churn_rate
FROM prev_period prev
LEFT JOIN curr_period curr ON curr.user_id = prev.user_id;`,
  },
  {
    id: 'time_to_eat',
    code: 'Time to Eat',
    name: 'Время до получения заказа с момента оформления',
    category: 'Операционка',
    tagline: 'Среднее время от оформления до получения заказа (специфичная для e-grocery).',
    how: 'Берём завершённые доставки, считаем разницу между created_at и delivered_at, берём среднее.',
    why: 'Критично для NPS и повторных заказов в e-grocery. Показывает узкие места логистики.',
    formula: 'Time to Eat = AVG(delivered_at - created_at) для доставленных заказов',
    tips: [
      'Считай по слотам (пик / не пик) и по складам/курьерам.',
      'Фильтруй отмены и тестовые заказы.',
    ],
    sql: `SELECT
  DATE(order_created_at) AS date,
  ROUND(AVG(EXTRACT(EPOCH FROM (delivered_at - order_created_at)) / 60), 1) AS avg_minutes
FROM orders
WHERE status = 'delivered'
  AND delivered_at IS NOT NULL
  AND order_created_at >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'cr_visit_order',
    code: 'CR visit to order',
    name: 'Конверсия из просмотра в заказ',
    category: 'Продукт',
    tagline: 'Доля посетителей/сессий, которые / в которых оформили оплаченный заказ.',
    how: 'Считаем уникальных посетителей за день и долю тех, у кого есть оплаченный заказ в тот же день.',
    why: 'Показывает эффективность сайта/приложения и качества трафика.',
    formula: 'CR (visit→order) = Пользователи с оплач. заказом / Посетители',
    tips: [
      'Определи единицу (пользователь или сессия) и придерживайся её.',
      'Исключи повторные покупки в тот же день, если нужен первый заказ.',
    ],
    sql: `WITH visits AS (
  SELECT user_id, DATE(event_timestamp) AS date
  FROM events
  WHERE event_name = 'session_start'
    AND event_timestamp >= CURRENT_DATE - INTERVAL '30 day'
),
orders_paid AS (
  SELECT user_id, DATE(order_timestamp) AS date
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= CURRENT_DATE - INTERVAL '30 day'
  GROUP BY user_id, DATE(order_timestamp)
)
SELECT
  v.date,
  COUNT(DISTINCT v.user_id) AS visitors,
  COUNT(DISTINCT o.user_id) AS buyers,
  ROUND(COUNT(DISTINCT o.user_id)::decimal / NULLIF(COUNT(DISTINCT v.user_id), 0), 3) AS cr
FROM visits v
LEFT JOIN orders_paid o ON o.user_id = v.user_id AND o.date = v.date
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'cr_cart_order',
    code: 'CR cart to order',
    name: 'Конверсия из корзины в заказ',
    category: 'Продукт',
    tagline: 'Доля пользователей, дошедших от добавления в корзину до оплаченного заказа.',
    how: 'Считаем пользователей с add_to_cart и долю из них с оплаченным заказом в периоде.',
    why: 'Выявляет проблемы оформления: UX, промо, оплата, доставку.',
    formula: 'CR (cart to order) = Оплатившие / Добавившие в корзину',
    tips: [
      'Отдельно смотри по устройствам и способам оплаты.',
      'Исключи тестовые и отменённые заказы.',
    ],
    sql: `WITH cart_users AS (
  SELECT DISTINCT user_id
  FROM events
  WHERE event_name = 'add_to_cart'
    AND event_timestamp >= CURRENT_DATE - INTERVAL '30 day'
),
buyers AS (
  SELECT DISTINCT user_id
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= CURRENT_DATE - INTERVAL '30 day'
)
SELECT
  COUNT(*) AS cart_users,
  COUNT(*) FILTER (WHERE buyers.user_id IS NOT NULL) AS paid_users,
  ROUND(COUNT(*) FILTER (WHERE buyers.user_id IS NOT NULL)::decimal / NULLIF(COUNT(*), 0), 3) AS cr_cart_to_order
FROM cart_users cu
LEFT JOIN buyers ON buyers.user_id = cu.user_id;`,
  },
  {
    id: 'cr_signup_order',
    code: 'CR signup to order',
    name: 'Конверсия из регистрации в заказ',
    category: 'Продукт',
    tagline: 'Доля новых регистраций пользователей, которые сделали первый оплаченный заказ за окно (например, за сессию).',
    how: 'Берём пользователей, зарегистрированных в период, ищем первый оплаченный заказ и делим.',
    why: 'Важна для оценки качества привлечения и онбординга.',
    formula: 'CR (signup / registration to order) = Зарегистрировались с заказом / Все новые',
    tips: [
      'Задай окно (например 14 дней) и фиксируй одинаково в отчётах.',
      'Если много отклонённых платежей — анализируй отдельно.',
    ],
    sql: `WITH cohort AS (
  SELECT user_id, created_at
  FROM users
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 day'
),
first_paid AS (
  SELECT user_id, MIN(order_timestamp) AS first_paid_at
  FROM orders
  WHERE status = 'paid'
  GROUP BY 1
)
SELECT
  DATE(c.created_at) AS signup_date,
  COUNT(*) AS new_users,
  COUNT(*) FILTER (
    WHERE fp.first_paid_at IS NOT NULL
      AND fp.first_paid_at <= c.created_at + INTERVAL '14 day'
  ) AS with_order,
  ROUND(
    COUNT(*) FILTER (
      WHERE fp.first_paid_at IS NOT NULL
        AND fp.first_paid_at <= c.created_at + INTERVAL '14 day'
    )::decimal / NULLIF(COUNT(*), 0),
    3
  ) AS cr_signup_to_order
FROM cohort c
LEFT JOIN first_paid fp ON fp.user_id = c.user_id
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'gmv',
    code: 'GMV',
    name: 'Gross Merchandise Value',
    category: 'Монетизация',
    tagline: 'Выручка: сумма оплаченных заказов.',
    how: 'Суммируем оплату всех завершённых заказов за период.',
    why: 'Базовый денежный объём. Используется в AOV, ARPU, ростовых показателях.',
    formula: 'GMV = SUM(amount) для оплаченных заказов',
    tips: [
      'Исключи возвраты и отмены (status = paid), если интересуют успешные.',
      'Фиксируй валюту и курс, с этим бывают проблемы.',
    ],
    sql: `SELECT
  DATE_TRUNC('day', order_timestamp) AS date,
  SUM(amount) AS gmv
FROM orders
WHERE status = 'paid'
  AND order_timestamp >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'aov',
    code: 'AOV',
    name: 'Average Order Value',
    category: 'Монетизация',
    tagline: 'Средний чек: средняя сумма оплаченного заказа.',
    how: 'Делим выручку на число заказов.',
    why: 'Показывает, как пользователи собирают корзину. Важен для unit-экономики. В Дальнейшем можно соотнести с костами на заказ',
    formula: 'AOV = GMV / Кол-во заказов',
    tips: [
      'Смотри по сегментам: канал, город, категория.',
      'Отдельно анализируй промо и скидки.',
    ],
    sql: `SELECT
  DATE_TRUNC('day', order_timestamp) AS date,
  SUM(amount) AS gmv,
  COUNT(*) FILTER (WHERE status = 'paid') AS orders_paid,
  ROUND(SUM(amount) / NULLIF(COUNT(*) FILTER (WHERE status = 'paid'), 0), 2) AS aov
FROM orders
WHERE status = 'paid'
  AND order_timestamp >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'aiv',
    code: 'AIV',
    name: 'Average Item Value',
    category: 'Монетизация',
    tagline: 'Средняя стоимость единицы товара: GMV / количество товаров.',
    how: 'Берём все проданные позиции, делим суммарную выручку на количество единиц.',
    why: 'Помогает понять структуру чека и влияние ассортимента.',
    formula: 'AIV = GMV / Кол-во проданных единиц',
    tips: [
      'Используй данные order_items, учитывай скидки.',
      'Разделяй по категориям и брендам.',
    ],
    sql: `SELECT
  DATE_TRUNC('day', oi.created_at) AS date,
  SUM(oi.price * oi.quantity) AS gmv,
  SUM(oi.quantity) AS items_sold,
  ROUND(SUM(oi.price * oi.quantity) / NULLIF(SUM(oi.quantity), 0), 2) AS aiv
FROM order_items oi
JOIN orders o ON o.id = oi.order_id AND o.status = 'paid'
WHERE oi.created_at >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'arpu',
    code: 'ARPU',
    name: 'Average Revenue Per User',
    category: 'Монетизация',
    tagline: 'Средняя выручка на одного активного пользователя за период.',
    how: 'Делим оплаченные заказы на активных пользователей периода.',
    why: 'Отражает монетизацию аудитории и потолок выручки.',
    formula: 'ARPU = Выручка / Активные пользователи',
    tips: [
      'Используй оплаченные заказы и ту же активность, что для MAU.',
      'Смотри в разрезе каналов и тарифов.',
    ],
    sql: `WITH revenue AS (
  SELECT DATE_TRUNC('month', order_timestamp) AS month, SUM(amount) AS revenue
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month')
  GROUP BY 1
),
active AS (
  SELECT DATE_TRUNC('month', event_timestamp) AS month, COUNT(DISTINCT user_id) AS mau
  FROM events
  WHERE event_name IN ('app_open', 'session_start', 'feature_use')
    AND event_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month')
  GROUP BY 1
)
SELECT
  r.month,
  r.revenue,
  a.mau,
  ROUND(r.revenue / NULLIF(a.mau, 0), 2) AS arpu
FROM revenue r
JOIN active a ON a.month = r.month
ORDER BY r.month DESC;`,
  },
  {
    id: 'arppu',
    code: 'ARPPU',
    name: 'Average Revenue Per Paying User',
    category: 'Монетизация',
    tagline: 'Средняя выручка на платящего пользователя.',
    how: 'Делим выручку на число уникальных платящих пользователей.',
    why: 'Показывает поведение платящих и эффект апсейлов. Снижение — сигнал к проверке скидок.',
    formula: 'ARPPU = Выручка / Платящие пользователи',
    tips: [
      'Считай платящих как пользователей с оплаченной транзакцией.',
      'Отделяй подписки и разовые платежи.',
    ],
    sql: `WITH payers AS (
  SELECT DISTINCT user_id, DATE_TRUNC('month', order_timestamp) AS month
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month')
),
revenue AS (
  SELECT DATE_TRUNC('month', order_timestamp) AS month, SUM(amount) AS revenue
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month')
  GROUP BY 1
)
SELECT
  r.month,
  r.revenue,
  COUNT(DISTINCT p.user_id) AS payers,
  ROUND(r.revenue / NULLIF(COUNT(DISTINCT p.user_id), 0), 2) AS arppu
FROM revenue r
LEFT JOIN payers p ON p.month = r.month
GROUP BY 1, r.revenue
ORDER BY 1 DESC;`,
  },
  {
    id: 'ltv',
    code: 'LTV',
    name: 'Lifetime Value',
    category: 'Монетизация',
    tagline: 'Суммарная выручка на пользователя за жизненный цикл когорты.',
    how: 'Строим когорты по дате регистрации или другой дате, суммируем оплаченные заказы когорты и делим на размер когорты.',
    why: 'Отвечает, сколько можно тратить на привлечение (CAC) и когда окупится реклама.',
    formula: 'LTV = Сумма оплаченных заказов когорты / Размер когорты',
    tips: [
      'Считай помесячно и накапливай, чтобы видеть насыщение.',
      'Исключи возвраты и тестовые аккаунты.',
    ],
    sql: `WITH cohort AS (
  SELECT user_id, created_at::date AS cohort_date
  FROM users
  WHERE created_at >= CURRENT_DATE - INTERVAL '180 day'
),
revenue AS (
  SELECT c.cohort_date, SUM(o.amount) AS revenue
  FROM cohort c
  LEFT JOIN orders o ON o.user_id = c.user_id AND o.status = 'paid'
  GROUP BY 1
),
cohort_size AS (
  SELECT cohort_date, COUNT(*) AS users
  FROM cohort
  GROUP BY 1
)
SELECT
  cs.cohort_date,
  cs.users,
  r.revenue,
  ROUND(r.revenue / NULLIF(cs.users, 0), 2) AS ltv
FROM cohort_size cs
LEFT JOIN revenue r ON r.cohort_date = cs.cohort_date
ORDER BY cs.cohort_date DESC;`,
  },
  {
    id: 'payback',
    code: 'Payback Period',
    name: 'Срок окупаемости',
    category: 'Маркетинг/финансы',
    tagline: 'Минимальный месяц, где накопленная выручка ≥ накопленных трат на маркетинг.',
    how: 'Суммируем затраты и выручку помесячно, считаем накопления и ищем точку пересечения.',
    why: 'Показывает, когда окупается закупка трафика. Важен для cash-flow и анализа маркетинговых трат.',
    formula: 'Payback Period = min месяц, где накопленная выручка ≥ накопленных затрат',
    tips: [
      'Используй одни и те же курсы валют и исключи возвраты.',
      'Учитывай лаг между кликом и оплатой.',
    ],
    sql: `WITH spend AS (
  SELECT DATE_TRUNC('month', date) AS month, SUM(spend) AS spend
  FROM ad_costs
  WHERE date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month')
  GROUP BY 1
),
revenue AS (
  SELECT DATE_TRUNC('month', order_timestamp) AS month, SUM(amount) AS revenue
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month')
  GROUP BY 1
),
calendar AS (
  SELECT generate_series(
    DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month'),
    DATE_TRUNC('month', CURRENT_DATE),
    INTERVAL '1 month'
  ) AS month
),
merged AS (
  SELECT
    c.month,
    COALESCE(s.spend, 0) AS spend,
    COALESCE(r.revenue, 0) AS revenue
  FROM calendar c
  LEFT JOIN spend s ON s.month = c.month
  LEFT JOIN revenue r ON r.month = c.month
)
SELECT
  month,
  spend,
  revenue,
  SUM(spend) OVER (ORDER BY month) AS cum_spend,
  SUM(revenue) OVER (ORDER BY month) AS cum_revenue,
  CASE WHEN SUM(revenue) OVER (ORDER BY month) >= SUM(spend) OVER (ORDER BY month) THEN 'окупились' ELSE 'ещё нет' END AS status
FROM merged
ORDER BY month;`,
  },
  {
    id: 'roi',
    code: 'ROI',
    name: 'Return on Investment',
    category: 'Маркетинг/финансы',
    tagline: 'Отношение прибыли к расходам на маркетинг.',
    how: 'Берём выручку, вычитаем затраты, делим на затраты.',
    why: 'Показывает эффективность вложений. ROI > 0 значит прибыльность.',
    formula: 'ROI = (Выручка - Расходы) / Расходы',
    tips: [
      'Используй оплаченные заказы и актуальные расходы.',
      'Делай в актуальных срезах для компании.',
    ],
    sql: `SELECT
  date,
  channel,
  SUM(revenue) AS revenue,
  SUM(spend) AS spend,
  ROUND((SUM(revenue) - SUM(spend)) / NULLIF(SUM(spend), 0), 3) AS roi
FROM ad_costs
WHERE date >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1, 2
ORDER BY date DESC;`,
  },
  {
    id: 'roas',
    code: 'ROAS',
    name: 'Return on Ad Spend',
    category: 'Маркетинг/финансы',
    tagline: 'Сколько выручки приносит каждый рубль рекламных расходов.',
    how: 'Делим атрибутированную выручку на рекламные расходы за период или кампанию.',
    why: 'Главная метрика перформанс-маркетинга, ближе к фактической окупаемости чем CTR/CPA.',
    formula: 'ROAS = Revenue_attributed / Ad Spend',
    tips: [
      'Используй одинаковое окно атрибуции для затрат и выручки.',
      'Разделяй разные типы кампании (перфоманс, продвижение и тд).',
    ],
    sql: `SELECT
  date,
  channel,
  SUM(revenue_attributed) AS revenue,
  SUM(spend) AS spend,
  ROUND(SUM(revenue_attributed) / NULLIF(SUM(spend), 0), 3) AS roas
FROM ad_costs
WHERE date >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1, 2
ORDER BY 1 DESC;`,
  },
  {
    id: 'romi',
    code: 'ROMI',
    name: 'Return on Marketing Investment',
    category: 'Маркетинг/финансы',
    tagline: 'Прибыль от маркетинга относительно расходов.',
    how: 'Берём выручку с маркетинга минус расходы, делим на расходы.',
    why: 'Показывает окупаемость маркетинга с учётом маржинальности.',
    formula: 'ROMI = (Marketing Revenue - Marketing Spend) / Marketing Spend',
    tips: [
      'Используй оплаченные заказы и сопоставимое окно атрибуции.',
      'Хорошо работает в срезах каналов/кампаний.',
    ],
    sql: `SELECT
  date,
  channel,
  SUM(revenue_attributed) AS revenue,
  SUM(spend) AS spend,
  ROUND((SUM(revenue_attributed) - SUM(spend)) / NULLIF(SUM(spend), 0), 3) AS romi
FROM ad_costs
WHERE date >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1, 2
ORDER BY 1 DESC;`,
  },
  {
    id: 'ad_spend_share',
    code: 'Ad Spend Share',
    name: 'Доля рекламных расходов',
    category: 'Маркетинг/финансы',
    tagline: 'Адрев (рекламная выручка платформы) / выручка пользователя: какую долю дохода дают рекламные форматы.',
    how: 'Берём рекламную выручку (ad revenue) и делим на суммарную пользовательскую выручку за период.',
    why: 'Показывает вклад рекламы в монетизацию аудитории. Важно для продуктовых решений с рекламой.',
    formula: 'Ad Spend Share = AdRevenue / UserRevenue',
    tips: [
      'Убедись, что ad revenue и пользовательская выручка в одной валюте и таймзоне.',
      'Отдельно смотри по платформам и плейсментам.',
    ],
    sql: `WITH user_rev AS (
  SELECT DATE_TRUNC('month', order_timestamp) AS month, SUM(amount) AS user_revenue
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')
  GROUP BY 1
),
ad_rev AS (
  SELECT DATE_TRUNC('month', date) AS month, SUM(ad_revenue) AS ad_revenue
  FROM ad_revenue
  WHERE date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '3 month')
  GROUP BY 1
)
SELECT
  u.month,
  u.user_revenue,
  a.ad_revenue,
  ROUND(a.ad_revenue / NULLIF(u.user_revenue, 0), 3) AS ad_rev_share
FROM user_rev u
LEFT JOIN ad_rev a ON a.month = u.month
ORDER BY 1 DESC;`,
  },
  {
    id: 'cac',
    code: 'CAC',
    name: 'Customer Acquisition Cost',
    category: 'Маркетинг/финансы',
    tagline: 'Стоимость привлечения одного пользователя.',
    how: 'Делим маркетинговые расходы на количество новых пользователей за период.',
    why: 'Сравнивается с LTV и payback Period. Критична для контроля масштабирования.',
    formula: 'CAC = Расходы на привлечение / Новые пользователи',
    tips: [
      'Согласуй определение нового пользователя (регистрация или первый заказ).',
      'Считай по каналам и кампаниям, чтобы понимать эффективность.',
    ],
    sql: `WITH new_users AS (
  SELECT DATE(created_at) AS date, COUNT(*) AS new_users
  FROM users
  WHERE created_at >= CURRENT_DATE - INTERVAL '30 day'
  GROUP BY 1
),
spend AS (
  SELECT date, SUM(spend) AS spend
  FROM ad_costs
  WHERE date >= CURRENT_DATE - INTERVAL '30 day'
  GROUP BY 1
)
SELECT
  s.date,
  s.spend,
  n.new_users,
  ROUND(s.spend / NULLIF(n.new_users, 0), 2) AS cac
FROM spend s
LEFT JOIN new_users n ON n.date = s.date
ORDER BY 1 DESC;`,
  },
  {
    id: 'cpa',
    code: 'CPA',
    name: 'Cost Per Action',
    category: 'Трафик',
    tagline: 'Стоимость целевой конверсии (регистрация, покупка, лид).',
    how: 'Делим рекламные расходы на количество конверсий за период.',
    why: 'Главная метрика эффективности закупки трафика.',
    formula: 'CPA = Рекламные расходы / Конверсии',
    tips: [
      'Согласуй, что считать конверсией и окно атрибуции.',
      'Учитывай отложенные конверсии (лаг 1–7 дней).',
    ],
    sql: `SELECT
  date,
  channel,
  SUM(spend) AS spend,
  SUM(conversions) AS conversions,
  ROUND(SUM(spend) / NULLIF(SUM(conversions), 0), 2) AS cpa
FROM ad_costs
WHERE date >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1, 2
ORDER BY 1 DESC;`,
  },
  {
    id: 'cpc',
    code: 'CPC',
    name: 'Cost Per Click',
    category: 'Трафик',
    tagline: 'Стоимость одного клика по рекламе или баннеру.',
    how: 'Делим рекламные расходы на количество кликов.',
    why: 'Показывает эффективность закупки и качество креативов.',
    formula: 'CPC = Spend / Clicks',
    tips: [
      'Следи за фродом: фильтруй бот-клики.',
      'Смотри в разрезе площадок и креативов.',
    ],
    sql: `SELECT
  date,
  channel,
  SUM(spend) AS spend,
  SUM(clicks) AS clicks,
  ROUND(SUM(spend) / NULLIF(SUM(clicks), 0), 3) AS cpc
FROM ad_costs
WHERE date >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1, 2
ORDER BY 1 DESC;`,
  },
  {
    id: 'cpm',
    code: 'CPM',
    name: 'Cost Per Mille',
    category: 'Трафик',
    tagline: 'Стоимость тысячи показов.',
    how: 'Делим расходы на показы и умножаем на 1000.',
    why: 'Бенчмарк стоимости охвата. Полезно для оценки и сравнения рекламных кампаний в digital рекламе.',
    formula: 'CPM = Spend / Impressions * 1000',
    tips: [
      'Смотри по площадкам и форматам.',
      'Отфильтруй тестовые показы.',
    ],
    sql: `SELECT
  date,
  channel,
  SUM(spend) AS spend,
  SUM(impressions) AS impressions,
  ROUND((SUM(spend) / NULLIF(SUM(impressions), 0)) * 1000, 2) AS cpm
FROM ad_costs
WHERE date >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1, 2
ORDER BY 1 DESC;`,
  },
  {
    id: 'ctr',
    code: 'CTR',
    name: 'Click-Through Rate',
    category: 'Трафик',
    tagline: 'Конверсия из показа в клик: процент пользователей, кликнувших по карточке/баннеру.',
    how: 'Суммируем показы и клики, делим клики на показы.',
    why: 'Показывает качество креативов и таргета, влияет на стоимость трафика.',
    formula: 'CTR = Clicks / Impressions',
    tips: [
      'Сравнивай по креативам и плейсментам — среднее мало говорит.',
      'Убедись, что показы очищены от тестовых и фродовых.',
    ],
    sql: `SELECT
  date,
  channel,
  SUM(impressions) AS impressions,
  SUM(clicks) AS clicks,
  ROUND(SUM(clicks)::decimal / NULLIF(SUM(impressions), 0), 4) AS ctr
FROM ad_costs
WHERE date >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1, 2
ORDER BY date DESC;`,
  },
  {
    id: 'cta',
    code: 'CTA',
    name: 'Click-to-Action Rate',
    category: 'Трафик',
    tagline: 'Доля кликов, которые дошли до целевого действия (например, регистрации).',
    how: 'Берём клики по источнику и считаем долю, завершившую целевое событие.',
    why: 'Отражает посткликовый опыт: скорость лендинга, форма, UX.',
    formula: 'CTA = Целевые действия / Клики',
    tips: [
      'Используй одно окно атрибуции для кликов и действий.',
      'Сегментируй по устройствам и типам лендинга.',
    ],
    sql: `WITH clicks AS (
  SELECT user_id, DATE(click_timestamp) AS date
  FROM ad_clicks
  WHERE click_timestamp >= CURRENT_DATE - INTERVAL '30 day'
),
actions AS (
  SELECT user_id, DATE(event_timestamp) AS date
  FROM events
  WHERE event_name = 'registration'
    AND event_timestamp >= CURRENT_DATE - INTERVAL '30 day'
)
SELECT
  c.date,
  COUNT(DISTINCT c.user_id) AS click_users,
  COUNT(DISTINCT a.user_id) AS action_users,
  ROUND(COUNT(DISTINCT a.user_id)::decimal / NULLIF(COUNT(DISTINCT c.user_id), 0), 3) AS cta
FROM clicks c
LEFT JOIN actions a ON a.user_id = c.user_id AND a.date = c.date
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'take_rate',
    code: 'Take Rate',
    name: 'Комиссия (take rate)',
    category: 'Монетизация',
    tagline: 'Доля GMV, которую забирает площадка в виде комиссии.',
    how: 'Берём комиссионный доход и делим на GMV.',
    why: 'Ключевая метрика маркетплейсов: баланс монетизации и привлекательности для продавцов.',
    formula: 'Take Rate = Commission Revenue / GMV',
    tips: [
      'Разделяй категории товаров: ставки комиссии разные.',
      'Исключи субсидии и промо, если хочешь чистую ставку.',
    ],
    sql: `WITH gmv AS (
  SELECT DATE_TRUNC('month', order_timestamp) AS month, SUM(amount) AS gmv
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month')
  GROUP BY 1
),
commission AS (
  SELECT DATE_TRUNC('month', payout_date) AS month, SUM(commission_amount) AS commission
  FROM seller_payouts
  WHERE payout_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 month')
  GROUP BY 1
)
SELECT
  g.month,
  g.gmv,
  c.commission,
  ROUND(c.commission / NULLIF(g.gmv, 0), 3) AS take_rate
FROM gmv g
LEFT JOIN commission c ON c.month = g.month
ORDER BY 1 DESC;`,
  },
  {
    id: 'refund_rate',
    code: 'Refund',
    name: 'Доля возвратов',
    category: 'Монетизация',
    tagline: 'Часть заказов, которые были возвращены или отменены после оплаты.',
    how: 'Делим количество/сумму возвратов на оплаченные заказы.',
    why: 'Сильно влияет на реальную выручку и удовлетворённость.',
    formula: 'Refund Rate = Возвраты / Оплаченные заказы',
    tips: [
      'Смотри по категориям и логистике — там чаще проблемы.',
      'Учитывай суммы, а не только количество.',
    ],
    sql: `SELECT
  DATE_TRUNC('day', order_timestamp) AS date,
  COUNT(*) FILTER (WHERE status = 'paid') AS paid_orders,
  COUNT(*) FILTER (WHERE status = 'refunded') AS refunded_orders,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'refunded')::decimal /
    NULLIF(COUNT(*) FILTER (WHERE status = 'paid'), 0),
    3
  ) AS refund_rate
FROM orders
WHERE order_timestamp >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'repeat_rate',
    code: 'Repeat',
    name: 'Доля повторных покупателей',
    category: 'Монетизация',
    tagline: 'Какой процент покупателей сделал 2+ заказа за период.',
    how: 'Считаем покупателей с >=2 оплаченных заказов и делим на всех покупателей периода.',
    why: 'Показывает удержание и ценность продукта, влияет на LTV.',
    formula: 'Repeat Rate = Покупатели с 2+ заказами / Все покупатели',
    tips: [
      'Смотри по когортам первого заказа, а не только по календарю.',
      'Отделяй подписочные модели — там логика другая.',
    ],
    sql: `WITH buyers AS (
  SELECT user_id, COUNT(*) FILTER (WHERE status = 'paid') AS paid_orders
  FROM orders
  WHERE order_timestamp >= CURRENT_DATE - INTERVAL '60 day'
  GROUP BY 1
)
SELECT
  COUNT(*) AS buyers_total,
  COUNT(*) FILTER (WHERE paid_orders >= 2) AS repeat_buyers,
  ROUND(COUNT(*) FILTER (WHERE paid_orders >= 2)::decimal / NULLIF(COUNT(*), 0), 3) AS repeat_rate
FROM buyers;`,
  },
  {
    id: 'purchase_frequency',
    code: 'Frequency',
    name: 'Частота покупок',
    category: 'Монетизация',
    tagline: 'Среднее число покупок на пользователя за период.',
    how: 'Делим количество оплаченных заказов на число уникальных покупателей.',
    why: 'Показывает вовлечённость платящих и потенциал роста GMV.',
    formula: 'Frequency = Оплаченные заказы / Покупатели',
    tips: [
      'Комбинируй с AOV — вместе они дают GMV.',
      'Смотри по сегментам (город, категория, канал).',
    ],
    sql: `WITH orders_paid AS (
  SELECT user_id
  FROM orders
  WHERE status = 'paid'
    AND order_timestamp >= CURRENT_DATE - INTERVAL '30 day'
)
SELECT
  COUNT(*) AS paid_orders,
  COUNT(DISTINCT user_id) AS buyers,
  ROUND(COUNT(*)::decimal / NULLIF(COUNT(DISTINCT user_id), 0), 3) AS purchase_frequency
FROM orders_paid;`,
  },
  {
    id: 'add_to_cart_rate',
    code: 'ATC Rate',
    name: 'Доля добавления в корзину',
    category: 'Продукт',
    tagline: 'Часть пользователей/сессий, которые добавили товар в корзину.',
    how: 'Делим пользователей с add_to_cart на посетителей/сессии.',
    why: 'Ранний сигнал качества каталога и карточек товара.',
    formula: 'ATC Rate = Пользователи с add_to_cart / Посетители',
    tips: [
      'Смотри по источникам трафика и категориям товара.',
      'Отдельно анализируй мобильные/десктоп — UX разный.',
    ],
    sql: `WITH visits AS (
  SELECT user_id, DATE(event_timestamp) AS date
  FROM events
  WHERE event_name = 'session_start'
    AND event_timestamp >= CURRENT_DATE - INTERVAL '30 day'
),
atc AS (
  SELECT DISTINCT user_id, DATE(event_timestamp) AS date
  FROM events
  WHERE event_name = 'add_to_cart'
    AND event_timestamp >= CURRENT_DATE - INTERVAL '30 day'
)
SELECT
  v.date,
  COUNT(DISTINCT v.user_id) AS visitors,
  COUNT(DISTINCT a.user_id) AS atc_users,
  ROUND(COUNT(DISTINCT a.user_id)::decimal / NULLIF(COUNT(DISTINCT v.user_id), 0), 3) AS atc_rate
FROM visits v
LEFT JOIN atc a ON a.user_id = v.user_id AND a.date = v.date
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'session_length',
    code: 'Session Length',
    name: 'Длина сессии',
    category: 'Продукт',
    tagline: 'Средняя продолжительность пользовательской сессии.',
    how: 'Считаем разницу между началом и последним событием сессии.',
    why: 'Показывает вовлечённость и качество контента/UX.',
    formula: 'Avg Session Length = AVG(last_event_ts - session_start_ts)',
    tips: [
      'Используй явный session_id или таймаут (30 мин).',
      'Сегментируй по типу страниц/экранов.',
    ],
    sql: `WITH sessions AS (
  SELECT
    session_id,
    MIN(event_timestamp) AS session_start,
    MAX(event_timestamp) AS session_end
  FROM events
  WHERE event_timestamp >= CURRENT_DATE - INTERVAL '14 day'
  GROUP BY 1
)
SELECT
  ROUND(AVG(EXTRACT(EPOCH FROM (session_end - session_start)) / 60), 2) AS avg_session_minutes
FROM sessions;`,
  },
  {
    id: 'bounce_rate',
    code: 'Bounce',
    name: 'Bounce Rate',
    category: 'Трафик',
    tagline: 'Доля сессий с одним просмотром/событием.',
    how: 'Считаем сессии с одним событием и делим на все сессии.',
    why: 'Отражает качество трафика и релевантность первого экрана.',
    formula: 'Bounce Rate = Однособытийные сессии / Все сессии',
    tips: [
      'Настрой исключения для автособытий.',
      'Смотри по источникам и лендингам.',
    ],
    sql: `WITH sessions AS (
  SELECT session_id, COUNT(*) AS events
  FROM events
  WHERE event_timestamp >= CURRENT_DATE - INTERVAL '14 day'
  GROUP BY 1
)
SELECT
  COUNT(*) AS sessions_total,
  COUNT(*) FILTER (WHERE events = 1) AS bounced,
  ROUND(COUNT(*) FILTER (WHERE events = 1)::decimal / NULLIF(COUNT(*), 0), 3) AS bounce_rate
FROM sessions;`,
  },
  {
    id: 'sla_uptime',
    code: 'SLA Uptime',
    name: 'Доступность сервиса',
    category: 'Операционка',
    tagline: 'Процент времени, когда сервис работал без недоступности.',
    how: 'Берём общее время периода, вычитаем даунтайм и делим на общее время.',
    why: 'Влияет на конверсию, доверие пользователей и KPI платформы.',
    formula: 'Uptime = (Время работы - Даунтайм) / Время работы',
    tips: [
      'Считай по зонам/регионам, если инфраструктура распределена.',
      'Фиксируй виды инцидентов (полный/частичный простой).',
    ],
    sql: `WITH outages AS (
  SELECT
    DATE(started_at) AS date,
    SUM(EXTRACT(EPOCH FROM (ended_at - started_at))) AS downtime_sec
  FROM incidents
  WHERE started_at >= CURRENT_DATE - INTERVAL '30 day'
  GROUP BY 1
)
SELECT
  d.date,
  86400 AS day_seconds,
  COALESCE(o.downtime_sec, 0) AS downtime_sec,
  ROUND((86400 - COALESCE(o.downtime_sec, 0)) / 86400.0, 4) AS uptime
FROM (
  SELECT generate_series(CURRENT_DATE - INTERVAL '29 day', CURRENT_DATE, INTERVAL '1 day')::date AS date
) d
LEFT JOIN outages o ON o.date = d.date
ORDER BY d.date DESC;`,
  },
  {
    id: 'otd',
    code: 'OTD',
    name: 'On-Time Delivery',
    category: 'Операционка',
    tagline: 'Доля заказов, доставленных в обещанное время/слот.',
    how: 'Сравниваем факт доставки с обещанным временем и считаем долю вовремя.',
    why: 'Сильно влияет на NPS и повторные заказы в e-commerce/e-grocery.',
    formula: 'OTD = Доставлено вовремя / Все доставленные',
    tips: [
      'Используй прогноз доставки (ETA) или выбранный слот.',
      'Исключи заказы, где клиент перенёс слот сам.',
    ],
    sql: `SELECT
  DATE(order_created_at) AS date,
  COUNT(*) FILTER (WHERE delivered_at <= promised_at) AS on_time,
  COUNT(*) FILTER (WHERE delivered_at IS NOT NULL) AS delivered,
  ROUND(
    COUNT(*) FILTER (WHERE delivered_at <= promised_at)::decimal /
    NULLIF(COUNT(*) FILTER (WHERE delivered_at IS NOT NULL), 0),
    3
  ) AS otd
FROM orders
WHERE status = 'delivered'
  AND order_created_at >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'cancel_rate',
    code: 'Cancel Rate',
    name: 'Доля отмен',
    category: 'Операционка',
    tagline: 'Часть заказов, отменённых до доставки/оплаты.',
    how: 'Делим отменённые заказы на все оформленные за период.',
    why: 'Показывает качество ассортимента, логистики и оплаты. Высокий показатель бьёт по выручке.',
    formula: 'Cancel Rate = Отменённые / Все оформленные',
    tips: [
      'Сегментируй по причинам отмены и других срезам.',
      'Исключи дубликаты и тестовые заказы.',
    ],
    sql: `SELECT
  DATE(order_created_at) AS date,
  COUNT(*) AS orders_total,
  COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled,
  ROUND(COUNT(*) FILTER (WHERE status = 'cancelled')::decimal / NULLIF(COUNT(*), 0), 3) AS cancel_rate
FROM orders
WHERE order_created_at >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'fulfillment_rate',
    code: 'Fill Rate',
    name: 'Уровень исполнения заказов',
    category: 'Операционка',
    tagline: 'Доля заказанных единиц, которые реально отгружены/доставлены.',
    how: 'Делим отгруженные позиции на заказанные позиции.',
    why: 'Показывает качество стоков и сборки, напрямую влияет на GMV и NPS.',
    formula: 'Fill Rate = Отгруженные единицы / Заказанные единицы',
    tips: [
      'Смотри по складам и категориям — часто проблема в конкретных локациях.',
      'Исключи позиции, заменённые по согласию клиента, если считаешь их успешными.',
    ],
    sql: `SELECT
  DATE(oi.created_at) AS date,
  SUM(oi.quantity_ordered) AS qty_ordered,
  SUM(oi.quantity_fulfilled) AS qty_fulfilled,
  ROUND(SUM(oi.quantity_fulfilled)::decimal / NULLIF(SUM(oi.quantity_ordered), 0), 3) AS fill_rate
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.order_timestamp >= CURRENT_DATE - INTERVAL '30 day'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'aht',
    code: 'AHT',
    name: 'Average Handle Time',
    category: 'Операционка',
    tagline: 'Среднее время обработки обращения в поддержке.',
    how: 'Разница между началом и завершением обращения, среднее по всем кейсам.',
    why: 'Важна для нагрузки на поддержку и удовлетворённости пользователей.',
    formula: 'AHT = AVG(resolved_at - created_at)',
    tips: [
      'Исключи спам/дубликаты и эскалации в другие команды, если они считаются отдельно.',
      'Разделяй по типам запросов: биллинг, доставка, баги.',
    ],
    sql: `SELECT
  DATE(created_at) AS date,
  ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 60), 1) AS aht_minutes
FROM tickets
WHERE created_at >= CURRENT_DATE - INTERVAL '30 day'
  AND resolved_at IS NOT NULL
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'csat',
    code: 'CSAT',
    name: 'Customer Satisfaction',
    category: 'Операционка',
    tagline: 'Средняя оценка удовлетворённости (обычно 1–5) после операции/доставки/диалога.',
    how: 'Берём ответы пользователей, считаем среднюю оценку или долю 4–5.',
    why: 'Отражает восприятие сервиса и часто коррелирует с удержанием.',
    formula: 'CSAT = AVG(score) или Доля оценок 4–5',
    tips: [
      'Сегментируй по типу операции (доставка, саппорт).',
      'Следи за выборкой: низкий отклик искажает результат.',
    ],
    sql: `SELECT
  survey_date,
  COUNT(*) AS responses,
  ROUND(AVG(score), 2) AS csat_avg,
  ROUND(COUNT(*) FILTER (WHERE score >= 4)::decimal / NULLIF(COUNT(*), 0), 3) AS csat_top2
FROM csat_responses
WHERE survey_date >= CURRENT_DATE - INTERVAL '60 day'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
  {
    id: 'nps',
    code: 'NPS',
    name: 'Net Promoter Score',
    category: 'Продукт',
    tagline: 'Индекс лояльности: доля промоутеров минус доля критиков.',
    how: 'Считаем долю ответов 9–10 и 0–6 по опросу “Порекомендуете ли нас?” и вычитаем.',
    why: 'Показывает удовлетворённость и вероятность органического роста.',
    formula: 'NPS = %Promoters (9–10) – %Detractors (0–6)',
    tips: [
      'Собирай ответы регулярно и сегментируй по каналам/платформам.',
      'Исключай повторные ответы одного пользователя в короткий промежуток.',
    ],
    sql: `SELECT
  survey_date,
  ROUND(AVG(CASE WHEN score >= 9 THEN 100 WHEN score <= 6 THEN -100 ELSE 0 END), 1) AS nps
FROM nps_responses
WHERE survey_date >= CURRENT_DATE - INTERVAL '90 day'
GROUP BY 1
ORDER BY 1 DESC;`,
  },
];