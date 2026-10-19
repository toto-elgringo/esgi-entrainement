class Produit:
    def __init__(self, nom, prix, quantite):
        self.nom = nom
        self.prix = prix
        self.quantite = quantite

    @property
    def prix(self):
        return self._prix

    @prix.setter
    def prix(self, valeur):
        if valeur < 0:
            raise ValueError("prix négatif")
        self._prix = valeur

    @property
    def quantite(self):
        return self._quantite

    @quantite.setter
    def quantite(self, valeur):
        if valeur < 0:
            raise ValueError("quantité négative")
        self._quantite = valeur

    def valeur(self):
        return self.prix * self.quantite


class Inventaire:
    def __init__(self):
        self._produits = {}

    def ajouter(self, produit):
        if produit.nom in self._produits:
            self._produits[produit.nom].quantite += produit.quantite
        else:
            self._produits[produit.nom] = produit

    def retirer(self, nom, quantite):
        if nom not in self._produits:
            raise KeyError(nom)
        produit = self._produits[nom]
        if quantite > produit.quantite:
            raise ValueError("stock insuffisant")
        produit.quantite -= quantite

    def valeur_totale(self):
        return sum(p.valeur() for p in self._produits.values())

    def en_rupture(self):
        return sorted(nom for nom, p in self._produits.items() if p.quantite == 0)

    def __len__(self):
        return len(self._produits)

    def __contains__(self, nom):
        return nom in self._produits


if __name__ == "__main__":
    inv = Inventaire()
    inv.ajouter(Produit("pomme", 0.5, 10))
    print(inv.valeur_totale())
