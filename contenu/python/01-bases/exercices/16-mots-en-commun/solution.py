def nb_mots_distincts(texte):
    return len(set(texte.lower().split()))


def vocabulaire_commun(texte1, texte2):
    return sorted(set(texte1.lower().split()) & set(texte2.lower().split()))


def surligner(texte, mots_cles):
    cles = {m.lower() for m in mots_cles}
    return " ".join(m.upper() if m in cles else m for m in texte.lower().split())


if __name__ == "__main__":
    print(nb_mots_distincts("Le chat et le chien"))
    print(surligner("Le chat  et LE chien", ["le", "Loup"]))
