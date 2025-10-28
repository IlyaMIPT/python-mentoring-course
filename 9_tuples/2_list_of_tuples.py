# кортежи очень удобно использовать для сложных хранилищ данных

ivan_senior = ('Иван', 'senior', '600')
daria_middle = ('Дарья', 'middle', '500')
sergey_jun = ('Сергей', 'junior', '200')

my_team = [ivan_senior, daria_middle, sergey_jun]

print(my_team)


def get_max_salary(team: list[tuple[str, str, int]]) -> int:
    salaries = []
    for member in team:
        salaries.append(member[2])
    return max(salaries)


print('Максимальная зарплата в отделе', get_max_salary(my_team))
