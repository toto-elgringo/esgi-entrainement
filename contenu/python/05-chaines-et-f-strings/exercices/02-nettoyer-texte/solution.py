def nettoyer(texte):
    return " ".join(texte.split()).lower()


def capitaliser_mots(texte):
    return " ".join(mot[0].upper() + mot[1:].lower() for mot in texte.split())


def extension(nom_fichier):
    if "." not in nom_fichier:
        return ""
    return nom_fichier.rsplit(".", 1)[1].lower()


if __name__ == "__main__":
    print(nettoyer("  Bonjour   LE monde "))
    print(capitaliser_mots("ada LOVELACE"))
    print(extension("Photo.Vacances.JPG"))
