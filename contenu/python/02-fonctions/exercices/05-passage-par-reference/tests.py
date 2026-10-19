def test_ajouter_bonus_modifie():
    notes = [12, 19, 5]
    ajouter_bonus(notes, 2)
    assert notes == [14, 20, 7], "la liste reçue doit être modifiée, et 19 + 2 est plafonné à 20"


def test_ajouter_bonus_ne_renvoie_rien():
    assert ajouter_bonus([10], 1) is None, "ajouter_bonus modifie la liste, elle ne renvoie rien"


def test_ajouter_bonus_meme_liste():
    notes = [10]
    alias = notes
    ajouter_bonus(notes, 5)
    assert alias == [15], "c'est la même liste qui doit changer (pas une nouvelle liste rangée dans une variable locale)"


def test_avec_bonus_renvoie():
    assert avec_bonus([8, 15, 20], 3) == [11, 18, 20], "chaque note reçoit 3 points, plafonnée à 20"
    assert avec_bonus([], 3) == [], "liste vide : liste vide"


def test_avec_bonus_ne_modifie_pas():
    autres = [8, 15]
    avec_bonus(autres, 3)
    assert autres == [8, 15], "la liste d'origine ne doit pas changer"
