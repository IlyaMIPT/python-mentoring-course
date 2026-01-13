from functools import reduce


def _f(res, curr):
    return res * curr


# найти произведение
numbers = [2, 3, 4, 5]
# mult_res = reduce(lambda res, curr_item: res * curr_item, numbers)
mult_res = reduce(_f, numbers)
print('Произведение', mult_res)


# конкатенация строк разделителем
words = ["Python", "is", "awesome", "!"]
concat_res = reduce(lambda res, curr: f"{res} {curr}", words)
print(concat_res)
