# вложенные циклы
# выписать все пары чисел, произведение которых равно N
# используем индекс элемента

n = 16
lst = [2, 3, 6, 1, 8, 4]
pairs = []
for i, x in enumerate(lst):
    for j, y in enumerate(lst):
        if x * y == n and i != j:
            pairs.append(f"{x} - {y}")
print(pairs)
