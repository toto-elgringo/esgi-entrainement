def nb_mots_distincts(texte):
    return len(set(texte.split()))


def vocabulaire_commun(texte1, texte2):
    pass


def surligner(texte, mots_cles):
    mots = texte.lower().split(" ")
    cles = [m.lower() for m in mots_cles]
    for i in range(len(mots)):
        for j in range(len(cles)):
            if mots[i] == cles[j]:
                mots[i] = mots[i].upper()
                cles[j] = cles[j].upper()
    return " ".join(mots)


if __name__ == "__main__":
    print(nb_mots_distincts("Le chat et le chien"))
    print(surligner("Le chat  et LE chien", ["le", "Loup"]))
