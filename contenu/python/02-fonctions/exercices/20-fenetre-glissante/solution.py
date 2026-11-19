from collections import deque


def fenetres(iterable, n):
    if n <= 0:
        raise ValueError("n doit être strictement positif")
    return _fenetres(iterable, n)


def _fenetres(iterable, n):
    fenetre = deque(maxlen=n)
    for element in iterable:
        fenetre.append(element)
        if len(fenetre) == n:
            yield tuple(fenetre)


def moyennes_mobiles(iterable, n):
    if n <= 0:
        raise ValueError("n doit être strictement positif")
    return _moyennes_mobiles(iterable, n)


def _moyennes_mobiles(iterable, n):
    fenetre = deque()
    total = 0
    for nombre in iterable:
        fenetre.append(nombre)
        total += nombre
        if len(fenetre) > n:
            total -= fenetre.popleft()
        if len(fenetre) == n:
            yield total / n


if __name__ == "__main__":
    print(list(fenetres("abcd", 3)))
    print(list(moyennes_mobiles([1, 2, 3, 4, 5], 2)))
    try:
        fenetres([1, 2], 0)
    except ValueError as e:
        print("Erreur dès l'appel :", e)
