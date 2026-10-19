def _leve_value_error(action):
    try:
        action()
    except ValueError:
        return True
    return False


def test_celsius():
    t = Temperature(20)
    assert t.celsius == 20, "la température vaut 20 °C"
    t.celsius = 30
    assert t.celsius == 30, "on peut modifier celsius"


def test_est_une_propriete():
    assert isinstance(Temperature.__dict__.get("celsius"), property), "celsius doit être une propriété (property)"
    assert isinstance(Temperature.__dict__.get("fahrenheit"), property), "fahrenheit doit être une propriété (property)"


def test_fahrenheit_lecture():
    assert Temperature(20).fahrenheit == 68.0, "20 °C font 68 °F"
    assert Temperature(-40).fahrenheit == -40.0, "-40 °C font -40 °F"


def test_fahrenheit_ecriture():
    t = Temperature(0)
    t.fahrenheit = 212
    assert t.celsius == 100.0, "212 °F font 100 °C"


def test_zero_absolu():
    t = Temperature(10)

    def trop_froid():
        t.celsius = -300

    assert _leve_value_error(trop_froid), "-300 °C doit lever une ValueError"
    assert t.celsius == 10, "après le refus, la température n'a pas changé"
    assert _leve_value_error(lambda: Temperature(-274)), "la vérification doit aussi marcher à la création"
    assert Temperature(-273.15).celsius == -273.15, "le zéro absolu lui-même est accepté"
