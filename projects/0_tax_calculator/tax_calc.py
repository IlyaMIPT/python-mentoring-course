# Вычислить НДФЛ, который выплачивает сотрудник за год
# Для физических лиц:
# C годовым доходом до 2,4 млн руб. ставка 13%;
# Ставка 15% — для части годового дохода выше 2,4 млн руб. и до 5 млн руб. включительно
#
salary = 200000
accum_salary = 0
THR_13 = 2400000
TAX_13 = 0.13
TAX_15 = 0.15

total_tax = 0.0
for m in range(1, 12):
    accum_salary += salary
    tax = 0.0
    if accum_salary < THR_13:
        tax = salary * TAX_13
    elif accum_salary > THR_13:
        tax = salary * TAX_15
    elif accum_salary + salary >= THR_13:
        tax13 = (THR_13 - accum_salary) * TAX_13
        tax15 = (accum_salary + salary - THR_13) * TAX_15
        tax = tax13+tax15

    print('Эффективная ставка', tax)
    total_tax += tax

print('Годовой НДФЛ', total_tax)
print('Эффективная ставка НДФЛ', round(total_tax / accum_salary * 100), "%")
