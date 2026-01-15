should_know = ["Python", "SQL", "Pandas", "Dashboards"]
print(enumerate(should_know))

for pri, what in enumerate(should_know):
    print(pri, what)

# пройтись по итератору и получить весь список:
print(list(should_know))


# есть коллекции, поддерживающие прохождение только 1 раз:
print("One time example")
one_time = zip([1, 2, 3], ['a', 'b', 'c'])
for a, b in one_time:
    print(a, b)

# ничего не получаем, т.к. результат функции zip поддерживает
# один проход от начала до конца.
print(list(one_time))
