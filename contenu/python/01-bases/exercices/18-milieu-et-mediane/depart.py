def valeur_du_milieu(l):
    return l[round(len(l) / 2)]


def mediane(l):
    l.sort()
    return l[len(l) // 2]


def etendue(l):
    pass


def moyenne_sans_extremes(l):
    pass


if __name__ == "__main__":
    notes = [7, 1, 9, 4]
    print(valeur_du_milieu(notes))
    print(mediane(notes))
    print(notes)
