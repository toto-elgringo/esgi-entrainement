def test_mots_courts_limite():
    assert mots_courts("Bonjour à tous", 7) is True, "Bonjour fait exactement 7 lettres : c'est permis (au plus 7)"
    assert mots_courts("maison soleil") is True, "6 et 6 lettres : au plus 6, c'est bon"


def test_mots_courts():
    assert mots_courts("un mot beaucoup trop long") is False, "beaucoup fait 8 lettres"
    assert mots_courts("") is True, "aucun mot : rien ne dépasse"


def test_contient_nombre():
    assert contient_nombre("il a 12 ans") is True, "12 n'est fait que de chiffres"
    assert contient_nombre("a1 b2") is False, "a1 contient une lettre"
    assert contient_nombre("") is False, "aucun mot"


def test_aucun_negatif():
    assert aucun_negatif([0, 3, 8]) is True, "0 n'est pas négatif"
    assert aucun_negatif([4, -1]) is False, "-1 est négatif"
    assert aucun_negatif([]) is True, "liste vide : aucun négatif"


def test_tous_differents():
    assert tous_differents([1, 2, 3]) is True, "trois valeurs différentes"
    assert tous_differents(["a", "b", "a"]) is False, "a apparaît deux fois"
    assert tous_differents([]) is True, "liste vide"


def test_matrice_rectangulaire():
    assert matrice_rectangulaire([[1, 2], [3, 4], [5, 6]]) is True, "trois lignes de 2"
    assert matrice_rectangulaire([[1, 2], [3]]) is False, "la deuxième ligne est plus courte"
    assert matrice_rectangulaire([]) is True, "une matrice vide est rectangulaire (et ne doit pas planter)"
