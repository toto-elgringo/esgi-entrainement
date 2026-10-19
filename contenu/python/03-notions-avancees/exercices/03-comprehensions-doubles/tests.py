def test_mots_majuscules():
    assert mots_majuscules("Il y a 3 chats et 12 chiens") == ["IL", "Y", "A", "CHATS", "ET", "CHIENS"], "on enlève les nombres et on met en majuscules"
    assert mots_majuscules("") == [], "ligne vide"


def test_combinaisons():
    assert combinaisons(["Ana", "Bob"], ["Diaz", "Roy"]) == ["Ana Diaz", "Ana Roy", "Bob Diaz", "Bob Roy"], "toutes les combinaisons, dans l'ordre des prénoms puis des noms"
    assert combinaisons([], ["Roy"]) == [], "pas de prénom : aucune combinaison"


def test_couples_ordonnes():
    assert couples_ordonnes([1, 2, 3]) == [(1, 2), (1, 3), (2, 3)], "les 3 couples avec i < j"
    assert couples_ordonnes([5]) == [], "un seul élément : aucun couple"


def test_table():
    assert table(3) == [[1, 2, 3], [2, 4, 6], [3, 6, 9]], "la table de 1 à 3"
    assert table(1) == [[1]], "table(1) vaut [[1]]"
    assert table(10)[6][7] == 56, "7 x 8 = 56 se trouve à table(10)[6][7]"
