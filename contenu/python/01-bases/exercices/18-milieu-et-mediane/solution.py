def valeur_du_milieu(l):
    return l[len(l) // 2]


def mediane(l):
    triee = sorted(l)
    milieu = len(triee) // 2
    if len(triee) % 2 == 1:
        return triee[milieu]
    return (triee[milieu - 1] + triee[milieu]) / 2


def etendue(l):
    return max(l) - min(l)


def moyenne_sans_extremes(l):
    return (sum(l) - min(l) - max(l)) / (len(l) - 2)


if __name__ == "__main__":
    notes = [7, 1, 9, 4]
    print(valeur_du_milieu(notes))
    print(mediane(notes))
    print(notes)
