def afficher(mot, trouvees):
    pass


def proposer(mot, trouvees, ratees, lettre):
    pass


def gagne(mot, trouvees):
    pass


if __name__ == "__main__":
    mot = "python"
    trouvees = set()
    ratees = set()
    for lettre in ["p", "e", "Y", "p", "t", "ab", "h", "o", "n"]:
        print(lettre, ":", proposer(mot, trouvees, ratees, lettre), "->", afficher(mot, trouvees))
    print("Gagné !" if gagne(mot, trouvees) else "Pas encore gagné")
