def ajouter_tache(tache, taches=None):
    if taches is None:
        taches = []
    taches.append(tache)
    return taches


def compter_mot(mot, compte=None):
    if compte is None:
        compte = {}
    compte[mot] = compte.get(mot, 0) + 1
    return compte


if __name__ == "__main__":
    print(ajouter_tache("courses"))
    print(ajouter_tache("ménage"))
