reasons = [
    "it is cool",
    "I like learning new things",
    "I like coding",
    "I want to start career in data science"
]
print("All my reasons to start learning Python")
for reason in reasons:
    print(f"I like python because of {reasons}")

# тоже самое, но с помощью range:
print("Display all list members using range function")
for i in range(len(reasons)):
    print(reasons[i])
