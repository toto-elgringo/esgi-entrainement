def inverser_mots(phrase):
    return " ".join(mot[::-1] for mot in phrase.split())


def mots_en_minuscules(phrase):
    return " ".join(mot for mot in phrase.split() if mot.isalpha() and mot.islower())


def abs_des_pairs(l):
    return [abs(x) for x in l if x % 2 == 0]


def grille(lignes, colonnes, valeur):
    return [[valeur] * colonnes for _ in range(lignes)]


if __name__ == "__main__":
    print(inverser_mots("Salut  les gens"))
    g = grille(2, 3, 0)
    g[0][0] = 5
    print(g)
