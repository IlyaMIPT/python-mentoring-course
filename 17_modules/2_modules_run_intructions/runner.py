# Модули - это файлы, которые исполняеются Python-ом.
# 1. все инструкции, которые будут написаны, будут исполнены
# 2. модуль импортируется 1 раз на запуск программы.

import funcs
from funcs import my_sum  # вывода инструкций не будет

print("Call functions")
funcs.print_message("Hello world")
print(my_sum(1, 2))
print("End of call")
