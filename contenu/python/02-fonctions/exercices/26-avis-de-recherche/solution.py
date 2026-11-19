SEXES = {None: "personne", "h": "homme", "f": "femme"}


def avis(*, sexe=None, taille=None, yeux=None, couleur=None, coiffure=None):
    if sexe not in SEXES:
        raise ValueError(f"sexe inconnu : {sexe!r}")
    ligne = f"Recherché : {SEXES[sexe]}"
    if taille is not None:
        ligne += f" ({taille} cm)"
    lignes = [ligne]
    if yeux is not None:
        lignes.append(f"- yeux {yeux}")
    cheveux = [morceau for morceau in (couleur, coiffure) if morceau is not None]
    if cheveux:
        lignes.append("- cheveux " + " ".join(cheveux))
    return "\n".join(lignes)


if __name__ == "__main__":
    print(avis(sexe="f", taille=172, yeux="verts", couleur="bruns", coiffure="bouclés"))
    print(avis(coiffure="courts"))
