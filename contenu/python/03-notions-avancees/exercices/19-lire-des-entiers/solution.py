if __name__ == "__main__":
    morceaux = input().split()
    entiers = [int(m) for m in morceaux if m.lstrip("-").isdigit()]
    print("Entiers :", entiers)
    print("Positifs :", [x for x in entiers if x > 0])
    print("Valeurs absolues :", [abs(x) for x in entiers])
    print("Pairs en valeur absolue :", [abs(x) for x in entiers if x % 2 == 0])
    print("Somme :", sum(entiers))
