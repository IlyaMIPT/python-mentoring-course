ivan_senior = ('Иван', 'senior', 600)
daria_middle = ('Дарья', 'middle', 500)
sergey_jun = ('Сергей', 'junior', 200)
fedor_top_manager = ('Федор', 'top manager', 12477)

team = [ivan_senior, sergey_jun, fedor_top_manager, daria_middle]
print(team)
sorted_team = sorted(team, key=lambda member: member[2], reverse=True)
print(sorted_team)
