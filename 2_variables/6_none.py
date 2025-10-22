# Пустые значения None

x = 5
y = None

if x == 5:
    print("Число 5")

if y is None:
    print("Число не определено")


# для чего это нужно?
total_sum = 1000
goods_count = 0
price_per_good = None
if goods_count != 0:
    price_per_good = total_sum / goods_count

if price_per_good is not None:
    print('Средняя цена за товар;')
else:
    print("Цена не определена, число товаров нулевое")

if price_per_good is None:
    print("Ошибка в исходных данных")
