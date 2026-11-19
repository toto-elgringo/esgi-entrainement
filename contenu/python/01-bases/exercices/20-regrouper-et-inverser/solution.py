def inverser_groupes(d):
    groupes = {}
    for cle, valeur in d.items():
        groupes.setdefault(valeur, []).append(cle)
    for valeur in groupes:
        groupes[valeur].sort()
    return groupes


def familles_anagrammes(texte):
    familles = {}
    for mot in set(texte.split()):
        familles.setdefault("".join(sorted(mot)), []).append(mot)
    for cle in familles:
        familles[cle].sort()
    return familles


def valeurs_partagees(d):
    return sorted(v for v, cles in inverser_groupes(d).items() if len(cles) >= 2)


if __name__ == "__main__":
    print(inverser_groupes({"a": 1, "b": 1, "c": 2, "d": 3, "e": 2}))
    print(familles_anagrammes("le chien de la chine aime la niche"))
    print(valeurs_partagees({"Ana": "B1", "Tom": "B2", "Eva": "B1"}))
