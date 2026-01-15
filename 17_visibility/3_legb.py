# LEGB rule:

DEFAULT_FROM = 0


def get_range(max: int) -> list[int]:
    # get_range в глобальной области видимости
    # max - локальная, переопределили встроенную функцию
    # range будет найдено в встроенной области видимости
    print("max is", max)

    # def range(a, b):
    #     return [a, b]

    return list(range(DEFAULT_FROM, max))


rng = get_range(10)  # локальной области видимости нет
print(rng)
print('max value is', max(rng))
