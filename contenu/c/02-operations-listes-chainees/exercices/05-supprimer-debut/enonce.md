Écris la fonction `supprimerDebut(start)` qui retire le **premier maillon** de la liste et **rend sa mémoire** avec `free`.

```c
supprimerDebut(&liste);
```

- Si `liste` vaut `1 -> 2 -> 3`, elle devient `2 -> 3`.
- Si la liste est vide, la fonction ne fait rien.

> [!warning] Deux pièges
> - Après `free(ancien)`, on n'a plus le droit de lire `ancien->next` : récupère le suivant **avant**.
> - Avancer le début sans `free` retire le maillon de la liste, mais le laisse réservé en mémoire : fuite mémoire. Les tests la détectent.
