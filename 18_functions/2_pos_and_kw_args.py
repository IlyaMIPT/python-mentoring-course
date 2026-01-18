# позиционные аргументы и ключевые аргументы

ex_rates = {
    ('rub', 'usd'): 100,
    ('rub', 'eur'): 90,
    ('usd', 'eur'): 0.9
}


def convert(money: float, curr: str, to: str) -> float:
    ex_rate = ex_rates[(curr, to)]
    return money / ex_rate


def default_convert(money: float, source: str = 'rub', dest: str = 'usd') -> float:
    ex_rate = ex_rates[(source, dest)]
    return money / ex_rate


# позиционные аргументы
print(convert(10000, 'rub', 'usd'))

# ключевые аргументы (порядок не важен)
print(convert(curr='rub', to='eur', money=1000))

# с использованием стандартных значений
print(default_convert(1000))
print(default_convert(money=1000))
