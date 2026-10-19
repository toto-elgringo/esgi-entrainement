ARTICLES = [("pomme", 3, 0.5), ("pain", 1, 1.2), ("chocolat", 12, 2.5)]

if __name__ == "__main__":
    print(f"{'Article':<10}{'Qté':>5}{'Prix':>8}")
    total = 0
    for nom, quantite, prix_unitaire in ARTICLES:
        prix = quantite * prix_unitaire
        total += prix
        print(f"{nom:<10}{quantite:>5}{prix:>8.2f}")
    print(f"{'Total':<10}{'':>5}{total:>8.2f}")
