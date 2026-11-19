def test_memoriser_resultat():
    @memoriser
    def carre(x):
        return x * x

    assert carre(4) == 16, "le résultat est celui de la fonction"
    assert carre(4) == 16, "le deuxième appel donne le même résultat"


def test_memoriser_ne_rappelle_pas():
    appels = []

    @memoriser
    def lente(a, b):
        appels.append((a, b))
        return a + b

    lente(1, 2)
    lente(1, 2)
    lente(2, 1)
    lente(1, 2)
    assert len(appels) == 2, "la fonction n'est vraiment appelée qu'une fois par jeu d'arguments"


def test_memoriser_garde_le_nom():
    @memoriser
    def cube(x):
        """Le cube."""
        return x ** 3

    assert cube.__name__ == "cube", "utilise functools.wraps pour garder le nom"
    assert cube.__doc__ == "Le cube.", "functools.wraps garde aussi la docstring"


def test_refuser_negatifs_accepte():
    @refuser_negatifs
    def surface(largeur, hauteur=1):
        return largeur * hauteur

    assert surface(3, 4) == 12, "arguments par position"
    assert surface(3, hauteur=4) == 12, "argument par mot-clé"
    assert surface(5) == 5, "valeur par défaut"


def test_refuser_negatifs_refuse():
    @refuser_negatifs
    def surface(largeur, hauteur=1):
        return largeur * hauteur

    for appel in (lambda: surface(-3, 4), lambda: surface(3, hauteur=-1)):
        try:
            appel()
        except ValueError as e:
            assert "surface" in str(e), "le message contient le nom de la fonction"
        else:
            assert False, "un argument négatif (par position ou par mot-clé) lève ValueError"


def test_refuser_negatifs_ignore_le_texte():
    @refuser_negatifs
    def repeter(texte, fois):
        return texte * fois

    assert repeter("ab", fois=2) == "abab", "un texte n'est pas comparé à 0"


def test_refuser_negatifs_garde_le_nom():
    @refuser_negatifs
    def surface(largeur, hauteur=1):
        """Surface d'un rectangle."""
        return largeur * hauteur

    assert surface.__name__ == "surface", "utilise functools.wraps pour garder le nom"
    assert surface.__doc__ == "Surface d'un rectangle.", "et la docstring"
