def fiche(nom, **infos):
    if not infos:
        return nom
    morceaux = []
    for cle, valeur in infos.items():
        morceaux.append(cle + "=" + str(valeur))
    return nom + " (" + ", ".join(morceaux) + ")"


def compter_arguments(*args, **kwargs):
    return len(args), len(kwargs)


def appeler(func, *args, **kwargs):
    return func(*args, **kwargs)


if __name__ == "__main__":
    print(fiche("Tom", age=20, ville="Paris"))
    print(compter_arguments(1, 2, a=3))
    print(appeler(pow, 2, 10))
