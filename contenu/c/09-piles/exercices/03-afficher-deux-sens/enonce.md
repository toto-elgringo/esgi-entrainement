Écris deux fonctions d'affichage pour la pile dans un tableau (`tab`, `size`, `capacity`) :

- `afficherDepuisFond(s)` affiche les valeurs du **fond** jusqu'au **sommet** ;
- `afficherDepuisDessus(s)` affiche les valeurs du **sommet** jusqu'au **fond**.

Chaque fonction affiche toutes les valeurs **sur une seule ligne**, séparées par un espace, **puis passe à la ligne**. Une pile vide affiche `(vide)`.

Le `main` affiche la pile `3 8 1` (fond à gauche, rangée dans un tableau de 5 cases), puis une pile vide, puis une pile qui ne contient que 3. Le programme doit afficher exactement :

```text
3 8 1
1 8 3
(vide)
(vide)
3
```

> [!warning] Les cases libres
> Le tableau a 5 cases, mais seules les `size` premières font partie de la pile. Les deux dernières contiennent des 0 qui ne doivent **pas** s'afficher.
