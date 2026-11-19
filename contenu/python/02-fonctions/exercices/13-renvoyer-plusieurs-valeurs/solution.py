def extremes(valeurs):
    if not valeurs:
        raise ValueError("liste vide")
    petit = grand = valeurs[0]
    for valeur in valeurs[1:]:
        if valeur < petit:
            petit = valeur
        if valeur > grand:
            grand = valeur
    return petit, grand


def positions(valeurs, cible):
    return tuple(i for i, valeur in enumerate(valeurs) if valeur == cible)


def stats_mots(phrase):
    mots = phrase.split()
    if not mots:
        return 0, "", 0.0
    plus_long = mots[0]
    for mot in mots[1:]:
        if len(mot) > len(plus_long):
            plus_long = mot
    moyenne = sum(len(mot) for mot in mots) / len(mots)
    return len(mots), plus_long, moyenne


if __name__ == "__main__":
    petit, grand = extremes([4, -2, 9, 3])
    print(petit, grand)
    print(positions(["a", "b", "a"], "a"))
    print(stats_mots("le chat dort"))
