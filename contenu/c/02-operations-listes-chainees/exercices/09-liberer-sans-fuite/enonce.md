Ce programme donne les bonnes valeurs... mais il **fuit** : des maillons réservés avec `malloc` ne sont jamais rendus avec `free`.

- `retirerPremier(start)` doit retirer le premier maillon, **le libérer**, et renvoyer le nouveau début (`NULL` pour une liste vide).
- `libererListe(start)` doit libérer **tous** les maillons de la liste.

Corrige les deux fonctions pour que chaque `malloc` ait son `free`.

> [!info] Comment la plateforme le voit
> Pendant les tests, chaque `malloc` et chaque `free` (dans ton code comme dans les tests) est compté. À la fin, la vérification « toute la mémoire allouée a été libérée » échoue s'il reste des blocs réservés.

> [!warning] Sauvegarder avant `free`
> Après `free(start)`, lire `start->next` est interdit : range le suivant dans une variable **avant** le `free`.
