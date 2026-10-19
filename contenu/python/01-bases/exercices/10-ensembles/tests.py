def test_sans_doublons():
    assert sans_doublons([3, 1, 3, 2, 1]) == [1, 2, 3], "[3, 1, 3, 2, 1] sans doublons et trié donne [1, 2, 3]"
    assert sans_doublons([]) == [], "liste vide"
    assert sans_doublons(["b", "a", "b"]) == ["a", "b"], "ça marche avec des chaînes"


def test_communs():
    assert communs([1, 2, 3], [2, 3, 4]) == [2, 3], "2 et 3 sont dans les deux listes"
    assert communs([1, 1, 5], [5, 5]) == [5], "pas de doublon dans le résultat"
    assert communs([1], [2]) == [], "rien en commun : liste vide"


def test_est_binaire():
    assert est_binaire("1001") is True, "1001 ne contient que des 0 et des 1"
    assert est_binaire("1021") is False, "1021 contient un 2"
    assert est_binaire("") is False, "un texte vide n'est pas un nombre binaire"


def test_sans_ponctuation():
    assert sans_ponctuation("Salut") is True, "Salut n'a pas de ponctuation"
    assert sans_ponctuation("Quoi ?") is False, "Quoi ? contient un point d'interrogation"
    assert sans_ponctuation("a, b") is False, "a, b contient une virgule"


def test_lettres_exclusives():
    assert lettres_exclusives("chat", "chien") == {"a", "t", "i", "e", "n"}, "c et h sont communs, les autres lettres sont exclusives"
    assert lettres_exclusives("abc", "abc") == set(), "mêmes lettres : ensemble vide"
