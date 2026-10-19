def ajouter_bonus(notes, bonus):
    for i in range(len(notes)):
        notes[i] = min(notes[i] + bonus, 20)


def avec_bonus(notes, bonus):
    resultat = []
    for note in notes:
        resultat.append(min(note + bonus, 20))
    return resultat


if __name__ == "__main__":
    notes = [12, 19]
    ajouter_bonus(notes, 2)
    print(notes)
    autres = [8, 15]
    print(avec_bonus(autres, 3))
    print(autres)
