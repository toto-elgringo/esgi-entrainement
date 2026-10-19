def somme_carres(n):
    return sum(x ** 2 for x in range(1, n + 1))


def nombre_voyelles(texte):
    return sum(1 for c in texte.lower() if c in "aeiouy")


def premier_long(mots, taille):
    return next((m for m in mots if len(m) >= taille), None)


def moyenne_positifs(nombres):
    total = sum(x for x in nombres if x > 0)
    nombre = sum(1 for x in nombres if x > 0)
    if nombre == 0:
        return 0
    return total / nombre


if __name__ == "__main__":
    print(somme_carres(3))
    print(premier_long(["a", "abc", "abcd"], 3))
