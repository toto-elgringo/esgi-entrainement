def test_compter_lettres():
    assert compter_lettres("ici") == {"i": 2, "c": 1}, "ici contient deux i et un c"
    assert compter_lettres("a a") == {"a": 2}, "les espaces ne sont pas comptés"
    assert compter_lettres("") == {}, "texte vide : dictionnaire vide"


def test_inverser():
    assert inverser({"a": 1, "b": 2}) == {1: "a", 2: "b"}, "les clés deviennent les valeurs"
    assert inverser({}) == {}, "dictionnaire vide"


def test_fusionner():
    d1 = {"a": 1, "b": 2}
    d2 = {"b": 33, "x": 32}
    assert fusionner(d1, d2) == {"a": 1, "b": 33, "x": 32}, "la valeur de d2 gagne pour la clé b"


def test_fusionner_ne_modifie_rien():
    d1 = {"a": 1}
    d2 = {"b": 2}
    fusionner(d1, d2)
    assert d1 == {"a": 1}, "d1 ne doit pas être modifié (fais une copie avant update)"
    assert d2 == {"b": 2}, "d2 ne doit pas être modifié"


def test_prix_panier():
    tarifs = {"pomme": 0.5, "pain": 1.2}
    assert abs(prix_panier({"pomme": 3, "pain": 1}, tarifs) - 2.7) < 1e-9, "3 pommes et 1 pain font 2.70"
    assert prix_panier({"caviar": 2}, tarifs) == 0, "un article sans tarif compte pour 0"
    assert prix_panier({}, tarifs) == 0, "panier vide : 0"
