class Employee:
    emp_count = 0

    def __init__(self, name, salary):
        self.name = name
        self.salary = salary
        Employee.emp_count += 1

    def description(self):
        return "Name : " + self.name + ", Salary : " + str(self.salary)

    def augmenter(self, pourcentage):
        self.salary = round(self.salary * (1 + pourcentage / 100), 2)


class ITGuy:
    pass


if __name__ == "__main__":
    bob = ITGuy("Bob", 2000, "ASUS")
    print(bob.description())
