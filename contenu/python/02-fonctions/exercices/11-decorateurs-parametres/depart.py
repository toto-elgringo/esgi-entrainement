def repeter(n):
    pass


def limiter(maximum):
    pass


if __name__ == "__main__":
    @repeter(3)
    def bonjour(nom):
        return "Bonjour " + nom

    print(bonjour("Ada"))
