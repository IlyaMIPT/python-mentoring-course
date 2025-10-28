# аргументы функций и методов
# можно передавать объекты любых типов

# числа
a = 2
b = 1.2


def mult(x: float, y: float) -> float:
    return x * y


print(mult(a, b))


# строки
first_name = "Александр"
middle_name = "Сергеевич"
last_name = "Пушкин"


def get_total_name(s1: str, s2: str, s3: str) -> str:
    return s1 + s2 + s3


# списки

def get_after_tax_sum(sals: list[int]) -> int:
    return round(0.13 * sum(sals))


salaries = [89700, 567813, 234567]
print("Общая сумма:", get_after_tax_sum(salaries))

# а также словари, кортежи, и любые объекты
