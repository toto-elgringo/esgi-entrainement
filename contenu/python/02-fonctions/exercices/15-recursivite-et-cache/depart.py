def fibo(n):
    if n < 2:
        return n
    return fibo(n - 1) + fibo(n - 2)


def nb_chemins(lignes, colonnes):
    pass


if __name__ == "__main__":
    print(fibo(32))
    print(nb_chemins(3, 3))
