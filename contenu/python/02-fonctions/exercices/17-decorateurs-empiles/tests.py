def _texte(t):
    return t


def test_majuscules():
    assert majuscules(_texte)("abc") == "ABC", "majuscules met le résultat en majuscules"


def test_inverser():
    assert inverser(_texte)("abc") == "cba", "inverser renvoie le texte à l'envers"


def test_encadrer():
    assert encadrer("(", ")")(_texte)("x") == "(x)", "encadrer ajoute gauche avant et droite après"
    assert encadrer("", "!")(_texte)("oui") == "oui!", "gauche peut être vide"


def test_arguments_transmis():
    def assembler(a, b, sep="-"):
        return a + sep + b

    assert majuscules(assembler)("a", "b", sep="+") == "A+B", "le wrapper transmet *args et **kwargs"


def test_noms_gardes():
    assert majuscules(_texte).__name__ == "_texte", "majuscules garde le nom (functools.wraps)"
    assert inverser(_texte).__name__ == "_texte", "inverser garde le nom (functools.wraps)"
    assert encadrer("[", "]")(_texte).__name__ == "_texte", "encadrer garde le nom (functools.wraps)"


def test_titre():
    assert titre("python") == "[NOHTYP]", "majuscules, puis inversion, puis crochets"
    assert titre.__name__ == "titre", "titre garde son nom"


def test_etiquette():
    assert etiquette("ok") == "<[ko]>", "inversion, puis [ ], puis < >"
    assert etiquette("abc") == "<[cba]>", "avec un autre texte"
