# множества используются для удаления дубликатов из списков

user_ids = [1, 2, 2, 4, 5, 6, 7, 8, 7]
distinct_user_ids = set(user_ids)
print("Список id без дубликатов", list(distinct_user_ids))
