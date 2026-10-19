class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius


if __name__ == "__main__":
    t = Temperature(20)
    print(t.fahrenheit)
