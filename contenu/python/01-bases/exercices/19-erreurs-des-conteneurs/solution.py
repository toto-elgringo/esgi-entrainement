def retirer_premier(l, x):
    try:
        l.remove(x)
    except ValueError:
        return False
    return True


def rang(classement, nom):
    try:
        return classement.index(nom) + 1
    except ValueError:
        return None


def deuxieme_position(l, x):
    try:
        premiere = l.index(x)
        return l.index(x, premiere + 1)
    except ValueError:
        return -1


def prix_total(panier, tarifs):
    total = 0
    inconnus = []
    for article in panier:
        try:
            total += tarifs[article]
        except KeyError:
            inconnus.append(article)
    return round(total, 2), inconnus


def remettre_a_zero(liste, ensemble, dico):
    retires = len(liste) + len(ensemble) + len(dico)
    liste.clear()
    ensemble.clear()
    dico.clear()
    return retires


if __name__ == "__main__":
    print(rang(["Ana", "Tom"], "Tom"))
    print(prix_total(["pain", "lait", "café", "pain"], {"pain": 1.2, "lait": 0.9}))
