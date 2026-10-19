def test_heritage():
    assert issubclass(ITGuy, Employee), "ITGuy doit hériter de Employee : class ITGuy(Employee)"
    assert isinstance(ITGuy("Bob", 2000, "ASUS"), Employee), "un ITGuy est aussi un Employee"


def test_attributs():
    bob = ITGuy("Bob", 2000, "ASUS")
    assert (bob.name, bob.salary, bob.computer) == ("Bob", 2000, "ASUS"), "les trois attributs doivent être initialisés"


def test_compteur_parent():
    avant = Employee.emp_count
    ITGuy("Bob", 2000, "ASUS")
    assert Employee.emp_count == avant + 1, "créer un ITGuy appelle l'initialiseur de Employee, qui augmente emp_count"


def test_description_redefinie():
    bob = ITGuy("Bob", 2000, "ASUS")
    assert bob.description() == "Name : Bob, Salary : 2000, Computer : ASUS", "la description complète d'un ITGuy"
    assert Employee("Tom", 1500).description() == "Name : Tom, Salary : 1500", "la description d'un Employee ne change pas"


def test_methode_heritee():
    bob = ITGuy("Bob", 2000, "ASUS")
    bob.augmenter(10)
    assert bob.salary == 2200.0, "augmenter est héritée de Employee"
    assert "augmenter" not in ITGuy.__dict__, "ne recopie pas augmenter dans ITGuy : elle est héritée"
