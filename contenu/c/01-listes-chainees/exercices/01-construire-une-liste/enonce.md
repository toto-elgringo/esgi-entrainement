Le programme affiche une liste chaînée puis rend sa mémoire, mais la liste est vide : il affiche seulement `NULL`.

Complète le début du `main` pour construire, **avec `creerCell` et les champs `next`**, la liste `10 -> 20 -> 30`. Le programme doit alors afficher exactement :

```text
10 -> 20 -> 30 -> NULL
```

Ne modifie pas la boucle d'affichage ni la boucle de libération.

> [!tip] Rappel
> `creerCell(v)` réserve un maillon de valeur `v` dont le `next` vaut déjà `NULL`. Il reste à relier les maillons entre eux.
