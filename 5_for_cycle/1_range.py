# одна из самых полезных функций в python - range

print(range(10))
print("Range как список: ", list(range(10)))

# применяется для циклов:
# Пример для Visual Basic:
# dim i as integer
# for i = 0 to 10
#   Debug.Print i
# next
#

for i in range(5):
    print("Цикл 1", i)

for i in range(5, 10):
    print("новый цикл", i)
