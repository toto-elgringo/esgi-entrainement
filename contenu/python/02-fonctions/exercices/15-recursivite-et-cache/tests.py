import threading


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


def test_fibo_petits():
    assert [fibo(n) for n in range(10)] == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], "les 10 premiers termes"


def test_fibo_rapide():
    fini, valeur = _avant_delai(lambda: fibo(200))
    assert fini, "fibo(200) doit répondre en moins d'une seconde : ajoute un cache"
    assert valeur == 280571172992510140037611932413038677189525, "valeur de fibo(200)"


def test_fibo_negatif():
    try:
        fibo(-1)
    except ValueError:
        return
    assert False, "fibo(-1) doit lever ValueError"


def test_nb_chemins_petits():
    assert nb_chemins(1, 1) == 1, "une seule case : un chemin (ne pas bouger)"
    assert nb_chemins(1, 10) == 1, "une seule ligne : un chemin"
    assert nb_chemins(2, 2) == 2, "grille 2 x 2 : 2 chemins"
    assert nb_chemins(3, 3) == 6, "grille 3 x 3 : 6 chemins"
    assert nb_chemins(3, 4) == 10, "grille 3 x 4 : 10 chemins"


def test_nb_chemins_rapide():
    fini, valeur = _avant_delai(lambda: nb_chemins(16, 16))
    assert fini, "nb_chemins(16, 16) doit répondre en moins d'une seconde : ajoute un cache"
    assert valeur == 155117520, "valeur de nb_chemins(16, 16)"
