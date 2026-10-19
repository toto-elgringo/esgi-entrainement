if __name__ == "__main__":
    n = int(input())
    mots = []
    for _ in range(n):
        mots += input().split()
    distincts = set(mots)
    print("Lignes :", n)
    print("Mots :", len(mots))
    print("Plus long :", max(mots, key=len))
    print("Mots distincts :", len(distincts))
    print("Ordre alphabétique :", ", ".join(sorted(distincts)))
