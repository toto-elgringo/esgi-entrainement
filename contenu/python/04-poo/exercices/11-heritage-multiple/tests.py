def test_deux_parents():
    assert issubclass(ITGuy, Employee) and issubclass(ITGuy, Geek), "ITGuy doit hériter de Employee et de Geek"


def test_ordre_mro():
    noms = [c.__name__ for c in ITGuy.__mro__]
    assert noms == ["ITGuy", "Employee", "Geek", "object"], "les parents doivent être dans l'ordre Employee, puis Geek"


def test_attributs():
    bob = ITGuy("Bob", 2000, "ASUS")
    assert bob.name == "Bob", "le nom est initialisé"
    assert bob.salary == 2000, "le salaire vient de l'initialiseur de Employee"
    assert bob.computer == "ASUS", "l'ordinateur vient de l'initialiseur de Geek"


def test_presentation_employee():
    assert ITGuy("Bob", 2000, "ASUS").presentation() == "Bob (employé)", "c'est la presentation de Employee qui est utilisée"
    assert "presentation" not in ITGuy.__dict__, "ne redéfinis pas presentation : l'ordre des parents suffit"


def test_methode_de_geek():
    assert ITGuy("Bob", 2000, "ASUS").jouer() == "Bob joue sur son ASUS", "jouer est héritée de Geek"


def test_fiche():
    assert ITGuy("Bob", 2000, "ASUS").fiche() == "Bob (employé), salaire 2000, ordinateur ASUS", "la fiche complète"
