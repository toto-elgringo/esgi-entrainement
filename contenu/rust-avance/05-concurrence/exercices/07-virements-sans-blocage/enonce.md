Une banque garde ses comptes dans un tableau de `Mutex<i64>`. Un virement doit verrouiller **deux** comptes. Si un thread fait `0 -> 1` pendant qu'un autre fait `1 -> 0`, et que chacun prend d'abord son compte de départ, chacun attend le compte de l'autre pour toujours : c'est un **interblocage**.

La règle pour l'éviter : toujours verrouiller les comptes **dans l'ordre croissant des numéros**, quel que soit le sens du virement.

1. Écris `ordre_verrous(de, vers)` : elle renvoie les deux numéros, le plus petit en premier.
2. Écris `transferer(comptes, de, vers, montant)` : elle verrouille les comptes dans cet ordre, retire `montant` à `de` et l'ajoute à `vers`.

On suppose que `de` et `vers` sont **différents** (verrouiller deux fois le même `Mutex` bloquerait le thread).

| Appel | Résultat |
|---|---|
| `ordre_verrous(3, 1)` | `(1, 3)` |
| `ordre_verrous(0, 2)` | `(0, 2)` |

> [!warning] Deux gardes en même temps
> Les deux verrous doivent être tenus ensemble pendant la modification. Ils sont relâchés à la fin de la fonction, quand les gardes sont détruits.
