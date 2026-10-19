def test_petites_valeurs():
    assert facto(0) == 1, "0! vaut 1"
    assert facto(1) == 1, "1! vaut 1"
    assert facto(2) == 2, "2! vaut 2"


def test_exemple_du_cours():
    assert facto(5) == 120, "5! vaut 120"
    assert facto(10) == 3628800, "10! vaut 3628800"


def test_grand_nombre():
    assert facto(25) == 15511210043330985984000000, "25! est un grand entier, calculé exactement"
