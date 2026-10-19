def convertir_entiers(textes):
    return list(map(int, textes))


def multiples_de(l, k):
    return list(filter(lambda x: x % k == 0, l))


def produits(l1, l2):
    return list(map(lambda x, y: x * y, l1, l2))


def avec_tva(prix, taux):
    return list(map(lambda p: round(p * (1 + taux), 2), prix))


if __name__ == "__main__":
    print(convertir_entiers(["1", "22"]))
    print(produits([1, 2, 3], [4, 5, 6]))
