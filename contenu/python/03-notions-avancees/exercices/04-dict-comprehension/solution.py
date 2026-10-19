def longueurs(mots):
    return {m: len(m) for m in mots}


def inverser(d):
    return {v: k for k, v in d.items()}


def abordables(prix, budget):
    return {k: v for k, v in prix.items() if v <= budget}


def initiales(mots):
    return {m[0].lower() for m in mots if m}


if __name__ == "__main__":
    print(longueurs(["chat", "souris"]))
    print(abordables({"kiwi": 5, "melon": 8}, 6))
