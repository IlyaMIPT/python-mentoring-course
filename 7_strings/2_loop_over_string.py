#
input_str = "приоритезация"

for s in input_str:
    print(s)


# заменить символы в строке
res = ""
for s in input_str:
    if s == "и":
        res += '_'
    else:
        res += s
print(res)
