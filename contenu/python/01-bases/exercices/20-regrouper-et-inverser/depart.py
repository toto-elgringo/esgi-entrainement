def inverser_groupes(d):
    return {v: [k] for k, v in d.items()}


def familles_anagrammes(texte):
    pass


def valeurs_partagees(d):
    pass


if __name__ == "__main__":
    print(inverser_groupes({"a": 1, "b": 1, "c": 2, "d": 3, "e": 2}))
    print(familles_anagrammes("le chien de la chine aime la niche"))
    print(valeurs_partagees({"Ana": "B1", "Tom": "B2", "Eva": "B1"}))
