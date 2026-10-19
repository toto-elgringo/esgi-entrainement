class Livre:
    def __init__(self, titre, auteur, annee):
        self.titre = titre
        self.auteur = auteur
        self.annee = annee

    def __str__(self):
        return self.titre + ", " + self.auteur + " (" + str(self.annee) + ")"

    def __repr__(self):
        return "Livre(%r, %r, %d)" % (self.titre, self.auteur, self.annee)

    def __eq__(self, autre):
        return self.titre == autre.titre and self.auteur == autre.auteur and self.annee == autre.annee


if __name__ == "__main__":
    livre = Livre("1984", "George Orwell", 1949)
    print(livre)
    print([livre])
