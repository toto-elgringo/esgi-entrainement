def afficher(mot, trouvees):
    return " ".join(c if c in trouvees else "_" for c in mot)


def proposer(mot, trouvees, ratees, lettre):
    lettre = lettre.lower()
    if len(lettre) != 1 or not lettre.isalpha():
        return "invalide"
    if lettre in trouvees or lettre in ratees:
        return "deja"
    if lettre in mot:
        trouvees.add(lettre)
        return "bonne"
    ratees.add(lettre)
    return "mauvaise"


def gagne(mot, trouvees):
    return all(c in trouvees for c in mot)


if __name__ == "__main__":
    mot = "python"
    trouvees = set()
    ratees = set()
    for lettre in ["p", "e", "Y", "p", "t", "ab", "h", "o", "n"]:
        print(lettre, ":", proposer(mot, trouvees, ratees, lettre), "->", afficher(mot, trouvees))
    print("Gagné !" if gagne(mot, trouvees) else "Pas encore gagné")
