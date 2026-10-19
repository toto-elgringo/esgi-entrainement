def test_division_sure():
    assert division_sure(10, 4) == 2.5, "10 / 4 vaut 2.5"
    assert division_sure(1, 0) is None, "division par zéro : None"


def test_lire_entier():
    assert lire_entier("42") == 42, "« 42 » devient 42"
    assert lire_entier("abc") == 0, "texte invalide : valeur par défaut 0"
    assert lire_entier("4.5", -1) == -1, "« 4.5 » n'est pas un entier : valeur par défaut -1"


def test_acces_sur_dict():
    d = {"a": 1}
    assert acces_sur(d, "a") == 1, "clé présente : sa valeur"
    assert acces_sur(d, "z") is None, "clé absente : None"


def test_acces_sur_liste():
    l = [10, 20]
    assert acces_sur(l, 1) == 20, "indice valide : l'élément"
    assert acces_sur(l, 5) is None, "indice hors de la liste : None"


def test_need_positive_number_ok():
    assert need_positive_number(3) == 3, "un nombre positif est renvoyé"
    assert need_positive_number(0) == 0, "zéro est accepté"


def test_need_positive_number_leve():
    try:
        need_positive_number(-1)
    except ValueError as erreur:
        assert str(erreur) == "need to be positive", "le message doit être « need to be positive »"
    else:
        assert False, "need_positive_number(-1) doit lever une ValueError"
