# поиск минимального элемента в списке

lst = [10, 20, 5, 7, -4, 8, 9, 15, 6, 7, -1, 2]

min_elem = None
for elem in lst:
    if min_elem is None or elem < min_elem:
        min_elem = elem

print('Минимальный элемент', min_elem)
