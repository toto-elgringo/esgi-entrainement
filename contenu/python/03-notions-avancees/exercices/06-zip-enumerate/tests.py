def test_associer():
    assert associer(["Tom", "Bob"], [12, 15]) == {"Tom": 12, "Bob": 15}, "chaque nom avec sa note"
    assert associer(["a", "b", "c"], [1]) == {"a": 1}, "on s'arrête à la liste la plus courte"


def test_numeroter():
    assert numeroter(["pain", "lait"]) == ["1. pain", "2. lait"], "numéros à partir de 1"
    assert numeroter([]) == [], "liste vide"


def test_produit_scalaire():
    assert produit_scalaire([1, 2, 3], [4, 5, 6]) == 32, "1*4 + 2*5 + 3*6 = 32"
    assert produit_scalaire([1, 0], [0, 1]) == 0, "deux vecteurs perpendiculaires : 0"


def test_positions():
    assert positions("banane", "a") == [1, 3], "les a de banane sont aux indices 1 et 3"
    assert positions("banane", "z") == [], "lettre absente : liste vide"
    assert positions("aaa", "a") == [0, 1, 2], "trois a d'affilée"
