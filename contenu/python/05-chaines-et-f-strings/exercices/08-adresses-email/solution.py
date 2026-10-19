def est_valide(adresse):
    if " " in adresse or adresse.count("@") != 1:
        return False
    nom, dom = adresse.split("@")
    if not nom:
        return False
    return "." in dom and not dom.startswith(".") and not dom.endswith(".")


def domaine(adresse):
    return adresse.split("@")[1].lower()


def masquer(adresse):
    nom, dom = adresse.split("@")
    return nom[0] + "***@" + dom


if __name__ == "__main__":
    print(est_valide("ada@exemple.fr"))
    print(domaine("Ada@Exemple.FR"))
    print(masquer("ada.lovelace@exemple.fr"))
