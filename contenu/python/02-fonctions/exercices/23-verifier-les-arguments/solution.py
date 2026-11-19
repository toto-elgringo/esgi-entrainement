def somme_intervalle(debut, fin, pas=1):
    if pas == 0:
        raise ValueError("le pas ne peut pas être nul")
    arret = fin + 1 if pas > 0 else fin - 1
    return sum(range(debut, arret, pas))


def factorielle(n):
    if isinstance(n, bool) or not isinstance(n, int):
        raise TypeError("n doit être un entier")
    if n < 0:
        raise ValueError("n doit être positif")
    resultat = 1
    for i in range(2, n + 1):
        resultat *= i
    return resultat


def convertir_tous(*valeurs):
    resultat = []
    for valeur in valeurs:
        try:
            resultat.append(float(valeur))
        except (TypeError, ValueError) as erreur:
            raise TypeError("valeur invalide : %r" % (valeur,)) from erreur
    return resultat


if __name__ == "__main__":
    print(somme_intervalle(1, 10, 3))
    print(somme_intervalle(10, 1, -3))
    print(factorielle(5))
    try:
        factorielle(True)
    except TypeError as e:
        print("TypeError :", e)
    print(convertir_tous(1, "2.5", 3))
    try:
        convertir_tous(1, None)
    except TypeError as e:
        print("TypeError :", e, "| cause :", repr(e.__cause__))
