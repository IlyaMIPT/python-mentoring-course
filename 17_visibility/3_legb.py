# pylint: disable=[global-statement, redefined-builtin]
# LEGB rule:

DEFAULT_FROM = 0


def set_default_from(new_value: int) -> None:
    global DEFAULT_FROM
    DEFAULT_FROM = new_value


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
