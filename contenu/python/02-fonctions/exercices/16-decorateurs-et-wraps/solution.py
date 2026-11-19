import functools


def memoriser(func):
    cache = {}

    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper


def refuser_negatifs(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        for valeur in list(args) + list(kwargs.values()):
            if isinstance(valeur, (int, float)) and valeur < 0:
                raise ValueError(func.__name__ + " : argument négatif")
        return func(*args, **kwargs)
    return wrapper


if __name__ == "__main__":
    @refuser_negatifs
    def surface(largeur, hauteur=1):
        """Surface d'un rectangle."""
        return largeur * hauteur

    print(surface(3, hauteur=4))
    print(surface.__name__)
