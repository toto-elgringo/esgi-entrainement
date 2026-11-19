def test_valeur_du_milieu():
    assert valeur_du_milieu([7, 1, 9, 4]) == 9, "4 éléments : l'indice du milieu est 4 // 2 = 2"
    assert valeur_du_milieu([5, 8, 3]) == 8, "3 éléments : l'indice du milieu est 3 // 2 = 1 (round(1.5) donnerait 2)"
    assert valeur_du_milieu([6]) == 6, "un seul élément"
    assert valeur_du_milieu([1, 2, 3, 4, 5]) == 3, "5 éléments : indice 2 (round(2.5) donnerait 2 aussi, mais par hasard)"


def test_mediane_impaire():
    assert mediane([7, 1, 9]) == 7, "triée : [1, 7, 9], le milieu vaut 7"
    assert mediane([3]) == 3, "une seule valeur"


def test_mediane_paire():
    assert mediane([7, 1, 9, 4]) == 5.5, "triée : [1, 4, 7, 9], moyenne de 4 et 7"
    assert mediane([2, 2]) == 2, "moyenne de 2 et 2"


def test_mediane_ne_modifie_pas():
    notes = [7, 1, 9, 4]
    mediane(notes)
    assert notes == [7, 1, 9, 4], "la liste reçue ne doit pas être triée : utilise sorted(l), pas l.sort()"


def test_etendue():
    assert etendue([12, 4, 9]) == 8, "12 - 4"
    assert etendue([5]) == 0, "une seule valeur : écart nul"
    assert etendue((-3, 3)) == 6, "marche aussi avec un tuple"


def test_moyenne_sans_extremes():
    assert moyenne_sans_extremes([10, 2, 14, 12]) == 11.0, "on retire 2 et 14, il reste 10 et 12"
    assert moyenne_sans_extremes([5, 5, 5]) == 5.0, "on retire un seul 5 de chaque côté"
    assert moyenne_sans_extremes([0, 20, 10, 20]) == 15.0, "on retire 0 et un seul des deux 20"


def test_moyenne_sans_extremes_ne_modifie_pas():
    notes = [10, 2, 14, 12]
    moyenne_sans_extremes(notes)
    assert notes == [10, 2, 14, 12], "la liste reçue ne doit pas changer"
