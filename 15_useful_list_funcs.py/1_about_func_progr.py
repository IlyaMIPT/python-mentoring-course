# Вывести 'положительный' если все элементы в списке больше 0

# Императивное программирование
is_pos = True
lst = [10, -2, 30]
for elem in lst:
    if elem < 0:
        is_pos = False
        break
print("Are all elements positive?", is_pos)

# функциональный подход
print("Are all elements positive? ", all([x > 0 for x in lst]))
