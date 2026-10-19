def en_majuscules(func):
    pass


def compter_appels(func):
    pass


if __name__ == "__main__":
    @en_majuscules
    def saluer(nom):
        return "bonjour " + nom

    print(saluer("ada"))
