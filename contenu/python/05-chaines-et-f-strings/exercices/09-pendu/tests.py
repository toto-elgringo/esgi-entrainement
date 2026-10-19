def test_afficher():
    assert afficher("python", {"p", "o"}) == "p _ _ _ o _", "les lettres non trouvées sont des _"
    assert afficher("abc", set()) == "_ _ _", "rien trouvé"
    assert afficher("elle", {"e", "l"}) == "e l l e", "toutes les lettres trouvées, même répétées"


def test_proposer_bonne_et_mauvaise():
    trouvees = set()
    ratees = set()
    assert proposer("python", trouvees, ratees, "p") == "bonne", "p est dans python"
    assert proposer("python", trouvees, ratees, "z") == "mauvaise", "z n'est pas dans python"
    assert trouvees == {"p"} and ratees == {"z"}, "chaque lettre est rangée dans le bon ensemble"


def test_proposer_majuscule():
    trouvees = set()
    assert proposer("python", trouvees, set(), "Y") == "bonne", "Y compte comme y"
    assert trouvees == {"y"}, "la lettre est rangée en minuscule"


def test_proposer_deja():
    trouvees = {"p"}
    ratees = {"z"}
    assert proposer("python", trouvees, ratees, "p") == "deja", "p a déjà été trouvée"
    assert proposer("python", trouvees, ratees, "z") == "deja", "z a déjà été ratée"


def test_proposer_invalide():
    trouvees = set()
    ratees = set()
    for proposition in ["", "ab", "3", "?"]:
        assert proposer("python", trouvees, ratees, proposition) == "invalide", repr(proposition) + " n'est pas une lettre"
    assert not trouvees and not ratees, "une proposition invalide ne change rien"


def test_gagne():
    assert gagne("elle", {"e", "l"}) is True, "toutes les lettres sont trouvées"
    assert gagne("elle", {"e"}) is False, "il manque le l"
    assert gagne("elle", {"e", "l", "z"}) is True, "des lettres en plus ne gênent pas"
