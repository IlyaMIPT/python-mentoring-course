# Основные арифметические операции

# 1 сложить

# counts
analyst_macbooks_14 = 12
de_macbooks_16 = 5  # de = data engineer

# prices
mac_14_price = 350000
mac_16_price = 500000

# Total fruits count
laptop_count = analyst_macbooks_14 + de_macbooks_16

# Total price:
total_price = analyst_macbooks_14 * mac_14_price + \
    de_macbooks_16 * mac_16_price
avg_price = total_price / laptop_count

print(f"Всего закуплено {laptop_count} шт.")
print(f"Средняя цена компьютера {avg_price} рублей")
