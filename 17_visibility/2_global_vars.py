PI = 3.14


def get_circle_square(rad: float) -> float:
    print("hint: using PI = ", PI)
    return PI * rad ** 2


def update_pi(new_value: float) -> None:
    global PI  # use this to update global variable
    PI = new_value  # if no global operator, then PI will be local variable
    print('New PI value = ', PI)


update_pi(100)
print(get_circle_square(10))
