import inspect


def test_sont_des_generateurs():
    for fonction in (pows, compte_a_rebours, fibonacci):
        assert inspect.isgeneratorfunction(fonction), fonction.__name__ + " doit utiliser yield"


def test_pows():
    assert list(pows(3, 2)) == [1, 4, 9], "pows(3, 2) fournit 1, 4, 9"
    assert list(pows(4, 1)) == [1, 2, 3, 4], "pows(4, 1) fournit 1, 2, 3, 4"
    assert list(pows(0, 5)) == [], "pows(0, 5) ne fournit rien"


def test_compte_a_rebours():
    assert list(compte_a_rebours(3)) == [3, 2, 1], "compte_a_rebours(3) fournit 3, 2, 1"
    assert list(compte_a_rebours(0)) == [], "compte_a_rebours(0) ne fournit rien"


def test_fibonacci():
    f = fibonacci()
    premiers = [next(f) for _ in range(10)]
    assert premiers == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], "les 10 premiers termes de Fibonacci"


def test_fibonacci_infini():
    f = fibonacci()
    for _ in range(100):
        dernier = next(f)
    assert dernier == 218922995834555169026, "le 100e terme est atteint sans s'arrêter"
