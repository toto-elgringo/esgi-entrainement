Implémente `Future` à la main pour la structure `PretApres`.

Un `PretApres::new(n)` répond `Poll::Pending` **n fois**, puis `Poll::Ready("prêt")`.

| Création | Réponses successives de `poll` |
|---|---|
| `PretApres::new(2)` | `Pending`, `Pending`, `Ready("prêt")` |
| `PretApres::new(0)` | `Ready("prêt")` |

À chaque `Pending`, appelle `cx.waker().wake_by_ref()` : c'est l'habitude à prendre, pour dire « rappelle-moi, je peux encore avancer ».

> [!info] `Pin` et `self.restant`
> `PretApres` ne contient qu'un nombre : il peut être déplacé sans danger. On peut donc écrire `self.restant -= 1` malgré le `Pin<&mut Self>`.
