# пример позднего связывания в циклах

funcs = []

for i in range(5):
    def inner():
        return i

    funcs.append(inner)

for f in funcs:
    print(f())


# как решить проблему:

print("Variable is saved in enclosing")
new_funcs = []

for i in range(5):
    def save_inner(i):

        def wrapper():
            return i

        return wrapper

    new_funcs.append(save_inner(i))

for f in new_funcs:
    print(f())
