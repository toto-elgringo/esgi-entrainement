def test_carres():
    assert carres(4) == [0, 1, 4, 9], "les carrés de 0 à 3"
    assert carres(10)[-1] == 81, "le dernier carré de carres(10) est 81"
    assert carres(0) == [], "carres(0) est vide"


def test_positifs():
    assert positifs([3, -1, 0, 7, -5]) == [3, 7], "0 n'est pas strictement positif"
    assert positifs([]) == [], "liste vide"


def test_opposes_des_pairs():
    assert opposes_des_pairs(10) == [0, -2, -4, -6, -8], "l'exemple du cours"
    assert opposes_des_pairs(1) == [0], "seul 0 est pair dans range(1)"


def test_longueurs():
    assert longueurs(["a", "abc", ""]) == [1, 3, 0], "une longueur par mot"
