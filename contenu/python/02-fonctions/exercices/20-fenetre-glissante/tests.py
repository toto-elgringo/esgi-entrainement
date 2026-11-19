import threading
from itertools import count, islice


def _avant_delai(appel, delai=1.0):
    resultat = {}

    def lancer():
        try:
            resultat["valeur"] = appel()
        except Exception as erreur:
            resultat["erreur"] = erreur

    fil = threading.Thread(target=lancer, daemon=True)
    fil.start()
    fil.join(delai)
    if "erreur" in resultat:
        raise resultat["erreur"]
    return not fil.is_alive(), resultat.get("valeur")


def _leve_a_l_appel(appel):
    try:
        appel()
    except ValueError:
        return True
    return False


def test_fenetres():
    assert list(fenetres("abcd", 3)) == [("a", "b", "c"), ("b", "c", "d")], "fenêtres de 3"
    assert list(fenetres([1, 2, 3], 1)) == [(1,), (2,), (3,)], "fenêtres de 1"
    assert list(fenetres([1, 2], 5)) == [], "fenêtre plus grande que la suite : rien"


def test_fenetres_infini():
    assert list(islice(fenetres(count(), 2), 3)) == [(0, 1), (1, 2), (2, 3)], "fonctionne sur un itérable infini"


def test_fenetres_erreur_immediate():
    assert _leve_a_l_appel(lambda: fenetres([1, 2, 3], 0)), "fenetres(..., 0) doit lever ValueError dès l'appel, sans attendre le parcours"
    assert _leve_a_l_appel(lambda: fenetres([1, 2, 3], -2)), "n négatif : ValueError dès l'appel"


def test_moyennes_mobiles():
    assert list(moyennes_mobiles([1, 2, 3, 4, 5], 2)) == [1.5, 2.5, 3.5, 4.5], "moyennes de 2 en 2"
    assert list(moyennes_mobiles([4, 8, 6], 3)) == [6.0], "une seule fenêtre"
    assert list(moyennes_mobiles([1, 2], 3)) == [], "pas assez d'éléments : rien"


def test_moyennes_mobiles_erreur_immediate():
    assert _leve_a_l_appel(lambda: moyennes_mobiles([1, 2, 3], 0)), "moyennes_mobiles(..., 0) doit lever ValueError dès l'appel"


def test_moyennes_mobiles_infini():
    assert list(islice(moyennes_mobiles(count(), 3), 2)) == [1.0, 2.0], "fonctionne sur un itérable infini"


def test_moyennes_mobiles_rapide():
    fini, valeur = _avant_delai(lambda: list(moyennes_mobiles(range(100000), 5000)), 3.0)
    assert fini, "trop lent : garde la somme de la fenêtre au lieu de tout additionner à chaque pas"
    assert len(valeur) == 95001, "95001 fenêtres de 5000 dans 100000 éléments"
    assert valeur[0] == 2499.5, "moyenne de 0 à 4999"
