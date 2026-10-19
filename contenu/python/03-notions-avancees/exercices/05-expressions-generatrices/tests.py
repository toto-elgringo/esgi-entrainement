def test_somme_carres():
    assert somme_carres(3) == 14, "1 + 4 + 9 = 14"
    assert somme_carres(0) == 0, "somme vide : 0"
    assert somme_carres(100) == 338350, "somme des carrés de 1 à 100"


def test_somme_carres_grand():
    assert somme_carres(2_000_000) == 2666668666667000000, "doit marcher sur un très grand n"


def test_nombre_voyelles():
    assert nombre_voyelles("Bonjour") == 3, "o, o, u"
    assert nombre_voyelles("AEIOUY") == 6, "les majuscules comptent"
    assert nombre_voyelles("rythme") == 2, "y et e"


def test_premier_long():
    assert premier_long(["a", "abc", "abcd"], 3) == "abc", "abc est le premier mot d'au moins 3 lettres"
    assert premier_long(["a", "bb"], 5) is None, "aucun mot assez long : None"
    assert premier_long([], 1) is None, "liste vide : None"


def test_moyenne_positifs():
    assert moyenne_positifs([4, -2, 8]) == 6, "la moyenne de 4 et 8 vaut 6"
    assert moyenne_positifs([-1, 0]) == 0, "aucun positif : 0"
