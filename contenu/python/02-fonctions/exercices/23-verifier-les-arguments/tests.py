def _erreur(appel):
    try:
        appel()
    except Exception as erreur:
        return erreur
    return None


def test_somme_intervalle_montante():
    assert somme_intervalle(1, 10, 3) == 22, "1 + 4 + 7 + 10 = 22 : la fin est incluse"
    assert somme_intervalle(0, 4) == 10, "0 + 1 + 2 + 3 + 4 = 10 (pas de 1 par défaut)"
    assert somme_intervalle(5, 5) == 5, "début = fin : une seule valeur"


def test_somme_intervalle_descendante():
    assert somme_intervalle(10, 1, -3) == 22, "10 + 7 + 4 + 1 = 22 : avec un pas négatif, la fin doit aussi être incluse"
    assert somme_intervalle(3, 1, -1) == 6, "3 + 2 + 1 = 6"


def test_somme_intervalle_mauvais_sens():
    assert somme_intervalle(5, 1) == 0, "on ne peut pas monter de 5 à 1 : 0"
    assert somme_intervalle(1, 5, -1) == 0, "on ne peut pas descendre de 1 à 5 : 0"


def test_somme_intervalle_pas_nul():
    assert isinstance(_erreur(lambda: somme_intervalle(1, 5, 0)), ValueError), "un pas nul doit lever ValueError"


def test_factorielle():
    assert factorielle(0) == 1, "0! = 1"
    assert factorielle(5) == 120, "5! = 120"


def test_factorielle_refuse_les_booleens():
    assert isinstance(_erreur(lambda: factorielle(True)), TypeError), "True est un bool, pas un vrai entier : TypeError"
    assert isinstance(_erreur(lambda: factorielle(False)), TypeError), "False : TypeError"


def test_factorielle_mauvais_types():
    assert isinstance(_erreur(lambda: factorielle(3.0)), TypeError), "3.0 est un float : TypeError"
    assert isinstance(_erreur(lambda: factorielle("3")), TypeError), "\"3\" est un texte : TypeError"
    assert isinstance(_erreur(lambda: factorielle(-1)), ValueError), "n négatif : ValueError"


def test_convertir_tous():
    assert convertir_tous(1, "2.5", 3) == [1.0, 2.5, 3.0], "conversion de chaque valeur en float"
    assert convertir_tous() == [], "aucune valeur : liste vide"


def test_convertir_tous_texte_invalide():
    erreur = _erreur(lambda: convertir_tous(1, "abc"))
    assert isinstance(erreur, TypeError), "\"abc\" n'est pas un nombre : TypeError"
    assert "'abc'" in str(erreur), "le message doit contenir repr(valeur), ici 'abc'"
    assert isinstance(erreur.__cause__, ValueError), "garde l'erreur d'origine avec raise ... from erreur"


def test_convertir_tous_none():
    erreur = _erreur(lambda: convertir_tous(None))
    assert isinstance(erreur, TypeError), "None ne se convertit pas : TypeError"
    assert "None" in str(erreur) and "valeur invalide" in str(erreur), "le message doit être « valeur invalide : None »"
    assert isinstance(erreur.__cause__, TypeError), "float(None) lève une TypeError : c'est la cause à garder"
