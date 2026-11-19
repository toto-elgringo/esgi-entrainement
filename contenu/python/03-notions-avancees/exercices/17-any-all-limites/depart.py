def mots_courts(phrase, taille=6):
    return all(len(mot) < taille for mot in phrase.split())


def contient_nombre(phrase):
    pass


def aucun_negatif(valeurs):
    pass


def tous_differents(valeurs):
    pass


def matrice_rectangulaire(m):
    pass


if __name__ == "__main__":
    print(mots_courts("Bonjour à tous", 7))
    print(contient_nombre("il a 12 ans"))
