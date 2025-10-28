# функции - строительные блоки кода на python
# без фукнций: код состоит из микро-конструкций
# с функциями: код состоит из функций и процедур, мы оперируем макро-конструкциями

def get_base_salary(grade: str) -> int:
    if grade == "junior":
        return 200
    if grade == "middle":
        return 300
    if grade == "senior":
        return 450
    if grade == "lead":
        return 650
    return -1  # значит ошибка


def get_budget(team: list[str], multiple: float) -> int:
    team_budget: float = 0
    for m in team:
        s = get_base_salary(m)
        team_budget += s * multiple
    return round(team_budget)


data_analysts_team = ["junior", "middle", "senior", "lead"]
data_engineers_team = ["lead", "senior", "senior"]

company_budget = 0
company_budget += get_budget(data_analysts_team, 1)
company_budget += get_budget(data_engineers_team, 1.1)

print("Общий бюджет, тыс. руб.", company_budget)
