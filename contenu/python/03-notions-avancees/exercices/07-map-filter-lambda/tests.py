def test_convertir_entiers():
    assert convertir_entiers(["1", "22", "-3"]) == [1, 22, -3], "chaque texte devient un entier"
    assert convertir_entiers([]) == [], "liste vide"


def test_renvoie_des_listes():
    assert isinstance(convertir_entiers(["1"]), list), "il faut renvoyer une liste : utilise list(map(...))"
    assert isinstance(multiples_de([3], 3), list), "il faut renvoyer une liste : utilise list(filter(...))"


def test_multiples_de():
    assert multiples_de([3, 6, 7, 9, 10], 3) == [3, 6, 9], "les multiples de 3"
    assert multiples_de([1, 2, 3, 4], 2) == [2, 4], "les multiples de 2"


def test_produits():
    assert produits([1, 2, 3], [4, 5, 6]) == [4, 10, 18], "1*4, 2*5, 3*6"
    assert produits([1, 2, 3], [10]) == [10], "map s'arrête à la plus courte"


def test_avec_tva():
    assert avec_tva([10, 2.5], 0.2) == [12.0, 3.0], "TVA de 20 %"
    assert avec_tva([19.99], 0.055) == [21.09], "arrondi à 2 décimales"
