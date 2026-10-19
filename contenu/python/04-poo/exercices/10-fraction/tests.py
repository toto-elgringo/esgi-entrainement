def test_simplification():
    f = Fraction(6, 8)
    assert (f.num, f.den) == (3, 4), "6/8 est simplifiée en 3/4"
    g = Fraction(10, 5)
    assert (g.num, g.den) == (2, 1), "10/5 est simplifiée en 2/1"


def test_signe():
    f = Fraction(1, -2)
    assert (f.num, f.den) == (-1, 2), "1/-2 devient -1/2 : le dénominateur est toujours positif"
    g = Fraction(-3, -6)
    assert (g.num, g.den) == (1, 2), "-3/-6 devient 1/2"


def test_denominateur_nul():
    try:
        Fraction(1, 0)
    except ZeroDivisionError:
        pass
    else:
        assert False, "Fraction(1, 0) doit lever une ZeroDivisionError"


def test_affichage():
    assert str(Fraction(3, 4)) == "3/4", "str(Fraction(3, 4)) vaut « 3/4 »"
    assert str(Fraction(4, 2)) == "2", "un dénominateur 1 ne s'affiche pas"
    assert str(Fraction(0, 5)) == "0", "0/5 s'affiche « 0 »"
    assert repr(Fraction(6, 8)) == "Fraction(3, 4)", "repr affiche la fraction simplifiée"


def test_egalite():
    assert Fraction(1, 2) == Fraction(2, 4), "1/2 et 2/4 sont égales"
    assert not (Fraction(1, 2) == Fraction(1, 3)), "1/2 et 1/3 sont différentes"


def test_addition():
    assert Fraction(1, 2) + Fraction(1, 3) == Fraction(5, 6), "1/2 + 1/3 = 5/6"
    assert Fraction(1, 4) + Fraction(3, 4) == Fraction(1), "1/4 + 3/4 = 1"


def test_multiplication():
    assert Fraction(2, 3) * Fraction(3, 4) == Fraction(1, 2), "2/3 × 3/4 = 1/2"
    assert Fraction(-1, 2) * Fraction(2, 5) == Fraction(-1, 5), "avec un négatif"


def test_comparaison():
    assert Fraction(1, 3) < Fraction(1, 2), "1/3 < 1/2"
    assert not (Fraction(3, 4) < Fraction(2, 3)), "3/4 n'est pas plus petit que 2/3"
    assert sorted([Fraction(3, 4), Fraction(1, 3), Fraction(1, 2)]) == [Fraction(1, 3), Fraction(1, 2), Fraction(3, 4)], "avec __lt__, sorted sait trier des fractions"
