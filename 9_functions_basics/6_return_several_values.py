# Функция возвращает несколько значений

def multiply_vector(x: float, y: float, mult: float) -> tuple[float, float]:
    return x * mult, y * mult


new_x, new_y = multiply_vector(10, 20, 1.5)
print("Новые координаты вектора", new_x, new_y)


# пример с зарплатой сотрудника

def get_net_salary(gross_salary: float, tax: float) -> tuple[float, float]:
    return gross_salary, gross_salary * (1 - tax)


analyst_salary = 450000
gross, net = get_net_salary(analyst_salary, 0.13)
print("Зарплата gross", gross, "зарплата net", net)
print("Выплатили государству:", gross - net)
