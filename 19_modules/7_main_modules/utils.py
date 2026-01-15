def my_sum(a: int, b: int) -> int:
    return a + b


if __name__ == "__main__":
    print("Unit tests")
    assert my_sum(1, 2) == 3
    assert my_sum(-2, 7) == 5
    print("all tests passed")
