class Compte:
    def __init__(self, titulaire, solde=0):
        self.titulaire = titulaire
        self.__solde = solde

    def get_solde(self):
        return self.__solde

    def deposer(self, montant):
        if montant <= 0:
            raise ValueError("montant invalide")
        self.__solde += montant

    def retirer(self, montant):
        if montant <= 0:
            raise ValueError("montant invalide")
        if montant > self.__solde:
            raise ValueError("solde insuffisant")
        self.__solde -= montant


if __name__ == "__main__":
    c = Compte("Ada", 100)
    c.deposer(50)
    c.retirer(30)
    print(c.get_solde())
