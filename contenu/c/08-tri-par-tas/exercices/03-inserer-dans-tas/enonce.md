Écris `insererTas(t, taille, valeur)` : les `*taille` premières cases de `t` forment un **tas max**, et le tableau a de la place après. La fonction ajoute `valeur` au tas, augmente `*taille` de 1, et le tableau doit rester un tas max.

```text
tas : 54 28 12 5 3          insererTas(t, &taille, 30)

54 28 12 5 3 30             30 à la première case libre (indice 5)
54 28 30 5 3 12             son parent 12 est plus petit : échange
                            son parent 54 est plus grand : fini, taille = 6
```

La fonction `echanger(t, i, j)` est fournie. Chaque insertion doit coûter O(log n) : les tests insèrent 200 000 valeurs une par une.
