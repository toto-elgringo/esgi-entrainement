def compter_mots(chemin):
    compte = {}
    try:
        with open(chemin, encoding="utf-8") as f:
            for ligne in f:
                for mot in ligne.lower().split():
                    mot = mot.strip(".,;:!?")
                    if mot:
                        compte[mot] = compte.get(mot, 0) + 1
    except FileNotFoundError:
        return {}
    return compte


def mots_frequents(chemin, k):
    compte = compter_mots(chemin)
    return sorted(compte.items(), key=lambda kv: (-kv[1], kv[0]))[:k]


if __name__ == "__main__":
    with open("texte.txt", "w", encoding="utf-8") as f:
        f.write("Le chat dort. Le chien aussi !\nle chat mange.\n")
    print(compter_mots("texte.txt"))
    print(mots_frequents("texte.txt", 3))
