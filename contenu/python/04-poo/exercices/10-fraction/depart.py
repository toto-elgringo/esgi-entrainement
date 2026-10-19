import math


class Fraction:
    def __init__(self, numerateur, denominateur=1):
        self.num = numerateur
        self.den = denominateur


if __name__ == "__main__":
    print(Fraction(1, 2) + Fraction(1, 3))
