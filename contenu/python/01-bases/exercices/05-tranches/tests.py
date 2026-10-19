def test_premiers():
    assert premiers([1, 2, 3, 4], 2) == [1, 2], "les 2 premiers de [1, 2, 3, 4] sont [1, 2]"
    assert premiers([1, 2], 5) == [1, 2], "si n dépasse la taille, on renvoie toute la liste"
    assert premiers([1, 2, 3], 0) == [], "les 0 premiers éléments : liste vide"


def test_derniers():
    assert derniers([1, 2, 3, 4], 3) == [2, 3, 4], "les 3 derniers de [1, 2, 3, 4] sont [2, 3, 4]"
    assert derniers([1, 2, 3, 4], 1) == [4], "le dernier de [1, 2, 3, 4] est [4]"
    assert derniers([1, 2, 3], 0) == [], "les 0 derniers éléments : liste vide (attention à l[-0:])"


def test_un_sur_deux():
    assert un_sur_deux([1, 2, 3, 4, 5]) == [1, 3, 5], "indices 0, 2, 4"
    assert un_sur_deux("abcdef") == "ace", "ça marche aussi sur une chaîne"
    assert un_sur_deux([]) == [], "liste vide"


def test_inverser():
    assert inverser("Hello") == "olleH", "Hello à l'envers donne olleH"
    assert inverser("") == "", "une chaîne vide reste vide"


def test_palindrome():
    assert est_palindrome("kayak") is True, "kayak est un palindrome"
    assert est_palindrome("Kayak") is True, "les majuscules ne comptent pas"
    assert est_palindrome("python") is False, "python n'est pas un palindrome"
