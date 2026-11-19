def test_en_secondes():
    assert en_secondes(1, 10, 3) == 4203, "1 h = 3600 s, 10 min = 600 s, plus 3 s"
    assert en_secondes(0, 0, 0) == 0, "minuit : 0 seconde"


def test_en_horaire():
    assert en_horaire(4203) == (1, 10, 3), "4203 s = 1 h 10 min 3 s"
    assert en_horaire(59) == (0, 0, 59), "moins d'une minute"
    assert en_horaire(3600) == (1, 0, 0), "pile une heure"
    assert en_horaire(90061) == (25, 1, 1), "plus de 24 h : les heures continuent"


def test_aller_retour():
    for total in (0, 1, 61, 3599, 3601, 86399):
        assert en_secondes(*en_horaire(total)) == total, "convertir puis reconvertir redonne la même durée"


def test_ecart():
    assert ecart((14, 30, 0), (20, 15, 0)) == (5, 45, 0), "de 14 h 30 à 20 h 15"
    assert ecart((20, 15, 0), (14, 30, 0)) == (5, 45, 0), "dans l'autre sens, l'écart reste positif"
    assert ecart((8, 0, 0), (8, 0, 0)) == (0, 0, 0), "deux horaires égaux"
    assert ecart((9, 59, 50), (10, 0, 5)) == (0, 0, 15), "les secondes et minutes passent la retenue"


def test_ajouter():
    assert ajouter((10, 0, 0), 90) == (10, 1, 30), "90 secondes de plus"
    assert ajouter((23, 30, 0), 3600) == (0, 30, 0), "après minuit, on revient à 0 h"
    assert ajouter((0, 10, 0), -900) == (23, 55, 0), "une durée négative recule, avant minuit"


def test_duree_totale():
    assert duree_totale([(1, 50, 0), (0, 20, 30)]) == (2, 10, 30), "1 h 50 + 20 min 30 s"
    assert duree_totale([(20, 0, 0), (10, 0, 0)]) == (30, 0, 0), "une durée peut dépasser 24 h"
    assert duree_totale([]) == (0, 0, 0), "aucune durée : zéro"
