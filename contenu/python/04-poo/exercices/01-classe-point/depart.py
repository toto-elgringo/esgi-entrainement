import math


class Point:
    def __init__(self, x, y):
        pass

    def distance_origine(self):
        pass

    def deplacer(self, dx, dy):
        pass

    def symetrique(self):
        pass


if __name__ == "__main__":
    p = Point(3, 4)
    print(p.distance_origine())
    p.deplacer(1, -1)
    print(p.x, p.y)
