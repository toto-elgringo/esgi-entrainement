Cette recherche dichotomique utilise des indices `size_t` et une zone **semi-ouverte** `[debut, fin[` : `debut` est la première case possible, `fin` la première case **exclue**. Au départ, `debut = 0` et `fin = n`. La zone est vide quand `debut == fin`.

Elle renvoie la position de `valeur` dans le tableau trié (valeurs toutes différentes), ou `-1`. La fonction `milieu(debut, fin)` calcule la case du milieu de la zone.

Le code contient **trois** erreurs classiques :

- une qui donne un faux milieu quand les bornes sont très grandes ;
- une qui fait rater des valeurs présentes (et peut faire lire très loin hors du tableau) ;
- une qui fait tourner la boucle **à l'infini** sur certaines valeurs absentes.

Corrige-les sans changer la forme de la zone (garde `fin = n` et `while (debut < fin)`).

```text
milieu(SIZE_MAX - 10, SIZE_MAX - 2) doit valoir SIZE_MAX - 6
dichotomie({1, 3, 5}, 3, 1)         doit valoir 0
dichotomie({1, 3}, 2, 4)            doit valoir -1 (et s'arrêter)
```

> [!tip] Dérouler à la main
> Note `debut`, `fin` et `m` à chaque tour sur les petits exemples ci-dessus. Une boucle infinie se repère quand une ligne est identique à la précédente.
