# Фильтрация списков
# список цен продуктов

prices = [203, 345, 80, 40, 70, 20, 54, 76]

# базовая фильтрация: распечатаем цены, которые больше заданной:

MIN_DISPLAY_PRICE = 40
for p in prices:
    if p >= MIN_DISPLAY_PRICE:
        print(p)

# отфильтрованные элементы можно не просто печатать а заносить в другой список
expensive_products = []
for p in prices:
    if p >= MIN_DISPLAY_PRICE:
        expensive_products.append(p)
print(expensive_products)

# Можно создавать списки в цикле, а затем фильтровать их
# создаем список скоростей от 0 до 80 с шагом 10
velocity = []
for v in range(0, 81, 10):  # указываем начало, конец и шаг
    velocity.append(v)
print(velocity)
# фильтруем скорости, которые больше 60:
forbidden_speeds = []
for v in velocity:
    if v > 60:
        forbidden_speeds.append(v)
print(forbidden_speeds)
