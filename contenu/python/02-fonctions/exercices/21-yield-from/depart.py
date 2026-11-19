def aplatir(structure):
    pass


def enchainer(*iterables):
    pass


def mots(alphabet, longueur):
    pass


def chemins(arbre, prefixe=""):
    pass


if __name__ == "__main__":
    print(list(aplatir([1, [2, [3, [4]]], (5, "ab")])))
    print(list(enchainer("ab", [1, 2])))
    print(list(mots("ab", 2)))
    arbre = {"src": {"main.py": None, "lib": {"outils.py": None}}, "README.md": None}
    print(list(chemins(arbre)))
