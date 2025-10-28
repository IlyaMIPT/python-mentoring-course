# зачем нужны кортежи?

stock_prices_db = [
    ('MSFT', 20, 500.0),
    ('IBM', 30, 400.0),
    ('TXN', 100, 250.0),
    ('DELT', 24, 1000.0)
]

# кортежи - позволяют моделировать более сложные структуры, чем список простых типов


def get_max_value_stock(stocks: list[tuple[str, int, float | int]]) -> tuple[str, float]:
    max_ticker = ""
    max_value = 0.0  # или указываем подсказку для типа: max_value: float = 0
    for ticker, cnt, price in stocks:
        curr_value = cnt * price
        if curr_value > max_value:
            max_ticker = ticker
            max_value = curr_value
    return max_ticker, max_value


print("Поиск акции с максимальной стоимостью в портфеле")
max_t, max_v = get_max_value_stock(stock_prices_db)
print(max_t, max_v)
