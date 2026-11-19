def test_inverser_groupes():
    assert inverser_groupes({"a": 1, "b": 1, "c": 2, "d": 3, "e": 2}) == {1: ["a", "b"], 2: ["c", "e"], 3: ["d"]}, "a et b ont la valeur 1 : aucune des deux ne doit être perdue"
    assert inverser_groupes({}) == {}, "dictionnaire vide : résultat vide"


def test_inverser_groupes_listes_triees():
    assert inverser_groupes({"z": 0, "m": 0, "a": 0}) == {0: ["a", "m", "z"]}, "la liste des clés est triée"


def test_inverser_groupes_ne_modifie_pas():
    d = {"x": 5, "y": 5}
    inverser_groupes(d)
    assert d == {"x": 5, "y": 5}, "le dictionnaire reçu ne doit pas changer"


def test_familles_anagrammes():
    attendu = {"el": ["le"], "cehin": ["chien", "chine", "niche"], "de": ["de"], "al": ["la"], "aeim": ["aime"]}
    assert familles_anagrammes("le chien de la chine aime la niche") == attendu, "chien, chine et niche ont les mêmes lettres"


def test_familles_anagrammes_sans_doublon():
    assert familles_anagrammes("de ed de  de") == {"de": ["de", "ed"]}, "« de » apparaît trois fois mais n'est gardé qu'une fois"
    assert familles_anagrammes("") == {}, "texte vide : dictionnaire vide"


def test_valeurs_partagees():
    assert valeurs_partagees({"Ana": "B1", "Tom": "B2", "Eva": "B1"}) == ["B1"], "seule B1 a deux élèves"
    assert valeurs_partagees({"a": 2, "b": 1, "c": 2, "d": 1, "e": 3}) == [1, 2], "1 et 2 sont partagées, triées"
    assert valeurs_partagees({"a": 1, "b": 2}) == [], "aucune valeur partagée"
