def test_un_sur_trois():
    assert un_sur_trois([5, 6, 7, 8, 9]) == [5, 8], "indices 0 et 3"
    assert un_sur_trois(list(range(10))) == [0, 3, 6, 9], "indices 0, 3, 6 et 9"
    assert un_sur_trois([]) == [], "liste vide"


def test_impairs_a_l_envers():
    assert impairs_a_l_envers([0, 1, 2, 3, 4, 5]) == [5, 3, 1], "indices impairs 1, 3, 5, à l'envers"
    assert impairs_a_l_envers([0, 1, 2, 3, 4]) == [3, 1], "le dernier élément (indice 4) est pair : on ne le prend pas"
    assert impairs_a_l_envers([9]) == [], "un seul élément, d'indice 0 : rien"


def test_miroir():
    l = [1, 2, 3]
    assert miroir(l) == [1, 2, 3, 3, 2, 1], "la liste puis son reflet"
    assert l == [1, 2, 3], "la liste reçue ne doit pas changer"
    assert miroir([]) == [], "le miroir d'une liste vide est vide"


def test_motif():
    assert motif([1, 2, 3], 2, 3) == [1, 2, 1, 2, 1, 2], "[1, 2] trois fois"
    assert motif(["a", "b"], 5, 2) == ["a", "b", "a", "b"], "n plus grand que la liste : on prend tout ce qu'il y a"
    assert motif([1, 2], 2, 0) == [], "répéter 0 fois donne une liste vide"


def test_sauf_bouts():
    assert sauf_bouts([1, 2, 3, 4]) == [2, 3], "sans le 1 ni le 4"
    assert sauf_bouts([1, 2]) == [], "deux éléments : il ne reste rien"
    assert sauf_bouts([]) == [], "une liste vide ne provoque pas d'erreur"


def test_zeros():
    assert zeros(3) == [0, 0, 0], "trois zéros"
    assert zeros(0) == [], "zéro zéro : liste vide"
