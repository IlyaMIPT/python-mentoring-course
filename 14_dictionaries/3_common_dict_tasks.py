# Типичные задачи для словарей
stocks = {
    'MSFT': 541,
    'IBM': 308,
    'TGT': 94,
    'NVDA': 207
}

# получить значение по ключу
print("Курс акций IBM", stocks['IBM'])

# добавить акцию в словарь
stocks['DELL'] = 163

# обойти все элементы словаря в цикле
for company, price in stocks.items():
    print(company, price)

# получить список ключей и значений:
print(list(stocks.keys()))
print(list(stocks.values()))

# обойти все ключи:
for company in stocks:
    print(company, stocks[company])


# получить список всех ключей-значений:
print(stocks.items())

# от словаря к новому словарю: получить топ-3 акции в виде словаря
top_stocks_list = sorted(stocks.items(), key=lambda kvp: kvp[1], reverse=True)
top_stocks = dict(top_stocks_list[:3])
print('Самые дорогие акции:', top_stocks)
