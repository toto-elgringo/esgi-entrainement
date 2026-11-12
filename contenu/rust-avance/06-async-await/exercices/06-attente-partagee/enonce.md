Un `Attente` est un futur qui attend qu'une valeur apparaisse dans une **boîte partagée** (`Rc<RefCell<Option<i32>>>`). Quelqu'un d'autre peut la remplir plus tard.

1. Implémente `Future` pour `Attente` : si la boîte contient `Some(v)`, le futur est prêt avec `v` (et la boîte est vidée) ; si elle est vide, il répond `Pending`.
2. Écris `doubler(attente)` : une `async fn` qui attend la valeur puis renvoie son double.

| Situation | Réponse de `poll` |
|---|---|
| boîte vide | `Pending` |
| boîte contenant `Some(42)` | `Ready(42)` |

> [!info] `Rc<RefCell<…>>`
> `Rc` permet d'avoir plusieurs propriétaires de la boîte (le futur et le code qui la remplit). `RefCell` permet de la modifier malgré tout. `borrow_mut()` donne l'accès en écriture.
