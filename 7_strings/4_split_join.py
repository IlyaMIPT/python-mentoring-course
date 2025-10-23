# деление строк на подстроки

poet = "Лермонтов Михаил Юрьевич"
name_parts = poet.split()
print(name_parts)

# можно делить с помощью запятых
user_tasks = "visit page, create account, subscribe, leave page"
print(user_tasks.split(','))

# соединить строки при помощи символа
greatest_poet = " ".join(['Александр', 'Сергеевич', 'Пушкин'])
print('Величайший поэт', greatest_poet)
