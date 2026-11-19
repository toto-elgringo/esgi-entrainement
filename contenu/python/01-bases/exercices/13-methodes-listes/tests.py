def test_encadrer():
    l = [1, 2, 3]
    resultat = encadrer(l, 0, 9)
    assert l == [0, 1, 2, 3, 9], "0 au début et 9 à la fin, dans la liste reçue"
    assert resultat is None, "la fonction modifie la liste et ne renvoie rien"


def test_encadrer_liste_vide():
    l = []
    encadrer(l, "a", "z")
    assert l == ["a", "z"], "sur une liste vide, on obtient [debut, fin]"


def test_ajouter_plusieurs():
    l = [1, 2, 3]
    ajouter_plusieurs(l, "ab")
    assert l == [1, 2, 3, "a", "b"], "chaque caractère de \"ab\" est ajouté séparément (extend, pas append)"
    ajouter_plusieurs(l, range(2))
    assert l == [1, 2, 3, "a", "b", 0, 1], "marche avec n'importe quel itérable"


def test_retirer_toutes():
    l = [1, 5, 1, 2, 1]
    assert retirer_toutes(l, 1) == 3, "il y avait trois 1"
    assert l == [5, 2], "tous les 1 ont disparu de la liste reçue"
    assert retirer_toutes(l, 8) == 0, "8 est absent : rien à retirer, pas d'erreur"
    assert l == [5, 2], "la liste ne change pas si x est absent"


def test_garder_indices_pairs():
    l = [10, 11, 12, 13, 14]
    garder_indices_pairs(l)
    assert l == [10, 12, 14], "les éléments d'indice 1 et 3 sont supprimés de la liste reçue"
    l = [7]
    garder_indices_pairs(l)
    assert l == [7], "un seul élément : il est d'indice 0, on le garde"


def test_position():
    assert position([4, 7, 4], 4) == 0, "le premier 4 est à l'indice 0"
    assert position([4, 7, 4], 4, 1) == 2, "à partir de l'indice 1, le 4 suivant est à l'indice 2"
    assert position([4, 7, 4], 9) == -1, "9 est absent : -1, sans erreur"
    assert position([4, 7, 4], 7, 2) == -1, "pas de 7 après l'indice 2"
