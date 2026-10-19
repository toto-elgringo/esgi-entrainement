def sans_doublons(l):
    return sorted(set(l))


def communs(a, b):
    return sorted(set(a) & set(b))


def est_binaire(texte):
    return texte != "" and set("01").issuperset(texte)


def sans_ponctuation(phrase):
    return set("!?.,;:").isdisjoint(phrase)


def lettres_exclusives(mot1, mot2):
    return set(mot1) ^ set(mot2)


if __name__ == "__main__":
    print(sans_doublons([3, 1, 3, 2, 1]))
    print(communs([1, 2, 3], [2, 3, 4]))
    print(lettres_exclusives("chat", "chien"))
