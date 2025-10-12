# ввести данные с клавиатуры и проверить, что это - число

input_s = input("Введите число: ")
if input_s.isnumeric():
    print(input_s, " - это число")
    print(int(input_s) * 2, "Без проблем конвертируем строку в число и умножаем на 2")
else:
    print(f"{input_s} - не число")
