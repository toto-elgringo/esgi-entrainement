if __name__ == "__main__":
    n = int(input())
    nombres = []
    for _ in range(n):
        nombres.append(int(input()))
    total = sum(nombres)
    print("Somme :", total)
    print("Moyenne : %.2f" % (total / n))
    print("Maximum :", max(nombres))
