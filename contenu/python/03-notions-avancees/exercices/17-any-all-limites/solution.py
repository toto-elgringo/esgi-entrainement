def mots_courts(phrase, taille=6):
    return all(len(mot) <= taille for mot in phrase.split())


def contient_nombre(phrase):
    return any(mot.isdigit() for mot in phrase.split())


def aucun_negatif(valeurs):
    return not any(v < 0 for v in valeurs)


def tous_differents(valeurs):
    return len(set(valeurs)) == len(valeurs)


def matrice_rectangulaire(m):
    return all(len(ligne) == len(m[0]) for ligne in m)


if __name__ == "__main__":
    print(mots_courts("Bonjour à tous", 7))
    print(contient_nombre("il a 12 ans"))
