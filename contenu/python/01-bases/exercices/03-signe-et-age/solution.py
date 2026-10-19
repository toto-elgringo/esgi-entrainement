def signe(n):
    if n == 0:
        return "nul"
    elif n > 0:
        return "positif"
    else:
        return "négatif"


def categorie(age):
    if age < 12:
        return "enfant"
    elif age < 18:
        return "ado"
    elif age < 65:
        return "adulte"
    else:
        return "senior"


if __name__ == "__main__":
    print(signe(-3))
    print(categorie(30))
