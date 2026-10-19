import math


class Forme:
    def aire(self):
        raise NotImplementedError("chaque forme doit définir aire()")

    def description(self):
        return "%s d'aire %.2f" % (type(self).__name__, self.aire())


class Rectangle(Forme):
    def __init__(self, largeur, hauteur):
        self.largeur = largeur
        self.hauteur = hauteur

    def aire(self):
        return self.largeur * self.hauteur


class Carre(Rectangle):
    def __init__(self, cote):
        super().__init__(cote, cote)


class Cercle(Forme):
    def __init__(self, rayon):
        self.rayon = rayon

    def aire(self):
        return math.pi * self.rayon ** 2


def aire_totale(formes):
    return sum(f.aire() for f in formes)


if __name__ == "__main__":
    formes = [Rectangle(2, 3), Carre(2), Cercle(1)]
    for f in formes:
        print(f.description())
