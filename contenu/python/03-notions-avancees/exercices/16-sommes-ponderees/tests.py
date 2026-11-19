def test_valeur_mot():
    assert valeur_mot("Abc") == 6, "a + b + c = 1 + 2 + 3"
    assert valeur_mot("z") == 26, "z est la 26e lettre"
    assert valeur_mot("a-b c!") == 6, "les caractères qui ne sont pas des lettres comptent pour 0"
    assert valeur_mot("") == 0, "mot vide"


def test_somme_ponderee():
    assert somme_ponderee([5, 1, 2]) == 13, "5×1 + 1×2 + 2×3"
    assert somme_ponderee([7]) == 7, "la première position vaut 1, pas 0"
    assert somme_ponderee([]) == 0, "liste vide"


def test_moyenne_ponderee():
    assert moyenne_ponderee([10, 16], [1, 3]) == 14.5, "(10×1 + 16×3) / 4"
    assert moyenne_ponderee([12, 8], [2, 2]) == 10, "coefficients égaux : moyenne simple"
    assert moyenne_ponderee([15], [0]) is None, "somme des coefficients nulle : None"


def test_cle_isbn():
    assert cle_isbn("207036002") == "4", "1×2 + 2×0 + 3×7 + ... = 125, reste 4"
    assert cle_isbn("030640615") == "2", "reste 2"
    assert cle_isbn("080442957") == "X", "un reste de 10 s'écrit X"
    assert cle_isbn("000000000") == "0", "que des zéros : clé 0"
