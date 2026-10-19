def mots_majuscules(ligne):
    return [w.upper() for w in ligne.split() if w.isalpha()]


def combinaisons(prenoms, noms):
    return [f + " " + n for f in prenoms for n in noms]


def couples_ordonnes(E):
    return [(i, j) for i in E for j in E if i < j]


def table(n):
    return [[i * j for j in range(1, n + 1)] for i in range(1, n + 1)]


if __name__ == "__main__":
    print(mots_majuscules("Il y a 3 chats"))
    print(table(3))
