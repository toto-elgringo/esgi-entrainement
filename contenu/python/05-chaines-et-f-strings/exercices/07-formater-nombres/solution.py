def prix(montant):
    texte = f"{montant:,.2f}"
    return texte.replace(",", " ").replace(".", ",") + " €"


def pourcentage(x):
    return f"{x:.1%}"


def numero(n):
    return f"{n:03d}"


def heure(h, m):
    return f"{h:02d}h{m:02d}"


if __name__ == "__main__":
    print(prix(1234.5))
    print(pourcentage(0.125))
    print(numero(7))
    print(heure(8, 5))
