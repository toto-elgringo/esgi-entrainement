def traduire(phrase, lexique):
    return " ".join(lexique.get(mot, mot) for mot in phrase.split())


def relier(classe_de, salle_de):
    resultat = {}
    for eleve, classe in classe_de.items():
        if classe in salle_de:
            resultat[eleve] = salle_de[classe]
    return resultat


def regrouper_par_longueur(mots):
    groupes = {}
    for mot in set(mots):
        groupes.setdefault(len(mot), []).append(mot)
    for longueur in groupes:
        groupes[longueur].sort()
    return groupes


def retirer_cles(d, cles):
    nombre = 0
    for cle in cles:
        if cle in d:
            del d[cle]
            nombre += 1
    return nombre


if __name__ == "__main__":
    print(traduire("le chat noir", {"chat": "cat", "noir": "black"}))
    print(relier({"Ana": "B1", "Tom": "B2", "Eva": "B3"}, {"B1": "A101", "B2": "A204"}))
    print(regrouper_par_longueur(["bus", "car", "vélo", "bus"]))
