def numeroter(chemin, sauter_vides=False):
    resultat = []
    with open(chemin, encoding="utf-8") as f:
        for numero, ligne in enumerate(f, start=1):
            texte = ligne.rstrip("\n")
            if sauter_vides and not texte.strip():
                continue
            resultat.append(f"{numero}: {texte}")
    return resultat


if __name__ == "__main__":
    with open("message.txt", "w", encoding="utf-8") as f:
        f.write("Bonjour\n\nLa programmation, c'est sympa !\n")
    for ligne in numeroter("message.txt"):
        print(ligne)
    print(numeroter("message.txt", sauter_vides=True))
