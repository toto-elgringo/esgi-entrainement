C'est l'exemple du cours : **Advent of Code 2022, jour 1**.

Des lutins notent les calories de leurs aliments, une valeur par ligne. Une **ligne vide** sépare deux lutins :

```text
1000
2000
3000

4000

5000
6000

7000
8000
9000

10000
```

| Lutin | Total |
|---|---|
| 1 | 6000 |
| 2 | 4000 |
| 3 | 11000 |
| 4 | 24000 |
| 5 | 10000 |

Écris `calories_max(entree)` qui renvoie le **plus gros total** porté par un seul lutin (ici `24000`). Un texte vide donne `0`.

Les données d'exemple sont dans la constante `EXEMPLE` (dans le vrai projet du cours, elles sont lues avec `include_str!`).

> [!warning] Le piège du dernier lutin
> Le dernier lutin n'est pas suivi d'une ligne vide. Les tests vérifient un cas où c'est **lui** le plus chargé.

> [!tip] Façon du cours
> Tu peux écrire une petite fonction `mettre_a_jour_meilleur(meilleur: &mut u32, total: u32)` qui modifie le record avec `*meilleur = total`.
