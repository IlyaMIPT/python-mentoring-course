# Создание множеств
# 1). через литерал (редкий случай)
event_types = {'create', 'read', 'update', 'delete'}

# 2). через функцию set:

super_user_permissions = set("rwx")  # r - read, w - write, x - execute
analyst_permissions = set('r')
de_permissions = set('rw')
what_de_not_have = super_user_permissions - de_permissions
print('Прав, которых нет у дата-инженера:', what_de_not_have)


# 3). Через set-comprehension:
unique = {x + 1 for x in [1, 2, 2, 3, 4, 5]}
print(unique)
