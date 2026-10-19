import math


class Forme:
    def aire(self):
        raise NotImplementedError("chaque forme doit définir aire()")

    def description(self):
        pass


class Rectangle(Forme):
    pass


class Carre(Rectangle):
    pass


class Cercle(Forme):
    pass


def aire_totale(formes):
    pass


if __name__ == "__main__":
    formes = [Rectangle(2, 3), Carre(2), Cercle(1)]
    for f in formes:
        print(f.description())
