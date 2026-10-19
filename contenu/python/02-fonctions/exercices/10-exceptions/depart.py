def division_sure(a, b):
    return a / b


def lire_entier(texte, defaut=0):
    return int(texte)


def acces_sur(conteneur, cle):
    return conteneur[cle]


def need_positive_number(n):
    return n


if __name__ == "__main__":
    print(division_sure(1, 0))
    print(lire_entier("abc"))
