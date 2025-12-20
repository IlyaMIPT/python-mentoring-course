from statistics import mean
# list-comprehension или списковые включения

salaries_gross = [200, 300, 350, 400, 530, 680]
tax_rate = 0.13
low_rate = 0.05

# допустим, зарплаты до 300 тыс. включительно облагаются пониженной ставкой 10%:
new_salaries_net = [
    s * (1-tax_rate) if s <= 300 else s * (1-low_rate)
    for s in salaries_gross]
print(new_salaries_net)

# допустим, мы хотим отфильтровать список, вывести зарплаты выше среднего:
avg_salary = mean(salaries_gross)
print([s for s in salaries_gross if s < avg_salary])
