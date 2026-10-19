def test_fiche_sans_info():
    assert fiche("Tom") == "Tom", "sans information, juste le nom"


def test_fiche_avec_infos():
    assert fiche("Tom", age=20, ville="Paris") == "Tom (age=20, ville=Paris)", "les informations dans l'ordre donné"
    assert fiche("Ada", metier="pionnière") == "Ada (metier=pionnière)", "une seule information"


def test_compter_arguments():
    assert compter_arguments(1, 2, a=3) == (2, 1), "2 par position, 1 par mot-clé"
    assert compter_arguments() == (0, 0), "aucun argument"
    assert compter_arguments(x=1, y=2, z=3) == (0, 3), "3 par mot-clé"


def test_appeler():
    assert appeler(pow, 2, 10) == 1024, "appeler(pow, 2, 10) vaut pow(2, 10)"
    assert appeler(sorted, [3, 1, 2], reverse=True) == [3, 2, 1], "les mots-clés sont aussi transmis"
    assert appeler(fiche, "Léa", age=19) == "Léa (age=19)", "appeler peut appeler n'importe quelle fonction"
