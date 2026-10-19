def test_compte_a_rebours():
    assert compte_a_rebours(3) == [3, 2, 1, 0], "compte_a_rebours(3) donne [3, 2, 1, 0]"
    assert compte_a_rebours(0) == [0], "compte_a_rebours(0) donne [0]"


def test_premier_multiple_trouve():
    assert premier_multiple([5, 7, 9, 12], 3) == 9, "le premier multiple de 3 dans [5, 7, 9, 12] est 9"
    assert premier_multiple([10, 4, 6], 2) == 10, "on renvoie le premier, pas le plus petit"


def test_premier_multiple_absent():
    assert premier_multiple([1, 5, 7], 2) is None, "aucun nombre pair : None"
    assert premier_multiple([], 5) is None, "liste vide : None"


def test_somme_positifs():
    assert somme_positifs([4, -2, 6]) == 10, "4 + 6 = 10 (on saute -2)"
    assert somme_positifs([-1, -5]) == 0, "que des négatifs : 0"
    assert somme_positifs([]) == 0, "liste vide : 0"


def test_voyelles():
    assert nombre_de_voyelles("Bonjour") == 3, "Bonjour contient o, o, u"
    assert nombre_de_voyelles("PYTHON") == 2, "les majuscules comptent : Y et O"
    assert nombre_de_voyelles("") == 0, "chaîne vide : 0"
