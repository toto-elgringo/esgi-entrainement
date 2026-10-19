import math


class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def distance_origine(self):
        return math.sqrt(self.x ** 2 + self.y ** 2)

    def deplacer(self, dx, dy):
        self.x += dx
        self.y += dy

    def symetrique(self):
        return Point(-self.x, -self.y)


if __name__ == "__main__":
    p = Point(3, 4)
    print(p.distance_origine())
    p.deplacer(1, -1)
    print(p.x, p.y)
