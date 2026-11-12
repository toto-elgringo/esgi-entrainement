Une connexion ne peut envoyer un message que lorsqu'elle est **ouverte**. Au lieu de tester un booléen `ouverte` à chaque appel, on met l'état dans le **type** : `Connexion<Fermee>` et `Connexion<Ouverte>`. Envoyer sur une connexion fermée ne compile tout simplement pas.

Les types `Fermee`, `Ouverte` et la structure `Connexion<Etat>` (avec `PhantomData`) sont déjà là. Complète :

1. Sur `Connexion<Fermee>` :
   - `nouvelle(adresse)` crée une connexion fermée, sans message envoyé.
   - `ouvrir(self)` consomme la connexion et rend une `Connexion<Ouverte>` (mêmes adresse et messages).
2. Sur `Connexion<Ouverte>` :
   - `envoyer(&mut self, message)` garde le message et renvoie le **nombre total** de messages envoyés (le premier renvoie `1`).
   - `fermer(self)` rend une `Connexion<Fermee>` (les messages envoyés restent comptés).
3. Sur `Connexion<Etat>` (tous les états) :
   - `adresse()` renvoie l'adresse.
   - `nombre_envoyes()` renvoie le nombre de messages envoyés jusqu'ici.

```rust
let mut connexion = Connexion::nouvelle("serveur:80").ouvrir();
connexion.envoyer("salut");
let connexion = connexion.fermer();
```

> [!info] `PhantomData`
> `PhantomData<Etat>` est un champ « fantôme » : il ne prend aucune place mais permet d'utiliser le paramètre `Etat`. Pour en créer un, on écrit simplement `PhantomData`.
