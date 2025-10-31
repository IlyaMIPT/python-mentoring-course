# Конвертация последовательностей:

# string -> set

hello = set("ппппппррррриииииввввеееетт")
print(hello)  # обратим внимание, порядок не гарантирован

# string -> list:
my_grade = "senior analyst"
print(list(my_grade))

# list -> set (чтобы убрать дубликаты)
print(list(set(my_grade)))
