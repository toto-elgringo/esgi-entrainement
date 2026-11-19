import inspect
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


def test_sont_des_generateurs():
    for fonction in (tourner, tours, alterner):
        assert inspect.isgeneratorfunction(fonction), fonction.__name__ + " doit utiliser yield"


def test_tourner():
    assert list(islice(tourner([1, 2]), 5)) == [1, 2, 1, 2, 1], "1, 2, 1, 2, 1..."
    assert list(islice(tourner(x for x in "ab"), 4)) == ["a", "b", "a", "b"], "un générateur en entrée doit être copié dans une liste"


def test_tourner_vide():
    fini, valeur = _avant_delai(lambda: list(tourner([])))
    assert fini, "tourner([]) bloque le programme : arrête le générateur si l'itérable est vide"
    assert valeur == [], "tourner([]) ne fournit rien"


def test_tours():
    assert list(tours([1, 2], 3)) == [1, 2, 1, 2, 1, 2], "3 tours de [1, 2]"
    assert list(tours((c for c in "ab"), 2)) == ["a", "b", "a", "b"], "fonctionne avec un générateur en entrée"
    assert list(tours([1, 2], 0)) == [], "0 tour : rien"
    assert list(tours([], 5)) == [], "itérable vide : rien"


def test_alterner():
    assert list(alterner("abc", [1], "xy")) == ["a", 1, "x", "b", "y", "c"], "à tour de rôle, en sautant les épuisés"
    assert list(alterner()) == [], "sans itérable : rien"
    assert list(alterner([], [1, 2])) == [1, 2], "un itérable vide est sauté"


def test_alterner_infini():
    assert list(islice(alterner(count(), "ab"), 6)) == [0, "a", 1, "b", 2, 3], "fonctionne avec un itérable infini"
