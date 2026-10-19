def _carnet():
    return {"Tom": [12, 15], "Ana": [18, 16, 17], "Bob": []}


def test_moyenne():
    assert moyenne([12, 15]) == 13.5, "la moyenne de 12 et 15 vaut 13.5"
    assert moyenne([]) == 0.0, "une liste vide a une moyenne de 0.0"


def test_moyennes():
    assert moyennes(_carnet()) == {"Tom": 13.5, "Ana": 17.0, "Bob": 0.0}, "une moyenne par élève"
    assert moyennes({"Léa": [10, 11, 11]}) == {"Léa": 10.67}, "la moyenne est arrondie à 2 décimales"


def test_meilleur_eleve():
    assert meilleur_eleve(_carnet()) == "Ana", "Ana a la meilleure moyenne (17)"
    assert meilleur_eleve({}) is None, "carnet vide : None"


def test_meilleur_eleve_egalite():
    assert meilleur_eleve({"Zoé": [15], "Max": [15], "Eva": [9]}) == "Max", "égalité entre Zoé et Max : Max vient en premier dans l'alphabet"


def test_admis():
    assert admis(_carnet()) == ["Ana", "Tom"], "Ana et Tom ont au moins 10, triés par ordre alphabétique"
    assert admis(_carnet(), 15) == ["Ana"], "avec un seuil de 15, seule Ana est admise"
    assert admis(_carnet(), 0) == ["Ana", "Bob", "Tom"], "avec un seuil de 0, tout le monde est admis"


def test_ajouter_note():
    carnet = _carnet()
    assert ajouter_note(carnet, "Tom", 9) is True, "une note valide renvoie True"
    assert carnet["Tom"] == [12, 15, 9], "la note est ajoutée à la fin de la liste de Tom"
    assert ajouter_note(carnet, "Lou", 14) is True, "on peut ajouter un nouvel élève"
    assert carnet["Lou"] == [14], "Lou a été créé avec sa note"


def test_ajouter_note_invalide():
    carnet = _carnet()
    assert ajouter_note(carnet, "Tom", 25) is False, "25 n'est pas une note valide"
    assert ajouter_note(carnet, "Max", -1) is False, "-1 n'est pas une note valide"
    assert carnet == _carnet(), "une note invalide ne change rien au carnet"
