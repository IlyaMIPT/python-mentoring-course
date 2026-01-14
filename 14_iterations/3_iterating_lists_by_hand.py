# iterate list by hand

why_data_analysis = [
    "высокая_зп",
    "востребованность",
    "независимость"
]

iterator = iter(why_data_analysis)
reason1 = next(iterator)
reason2 = next(iterator)
reason3 = next(iterator)
print(reason1, reason2, reason3)
# here we will have StopIterationException
reason4 = next(iterator)
