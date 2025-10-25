# вычисления со списками

# вычислим показатель накопленным итогом:
monthly_salary = [400, 420, 440, 500]
accumulated_salary = []
curr_accum = 0
for r in monthly_salary:
    curr_accum += r
    accumulated_salary.append(curr_accum)

print(accumulated_salary)

# вычислим сумму чисел в списке:
print(sum(monthly_salary))
sum_salary = 0
for r in monthly_salary:
    sum_salary += r
print('Сумма равна', sum_salary)

# вычислим длину списка:
print('Длина списка: ', len(monthly_salary))

# вычислим среднее значение в списке:
print('Среднее: ', sum(monthly_salary) / len(monthly_salary))

# максимальное и минимальное значение
print('Минимум: ', min(monthly_salary))
print('Максимум: ', max(monthly_salary))

# комбинация из вышеописанного: вычислить список salary в процентах от общей суммы:
rev_pct = []
for r in monthly_salary:
    rev_pct.append(100 * r / sum(monthly_salary))

print(rev_pct)
# проверить, что сумма процентов равна 100:
print('Сумма процентов равна 100%: ', sum(rev_pct))
