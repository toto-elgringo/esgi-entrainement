Une note ne peut pas dépasser 20. Écris deux versions d'une même opération :

- `ajouter_bonus(notes, bonus)` : **modifie la liste reçue** en ajoutant le bonus à chaque note (sans dépasser 20). Elle ne renvoie rien (donc `None`) ;
- `avec_bonus(notes, bonus)` : **renvoie une nouvelle liste** avec le bonus appliqué, et laisse la liste d'origine **intacte**.

```python
notes = [12, 19]
ajouter_bonus(notes, 2)
print(notes)              # [14, 20]

autres = [8, 15]
print(avec_bonus(autres, 3))  # [11, 18]
print(autres)                 # [8, 15]
```
