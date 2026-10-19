def test_longueurs():
    assert longueurs(["chat", "souris", "ours"]) == {"chat": 4, "souris": 6, "ours": 4}, "une entrée par mot"
    assert longueurs([]) == {}, "aucun mot : dictionnaire vide"


def test_inverser():
    assert inverser({"pomme": 2, "kiwi": 5}) == {2: "pomme", 5: "kiwi"}, "clés et valeurs échangées"


def test_abordables():
    prix = {"pomme": 2, "kiwi": 5, "melon": 8}
    assert abordables(prix, 5) == {"pomme": 2, "kiwi": 5}, "un prix égal au budget est abordable"
    assert abordables(prix, 1) == {}, "rien n'est abordable avec 1"
    assert prix == {"pomme": 2, "kiwi": 5, "melon": 8}, "le dictionnaire d'origine ne doit pas changer"


def test_initiales():
    assert initiales(["Chat", "chien", "ours"]) == {"c", "o"}, "Chat et chien donnent le même c"
    assert initiales(["", "Arbre"]) == {"a"}, "les mots vides sont ignorés"
    assert isinstance(initiales([]), set), "il faut renvoyer un ensemble (set), même vide"
