import math


def min_max(nombres):
    petit = grand = nombres[0]
    for x in nombres[1:]:
        if x < petit:
            petit = x
        if x > grand:
            grand = x
    return petit, grand


def echanger(couple):
    a, b = couple
    return b, a


def tete_et_reste(sequence):
    premier, *reste = sequence
    return premier, reste


def distance(p1, p2):
    x1, y1 = p1
    x2, y2 = p2
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


if __name__ == "__main__":
    print(min_max([4, 1, 7]))
    print(echanger((1, "a")))
    print(tete_et_reste((1, 2, 3)))
    print(distance((0, 0), (3, 4)))
