def create_adder(n):
    def adder(x):
        return x + n
    return adder


def create_multiplier(n):
    def multiplier(x):
        return x * n
    return multiplier


def composer(f, g):
    def composee(x):
        return f(g(x))
    return composee


def compteur():
    total = 0

    def suivant():
        nonlocal total
        total += 1
        return total
    return suivant


if __name__ == "__main__":
    plus10 = create_adder(10)
    print(plus10(24))
