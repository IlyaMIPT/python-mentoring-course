def my_sum(a, b):
    return a + b


print("Сумма двух чисел", my_sum(10, 20))


def get_salary_tax(salary: int, tax_rate: float) -> float:
    if tax_rate == 0:
        return 0
    if tax_rate < 0:
        return -1  # ошибка
    return round(salary * tax_rate)


result = get_salary_tax(salary=380000, tax_rate=0.14)
print(result)
