def _erreur(appel):
    try:
        appel()
    except Exception as erreur:
        return erreur
    return None


def test_valeur_polynome():
    assert valeur_polynome([0, 2, 4], 3) == 42, "2×3 + 4×9 = 42 : la puissance s'écrit ** en Python"
    assert valeur_polynome([10, 0.5, 0, 0, 1], 2) == 27, "10 + 0,5×2 + 2⁴ = 27"
    assert valeur_polynome([7], 100) == 7, "un polynôme constant vaut toujours sa constante"
    assert valeur_polynome([], 5) == 0, "aucun coefficient : 0"


def test_valeur_polynome_negatif():
    assert valeur_polynome([1, 0, 1], -2) == 5, "1 + (-2)² = 5"
    assert valeur_polynome([0, 0, 0, 1], -2) == -8, "(-2)³ = -8"


def test_derivee():
    assert derivee([10, 0.5, 0, 0, 1]) == [0.5, 0, 0, 4], "dérivée de 10 + 0,5x + x⁴ : 0,5 + 4x³"
    assert derivee([3, 2, 1]) == [2, 2], "dérivée de 3 + 2x + x² : 2 + 2x"
    assert derivee([5]) == [], "la dérivée d'une constante est vide"
    assert derivee([]) == [], "liste vide : liste vide"


def test_indices_extremes():
    assert indices_extremes([3, 8, 1, 5]) == (2, 1), "le minimum 1 est à l'indice 2, le maximum 8 à l'indice 1"
    assert indices_extremes([42]) == (0, 0), "une seule valeur : c'est le minimum et le maximum"


def test_indices_extremes_premiere_occurrence():
    assert indices_extremes([4, 1, 9, 1, 9]) == (1, 2), "1 et 9 apparaissent deux fois : on garde leur première position"
    assert indices_extremes([2, 2, 2]) == (0, 0), "toutes égales : indice 0 pour les deux"


def test_indices_extremes_vide():
    assert isinstance(_erreur(lambda: indices_extremes([])), ValueError), "liste vide : ValueError"
