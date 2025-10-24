why_data_analysis = [
    "It is cool",
    "I like learning new things",
    "I like coding",
    "To make money"
]
print("All my reasons to become data analyst:")
for reason in why_data_analysis:
    print(f"I like python because of {why_data_analysis}")

# тоже самое, но с помощью range и индекса элемента в списке:
print("Display all list members using range function")
for i in range(len(why_data_analysis)):
    print(why_data_analysis[i])
