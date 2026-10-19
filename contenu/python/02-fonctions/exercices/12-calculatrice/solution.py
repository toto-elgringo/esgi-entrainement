def additionner(a, b):
    return a + b


def soustraire(a, b):
    return a - b


def multiplier(a, b):
    return a * b


def diviser(a, b):
    return a / b


OPERATIONS = {"+": additionner, "-": soustraire, "*": multiplier, "/": diviser}


def calculer(ligne):
    morceaux = ligne.split()
    if len(morceaux) != 3:
        return "Erreur : format attendu « a op b »"
    texte_a, op, texte_b = morceaux
    if op not in OPERATIONS:
        return "Erreur : opération inconnue"
    try:
        a = int(texte_a)
        b = int(texte_b)
    except ValueError:
        return "Erreur : nombre invalide"
    try:
        resultat = OPERATIONS[op](a, b)
    except ZeroDivisionError:
        return "Erreur : division par zéro"
    else:
        return "%d %s %d = %s" % (a, op, b, resultat)


if __name__ == "__main__":
    while True:
        ligne = input()
        if ligne == "fin":
            break
        print(calculer(ligne))
