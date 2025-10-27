my_priorities = [
    'learn_python',
    'learn_sql',
    'learn_pandas'
]

# распечатать вместе с номерами:
i = 0
for p in my_priorities:
    print(i, p)
    i += 1

# enumerate
for i, p in enumerate(my_priorities):
    print(i, p)
