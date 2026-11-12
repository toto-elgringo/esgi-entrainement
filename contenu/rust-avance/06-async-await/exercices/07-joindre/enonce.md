Un **join** fait avancer deux futures **ensemble** et rend leurs deux résultats quand les deux sont finis.

`Joindre` garde les deux futures (`a` et `b`) et leurs résultats déjà obtenus. À chaque `poll` :

1. si `a` n'a pas encore fini, interroge-le et garde son résultat s'il est prêt ;
2. fais pareil pour `b` ;
3. si les deux résultats sont connus, renvoie `Poll::Ready((resultat_a, resultat_b))` ; sinon `Poll::Pending`.

Le type `Minuteur` fourni répond `Pending` un certain nombre de fois. Il **panique** si on l'interroge après qu'il a fini : ton `join` ne doit donc jamais le refaire.

| Futures | Premier `poll` | Dernier `poll` |
|---|---|---|
| `Minuteur::new(0, 7)` et `Minuteur::new(2, 8)` | `Pending` | `Ready((7, 8))` au 3e |

> [!tip] Pourquoi `get_mut()` ?
> `self` est un `Pin<&mut Joindre>`. Comme `Joindre` peut être déplacé sans danger, `self.get_mut()` donne un simple `&mut Joindre`, plus facile à utiliser.
