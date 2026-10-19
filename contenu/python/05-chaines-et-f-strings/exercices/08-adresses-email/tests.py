def test_adresses_valides():
    for adresse in ["ada@exemple.fr", "a.b-c@ecole.esgi.fr", "x@y.z"]:
        assert est_valide(adresse) is True, adresse + " est valide"


def test_adresses_invalides():
    cas = {
        "ada exemple@mail.fr": "contient un espace",
        "ada.exemple.fr": "pas de @",
        "a@b@c.fr": "deux @",
        "@exemple.fr": "rien avant le @",
        "ada@exemple": "pas de point dans le domaine",
        "ada@.exemple.fr": "le domaine commence par un point",
        "ada@exemple.fr.": "le domaine finit par un point",
    }
    for adresse, raison in cas.items():
        assert est_valide(adresse) is False, adresse + " est invalide : " + raison


def test_domaine():
    assert domaine("Ada@Exemple.FR") == "exemple.fr", "le domaine en minuscules"


def test_masquer():
    assert masquer("ada.lovelace@exemple.fr") == "a***@exemple.fr", "première lettre puis ***"
    assert masquer("z@y.fr") == "z***@y.fr", "un nom d'une seule lettre"
