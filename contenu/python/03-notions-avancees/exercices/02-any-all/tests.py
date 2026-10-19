def test_tous_positifs():
    assert tous_positifs([1, 2, 3]) is True, "1, 2, 3 sont tous positifs"
    assert tous_positifs([1, 0, 3]) is False, "0 n'est pas strictement positif"
    assert tous_positifs([]) is True, "liste vide : all renvoie True"


def test_au_moins_un_pair():
    assert au_moins_un_pair([1, 3, 4]) is True, "4 est pair"
    assert au_moins_un_pair([1, 3, 5]) is False, "aucun nombre pair"
    assert au_moins_un_pair([]) is False, "liste vide : any renvoie False"


def test_mot_de_passe_valide():
    assert mot_de_passe_valide("Python2026") is True, "Python2026 respecte toutes les règles"
    assert mot_de_passe_valide("Py2026") is False, "trop court (6 caractères)"
    assert mot_de_passe_valide("python2026") is False, "pas de majuscule"
    assert mot_de_passe_valide("PYTHON2026") is False, "pas de minuscule"
    assert mot_de_passe_valide("PythonPython") is False, "pas de chiffre"
