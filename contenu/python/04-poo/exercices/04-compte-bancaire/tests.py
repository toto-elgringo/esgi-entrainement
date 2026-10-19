def _message_erreur(action, *args):
    try:
        action(*args)
    except ValueError as erreur:
        return str(erreur)
    return None


def test_solde_initial():
    assert Compte("Ada").get_solde() == 0, "solde par défaut : 0"
    assert Compte("Ada", 100).get_solde() == 100, "solde initial donné : 100"


def test_solde_prive():
    c = Compte("Ada", 100)
    assert c.titulaire == "Ada", "le titulaire est un attribut public"
    assert not hasattr(c, "solde"), "il ne doit pas y avoir d'attribut public solde"
    assert hasattr(c, "_Compte__solde"), "le solde doit être rangé dans l'attribut privé __solde"


def test_deposer_retirer():
    c = Compte("Ada", 100)
    c.deposer(50)
    c.retirer(30)
    assert c.get_solde() == 120, "100 + 50 - 30 = 120"


def test_montant_invalide():
    c = Compte("Ada", 100)
    assert _message_erreur(c.deposer, 0) == "montant invalide", "déposer 0 lève ValueError(« montant invalide »)"
    assert _message_erreur(c.deposer, -5) == "montant invalide", "déposer -5 lève ValueError(« montant invalide »)"
    assert _message_erreur(c.retirer, -5) == "montant invalide", "retirer -5 lève ValueError(« montant invalide »)"
    assert c.get_solde() == 100, "après des erreurs, le solde ne change pas"


def test_solde_insuffisant():
    c = Compte("Ada", 100)
    assert _message_erreur(c.retirer, 150) == "solde insuffisant", "retirer plus que le solde lève ValueError(« solde insuffisant »)"
    assert c.get_solde() == 100, "le solde ne change pas"
    c.retirer(100)
    assert c.get_solde() == 0, "on peut retirer exactement tout le solde"
