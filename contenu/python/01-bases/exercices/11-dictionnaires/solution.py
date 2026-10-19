def compter_lettres(texte):
    compte = {}
    for lettre in texte:
        if lettre == " ":
            continue
        compte[lettre] = compte.get(lettre, 0) + 1
    return compte


def inverser(d):
    resultat = {}
    for cle, valeur in d.items():
        resultat[valeur] = cle
    return resultat


def fusionner(d1, d2):
    resultat = dict(d1)
    resultat.update(d2)
    return resultat


def prix_panier(panier, tarifs):
    total = 0
    for article, quantite in panier.items():
        total += quantite * tarifs.get(article, 0)
    return total


if __name__ == "__main__":
    print(compter_lettres("ici"))
    print(inverser({"a": 1, "b": 2}))
    print(fusionner({"a": 1}, {"a": 5, "b": 2}))
    print(prix_panier({"pomme": 3, "pain": 1}, {"pomme": 0.5, "pain": 1.2}))
