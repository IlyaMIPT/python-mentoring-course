

from typing import Callable


def _check_table(table_name: str) -> Callable[[], bool]:
    checked_table = table_name

    def w() -> bool:
        nonlocal checked_table
        print(checked_table)
        if checked_table == "customer":
            return False
        return True
    w.__name__ = f"check {table_name}"
    return w


def table_checkers(tables: list[str]) -> list[Callable[[], bool]]:
    funcs = []
    for table in tables:
        funcs.append(_check_table(table))
    return funcs


checkers = table_checkers(["order", "customer", "supplier"])
for c in checkers:
    res = c()
    print(f"Checker {res}")
