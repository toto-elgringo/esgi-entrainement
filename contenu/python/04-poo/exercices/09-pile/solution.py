class Pile:
    def __init__(self):
        self._elements = []

    def empiler(self, x):
        self._elements.append(x)

    def depiler(self):
        if not self._elements:
            raise IndexError("pile vide")
        return self._elements.pop()

    def sommet(self):
        if not self._elements:
            raise IndexError("pile vide")
        return self._elements[-1]

    def __len__(self):
        return len(self._elements)

    def __repr__(self):
        return "Pile(" + str(self._elements) + ")"


if __name__ == "__main__":
    p = Pile()
    p.empiler(1)
    p.empiler(2)
    print(p, len(p))
