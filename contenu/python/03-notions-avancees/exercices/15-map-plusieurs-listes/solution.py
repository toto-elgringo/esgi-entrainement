def lire_entiers(texte, sep=";"):
    return tuple(map(int, (m for m in texte.split(sep) if m.strip())))


def parite(nombres):
    return tuple(map(lambda n: "pair" if n % 2 == 0 else "impair", nombres))


def maximums(a, b):
    return list(map(max, a, b))


def appliquer_remises(prix, remises):
    return list(map(lambda p, r: round(p * (100 - r) / 100, 2), prix, remises))


def noms_complets(prenoms, noms):
    return list(map(lambda p, n: p.capitalize() + " " + n.upper(), prenoms, noms))


if __name__ == "__main__":
    print(lire_entiers("4; 8;;15"))
    print(maximums([1, 9, 3], [4, 2, 3]))
