# pylint: disable=global-statement
# оператор global позволяет создавать глобальные переменные
pi = 3.14


def change_pi(new_value: float) -> None:
    global pi
    pi = new_value


def get_pi() -> float:
    return pi


# change_pi(4.1)
# print("Pi value not is", get_pi())
print("Default value: ", get_pi())
change_pi(5)
print("New pi value", get_pi())
