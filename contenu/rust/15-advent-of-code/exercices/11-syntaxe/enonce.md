> [!info] Advent of Code 2021, jour 10
> Énigme originale : [adventofcode.com/2021/day/10](https://adventofcode.com/2021/day/10). L'histoire et l'exemple sont réécrits ici avec nos propres données.

L'ordinateur de bord du sous-marin refuse de démarrer : son programme de navigation est plein d'erreurs. Chaque ligne n'est faite que de **parenthèses** de quatre sortes : `()`, `[]`, `{}` et `<>`. Chaque ouvrant doit être refermé par le fermant de la même sorte, et on referme toujours **le dernier ouvert en premier** : `([]<>)` est correct, `(]` ne l'est pas.

```text
[({<>})]{<
<[(])>
{[(<>)]}(([<
((<{}>)}
<{[]}<()>
[<>({}[]>
(<[{}]>[(
{(<>[)]}
{<{}>[[]]((
[{<>}{(}]
```

## Partie 1

Une ligne est **corrompue** si on y trouve un fermant qui ne correspond pas au dernier ouvrant encore ouvert. Seul le **premier** fermant incorrect compte. Il donne des points :

| Fermant incorrect | `)` | `]` | `}` | `>` |
|---|---|---|---|---|
| Points | 3 | 57 | 1197 | 25137 |

Fais la **somme** des points des lignes corrompues.

| Ligne | On attendait | On trouve | Points |
|---|---|---|---|
| `<[(])>` | `)` | `]` | 57 |
| `((<{}>)}` | `)` | `}` | 1197 |
| `[<>({}[]>` | `)` | `>` | 25137 |
| `{(<>[)]}` | `]` | `)` | 3 |
| `[{<>}{(}]` | `)` | `}` | 1197 |

Les 5 autres lignes ne sont pas corrompues. Réponse de l'exemple : **27591**.

## Partie 2

Oublie les lignes corrompues. Les autres lignes sont **incomplètes** : il manque des fermants à la fin. Trouve la suite de fermants qui manque pour tout refermer, dans le bon ordre. Son score part de 0 et, pour chaque fermant de la suite, devient **score × 5 + valeur** du fermant :

| Fermant | `)` | `]` | `}` | `>` |
|---|---|---|---|---|
| Valeur | 1 | 2 | 3 | 4 |

| Ligne | Suite qui manque | Calcul | Score |
|---|---|---|---|
| `[({<>})]{<` | `>}` | 4, puis 4 × 5 + 3 | 23 |
| `{[(<>)]}(([<` | `>]))` | 4, 22, 111, puis 111 × 5 + 1 | 556 |
| `<{[]}<()>` | `>` | 4 | 4 |
| `(<[{}]>[(` | `)])` | 1, 7, puis 7 × 5 + 1 | 36 |
| `{<{}>[[]]((` | `))}` | 1, 6, puis 6 × 5 + 3 | 33 |

Il y a toujours un nombre impair de lignes incomplètes. Trie les scores (4, 23, 33, 36, 556) : la réponse est celui **du milieu**. Réponse de l'exemple : **33**.

Écris `partie1(entree)` et `partie2(entree)`.

> [!tip] Ta vraie énigme
> Sur la page de l'énigme, ouvre « get your puzzle input » et copie tout le texte. Colle-le dans **Entrée du programme** (sous l'éditeur), puis clique sur **Exécuter** : le programme affiche tes deux réponses, à valider sur le site. Sans entrée, il utilise `EXEMPLE`.
