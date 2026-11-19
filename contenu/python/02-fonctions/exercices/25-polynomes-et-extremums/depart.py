def valeur_polynome(coefs, x):
    total = 0
    for i, coef in enumerate(coefs):
        total += coef * x ^ i
    return total


def derivee(coefs):
    pass


def indices_extremes(valeurs):
    i_min = 0
    i_max = 0
    for i, valeur in enumerate(valeurs):
        if valeur <= valeurs[i_min]:
            i_min = i
        if valeur >= valeurs[i_max]:
            i_max = i
    return i_min, i_max


if __name__ == "__main__":
    print(valeur_polynome([0, 2, 4], 3))
    print(valeur_polynome([10, 0.5, 0, 0, 1], 2))
    print(derivee([10, 0.5, 0, 0, 1]))
    print(indices_extremes([4, 1, 9, 1, 9]))
