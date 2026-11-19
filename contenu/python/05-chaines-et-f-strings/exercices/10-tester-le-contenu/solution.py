def nature(mot):
    if mot.isdigit():
        return "nombre"
    if mot.isalpha():
        if mot.islower():
            return "minuscules"
        if mot.isupper():
            return "majuscules"
        return "lettres"
    if mot.isalnum():
        return "alphanumérique"
    return "autre"


def apres(texte, repere):
    position = texte.find(repere)
    if position == -1:
        return ""
    return texte[position + len(repere):]


def images(noms):
    return [nom for nom in noms if nom.lower().endswith((".png", ".jpg", ".jpeg"))]


if __name__ == "__main__":
    for mot in ["2026", "chat", "ESGI", "Python", "Naruto93", "14-18", ""]:
        print(repr(mot), nature(mot))
    print(apres("nom=Ada=1", "="))
    print(images(["a.PNG", "b.txt", "c.jpg"]))
