from itertools import accumulate, combinations, groupby, islice, product


def premiers(iterable, n):
    return list(islice(iterable, n))


def paires(elements):
    return list(combinations(elements, 2))


def codes(symboles, longueur):
    return ["".join(suite) for suite in product(symboles, repeat=longueur)]


def totaux(nombres):
    return list(accumulate(nombres))


def regrouper(mots):
    def premiere_lettre(mot):
        return mot[0]

    tries = sorted(mots, key=premiere_lettre)
    return {lettre: list(groupe) for lettre, groupe in groupby(tries, key=premiere_lettre)}


if __name__ == "__main__":
    from itertools import count

    print(premiers(count(10), 3))
    print(paires("abc"))
    print(codes("01", 2))
    print(totaux([3, 1, 4]))
    print(regrouper(["bus", "avion", "bateau", "auto"]))
