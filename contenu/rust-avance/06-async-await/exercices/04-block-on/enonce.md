Écris ton propre **exécuteur** : `block_on` prend un futur, l'interroge (`poll`) en boucle jusqu'à ce qu'il soit prêt, puis renvoie son résultat.

Étapes :

1. fixe le futur sur place avec `pin!(futur)` ;
2. crée un contexte avec `Context::from_waker(Waker::noop())` ;
3. dans une `loop`, appelle `poll` ; dès que la réponse est `Poll::Ready(valeur)`, renvoie `valeur`.

Les tests vérifient trois choses : un bloc `async` simple, un futur déjà prêt (`std::future::ready`), et un futur qui répond `Pending` plusieurs fois avant d'être prêt.

> [!tip] `as_mut()`
> `poll` consomme le `Pin<&mut F>` qu'on lui donne. `futur.as_mut()` en fabrique une copie à chaque tour de boucle.
