def copier_en_majuscules(source, cible):
    pass


if __name__ == "__main__":
    with open("lettre.txt", "w", encoding="utf-8") as f:
        f.write("Bonjour,\nl'été arrive !\n")
    print(copier_en_majuscules("lettre.txt", "lettre-majuscules.txt"))
    with open("lettre-majuscules.txt", encoding="utf-8") as f:
        print(f.read())
