def test_create_adder():
    plus1 = create_adder(1)
    plus10 = create_adder(10)
    assert callable(plus1), "create_adder doit renvoyer une fonction"
    assert plus1(24) == 25, "plus1(24) vaut 25"
    assert plus10(24) == 34, "plus10(24) vaut 34 : chaque fonction garde son propre n"


def test_create_multiplier():
    triple = create_multiplier(3)
    assert triple(5) == 15, "triple(5) vaut 15"
    assert create_multiplier(0)(99) == 0, "multiplier par 0 donne 0"


def test_composer():
    plus1_puis_double = composer(create_multiplier(2), create_adder(1))
    assert plus1_puis_double(4) == 10, "composer(f, g)(x) vaut f(g(x)) : (4 + 1) * 2 = 10"
    assert composer(len, str)(12345) == 5, "len(str(12345)) vaut 5"


def test_compteur():
    c = compteur()
    assert c() == 1, "premier appel : 1"
    assert c() == 2, "deuxième appel : 2"
    assert c() == 3, "troisième appel : 3"


def test_compteurs_independants():
    a = compteur()
    b = compteur()
    a()
    a()
    assert b() == 1, "un nouveau compteur repart de 1"
    assert a() == 3, "le premier compteur continue de son côté"
