def test_lettres():
    assert lettres(["Ana", "Bo"]) == ["a", "n", "a", "b", "o"], "toutes les lettres, en minuscules, dans l'ordre"
    assert lettres([]) == [], "aucun prénom"


def test_noms_alliteres():
    attendu = ["Peter Parker", "Bruce Banner"]
    assert noms_alliteres(["Peter", "Bruce"], ["Parker", "Banner", "Wayne"]) == attendu, "même initiale pour le prénom et le nom"
    assert noms_alliteres(["matt"], ["Murdock", "Stark"]) == ["matt Murdock"], "m et M sont la même lettre"
    assert noms_alliteres(["Tony"], ["Parker"]) == [], "aucune allitération"


def test_aplatir():
    assert aplatir([[1, 2], [3], []]) == [1, 2, 3], "les éléments à la suite, une ligne vide ne donne rien"
    assert aplatir([]) == [], "matrice vide"


def test_transposer():
    assert transposer([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]], "2 lignes de 3 deviennent 3 lignes de 2"
    assert transposer([[1], [2]]) == [[1, 2]], "une colonne devient une ligne"
    assert transposer([[7]]) == [[7]], "une seule case"


def test_transposer_renvoie_des_listes():
    resultat = transposer([[1, 2], [3, 4]])
    assert all(isinstance(ligne, list) for ligne in resultat), "chaque ligne doit être une liste, pas un tuple"


def test_annuaire():
    personnes = [("Ada", "Lovelace"), ("Alan", "Turing"), ("Grace", "Hopper")]
    attendu = {"AL": "Ada Lovelace", "AT": "Alan Turing", "GH": "Grace Hopper"}
    assert annuaire(personnes) == attendu, "initiales du prénom et du nom"
    assert annuaire([]) == {}, "personne"
