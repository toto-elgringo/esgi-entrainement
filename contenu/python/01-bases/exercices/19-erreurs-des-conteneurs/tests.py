def test_retirer_premier():
    l = [3, 5, 3]
    assert retirer_premier(l, 3) is True, "3 est dans la liste"
    assert l == [5, 3], "seule la première occurrence de 3 est retirée"
    assert retirer_premier(l, 9) is False, "9 n'est pas dans la liste : False, sans erreur"
    assert l == [5, 3], "la liste ne change pas si la valeur est absente"


def test_rang():
    assert rang(["Ana", "Tom", "Eva"], "Tom") == 2, "Tom est deuxième : indice 1, rang 2"
    assert rang(["Ana", "Tom"], "Ana") == 1, "le premier a le rang 1"
    assert rang(["Ana", "Tom"], "Zoé") is None, "absente : None"
    assert rang([], "Ana") is None, "liste vide : None"


def test_deuxieme_position():
    assert deuxieme_position([4, 7, 4, 4], 4) == 2, "le deuxième 4 est à l'indice 2"
    assert deuxieme_position(["a", "b", "c", "b"], "b") == 3, "le deuxième b est à l'indice 3"
    assert deuxieme_position([4, 7], 4) == -1, "un seul 4 : -1"
    assert deuxieme_position([4, 7], 9) == -1, "aucun 9 : -1"


def test_prix_total():
    assert prix_total(["pain", "lait", "café", "pain"], {"pain": 1.2, "lait": 0.9}) == (3.3, ["café"]), "café n'a pas de tarif"
    assert prix_total([], {"pain": 1.2}) == (0, []), "panier vide"
    assert prix_total(["x", "y"], {}) == (0, ["x", "y"]), "aucun tarif connu"


def test_remettre_a_zero():
    liste = [1, 2]
    ensemble = {"a", "b", "c"}
    dico = {"k": 1}
    assert remettre_a_zero(liste, ensemble, dico) == 6, "2 + 3 + 1 éléments retirés"
    assert liste == [] and ensemble == set() and dico == {}, "les trois conteneurs reçus sont vides"
