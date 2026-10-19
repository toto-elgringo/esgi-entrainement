def test_attributs():
    p = Point(3, 4)
    assert p.x == 3 and p.y == 4, "Point(3, 4) doit avoir x = 3 et y = 4"


def test_distance_origine():
    assert Point(3, 4).distance_origine() == 5.0, "le point (3, 4) est à distance 5 de l'origine"
    assert Point(0, 0).distance_origine() == 0.0, "l'origine est à distance 0"


def test_deplacer():
    p = Point(3, 4)
    resultat = p.deplacer(1, -1)
    assert (p.x, p.y) == (4, 3), "après deplacer(1, -1), le point (3, 4) devient (4, 3)"
    assert resultat is None, "deplacer modifie le point, elle ne renvoie rien"


def test_symetrique():
    p = Point(2, -5)
    s = p.symetrique()
    assert isinstance(s, Point), "symetrique doit renvoyer un Point"
    assert (s.x, s.y) == (-2, 5), "le symétrique de (2, -5) est (-2, 5)"
    assert (p.x, p.y) == (2, -5), "le point d'origine ne doit pas changer"


def test_points_independants():
    a = Point(1, 1)
    b = Point(1, 1)
    a.deplacer(5, 5)
    assert (b.x, b.y) == (1, 1), "chaque point a ses propres coordonnées"
