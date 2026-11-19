def items_tries(d):
    return sorted(d.items())


def cles_par_valeur(d):
    return sorted(d, key=lambda k: (-d[k], k))


def trier_par_somme(listes):
    return sorted(listes, key=sum)


def trier_sans_casse(mots):
    return sorted(mots, key=str.lower)


def plus_proche(nombres, cible):
    return min(nombres, key=lambda n: (abs(n - cible), n), default=None)


if __name__ == "__main__":
    print(cles_par_valeur({"kiwi": 3, "abricot": 5, "fraise": 3}))
    print(trier_sans_casse(["banane", "Abricot", "cerise", "Zèbre"]))
