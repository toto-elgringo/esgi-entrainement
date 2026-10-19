def moyenne(*nombres):
    if not nombres:
        return 0
    return sum(nombres) / len(nombres)


def maximum(premier, *autres):
    plus_grand = premier
    for x in autres:
        if x > plus_grand:
            plus_grand = x
    return plus_grand


def concatener(*mots, sep=" "):
    return sep.join(mots)


if __name__ == "__main__":
    print(moyenne(4, 6, 8))
    print(maximum(3, 9, 2))
    print(concatener("a", "b", sep="-"))
