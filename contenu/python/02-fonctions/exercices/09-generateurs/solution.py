def pows(n, p):
    for i in range(1, n + 1):
        yield i ** p


def compte_a_rebours(n):
    while n > 0:
        yield n
        n -= 1


def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b


if __name__ == "__main__":
    for x in pows(3, 2):
        print(x)
