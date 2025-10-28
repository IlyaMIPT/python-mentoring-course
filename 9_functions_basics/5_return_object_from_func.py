# pylint: disable=["consider-using-enumerate"]

# вариант 1: функция принимает список и возвращает новый список
def get_net_salaries(gross: list[int], tax: float) -> list[float]:
    net_salaries = []
    for s in gross:
        net_salaries.append(s * (1 - tax))
    return net_salaries


data_analyst_salaries = [300, 400, 250, 600]
print(get_net_salaries(gross=data_analyst_salaries, tax=0.13))


# вариант 2: процедура принимает список и модифицирует его

def apply_tax(salaries: list[int], tax: float = 0.13) -> None:
    for i in range(len(salaries)):
        net_salary = salaries[i] * (1 - tax)
        salaries[i] = round(net_salary)


fin_analysts_salaries = [180, 150, 140, 200]
print("Исходные зарплаты:", fin_analysts_salaries)
apply_tax(fin_analysts_salaries, 0.13)
print("Финальные зарплаты", fin_analysts_salaries)
