def test_chiffrer_simple():
    assert chiffrer("abc", 3) == "def", "abc décalé de 3 donne def"
    assert chiffrer("xyz", 3) == "abc", "on repart au début de l'alphabet après z"


def test_chiffrer_casse_et_ponctuation():
    assert chiffrer("Hello, World!", 3) == "Khoor, Zruog!", "la casse est gardée, la ponctuation ne bouge pas"
    assert chiffrer("Rendez-vous à 8h", 1) == "Sfoefa-wpvt à 8i", "les chiffres et les accents ne bougent pas"


def test_decalages_speciaux():
    assert chiffrer("abc", 0) == "abc", "décalage 0 : rien ne change"
    assert chiffrer("abc", 26) == "abc", "décalage 26 : on revient au même point"
    assert chiffrer("abc", -1) == "zab", "décalage négatif"
    assert chiffrer("abc", 29) == "def", "29 revient à 3"


def test_dechiffrer():
    assert dechiffrer("Khoor, Zruog!", 3) == "Hello, World!", "déchiffrer annule le chiffrement"
    message = "Python est Genial"
    assert dechiffrer(chiffrer(message, 11), 11) == message, "chiffrer puis déchiffrer redonne le message"
