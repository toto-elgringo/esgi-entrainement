def compter_mots(chemin):
    pass


def mots_frequents(chemin, k):
    pass


if __name__ == "__main__":
    with open("texte.txt", "w", encoding="utf-8") as f:
        f.write("Le chat dort. Le chien aussi !\nle chat mange.\n")
    print(compter_mots("texte.txt"))
    print(mots_frequents("texte.txt", 3))
