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


if __name__ == "__main__":
    emp1 = Employee("Tom", 2000)
    emp2 = Employee("Bob", 5000)
    print(emp1.description())
