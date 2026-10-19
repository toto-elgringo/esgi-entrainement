import math


class Fraction:
    def __init__(self, numerateur, denominateur=1):
        if denominateur == 0:
            raise ZeroDivisionError("dénominateur nul")
        if denominateur < 0:
            numerateur = -numerateur
            denominateur = -denominateur
        diviseur = math.gcd(numerateur, denominateur)
        self.num = numerateur // diviseur
        self.den = denominateur // diviseur

    def __str__(self):
        if self.den == 1:
            return str(self.num)
        return str(self.num) + "/" + str(self.den)

    def __repr__(self):
        return "Fraction(" + str(self.num) + ", " + str(self.den) + ")"

    def __add__(self, autre):
        return Fraction(self.num * autre.den + autre.num * self.den, self.den * autre.den)

    def __mul__(self, autre):
        return Fraction(self.num * autre.num, self.den * autre.den)

    def __eq__(self, autre):
        return self.num == autre.num and self.den == autre.den

    def __lt__(self, autre):
        return self.num * autre.den < autre.num * self.den


if __name__ == "__main__":
    print(Fraction(1, 2) + Fraction(1, 3))
