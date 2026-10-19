ARTICLES = [("pomme", 3, 0.5), ("pain", 1, 1.2), ("chocolat", 12, 2.5)]

if __name__ == "__main__":
    for nom, quantite, prix_unitaire in ARTICLES:
        print(nom, quantite, quantite * prix_unitaire)
