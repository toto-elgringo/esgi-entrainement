def test_compter():
    assert compter("Banane", "AN") == 2, "« an » apparaît 2 fois dans Banane"
    assert compter("Python", "z") == 0, "absent : 0"


def test_censurer_voyelles():
    assert censurer_voyelles("bonjour") == "b*nj**r", "les voyelles sont remplacées par *"
    assert censurer_voyelles("python", "_") == "p_th_n", "avec un autre caractère, y compris le y"
    assert censurer_voyelles("rythme") == "r*thm*", "y est une voyelle"


def test_est_entier_vrai():
    assert est_entier("42") is True, "42 est un entier"
    assert est_entier("-12") is True, "-12 est un entier négatif"
    assert est_entier("0") is True, "0 est un entier"


def test_est_entier_faux():
    for texte in ["4.2", "12a", "-", "", "--3", " 5"]:
        assert est_entier(texte) is False, repr(texte) + " n'est pas un entier"
