# методы или процедуры - это функции, которые ничего не возвращают, а что-то делают

def get_salary_tax(salary: int, tax_rate: float) -> float:
    return salary * tax_rate


def run_tax_calculations(salaries: list[int]):
    total_tax: float = 0
    for s in salaries:
        total_tax += get_salary_tax(s, 0.13)
    print("Всего налогов на команду: ", total_tax)


# недостаточно просто объявить процедуру или функцию
# ее надо вызвать
team_salaries = [350000, 456000, 234000]

# передаем список в качестве аргумента
run_tax_calculations(team_salaries)
