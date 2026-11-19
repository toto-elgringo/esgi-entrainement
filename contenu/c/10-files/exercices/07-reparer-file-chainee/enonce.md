Voici une file en liste chaînée avec pointeur de fin (`premier`, `dernier`, `taille`), comme au chapitre précédent. `estVideFile` et `enfilerListe` sont justes. Le code a pourtant **deux bugs**, dans `defilerListe` et `viderFile` :

- l'un laisse un pointeur vers de la mémoire **déjà rendue** avec `free` ;
- l'autre **oublie** de rendre de la mémoire.

Aucun des deux ne fait planter le `main` : le programme affiche des valeurs justes. C'est ce qui les rend dangereux.

```text
enfiler 1, défiler      attendu : premier = NULL, dernier = NULL
                        code fourni : premier = NULL, dernier = ??? (le maillon libéré)

enfiler 2               le code fourni écrit dans le maillon libéré,
                        et premier reste NULL : la valeur 2 est perdue
```

Corrige les deux fonctions. Les tests vérifient l'état de la file après chaque opération, puis qu'aucun maillon n'est oublié en mémoire.

> [!warning] Le pointeur de fin qui reste en l'air
> C'est le piège classique de la file chaînée : défiler le **seul** maillon vide la file, donc `dernier` doit lui aussi redevenir `NULL`.
