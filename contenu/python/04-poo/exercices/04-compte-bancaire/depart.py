class Compte:
    def __init__(self, titulaire, solde=0):
        self.titulaire = titulaire
        self.solde = solde

    def get_solde(self):
        pass

    def deposer(self, montant):
        pass

    def retirer(self, montant):
        pass


if __name__ == "__main__":
    c = Compte("Ada", 100)
    c.deposer(50)
    c.retirer(30)
    print(c.get_solde())
