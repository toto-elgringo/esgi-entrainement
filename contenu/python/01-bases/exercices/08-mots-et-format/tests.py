def test_compter_mots():
    assert compter_mots("Il fait beau") == 3, "« Il fait beau » contient 3 mots"
    assert compter_mots("  plusieurs    espaces  ") == 2, "les espaces multiples ne comptent pas comme des mots"
    assert compter_mots("") == 0, "une phrase vide contient 0 mot"


def test_initiales():
    assert initiales("ada lovelace") == "A.L.", "ada lovelace donne A.L."
    assert initiales("Jean Claude Van Damme") == "J.C.V.D.", "4 mots donnent 4 initiales"
    assert initiales("guido") == "G.", "un seul mot donne une seule initiale"


def test_ticket():
    assert ticket(2, "pomme", 0.7) == "2 x pomme : 1.40 e", "2 pommes à 0.70 font 1.40 e"
    assert ticket(1, "pain", 1.2) == "1 x pain : 1.20 e", "toujours 2 décimales"
    assert ticket(3, "café", 2) == "3 x café : 6.00 e", "un prix entier s'affiche aussi avec 2 décimales"
