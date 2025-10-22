# вычисления со списками

# вычислим показатель накопленным итогом:
revenue = [100, 200, 300, 400]
accumulated_revenue = []
curr_accum = 0
for r in revenue:
    curr_accum += r
    accumulated_revenue.append(curr_accum)

print(accumulated_revenue)

# вычислим сумму чисел в списке:
print(sum(revenue))
sum_revenue = 0
for r in revenue:
    sum_revenue += r
print('Сумма равна', sum_revenue)

# вычислим длину списка:
print('Длина списка: ', len(revenue))

# вычислим среднее значение в списке:
print('Среднее: ', sum(revenue) / len(revenue))

# максимальное и минимальное значение
print('Минимум: ', min(revenue))
print('Максимум: ', max(revenue))

# комбинация из вышеописанного: вычислить список revenue в процентах от общей суммы:
rev_pct = []
for r in revenue:
    rev_pct.append(100 * r / sum(revenue))

print(rev_pct)
# проверить, что сумма процентов равна 100:
print('Сумма процентов равна 100%: ', sum(rev_pct))
