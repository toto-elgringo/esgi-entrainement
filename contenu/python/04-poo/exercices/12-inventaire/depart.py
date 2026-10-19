class Produit:
    def __init__(self, nom, prix, quantite):
        self.nom = nom
        self.prix = prix
        self.quantite = quantite

    def valeur(self):
        pass


class Inventaire:
    def __init__(self):
        pass

    def ajouter(self, produit):
        pass

    def retirer(self, nom, quantite):
        pass

    def valeur_totale(self):
        pass

    def en_rupture(self):
        pass


if __name__ == "__main__":
    inv = Inventaire()
    inv.ajouter(Produit("pomme", 0.5, 10))
    print(inv.valeur_totale())
