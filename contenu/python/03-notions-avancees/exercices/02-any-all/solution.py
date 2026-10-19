def tous_positifs(l):
    return all(x > 0 for x in l)


def au_moins_un_pair(l):
    return any(x % 2 == 0 for x in l)


def mot_de_passe_valide(mdp):
    return (
        len(mdp) >= 8
        and any(c.isdigit() for c in mdp)
        and any(c.isupper() for c in mdp)
        and any(c.islower() for c in mdp)
    )


if __name__ == "__main__":
    print(tous_positifs([1, 2, 3]))
    print(mot_de_passe_valide("Python2026"))
