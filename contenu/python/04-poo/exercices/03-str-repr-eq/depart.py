class Livre:
    def __init__(self, titre, auteur, annee):
        self.titre = titre
        self.auteur = auteur
        self.annee = annee


if __name__ == "__main__":
    livre = Livre("1984", "George Orwell", 1949)
    print(livre)
    print([livre])
