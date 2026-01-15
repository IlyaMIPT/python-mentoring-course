# Функции - это пространства имен
# Переменные внутри функции в приоритете над глобальными

rub_per_usd = 90
tax_rate = 0


def convert(usd_val: float) -> float:
    # usd_val доступна только внутри функции
    # и не видна программе выше
    return usd_val * rub_per_usd


def after_tax(salary: float) -> float:
    # tax_rate is local
    tax_rate = 0.13
    if salary >= 2400000:
        tax_rate = 0.14
    return salary * (1 - tax_rate)


print(f"Convert: 1000 USD -> {convert(1000)} RUB")
print("After tax: ", after_tax(10000000), " rub")
