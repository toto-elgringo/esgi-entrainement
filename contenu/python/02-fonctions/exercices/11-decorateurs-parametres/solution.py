def repeter(n):
    def decor(func):
        def wrapper(*args, **kwargs):
            resultats = []
            for _ in range(n):
                resultats.append(func(*args, **kwargs))
            return resultats
        return wrapper
    return decor


def limiter(maximum):
    def decor(func):
        appels = 0

        def wrapper(*args, **kwargs):
            nonlocal appels
            if appels >= maximum:
                raise RuntimeError("trop d'appels")
            appels += 1
            return func(*args, **kwargs)
        return wrapper
    return decor


if __name__ == "__main__":
    @repeter(3)
    def bonjour(nom):
        return "Bonjour " + nom

    print(bonjour("Ada"))
