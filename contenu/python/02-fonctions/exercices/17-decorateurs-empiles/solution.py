import functools


def majuscules(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper


def inverser(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)[::-1]
    return wrapper


def encadrer(gauche, droite):
    def decor(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return gauche + func(*args, **kwargs) + droite
        return wrapper
    return decor


@encadrer("[", "]")
@inverser
@majuscules
def titre(mot):
    return mot


@encadrer("<", ">")
@encadrer("[", "]")
@inverser
def etiquette(texte):
    return texte


if __name__ == "__main__":
    print(titre("python"))
    print(etiquette("ok"))
