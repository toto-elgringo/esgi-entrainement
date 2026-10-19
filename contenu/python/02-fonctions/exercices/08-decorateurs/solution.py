def en_majuscules(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper


def compter_appels(func):
    def wrapper(*args, **kwargs):
        wrapper.appels += 1
        return func(*args, **kwargs)
    wrapper.appels = 0
    return wrapper


if __name__ == "__main__":
    @en_majuscules
    def saluer(nom):
        return "bonjour " + nom

    print(saluer("ada"))
