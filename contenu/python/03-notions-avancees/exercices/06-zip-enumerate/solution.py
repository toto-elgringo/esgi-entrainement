def associer(cles, valeurs):
    return dict(zip(cles, valeurs))


def numeroter(lignes):
    return [str(i) + ". " + ligne for i, ligne in enumerate(lignes, start=1)]


def produit_scalaire(u, v):
    return sum(x * y for x, y in zip(u, v))


def positions(texte, lettre):
    return [i for i, c in enumerate(texte) if c == lettre]


if __name__ == "__main__":
    print(associer(["Tom", "Bob"], [12, 15]))
    print(numeroter(["pain", "lait"]))
