def saluer(nom, salutation="Bonjour", ponctuation="!"):
    return salutation + " " + nom + ponctuation


def prix_ttc(prix_ht, taux=0.2):
    return round(prix_ht * (1 + taux), 2)


if __name__ == "__main__":
    print(saluer("Ada"))
    print(prix_ttc(100))
