# В python функции являются объектами
from typing import Any, Callable


def my_sum(a: int | None, b: int | None) -> int:
    if a is None or b is None:
        raise ValueError("Invalid arguments")
    return a + b


def run(
        f: Callable[[int | None, int | None], int],
        arg1: int,
        arg2: int,
        arg_check: Callable[[Any], tuple[bool, str]]) -> int:
    print("Run function")
    check_1, err_msg_1 = arg_check(arg1)
    check_2, err_msg_2 = arg_check(arg1)
    if not check_1:
        raise ValueError(f"Argument 1 error: {err_msg_1}")
    if not check_2:
        raise ValueError(f"Argument 2 error: {err_msg_2}")
    res = f(arg1, arg2)
    print("End of run")
    return res


def check_not_null(arg: Any) -> tuple[bool, str]:
    return arg is not None, f"{arg} must be not null"


def check_positive(arg: int) -> tuple[bool, str]:
    return arg > 0, f"{arg} must be positive"


print(my_sum(1, 2))

r = run(my_sum, 10, 20, check_positive)
print("Runner function: ", r)
