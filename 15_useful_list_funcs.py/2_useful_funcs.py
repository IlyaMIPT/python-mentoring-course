prices = [101, 125, 234, 99, 10, 23, 65]

# Все цены больше min_price?
MIN_PRICE = 7
are_more = all([p > MIN_PRICE for p in prices])

# Есть ли хотя бы одна цена меньше 20?
has_simmetric = any([p < 20 for p in prices])


# all, any, sorted, zip, map, filter

# Из исходного списка взять цены меньше 100 (фильтрация)
small_prices = filter(lambda p: p < 10, prices)


# Допустим, prices - это список строк.
str_prices = ['101', '125', '234', '99', '10', '23', '65']
int_prices = list(map(int, str_prices))
print(int_prices)


# соединить два списка
print(zip())
