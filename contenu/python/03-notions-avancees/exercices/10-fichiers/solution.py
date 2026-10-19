def ecrire_lignes(chemin, lignes):
    with open(chemin, "w", encoding="utf-8") as f:
        for ligne in lignes:
            f.write(ligne + "\n")


def ajouter_ligne(chemin, ligne):
    with open(chemin, "a", encoding="utf-8") as f:
        f.write(ligne + "\n")


def lire_lignes(chemin):
    with open(chemin, encoding="utf-8") as f:
        return [ligne.rstrip("\n") for ligne in f]


def compter_lignes(chemin):
    try:
        with open(chemin, encoding="utf-8") as f:
            return sum(1 for _ in f)
    except FileNotFoundError:
        return 0


if __name__ == "__main__":
    ecrire_lignes("courses.txt", ["pain", "lait"])
    ajouter_ligne("courses.txt", "œufs")
    print(lire_lignes("courses.txt"))
