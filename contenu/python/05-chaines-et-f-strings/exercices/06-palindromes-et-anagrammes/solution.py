def _nettoyer(texte):
    return "".join(c.lower() for c in texte if c.isalnum())


def est_palindrome(phrase):
    propre = _nettoyer(phrase)
    return propre == propre[::-1]


def sont_anagrammes(a, b):
    return sorted(_nettoyer(a)) == sorted(_nettoyer(b))


if __name__ == "__main__":
    print(est_palindrome("Engage le jeu que je le gagne"))
    print(sont_anagrammes("Chien", "niche"))
