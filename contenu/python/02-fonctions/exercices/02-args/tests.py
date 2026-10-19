def test_moyenne():
    assert moyenne(4, 6, 8) == 6.0, "la moyenne de 4, 6 et 8 vaut 6"
    assert moyenne(5) == 5.0, "avec un seul nombre"
    assert moyenne() == 0, "sans argument : 0"


def test_maximum():
    assert maximum(3, 9, 2) == 9, "le plus grand de 3, 9, 2 est 9"
    assert maximum(-4) == -4, "avec un seul argument"
    assert maximum(-4, -1, -7) == -1, "avec des négatifs"


def test_concatener():
    assert concatener("a", "b", "c") == "a b c", "séparateur espace par défaut"
    assert concatener("a", "b", sep="-") == "a-b", "séparateur donné par mot-clé"
    assert concatener() == "", "sans mot : chaîne vide"


def test_deballage():
    valeurs = [10, 20, 30]
    assert moyenne(*valeurs) == 20.0, "moyenne(*valeurs) déballe la liste en arguments"
