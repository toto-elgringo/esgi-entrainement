def _decaler(c, decalage, debut):
    return chr((ord(c) - ord(debut) + decalage) % 26 + ord(debut))


def chiffrer(texte, decalage):
    resultat = []
    for c in texte:
        if "a" <= c <= "z":
            resultat.append(_decaler(c, decalage, "a"))
        elif "A" <= c <= "Z":
            resultat.append(_decaler(c, decalage, "A"))
        else:
            resultat.append(c)
    return "".join(resultat)


def dechiffrer(texte, decalage):
    return chiffrer(texte, -decalage)


if __name__ == "__main__":
    secret = chiffrer("Hello, World!", 3)
    print(secret)
    print(dechiffrer(secret, 3))
