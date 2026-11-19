JOURNEE = 24 * 3600


def en_secondes(heures, minutes, secondes):
    return heures * 3600 + minutes * 60 + secondes


def en_horaire(secondes):
    heures, reste = divmod(secondes, 3600)
    minutes, secondes = divmod(reste, 60)
    return heures, minutes, secondes


def ecart(debut, fin):
    return en_horaire(abs(en_secondes(*fin) - en_secondes(*debut)))


def ajouter(horaire, secondes):
    return en_horaire((en_secondes(*horaire) + secondes) % JOURNEE)


def duree_totale(horaires):
    return en_horaire(sum(en_secondes(*h) for h in horaires))


if __name__ == "__main__":
    print(en_secondes(1, 10, 3))
    print(en_horaire(4203))
    print(ecart((14, 30, 0), (20, 15, 0)))
    print(ajouter((23, 30, 0), 3600))
    print(duree_totale([(1, 50, 0), (0, 20, 30)]))
