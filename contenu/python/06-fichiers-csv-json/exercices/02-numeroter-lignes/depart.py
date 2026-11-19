def numeroter(chemin, sauter_vides=False):
    pass


if __name__ == "__main__":
    with open("message.txt", "w", encoding="utf-8") as f:
        f.write("Bonjour\n\nLa programmation, c'est sympa !\n")
    for ligne in numeroter("message.txt"):
        print(ligne)
    print(numeroter("message.txt", sauter_vides=True))
