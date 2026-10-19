def division_sure(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None


def lire_entier(texte, defaut=0):
    try:
        return int(texte)
    except ValueError:
        return defaut


def acces_sur(conteneur, cle):
    try:
        return conteneur[cle]
    except LookupError:
        return None


def need_positive_number(n):
    if n < 0:
        raise ValueError("need to be positive")
    return n


if __name__ == "__main__":
    print(division_sure(1, 0))
    print(lire_entier("abc"))
