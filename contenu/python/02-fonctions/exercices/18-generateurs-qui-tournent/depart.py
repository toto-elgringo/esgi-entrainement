def tourner(iterable):
    elements = list(iterable)
    while True:
        for element in elements:
            yield element


def tours(iterable, n):
    pass


def alterner(*iterables):
    pass


if __name__ == "__main__":
    from itertools import islice

    print(list(islice(tourner("ab"), 5)))
    print(list(tours([1, 2], 3)))
    print(list(alterner("abc", [1], "xy")))
