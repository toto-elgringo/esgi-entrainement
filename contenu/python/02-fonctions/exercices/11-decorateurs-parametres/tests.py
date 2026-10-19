def test_repeter():
    @repeter(3)
    def bonjour(nom):
        return "Bonjour " + nom

    assert bonjour("Ada") == ["Bonjour Ada"] * 3, "3 fois le résultat, dans une liste"


def test_repeter_appelle_vraiment():
    vus = []

    @repeter(4)
    def noter(x):
        vus.append(x)
        return len(vus)

    assert noter("a") == [1, 2, 3, 4], "la fonction doit être appelée 4 fois"


def test_limiter_autorise():
    @limiter(2)
    def tirer():
        return "pan"

    assert tirer() == "pan", "premier appel autorisé"
    assert tirer() == "pan", "deuxième appel autorisé"


def test_limiter_refuse():
    @limiter(1)
    def tirer():
        return "pan"

    tirer()
    try:
        tirer()
    except RuntimeError as erreur:
        assert str(erreur) == "trop d'appels", "le message doit être « trop d'appels »"
    else:
        assert False, "le deuxième appel doit lever une RuntimeError"


def test_limiter_independant():
    @limiter(1)
    def a():
        return "a"

    @limiter(1)
    def b():
        return "b"

    assert a() == "a" and b() == "b", "chaque fonction décorée a sa propre limite"
