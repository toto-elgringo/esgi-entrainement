def premiers(l, n):
    return l[:n]


def derniers(l, n):
    return l[len(l) - n:]


def un_sur_deux(l):
    return l[::2]


def inverser(s):
    return s[::-1]


def est_palindrome(mot):
    mot = mot.lower()
    return mot == mot[::-1]


if __name__ == "__main__":
    print(premiers([1, 2, 3, 4], 2))
    print(derniers([1, 2, 3, 4], 3))
    print(inverser("Hello"))
