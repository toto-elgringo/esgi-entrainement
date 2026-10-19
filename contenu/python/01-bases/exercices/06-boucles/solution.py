def compte_a_rebours(n):
    resultat = []
    while n >= 0:
        resultat.append(n)
        n -= 1
    return resultat


def premier_multiple(nombres, k):
    for x in nombres:
        if x % k == 0:
            return x
    return None


def somme_positifs(nombres):
    total = 0
    for x in nombres:
        if x < 0:
            continue
        total += x
    return total


def nombre_de_voyelles(texte):
    compte = 0
    for lettre in texte.lower():
        if lettre in "aeiouy":
            compte += 1
    return compte


if __name__ == "__main__":
    print(compte_a_rebours(3))
    print(premier_multiple([5, 7, 9, 12], 3))
    print(somme_positifs([4, -2, 6]))
    print(nombre_de_voyelles("Bonjour"))
