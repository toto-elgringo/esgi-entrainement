def compter(texte, sous):
    return texte.lower().count(sous.lower())


def censurer_voyelles(texte, caractere="*"):
    for voyelle in "aeiouy":
        texte = texte.replace(voyelle, caractere)
    return texte


def est_entier(texte):
    if texte.startswith("-"):
        texte = texte[1:]
    return texte.isdigit()


if __name__ == "__main__":
    print(compter("Banane", "AN"))
    print(censurer_voyelles("bonjour"))
    print(est_entier("-12"))
