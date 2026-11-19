def un_sur_trois(l):
    return l[::3]


def impairs_a_l_envers(l):
    return l[1::2][::-1]


def miroir(l):
    return l + l[::-1]


def motif(l, n, k):
    return l[:n] * k


def sauf_bouts(l):
    return l[1:-1]


def zeros(n):
    return [0] * n


if __name__ == "__main__":
    print(un_sur_trois([5, 6, 7, 8, 9]))
    print(miroir([1, 2, 3]))
