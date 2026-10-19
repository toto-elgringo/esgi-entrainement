def _est_pair(n):
    return n % 2 == 0


def test_appliquer_exemple_du_cours():
    elems = ["4", 45, 3.2]
    assert appliquer(elems, int) == [4, 45, 3], "conversion en int"
    assert appliquer(elems, float) == [4.0, 45.0, 3.2], "conversion en float"
    assert appliquer(elems, str) == ["4", "45", "3.2"], "conversion en str"


def test_appliquer_autres_fonctions():
    assert appliquer(["ab", "", "abc"], len) == [2, 0, 3], "avec len"
    assert appliquer([], len) == [], "liste vide"


def test_filtrer():
    assert filtrer([1, 2, 3, 4, 5, 6], _est_pair) == [2, 4, 6], "on garde les nombres pairs"
    assert filtrer(["a", "", "b"], bool) == ["a", "b"], "bool garde les chaînes non vides"


def test_appliquer_n_fois():
    assert appliquer_n_fois(double, 1, 3) == 8, "1 doublé 3 fois donne 8"
    assert appliquer_n_fois(double, 5, 0) == 5, "0 fois : x ne change pas"
    assert appliquer_n_fois(str.upper, "ok", 2) == "OK", "ça marche avec n'importe quelle fonction"
