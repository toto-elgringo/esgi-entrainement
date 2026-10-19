import math


class Vecteur:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, autre):
        return Vecteur(self.x + autre.x, self.y + autre.y)

    def __sub__(self, autre):
        return Vecteur(self.x - autre.x, self.y - autre.y)

    def __mul__(self, nombre):
        return Vecteur(self.x * nombre, self.y * nombre)

    def __eq__(self, autre):
        return self.x == autre.x and self.y == autre.y

    def __repr__(self):
        return "Vecteur(" + str(self.x) + ", " + str(self.y) + ")"

    def norme(self):
        return math.sqrt(self.x ** 2 + self.y ** 2)


if __name__ == "__main__":
    print(Vecteur(1, 2) + Vecteur(3, 4))
