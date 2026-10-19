def test_trier_par_longueur():
    assert trier_par_longueur(["poire", "kiwi", "banane"]) == ["kiwi", "poire", "banane"], "du plus court au plus long"
    assert trier_par_longueur(["bb", "aa", "c"]) == ["c", "bb", "aa"], "à longueur égale, l'ordre d'origine est gardé"


def test_classement():
    eleves = [("Tom", 12), ("Ana", 15), ("Bob", 15), ("Eva", 9)]
    attendu = [("Ana", 15), ("Bob", 15), ("Tom", 12), ("Eva", 9)]
    assert classement(eleves) == attendu, "notes décroissantes, puis noms croissants en cas d'égalité"


def test_plus_long():
    assert plus_long(["aa", "b", "cccc"]) == "cccc", "cccc est le plus long"
    assert plus_long(["ab", "cd"]) == "ab", "en cas d'égalité, le premier"
    assert plus_long([]) == "", "liste vide : chaîne vide"


def test_mediane():
    assert mediane([3, 1, 2]) == 2, "taille impaire : la valeur du milieu"
    assert mediane([4, 1, 3, 2]) == 2.5, "taille paire : moyenne de 2 et 3"


def test_mediane_ne_modifie_pas():
    nombres = [3, 1, 2]
    mediane(nombres)
    assert nombres == [3, 1, 2], "la liste d'origine ne doit pas être triée (utilise sorted, pas sort)"
