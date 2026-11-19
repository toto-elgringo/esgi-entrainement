def test_extremes():
    assert extremes([4, -2, 9, 3]) == (-2, 9), "le plus petit est -2, le plus grand 9"
    assert extremes([7]) == (7, 7), "avec un seul élément, c'est à la fois le min et le max"
    assert extremes([-5, -8, -1]) == (-8, -1), "fonctionne aussi avec des nombres négatifs"


def test_extremes_renvoie_un_tuple():
    assert isinstance(extremes([1, 2]), tuple), "return a, b renvoie un tuple"


def test_extremes_vide():
    try:
        extremes([])
    except ValueError:
        return
    assert False, "une liste vide doit lever ValueError"


def test_positions():
    assert positions(["a", "b", "a", "c", "a"], "a") == (0, 2, 4), "a est aux indices 0, 2 et 4"
    assert positions([1, 2, 3], 9) == (), "absent : tuple vide"
    assert positions([], 1) == (), "liste vide : tuple vide"


def test_stats_mots():
    nombre, plus_long, moyenne = stats_mots("le chat dort")
    assert nombre == 3, "3 mots"
    assert plus_long == "chat", "chat et dort font 4 lettres : le premier gagne"
    assert abs(moyenne - 10 / 3) < 1e-9, "(2 + 4 + 4) / 3"


def test_stats_mots_espaces():
    assert stats_mots("  un   deux  ") == (2, "deux", 3.0), "les espaces multiples ne comptent pas"


def test_stats_mots_vide():
    assert stats_mots("") == (0, "", 0.0), "phrase vide"
    assert stats_mots("   ") == (0, "", 0.0), "phrase avec seulement des espaces"
