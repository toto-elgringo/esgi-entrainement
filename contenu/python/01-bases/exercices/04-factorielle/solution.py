def facto(x):
    if x < 2:
        return 1
    return x * facto(x - 1)


if __name__ == "__main__":
    print(facto(5))
