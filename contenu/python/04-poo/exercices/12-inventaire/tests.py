def _leve(exception, action):
    try:
        action()
    except exception:
        return True
    return False


def _inventaire():
    inv = Inventaire()
    inv.ajouter(Produit("pomme", 0.5, 10))
    inv.ajouter(Produit("pain", 1.2, 2))
    return inv


def test_produit():
    p = Produit("pomme", 0.5, 10)
    assert p.valeur() == 5.0, "10 pommes à 0.50 valent 5"


def test_produit_validation():
    assert _leve(ValueError, lambda: Produit("x", -1, 1)), "un prix négatif à la création lève ValueError"
    assert _leve(ValueError, lambda: Produit("x", 1, -1)), "une quantité négative à la création lève ValueError"
    p = Produit("x", 1, 1)

    def modifier():
        p.quantite = -3

    assert _leve(ValueError, modifier), "modifier la quantité en négatif lève ValueError"
    assert p.quantite == 1, "la quantité n'a pas changé"


def test_ajouter_et_len():
    inv = _inventaire()
    assert len(inv) == 2, "2 produits différents"
    assert "pomme" in inv and "kiwi" not in inv, "in teste la présence d'un produit par son nom"


def test_ajouter_meme_nom():
    inv = _inventaire()
    inv.ajouter(Produit("pomme", 0.5, 5))
    assert len(inv) == 2, "ajouter un produit déjà présent ne crée pas de doublon"
    assert abs(inv.valeur_totale() - 9.9) < 1e-9, "15 pommes à 0.50 + 2 pains à 1.20 = 9.90"


def test_retirer():
    inv = _inventaire()
    inv.retirer("pain", 2)
    assert inv.en_rupture() == ["pain"], "le pain est en rupture"
    assert len(inv) == 2, "un produit à 0 reste dans l'inventaire"
    assert abs(inv.valeur_totale() - 5.0) < 1e-9, "il ne reste que les pommes"


def test_retirer_erreurs():
    inv = _inventaire()
    assert _leve(KeyError, lambda: inv.retirer("kiwi", 1)), "retirer un produit absent lève KeyError"
    assert _leve(ValueError, lambda: inv.retirer("pain", 5)), "retirer plus que le stock lève ValueError"
    assert abs(inv.valeur_totale() - 7.4) < 1e-9, "après les erreurs, le stock n'a pas changé"


def test_en_rupture_trie():
    inv = Inventaire()
    for nom in ["zeste", "ail", "miel"]:
        inv.ajouter(Produit(nom, 1, 0))
    inv.ajouter(Produit("sel", 1, 3))
    assert inv.en_rupture() == ["ail", "miel", "zeste"], "les noms en rupture, triés"


def test_inventaires_independants():
    a = Inventaire()
    b = Inventaire()
    a.ajouter(Produit("x", 1, 1))
    assert len(b) == 0, "chaque inventaire a ses propres produits"
