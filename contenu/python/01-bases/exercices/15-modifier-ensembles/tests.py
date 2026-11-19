def test_chiffres_pairs():
    resultat = chiffres_pairs()
    assert isinstance(resultat, set), "il faut renvoyer un ensemble (set), pas une liste"
    assert resultat == {0, 2, 4, 6, 8}, "les chiffres pairs de 0 à 8"


def test_lettres_utilisees():
    assert lettres_utilisees("Bob a ri") == ["a", "b", "i", "o", "r"], "B et b ne comptent qu'une fois, l'espace est retiré"
    assert lettres_utilisees("") == [], "texte vide"


def test_inscrire():
    inscrits = {"Ana", "Bob"}
    assert inscrire(inscrits, "Eva") is True, "Eva n'était pas inscrite"
    assert inscrits == {"Ana", "Bob", "Eva"}, "Eva est ajoutée à l'ensemble reçu"
    assert inscrire(inscrits, "Ana") is False, "Ana était déjà inscrite"
    assert inscrits == {"Ana", "Bob", "Eva"}, "rien ne change pour Ana"


def test_desinscrire():
    inscrits = {"Ana", "Bob", "Eva"}
    desinscrire(inscrits, ["Bob", "Zoé"])
    assert inscrits == {"Ana", "Eva"}, "Bob est retiré, Zoé était absente : pas d'erreur"
    desinscrire(inscrits, [])
    assert inscrits == {"Ana", "Eva"}, "une liste vide ne retire rien"


def test_vider():
    s = {3, 1, 2}
    assert vider(s) == [1, 2, 3], "les éléments retirés, triés"
    assert s == set(), "l'ensemble reçu est vide à la fin"
    assert vider(set()) == [], "un ensemble déjà vide"
