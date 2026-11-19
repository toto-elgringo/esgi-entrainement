def lettres(prenoms):
    return [c.lower() for prenom in prenoms for c in prenom]


def noms_alliteres(prenoms, noms):
    return [p + " " + n for p in prenoms for n in noms if p[0].lower() == n[0].lower()]


def aplatir(matrice):
    return [x for ligne in matrice for x in ligne]


def transposer(matrice):
    return [list(colonne) for colonne in zip(*matrice)]


def annuaire(personnes):
    return {p[0] + n[0]: p + " " + n for p, n in personnes}


if __name__ == "__main__":
    print(noms_alliteres(["Peter", "Bruce"], ["Parker", "Banner", "Wayne"]))
    print(transposer([[1, 2, 3], [4, 5, 6]]))
