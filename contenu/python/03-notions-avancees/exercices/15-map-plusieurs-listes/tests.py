def test_lire_entiers():
    assert lire_entiers("1;3;5;15;24") == (1, 3, 5, 15, 24), "des entiers séparés par des points-virgules"
    assert lire_entiers("4; 8;;15") == (4, 8, 15), "espaces autour acceptés, morceau vide ignoré"
    assert lire_entiers("7 -2 10", " ") == (7, -2, 10), "un autre séparateur, et un nombre négatif"
    assert lire_entiers("") == (), "texte vide : tuple vide"


def test_lire_entiers_renvoie_un_tuple():
    assert isinstance(lire_entiers("1;2"), tuple), "il faut un tuple, pas une liste ni un objet map"


def test_parite():
    assert parite([3, 4]) == ("impair", "pair"), "3 est impair, 4 est pair"
    assert parite([0, -1]) == ("pair", "impair"), "0 est pair, -1 est impair"


def test_maximums():
    assert maximums([1, 9, 3], [4, 2, 3]) == [4, 9, 3], "le plus grand à chaque rang"
    assert maximums([5, 6, 7], [1]) == [5], "s'arrête à la liste la plus courte"


def test_appliquer_remises():
    assert appliquer_remises([20, 9.99], [10, 0]) == [18.0, 9.99], "10 % sur 20 donne 18, 0 % ne change rien"
    assert appliquer_remises([15.5], [25]) == [11.62], "15.5 moins 25 % donne 11.625, arrondi à 11.62"


def test_noms_complets():
    assert noms_complets(["ada", "ALAN"], ["lovelace", "Turing"]) == ["Ada LOVELACE", "Alan TURING"], "Prénom puis NOM"
    assert noms_complets([], []) == [], "aucun nom"
