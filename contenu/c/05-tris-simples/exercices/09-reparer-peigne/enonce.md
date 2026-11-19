Ce tri à peigne a été écrit un peu vite. D'abord, il ne compile pas. Une fois ce problème réglé, il donne souvent un tableau **presque** trié :

```text
tableau : 8 11 4 7 6 3 5 12 1 9 10 2
attendu : 1 2 3 4 5 6 7 8 9 10 11 12
obtenu  : 1 2 3 5 4 6 7 8 9 10 11 12     le 5 et le 4 sont restés inversés
```

Corrige `tri_peigne` pour qu'il trie toujours, quelle que soit la taille du tableau (vide et une case compris).

> [!info] Rappel de la règle
> L'écart est divisé par 1,3 à chaque passage sans descendre sous 1. On ne s'arrête que quand l'écart vaut 1 **et** que le dernier passage n'a fait **aucun** échange.
