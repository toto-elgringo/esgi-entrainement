def test_egalite():
    assert Vecteur(1, 2) == Vecteur(1, 2), "deux vecteurs de mêmes coordonnées sont égaux"
    assert not (Vecteur(1, 2) == Vecteur(2, 1)), "(1, 2) et (2, 1) ne sont pas égaux"


def test_repr():
    assert repr(Vecteur(1, 2)) == "Vecteur(1, 2)", "repr(Vecteur(1, 2)) vaut « Vecteur(1, 2) »"


def test_addition():
    a = Vecteur(1, 2)
    b = Vecteur(3, 4)
    s = a + b
    assert (s.x, s.y) == (4, 6), "(1, 2) + (3, 4) = (4, 6)"
    assert (a.x, a.y) == (1, 2), "l'addition ne modifie pas le premier vecteur"


def test_soustraction():
    d = Vecteur(5, 5) - Vecteur(1, 2)
    assert (d.x, d.y) == (4, 3), "(5, 5) - (1, 2) = (4, 3)"


def test_multiplication():
    m = Vecteur(1, 2) * 3
    assert (m.x, m.y) == (3, 6), "(1, 2) * 3 = (3, 6)"


def test_norme():
    assert Vecteur(3, 4).norme() == 5.0, "la norme de (3, 4) vaut 5"
    assert (Vecteur(1, 1) + Vecteur(2, 3)).norme() == 5.0, "on peut enchaîner les opérations"
