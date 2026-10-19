def moyenne(notes):
    if not notes:
        return 0.0
    return sum(notes) / len(notes)


def moyennes(carnet):
    resultat = {}
    for nom, notes in carnet.items():
        resultat[nom] = round(moyenne(notes), 2)
    return resultat


def meilleur_eleve(carnet):
    meilleur = None
    for nom in sorted(carnet):
        if meilleur is None or moyenne(carnet[nom]) > moyenne(carnet[meilleur]):
            meilleur = nom
    return meilleur


def admis(carnet, seuil=10):
    noms = []
    for nom, notes in carnet.items():
        if moyenne(notes) >= seuil:
            noms.append(nom)
    return sorted(noms)


def ajouter_note(carnet, nom, note):
    if not 0 <= note <= 20:
        return False
    if nom not in carnet:
        carnet[nom] = []
    carnet[nom].append(note)
    return True


if __name__ == "__main__":
    carnet = {"Tom": [12, 15], "Ana": [18, 16, 17], "Bob": []}
    print(moyennes(carnet))
    print(meilleur_eleve(carnet))
    print(admis(carnet))
