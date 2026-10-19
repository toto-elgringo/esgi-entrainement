def carres(n):
    return [i ** 2 for i in range(n)]


def positifs(l):
    return [x for x in l if x > 0]


def opposes_des_pairs(n):
    return [-v for v in range(n) if v % 2 == 0]


def longueurs(mots):
    return [len(m) for m in mots]


if __name__ == "__main__":
    print(carres(4))
    print(opposes_des_pairs(10))
