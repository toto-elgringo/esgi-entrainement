def somme_intervalle(debut, fin, pas=1):
    total = 0
    for valeur in range(debut, fin + 1, pas):
        total += valeur
    return total


def factorielle(n):
    if not isinstance(n, int):
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
        except ValueError:
            raise TypeError()
    return resultat


if __name__ == "__main__":
    print(somme_intervalle(1, 10, 3))
    print(somme_intervalle(10, 1, -3))
    print(factorielle(5))
    print(factorielle(True))
    print(convertir_tous(1, "2.5", 3))
    try:
        convertir_tous(1, None)
    except TypeError as e:
        print("TypeError :", e, "| cause :", repr(e.__cause__))
