def test_appels_independants():
    assert ajouter_tache("a") == ["a"], "le premier appel sans liste donne ['a']"
    assert ajouter_tache("b") == ["b"], "le deuxième appel sans liste doit donner ['b'], pas ['a', 'b']"


def test_liste_donnee():
    mes_taches = ["lire"]
    resultat = ajouter_tache("écrire", mes_taches)
    assert resultat == ["lire", "écrire"], "la tâche est ajoutée à la liste donnée"
    assert mes_taches == ["lire", "écrire"], "la liste donnée est bien modifiée"


def test_compter_independant():
    assert compter_mot("chat") == {"chat": 1}, "premier appel : {'chat': 1}"
    assert compter_mot("chat") == {"chat": 1}, "un nouvel appel sans dictionnaire repart de zéro"


def test_compter_avec_dictionnaire():
    compte = {"chat": 2}
    compter_mot("chat", compte)
    compter_mot("chien", compte)
    assert compte == {"chat": 3, "chien": 1}, "le dictionnaire donné est mis à jour"
