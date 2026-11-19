def arrondir_tous(*nombres, decimales=0):
    return [round(x, decimales) for x in nombres]


def compter(texte, motif, *, ignorer_casse=False):
    if ignorer_casse:
        texte = texte.lower()
        motif = motif.lower()
    return texte.count(motif)


def masquer(texte, visibles=4, *, caractere="*"):
    if len(texte) <= visibles:
        return texte
    if visibles == 0:
        return caractere * len(texte)
    return caractere * (len(texte) - visibles) + texte[-visibles:]


if __name__ == "__main__":
    print(arrondir_tous(1.26, 2.5, decimales=1))
    print(compter("Aa a", "a", ignorer_casse=True))
    print(masquer("1234567812345678"))
