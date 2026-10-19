def convertir(secondes):
    heures = secondes // 3600
    reste = secondes % 3600
    return heures, reste // 60, reste % 60


def en_secondes(heures, minutes, secondes):
    return heures * 3600 + minutes * 60 + secondes


if __name__ == "__main__":
    print(convertir(3725))
    print(en_secondes(1, 2, 5))
