def aplatir(structure):
    for element in structure:
        if isinstance(element, (list, tuple)):
            yield from aplatir(element)
        else:
            yield element


def enchainer(*iterables):
    for iterable in iterables:
        yield from iterable


def mots(alphabet, longueur):
    if longueur < 0:
        raise ValueError("la longueur doit être positive")
    if longueur == 0:
        yield ""
        return
    for lettre in alphabet:
        for fin in mots(alphabet, longueur - 1):
            yield lettre + fin


def chemins(arbre, prefixe=""):
    for nom, contenu in arbre.items():
        chemin = prefixe + nom
        if isinstance(contenu, dict):
            yield from chemins(contenu, chemin + "/")
        else:
            yield chemin


if __name__ == "__main__":
    print(list(aplatir([1, [2, [3, [4]]], (5, "ab")])))
    print(list(enchainer("ab", [1, 2])))
    print(list(mots("ab", 2)))
    arbre = {"src": {"main.py": None, "lib": {"outils.py": None}}, "README.md": None}
    print(list(chemins(arbre)))
