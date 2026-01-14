from pathlib import Path
from typing import Iterable
# обычный цикл for
for i in [1, 2, 3]:
    print(i)

for s in ["Я", "обрабатываю", "данные"]:
    print(s)


# Читаем файл по 1 строке за раз

script_dir = Path(__file__).parent
file_path = script_dir / Path('./data.txt')

with open(file_path, encoding='UTF-8') as f:
    print('File object is', f)
    print(isinstance(f, Iterable))  # f - это не список
    # мы проходимся в цикле по объекту, который не список и не строка
    for line in f:
        print(line)


# Читаем весь файл целиком
with open(file_path, encoding='UTF-8') as f:
    all_lines = f.readlines()
    print(all_lines)
    for line in all_lines:
        print(line)
