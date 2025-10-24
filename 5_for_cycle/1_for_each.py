# range - функция, которая возвращает последовательность от начала до конца с определенным шагом.
# range()
for i in range(10):
    print(i)

# for и if
print("Базовая версия range")
min_analyst_salary = 10000
max_analyst_salary = 800000
salary_step = 100000
senior_salary = 500000
junior_salary = 150000
for v in range(min_analyst_salary, max_analyst_salary, salary_step):
    if v < junior_salary:
        print('Вы джун')
    if v > junior_salary and v < senior_salary:
        print("Вы миддл")
    if v > senior_salary:
        print('Вы синьор, жизнь удалась')


# пример со скоростью движения

print("Продвинутая версия")
for v in range(0, 150, 5):
    if 0 <= v <= 60:
        print("Хорошей дороги")
    elif 60 < v <= 80:
        print(f"Вы превышаете. Скорость больше положенной: {v}")
    elif 80 < v < 110:
        print(f"Штраф 500 рублей за превышение скорости: {v} км/ч")
    else:
        print(f"Лишение прав на 3 месяца, скорость {v} км/ч недопустима")
