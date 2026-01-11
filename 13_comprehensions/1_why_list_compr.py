# list-comprehension или списковые включения

salaries_gross = [200, 300, 350, 400, 530, 680]

tax_rate = 0.13

# вычислим зарплату net как обычно:
salaries_net = []
for s in salaries_gross:
    salaries_net.append(s * (1 - tax_rate))
print('Зарплаты net', salaries_net)

# тоже самое, но с list comprehension:
new_salaries_net = [s * (1-tax_rate) for s in salaries_gross]
print(new_salaries_net)
