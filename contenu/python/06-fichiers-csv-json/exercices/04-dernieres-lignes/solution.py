from collections import deque
from itertools import islice


def premieres_lignes(chemin, n):
    if n <= 0:
        return []
    with open(chemin, encoding="utf-8") as f:
        return [ligne.rstrip("\n") for ligne in islice(f, n)]


def dernieres_lignes(chemin, n):
    if n <= 0:
        return []
    with open(chemin, encoding="utf-8") as f:
        return [ligne.rstrip("\n") for ligne in deque(f, maxlen=n)]


if __name__ == "__main__":
    with open("journal.txt", "w", encoding="utf-8") as f:
        f.write("Bonjour\nLa prog, c'est sympa !\nMais alors là, vraiment sympa :)\n")
    print(dernieres_lignes("journal.txt", 2))
    print(premieres_lignes("journal.txt", 1))
