# Инструменты аналитика
gadget_1 = "Macbook pro 16"
gadget_2 = "Механическая клавиатура 8BitDo"
gadget_3 = "Ретро мышка Lofree"
gadget_4 = "iPad Pro"
gadget_5 = "4К Монитор"
# и так далее.

print("Инструменты аналитика данных")
print(gadget_1, gadget_2, gadget_3, gadget_4, gadget_5)

# Напишем программу, которая показывает необязательные гаджеты:
not_required = "iPad Pro"
if gadget_1 == not_required or \
        gadget_2 == not_required or \
        gadget_3 == not_required or \
        gadget_4 == not_required or \
        gadget_5 == not_required:
    print("Есть необязательные гаджеты")

# такие переменные невозможно обрабатывать единообразно, хотя мы видим, что это нужно.

# используем список:
gadgets = ["Macbook pro 16", "Механическая клавиатура 8BitDo",
           "Ретро мышка Lofree", "iPad Pro", "4К Монитор"]
print(gadgets)
# мы обращаемся к элементу по индексу:
my_keyboard = gadgets[2]
print(my_keyboard)

# вычислим длину списка
print(len(gadgets))

# пройдемся по каждому элементу списка:
for i in range(len(gadgets)):
    print(gadgets[i])

# распечатать каждый элемент списка
for g in gadgets:
    print(g)

# найти клавиатуру:
for g in gadgets:
    if g == "Механическая клавиатура 8BitDo":
        print(f"Клавиатура detected: {g}")
