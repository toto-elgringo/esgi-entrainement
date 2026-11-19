def nouveautes(iterable):
    vus = set()
    for element in iterable:
        if element not in vus:
            vus.add(element)
            yield element


def doublons(iterable):
    compteurs = {}
    for element in iterable:
        compteurs[element] = compteurs.get(element, 0) + 1
        if compteurs[element] == 2:
            yield element


def cumuls(iterable):
    total = 0
    for nombre in iterable:
        total += nombre
        yield total


def series(iterable):
    iterateur = iter(iterable)
    try:
        courant = next(iterateur)
    except StopIteration:
        return
    longueur = 1
    for element in iterateur:
        if element == courant:
            longueur += 1
        else:
            yield courant, longueur
            courant, longueur = element, 1
    yield courant, longueur


if __name__ == "__main__":
    print(list(nouveautes("abracadabra")))
    print(list(doublons("abracadabra")))
    print(list(cumuls([1, 2, 3, 4])))
    print(list(series("aaabcc")))
