ORDRE = ["lignes", "mots", "mots_lettres", "mots_chiffres", "caracteres", "lettres", "minuscules", "majuscules", "chiffres", "autres"]


def statistiques(chemin):
    pass


def rapport(chemin):
    pass


if __name__ == "__main__":
    with open("courses.txt", "w", encoding="utf-8") as f:
        f.write("Acheter 12 Œufs\net du lait.\n")
    print(statistiques("courses.txt"))
    print(rapport("courses.txt"))
