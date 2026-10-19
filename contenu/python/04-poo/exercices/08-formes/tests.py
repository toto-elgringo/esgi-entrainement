import math


def test_aires():
    assert Rectangle(2, 3).aire() == 6, "un rectangle 2 × 3 a une aire de 6"
    assert Carre(4).aire() == 16, "un carré de côté 4 a une aire de 16"
    assert abs(Cercle(1).aire() - math.pi) < 1e-9, "un cercle de rayon 1 a une aire de π"


def test_heritage():
    assert issubclass(Carre, Rectangle), "Carre doit hériter de Rectangle"
    assert issubclass(Cercle, Forme) and issubclass(Rectangle, Forme), "toutes les formes héritent de Forme"


def test_description_polymorphe():
    assert Rectangle(2, 3).description() == "Rectangle d'aire 6.00", "description d'un rectangle"
    assert Carre(2).description() == "Carre d'aire 4.00", "le nom affiché est celui de la classe réelle"
    assert Cercle(1).description() == "Cercle d'aire 3.14", "description d'un cercle"


def test_description_ecrite_une_fois():
    for classe in (Rectangle, Carre, Cercle):
        assert "description" not in classe.__dict__, "description doit être écrite seulement dans Forme, pas dans " + classe.__name__


def test_forme_abstraite():
    try:
        Forme().aire()
    except NotImplementedError:
        pass
    else:
        assert False, "Forme().aire() doit toujours lever NotImplementedError"


def test_aire_totale():
    total = aire_totale([Rectangle(2, 3), Carre(2), Cercle(1)])
    assert abs(total - (10 + math.pi)) < 1e-9, "6 + 4 + π"
    assert aire_totale([]) == 0, "aucune forme : 0"
