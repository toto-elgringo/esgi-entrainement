def valeur_mot(mot):
    return sum(ord(c) - ord("a") + 1 for c in mot.lower() if "a" <= c <= "z")


def somme_ponderee(valeurs):
    return sum(i * v for i, v in enumerate(valeurs, start=1))


def moyenne_ponderee(notes, coefs):
    total_coefs = sum(coefs)
    if total_coefs == 0:
        return None
    return sum(n * c for n, c in zip(notes, coefs)) / total_coefs


def cle_isbn(code):
    reste = sum(i * int(c) for i, c in enumerate(code, start=1)) % 11
    return "X" if reste == 10 else str(reste)


if __name__ == "__main__":
    print(valeur_mot("Abc"))
    print(somme_ponderee([5, 1, 2]))
    print(cle_isbn("207036002"))
