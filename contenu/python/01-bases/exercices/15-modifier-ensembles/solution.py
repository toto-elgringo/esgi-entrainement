def chiffres_pairs():
    return set(range(0, 10, 2))


def lettres_utilisees(texte):
    return sorted(set(texte.lower()) - {" "})


def inscrire(inscrits, nom):
    if nom in inscrits:
        return False
    inscrits.add(nom)
    return True


def desinscrire(inscrits, noms):
    inscrits.difference_update(noms)


def vider(s):
    retires = []
    while s:
        retires.append(s.pop())
    return sorted(retires)


if __name__ == "__main__":
    print(chiffres_pairs())
    inscrits = {"Ana", "Bob"}
    print(inscrire(inscrits, "Eva"), inscrire(inscrits, "Ana"))
    print(inscrits)
