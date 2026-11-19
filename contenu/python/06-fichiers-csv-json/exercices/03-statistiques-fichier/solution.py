ORDRE = ["lignes", "mots", "mots_lettres", "mots_chiffres", "caracteres", "lettres", "minuscules", "majuscules", "chiffres", "autres"]


def statistiques(chemin):
    with open(chemin, encoding="utf-8") as f:
        contenu = f.read()
    mots = contenu.split()
    lettres = sum(1 for c in contenu if c.isalpha())
    chiffres = sum(1 for c in contenu if c.isdigit())
    return {
        "lignes": len(contenu.splitlines()),
        "mots": len(mots),
        "mots_lettres": sum(1 for mot in mots if mot.isalpha()),
        "mots_chiffres": sum(1 for mot in mots if mot.isdigit()),
        "caracteres": len(contenu),
        "lettres": lettres,
        "minuscules": sum(1 for c in contenu if c.islower()),
        "majuscules": sum(1 for c in contenu if c.isupper()),
        "chiffres": chiffres,
        "autres": len(contenu) - lettres - chiffres,
    }


def rapport(chemin):
    stats = statistiques(chemin)
    return "\n".join(f"{cle} : {stats[cle]}" for cle in ORDRE)


if __name__ == "__main__":
    with open("courses.txt", "w", encoding="utf-8") as f:
        f.write("Acheter 12 Œufs\net du lait.\n")
    print(statistiques("courses.txt"))
    print(rapport("courses.txt"))
