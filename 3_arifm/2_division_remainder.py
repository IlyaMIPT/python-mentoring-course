# проверим, что число четное

n = 15
remainder = n % 2
print(n, remainder)

# проверим, что число заканчивается на ноль:
n = 110
print(n, n % 10)

# проверим, что платеж можно разбить на две части без копеек:
salary_bonus = 980429
if salary_bonus % 2 == 0:
    print("Бонус выплачивается двумя платежами:", salary_bonus / 2)
else:
    first_quarter_bonus = round(salary_bonus / 2)
    second_quarter_bonus = salary_bonus - first_quarter_bonus
    print(
        "Бонус в 1-ом квартале -", first_quarter_bonus,
        "руб. , во 2-м квартале -", second_quarter_bonus
    )
