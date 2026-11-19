def inverser_mots(phrase):
    return " ".join(mot[::-1] for mot in phrase.split(" "))


def mots_en_minuscules(phrase):
    pass


def abs_des_pairs(l):
    pass


def grille(lignes, colonnes, valeur):
    return [[valeur] * colonnes] * lignes


if __name__ == "__main__":
    print(inverser_mots("Salut  les gens"))
    g = grille(2, 3, 0)
    g[0][0] = 5
    print(g)
