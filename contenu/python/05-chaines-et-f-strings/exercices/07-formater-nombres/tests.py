def test_prix():
    assert prix(1234.5) == "1 234,50 €", "milliers séparés par une espace, décimales par une virgule"
    assert prix(3) == "3,00 €", "toujours 2 décimales"
    assert prix(1234567.891) == "1 234 567,89 €", "plusieurs séparateurs de milliers"


def test_pourcentage():
    assert pourcentage(0.125) == "12.5%", "0.125 vaut 12.5 %"
    assert pourcentage(1) == "100.0%", "1 vaut 100 %"


def test_numero():
    assert numero(7) == "007", "7 sur 3 chiffres"
    assert numero(42) == "042", "42 sur 3 chiffres"
    assert numero(1234) == "1234", "un nombre plus long n'est pas coupé"


def test_heure():
    assert heure(8, 5) == "08h05", "8 h 5 donne 08h05"
    assert heure(14, 30) == "14h30", "14 h 30 donne 14h30"
