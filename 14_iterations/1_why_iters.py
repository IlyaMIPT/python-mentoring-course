from __future__ import annotations
from typing import Iterable, Iterator


class MySeries(Iterable):

    class SeriesIter(Iterator[int]):

        def __init__(self, lst: MySeries, reverse: bool = False) -> None:
            self._lst = lst
            self._index = 0 if not reverse else len(lst) - 1
            self._reverse = reverse

        def __next__(self) -> int:
            if self._reverse and self._index < 0:
                raise StopIteration()
            if not self._reverse and self._index >= len(self._lst):
                raise StopIteration()
            value = self._lst.data[self._index]
            self._index += 1 if not self._reverse else -1
            return value

    def __init__(self, data: list[int]) -> None:
        self.data = data

    def __iter__(self) -> SeriesIter:
        return MySeries.SeriesIter(self)

    def __reversed__(self) -> SeriesIter:
        return MySeries.SeriesIter(self, reverse=True)

    def __len__(self) -> int:
        return len(self.data)


# use this list
my_list = MySeries(data=[1, 2, 3, 4])
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
