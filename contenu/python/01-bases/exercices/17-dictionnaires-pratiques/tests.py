def test_traduire():
    assert traduire("le chat noir", {"chat": "cat", "noir": "black"}) == "le cat black", "le n'a pas de traduction : il reste"
    assert traduire("oui oui", {"oui": "yes"}) == "yes yes", "un mot répété est traduit à chaque fois"
    assert traduire("rien", {}) == "rien", "lexique vide : la phrase ne change pas"


def test_traduire_ne_retraduit_pas():
    assert traduire("a b", {"a": "b", "b": "c"}) == "b c", "chaque mot est traduit une seule fois, à partir du mot d'origine"


def test_relier():
    classe_de = {"Ana": "B1", "Tom": "B2", "Eva": "B3"}
    salle_de = {"B1": "A101", "B2": "A204"}
    assert relier(classe_de, salle_de) == {"Ana": "A101", "Tom": "A204"}, "Eva est en B3, qui n'a pas de salle"
    assert relier({}, salle_de) == {}, "aucun élève"


def test_regrouper_par_longueur():
    assert regrouper_par_longueur(["bus", "car", "vélo", "bus"]) == {3: ["bus", "car"], 4: ["vélo"]}, "bus n'apparaît qu'une fois, listes triées"
    assert regrouper_par_longueur(["zut", "ah", "oui", "eh"]) == {3: ["oui", "zut"], 2: ["ah", "eh"]}, "chaque liste est triée"
    assert regrouper_par_longueur([]) == {}, "liste vide : dictionnaire vide"


def test_retirer_cles():
    d = {"a": 1, "b": 2, "c": 3}
    assert retirer_cles(d, ["a", "z", "c"]) == 2, "a et c étaient présentes, z non"
    assert d == {"b": 2}, "le dictionnaire reçu a perdu a et c"
    assert retirer_cles(d, []) == 0, "aucune clé à retirer"
