from collections import namedtuple
# iterations example:

print("List elements")
for i in [1, 2, 3]:
    print(i)

print("String elements:")
for s in "abcdef":
    print(s)

print("Dictionary keys:")
for k in {"a": 1, "b": 2, "c": 3}:
    print(k)

print("Set elements:")
for elem in {1, 2, 3, 4}:
    print(elem)

print("Tuple elements")
for elem in (1, 2, 3, 4):
    print(elem)


for i in range(10):
    print(i)

ToDoListItem = namedtuple("ToDoListItem", "title, desc, priority")
item = ToDoListItem(
    title="Изучение",
    desc="Изучить дашборды",
    priority="low"
)
print("Named tuple items:")
for it in item:
    print(it)
