def compter_mots(phrase):
    return len(phrase.split())


def initiales(nom_complet):
    lettres = []
    for mot in nom_complet.split():
        lettres.append(mot[0].upper())
    return ".".join(lettres) + "."


def ticket(quantite, article, prix):
    return "%d x %s : %.2f e" % (quantite, article, quantite * prix)


if __name__ == "__main__":
    print(compter_mots("Il fait beau"))
    print(initiales("ada lovelace"))
    print(ticket(2, "pomme", 0.7))
