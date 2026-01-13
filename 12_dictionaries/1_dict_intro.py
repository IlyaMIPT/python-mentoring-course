# что такое словарь?

grades_base_salaries = {
    'junior': 200,
    'middle': 300,
    'senior': 400,
    'lead': 500,
    'principal': 800
}

print(grades_base_salaries)

# зачем нужны словари?
# чтобы можно было получать значения по осознанному ключу, а не по индексу
jun_salary = grades_base_salaries["junior"]
print("Junior salary", jun_salary)

# представим, что у нас есть словарь, состоящий из миллиарда значений ()


def get_order_items() -> dict[str, list[int]]:
    """Возвращает словарь, где ключ - order_id, значение - list of item ids

    Returns:
        dict[str, list[int]]: _description_
    """
    return {
        'order123': [11232, 21212, 12121, 432343, 3232],
        'order567': [1212, 9783, 2121],
        'order890': [121, 211, 965212, 8121, 1434]
        # 1 млрд записей дальше
    }


def get_list_of_order_items() -> list[tuple[str, list[int]]]:
    """Возвращает все заказы в виде списка

    Returns:
        list[tuple[str, list[int]]]: список кортежей (order_id, list of item ids)
    """
    return [
        ('order123', [11232, 21212, 12121, 432343, 3232]),
        ('order567', [1212, 9783, 2121]),
        ('order890', [121, 211, 965212, 8121, 1434])
    ]


all_items = get_order_items()
# получение данные мгновенно
print(all_items["order123"])

# перебор значений от 1 до 1 млрд
items_list = get_list_of_order_items()
for order_id, items_ids in items_list:
    if order_id == "order123":
        print(order_id, items_ids)
