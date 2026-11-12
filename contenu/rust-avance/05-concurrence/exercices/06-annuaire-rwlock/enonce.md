Un `Annuaire` garde une liste de noms dans un `RwLock<Vec<String>>`, pour que plusieurs threads puissent le consulter (en même temps) ou le modifier (un seul à la fois).

Complète les méthodes :

1. `ajouter(&self, nom)` : ajoute le nom à la fin (verrou en **écriture**) ;
2. `nombre(&self)` : renvoie le nombre de noms (verrou en **lecture**) ;
3. `contient(&self, nom)` : renvoie `true` si le nom est dans l'annuaire (verrou en **lecture**).

Attention : toutes les méthodes prennent `&self`, pas `&mut self`.

> [!info] `read` et `write`
> `read()` : plusieurs lecteurs en même temps. `write()` : un seul écrivain, qui bloque tous les autres. Dans les deux cas, le verrou est relâché quand le garde est détruit.
