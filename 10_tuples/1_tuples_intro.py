ivan_senior = ('Иван', 'senior', '600')
daria_middle = ('Дарья', 'middle', '500')
sergey_jun = ('Сергей', 'junior', '200')

# отобразим кортеж на экране
print(ivan_senior)

# обратимся к элементам кортежа
print('Имя:', ivan_senior[0], 'должность:',
      ivan_senior[1], 'зарплата:', ivan_senior[2])

# обойти элементы кортежа в цикле
for attr in ivan_senior:
    print(attr)

# распаковка элементов кортежа
person, grade, salary = ivan_senior
print(person, grade, salary)
