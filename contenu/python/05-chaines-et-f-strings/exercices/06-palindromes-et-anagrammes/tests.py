def test_palindromes():
    assert est_palindrome("kayak") is True, "kayak est un palindrome"
    assert est_palindrome("Engage le jeu que je le gagne") is True, "les espaces et majuscules sont ignorés"
    assert est_palindrome("Esope reste ici et se repose.") is True, "la ponctuation est ignorée"


def test_pas_palindromes():
    assert est_palindrome("python") is False, "python n'est pas un palindrome"
    assert est_palindrome("ab") is False, "ab n'est pas un palindrome"


def test_palindrome_vide():
    assert est_palindrome("") is True, "une chaîne vide est un palindrome"
    assert est_palindrome("!!") is True, "sans lettre : palindrome"


def test_anagrammes():
    assert sont_anagrammes("Chien", "niche") is True, "chien et niche sont des anagrammes"
    assert sont_anagrammes("Le Vent", "Lévent") is False, "é n'est pas e"
    assert sont_anagrammes("Marie", "aimer !") is True, "la casse et la ponctuation sont ignorées"


def test_pas_anagrammes():
    assert sont_anagrammes("aab", "abb") is False, "il faut les mêmes lettres en même nombre"
    assert sont_anagrammes("abc", "abcd") is False, "des longueurs différentes"
