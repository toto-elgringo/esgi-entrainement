def avis(**infos):
    sexe = infos.get("sexe")
    if sexe == "h":
        ligne = "Recherché : homme"
    elif sexe == "f":
        ligne = "Recherché : femme"
    else:
        ligne = "Recherché : personne"
    if "taille" in infos:
        ligne += " (" + infos["taille"] + " cm) "
    lignes = [ligne]
    if "yeux" in infos:
        lignes.append("- yeux " + infos["yeux"])
    if "couleur" in infos and "coiffure" in infos:
        lignes.append("- cheveux " + infos["couleur"] + " " + infos["coiffure"])
    elif "couleur" in infos:
        lignes.append("- cheveux " + infos["couleur"])
    return "\n".join(lignes)


if __name__ == "__main__":
    print(avis(sexe="f", taille=172, yeux="verts", couleur="bruns", coiffure="bouclés"))
    print(avis(coiffure="courts"))
