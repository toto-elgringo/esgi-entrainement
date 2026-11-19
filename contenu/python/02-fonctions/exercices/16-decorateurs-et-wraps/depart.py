import functools


def memoriser(func):
    pass


def refuser_negatifs(func):
    def wrapper():
        return func()
    return wrapper


if __name__ == "__main__":
    @refuser_negatifs
    def surface(largeur, hauteur=1):
        """Surface d'un rectangle."""
        return largeur * hauteur

    print(surface(3, hauteur=4))
    print(surface.__name__)
