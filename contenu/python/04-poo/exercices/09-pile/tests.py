def _message_index_error(action):
    try:
        action()
    except IndexError as erreur:
        return str(erreur)
    return None


def test_empiler_depiler():
    p = Pile()
    p.empiler(1)
    p.empiler(2)
    p.empiler(3)
    assert p.depiler() == 3, "le dernier empilé sort en premier"
    assert p.depiler() == 2, "puis l'avant-dernier"


def test_sommet():
    p = Pile()
    p.empiler("a")
    p.empiler("b")
    assert p.sommet() == "b", "le sommet est le dernier élément empilé"
    assert p.sommet() == "b", "sommet ne retire pas l'élément"


def test_len_et_verite():
    p = Pile()
    assert len(p) == 0, "une nouvelle pile est vide"
    assert not p, "une pile vide est fausse dans un if (grâce à __len__)"
    p.empiler(5)
    assert len(p) == 1 and p, "après un empiler, la pile a 1 élément et elle est vraie"


def test_pile_vide():
    p = Pile()
    assert _message_index_error(p.depiler) == "pile vide", "depiler une pile vide lève IndexError(« pile vide »)"
    assert _message_index_error(p.sommet) == "pile vide", "sommet d'une pile vide lève IndexError(« pile vide »)"


def test_repr():
    p = Pile()
    for x in [1, 2, 3]:
        p.empiler(x)
    assert repr(p) == "Pile([1, 2, 3])", "repr montre les éléments du bas vers le sommet"


def test_piles_independantes():
    a = Pile()
    b = Pile()
    a.empiler(1)
    assert len(b) == 0, "chaque pile a sa propre liste (crée-la dans __init__, pas dans le corps de la classe)"
