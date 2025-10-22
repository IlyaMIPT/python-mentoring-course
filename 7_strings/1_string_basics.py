# создание строк
s = "Привет, мир!"

# конкатенация строк:
greetings = "Привет,"
world = "мир!"
message = greetings + " " + world
print(message)

# получить символ строки
print('Первая буква:', message[0])
print('Последняя буква:', message[-1])

# получить диапазон символов:
print('Символы с 8 по 10', message[8: 11])

# сделаем строку маленькими и большими буквами
print(message.upper())
print(message.lower())

# вручную делаем имя с большой буквы
poet = "пушкин"
print(poet[0].upper() + poet[1:])
