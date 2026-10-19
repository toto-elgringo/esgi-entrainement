def test_str():
    livre = Livre("1984", "George Orwell", 1949)
    assert str(livre) == "1984, George Orwell (1949)", "le texte de __str__"


def test_repr():
    livre = Livre("1984", "George Orwell", 1949)
    assert repr(livre) == "Livre('1984', 'George Orwell', 1949)", "le texte de __repr__, avec des apostrophes autour des textes"
    assert str([livre]) == "[Livre('1984', 'George Orwell', 1949)]", "une liste affiche ses éléments avec __repr__"


def test_egalite():
    a = Livre("Dune", "Frank Herbert", 1965)
    b = Livre("Dune", "Frank Herbert", 1965)
    assert a == b, "deux livres identiques sont égaux, même si ce sont deux objets différents"
    assert not (a == Livre("Dune", "Frank Herbert", 1984)), "une année différente : pas égaux"
    assert a != Livre("Dune 2", "Frank Herbert", 1965), "un titre différent : pas égaux"
