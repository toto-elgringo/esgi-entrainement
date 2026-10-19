def trier_par_longueur(mots):
    return sorted(mots, key=len)


def classement(eleves):
    return sorted(eleves, key=lambda e: (-e[1], e[0]))


def plus_long(mots):
    return max(mots, key=len, default="")


def mediane(nombres):
    tries = sorted(nombres)
    n = len(tries)
    if n % 2 == 1:
        return tries[n // 2]
    return (tries[n // 2 - 1] + tries[n // 2]) / 2


if __name__ == "__main__":
    print(classement([("Tom", 12), ("Ana", 15), ("Bob", 15)]))
    print(mediane([3, 1, 2]))
