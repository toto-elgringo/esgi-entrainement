Un `Sujet` prévient plusieurs **observateurs** quand un événement arrive. Les observateurs sont partagés : on garde un `Rc` de chacun côté `main`, et le sujet en garde un autre.

Le trait `Observateur` a une méthode `notifier(&self, evenement: &str)`. Elle prend `&self` : les observateurs doivent donc modifier leur état avec de la mutabilité intérieure.

1. `Historique` garde tous les événements reçus dans un `RefCell<Vec<String>>` : écris son `notifier`.
2. `Sujet::abonner` ajoute un observateur.
3. `Sujet::emettre` prévient **tous** les observateurs, dans l'ordre.

| Action | Résultat |
|---|---|
| Un historique abonné, `emettre("a")`, `emettre("b")` | l'historique contient `["a", "b"]` |
| Deux observateurs abonnés, `emettre("x")` | les deux reçoivent `"x"` |

> [!info] `Rc<dyn Observateur>`
> Un `Rc<Historique>` se convertit automatiquement en `Rc<dyn Observateur>` quand on le passe à `abonner`.
