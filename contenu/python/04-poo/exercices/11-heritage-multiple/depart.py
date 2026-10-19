class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def presentation(self):
        return self.name + " (employé)"


class Geek:
    def __init__(self, name, computer):
        self.name = name
        self.computer = computer

    def presentation(self):
        return self.name + " (geek)"

    def jouer(self):
        return self.name + " joue sur son " + self.computer


class ITGuy:
    pass


if __name__ == "__main__":
    bob = ITGuy("Bob", 2000, "ASUS")
    print(bob.presentation())
