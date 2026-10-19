def test_convertir_exemple():
    assert convertir(3725) == (1, 2, 5), "3725 secondes font 1 h 2 min 5 s"


def test_convertir_petites_durees():
    assert convertir(0) == (0, 0, 0), "0 seconde donne (0, 0, 0)"
    assert convertir(59) == (0, 0, 59), "59 secondes donnent (0, 0, 59)"
    assert convertir(60) == (0, 1, 0), "60 secondes font exactement 1 minute"


def test_convertir_grandes_durees():
    assert convertir(3600) == (1, 0, 0), "3600 secondes font exactement 1 heure"
    assert convertir(90061) == (25, 1, 1), "90061 secondes font 25 h 1 min 1 s (on ne passe pas aux jours)"


def test_en_secondes():
    assert en_secondes(1, 2, 5) == 3725, "1 h 2 min 5 s font 3725 secondes"
    assert en_secondes(0, 0, 0) == 0, "0 h 0 min 0 s font 0 seconde"
    assert en_secondes(2, 30, 0) == 9000, "2 h 30 font 9000 secondes"


def test_aller_retour():
    for duree in [1, 61, 3599, 3601, 86399]:
        assert en_secondes(*convertir(duree)) == duree, "convertir puis en_secondes doit redonner " + str(duree)
