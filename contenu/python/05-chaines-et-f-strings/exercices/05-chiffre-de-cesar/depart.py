def chiffrer(texte, decalage):
    pass


def dechiffrer(texte, decalage):
    pass


if __name__ == "__main__":
    secret = chiffrer("Hello, World!", 3)
    print(secret)
    print(dechiffrer(secret, 3))
