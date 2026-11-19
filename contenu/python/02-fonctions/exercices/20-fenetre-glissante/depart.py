from collections import deque


def fenetres(iterable, n):
    if n <= 0:
        raise ValueError("n doit être strictement positif")
    fenetre = []
    for element in iterable:
        fenetre.append(element)
        if len(fenetre) > n:
            fenetre.pop(0)
        if len(fenetre) == n:
            yield tuple(fenetre)


def moyennes_mobiles(iterable, n):
    pass


if __name__ == "__main__":
    print(list(fenetres("abcd", 3)))
    gen = fenetres([1, 2], 0)
    print("Aucune erreur à l'appel !")
    print(list(gen))
