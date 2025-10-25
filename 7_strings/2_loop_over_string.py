#
input_str = "Анализ больших данных"

for s in input_str:
    print(s)


# заменить символы в строке
res = ""
for s in input_str:
    if s == " ":
        res += '_'
    else:
        res += s
print(res)
