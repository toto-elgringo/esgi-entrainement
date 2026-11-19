def test_inverser_mots():
    assert inverser_mots("Hello world") == "olleH dlrow", "chaque mot à l'envers"
    assert inverser_mots("Salut  les gens") == "tulaS sel sneg", "deux espaces de suite : pas de mot vide, un seul espace dans le résultat"
    assert inverser_mots("  ok  ") == "ko", "les espaces au début et à la fin disparaissent"


def test_mots_en_minuscules():
    assert mots_en_minuscules("Hello world") == "world", "Hello commence par une majuscule"
    assert mots_en_minuscules("la guerre de 14-18 a1") == "la guerre de", "14-18 et a1 ne sont pas faits que de lettres"
    assert mots_en_minuscules("Salut  les gens !") == "les gens", "le ! n'est pas une lettre"


def test_abs_des_pairs():
    assert abs_des_pairs([-4, 3, 2, -1]) == [4, 2], "-4 et 2 sont pairs"
    assert abs_des_pairs([0, -7]) == [0], "0 est pair"
    assert abs_des_pairs([]) == [], "liste vide"


def test_grille_contenu():
    assert grille(2, 3, 0) == [[0, 0, 0], [0, 0, 0]], "2 lignes de 3 zéros"
    assert grille(0, 3, 1) == [], "aucune ligne"


def test_grille_lignes_independantes():
    g = grille(3, 2, ".")
    g[0][1] = "#"
    assert g == [[".", "#"], [".", "."], [".", "."]], "modifier une case de la ligne 0 ne doit pas toucher les autres lignes"
