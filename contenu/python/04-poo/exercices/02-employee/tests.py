def test_attributs():
    e = Employee("Tom", 2000)
    assert e.name == "Tom", "l'attribut name doit valoir « Tom »"
    assert e.salary == 2000, "l'attribut salary doit valoir 2000"


def test_description():
    assert Employee("Tom", 2000).description() == "Name : Tom, Salary : 2000", "le texte de description"


def test_compteur():
    avant = Employee.emp_count
    Employee("A", 1)
    Employee("B", 2)
    assert Employee.emp_count == avant + 2, "créer 2 employés augmente emp_count de 2"


def test_compteur_partage():
    e = Employee("C", 3)
    assert e.emp_count == Employee.emp_count, "emp_count est une variable de classe, la même pour tous"
    assert "emp_count" not in vars(e), "ne fais pas self.emp_count += 1 : ça crée une variable d'instance"


def test_augmenter():
    e = Employee("Tom", 2000)
    e.augmenter(10)
    assert e.salary == 2200.0, "2000 augmenté de 10 % donne 2200"
    e.augmenter(0.5)
    assert e.salary == 2211.0, "2200 augmenté de 0.5 % donne 2211"
