def test_min_max():
    assert min_max([4, 1, 7]) == (1, 7), "dans [4, 1, 7] : plus petit 1, plus grand 7"
    assert min_max([5]) == (5, 5), "un seul élément : (5, 5)"
    assert min_max([-2, -8, -1]) == (-8, -1), "avec des négatifs : (-8, -1)"


def test_min_max_renvoie_un_tuple():
    assert isinstance(min_max([3, 2]), tuple), "min_max doit renvoyer un tuple"


def test_echanger():
    assert echanger((1, "a")) == ("a", 1), "(1, 'a') inversé donne ('a', 1)"
    assert echanger((True, False)) == (False, True), "(True, False) inversé donne (False, True)"


def test_tete_et_reste():
    assert tete_et_reste((1, 2, 3)) == (1, [2, 3]), "(1, 2, 3) donne (1, [2, 3])"
    assert tete_et_reste([9]) == (9, []), "un seul élément : le reste est une liste vide"
    assert tete_et_reste("abc") == ("a", ["b", "c"]), "ça marche aussi avec une chaîne"


def test_distance():
    assert distance((0, 0), (3, 4)) == 5.0, "la distance entre (0, 0) et (3, 4) vaut 5"
    assert distance((1, 1), (1, 1)) == 0.0, "un point est à distance 0 de lui-même"
    assert abs(distance((-1, 2), (2, -2)) - 5.0) < 1e-9, "entre (-1, 2) et (2, -2) : 5"
