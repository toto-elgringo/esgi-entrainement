La **descente** est la brique de base du retrait de la racine, de la construction d'un tas et du tri par tas.

Écris `descendre(t, taille, i)` :

- seules les `taille` premières cases de `t` font partie du tas (les cases suivantes ne doivent **jamais** être lues ni modifiées) ;
- les deux sous-arbres de la case `i` sont déjà des tas max, mais `t[i]` est peut-être trop petit ;
- tant que la case a un enfant plus grand qu'elle, on l'échange avec le **plus grand** de ses enfants, puis on continue depuis cet enfant.

```text
descendre(t, 7, 0) avec  3 9 8 5 7 1 2

3 9 8 5 7 1 2      enfants de la case 0 : 9 et 8, le plus grand 9 > 3, échange
9 3 8 5 7 1 2      enfants de la case 1 : 5 et 7, le plus grand 7 > 3, échange
9 7 8 5 3 1 2      la case 4 n'a pas d'enfant (9 et 10 >= 7) : fini
```

La fonction `echanger(t, i, j)` est fournie. Une descente doit coûter O(log n).

> [!warning] Les deux tests d'enfant
> L'enfant gauche `2 * i + 1` n'existe que s'il est `< taille`, le droit `2 * i + 2` aussi. Un enfant hors du tas peut contenir n'importe quoi (par exemple un ancien maximum déjà rangé).
