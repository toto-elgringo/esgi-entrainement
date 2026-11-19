def tourner(iterable):
    elements = list(iterable)
    if not elements:
        return
    while True:
        for element in elements:
            yield element


def tours(iterable, n):
    elements = list(iterable)
    for _ in range(n):
        for element in elements:
            yield element


def alterner(*iterables):
    iterateurs = [iter(iterable) for iterable in iterables]
    while iterateurs:
        restants = []
        for iterateur in iterateurs:
            try:
                valeur = next(iterateur)
            except StopIteration:
                continue
            yield valeur
            restants.append(iterateur)
        iterateurs = restants


if __name__ == "__main__":
    from itertools import islice

    print(list(islice(tourner("ab"), 5)))
    print(list(tours([1, 2], 3)))
    print(list(alterner("abc", [1], "xy")))
