import inspect
from itertools import chain, count, cycle, islice, repeat


def test_sont_des_generateurs():
    for fonction in (nouveautes, doublons, cumuls, series):
        assert inspect.isgeneratorfunction(fonction), fonction.__name__ + " doit utiliser yield"


def test_nouveautes():
    assert list(nouveautes("abracadabra")) == ["a", "b", "r", "c", "d"], "chaque lettre une seule fois, dans l'ordre"
    assert list(nouveautes([])) == [], "rien à fournir"


def test_nouveautes_infini():
    assert list(islice(nouveautes(x % 4 for x in count()), 4)) == [0, 1, 2, 3], "fonctionne sur un itérable infini"


def test_doublons():
    assert list(doublons("abracadabra")) == ["a", "b", "r"], "a, b et r apparaissent une deuxième fois, dans cet ordre"
    assert list(doublons([1, 1, 1, 1])) == [1], "un élément n'est fourni qu'une fois"
    assert list(doublons("abc")) == [], "aucun doublon"


def test_doublons_infini():
    assert list(islice(doublons(cycle("xyz")), 3)) == ["x", "y", "z"], "fonctionne sur un itérable infini"


def test_cumuls():
    assert list(cumuls([1, 2, 3, 4])) == [1, 3, 6, 10], "sommes cumulées"
    assert list(cumuls([5, -5, 2])) == [5, 0, 2], "avec des négatifs"
    assert list(islice(cumuls(count(1)), 4)) == [1, 3, 6, 10], "fonctionne sur un itérable infini"


def test_series():
    assert list(series("aaabcc")) == [("a", 3), ("b", 1), ("c", 2)], "n'oublie pas la dernière série"
    assert list(series([7])) == [(7, 1)], "un seul élément"
    assert list(series("")) == [], "itérable vide : rien"
    assert list(series("abab")) == [("a", 1), ("b", 1), ("a", 1), ("b", 1)], "seuls les éléments qui se suivent sont regroupés"


def test_series_infini():
    flux = chain("aab", repeat("c"))
    assert list(islice(series(flux), 2)) == [("a", 2), ("b", 1)], "une série est fournie dès qu'elle est terminée"
