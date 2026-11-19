Cette file dans un tableau circulaire (`tab`, `start`, `size`, `capacity`) a été écrite trop vite. Elle a trois fonctions, et **chacune** contient un bug :

- `enfiler(q, valeur)` : ajoute `valeur` à la fin ;
- `defiler(q)` : retire la tête et la renvoie ;
- `valeurA(q, i)` : renvoie la i-ème valeur depuis la tête, sans rien retirer (`valeurA(q, 0)` est la tête).

Voici ce qui **doit** se passer avec une capacité de 4 :

| Opération | `tab` | `start` | `size` | Résultat |
|---|---|---|---|---|
| enfiler 10, 20, 30 | `[10][20][30][ ]` | 0 | 3 | |
| défiler | `[10][20][30][ ]` | 1 | 2 | 10 |
| enfiler 40, 50 | `[50][20][30][40]` | 1 | 4 | |
| `valeurA(q, 3)` | | | | 50 |
| défiler 4 fois | | 1 | 0 | 20, 30, 40, 50 |

Corrige les trois fonctions.

Le `main` range la file dans les 4 premières cases d'un tableau de 8 : les cases 4 à 7 servent de **témoins**. Si le programme y écrit, c'est qu'il est sorti de la file.

> [!info] Pourquoi ces bugs passent inaperçus
> Tant que la file n'a pas fait le tour du tableau, `start + size` reste plus petit que `capacity` et le modulo ne change rien. Le bug n'apparaît qu'après assez d'enfilements et de défilements : pense toujours à tester une file qui a tourné.
