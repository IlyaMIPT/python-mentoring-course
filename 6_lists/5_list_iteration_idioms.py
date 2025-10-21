# Есть две идиомы обхода списков от начала до конца
lst = [10, 20, 30, 40]

# для каждого элемента в списке lst
for elem in lst:
    print(elem)

# помним, что можно обратиться к элементу списка по номеру
print('1-ый элемент списка:', lst[1])
print('2-ой элемент списка:', lst[2])
print('Длина списка', len(lst))

for i in range(len(lst)):
    current_element = lst[i]
    print(current_element)
