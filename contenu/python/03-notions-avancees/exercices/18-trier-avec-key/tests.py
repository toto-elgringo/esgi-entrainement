def test_items_tries():
    assert items_tries({"b": 1, "a": 2, "d": 5}) == [("a", 2), ("b", 1), ("d", 5)], "triés par clé"
    assert items_tries({}) == [], "dictionnaire vide"


def test_cles_par_valeur():
    assert cles_par_valeur({"kiwi": 3, "abricot": 5, "fraise": 3}) == ["abricot", "fraise", "kiwi"], "5 d'abord, puis fraise et kiwi (égalité à 3) par ordre alphabétique"
    assert cles_par_valeur({"x": 1}) == ["x"], "une seule clé"


def test_trier_par_somme():
    assert trier_par_somme([[5, 5], [1], [2, 3]]) == [[1], [2, 3], [5, 5]], "sommes 10, 1 et 5"
    assert trier_par_somme([[4], [], [1, 3]]) == [[], [4], [1, 3]], "une liste vide a une somme de 0 ; à égalité, l'ordre d'origine est gardé"


def test_trier_sans_casse():
    assert trier_sans_casse(["banane", "Abricot", "cerise", "Zèbre"]) == ["Abricot", "banane", "cerise", "Zèbre"], "Zèbre va à la fin malgré sa majuscule"
    assert trier_sans_casse(["b", "A"]) == ["A", "b"], "les mots ne sont pas modifiés"


def test_plus_proche():
    assert plus_proche([2, 9, 6], 7) == 6, "6 est à 1 de 7, 9 est à 2"
    assert plus_proche([4, 8], 6) == 4, "4 et 8 sont à égale distance : le plus petit"
    assert plus_proche([-3, 10], 0) == -3, "distance 3 contre 10"
    assert plus_proche([], 5) is None, "liste vide : None"
