from __future__ import annotations
from typing import Iterable, Iterator


class MySeries(Iterable[int]):

    class SeriesIter(Iterator[int]):

        def __init__(self, lst: MySeries) -> None:
            self.lst = lst
            self.index = 0

        def __next__(self) -> int:
            if self.index >= len(self.lst):
                raise StopIteration()
            value = self.lst.data[self.index]
            self.index += 1
            return value

    class ReverseIter(Iterator[int]):

        def __init__(self, lst: MySeries) -> None:
            self.lst = lst
            self.index = len(lst) - 1

        def __next__(self) -> int:
            if self.index < 0:
                raise StopIteration()
            value = self.lst.data[self.index]
            self.index += -1
            return value

    def __init__(self, data: list[int]) -> None:
        self.data = data

    def __iter__(self) -> SeriesIter:
        return MySeries.SeriesIter(self)

    def __reversed__(self) -> ReverseIter:
        return MySeries.ReverseIter(self)

    def __len__(self) -> int:
        return len(self.data)


# use this list
my_list = MySeries(data=[1, 2, 3, 4])
# by hand iteration:
print("By hand iteration")
it = iter(my_list)
try:
    print(next(it))
    print(next(it))
    print(next(it))
    print(next(it))
    print(next(it))
    print(next(it))
except StopIteration:
    print('stop')

# foreach iteration
print("First time")
for elem in my_list:
    print(elem)
print("One more time")
for elem in my_list:
    print(elem)

print("Reversed")
for elem in reversed(my_list):
    print(elem)


print("Done")
