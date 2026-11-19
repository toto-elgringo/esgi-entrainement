def encadrer(l, debut, fin):
    l.insert(0, debut)
    l.append(fin)


def ajouter_plusieurs(l, valeurs):
    l.extend(valeurs)


def retirer_toutes(l, x):
    nombre = 0
    while x in l:
        l.remove(x)
        nombre += 1
    return nombre


def garder_indices_pairs(l):
    del l[1::2]


def position(l, x, debut=0):
    try:
        return l.index(x, debut)
    except ValueError:
        return -1


if __name__ == "__main__":
    l = [1, 2, 3]
    encadrer(l, 0, 9)
    print(l)
    print(position([4, 7, 4], 4, 1))
