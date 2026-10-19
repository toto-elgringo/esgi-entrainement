def test_signe():
    assert signe(0) == "nul", "0 est nul"
    assert signe(5) == "positif", "5 est positif"
    assert signe(-3) == "négatif", "-3 est négatif (avec l'accent)"
    assert signe(0.5) == "positif", "0.5 est positif"


def test_categorie_limites_basses():
    assert categorie(0) == "enfant", "un bébé est un enfant"
    assert categorie(11) == "enfant", "à 11 ans on est un enfant"
    assert categorie(12) == "ado", "à 12 ans on est un ado"
    assert categorie(17) == "ado", "à 17 ans on est encore un ado"


def test_categorie_limites_hautes():
    assert categorie(18) == "adulte", "à 18 ans on est adulte"
    assert categorie(64) == "adulte", "à 64 ans on est encore adulte"
    assert categorie(65) == "senior", "à 65 ans on est senior"
    assert categorie(99) == "senior", "à 99 ans on est senior"
