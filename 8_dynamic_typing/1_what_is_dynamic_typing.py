message = "Hello, data analyst"
message = 1

print(message)

# Все переменный в Python - ссылки на объекты
# В Python все - объект

grades = ["jun", "middle", "senior", "lead", "principal"]
other_grades = grades

# изменим другой объект, но и исходный объект тоже изменится
other_grades[1] = "middle+"
print("Исходный список", grades)
print("Другой список", other_grades)
