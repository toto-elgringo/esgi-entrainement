def appliquer(l, func):
    res = []
    for x in l:
        res.append(func(x))
    return res


def filtrer(l, condition):
    res = []
    for x in l:
        if condition(x):
            res.append(x)
    return res


def appliquer_n_fois(func, x, n):
    for _ in range(n):
        x = func(x)
    return x


def double(x):
    return 2 * x


if __name__ == "__main__":
    print(appliquer(["4", "45"], int))
    print(appliquer_n_fois(double, 1, 3))
