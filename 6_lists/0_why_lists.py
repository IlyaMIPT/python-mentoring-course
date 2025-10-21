# Покупки
good1 = "Соль"
good2 = "Хлеб"
good3 = "Чипсы"
good4 = "Масло"
good5 = "Кефир"
# и так далее.

print("Мои покупки")
print(good1, good2, good3, good4, good5)

# напишем программу, которая печатает на экране "Вредная еда", если в списке покупок есть Чипсы:
JUNK_FOOD = "Чипсы"
if good1 == JUNK_FOOD or \
        good2 == JUNK_FOOD or \
        good3 == JUNK_FOOD or \
        good4 == JUNK_FOOD or \
        good5 == JUNK_FOOD:
    print("Has junk food: Кола")

# такие переменные невозможно обрабатывать единообразно, хотя мы видим, что это нужно.

# используем список:
purchase_list = ["Соль", "Хлеб", "Чипсы", "Масло", "Кефир"]
print(purchase_list)
# мы обращаемся к элементу по индексу:
junk_food = purchase_list[2]
print(junk_food)

# вычислим длину списка
print(len(purchase_list))

# пройдемся по каждому элементу списка:
for i in range(len(purchase_list)):
    print(purchase_list[i])

# распечатать каждый элемент списка
for elem in purchase_list:
    print(elem)

# найти junk-food:
for elem in purchase_list:
    if elem == "Чипсы":
        print(f"Junk food detected: {elem}")
