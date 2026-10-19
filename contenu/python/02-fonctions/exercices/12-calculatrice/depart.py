def additionner(a, b):
    return a + b


def soustraire(a, b):
    return a - b


def multiplier(a, b):
    return a * b


def diviser(a, b):
    return a / b


OPERATIONS = {"+": additionner, "-": soustraire, "*": multiplier, "/": diviser}


def calculer(ligne):
    pass


if __name__ == "__main__":
    while True:
        ligne = input()
        if ligne == "fin":
            break
        print(calculer(ligne))
