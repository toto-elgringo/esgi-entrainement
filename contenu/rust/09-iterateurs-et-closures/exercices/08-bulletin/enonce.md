À partir de la liste `notes = [12, 8, 15, 19, 7, 14]` (des notes sur 20), affiche un petit bulletin en utilisant **uniquement des itérateurs** (pas de boucle `for`) :

- la moyenne ;
- la meilleure note ;
- le nombre de notes supérieures ou égales à 10 ;
- les notes converties sur 100 (multipliées par 5).

La sortie doit être **exactement** :

```text
Notes : [12, 8, 15, 19, 7, 14]
Moyenne : 12.5
Meilleure : 19
Reçus : 4
Notes sur 100 : [60, 40, 75, 95, 35, 70]
```

> [!tip] Diviser des entiers
> `75 / 6` vaut `12` entre entiers. Pour obtenir `12.5`, convertis la somme et la taille en `f64` avec `as f64`.
