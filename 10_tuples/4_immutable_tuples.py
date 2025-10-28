tai_data = ('Taiwan', '1290', 89)

# изменить данные мы не можем
# tai_data[1] = '1230'
# print(tai_data)

# но можем их прочитать
print(tai_data[0])

# нет метода append, insert, add и т.п.


# но если в кортеже списки, то изменить мы можем
# потому что кортеж - это просто набор ссылок

china_data = ('China', [10, 20, 30], 78)
china_data[1].append(40)

print(china_data)

# как кортежи применяются в реальной работе?
# например, для возврата значений из таблицы базы данных:


def read_orders() -> list[tuple[str, str, int]]:
    """Returns all orders for today

    Returns:
        list[tuple[str, str, int]]: order_id, order_date, sku_count
    """
    return [
        ('25c06a85-6d46-4cd0-8f87-825ef41f600b', '2025-04-07', 15),
        ('ef2eb55c-826b-4450-8fea-9a79caa96c5b', '2025-04-07', 10),
        ('9a659d67-a523-4ced-ad7c-0c30bb559203', '2025-04-07', 8),
        ('62cd25ee-e0bb-472e-a818-9379cf5a3909', '2025-04-07', 17),
    ]
