from itertools import count


def test_premiers():
    assert premiers(count(10), 3) == [10, 11, 12], "les 3 premiers d'un itérable infini"
    assert premiers([1, 2], 5) == [1, 2], "moins d'éléments que demandé"
    assert premiers("abc", 0) == [], "0 élément"


def test_paires():
    assert paires("abc") == [("a", "b"), ("a", "c"), ("b", "c")], "3 paires, a avant b"
    assert paires([1]) == [], "un seul élément : aucune paire"
    assert len(paires(range(10))) == 45, "10 éléments : 45 paires"


def test_codes():
    assert codes("01", 2) == ["00", "01", "10", "11"], "4 codes binaires de 2 chiffres"
    assert codes("ab", 1) == ["a", "b"], "codes d'un symbole"
    assert len(codes("0123456789", 3)) == 1000, "1000 codes de 3 chiffres"


def test_totaux():
    assert totaux([3, 1, 4]) == [3, 4, 8], "sommes cumulées"
    assert totaux([]) == [], "liste vide"


def test_regrouper():
    attendu = {"a": ["avion", "auto"], "b": ["bus", "bateau"]}
    assert regrouper(["bus", "avion", "bateau", "auto"]) == attendu, "trie avant groupby, sinon les groupes sont coupés"
    assert regrouper([]) == {}, "aucun mot"
    assert regrouper(["cc", "ca", "cb"]) == {"c": ["cc", "ca", "cb"]}, "l'ordre d'origine est gardé dans chaque groupe"
