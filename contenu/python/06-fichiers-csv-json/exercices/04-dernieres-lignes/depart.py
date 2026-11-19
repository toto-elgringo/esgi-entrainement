def premieres_lignes(chemin, n):
    pass


def dernieres_lignes(chemin, n):
    pass


if __name__ == "__main__":
    with open("journal.txt", "w", encoding="utf-8") as f:
        f.write("Bonjour\nLa prog, c'est sympa !\nMais alors là, vraiment sympa :)\n")
    print(dernieres_lignes("journal.txt", 2))
    print(premieres_lignes("journal.txt", 1))
