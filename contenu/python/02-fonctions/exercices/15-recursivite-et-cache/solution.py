from functools import lru_cache


@lru_cache(maxsize=None)
def fibo(n):
    if n < 0:
        raise ValueError("n doit être positif")
    if n < 2:
        return n
    return fibo(n - 1) + fibo(n - 2)


@lru_cache(maxsize=None)
def nb_chemins(lignes, colonnes):
    if lignes == 1 or colonnes == 1:
        return 1
    return nb_chemins(lignes - 1, colonnes) + nb_chemins(lignes, colonnes - 1)


if __name__ == "__main__":
    print(fibo(32))
    print(nb_chemins(3, 3))
