On reprend l'architecture en couches du cours : un trait `Mesures` (le **repository**), une version en mémoire pour les tests, et un **service** générique qui ne sait pas d'où viennent les données.

1. Implémente `Mesures` pour `EnMemoire` (une `BTreeMap` : capteur → valeurs) :
   - `existe(capteur)` : le capteur est-il connu ?
   - `valeurs_de(capteur)` : ses valeurs (liste vide s'il est inconnu) ;
   - `inserer(capteur, valeurs)` : ajoute les valeurs à la fin et renvoie leur nombre. Un capteur inconnu n'est **pas créé** : renvoie `0`.
2. Écris le service `stats_capteur<R: Mesures>(repo, capteur)` :
   - `None` si le capteur n'existe pas (le contrôleur en fera un 404) ;
   - sinon `Some(StatsCapteur { capteur, nb_mesures, moyenne })`, avec `moyenne` à `None` quand il n'y a aucune mesure.

| Appel | Résultat |
|---|---|
| `stats_capteur(&repo, 1)` avec `[21.0, 22.0, 20.0]` | `Some(StatsCapteur { capteur: 1, nb_mesures: 3, moyenne: Some(21.0) })` |
| `stats_capteur(&repo, 2)`, capteur connu sans mesure | `Some(StatsCapteur { capteur: 2, nb_mesures: 0, moyenne: None })` |
| `stats_capteur(&repo, 9)`, capteur inconnu | `None` |

> [!tip] Générique
> Les tests utilisent aussi un autre repository que le tien : ton service doit marcher avec **n'importe quel** `R: Mesures`.
