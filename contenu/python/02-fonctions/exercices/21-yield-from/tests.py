import inspect
from itertools import count, islice


def test_sont_des_generateurs():
    for fonction in (aplatir, enchainer, mots, chemins):
        assert inspect.isgeneratorfunction(fonction), fonction.__name__ + " doit utiliser yield"


def test_aplatir():
    assert list(aplatir([1, [2, [3, [4]]], (5, "ab")])) == [1, 2, 3, 4, 5, "ab"], "tous les niveaux, dans l'ordre"
    assert list(aplatir([[], [[]], 7])) == [7], "les listes vides ne donnent rien"
    assert list(aplatir([])) == [], "liste vide"


def test_enchainer():
    assert list(enchainer("ab", [1, 2], (3,))) == ["a", "b", 1, 2, 3], "les itérables à la suite"
    assert list(enchainer()) == [], "sans itérable : rien"
    assert list(islice(enchainer("ab", count()), 4)) == ["a", "b", 0, 1], "le dernier peut être infini"


def test_mots():
    assert list(mots("ab", 2)) == ["aa", "ab", "ba", "bb"], "4 mots de 2 lettres"
    assert list(mots("xyz", 1)) == ["x", "y", "z"], "mots d'une lettre"
    assert list(mots("ab", 0)) == [""], "un seul mot de longueur 0 : le mot vide"
    assert len(list(mots("abc", 4))) == 81, "3 ** 4 = 81 mots"


def test_mots_negatif():
    try:
        list(mots("ab", -1))
    except ValueError:
        return
    assert False, "une longueur négative lève ValueError"


def test_chemins():
    arbre = {"src": {"main.py": None, "lib": {"outils.py": None}}, "README.md": None}
    assert list(chemins(arbre)) == ["src/main.py", "src/lib/outils.py", "README.md"], "chemins avec des /"
    assert list(chemins({"vide": {}})) == [], "un dossier vide ne contient aucun fichier"
    assert list(chemins({"a.txt": None}, "docs/")) == ["docs/a.txt"], "le préfixe est ajouté devant"
